import jwt
from channels.auth import AuthMiddlewareStack
from django.contrib.auth import get_user_model
from django.contrib.auth.middleware import get_user
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from django.utils.functional import SimpleLazyObject
from rest_framework import exceptions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.request import Request
from rest_framework_jwt.settings import api_settings

jwt_decode_handler = api_settings.JWT_DECODE_HANDLER
jwt_get_username_from_payload = api_settings.JWT_PAYLOAD_GET_USERNAME_HANDLER


def get_user_jwt(request):
    user = get_user(request)
    if user.is_authenticated:
        return user
    try:
        user_jwt = JSONWebTokenAuthentication().authenticate(Request(request))
        if user_jwt is not None:
            return user_jwt[0]
    except:
        pass
    return user


class JWTTokenAuthenticationMiddleware:
    """
    Middleware for setting user from jwt in the `request` object.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        assert hasattr(request, 'session'), "The Django authentication middleware requires session middleware to be installed. Edit your MIDDLEWARE_CLASSES setting to insert 'django.contrib.sessions.middleware.SessionMiddleware'."

        request.user = SimpleLazyObject(lambda: get_user_jwt(request))
        response = self.get_response(request)
        return response


class JWTTokenAuthMiddleware:
    """
    I'mlazyasF
    inspiration: https://gist.github.com/rluts/22e05ed8f53f97bdd02eafdf38f3d60a
    JWT Token authorization middleware for Django Channels 2
    """

    def __init__(self, inner):
        self.inner = inner

    def __call__(self, scope):
        headers = dict(scope['headers'])
        if b'sec-websocket-protocol' in headers:
            jwt_value = headers[b'sec-websocket-protocol'].decode()
            try:
                payload = jwt_decode_handler(jwt_value)
                user = self.authenticate_credentials(payload)
                close_old_connections()
                scope['user'] = user
            except exceptions.AuthenticationFailed:
                scope['user'] = AnonymousUser()
            except (jwt.ExpiredSignature, jwt.DecodeError, jwt.InvalidTokenError):
                scope['user'] = AnonymousUser()

        return self.inner(scope)

    def authenticate_credentials(self, payload):
        """
        Returns an active user that matches the payload's user id and email.
        """
        user_model = get_user_model()
        username = jwt_get_username_from_payload(payload)

        if not username:
            msg = "User not found."
            raise exceptions.AuthenticationFailed(msg)

        try:
            user = user_model.objects.get_by_natural_key(username)
        except user_model.DoesNotExist:
            msg = "Invalid signature."
            raise exceptions.AuthenticationFailed(msg)

        if not user.is_active:
            msg = "User account is disabled."
            raise exceptions.AuthenticationFailed(msg)

        return user


JWTTokenAuthMiddlewareStack = lambda inner: JWTTokenAuthMiddleware(AuthMiddlewareStack(inner))
