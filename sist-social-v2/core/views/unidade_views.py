from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from core.models import Area, Unidade
from core.serializers import AreaSerializer, UnidadeSerializer

class AreaViewSet(viewsets.ModelViewSet):
    serializer_class = AreaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome', 'descricao']

    def get_queryset(self):
        # Soft delete: lista apenas ativos
        return Area.objects.filter(ativo=True).order_by('nome')

    def perform_destroy(self, instance):
        # Soft delete
        instance.ativo = False
        instance.save()

class UnidadeViewSet(viewsets.ModelViewSet):
    serializer_class = UnidadeSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome_conhecido', 'razao_social', 'sigla', 'cnpj']

    def get_queryset(self):
        # Soft delete: lista apenas ativos
        return Unidade.objects.filter(ativo=True).order_by('nome_conhecido')

    def perform_destroy(self, instance):
        # Soft delete
        instance.ativo = False
        instance.save()
