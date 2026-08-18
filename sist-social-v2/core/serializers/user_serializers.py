import unicodedata
from rest_framework import serializers
from django.contrib.auth.models import User
from core.models import RecursoHumano
from .recurso_humano_serializers import RecursoHumanoSerializer

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    grupos_nomes = serializers.SerializerMethodField()
    
    # Campo aninhado para receber e enviar os dados cadastrais/profissionais
    perfil = RecursoHumanoSerializer(source='recurso_humano', required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_active', 'password', 'groups', 'grupos_nomes', 'perfil']
        extra_kwargs = {
            'username': {'required': False}
        }

    def get_grupos_nomes(self, obj):
        return [grupo.name for grupo in obj.groups.all()]

    def create(self, validated_data):
        # Remove os dados do perfil aninhado antes de criar o usuário
        perfil_data = validated_data.pop('recurso_humano', None)
        password = validated_data.pop('password', None)
        groups_data = validated_data.pop('groups', [])
        
        first_name = validated_data.get('first_name', '').strip()
        last_name = validated_data.get('last_name', '').strip()

        if not first_name:
            raise serializers.ValidationError({'first_name': 'O primeiro nome é obrigatório para gerar o usuário.'})

        # Regra de geração automática do login
        primeira_letra = first_name[0].lower()
        ultimo_sobrenome = last_name.split()[-1].lower() if last_name else ''
        username_base = f"{primeira_letra}{ultimo_sobrenome}"

        username_base = "".join(
            c for c in unicodedata.normalize('NFD', username_base)
            if unicodedata.category(c) != 'Mn'
        )
        username_base = "".join(c for c in username_base if c.isalnum())

        username = username_base
        contador = 1
        while User.objects.filter(username=username).exists():
            username = f"{username_base}{contador}"
            contador += 1

        validated_data['username'] = username

        # Cria o Usuário base
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        
        user.groups.set(groups_data)

        # Cria o Perfil de Recurso Humano vinculado
        if perfil_data:
            unidades_ids = perfil_data.pop('unidades', [])
            rh = RecursoHumano.objects.create(usuario=user, **perfil_data)
            if unidades_ids:
                rh.unidades.set(unidades_ids)
        else:
            RecursoHumano.objects.create(usuario=user)

        return user

    def update(self, instance, validated_data):
        # Remove os dados do perfil aninhado antes de atualizar o usuário
        perfil_data = validated_data.pop('recurso_humano', None)
        password = validated_data.pop('password', None)
        groups_data = validated_data.pop('groups', None)

        # Atualiza o Usuário
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)
        instance.save()

        if groups_data is not None:
            instance.groups.set(groups_data)

        # Atualiza o Perfil do Recurso Humano relacionado
        if perfil_data:
            perfil_instance, created = RecursoHumano.objects.get_or_create(usuario=instance)
            unidades_ids = perfil_data.pop('unidades', None)
            for attr, value in perfil_data.items():
                setattr(perfil_instance, attr, value)
            perfil_instance.save()
            if unidades_ids is not None:
                perfil_instance.unidades.set(unidades_ids)

        return instance
