from django.db import models
from django.contrib.auth.models import User

class AuditoriaLog(models.Model):
    ACOES_CHOICES = [
        ('CREATE', 'Criação'),
        ('UPDATE', 'Atualização'),
        ('DELETE', 'Exclusão'),
    ]

    data_hora = models.DateTimeField(auto_now_add=True, verbose_name="Data e Hora")
    usuario = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Operador")
    modelo = models.CharField(max_length=100, verbose_name="Tabela/Modelo")
    registro_id = models.IntegerField(verbose_name="ID do Registro")
    acao = models.CharField(max_length=10, choices=ACOES_CHOICES, verbose_name="Ação")
    
    # Armazena modificações em formato JSON:
    # { "campo": { "antigo": "valor_a", "novo": "valor_b" } }
    modificacoes = models.JSONField(verbose_name="Modificações (De/Para)")

    class Meta:
        db_table = 'auditoria_log'
        verbose_name = "Log de Auditoria"
        verbose_name_plural = "Logs de Auditoria"
        ordering = ['-data_hora']

    def __str__(self):
        return f"{self.acao} - {self.modelo} ({self.registro_id}) em {self.data_hora.strftime('%d/%m/%Y %H:%M')}"
