from rest_framework import serializers
from core.models import Area, Unidade
from core.serializers.tabela_basica_serializers import TipoUnidadeSerializer

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class UnidadeSerializer(serializers.ModelSerializer):
    tipo_unidade_details = TipoUnidadeSerializer(source='tipo_unidade', read_only=True)
    area_atuacao_details = AreaSerializer(source='area_atuacao', read_only=True)

    class Meta:
        model = Unidade
        fields = '__all__'
