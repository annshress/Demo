from actstream.models import Action
from django.test.testcases import TestCase

from crm.models.feeds import CustomFeed
from accounts.tests.factory import CompanyFactory


class TestCustomFeedModel(TestCase):
    def setUp(self):
        self.company = CompanyFactory.create()
        self.actor = self.company.admin
        self.verb = "This is a posted feed."
        self.category = ""

    def test_001_create_feed(self):
        action = CustomFeed.create_feed(
            actor=self.actor,
            verb=self.verb,
            category=self.category,
            company=self.company
        )
        self.assertIsInstance(action, Action)
        self.assertIsNotNone(action.pk)
        self.assertIsNone(action.action_object_content_type)

    def test_002_create_category_feed(self):
        self.category = "appointment"
        action = CustomFeed.create_feed(
            actor=self.actor,
            verb=self.verb,
            category=self.category,
            company=self.company
        )
        self.assertIsInstance(action, Action)
        self.assertIsNotNone(action.pk)
        self.assertIsNotNone(action.action_object_content_type)

        self.category = "random123"
        action = CustomFeed.create_feed(
            actor=self.actor,
            verb=self.verb,
            category=self.category,
            company=self.company
        )
        self.assertIsInstance(action, Action)
        self.assertIsNotNone(action.pk)
        self.assertIsNone(action.action_object_content_type)
