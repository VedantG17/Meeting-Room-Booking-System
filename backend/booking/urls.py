from django.urls import path
from .views import signup, verify_otp ,login ,user_profile

urlpatterns = [
  path('signup/', signup, name='signup'),
  path('verify-otp/', verify_otp, name='verify-otp'),
  path('login/',login ,name='login'),
  path('user/<str:employee_id>/', user_profile, name='user_profile'),
  
  
] 