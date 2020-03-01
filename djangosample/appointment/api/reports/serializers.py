from rest_framework import serializers


class ReportSerializer(serializers.Serializer):
    total = serializers.CharField()
    confirmed = serializers.CharField()
    pending = serializers.CharField()
    cancelled = serializers.CharField()


class EmployeeReportSerializer(ReportSerializer):
    emp_f_name = serializers.CharField()
    emp_l_name = serializers.CharField()


class ServiceReportSerializer(ReportSerializer):
    service_name = serializers.CharField()
