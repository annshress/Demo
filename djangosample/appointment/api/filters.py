from datetime import datetime

from django.db.models.functions.datetime import ExtractWeek, ExtractMonth
from django_filters import rest_framework as filters, ChoiceFilter, DateRangeFilter

from appointment.models import ServicesBooking, Booking
from appointment.constants import BOOKING_TYPE


class BookingTypeFilter(ChoiceFilter):
    """
    created with an intention to not use to filter qs, but to show
    choices only to be used by BookingDateRangeFilter
    """
    choices = (
        ("created_or_modified", "Created or Modified"),
        ("coming", "Coming"),
    )

    def filter(self, qs, value):
        return qs


class BookingDateRangeFilter(DateRangeFilter):
    def filter(self, qs, value):
        if not value:
            return qs

        assert value in self.filters

        # field_name is really dependent of bookings field
        field_name = self.parent.data['bookings']
        if field_name == BOOKING_TYPE.created_or_modified:
            qs = self.filters[value](qs, "booking__created_at") \
                 | self.filters[value](qs, "modified")
        elif field_name == BOOKING_TYPE.coming:
            qs = self.filters[value](qs, "booked_date")
        return qs.distinct() if self.distinct else qs


class ExportServicesBookingFilter(filters.FilterSet):
    bookings = BookingTypeFilter(field_name=None)
    date = BookingDateRangeFilter(field_name="booked_date")

    class Meta:
        model = ServicesBooking
        fields = ["date", "bookings"]


class BookingFilter(filters.FilterSet):
    booked_date = filters.DateFromToRangeFilter('service_bookings__booked_date')

    # ordering = filters.OrderingFilter()

    @property
    def qs(self):
        super(BookingFilter, self).qs
        return self._qs.distinct()

    class Meta:
        model = Booking
        fields = [
            'status',
            'booking_id',
            'service_bookings__service',
            'service_bookings__employee',
        ]


class DummyChoiceFilter(ChoiceFilter):
    def filter(self, qs, value):
        return qs


class ScheduleFilter(filters.FilterSet):
    view_by = DummyChoiceFilter(
        choices=(
            ("week", "week"),
            ("month", "month"),
        ), field_name=None, label="View By",
    )
    jump_to = ChoiceFilter(
        choices=(), label="Jump to ",
        field_name=None  # can be week or month based on view_by selected
    )

    class Meta:
        model = ServicesBooking
        fields = []

    def __init__(self, *args, **kwargs):
        super(ScheduleFilter, self).__init__(*args, **kwargs)
        self.queryset = self.queryset.annotate(
            week=ExtractWeek('booked_date'),
            month=ExtractMonth('booked_date')
        )
        view_by = self.data.get('view_by', 'month')
        self.filters['jump_to'].field_name = view_by
        if view_by == 'month':
            month = datetime.today().month
            self.filters['jump_to'].field.choices.choices = (
                map(lambda x: (x, x), list(range(month, month + 2)))
            )
        elif view_by == 'week':
            week_number = datetime.today().isocalendar()[1]
            self.filters['jump_to'].field.choices.choices = (
                map(lambda x: (x, x), list(range(week_number, week_number + 5)))
            )
