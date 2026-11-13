from rest_framework import serializers

from .models import BUCKETS, Income, Line, Rule, Statement


class LineSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="cid", max_length=40)
    source = serializers.ChoiceField(choices=["anz", "amex"], required=False, default="anz")
    card = serializers.CharField(max_length=40, required=False, allow_blank=True, default="")

    class Meta:
        model = Line
        fields = ["id", "date", "details", "amount", "source", "card"]


class StatementSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="key", max_length=7)
    txns = LineSerializer(many=True, source="lines")

    class Meta:
        model = Statement
        fields = ["id", "label", "from", "to", "txns", "synthetic"]
        extra_kwargs = {"from": {"source": "date_from"}, "to": {"source": "date_to"}}


class RuleSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="cid", max_length=40, required=False)
    text = serializers.CharField(max_length=160, required=False, allow_blank=True, allow_null=True)
    min = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    max = serializers.DecimalField(max_digits=12, decimal_places=2, required=False, allow_null=True)
    share = serializers.DecimalField(max_digits=5, decimal_places=4, min_value=0, max_value=1)
    bucket = serializers.ChoiceField(choices=BUCKETS)

    class Meta:
        model = Rule
        fields = ["id", "name", "text", "min", "max", "share", "bucket"]

    def validate_text(self, value):
        return value or ""

    def to_representation(self, instance):
        # The frontend treats a missing condition as absent, not empty/null.
        out = super().to_representation(instance)
        return {k: v for k, v in out.items() if v not in ("", None)}


class IncomeSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="cid", max_length=40, required=False)

    class Meta:
        model = Income
        fields = ["id", "name", "amount", "monthly"]


class SnapshotSerializer(serializers.Serializer):
    """The whole per-user data shape: what the browser keeps in localStorage."""

    statements = StatementSerializer(many=True)
    current = serializers.CharField(max_length=7, allow_blank=True)
    rules = RuleSerializer(many=True)
    incomes = IncomeSerializer(many=True)
    budget = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=0)
    card = serializers.CharField(max_length=40, required=False, allow_blank=True, default="")
