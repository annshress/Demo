import datetime
import os

from deux import strings
from deux.models import BackupPhoneAuth
from deux.serializers import QRCODEChallengeRequestSerializer
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import get_default_password_validators
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework import serializers
from rest_framework_jwt.serializers import JSONWebTokenSerializer
from rest_framework_jwt.settings import api_settings
from rest_framework.reverse import reverse as api_reverse
from main.notifications.email.mail import sendEmail as send_email
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes, force_text
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode

from accounts.token_generator import account_activation_token
from ..models import Employee, UserLogs


jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER
expire_delta = api_settings.JWT_REFRESH_EXPIRATION_DELTA

User = get_user_model()


class RestAuthJWTSerializer(serializers.Serializer):
    """
    Serializer for JWT authentication.
    """
    token = serializers.CharField()

    def to_representation(self, instance):
        result = super(RestAuthJWTSerializer, self).to_representation(instance)
        user = instance["user"]
        result = jwt_response_payload_handler(instance["token"], user)
        result.update(dict(email=user.email, id=user.id))
        if user.company:
            result.update(
                dict(company_id=user.company.id, company_slug=user.company.slug))

        return result


class MFAJWTTokenSerializer(JSONWebTokenSerializer):
    """
    class::MFAAuthTokenSerializer()

    This extends the ``AuthTokenSerializer`` to support multi-factor
    authentication.
    """

    #: Serializer field for MFA code field.
    mfa_code = serializers.CharField(required=False)

    #: Serializer field for Backup code.
    backup_code = serializers.CharField(required=False)

    #: Serializer field for Backup code.
    backup_phone = serializers.CharField(required=False)

    def validate(self, attrs):
        """
        Extends the AuthTokenSerializer validate method to implement multi
        factor authentication.

        If MFA is disabled, authentication requires just a username and
        password.

        If MFA is enabled, authentication requires a username, password,
        and either a MFA code or a backup code. If the request only provides
        the username and password, the server will generate an appropriate
        challenge and respond with `mfa_required = True`.

        Upon using a backup code to authenticate, MFA will be disabled.

        :param attrs: Dictionary of data inputted by the user.
        :raises serializers.ValidationError: If invalid MFA code or backup code
            are submitted. Also if both types of code are submitted
            simultaneously.
        """
        token_attrs = super(MFAJWTTokenSerializer, self).validate(attrs)
        attrs.update(token_attrs)
        # User must exist if super method didn't throw error.
        user = attrs["user"]
        assert user is not None, "User should exist after super call."

        mfa = getattr(user, "multi_factor_auth", None)

        if mfa and mfa.enabled:
            mfa_code = attrs.get("mfa_code")
            backup_code = attrs.get("backup_code")
            backup_phone = attrs.get("backup_phone")

            if mfa_code and backup_code:
                raise serializers.ValidationError(
                    force_text(strings.BOTH_CODES_ERROR))
            elif mfa_code and not backup_phone:
                if not mfa.verify_challenge_code(mfa_code):
                    raise serializers.ValidationError(
                        force_text(strings.INVALID_MFA_CODE_ERROR))
            elif backup_code:
                if not mfa.check_and_use_backup_code(backup_code):
                    raise serializers.ValidationError(
                        force_text(strings.INVALID_BACKUP_CODE_ERROR))
            elif backup_phone:
                _backup_phone = BackupPhoneAuth.objects.get(pk=backup_phone)
                if not mfa_code:
                    _backup_phone.generate_challenge()
                    attrs["mfa_required"] = True
                    attrs["mfa_type"] = mfa.challenge_type
                else:
                    if not _backup_phone.verify_challenge_code(mfa_code):
                        raise serializers.ValidationError(
                            force_text(strings.INVALID_MFA_CODE_ERROR))
            else:
                mfa.generate_challenge(mfa.challenge_type)
                attrs["mfa_required"] = True
                attrs["mfa_type"] = mfa.challenge_type

                attrs["backup_phones"] = []
                backup_phones = BackupPhoneAuth.objects.backup_phones_for_user(
                    user=user,
                    confirmed=True
                )
                for backup_phone in backup_phones:
                    attrs["backup_phones"].append({
                        'id': str(backup_phone.pk),
                        'phone_number': backup_phone.get_phone_number()
                    })

        return attrs


