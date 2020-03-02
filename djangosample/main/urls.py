"""main URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from deux.views import QRCODEGeneratorView
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import TemplateView

from accounts.api.views import ProfileAPIView, GoogleLoginView, ProductionQRCODEChallengeRequestDetail

urlpatterns = [
        
        #############
        # TRUNCATED #
        #############

    path('appointments/<slug:company>/',
       include(('appointment.api.urls', 'appointment.api'), namespace='appointment')),
    path('cleaning/<slug:company>/',
       include(('cleaning.api.urls', 'cleaning.api'), namespace='cleaning')),
    path('formbuilder/<slug:company>/',
       include(('formbuilder.api.urls', 'formbuilder.api'), namespace='formbuilder')),
    path('shoppingcart/<slug:company>/', include(('shoppingcart.api.urls', 'shoppingcart.api'),
                                               namespace='shoppingcart')),
    path('invoicemanager/<slug:company>/', include(('invoicemanager.api.urls', 'invoicemanager.api'),
                                                 namespace='invoicemanager')),
    path('hotel_booking/<slug:company>/', include(('hotel_booking.api.urls', 'hotel_booking.api'),
                                                namespace='hotel_booking')),
    path('food_delivery/<slug:company>/', include(('food_delivery.api.urls', 'food_delivery.api'),
                                                namespace='food-delivery')),
    path('crm/<slug:company>/', include(('crm.api.urls', 'crm.api'),
                                      namespace='crm')),
    path('esign/<slug:company>/', include(('esign.api.urls', 'esign.api'),
        
        #############
        # TRUNCATED #
        #############

    path("payment/", include(("payment.urls", "payment"), namespace="payment")),
    path('search/<slug:company>/', include(('search.urls', 'search.api'),
                                         namespace='search')),
    path('', TemplateView.as_view(template_name="index.html")),
    path('online/', TemplateView.as_view(template_name="online_status.html",
                                       extra_context=dict(n=range(50)))),
    path('allauth/', include('allauth.urls')),
    path('accounts/profile/', ProfileAPIView.as_view()),
    path('rest-auth/', include('rest_auth.urls')),
    #############################################
    path("mfa/qrcode/request/", ProductionQRCODEChallengeRequestDetail.as_view(),
         name="qrcode_request-detail"),
    path(
      'mfa/',
      include(('deux.urls', "deux"), namespace="mfa"),
    ),
    path("test/watch-envelope/", TemplateView.as_view(template_name="test_watcher.html")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)\
  + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += [url(r'^.*', TemplateView.as_view(template_name="index.html"))]
