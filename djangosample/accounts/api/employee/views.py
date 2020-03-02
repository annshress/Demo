from collections import defaultdict

from rest_framework import viewsets, views
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.api.employee.serializers import EmployeeModelSerializer, PermissionGroupModelSerializer
from accounts.api.permissions import IsCompanyAdmin
from accounts.constants import perm_queryset
from accounts.models import Employee, PermissionGroup, Company
from libs.mixins import CompanyPermissionCheckMixin, SetCompanySerializerMixin


class EmployeeModelViewSet(CompanyPermissionCheckMixin,
                           SetCompanySerializerMixin,
                           viewsets.ModelViewSet):
    serializer_class = EmployeeModelSerializer
    permission_classes = []
    search_fields = ["user__first_name", "user__last_name", "user__email"]
    filterset_fields = ["is_active"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update"]:
            return [IsCompanyAdmin()]
        return []

    def get_queryset(self):
        return Employee.objects.filter(company=self.company)


class PermissionGroupModelViewSet(CompanyPermissionCheckMixin,
                                  SetCompanySerializerMixin,
                                  viewsets.ModelViewSet):
    serializer_class = PermissionGroupModelSerializer
    permission_classes = [IsAuthenticated, IsCompanyAdmin]

    def get_queryset(self):
        return PermissionGroup.objects.filter(company=self.company)


class PermissionChoicesAPIView(CompanyPermissionCheckMixin,
                               views.APIView):
    def get(self, request, *args, **kwargs):
        data = defaultdict(list)
        for perm in perm_queryset:
            data[perm["content_type__app_label"]].append({"value": perm["id"], "label": perm["name"]})
        return Response(data=data)
