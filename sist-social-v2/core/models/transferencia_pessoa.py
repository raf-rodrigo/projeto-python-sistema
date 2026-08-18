from django.db import models
from django.contrib.auth.models import User
from core.models.pessoa import Pessoa
from core.models.familia import FamiliaDomicilio
from core.models.tabela_basica import TipoParentesco

class TransferenciaPessoa(models.Model):
    MOTIVOS_CHOICES = [
        ('Casamento/União', 'Casamento/União'),
        ('Separação/Divórcio', 'Separação/Divórcio'),
        ('Independência Financeira', 'Independência Financeira'),
        ('Mudança de Residência', 'Mudança de Residência'),
        ('Correção de Cadastro', 'Correção de Cadastro'),
        ('Outros', 'Outros'),
    ]

    pessoa = models.ForeignKey(Pessoa, on_delete=models.CASCADE, related_name='transferencias_familia', verbose_name="Pessoa")
    familia_anterior = models.ForeignKey(FamiliaDomicilio, on_delete=models.SET_NULL, null=True, blank=True, related_name='transferencias_saida_membros', verbose_name="Família Anterior")
    familia_nova = models.ForeignKey(FamiliaDomicilio, on_delete=models.CASCADE, related_name='transferencias_entrada_membros', verbose_name="Família Nova")
    parentesco_anterior = models.ForeignKey(TipoParentesco, on_delete=models.SET_NULL, null=True, blank=True, related_name='transferencias_anterior', verbose_name="Parentesco Anterior")
    parentesco_novo = models.ForeignKey(TipoParentesco, on_delete=models.CASCADE, related_name='transferencias_novo', verbose_name="Parentesco Novo")
    data_transferencia = models.DateTimeField(auto_now_add=True, verbose_name="Data da Transferência")
    operador = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Operador")
    motivo = models.CharField(max_length=100, choices=MOTIVOS_CHOICES, verbose_name="Motivo")
    observacoes = models.TextField(null=True, blank=True, verbose_name="Observações")

    class Meta:
        db_table = 'transferencias_pessoas'
        verbose_name = "Transferência de Pessoa entre Famílias"
        verbose_name_plural = "Transferências de Pessoas entre Famílias"
        ordering = ['-data_transferencia']

    def __str__(self):
        return f"{self.pessoa.nome} para FAM-{self.familia_nova.id} em {self.data_transferencia.strftime('%d/%m/%Y')}"
