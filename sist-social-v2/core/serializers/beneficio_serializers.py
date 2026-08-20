from rest_framework import serializers
from core.models.beneficio import Beneficio
from core.serializers.tabela_basica_serializers import TipoBeneficioSerializer

class BeneficioSerializer(serializers.ModelSerializer):
    tipo_beneficio_details = TipoBeneficioSerializer(source='tipo_beneficio', read_only=True)
    pessoa_nome = serializers.ReadOnlyField(source='pessoa.nome')
    tecnico_concessao_nome = serializers.SerializerMethodField()
    tecnico_entrega_nome = serializers.SerializerMethodField()
    unidade_nome = serializers.ReadOnlyField(source='unidade.nome_conhecido')

    class Meta:
        model = Beneficio
        fields = '__all__'

    def get_tecnico_concessao_nome(self, obj):
        if obj.profissional:
            return f"{obj.profissional.first_name} {obj.profissional.last_name}".strip() or obj.profissional.username
        return 'N/A'

    def get_tecnico_entrega_nome(self, obj):
        if obj.tecnico_entrega:
            return f"{obj.tecnico_entrega.first_name} {obj.tecnico_entrega.last_name}".strip() or obj.tecnico_entrega.username
        return 'N/A'
