from django.urls import path
from rest_framework import routers

from accounts.api.employee.views import EmployeeModelViewSet, PermissionGroupModelViewSet, PermissionChoicesAPIView

router = routers.DefaultRouter()
router.register('groups', PermissionGroupModelViewSet, base_name="group")
router.register('', EmployeeModelViewSet, base_name="employee")

urlpatterns = [
    path("permission_choices", PermissionChoicesAPIView.as_view(), name="perm-choices"),
              ] + router.urls
