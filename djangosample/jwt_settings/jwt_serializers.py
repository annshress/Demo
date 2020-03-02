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
from main.notifications.email.mail import sendEmail
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


#################################################

class ProductionQRCODEChallengeRequestSerializer(QRCODEChallengeRequestSerializer):
    def to_representation(self, instance):
        result = super(ProductionQRCODEChallengeRequestSerializer, self).to_representation(instance)
        if 'RDS_HOSTNAME' in os.environ:
            result['qrcode_url'] = result['qrcode_url'].replace("http://", "https://")
        return result

#################################################
