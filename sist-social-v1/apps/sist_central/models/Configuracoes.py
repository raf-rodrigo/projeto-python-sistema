from django.db import models

class Configuracoes(models.Model):
    id = models.AutoField(primary_key=True)
    chave = models.CharField(max_length=100, unique=True, null=True, blank=True)
    descricao = models.CharField(max_length=250, null=True, blank=True)
    valor = models.CharField(max_length=100, null=True, blank=True)
    validacao = models.CharField(max_length=100, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'configuracoes'

    def __str__(self):
        return f"{self.descricao or self.chave}: {self.valor}"
