from rest_framework.generics import ListAPIView

from appointment.mixins import AppointmentAppCheckMixin
from libs.mixins import CompanyPermissionCheckMixin
from appointment.api.reports.filters import EmployeeReportFilter, ServiceReportFilter
from appointment.api.reports.serializers import EmployeeReportSerializer, ServiceReportSerializer
from appointment.models.bookings import ServicesBooking


class EmployeeReportAPIView(CompanyPermissionCheckMixin, AppointmentAppCheckMixin, ListAPIView):
    serializer_class = EmployeeReportSerializer
    filterset_class = EmployeeReportFilter

    def get_queryset(self):
        return ServicesBooking.objects.filter(
            service__company=self.company
        )


class ServiceReportAPIView(CompanyPermissionCheckMixin, AppointmentAppCheckMixin, ListAPIView):
    serializer_class = ServiceReportSerializer
    filterset_class = ServiceReportFilter

    def get_queryset(self):
        return ServicesBooking.objects.filter(
            service__company=self.company
        )
