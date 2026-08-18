from rest_framework import serializers
from core.models.transferencia import TransferenciaUnidade

class TransferenciaUnidadeSerializer(serializers.ModelSerializer):
    unidade_anterior_nome = serializers.CharField(source='unidade_anterior.nome_conhecido', read_only=True, default='Unidade Geral')
    unidade_nova_nome = serializers.CharField(source='unidade_nova.nome_conhecido', read_only=True)
    operador_nome = serializers.SerializerMethodField()

    class Meta:
        model = TransferenciaUnidade
        fields = '__all__'

    def get_operador_nome(self, obj):
        if obj.operador:
            return f"{obj.operador.first_name} {obj.operador.last_name}".strip() or obj.operador.username
        return "Sistema"
