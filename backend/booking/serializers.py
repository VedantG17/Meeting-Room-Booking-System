from rest_framework import serializers
from .models import MeetingRoom

class MeetingRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingRoom
        fields = '__all__'
