from rest_framework import serializers
from core.models import Pessoa, PessoaSituacaoRua
from core.serializers.tabela_basica_serializers import TipoParentescoSerializer

class PessoaSituacaoRuaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PessoaSituacaoRua
        exclude = ['pessoa']

class PessoaSerializer(serializers.ModelSerializer):
    # Opcional: detalhes da relação e da família para exibição facilitada no grid
    familia_details = serializers.SerializerMethodField()
    parentesco_details = TipoParentescoSerializer(source='tipo_parentesco', read_only=True)
    situacao_rua_detalhes = PessoaSituacaoRuaSerializer(required=False, allow_null=True)

    class Meta:
        model = Pessoa
        fields = '__all__'

    def get_familia_details(self, obj):
        if not obj.familia_domicilio:
            return None
        return {
            "id": obj.familia_domicilio.id,
            "familia_codigo": obj.familia_domicilio.familia_codigo or f"FAM-{obj.familia_domicilio.id}",
            "logradouro_nome": obj.familia_domicilio.logradouro_nome,
            "logradouro_numero": obj.familia_domicilio.logradouro_numero,
            "bairro": obj.familia_domicilio.bairro
        }

    def create(self, validated_data):
        situacao_rua_detalhes_data = validated_data.pop('situacao_rua_detalhes', None)
        pessoa = Pessoa.objects.create(**validated_data)
        if pessoa.situacao_de_rua == 'Sim' and situacao_rua_detalhes_data:
            PessoaSituacaoRua.objects.create(pessoa=pessoa, **situacao_rua_detalhes_data)
        return pessoa

    def update(self, instance, validated_data):
        situacao_rua_detalhes_data = validated_data.pop('situacao_rua_detalhes', None)
        instance = super().update(instance, validated_data)
        
        if instance.situacao_de_rua == 'Sim':
            if situacao_rua_detalhes_data:
                PessoaSituacaoRua.objects.update_or_create(
                    pessoa=instance,
                    defaults=situacao_rua_detalhes_data
                )
        else:
            # Se deixou de ser situação de rua, limpamos os detalhes
            PessoaSituacaoRua.objects.filter(pessoa=instance).delete()
            
        return instance
