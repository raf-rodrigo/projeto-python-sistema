from rest_framework import viewsets, filters
from core.models.beneficio import Beneficio
from core.serializers.beneficio_serializers import BeneficioSerializer

class BeneficioViewSet(viewsets.ModelViewSet):
    serializer_class = BeneficioSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['observacao', 'profissional_funcao']

    def get_queryset(self):
        queryset = Beneficio.objects.filter(ativo=True).order_by('-data_beneficio')
        
        # Filtros manuais via query parameters
        familia_id = self.request.query_params.get('familia')
        if familia_id:
            queryset = queryset.filter(familia_id=familia_id)
            
        pessoa_id = self.request.query_params.get('pessoa')
        if pessoa_id:
            queryset = queryset.filter(pessoa_id=pessoa_id)
            
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
            
        unidade_id = self.request.query_params.get('unidade')
        if unidade_id:
            queryset = queryset.filter(unidade_id=unidade_id)
            
        return queryset

    def perform_destroy(self, instance):
        # Soft delete
        instance.ativo = False
        instance.save()
