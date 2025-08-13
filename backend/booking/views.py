from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import models
#req for validation 
from .models import OtpModels,Employee,Booking,MeetingRoom
from .serializers import RegistrationSerializer, VerifyOtpSerializer,BookingParticipant,EmployeeSerializer,MeetingRoomSerializers,DashboardMetricsSerializer
import random
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
 

@api_view(['POST'])
def signup(request):                                                  #request contains everything about the request
  serializer = RegistrationSerializer(data=request.data)              #dic data hold user input data
  if serializer.is_valid():                                           #data stored in a dict validated_data due to is_valid
    email = serializer.validated_data['email']
    name = serializer.validated_data['name']
    password = serializer.validated_data['password']
    otp = ''.join([str(random.randint(0,9)) for _ in range(6)])
    OtpModels.objects.create(
      email=email,
      otp=otp,
      name=name, 
      password_hash = make_password(password)
    )

    try:
      send_mail(
        subject="Your OTP for Signup",
        message=f'Your OTP is {otp}. Valid for 10 minutes.',
        recipient_list=[email],
        from_email=settings.DEFAULT_FROM_EMAIL,
        fail_silently=False,
      )
    except Exception as e:
      return Response(
        {'success':False,'message': f'Failed to send OTP: {str(e)}'},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
      )                  
    return Response(
      {'success': True, 'message':'OTP sent to your email'},
      status = status.HTTP_200_OK
    )  
  return Response(
        {'success': False, 'message': serializer.errors},
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
def verify_otp(request):
  serializer = VerifyOtpSerializer(data=request.data)
  if serializer.is_valid():
    employee = serializer.create(validated_data=serializer.validated_data)
    OtpModels.objects.get(email=serializer.validated_data['email'], otp=serializer.validated_data['otp']).delete()
    return Response(
      {'success':True, 'message':'User registered successfully', 'employee_id': employee.employee_id},
      status=status.HTTP_201_CREATED 
    )
  return Response(
    {'success':False,'message': serializer.errors},
    status = status.HTTP_400_BAD_REQUEST
  )

@api_view(['POST'])
def login(request):
  email = request.data.get('email')
  password = request.data.get('password')
  if not email or not password:
    return Response(
      {'success': False, 'message': 'Email and password are required'},
      status=status.HTTP_400_BAD_REQUEST
    )
  try:
    employee = Employee.objects.get(email = email)
    if check_password(password, employee.password_hash):
      return Response(
        {'success': True, 'message': 'Login successful', 'employee_id': employee.employee_id},
        status=status.HTTP_200_OK
      )
    return Response(
            {'success': False, 'message': 'Invalid credentials'},
            status=status.HTTP_400_BAD_REQUEST
        )
  except Employee.DoesNotExist:
      return Response(
        {'success': False, 'message': 'User not found'},
        status=status.HTTP_400_BAD_REQUEST
      )
  
@api_view(['GET'])
def user_profile(request,employee_id):
  try:
    employee_obj = Employee.objects.get(employee_id=employee_id)
    created_bookings = Booking.objects.filter(creator_employee=employee_obj)  #(fk=modelobj) -> pk of the table fk islinked to  == pk of Modelobj
    participant_links = BookingParticipant.objects.filter(employee=employee_obj)
    participant_booking = Booking.objects.filter(id__in = participant_links.values('booking'))
    past_bookings = (created_bookings | participant_booking).filter(end_time__lt=timezone.now()).distinct() 
    future_bookings = (created_bookings | participant_booking).filter(end_time__gte=timezone.now()).distinct()
    
    past_booking_data = [
      {
        'id': booking.id,
        'title': booking.room.name,
        'room': booking.room.name,
        'location': booking.room.location,
        'start_time': booking.start_time.isoformat(),
        'end_time': booking.end_time.isoformat(),
        'role': 'Creator' if booking.creator_employee == employee_obj else 'Participant',
        'participants': [
            {'id': p.id, 'name': p.employee.name if p.employee else p.guest.name}
            for p in booking.bookingparticipant_set.all()
        ]
      }for booking in past_bookings
    ]

    future_booking_data = [
      {
        'id': booking.id,
        'title': booking.room.name,
        'room': booking.room.name,
        'location': booking.room.location,
        'start_time': booking.start_time.isoformat(),
        'end_time': booking.end_time.isoformat(),
        'role': 'Creator' if booking.creator_employee == employee_obj else 'Participant',
        'participants': [
            {'id': p.id, 'name': p.employee.name if p.employee else p.guest.name}
            for p in booking.bookingparticipant_set.all()
        ] 
      }for booking in future_bookings 
    ]

    serializer = EmployeeSerializer(employee_obj)
    return Response({
      'success':True,
      'data':{
        'employee': serializer.data,
        'past_bookings': past_booking_data,
        'future_bookings': future_booking_data
      }, 
    },status=status.HTTP_200_OK   
    )

  except Employee.DoesNotExist:
    return Response({
      'success':False,
      'message':"User not found"
    },status = status.HTTP_404_NOT_FOUND
    )

@api_view(['GET'])
def list_rooms(request):
  rooms = MeetingRoom.objects.all()
  serializer = MeetingRoomSerializers(rooms,many=True)
  return Response({
    'success':True,
    'data':serializer.data
  }, status = status.HTTP_200_OK)

@api_view(['GET'])
def dashboard_metrics(request,employee_id):
  try:
    employee = Employee.objects.get(employee_id=employee_id)
  except Employee.DoesNotExist:
    return Response({'success': False, 'message': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)
  
  now = timezone.now()
  today_start =  now.replace(hour=0,minute=0,second=0,microsecond=0)
  today_end = today_start+ timedelta(days=1)
  next_week_start = today_start + timedelta(days=7)
  next_week_end = next_week_start + timedelta(days=7)
  total_rooms = MeetingRoom.objects.count()

  bookings_today = Booking.objects.filter(
    start_time__lt = today_end,
    end_time__gt = today_start, 
  )

  bookedrooms_today_id = bookings_today.values_list('room_id',flat=True).distinct()
  available_rooms = total_rooms - bookedrooms_today_id.count()

  meetings_today = bookings_today.filter(
    models.Q(creator_employee=employee) | models.Q(participants__employee=employee)
  ).distinct().count()

  meetings_next_week = Booking.objects.filter(
        start_time__gte=next_week_start,
        start_time__lt=next_week_end,
    ).filter(
        models.Q(creator_employee=employee) | 
        models.Q(participants__employee=employee)
    ).distinct().count()
  
  data = {
        'availableRooms': available_rooms,
        'totalRooms': total_rooms,
        'todaysMeetings': meetings_today,
        'nextWeekMeetings': meetings_next_week,
    }
  
  serializer = DashboardMetricsSerializer(data=data)
  serializer.is_valid(raise_exception=True)
  return Response({'success':'True','data':serializer.data},status = status.HTTP_200_OK)