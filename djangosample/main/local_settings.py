import sys
from .settings import *

DEBUG = True

STATIC_ROOT = None
STATICFILES_DIRS = (os.path.join(BASE_DIR, "static"),
                    os.path.join(BASE_DIR, "build", "static"),
                    os.path.join(BASE_DIR, "build"))

DOMAIN = "http://localhost:9000"
