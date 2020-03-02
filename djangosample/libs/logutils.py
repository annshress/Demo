from logging.config import dictConfig
import logging


# Taken from https://github.com/nvie/rq/blob/master/rq/logutils.py
def setup_loghandlers(level=None):
    # Setup logging, if not already configured
    logger = logging.getLogger('workplace')
    if not logger.handlers:
        dictConfig({
            "version": 1,
            "disable_existing_loggers": False,

            "formatters": {
                "workplace": {
                    "format": "[%(levelname)s]%(asctime)s PID %(process)d: %(message)s",
                    "datefmt": "%Y-%m-%d %H:%M:%S",
                },
            },

            "handlers": {
                "workplace": {
                    "level": "DEBUG",
                    "class": "logging.StreamHandler",
                    "formatter": "workplace"
                },
            },

            "loggers": {
                "workplace": {
                    "handlers": ["workplace"],
                    "level": level or "DEBUG"
                }
            }
        })
    return logger
