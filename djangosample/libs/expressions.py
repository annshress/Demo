from django.db.models import Aggregate
from django.db.models.fields import CharField
from django.db.models.functions import Cast
from django.conf import settings


class GroupConcat(Aggregate):
    # copied from: https://stackoverflow.com/a/31337612/3218199
    # supports COUNT(distinct field)
    function = 'GROUP_CONCAT'
    template = '%(function)s(%(distinct)s%(expressions)s)'

    def __init__(self, expression, distinct=False, **extra):
        super().__init__(
            expression,
            distinct='DISTINCT ' if distinct else '',
            output_field=CharField(),
            **extra
        )


class JulianDaySqlite(Cast):
    function = 'julianday'
    template = '%(function)s(%(expressions)s)'


class JulianDayPG(Cast):
    function = 'to_char'
    template = "%(function)s(%(expressions)s::date, 'J'))"


if settings.DEBUG:
    Julian = JulianDaySqlite
else:
    Julian = JulianDayPG
