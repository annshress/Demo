from actstream.models import Action
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from rest_framework.test import APITestCase

from accounts.tests.factory import CompanyFactory, EmployeeFactory, UserFactory, FeedCommentFactory


class TestPostFeed(APITestCase):
    def setUp(self):
        self.company = CompanyFactory.create(verified=True)
        self.employee = EmployeeFactory.create(company=self.company)
        self.URL = "/feed/{company_id}/".format(company_id=self.company.id)
        self.data = dict(message="This is a feed content.", category="appointment")

    def test_000_check_create_new_feed_permission(self):
        self.random_user = UserFactory.create()
        self.client.force_login(self.random_user)
        response = self.client.post(self.URL, data=self.data)
        self.assertEqual(response.status_code, 403)

    def test_001_create_new_feed_by_admin(self):
        user = self.company.admin
        self.client.force_login(user)
        response = self.client.post(self.URL, data=self.data)
        print(response)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["verb"], self.data["message"])
        self.assertEqual(response.data["actor"], str(user))

    def test_002_create_new_fee_by_employee(self):
        user = self.employee.user
        self.client.force_login(user)
        response = self.client.post(self.URL, data=self.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["verb"], self.data["message"])
        self.assertEqual(response.data["actor"], str(user))


class TestPostFeedComment(APITestCase):
    def setUp(self):
        self.company = CompanyFactory.create()
        self.admin = self.company.admin
        self.employee = EmployeeFactory.create(company=self.company)
        self.URL = "/feed/{company}/comment/".format(company=self.company.pk)
        self.detail_url = "/feed/{company}/comment/{pk}/"

        self.employee_action = Action.objects.create(
            actor_content_type=ContentType.objects.get_for_model(self.employee),
            actor_object_id=self.employee.pk,
            verb="Some verb here",
            timestamp=timezone.now(),
            target_content_type=ContentType.objects.get_for_model(self.company),
            target_object_id=self.company.pk
        )
        self.data = {"message": "This will be the comment",
                     "action": self.employee_action.id}
        self.feed_comment = FeedCommentFactory.create(company=self.company,
                                                      action=self.employee_action,
                                                      owner=self.employee.user)

    def test_001_create_new_comment(self):
        self.client.force_login(self.employee.user)
        response = self.client.post(self.URL, data=self.data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["message"], self.data["message"])

    def test_002_update_owners_comment(self):
        self.client.force_login(self.employee.user)
        data = {"message": "entirely updated message."}
        url = self.detail_url.format(company=self.company.pk,
                                     pk=self.feed_comment.pk)
        response = self.client.patch(url, data=data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["message"], data["message"])

    def test_003_update_others_comment_fails(self):
        different_employee = EmployeeFactory.create(company=self.company)
        self.client.force_login(different_employee.user)
        data = {"message": "impossible to update"}
        url = self.detail_url.format(company=self.company.pk,
                                     pk=self.feed_comment.pk)
        response = self.client.patch(url, data=data)
        self.assertEqual(response.status_code, 403)

    def test_004_delete_owners_comment(self):
        self.client.force_login(self.employee.user)
        url = self.detail_url.format(company=self.company.pk,
                                     pk=self.feed_comment.pk)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 204)

    def test_005_delete_others_comment_fails(self):
        different_employee = EmployeeFactory.create(company=self.company)
        self.client.force_login(different_employee.user)
        url = self.detail_url.format(company=self.company.pk,
                                     pk=self.feed_comment.pk)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 403)

    def test_006_retrieve_feeds_with_comments(self):
        feed_url = "/crm/{}/feed/".format(self.company.pk)
        response = self.client.get(feed_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertIn("comments", response.data[0])
        self.assertIn("comments_count", response.data[0])
        self.assertGreaterEqual(len(response.data[0]["comments"]), 1)
        self.assertLessEqual(len(response.data[0]["comments"]), 3)

    def test_007_create_comment_on_different_company_action(self):
        unauthorized_employee = EmployeeFactory.create()
        self.client.force_login(unauthorized_employee.user)
        data = {"message": "impossible comment", "action": self.employee_action.pk}
        response = self.client.post(self.URL, data=data)
        self.assertEqual(response.status_code, 403)
