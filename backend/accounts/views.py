"""Session auth for the browser app: csrf, register, login, logout, me."""

from django.contrib.auth import authenticate, get_user_model, login, logout
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView


def me(request):
    return {"username": request.user.username if request.user.is_authenticated else None}


@method_decorator(ensure_csrf_cookie, name="dispatch")
class CsrfView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(me(request))


class MeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(me(request))


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = str(request.data.get("username", "")).strip()
        password = str(request.data.get("password", ""))
        user_model = get_user_model()
        if not username:
            return Response({"detail": "Choose a username."}, status=status.HTTP_400_BAD_REQUEST)
        if user_model.objects.filter(username__iexact=username).exists():
            return Response({"detail": "That username is taken."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_password(password, user_model(username=username))
        except ValidationError as e:
            return Response({"detail": " ".join(e.messages)}, status=status.HTTP_400_BAD_REQUEST)
        user = user_model.objects.create_user(username=username, password=password)
        login(request, user)
        return Response(me(request), status=status.HTTP_201_CREATED)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(request, username=str(request.data.get("username", "")).strip(), password=str(request.data.get("password", "")))
        if user is None:
            return Response({"detail": "Wrong username or password."}, status=status.HTTP_400_BAD_REQUEST)
        login(request, user)
        return Response(me(request))


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"username": None})
