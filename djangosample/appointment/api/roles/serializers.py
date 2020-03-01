from django.contrib.auth.models import Permission
from django.db import transaction
from django.urls import reverse
from rest_framework import serializers

from accounts.api.serializers import UserPublicSerializer, UserCreateSerializer
from accounts.models import Company
from appointment.models import AppointmentUser
from appointment.constants import ROLES, ADMINISTRATOR_PERMISSIONS, REGULAR_PERMISSIONS


class CommonSerializerMethodsMixin:
    def get_set_permissions(self, obj):
        if obj.auth_user == self.context['company'].admin:
            return ""
        return self.context['request'].build_absolute_uri(
            reverse('appointment:roles-permissions',
                    kwargs=dict(company=self.context['company'].id,
                                pk=obj.pk)
                    )
        )


class AppointmentUserMinimalModelSerializer(CommonSerializerMethodsMixin, serializers.ModelSerializer):
    role = serializers.StringRelatedField()
    auth_user = UserPublicSerializer()
    set_permissions = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentUser
        fields = ["role", "auth_user", "status", "url", "set_permissions"]

    def get_url(self, obj):
        return obj.get_absolute_url(self.context['request'])

    def save(self, **kwargs):
        raise NotImplementedError("Can't call save on `AppointmentUserMinimal` serializer")


class AppointmentUserModelSerializer(CommonSerializerMethodsMixin, serializers.ModelSerializer):
    auth_user = UserCreateSerializer()
    set_permissions = serializers.SerializerMethodField()
    reset_permissions = serializers.SerializerMethodField()

    class Meta:
        model = AppointmentUser
        fields = ["role", "status", "auth_user", "set_permissions", "reset_permissions"]

    def get_reset_permissions(self, obj):
        return self.context['request'].build_absolute_uri(
            reverse('appointment:roles-reset-permissions',
                    kwargs=dict(company=self.context['company'].id,
                                pk=obj.pk)
                    )
        )

    def to_representation(self, instance):
        data = super(AppointmentUserModelSerializer, self).to_representation(instance)
        data['role'] = str(instance.role)
        return data

    def create(self, validated_data):
        with transaction.atomic():
            auth_user = validated_data.get('auth_user')
            u = UserCreateSerializer().create(validated_data=auth_user)
            validated_data.update(
                dict(
                    auth_user=u,
                    company=self.context['company']
                )
            )
            appointment_user = AppointmentUser(**validated_data)
            appointment_user.save()
            # now provide him the permissions based on his role,
            if validated_data['role'] == ROLES.administrator:
                permissions = Permission.objects.filter(codename__in=ADMINISTRATOR_PERMISSIONS)
            else:
                permissions = Permission.objects.filter(codename__in=REGULAR_PERMISSIONS)
            u.user_permissions.set(list(permissions))

        return appointment_user

    def update(self, instance, validated_data):
        with transaction.atomic():
            auth_user = validated_data.pop('auth_user', {})
            UserCreateSerializer(context=self.context).update(validated_data=auth_user,
                                                              instance=instance.auth_user)
            AppointmentUser.objects.filter(id=instance.id).update(**validated_data)

        return instance


class DynamicBooleanSerializer(serializers.Serializer):
    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        if fields is not None:
            allowed = set(fields)
            for field_name in allowed:
                self.fields[field_name] = serializers.BooleanField()

        # Instantiate the superclass normally
        super(DynamicBooleanSerializer, self).__init__(*args, **kwargs)


class AppointmentPermissionSerializer(DynamicBooleanSerializer):
    def __init__(self, *args, **kwargs):
        kwargs.update(dict(
            fields=ADMINISTRATOR_PERMISSIONS
        ))
        super(AppointmentPermissionSerializer, self).__init__(*args, **kwargs)
