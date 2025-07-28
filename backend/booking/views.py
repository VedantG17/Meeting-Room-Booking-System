from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
#req for validation 
from .models import OtpModels
from .serializers import RegistrationSerializer, VerifyOtpSerializer
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
def login(requst):
  email = request.data.get('email')
  password = request.data.get('password')
  try:
    employee = Employee.object.get(email = email)
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