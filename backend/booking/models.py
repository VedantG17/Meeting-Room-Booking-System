from django.db import models
from django.utils import timezone
import datetime

# Create your models here.
class Employee(models.Model):
  name = models.CharField(max_length=100)
  employee_id = models.CharField(max_length=50, unique=True)
  email = models.EmailField(unique=True)
  password_hash = models.CharField(max_length=255)
  is_active = models.BooleanField(default=True)
  def __str__(self):
    return f"{self.name} ({self.email})"

class OtpModels(models.Model):
  email = models.EmailField()
  otp = models.CharField(max_length=6)
  name = models.CharField(max_length=100)
  password_hash = models.CharField(max_length=255)
  created_at = models.DateTimeField(auto_now_add=True)

  def is_expired(self):
    return timezone.now() > self.created_at + datetime.timedelta(minutes=10)
  def __str__(self):
        return f"{self.email} - {self.otp} at {self.created_at.strftime('%Y-%m-%d %H:%M:%S')}"
  
class Guest(models.Model):
  name = models.CharField(max_length=255)
  email = models.EmailField(unique =True)
  def __str__(self):
    return f"{self.name} ({self.email})"
  
class MeetingRoom(models.Model):
  name = models.CharField(max_length=100)
  location = models.CharField(max_length=100)
  capacity = models.PositiveIntegerField()
  def __str__(self):
    return f"{self.name} ({self.location})"
  

class Booking(models.Model):
    creator_employee = models.ForeignKey(Employee, on_delete=models.CASCADE,related_name="created_bookings")
    room = models.ForeignKey(MeetingRoom, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
      return f"{self.room.name} | {self.start_time.strftime('%Y-%m-%d %H:%M')}"
    
class BookingParticipant(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE,related_name="participants")
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, null=True, blank=True)
    guest = models.ForeignKey(Guest, on_delete=models.CASCADE,null=True, blank=True)
    notified = models.BooleanField(default=False)

    def clean(self):
      if not self.employee and not self.guest:
        raise ValidationError("Either an employee or guest must be assigned.")
      if self.employee and self.guest:
        raise ValidationError("Only one of employee or guest should be assigned.")


    def __str__(self):
      if self.employee:
        return f"{self.employee.name} in Booking #{self.booking.id}"
      elif self.guest:
        return f"{self.guest.name} (Guest) in Booking #{self.booking.id}"
      else:
        return f"Unknown participant in Booking #{self.booking.id}"