from rest_framework import generics, permissions, pagination

from .serializers import WidgetSerializer, ActivatedWidgetSerializer
from accounts.models import Widget, ActivatedWidget
from libs.mixins import CompanyPermissionCheckMixin, SetCompanySerializerMixin
from accounts import AUTHORIZED_APPS_CHOICES


class WidgetsList(generics.ListAPIView, SetCompanySerializerMixin):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Widget.objects.filter()
    serializer_class = WidgetSerializer

    def get_serializer_context(self):
        return {'request': self.request, 'company': self.kwargs.get('company')}


class AppWidgetsList(generics.ListAPIView, SetCompanySerializerMixin):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = Widget.objects.filter()
    serializer_class = WidgetSerializer

    def get_serializer_context(self):
        return {'request': self.request, 'company': self.kwargs.get('company')}

    def get_queryset(self):
        if self.kwargs.get('app') == "business":
        
        #############
        # TRUNCATED #
        #############


    def get_queryset(self):
        if self.kwargs.get('app') == "global":
            return ActivatedWidget.objects.filter(widget__application__isnull=True,
                                                  company=self.kwargs.get('company'))
        else:
            index = AUTHORIZED_APPS_CHOICES.index(self.kwargs.get('app'))
            return ActivatedWidget.objects.filter(widget__application=index + 1, company=self.kwargs.get('company'),
                                                  is_global=False)


class AddActivatedWidgets(generics.CreateAPIView, SetCompanySerializerMixin):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ActivatedWidget.objects.filter()
    serializer_class = ActivatedWidgetSerializer


class DeleteActivatedWidgets(generics.DestroyAPIView, SetCompanySerializerMixin):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = ActivatedWidget.objects.filter()
    serializer_class = ActivatedWidgetSerializer
