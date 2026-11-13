from decimal import Decimal

from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from .models import Rule

SNAPSHOT = {
    "statements": [
        {
            "id": "2026-10",
            "label": "Oct 2026",
            "from": "2026-10-01",
            "to": "2026-10-06",
            "synthetic": False,
            "txns": [
                {"id": "t1", "date": "2026-10-03", "details": "PAK N SAVE ALBANY", "amount": 86.4, "source": "anz", "card": "4321-****-1234"},
                {"id": "t2", "date": "2026-10-06", "details": "PAYMENT RECEIVED THANK YOU", "amount": -1500, "source": "amex", "card": ""},
            ],
        }
    ],
    "current": "2026-10",
    "rules": [
        {"id": "r1", "name": "Big shop is partner's", "text": "pak n save", "min": 50, "share": 0, "bucket": "general"},
        {"id": "r2", "name": "Power split", "text": "contact energy", "share": 0.5, "bucket": "fixed"},
    ],
    "incomes": [{"id": "i1", "name": "Salary", "amount": 5200, "monthly": True}],
    "budget": 900,
    "card": "",
}


class SnapshotTests(APITestCase):
    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(username="eugene", password="testpass123")
        self.other = user_model.objects.create_user(username="other", password="testpass123")

    def test_requires_login(self):
        self.assertEqual(self.client.get("/api/finance/snapshot/").status_code, 403)

    def test_round_trip_keeps_shape_ids_order_and_owner(self):
        self.client.force_login(self.user)
        put = self.client.put("/api/finance/snapshot/", SNAPSHOT, format="json")
        self.assertEqual(put.status_code, 200, put.data)
        got = self.client.get("/api/finance/snapshot/").json()
        self.assertEqual(got, SNAPSHOT)  # numbers stay numbers, absent conditions stay absent
        self.assertEqual([r.position for r in Rule.objects.filter(owner=self.user)], [0, 1])

        self.client.force_login(self.other)
        self.assertEqual(self.client.get("/api/finance/snapshot/").json()["statements"], [])
        self.assertEqual(self.client.get("/api/finance/rules/").json(), [])

    def test_put_replaces_not_appends(self):
        self.client.force_login(self.user)
        self.client.put("/api/finance/snapshot/", SNAPSHOT, format="json")
        smaller = {**SNAPSHOT, "statements": [], "current": "", "rules": [], "budget": 0}
        got = self.client.put("/api/finance/snapshot/", smaller, format="json").json()
        self.assertEqual(got, smaller)
        self.assertEqual(Rule.objects.filter(owner=self.user).count(), 0)

    def test_rejects_bad_share_and_bucket(self):
        self.client.force_login(self.user)
        bad = {**SNAPSHOT, "rules": [{"name": "x", "text": "x", "share": 1.5, "bucket": "fun"}]}
        self.assertEqual(self.client.put("/api/finance/snapshot/", bad, format="json").status_code, 400)

    def test_rule_viewset_creates_with_owner_and_position(self):
        self.client.force_login(self.user)
        r = self.client.post("/api/finance/rules/", {"name": "n", "text": "spark", "share": 0, "bucket": "fixed"}, format="json")
        self.assertEqual(r.status_code, 201, r.data)
        rule = Rule.objects.get(cid=r.json()["id"])
        self.assertEqual((rule.owner, rule.position, rule.share), (self.user, 0, Decimal("0")))
