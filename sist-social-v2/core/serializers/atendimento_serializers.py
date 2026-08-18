from rest_framework import serializers
from core.models.atendimento import AtendimentoSocial
from core.serializers.pessoa_serializers import PessoaSerializer
from core.serializers.unidade_serializers import UnidadeSerializer
from core.serializers.user_serializers import UserSerializer
from core.serializers.tabela_basica_serializers import TiposAtendimentosSerializer, MotivoAtendimentoSerializer
from core.serializers.familia_serializers import FamiliaDomicilioSerializer

class AtendimentoSocialSerializer(serializers.ModelSerializer):
    # Serializers aninhados para exibição detalhada na listagem
    pessoa_details = PessoaSerializer(source='pessoa', read_only=True)
    familia_details = FamiliaDomicilioSerializer(source='familia', read_only=True)
    unidade_details = UnidadeSerializer(source='unidade_atendimento_social', read_only=True)
    tecnico_responsavel_inicial_details = UserSerializer(source='tecnico_responsavel_inicial', read_only=True)
    tecnico_responsavel_tecnico_details = UserSerializer(source='tecnico_responsavel_tecnico', read_only=True)
    motivo_atendimento_details = MotivoAtendimentoSerializer(source='motivo_atendimento', read_only=True)
    tipo_atendimento_details = TiposAtendimentosSerializer(source='tipo_atendimento', read_only=True)
    origem_atendimento_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = AtendimentoSocial
        fields = '__all__'

    def get_origem_atendimento_details(self, obj):
        if obj.origem_atendimento:
            return {
                "id": obj.origem_atendimento.id,
                "codigo_atendimento": obj.origem_atendimento.codigo_atendimento,
                "data_atendimento": obj.origem_atendimento.data_atendimento
            }
        return None
