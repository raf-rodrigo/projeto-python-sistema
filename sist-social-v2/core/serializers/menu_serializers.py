from rest_framework import serializers
from django.contrib.auth.models import Group
from core.models import Menu

class SubmenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'nome', 'url', 'icone', 'ordem']

class MenuSerializer(serializers.ModelSerializer):
    submenus = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = ['id', 'nome', 'url', 'icone', 'ordem', 'submenus']

    def get_submenus(self, obj):
        # Filtra apenas submenus ativos e ordenados para exibição do menu lateral
        ativos = obj.submenus.filter(ativo=True).order_by('ordem', 'nome')
        return SubmenuSerializer(ativos, many=True).data

class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ['id', 'name']

class MenuGerenciamentoSerializer(serializers.ModelSerializer):
    grupos_nomes = serializers.SerializerMethodField(read_only=True)
    pai_nome = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'nome', 'url', 'icone', 'pai', 'pai_nome', 'ordem', 'ativo', 'grupos', 'grupos_nomes']

    def get_grupos_nomes(self, obj):
        return [g.name for g in obj.grupos.all()]

    def get_pai_nome(self, obj):
        return obj.pai.nome if obj.pai else None
