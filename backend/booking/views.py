from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.db import models
#req for validation 
from .models import OtpModels,Employee,Booking,MeetingRoom,Guest
from .serializers import RegistrationSerializer, VerifyOtpSerializer,BookingParticipant,EmployeeSerializer,MeetingRoomSerializers,DashboardMetricsSerializer,BookingCreateSerializer
import random
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
from datetime import datetime,timedelta
from django.db.models import Q
from django.db import transaction

 

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
            for p in booking.participants.all()
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


#utilities

#storing zone aware datetime 
def _parse_iso(iso_str :str):
  dt = datetime.fromisoformat(iso_str.replace('Z','+00:00'))
  if timezone.is_naive(dt):
    dt = timezone.make_aware(dt)
  return dt

def _overlapcheck(start,end): #new meeting timings
  return Q(start_time__lt = end) & Q(end_time__gt = start)

#--------------------------------------------------------------------------------------------

@api_view(['GET'])
def available_rooms(request):
  start_iso  = request.GET.get('start')
  end_iso = request.GET.get('end')

  qs = MeetingRoom.objects.all()
  if start_iso and end_iso:
    try:
      start = _parse_iso(start_iso)
      end = _parse_iso(end_iso)
    except Exception:
      return Response({"success":False,"message":"The entered start and end time was not in ISO(1680) format so parsing function didnt work"},status =400)

    # start and end time of slots(zone aware) Recieved in Datetime object python

    if(end<=start):
      return Response({"success":False,"message":"end must be greater than start"},status=400)
    
    busy_ids = Booking.objects.filter(_overlapcheck(start,end)).values_list('room_id',flat=True).distinct()
    qs = qs.exclude(id__in = busy_ids)
  else:
    pass

  return Response({"success":True,"data":MeetingRoomSerializers(qs,many=True).data},status=status.HTTP_200_OK)

@api_view(['GET'])
def room_availibility(request, room_id:int):
  date_str = request.GET.get('date')
  if not date_str:
    return Response({"success":True,"message":"datae is required"},status =status.HTTP_400_BAD_REQUEST)

  try:
    room = MeetingRoom.objects.get(id=room_id)
  except MeetingRoom.DoesNotExist:
    return Response({"success":False,"message": "Room not found"},status=status.HTTP_404_NOT_FOUND) 

  try:
    day = datetime.strptime(date_str,"%Y-%m-%d").date()
  except ValueError:
    return Response({"success": False, "message": "Invalid date format."}, status =status.HTTP_400_BAD_REQUEST)
  day_start = timezone.make_aware(datetime.combine(day,datetime.min.time()))
  day_end = day_start + timedelta(days=1)

  bookings =  (Booking.objects.filter(room_id=room_id)
               .filter(_overlapcheck(day_start, day_end))
               .select_related('creator_employee')
               .order_by('start_time')
              )
  data = [{
    "id": i.id,
    "start_time": i.start_time,
    "end_time": i.end_time,
    "booked_by": i.creator_employee.name,
    "title":getattr(i,'title','') or ''
  } for i in bookings]

  return Response({"success": True, "data": data}, status=200)

@api_view(['POST'])
def book_room(request):
  serializer = BookingCreateSerializer(data=request.data)
  if not serializer.is_valid():
    return Response({"success": False, "message": serializer.errors},status =status.HTTP_400_BAD_REQUEST)
  
  #we get this from frontend
  data = serializer.validated_data
  room_id = data['room_id']
  date = data["date"]
  start_time = data["start_time"]
  end_time = data['end_time']
  participants = data.get("participants",[])
  title = data.get('title','')
  description = data.get('description', '')

  try:
    room = MeetingRoom.objects.get(id= room_id)
  except MeetingRoom.DoesNotExist:
    return Response({"error":"No Such room exist"},status=status.HTTP_404_NOT_FOUND)
  
  start_dt = timezone.make_aware(datetime.combine(date,start_time))
  end_dt = timezone.make_aware(datetime.combine(date,end_time))


  conflicts =  Booking.objects.filter(
    room = room,
  ).filter(
    _overlapcheck(start_dt,end_dt)
  ).exists()

  if conflicts:
    return Response({"error":"This room is already booked during the requested time"},status=status.HTTP_409_CONFLICT)
  
  if len(participants)+1 >room.capacity:
    return Response({"error":"no of participants more than room capacity"},status =status.HTTP_400_BAD_REQUEST)
  
  with transaction.atomic():
    conflict_booking_locked = Booking.objects.select_for_update().filter(
      room = room
    ).filter( _overlapcheck(start_dt, end_dt))
    if conflict_booking_locked.exists():
      return Response(
        {"error":"This room became unavailable during booking"},
        status=status.HTTP_409_CONFLICT
      )
    booking = Booking.objects.create(
      room = room,
      creator_employee = request.user,
      start_time=start_dt,
      end_time = end_dt,
      title=title,
      description=description,  
    )
    for email in participants:
      try:
        emp = Employee.objects.get(email=email)
        BookingParticipant.objects.create(booking=booking, employee=emp)
      except Employee.DoesNotExist:
        continue

  return Response({
     "message": "Room booked successfully",
     "booking_id":booking.id,
     "room":room.name,
     "date":str(date),
     "start_time":str(start_time),
     "end_time":str(end_time),
     "no of participants_added": len(participants),
  },status = status.HTTP_201_CREATED)


