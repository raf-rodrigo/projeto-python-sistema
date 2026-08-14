from rest_framework import serializers
from core.models import FamiliaDomicilio

class FamiliaDomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamiliaDomicilio
        fields = '__all__'
