# Register your models here.
from django.contrib import admin
from .models import Employee, OtpModels, MeetingRoom, Booking, BookingParticipant,Guest

admin.site.register(Employee)
admin.site.register(OtpModels)
admin.site.register(MeetingRoom)
admin.site.register(Booking)
admin.site.register(BookingParticipant)
admin.site.register(Guest)


