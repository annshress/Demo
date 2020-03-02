from django.conf.urls import url
from django.urls import path, include

from .views import WidgetsList, AppWidgetsList, ActivatedWidgetsList, AddActivatedWidgets, DeleteActivatedWidgets

urlpatterns = [
    path('list', WidgetsList.as_view(), name='widgetslist'),
    path('app/<app>', AppWidgetsList.as_view(), name='appwidgetslist'),
    path('activated/<app>', ActivatedWidgetsList.as_view(), name='activatedwidgets'),
    path('store', AddActivatedWidgets.as_view(), name='addactivatedwidgets'),
    path('delete/<pk>', DeleteActivatedWidgets.as_view(), name='deleteactivatedwidgets'),

]
