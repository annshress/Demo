import datetime
import sys

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        # 'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (),
    'DEFAULT_PAGINATION_CLASS': 'main.restconf.pagination.APIPageNumberPagination',
    'DEFAULT_FILTER_BACKENDS': (
            'rest_framework.filters.SearchFilter',
            'rest_framework.filters.OrderingFilter',
            'django_filters.rest_framework.DjangoFilterBackend',
    ),
    'SEARCH_PARAM': 'q',
    'ORDERING_PARAM': 'ordering',
}

if "test" in sys.argv:
    REST_FRAMEWORK['DEFAULT_AUTHENTICATION_CLASSES'].append("rest_framework.authentication.SessionAuthentication")

JWT_AUTH = {
    'JWT_ENCODE_HANDLER':
    'rest_framework_jwt.utils.jwt_encode_handler',

    'JWT_DECODE_HANDLER':
    'rest_framework_jwt.utils.jwt_decode_handler',

    'JWT_PAYLOAD_HANDLER':
    'rest_framework_jwt.utils.jwt_payload_handler',

    'JWT_PAYLOAD_GET_USER_ID_HANDLER':
    'rest_framework_jwt.utils.jwt_get_user_id_from_payload_handler',

    'JWT_RESPONSE_PAYLOAD_HANDLER':
    #'rest_framework_jwt.utils.jwt_response_payload_handler'
    'accounts.api.utils.jwt_response_payload_handler',
    
    'JWT_EXPIRATION_DELTA': datetime.timedelta(days=7),

    'JWT_ALLOW_REFRESH': True,
    'JWT_REFRESH_EXPIRATION_DELTA': datetime.timedelta(days=7),

    'JWT_AUTH_HEADER_PREFIX': 'JWT', # Authorization: JWT <token>
    'JWT_AUTH_COOKIE': None,

}

# enable jwt for rest-auth
REST_USE_JWT = True

REST_AUTH_SERIALIZERS = dict(
    JWT_SERIALIZER="accounts.api.serializers.RestAuthJWTSerializer"
)
