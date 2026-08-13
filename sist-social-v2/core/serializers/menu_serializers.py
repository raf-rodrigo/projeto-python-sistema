from rest_framework import serializers
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
        ativos = obj.submenus.filter(ativo=True).order_by('ordem', 'nome')
        return SubmenuSerializer(ativos, many=True).data