@api_view(['PUT'])
def edit_booking(request,booking_id):
  try:
    booking = Booking.objects.get(id=booking_id)
  except Booking.DoesNotExist:
    return Response({"success": False, "message": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

  if booking.creator_employee != request.user:
    return Response({"success": False, "message": "Only creator can edit booking"},  status=status.HTTP_403_FORBIDDEN)
  
  start_time = request.data.get("start_time")
  end_time = request.data.get("end_time")
  title = request.data.get("title")
  description = request.data.get("description")

  try:
    start_dt = _parse_iso(start_time) if start_time else booking.start_time
    end_dt = _parse_iso(end_time) if end_time else booking.end_time

  except Exception:
    return Response({"success": False, "message": "Invalid datetime format"},status=status.HTTP_400_BAD_REQUEST)
  
  with transaction.atomic():
    try:
      booking = Booking.objects.select_for_update().get(id=booking.id)
    except Booking.DoesNotExist:
      return Response({"success":False,"messsage":"Booking not found"},status=status.HTTP_404_NOT_FOUND)
    conflict = Booking.objects.filter(room = booking.room).exclude(id=booking.id).filter(_overlapcheck(start_dt, end_dt)).exists()
    if conflict:
      return Response({"success": False, "message": "Cannot Update time conflict with another booking"}, status=status.HTTP_409_CONFLICT)
    
    booking.start_time = start_dt
    booking.end_time = end_dt
    if title is not None:
        booking.title = title
    if description is not None:
        booking.description = description
    booking.save()
  return Response({"success":True},status=status.HTTP_200_OK)  
    
@api_view(['POST'])
def add_participants(request,booking_id):
  email = request.data.get("participant")
  if not email:
    return Response({"success": False, "message": "Participant email is required"},status=status.HTTP_400_BAD_REQUEST)
  try:
    booking = Booking.objects.get(id=booking_id) 
  except Booking.DoesNotExist:
    return Response({"success": False, "message": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
  if booking.creator_employee != request.user:
    return Response({"success": False, "message": "Only creator can add participants"}, status=status.HTTP_403_FORBIDDEN)
  if BookingParticipant.objects.filter(booking=booking).filter(
      Q(employee__email=email) | Q(guest__email=email)).exists():
    return Response({"success": False, "message": "Participant already added"}, status=status.HTTP_400_BAD_REQUEST)
  curr_capacity= booking.participants.count()+1
  if curr_capacity >=booking.room.capacity:
    return Response({"success": False, "message": "Room capacity exceeded"}, status=status.HTTP_400_BAD_REQUEST)
  
  if Employee.objects.filter(email=email).exists():
    emp = Employee.objects.get(email=email)
    BookingParticipant.objects.create(booking=booking,employee=emp)
  else:
    guest = Guest.objects.create(name = email.split('@')[0],email=email)
    BookingParticipant.create(booking=booking,guest=guest)

@api_view(['DELETE'])
def remove_participant(request,booking_id):
  email =request.data.get("participant")
  if not email:
    return Response({"success": False, "message": "Participant email is required"}, status=status.HTTP_400_BAD_REQUEST)
  try:
    booking = Booking.objects.get(id=booking_id)
  except Booking.DoesNotExist:
    return Response({"success": False, "message": "Booking not found"},status=status.HTTP_404_NOT_FOUND)
    
  if booking.creator_employee != request.user:
    return Response({"success": False, "message": "Only creator can remove participants"}, status=status.HTTP_403_FORBIDDEN)
  
  participant = BookingParticipant.objects.filter(booking=booking).filter(
    Q(employee__email = email) | Q(guest__email=email)
  )

  if not participant:
    return Response({"success": False, "message": "Participant not found"},status=status.HTTP_404_NOT_FOUND)
  
  participant.delete()
  return Response({"success": True, "message": f"Participant {email} removed"}, status=status.HTTP_200_OK)



  
  



  
  

  





  


  







