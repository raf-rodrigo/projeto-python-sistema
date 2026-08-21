import hashlib
import os

from rest_framework import serializers

from core.models import AtendimentoSocial, DocumentoAnexo, FamiliaDomicilio, Pessoa


class DocumentoAnexoSerializer(serializers.ModelSerializer):
    tipo_entidade = serializers.ChoiceField(choices=['atendimento', 'pessoa', 'familia'], write_only=True)
    entidade_id = serializers.IntegerField(min_value=1, write_only=True)
    enviado_por_nome = serializers.SerializerMethodField()

    class Meta:
        model = DocumentoAnexo
        fields = [
            'id', 'tipo_entidade', 'entidade_id', 'arquivo', 'nome_original',
            'tipo_mime', 'tamanho', 'hash_sha256', 'categoria', 'descricao',
            'data_documento', 'enviado_por_nome', 'criado_em', 'atualizado_em',
        ]
        read_only_fields = ['nome_original', 'tipo_mime', 'tamanho', 'hash_sha256', 'enviado_por_nome', 'criado_em', 'atualizado_em']

    def get_enviado_por_nome(self, obj):
        if not obj.enviado_por:
            return 'Usuário não informado'
        return obj.enviado_por.get_full_name() or obj.enviado_por.username

    def validate_arquivo(self, arquivo):
        limite = 10 * 1024 * 1024
        extensoes = {'.pdf', '.png', '.jpg', '.jpeg', '.doc', '.docx', '.xls', '.xlsx', '.odt', '.ods', '.txt'}
        extensao = os.path.splitext(arquivo.name)[1].lower()
        if arquivo.size > limite:
            raise serializers.ValidationError('O arquivo deve ter no máximo 10 MB.')
        if extensao not in extensoes:
            raise serializers.ValidationError('Formato não permitido. Envie PDF, imagem, documento de texto ou planilha.')
        return arquivo

    def validate(self, attrs):
        tipo = attrs.pop('tipo_entidade')
        entidade_id = attrs.pop('entidade_id')
        modelos = {
            'atendimento': (AtendimentoSocial, 'atendimento'),
            'pessoa': (Pessoa, 'pessoa'),
            'familia': (FamiliaDomicilio, 'familia'),
        }
        modelo, campo = modelos[tipo]
        try:
            entidade = modelo.objects.get(pk=entidade_id)
        except modelo.DoesNotExist:
            raise serializers.ValidationError({'entidade_id': 'Registro relacionado não encontrado.'})
        attrs[campo] = entidade
        return attrs

    def create(self, validated_data):
        arquivo = validated_data['arquivo']
        digest = hashlib.sha256()
        for bloco in arquivo.chunks():
            digest.update(bloco)
        arquivo.seek(0)
        request = self.context.get('request')
        validated_data.update({
            'nome_original': os.path.basename(arquivo.name),
            'tipo_mime': getattr(arquivo, 'content_type', '') or '',
            'tamanho': arquivo.size,
            'hash_sha256': digest.hexdigest(),
            'enviado_por': request.user if request and request.user.is_authenticated else None,
        })
        return super().create(validated_data)
