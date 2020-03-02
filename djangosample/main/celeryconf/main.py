import os

# CELERY STUFF
CELERY_BROKER_URL = 'redis://{}:6379'.format(os.environ.get("REDIS_PUBLIC_DNS", "localhost"))
CELERY_RESULT_BACKEND = 'redis://{}:6379'.format(os.environ.get("REDIS_PUBLIC_DNS", "localhost"))
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
