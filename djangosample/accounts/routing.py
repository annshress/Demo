from django.urls import path

from accounts.consumers import EmployeeOnlineStatusConsumer


websocket_urlpatterns = [
    path("employee/status/", EmployeeOnlineStatusConsumer)
]
