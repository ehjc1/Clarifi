from rest_framework.test import APITestCase


class AuthTests(APITestCase):
    def test_register_login_logout(self):
        self.assertIsNone(self.client.get("/api/auth/me/").json()["username"])
        r = self.client.post("/api/auth/register/", {"username": "eugene", "password": "correct-horse-battery"}, format="json")
        self.assertEqual(r.status_code, 201, r.data)
        self.assertEqual(self.client.get("/api/auth/me/").json()["username"], "eugene")
        self.assertEqual(self.client.post("/api/auth/logout/", format="json").status_code, 200)
        self.assertIsNone(self.client.get("/api/auth/me/").json()["username"])
        self.assertEqual(self.client.post("/api/auth/login/", {"username": "eugene", "password": "nope"}, format="json").status_code, 400)
        self.assertEqual(self.client.post("/api/auth/login/", {"username": "eugene", "password": "correct-horse-battery"}, format="json").status_code, 200)

    def test_register_rejects_weak_or_taken(self):
        self.assertEqual(self.client.post("/api/auth/register/", {"username": "a", "password": "123"}, format="json").status_code, 400)
        self.client.post("/api/auth/register/", {"username": "eugene", "password": "correct-horse-battery"}, format="json")
        self.client.post("/api/auth/logout/", format="json")
        self.assertEqual(self.client.post("/api/auth/register/", {"username": "Eugene", "password": "correct-horse-battery"}, format="json").status_code, 400)
