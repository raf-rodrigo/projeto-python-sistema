from rest_framework import serializers
from core.models import FamiliaDomicilio, Domicilio
from core.serializers.unidade_serializers import UnidadeSerializer

class DomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domicilio
        fields = '__all__'

class FamiliaDomicilioSerializer(serializers.ModelSerializer):
    unidade_atendimento_social_familia_details = UnidadeSerializer(source='unidade_atendimento_social_familia', read_only=True)
    domicilio_details = DomicilioSerializer(source='domicilio', read_only=True)
    
    responsavel_familiar_nome = serializers.SerializerMethodField()
    prontuario = serializers.SerializerMethodField()
    nis = serializers.SerializerMethodField()
    cpf = serializers.SerializerMethodField()
    telefone = serializers.SerializerMethodField()
    pbf = serializers.SerializerMethodField()
    ext_pobreza = serializers.SerializerMethodField()
    transferencias_details = serializers.SerializerMethodField()
    membros_details = serializers.SerializerMethodField()

    class Meta:
        model = FamiliaDomicilio
        fields = '__all__'

    def get_membros_details(self, obj):
        from core.serializers.pessoa_serializers import PessoaSerializer
        membros = obj.membros.filter(ativo=True).order_by('nome')
        return PessoaSerializer(membros, many=True).data

    def get_transferencias_details(self, obj):
        from core.serializers.transferencia_serializers import TransferenciaUnidadeSerializer
        objs = obj.transferencias.all().order_by('-data_transferencia')
        return TransferenciaUnidadeSerializer(objs, many=True).data

    def get_responsavel_familiar_nome(self, obj):
        rf = obj.membros.filter(tipo_parentesco_id=1).first()
        return rf.nome if rf else 'AGUARDANDO CADASTRO DE RF'

    def get_prontuario(self, obj):
        return f"SADS-{obj.id}"

    def get_nis(self, obj):
        rf = obj.membros.filter(tipo_parentesco_id=1).first()
        return rf.nis if (rf and rf.nis) else 'N/A'

    def get_cpf(self, obj):
        rf = obj.membros.filter(tipo_parentesco_id=1).first()
        return rf.cpf if (rf and rf.cpf) else 'N/A'

    def get_telefone(self, obj):
        rf = obj.membros.filter(tipo_parentesco_id=1).first()
        if not rf:
            return 'N/A'
        return rf.telefone or rf.celular or 'N/A'

    def get_pbf(self, obj):
        return obj.beneficio_bolsa_familia or 'Não'

    def get_ext_pobreza(self, obj):
        if obj.renda_per_capita_sem_programas_sociais is not None:
            return 'Sim' if obj.renda_per_capita_sem_programas_sociais <= 218.00 else 'Não'
        return 'Sim'

    def create(self, validated_data):
        # Permite gravação/criação aninhada transparente
        request = self.context.get('request')
        domicilio_data = request.data.get('domicilio_details') if request else None
        
        if domicilio_data:
            domicilio = Domicilio.objects.create(**domicilio_data)
            validated_data['domicilio'] = domicilio
            
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        domicilio_data = request.data.get('domicilio_details') if request else None
        
        if domicilio_data:
            if instance.domicilio:
                # Atualiza o domicílio existente
                for attr, value in domicilio_data.items():
                    setattr(instance.domicilio, attr, value)
                instance.domicilio.save()
            else:
                # Cria novo domicílio e vincula
                domicilio = Domicilio.objects.create(**domicilio_data)
                instance.domicilio = domicilio
                
        return super().update(instance, validated_data)