class UserPublicSerializer(serializers.ModelSerializer):
    uri = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'last_login',
            'uri',
            'avatar'
        ]

    def get_uri(self, obj):
        request = self.context.get('request')
        return api_reverse("api-user:detail", kwargs={"username": obj.username}, request=request)


class UserRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    token = serializers.SerializerMethodField(read_only=True)
    expires = serializers.SerializerMethodField(read_only=True)
    message = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'password2',
            'token',
            'expires',
            'message',

        ]
        extra_kwargs = {'password': {'write_only': True}}

    def get_message(self, obj):
        return "Thank you for registering. Please verify your email before continuing."

        
        #############
        # TRUNCATED #
        #############



    def validate_password(self, value):
        """
        Validate whether the password meets all validator requirements.
        """
        errors = []
        password_validators = get_default_password_validators()
        for validator in password_validators:
            try:
                validator.validate(value)
            except ValidationError as error:
                errors.append(error)
        if errors:
            raise serializers.ValidationError(errors)
        return value

    def validate(self, data):
        pw = data.get('password')
        pw2 = data.pop('password2', None)
        if pw != pw2:
            raise serializers.ValidationError("Passwords must match")
        return data

    def create(self, validated_data):

        user_obj = User(
            username=validated_data.get('username'),
            email=validated_data.get('email'))
        user_obj.set_password(validated_data.get('password'))
        useragent = self.context['request'].META['HTTP_USER_AGENT']
        logs = UserLogs.objects.create(user_agent=useragent)
        user_obj.is_active = False
        user_obj.save()
        user_obj.userlogs.add(logs)
        try:
            current_site = self.context["request"].META['HTTP_HOST']

            # todo add Current Frontend Site in settings.py
            context = {
                'user': user_obj,
                'domain': current_site,
                'uid': urlsafe_base64_encode(force_bytes(user_obj.pk)).decode(),
                'token': account_activation_token.make_token(user_obj),
            }
            response = send_email('registration', user_obj.email, 'Activate your Account', context)
        except ValidationError as error:
            print("unable to send Email for Registration")
            print(error)
        return user_obj


class UserCreateSerializer(UserRegisterSerializer):
    """
    Used in :: `roles.AppointmentUserModelSerializer`
    In cases when we want to directly create, rather than take user
    through a registration process.
    """

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'first_name',
            'last_name',
            'password',
            'contact',
            'avatar',
        ]
        extra_kwargs = {
            'password': {'write_only': True},
            'avatar': {'required': False}
        }

    def create(self, validated_data):
        user_obj = User(**validated_data)
        user_obj.set_password(validated_data.get('password'))
        
        #############
        # TRUNCATED #
        #############


class ChangePasswordSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["old_password", "password"]
        extra_kwargs = dict(
            password=dict(write_only=True)
        )

    def validate_old_password(self, value):
        self.user = self.context["request"].user
        if not self.user.check_password(value):
            raise serializers.ValidationError("Incorrect password")
        return value

    def validate_password(self, value):
        """
        Validate whether the password meets all validator requirements.
        """
        errors = []
        password_validators = get_default_password_validators()
        for validator in password_validators:
            try:
                validator.validate(value, self.user)
            except ValidationError as error:
                errors.append(error)
        if errors:
            raise serializers.ValidationError(errors)
        return value

    def save(self, **kwargs):
        self.user.set_password(self.validated_data["password"])
        
        #############
        # TRUNCATED #
        #############


class GetEmployeesListSerializer(serializers.ModelSerializer):
    # user = UserSerializer()
    services_count = serializers.SerializerMethodField()
    services = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    email_phone = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = ('id', 'full_name', 'company', 'avatar', 'email_phone',
                  'services_count', 'status', 'services')

    def get_services_count(self, obj):
        return obj.service_set.count()

    def get_services(self, obj):
        return list(obj.service_set.values_list("name", flat=1))

    def get_avatar(self, obj):
        if obj.user.avatar:
            return self.context["request"].build_absolute_uri(obj.user.avatar.url)
        return ""

    def get_status(self, obj):
        return obj.is_active

    def get_email_phone(self, obj):
        return (obj.user.email, obj.user.contact)


#################################################

class ProductionQRCODEChallengeRequestSerializer(QRCODEChallengeRequestSerializer):
    def to_representation(self, instance):
        result = super(ProductionQRCODEChallengeRequestSerializer, self).to_representation(instance)
        if 'RDS_HOSTNAME' in os.environ:
            result['qrcode_url'] = result['qrcode_url'].replace("http://", "https://")
        return result

#################################################
