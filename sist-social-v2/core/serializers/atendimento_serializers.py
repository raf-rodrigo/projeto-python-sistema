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
                "data_atendimento": obj.origem_atendimento.data_atendimento,
                "descricao_sumaria_atendimento": obj.origem_atendimento.descricao_sumaria_atendimento,
                "observacoes": obj.origem_atendimento.observacoes,
                "prontuario": obj.origem_atendimento.prontuario,
                "unidade": UnidadeSerializer(obj.origem_atendimento.unidade_atendimento_social).data if obj.origem_atendimento.unidade_atendimento_social else None,
                "motivo_atendimento": MotivoAtendimentoSerializer(obj.origem_atendimento.motivo_atendimento).data if obj.origem_atendimento.motivo_atendimento else None,
                "tipo_atendimento": TiposAtendimentosSerializer(obj.origem_atendimento.tipo_atendimento).data if obj.origem_atendimento.tipo_atendimento else None,
                "tecnico_responsavel": UserSerializer(obj.origem_atendimento.tecnico_responsavel_inicial).data if obj.origem_atendimento.tecnico_responsavel_inicial else None,
                "funcao_tecnico_responsavel": obj.origem_atendimento.funcao_tecnico_responsavel_inicial
            }
        return None
