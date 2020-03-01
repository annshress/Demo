from django.test import TestCase
from django.test.client import RequestFactory

from accounts.models import User
from accounts.tests.factory import CompanyFactory
from appointment.api.roles.serializers import AppointmentUserModelSerializer
from appointment.models import AppointmentUser


class TestAppointmentUserModelSerializer(TestCase):
    fixtures = ['roles.json']

    def setUp(self):
        self.company = CompanyFactory.create()
        self.data = dict(
            auth_user=dict(
                first_name='one',
                last_name='two',
                username='three',
                email='three@email.com',
                password='adminadmin',
                password2='adminadmin',
            ),
            role=1,
            status=True
        )
        self.rf = RequestFactory()
        self.request = self.rf.get('/')
        self.context = dict(
            company=self.company,
            request=self.request
        )

        self.serializer = AppointmentUserModelSerializer(data=self.data,
                                                         context=self.context)

    def test_001_valid_create(self):
        co = User.objects.count()
        ca = AppointmentUser.objects.count()
        self.assertTrue(self.serializer.is_valid(), self.serializer.errors)
        instance = self.serializer.save()
        self.assertEqual(co + 1, User.objects.count())
        self.assertEqual(ca + 1, AppointmentUser.objects.count())
        self.assertEqual(AppointmentUser.objects.last().auth_user, User.objects.last())
        return instance

    def test_002_valid_update(self):
        name = 'fourtyfour'
        instance = self.test_001_valid_create()
        data = dict(
            auth_user=dict(
                first_name=name,
                last_name='two',
                contact="9988554477"
            ),
            role=1,
            status=True
        )
        request = self.rf.patch('/')
        context = dict(
            company=self.company,
            request=request
        )
        self.serializer = AppointmentUserModelSerializer(data=data,
                                                         context=context,
                                                         instance=instance)
        self.assertTrue(self.serializer.is_valid(), self.serializer.errors)
        self.serializer.save()
        instance.refresh_from_db()
        self.assertEqual(instance.auth_user.first_name, name)

    def test_003_invalid_update(self):
        """can't update email of a role"""
        name = 'fourtyfour'
        email = 'new@verynew.com'
        instance = self.test_001_valid_create()
        data = dict(
            auth_user=dict(
                first_name=name,
                last_name='two',
                contact="9988554477",
                email=email
            ),
            status=True
        )
        request = self.rf.patch('/')
        context = dict(
            company=self.company,
            request=request
        )
        self.serializer = AppointmentUserModelSerializer(instance=instance,
                                                         data=data,
                                                         context=context,
                                                         partial=True)
        self.assertTrue(self.serializer.is_valid(), self.serializer.errors)
        self.serializer.save()
        instance.refresh_from_db()
        self.assertNotEqual(instance.auth_user.email, email)
        self.assertEqual(instance.auth_user.first_name, name)
