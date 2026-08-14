from rest_framework import serializers
from core.models.atendimento import Atendimento
from core.serializers.pessoa_serializers import PessoaSerializer
from core.serializers.unidade_serializers import UnidadeSerializer
from core.serializers.user_serializers import UserSerializer
from core.serializers.tabela_basica_serializers import TiposAtendimentosSerializer

class AtendimentoSerializer(serializers.ModelSerializer):
    # Serializers aninhados para exibição detalhada
    pessoa_details = PessoaSerializer(source='pessoa', read_only=True)
    unidade_details = UnidadeSerializer(source='unidade', read_only=True)
    tecnico_details = UserSerializer(source='tecnico', read_only=True)
    tipo_atendimento_details = TiposAtendimentosSerializer(source='tipo_atendimento', read_only=True)

    class Meta:
        model = Atendimento
        fields = '__all__'
