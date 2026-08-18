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

    def perform_update(self, serializer):
        from core.models.transferencia_pessoa import TransferenciaPessoa
        instance = self.get_object()
        
        old_familia = instance.familia_domicilio
        old_parentesco = instance.tipo_parentesco
        
        new_familia_id = self.request.data.get('familia_domicilio')
        new_parentesco_id = self.request.data.get('tipo_parentesco')
        
        motivo = self.request.data.get('motivo_transferencia')
        observacoes = self.request.data.get('observacoes_transferencia')

        updated_instance = serializer.save()

        # Verifica se houve troca de família
        if new_familia_id and str(old_familia.id if old_familia else '') != str(new_familia_id):
            TransferenciaPessoa.objects.create(
                pessoa=updated_instance,
                familia_anterior=old_familia,
                familia_nova_id=int(new_familia_id),
                parentesco_anterior=old_parentesco,
                parentesco_novo_id=int(new_parentesco_id) if new_parentesco_id else updated_instance.tipo_parentesco_id,
                operador=self.request.user,
                motivo=motivo or 'Outros',
                observacoes=observacoes or 'Transferência manual de família.'
            )

    def perform_destroy(self, instance):
        # Soft delete
        instance.ativo = False
        instance.save()
