from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from core.models import FamiliaDomicilio
from core.serializers import FamiliaDomicilioSerializer

class FamiliaDomicilioViewSet(viewsets.ModelViewSet):
    serializer_class = FamiliaDomicilioSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = [
        'familia_codigo', 
        'domicilio__logradouro_nome', 
        'domicilio__bairro', 
        'domicilio__cidade', 
        'logradouro_nome', 
        'bairro', 
        'cidade'
    ]

    def get_queryset(self):
        # Soft delete: apenas ativos
        return FamiliaDomicilio.objects.filter(ativo=True).order_by('-id')

    def perform_update(self, serializer):
        from core.models.transferencia import TransferenciaUnidade
        instance = self.get_object()
        
        # Verifica se houve alteração de unidade de atendimento
        old_unidade = instance.unidade_atendimento_social_familia
        new_unidade_id = self.request.data.get('unidade_atendimento_social_familia')
        justificativa = self.request.data.get('justificativa_transferencia')

        # Executa o salvamento padrão do django rest framework
        updated_instance = serializer.save()

        if new_unidade_id and str(old_unidade.id if old_unidade else '') != str(new_unidade_id):
            # Cria a transferência se for especificado a justificativa
            TransferenciaUnidade.objects.create(
                familia=updated_instance,
                unidade_anterior=old_unidade,
                unidade_nova_id=int(new_unidade_id),
                operador=self.request.user,
                justificativa=justificativa or "Transferência manual via painel do operador."
            )

    def perform_destroy(self, instance):
        # Soft delete
        instance.ativo = False
        instance.save()
