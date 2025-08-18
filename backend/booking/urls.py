from django.urls import path
from .views import signup, verify_otp ,login ,user_profile,list_rooms,dashboard_metrics,available_rooms,room_availibility,book_room,edit_booking,add_participants,remove_participant

urlpatterns = [
  path('signup/', signup, name='signup'),
  path('verify-otp/', verify_otp, name='verify-otp'),
  path('login/',login ,name='login'),
  path('user/<str:employee_id>/', user_profile, name='user_profile'),
  path('rooms/',list_rooms,name='list_rooms'),
  path('dashboard-metrics/<str:employee_id>/', dashboard_metrics, name='dashboard-metrics'),
  path('available-rooms/',available_rooms,name="available_rooms"),
  path('room/<int:room_id>/availibility',room_availibility,name='room_availibility'),
  path('book-room/', book_room, name='book_room'),
  



  

  
] 