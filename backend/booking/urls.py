from django.urls import path
from .views import signup, verify_otp ,login

urlpatterns = [
  path('signup/', signup, name='signup'),
  path('verify-otp/', verify_otp, name='verify-otp'),
  path('login/',login ,name='login'),
  
] 