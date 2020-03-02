from django.test import TestCase

from accounts.models import PermissionGroup
from accounts.tests.factory import CompanyFactory, EmployeeFactory


class TestCompanyPostSaveSignal(TestCase):
    def setUp(self):
        self.company = CompanyFactory.build()
        self.assertIsNone(self.company.pk)
        self.company.admin.save()
        self.owner = self.company.admin

    def test_001_owner_gets_permissions_on_save(self):
        self.assertEqual(self.owner.user_permissions.count(), 0)
        self.company.admin = self.owner
        self.company.save()
        self.assertNotEqual(self.owner.user_permissions.count(), 0)

    def test_002_company_gets_unverified_then_employee_active_flag_switched_off(self):
        # verify a company
        self.test_001_owner_gets_permissions_on_save()

        # add an employee
        employee = EmployeeFactory.create(company=self.company,
                                          is_active=True)

        # un-verify company
        self.company.verified = False
        self.company.save()
        employee.refresh_from_db()
        # check employees active status
        self.assertFalse(employee.is_active)

    def test_003_unverified_company_creates_default_perm_groups(self):
        self.company.verified = False
        self.company.admin = self.owner
        self.company.save()
        self.assertFalse(self.company.perm_groups_created)
        self.assertEqual(self.company.permissiongroup_set.count(), 0)

        self.company.verified = True
        self.company.save()
        self.assertTrue(self.company.perm_groups_created)
        self.assertGreater(self.company.permissiongroup_set.count(), 0)

        pg = self.company.permissiongroup_set.first()
        self.assertGreater(pg.permissions.count(), 0)
