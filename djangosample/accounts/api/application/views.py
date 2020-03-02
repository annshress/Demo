from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from accounts.api.application.serializers import ApplicationCategoryModelSerializer, ActivatedApplicationModelSerializer
from accounts.models import ApplicationCategory, ActivatedApplication
from libs.mixins import CompanyPermissionCheckMixin


class ApplicationCategoryViewSet(CompanyPermissionCheckMixin, viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ApplicationCategoryModelSerializer
    queryset = ApplicationCategory.objects.all().order_by("-priority")


class ActivatedApplicationViewSet(CompanyPermissionCheckMixin, viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ActivatedApplicationModelSerializer
    queryset = ActivatedApplication.objects.all()
    filterset_fields = ["featured", "categories"]
