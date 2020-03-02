"""
cross apps constants are defined here
"""

from collections import namedtuple

# ISO WEEK DAYS: monday = 0
ISO_WEEK_DAYS = ["monday", "tuesday", "wednesday", "thursday",
                 "friday", "saturday", "sunday"]
DAYS = namedtuple("DAYS",
                  ISO_WEEK_DAYS)(*range(7))
DISCOUNT_TYPE = namedtuple("DISCOUNT_TYPE", "cash percent")(*range(2))

DAY_CHOICES = (
    (DAYS.monday, "monday"),
    (DAYS.tuesday, "tuesday"),
    (DAYS.wednesday, "wednesday"),
    (DAYS.thursday, "thursday"),
    (DAYS.friday, "friday"),
    (DAYS.saturday, "saturday"),
    (DAYS.sunday, "sunday"),
)
DISCOUNT_TYPE_CHOICES = (
    (DISCOUNT_TYPE.cash, "cash"),
    (DISCOUNT_TYPE.percent, "percent"),
)
COUNTRY_CHOICES = (
        ('us', 'Within US'),
        ('out', 'Outside US'),
    )
PAYMENT = namedtuple('PAYMENT', 'cash credit_card')(*range(2))
PAYMENT_CHOICES = (
    (PAYMENT.cash, "cash"),
    (PAYMENT.credit_card, "credit card"),
)

CURRENCY_CHOICES = (
    ("usd", "USD"),
    ("eur", "EUR"),
)
