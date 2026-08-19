from rest_framework import serializers
from core.models.configuracao import Configuracao

class ConfiguracaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Configuracao
        fields = '__all__'
