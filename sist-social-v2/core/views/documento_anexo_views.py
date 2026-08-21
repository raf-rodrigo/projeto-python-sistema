from django.http import FileResponse
from rest_framework import parsers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.models import DocumentoAnexo
from core.serializers import DocumentoAnexoSerializer


class DocumentoAnexoViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentoAnexoSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    http_method_names = ['get', 'post', 'delete', 'head', 'options']

    def get_queryset(self):
        queryset = DocumentoAnexo.objects.filter(ativo=True).select_related('enviado_por')
        tipo = self.request.query_params.get('tipo_entidade')
        entidade_id = self.request.query_params.get('entidade_id')
        campos = {'atendimento': 'atendimento_id', 'pessoa': 'pessoa_id', 'familia': 'familia_id'}
        if tipo in campos and entidade_id:
            queryset = queryset.filter(**{campos[tipo]: entidade_id})
        elif self.action == 'list':
            return queryset.none()
        return queryset

    def destroy(self, request, *args, **kwargs):
        documento = self.get_object()
        documento.ativo = False
        documento.save(update_fields=['ativo', 'atualizado_em'])
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        documento = self.get_object()
        return FileResponse(
            documento.arquivo.open('rb'),
            as_attachment=True,
            filename=documento.nome_original,
            content_type=documento.tipo_mime or 'application/octet-stream',
        )
