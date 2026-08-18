from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from core.models.atendimento import AtendimentoSocial
from core.serializers.atendimento_serializers import AtendimentoSocialSerializer

class AtendimentoViewSet(viewsets.ModelViewSet):
    serializer_class = AtendimentoSocialSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'descricao_sumaria_atendimento', 
        'descricao_atendimento_tecnico', 
        'pessoa__nome', 
        'tecnico_responsavel_inicial__username', 
        'tecnico_responsavel_tecnico__username'
    ]

    def get_queryset(self):
        # Filtra registros ativos e ordena por data decrescente
        queryset = AtendimentoSocial.objects.filter(ativo=True).order_by('-data_atendimento', '-id')
        
        # Filtro por modalidade (Simplificado ou Tecnico)
        modalidade = self.request.query_params.get('modalidade')
        if modalidade:
            queryset = queryset.filter(modalidade=modalidade)
            
        pessoa_id = self.request.query_params.get('pessoa_id')
        if pessoa_id:
            queryset = queryset.filter(pessoa_id=pessoa_id)

        # Se o usuário não tiver a permissão de visualizar técnico detalhado, ocultar os do tipo técnico
        if not self.request.user.has_perm('core.visualizar_atendimento_tecnico'):
            queryset = queryset.filter(modalidade='Simplificado')

        return queryset

    def perform_create(self, serializer):
        # Auto-preencher o técnico inicial se estiver criando
        # Podemos recuperar a função a partir do recurso humano do usuário logado se existir
        funcao = ""
        if hasattr(self.request.user, 'recurso_humano'):
            funcao = self.request.user.recurso_humano.funcao or ""
            
        # Pega a modalidade enviada para salvar o técnico correspondente
        modalidade = self.request.data.get('modalidade', 'Simplificado')
        
        if modalidade == 'Tecnico':
            serializer.save(
                tecnico_responsavel_tecnico=self.request.user,
                funcao_tecnico_responsavel_tecnico=funcao
            )
        else:
            serializer.save(
                tecnico_responsavel_inicial=self.request.user,
                funcao_tecnico_responsavel_inicial=funcao
            )

    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
