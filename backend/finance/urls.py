from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import IncomeViewSet, RuleViewSet, SnapshotView, StatementViewSet

router = DefaultRouter()
router.register("statements", StatementViewSet, basename="statement")
router.register("rules", RuleViewSet, basename="rule")
router.register("incomes", IncomeViewSet, basename="income")

urlpatterns = [
    path("snapshot/", SnapshotView.as_view(), name="snapshot"),
    path("", include(router.urls)),
]
