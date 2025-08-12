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
    











  
