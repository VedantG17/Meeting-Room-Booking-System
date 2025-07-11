from django.db import models

# Create your models here.
class Employee(models.Model):
  name = models.CharField(max_length=100)
  password_hash = models.CharField(max_length=255)
  is_active = models.BooleanField(default=True)
  def __str__(self):
    return self.name

class Domain(models.Model):
  domain = models.CharField(max_length=100, unique=True)
  def __str__(self):
    return self.domain

class EmployeeEmail(models.Model):
  employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
  email = models.EmailField(unique=True)
  domain = models.ForeignKey(Domain,on_delete=models.CASCADE)
  verified = models.BooleanField(default=False)
  def __str__(self):
    return self.email
  
class MeetingRoom(models.Model):
  name = models.CharField(max_length=100)
  location = models.CharField(max_length=100)
  capacity = models.PositiveIntegerField()
  available = models.BooleanField(default=True)
  def __str__(self):
    return f"{self.name} ({self.location})"
  

class Booking(models.Model):
    STATUS_CHOICES = (
        ('upcoming', 'Upcoming'),
        ('completed', 'Completed'),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    room = models.ForeignKey(MeetingRoom, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
      return f"{self.room.name} | {self.start_time.strftime('%Y-%m-%d %H:%M')}"
    
class BookingParticipant(models.Model):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE)
    notified = models.BooleanField(default=False)

    def __str__(self):
      return f"{self.employee.name} in {self.booking}"