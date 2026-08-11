from django.db import models

class Modulo(models.Model):
    id = models.AutoField(primary_key=True)
    idchave = models.CharField(max_length=15, db_column='idchave', null=True, blank=True)
    nome = models.CharField(max_length=255)
    caminho = models.CharField(max_length=255)
    descricao = models.TextField(null=True, blank=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'modulo'

    def __str__(self):
        return self.nome
