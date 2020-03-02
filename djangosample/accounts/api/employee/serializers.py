from collections import OrderedDict, defaultdict
import six

from django.conf import settings
from django.contrib.auth.models import Permission
from rest_framework import serializers
from rest_framework.fields import to_choices_dict, flatten_choices_dict

from accounts.api.serializers import UserPublicSerializer
from accounts.constants import PERM_CHOICES
from accounts.models import Employee, User, PermissionGroup
from libs.serializers import ParameterisedHyperlinkedIdentityField

__author__ = "@n!sh $hre$th@"


# class DynamicChoiceField(serializers.MultipleChoiceField):
#     """
#     Provides set_choices method used to update all choice related attributes of the field
#     """
#     def set_choices(self, choices):
#         self.grouped_choices = to_choices_dict(choices)
#         self._choices = flatten_choices_dict(self.grouped_choices)
#
#         self.choice_strings_to_values = {
#             six.text_type(key): key for key in self.choices
#         }


class EmployeeModelSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(write_only=True, allow_blank=True)
    url = ParameterisedHyperlinkedIdentityField("employee:employee-detail",
                                                lookup_fields=(
                                                    ("company.pk", "company"),
                                                    ("pk", "pk"),
                                                ))
    groups = serializers.MultipleChoiceField(choices=[],
                                             write_only=True,
                                             required=False)

    class Meta:
        model = Employee
        fields = ["id", "email", "url", "groups", "is_active", "is_online", "last_seen_online"]

    def __init__(self, *args, **kwargs):
        super(EmployeeModelSerializer, self).__init__(*args, **kwargs)
        if self.context.get('company'):
            self.fields.fields["groups"].choices = [
                (each.id, each.name) for each in self.context['company'].permissiongroup_set.all()
            ]

    def validate_email(self, value):
        if self.instance:
            return value
        try:
            self.user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist.", code="404")
        if Employee.objects.filter(user=self.user).exists():
            raise serializers.ValidationError("User account already associated.", code="unique")
        return value

    def to_representation(self, instance):
        result = super(EmployeeModelSerializer, self).to_representation(instance)
        user_serializer = UserPublicSerializer(instance=instance.user, context=self.context)
        # user_serializer.is_valid()
        result['user'] = user_serializer.data
        if self.context['view'].action == "retrieve":
            result['groups'] = list(instance.groups.values_list("id", flat=True))
        return result

    def create(self, validated_data):
        validated_data.pop("email", None)
        validated_data.update(dict(
            user=self.user, company=self.context['company']
        ))
        return super(EmployeeModelSerializer, self).create(validated_data=validated_data)


class PermissionGroupModelSerializer(serializers.ModelSerializer):
    permissions_count = serializers.SerializerMethodField()
    permissions = serializers.MultipleChoiceField(choices=PERM_CHOICES,
                                                  write_only=True)
    # front lacks knowledge the association between app-name and permission-id
    permissions_for_form = serializers.SerializerMethodField()

    class Meta:
        model = PermissionGroup
        fields = ["id", "name", "permissions", "permissions_count", "permissions_for_form", "employee_set"]
    
    def get_permissions_count(self, obj):
        return obj.permissions.count()
   
    def get_permissions_for_form(self, obj):
        result = defaultdict(list)
        for each in obj.permissions.all():
            result[each.content_type.app_label].append(dict(label=each.name, value=each.id))
        return result

    def get_field_names(self, declared_fields, info):
        if getattr(self.context, "view", None) and self.context["view"].action == "list":
            return ["id", "name", "permissions_count"]
        return super(PermissionGroupModelSerializer, self).get_field_names(declared_fields, info)

    def validate_employee_set(self, value):
        #############
        # TRUNCATED #
        #############
            result["permissions"] = list(instance.permissions.values_list("id", flat=True))
        return result

    def save(self, **kwargs):
        kwargs.update(company=self.context["company"])
        super(PermissionGroupModelSerializer, self).save(**kwargs)
