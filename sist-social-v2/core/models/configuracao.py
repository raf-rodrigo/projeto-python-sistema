from django.db import models

class Configuracao(models.Model):
    chave = models.CharField(max_length=100, unique=True, verbose_name="Chave")
    descricao = models.CharField(max_length=250, null=True, blank=True, verbose_name="Descrição")
    valor = models.CharField(max_length=100, null=True, blank=True, verbose_name="Valor")
    validacao = models.CharField(max_length=100, null=True, blank=True, verbose_name="Validação")

    class Meta:
        db_table = 'configuracoes'
        verbose_name = "Configuração do Sistema"
        verbose_name_plural = "Configurações do Sistema"

    def __str__(self):
        return f"{self.chave}: {self.valor}"
