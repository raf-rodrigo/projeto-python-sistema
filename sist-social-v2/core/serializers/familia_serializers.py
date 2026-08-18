from rest_framework import serializers
from core.models import FamiliaDomicilio

from core.serializers.unidade_serializers import UnidadeSerializer

class FamiliaDomicilioSerializer(serializers.ModelSerializer):
    unidade_atendimento_social_familia_details = UnidadeSerializer(source='unidade_atendimento_social_familia', read_only=True)
    responsavel_familiar_nome = serializers.SerializerMethodField()

    class Meta:
        model = FamiliaDomicilio
        fields = '__all__'

    def get_responsavel_familiar_nome(self, obj):
        # Procura o membro que seja a pessoa de referência (RF)
        rf = obj.membros.filter(tipo_parentesco__nome__icontains='referência').first()
        if not rf:
            # Caso não tenha, tenta pegar qualquer membro
            rf = obj.membros.first()
        return rf.nome if rf else 'NÃO CADASTRADO'
