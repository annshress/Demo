from django.urls import path, include
from django.contrib import admin
from rest_framework_jwt.views import refresh_jwt_token, obtain_jwt_token  # accounts app

from accounts.api.views import MicrosoftGraphLoginView, GoogleLoginView
from .views import EmployeeView
from .views import AuthAPIView, RegisterAPIView, CustomObtainJSONWebToken, ChangePasswordAPIView, ActivateAccount, \
    TestWidget

urlpatterns = [
    path('', AuthAPIView.as_view(), name='login'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('jwt/', CustomObtainJSONWebToken.as_view(), name='obtain-jwt'),
    path('jwt/refresh/', refresh_jwt_token, name='obtain-fresh-jwt'),
    path('password_reset/', include('django_rest_passwordreset.urls', namespace='password_reset')),
    path('change_password/', ChangePasswordAPIView.as_view(), name="change-password"),
    path('employee/<pk>', EmployeeView.as_view(), name='viewEmployee'),
    path('test/', TestWidget.as_view(), name='testingwidget'),
    path('activate_account/<slug:uidb64>/<slug:token>/',
         ActivateAccount.as_view(), name="activate"),
    path('social/google/', GoogleLoginView.as_view()),
    path('social/microsoft/', MicrosoftGraphLoginView.as_view()),
]
