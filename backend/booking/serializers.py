from rest_framework import serializers
from .models import Employee,Guest,MeetingRoom,Booking,BookingParticipant,OtpModels
from django.contrib.auth.hashers import make_password
import uuid 

class RegistrationSerializer(serializers.Serializer):
  name = serializers.CharField(max_length=100)
  email = serializers.EmailField()
  password = serializers.CharField(write_only=True)
  # otp = serializers.CharField(max_length=6, write_only=True, required=False)

  def validate_email(self,value):
    if not value.endswith("@purplepanda.in"):
      raise serializers.ValidationError("Must be a company Email(@purplepanda.in)")
    if Employee.objects.filter(email=value).exists():
      raise serializers.ValidationError("Already Registered Please Login")
    return value
 
class VerifyOtpSerializer(serializers.Serializer):
  email = serializers.EmailField()
  otp = serializers.CharField(max_length=6)

  def validate(self,data):
    email = data.get('email')
    otp = data.get('otp')
    try:
      otp_record = OtpModels.objects.get(email=email, otp=otp)
      if otp_record.is_expired():
        otp_record.delete()
        raise serializers.ValidationError("OTP has expired")
    except OtpModels.DoesNotExist:
      raise serializers.ValidationError("Invalid or Expired OTP")
    return data
  
  def create(self,validated_data):
    email = validated_data['email']
    otp = validated_data['otp']
    otp_record = OtpModels.objects.get(email=email, otp=otp)
    employee_id = str(uuid.uuid4())[:8]
    employee = Employee.objects.create(
        name=otp_record.name,
        email=otp_record.email,
        employee_id=employee_id,
        password_hash=otp_record.password_hash,
        is_active=True
    )
    return employee
  
class EmployeeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Employee
    fields = ['name', 'email', 'employee_id']

class MeetingRoomSerializers(serializers.ModelSerializer):
  class Meta:
    model = MeetingRoom
    fields = ['id', 'name', 'location', 'capacity']

class DashboardMetricsSerializer(serializers.Serializer):
    availableRooms = serializers.IntegerField()
    totalRooms = serializers.IntegerField()
    todaysMeetings = serializers.IntegerField()
    nextWeekMeetings = serializers.IntegerField()

class AvailabilitySlotSerializer(serializers.Serializer):
  id = serializers.IntegerField()
  start_time = serializers.DateField()
  end_time =  serializers.DateField()
  booked_by = serializers.CharField()
  title = serializers.CharField(allow_blank=True,required=False)

class BookingCreateSerializer(serializers.Serializer):
  room_id = serializers.IntegerField()
  employee_id = serializers.CharField(max_length=50)
  start_time = serializers.DateTimeField()
  end_time = serializers.DateTimeField()
  title = serializers.CharField(allow_blank=True,required=False)
  description = serializers.CharField(allow_blank=True,required=False)
  participants = serializers.ListField(
    child=serializers.EmailField(),required =False ,allow_empty=True #list of participants child= correct child space = error
  )

  def validate(self,data):
    from django.utils import timezone
    start = data['start_time']
    end = data['end_time']
    employee_id = data.get('employee_id')
    if not employee_id:
        raise serializers.ValidationError({"employee_id": "Creator employee ID is required."})
    try:
        Employee.objects.get(employee_id=employee_id)
    except Employee.DoesNotExist:
        raise serializers.ValidationError({"employee_id": "Employee with this ID does not exist."})
    if end< timezone.now():
      raise serializers.ValidationError("Cant book meeting in past ")
    if end<=start:
      raise serializers.ValidationError("End time must be after start time.")
    if (end - start).total_seconds() >= 24*3600:
      raise serializers.ValidationError("Meeting duration cannot exceed 24 hours")
    return data
     






  














  
