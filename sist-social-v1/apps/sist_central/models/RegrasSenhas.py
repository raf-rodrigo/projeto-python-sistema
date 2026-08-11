from django.db import models

class RegrasSenhas(models.Model):
    id = models.AutoField(primary_key=True)
    validade_senha = models.IntegerField(default=180)
    quantidade_minuscula = models.IntegerField(default=0)
    quantidade_maiuscula = models.IntegerField(default=0)
    quantidade_caracteres_especiais = models.IntegerField(default=0)
    tempo_recuperacao = models.IntegerField(null=True, blank=True, default=0)
    quantidade_minima_caracteres = models.IntegerField(null=True, blank=True, default=8)
    permitir_reutilizacao = models.IntegerField(null=True, blank=True, default=0)
    tempo_aviso = models.IntegerField(null=True, blank=True, default=10)

    class Meta:
        managed = False
        db_table = 'regras_senhas'

    def __str__(self):
        return f"Regra de Senha (ID {self.id})"
