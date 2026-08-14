from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from core.models import FamiliaDomicilio
from core.serializers import FamiliaDomicilioSerializer

class FamiliaDomicilioViewSet(viewsets.ModelViewSet):
    serializer_class = FamiliaDomicilioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['familia_codigo', 'logradouro_nome', 'bairro', 'cidade']

    def get_queryset(self):
        # Soft delete: apenas ativos
        return FamiliaDomicilio.objects.filter(ativo=True).order_by('-id')

    def perform_destroy(self, instance):
        # Soft delete
        instance.ativo = False
        instance.save()
