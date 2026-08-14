from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from core.models.atendimento import Atendimento
from core.serializers.atendimento_serializers import AtendimentoSerializer

class AtendimentoViewSet(viewsets.ModelViewSet):
    serializer_class = AtendimentoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['descricao_atendimento', 'pessoa__nome', 'tecnico__username', 'procedimentos_realizados']

    def get_queryset(self):
        # Soft delete ou filtros adicionais se necessários
        queryset = Atendimento.objects.filter(ativo=True).order_by('-data_atendimento', '-id')
        
        # Filtros por tipo, pessoa ou técnico
        tipo = self.request.query_params.get('tipo')
        if tipo:
            queryset = queryset.filter(tipo=tipo)
            
        pessoa_id = self.request.query_params.get('pessoa_id')
        if pessoa_id:
            queryset = queryset.filter(pessoa_id=pessoa_id)

        # Se o usuário não tiver a permissão de visualizar técnico detalhado, pode-se ocultar atendimentos técnicos
        if not self.request.user.has_perm('core.visualizar_atendimento_tecnico'):
            # Opcional: restringir acesso
            pass

        return queryset

    def perform_create(self, serializer):
        # Associa o técnico logado ao atendimento
        # Tenta associar a unidade do recurso humano se existir
        unidade = None
        if hasattr(self.request.user, 'recurso_humano'):
            # Se recurso_humano tiver vínculo direto de Unidade (podemos pegar do header da sessão se passado, 
            # ou usar a primeira unidade associada a ele)
            pass
        serializer.save(tecnico=self.request.user)

    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
