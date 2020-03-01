from django.db.models import F, Q
from django.db.models.aggregates import Count, Sum
from django_filters import rest_framework as filters

from appointment.api.filters import DummyChoiceFilter
from appointment.models.bookings import ServicesBooking
from appointment.constants import STATUS


__author__ = 'anish dot s at whyunified dot com'


class ReportFilter(filters.FilterSet):
    from_date = filters.DateFromToRangeFilter(field_name='booked_date')
    index = DummyChoiceFilter(
        field_name=None,
        choices=(
            ('count', 'count'),
            ('amount', 'amount')
        ),
        label='Index'
    )


class EmployeeReportFilter(ReportFilter):
    def filter_queryset(self, queryset):
        qs = super(EmployeeReportFilter, self).filter_queryset(queryset=queryset)
        index = self.data.get('index', 'count')
        if index == 'count':
            return qs.values('employee').annotate(
                emp_f_name=F('employee__user__first_name'),
                emp_l_name=F('employee__user__last_name'),
                total=Count('id'),
                pending=Count('id', filter=Q(booking__status=STATUS.pending)),
                confirmed=Count('id', filter=Q(booking__status=STATUS.confirmed)),
                cancelled=Count('id', filter=Q(booking__status=STATUS.cancelled)),
            )
        else:
            return qs.values('employee').annotate(
                emp_f_name=F('employee__user__first_name'),
                emp_l_name=F('employee__user__last_name'),
                total=Sum('service__price'),
                pending=Sum('service__price', filter=Q(booking__status=STATUS.pending)),
                confirmed=Sum('service__price', filter=Q(booking__status=STATUS.confirmed)),
                cancelled=Sum('service__price', filter=Q(booking__status=STATUS.cancelled)),
            )

    class Meta:
        model = ServicesBooking
        fields = ['service']


class ServiceReportFilter(ReportFilter):
    def filter_queryset(self, queryset):
        qs = super(ServiceReportFilter, self).filter_queryset(queryset=queryset)
        index = self.data.get('index', 'count')
        if index == 'count':
            return qs.values('service').annotate(
                service_name=F('service__name'),
                total=Count('id'),
                pending=Count('id', filter=Q(booking__status=STATUS.pending)),
                confirmed=Count('id', filter=Q(booking__status=STATUS.confirmed)),
                cancelled=Count('id', filter=Q(booking__status=STATUS.cancelled)),
            )
        else:
            return qs.values('employee').annotate(
                service_name=F('service__name'),
                total=Sum('service__price'),
                pending=Sum('service__price', filter=Q(booking__status=STATUS.pending)),
                confirmed=Sum('service__price', filter=Q(booking__status=STATUS.confirmed)),
                cancelled=Sum('service__price', filter=Q(booking__status=STATUS.cancelled)),
            )

    class Meta:
        model = ServicesBooking
        fields = ['employee']
