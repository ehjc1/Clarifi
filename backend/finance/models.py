"""Mirror of the frontend data shape (frontend/src/lib/types.ts), one owner per row."""

from decimal import Decimal

from django.conf import settings
from django.db import models

BUCKETS = ["income", "fixed", "general", "investments", "savings", "mortgage"]


class Owned(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Preferences(models.Model):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="preferences")
    current = models.CharField(max_length=7, blank=True)  # statement key YYYY-MM
    budget = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))  # general spend per cycle, 0 = unset
    card = models.CharField(max_length=40, blank=True, default="")  # chosen card, "" = all


class Statement(Owned):
    key = models.CharField(max_length=7)  # YYYY-MM of the last line; re-import of the same month replaces it
    label = models.CharField(max_length=20)
    date_from = models.DateField()
    date_to = models.DateField()
    synthetic = models.BooleanField(default=False)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["owner", "key"], name="unique_statement_per_owner")]
        ordering = ["key"]

    def __str__(self) -> str:
        return f"{self.owner} {self.key}"


class Line(models.Model):
    statement = models.ForeignKey(Statement, on_delete=models.CASCADE, related_name="lines")
    cid = models.CharField(max_length=40)  # frontend id, kept so rules and triage state survive a round trip
    date = models.DateField()
    details = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=12, decimal_places=2)  # positive = charge, negative = payment/refund
    source = models.CharField(max_length=8, default="anz")  # which bank: anz | amex
    card = models.CharField(max_length=40, blank=True, default="")  # masked card number or card member, as exported

    class Meta:
        ordering = ["id"]


class Rule(Owned):
    cid = models.CharField(max_length=40)
    position = models.PositiveIntegerField(default=0)  # first match wins, so order is data
    name = models.CharField(max_length=120)
    text = models.CharField(max_length=160, blank=True)
    min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    share = models.DecimalField(max_digits=5, decimal_places=4)  # 0..1 fraction that is mine
    bucket = models.CharField(max_length=16, choices=[(b, b) for b in BUCKETS])

    class Meta:
        constraints = [models.UniqueConstraint(fields=["owner", "cid"], name="unique_rule_per_owner")]
        ordering = ["position", "id"]

    def __str__(self) -> str:
        return self.name


class Income(Owned):
    cid = models.CharField(max_length=40)
    name = models.CharField(max_length=120)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    monthly = models.BooleanField(default=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["owner", "cid"], name="unique_income_per_owner")]
        ordering = ["id"]

    def __str__(self) -> str:
        return self.name
