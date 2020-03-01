from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from appointment.mixins import AppointmentAppCheckMixin
from libs.mixins import CompanyPermissionCheckMixin, SetCompanySerializerMixin
from appointment.api.roles.serializers import AppointmentUserModelSerializer, AppointmentUserMinimalModelSerializer, \
    AppointmentPermissionSerializer
from libs.serializers import EmptySerializer
from appointment.apps import AppointmentConfig
from appointment.models.roles import AppointmentUser
from appointment.permissions import RoleMenuPermission, AlterUserPermission


class AppointmentUserModelViewSet(CompanyPermissionCheckMixin,
                                  AppointmentAppCheckMixin,
                                  SetCompanySerializerMixin,
                                  viewsets.ModelViewSet):
    queryset = AppointmentUser.objects.all()
    serializer_class = AppointmentUserModelSerializer
    permission_classes = [IsAuthenticated, RoleMenuPermission]
    search_fields = ['auth_user__first_name', 'auth_user__last_name']
    filterset_fields = ['status']
    ordering_fields = ['role', 'auth_user__email', 'auth_user__last_login', 'username', 'status']

    def get_queryset(self):
        return super(AppointmentUserModelViewSet, self).get_queryset(). \
            filter(company=self.company)

    def perform_create(self, serializer):
        # create the appointment user
        super(AppointmentUserModelViewSet, self).perform_create(serializer)
        # but once the ap-user is created provide her the permissions of the assigned roles
        # which will be handled at the serializer level

    def destroy(self, request, *args, **kwargs):
        if self.get_object().auth_user == self.company.admin:
            return Response("Unable to delete", status=400)  # if is company admin
        return super(AppointmentUserModelViewSet, self).destroy(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action in ['list']:
            return AppointmentUserMinimalModelSerializer
        if self.action in ['reset_permissions']:
            return EmptySerializer
        return super(AppointmentUserModelViewSet, self).get_serializer_class()

    @action(methods=['POST'], detail=True)
    def reset_permissions(self, request, company=None, pk=None):
        obj = self.get_object()
        obj.reset_permissions()
        return Response(data=dict(message="Permissions Reset"), status=200)


class AppointmentUserPermissionsView(CompanyPermissionCheckMixin,
                                     AppointmentAppCheckMixin,
                                     SetCompanySerializerMixin,
                                     RetrieveUpdateAPIView):
    serializer_class = AppointmentPermissionSerializer
    permission_classes = [AlterUserPermission]

    def get_user(self, company, pk):
        user = AppointmentUser.objects.get(
            company=company,
            pk=pk
        ).auth_user
        return user

    def retrieve(self, request, company=None, pk=None):
        user = self.get_user(company=company, pk=pk)

        serializer = self.serializer_class()
        # get the boolean fields in serializer
        permissions = serializer.fields.keys()
        permissions = Permission.objects.filter(codename__in=permissions)
        data = {
            p.codename: user.has_perm(AppointmentConfig.name + '.' + p.codename)
            for p in permissions
        }
        s = self.serializer_class(data=data)
        s.is_valid()
        return Response(data=s.data, status=200)

    def update(self, request, *args, **kwargs):
        company = kwargs.pop('company')
        pk = kwargs.pop('pk')
        user = self.get_user(company=company, pk=pk)

        s = self.serializer_class(data=request.data)
        cts = ContentType.objects.filter(app_label='appointment')
        if s.is_valid():
            permissions = map(lambda x: Permission.objects.filter(content_type__in=cts).get(codename=x),
                              filter(lambda x: s.data[x],
                                     s.data.keys()
                                     )
                              )
            # alter the appointment user's permissions
            user.user_permissions.set(list(permissions))
            return Response("Permissions Updated", status=200)
        else:
            return Response(data=s.errors, status=400)
