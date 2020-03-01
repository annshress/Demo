from datetime import datetime

from appointment import DATE_FORMAT, TIME_FORMAT


def get_date_from_str(s):
    if isinstance(s, str):
        return datetime.strptime(s, DATE_FORMAT).date()
    return s


def get_time_from_str(s):
    if isinstance(s, str):
        return datetime.strptime(s, TIME_FORMAT).time()
    return s
