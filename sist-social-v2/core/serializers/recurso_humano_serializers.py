from rest_framework import serializers
from core.models import RecursoHumano

class RecursoHumanoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecursoHumano
        exclude = ['usuario']
        extra_kwargs = {
            'orgao': {'required': True, 'allow_null': False, 'allow_blank': False},
            'tipo_servidor': {'required': True, 'allow_null': False, 'allow_blank': False},
            'profissao': {'required': True, 'allow_null': False, 'allow_blank': False},
            'funcao': {'required': True, 'allow_null': False, 'allow_blank': False},
            'num_conselho_classe': {'required': True, 'allow_null': False, 'allow_blank': False},
        }

    # Validação matemática do campo CPF
    def validate_cpf(self, value):
        # 1. Limpa o CPF mantendo apenas números
        cpf = ''.join(filter(str.isdigit, value))

        # 2. Verifica se tem 11 dígitos
        if len(cpf) != 11:
            raise serializers.ValidationError("CPF deve conter exatamente 11 dígitos.")

        # 3. Bloqueia sequências de números repetidos (ex: 111.111.111-11)
        if cpf == cpf[0] * 11:
            raise serializers.ValidationError("Este CPF é inválido.")

        # 4. Cálculo matemático do primeiro dígito verificador
        soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
        resto = (soma * 10) % 11
        if resto in (10, 11):
            resto = 0
        if resto != int(cpf[9]):
            raise serializers.ValidationError("Este CPF é inválido.")

        # 5. Cálculo matemático do segundo dígito verificador
        soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
        resto = (soma * 10) % 11
        if resto in (10, 11):
            resto = 0
        if resto != int(cpf[10]):
            raise serializers.ValidationError("Este CPF é inválido.")

        # Retorna o valor original
        return value
