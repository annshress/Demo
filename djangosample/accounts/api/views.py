from datetime import datetime

from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.microsoft.views import MicrosoftGraphOAuth2Adapter
from deux.views import QRCODEChallengeRequestDetail
from django.contrib.auth import get_user_model, login
from django.contrib.auth.signals import user_logged_in
from django.db.models import Q
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode
from rest_auth.registration.views import SocialLoginView
from rest_framework import generics
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.views import ObtainJSONWebToken

from accounts.api.serializers import MFAJWTTokenSerializer, ProductionQRCODEChallengeRequestSerializer
from accounts.token_generator import account_activation_token
from libs.utils import get_identity
from .permissions import AnonPermissionOnly
from .serializers import UserRegisterSerializer, GetEmployeesListSerializer, ChangePasswordSerializer
from ..models import Employee, Company
from main.notifications.email.mail import sendEmail

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER

User = get_user_model()


class AuthAPIView(APIView):
    permission_classes = [AnonPermissionOnly]

    def post(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return Response({'detail': 'You are already authenticated'}, status=400)
        data = request.data
        username = data.get('username')  # username or email address
        password = data.get('password')
        qs = User.objects.filter(
            Q(username__iexact=username) |
            Q(email__iexact=username)
        ).filter(is_active=True).distinct()  # return active users only
        if qs.count() == 1:
            user_obj = qs.first()
            if user_obj.check_password(password):
                user = user_obj
                payload = jwt_payload_handler(user)
                token = jwt_encode_handler(payload)
                response = jwt_response_payload_handler(token, user, request=request)
                if user.company:
                    response.update(
                        dict(company_id=user.company.id, company_slug=user.company.slug, company_name=user.company.name))
                # set the session
                login(request, user, backend=None)
                return Response(response)
        return Response({"detail": "Invalid credentials"}, status=401)


class ActivateAccount(APIView):
    permission_classes = [AnonPermissionOnly]

    def get(self, request, uidb64, token):
        try:
            uid = force_bytes(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except(TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None
        if user is not None and account_activation_token.check_token(user, token):
            user.is_active = True
            user.save()
            return Response({'message': 'Your account has been activated successfully'}, status=200)
        else:
            return Response("Activation link is invalid!", status=400)


class CustomObtainJSONWebToken(ObtainJSONWebToken):
    serializer_class = MFAJWTTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.object.get('user')
            token = serializer.object.get('token')
            data = serializer.validated_data
            # customization here: check for 2 factor authentication
            if "mfa_required" in data and data["mfa_required"]:
                response = {
                    "mfa_required": True,
                    "mfa_type": serializer.validated_data["mfa_type"]
                }
                if serializer.validated_data.get("backup_phones", None):
                    response["backup_phones"] = serializer.validated_data["backup_phones"]

                return Response(response)
            response_data = jwt_response_payload_handler(token, user, request)
            # customization here: adding company information into response_data
        
        #############
        # TRUNCATED #
        #############


                              api_settings.JWT_EXPIRATION_DELTA)
                response.set_cookie(api_settings.JWT_AUTH_COOKIE,
                                    token,
                                    expires=expiration,
                                    httponly=True)
            user_logged_in.send(sender=user.__class__, request=request, user=user)
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [AnonPermissionOnly]

    def get_serializer_context(self, *args, **kwargs):
        return {"request": self.request}


class ChangePasswordAPIView(generics.GenericAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class EmployeeView(generics.RetrieveAPIView):
    queryset = Employee.objects.all()
    serializer_class = GetEmployeesListSerializer
    permission_classes = []


class ProfileAPIView(APIView):
    def get(self, request, *args, **kwargs):
        return Response("Your IP is %s" % get_identity(request))


class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter


class MicrosoftGraphLoginView(SocialLoginView):
    adapter_class = MicrosoftGraphOAuth2Adapter


#################################################

class ProductionQRCODEChallengeRequestDetail(QRCODEChallengeRequestDetail):
    """
    In order to overwrite the http into https in production
    """
    serializer_class = ProductionQRCODEChallengeRequestSerializer

#################################################
