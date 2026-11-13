import secrets

from django.db import transaction
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Income, Line, Preferences, Rule, Statement
from .serializers import IncomeSerializer, RuleSerializer, SnapshotSerializer, StatementSerializer


def new_cid():
    return secrets.token_hex(4)


class OwnedViewSet(viewsets.ModelViewSet):
    lookup_field = "cid"

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, cid=serializer.validated_data.get("cid") or new_cid())


class StatementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Statement.objects.prefetch_related("lines")
    serializer_class = StatementSerializer
    lookup_field = "key"

    def get_queryset(self):
        return self.queryset.filter(owner=self.request.user)


class RuleViewSet(OwnedViewSet):
    queryset = Rule.objects.all()
    serializer_class = RuleSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, cid=serializer.validated_data.get("cid") or new_cid(), position=self.get_queryset().count())


class IncomeViewSet(OwnedViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer


def snapshot(user):
    prefs, _ = Preferences.objects.get_or_create(owner=user)
    return {
        "statements": StatementSerializer(Statement.objects.filter(owner=user).prefetch_related("lines"), many=True).data,
        "current": prefs.current,
        "rules": RuleSerializer(Rule.objects.filter(owner=user), many=True).data,
        "incomes": IncomeSerializer(Income.objects.filter(owner=user), many=True).data,
        "budget": prefs.budget,
        "card": prefs.card,
    }


@transaction.atomic
def replace(user, d):
    """Replace everything the user owns with the given snapshot; rules keep their order."""
    Statement.objects.filter(owner=user).delete()
    Rule.objects.filter(owner=user).delete()
    Income.objects.filter(owner=user).delete()
    for s in d["statements"]:
        st = Statement.objects.create(owner=user, key=s["key"], label=s["label"], date_from=s["date_from"], date_to=s["date_to"], synthetic=s.get("synthetic", False))
        Line.objects.bulk_create(Line(statement=st, **ln) for ln in s["lines"])
    Rule.objects.bulk_create(Rule(owner=user, position=i, **{"cid": new_cid(), **r}) for i, r in enumerate(d["rules"]))
    Income.objects.bulk_create(Income(owner=user, **{"cid": new_cid(), **inc}) for inc in d["incomes"])
    Preferences.objects.update_or_create(owner=user, defaults={"current": d["current"], "budget": d["budget"], "card": d.get("card", "")})


class SnapshotView(APIView):
    def get(self, request):
        return Response(snapshot(request.user))

    def put(self, request):
        s = SnapshotSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        replace(request.user, s.validated_data)
        return Response(snapshot(request.user))
