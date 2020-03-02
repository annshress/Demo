import os

from .settings import *

DOMAIN = "https://wp.whyunified.com"

################################################################
# For links generated by reverse should also bear https:// in production

# SECURE_SSL_REDIRECT = True
# SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
#
# MIDDLEWARE += [
#     'django.middleware.security.SecurityMiddleware',
# ]

################################################################

REDIS_PUBLIC_DNS = os.environ.get("REDIS_PUBLIC_DNS", "")

if REDIS_PUBLIC_DNS:
    print("Using Remote Redis Server as Channel Backend at ", REDIS_PUBLIC_DNS)
    CHANNEL_LAYERS = {
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [(REDIS_PUBLIC_DNS, 6379)],
            }
        }
    }

if 'RDS_HOSTNAME' in os.environ:
    print("Using RDS postgres as database {} @ {}:{}".format(os.environ['RDS_DB_NAME'],
                                                           os.environ['RDS_HOSTNAME'],
                                                           os.environ['RDS_PORT']))
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ['RDS_DB_NAME'],
            'USER': os.environ['RDS_USERNAME'],
            'PASSWORD': os.environ['RDS_PASSWORD'],
            'HOST': os.environ['RDS_HOSTNAME'],
            'PORT': os.environ['RDS_PORT'],
        }
    }

# collectstatic can take huge chunk of time during test deployments
if "TESTING" not in os.environ.keys() and "AWS_ACCESS_KEY_ID" in os.environ.keys():
    AWS_ACCESS_KEY_ID = os.environ['AWS_ACCESS_KEY_ID']
    AWS_SECRET_ACCESS_KEY = os.environ['AWS_SECRET_ACCESS_KEY']
    AWS_STORAGE_BUCKET_NAME = os.environ['AWS_STORAGE_BUCKET_NAME']
    AWS_DEFAULT_ACL = 'public-read'
    AWS_AUTO_CREATE_BUCKET = True
    AWS_S3_OBJECT_PARAMETERS = {}
    AWS_S3_MAX_MEMORY_SIZE = 25
    AWS_S3_FILE_OVERWRITE = False
    # Whether or not to enable gzipping of content types specified by GZIP_CONTENT_TYPES
    # GZIP_CONTENT_TYPES (optional: default is text/css, text/javascript,
    # AWS_IS_GZIPPED = True
    AWS_S3_REGION_NAME = os.environ["AWS_S3_REGION_NAME"]
    AWS_S3_SIGNATURE_VERSION = 's3v4'
    AWS_QUERYSTRING_AUTH = False
    AWS_LOCATION = 'static'

    # so that media files get uploaded to s3
    """
    MEDIA FILES
    stored locally in the django server, however served by cdn dedicated for elb
    """
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    MEDIA_URL = os.environ["MEDIA_CDN_URL"]
    """
    STATIC FILES
    collected into S3, and served by dedicated cdn for s3
    """
    # to upload static files to s3
    STATICFILES_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    # static url is irrelevant in our case, since its static-typed in the bundle.js

ELASTICSEARCH_DSL = {
    'default': {
        'hosts': os.environ.get("ELASTICSEARCH_PUBLIC_DNS", "localhost") + ':9200'
    },
}
ELASTICSEARCH_DSL_AUTOSYNC = os.environ.get("ELASTICSEARCH_DSL_AUTOSYNC", "False") == "True"
