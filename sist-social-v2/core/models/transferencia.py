from django.db import models
from django.contrib.auth.models import User
from core.models.unidade import Unidade
from core.models.familia import FamiliaDomicilio

class TransferenciaUnidade(models.Model):
    familia = models.ForeignKey(FamiliaDomicilio, on_delete=models.CASCADE, related_name='transferencias', verbose_name="Família")
    unidade_anterior = models.ForeignKey(Unidade, on_delete=models.SET_NULL, null=True, blank=True, related_name='transferencias_origem', verbose_name="Unidade Anterior")
    unidade_nova = models.ForeignKey(Unidade, on_delete=models.CASCADE, related_name='transferencias_destino', verbose_name="Unidade Nova")
    data_transferencia = models.DateTimeField(auto_now_add=True, verbose_name="Data da Transferência")
    operador = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Operador")
    justificativa = models.TextField(verbose_name="Justificativa")

    class Meta:
        db_table = 'transferencias_unidades'
        verbose_name = "Transferência de Unidade"
        verbose_name_plural = "Transferências de Unidades"
        ordering = ['-data_transferencia']

    def __str__(self):
        origem = self.unidade_anterior.nome_conhecido if self.unidade_anterior else "Unidade Geral"
        return f"FAM-{self.familia.id} de {origem} para {self.unidade_nova.nome_conhecido} em {self.data_transferencia.strftime('%d/%m/%Y')}"
