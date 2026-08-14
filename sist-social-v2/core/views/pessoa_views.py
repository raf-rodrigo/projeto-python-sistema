from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from core.models import Pessoa
from core.serializers import PessoaSerializer

class PessoaViewSet(viewsets.ModelViewSet):
    serializer_class = PessoaSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome', 'cpf', 'nis', 'nome_social']

    def get_queryset(self):
        # Soft delete: apenas ativos
        return Pessoa.objects.filter(ativo=True).order_by('nome')

    def perform_destroy(self, instance):
        # Soft delete
        instance.ativo = False
        instance.save()
