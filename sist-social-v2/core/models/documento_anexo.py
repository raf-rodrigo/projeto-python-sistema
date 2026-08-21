import os

from django.contrib.auth.models import User
from django.db import models
from django.db.models import Q

from core.models.atendimento import AtendimentoSocial
from core.models.familia import FamiliaDomicilio
from core.models.pessoa import Pessoa


class DocumentoAnexo(models.Model):
    CATEGORIA_CHOICES = [
        ('Documento pessoal', 'Documento pessoal'),
        ('Relatório', 'Relatório'),
        ('Comprovante', 'Comprovante'),
        ('Termo', 'Termo'),
        ('Imagem', 'Imagem'),
        ('Outro', 'Outro'),
    ]

    atendimento = models.ForeignKey(AtendimentoSocial, on_delete=models.CASCADE, null=True, blank=True, related_name='documentos_anexos')
    pessoa = models.ForeignKey(Pessoa, on_delete=models.CASCADE, null=True, blank=True, related_name='documentos_anexos')
    familia = models.ForeignKey(FamiliaDomicilio, on_delete=models.CASCADE, null=True, blank=True, related_name='documentos_anexos')
    arquivo = models.FileField(upload_to='documentos/%Y/%m/')
    nome_original = models.CharField(max_length=255)
    tipo_mime = models.CharField(max_length=150, blank=True)
    tamanho = models.PositiveBigIntegerField()
    hash_sha256 = models.CharField(max_length=64, db_index=True)
    categoria = models.CharField(max_length=30, choices=CATEGORIA_CHOICES, default='Outro')
    descricao = models.TextField(blank=True)
    data_documento = models.DateField(null=True, blank=True)
    enviado_por = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='documentos_enviados')
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    ativo = models.BooleanField(default=True)

    class Meta:
        db_table = 'documentos_anexos'
        ordering = ['-criado_em']
        constraints = [
            models.CheckConstraint(
                condition=(
                    (Q(atendimento__isnull=False) & Q(pessoa__isnull=True) & Q(familia__isnull=True)) |
                    (Q(atendimento__isnull=True) & Q(pessoa__isnull=False) & Q(familia__isnull=True)) |
                    (Q(atendimento__isnull=True) & Q(pessoa__isnull=True) & Q(familia__isnull=False))
                ),
                name='documento_anexo_um_vinculo',
            )
        ]
        indexes = [
            models.Index(fields=['atendimento', 'ativo']),
            models.Index(fields=['pessoa', 'ativo']),
            models.Index(fields=['familia', 'ativo']),
        ]

    def __str__(self):
        return self.nome_original or os.path.basename(self.arquivo.name)
