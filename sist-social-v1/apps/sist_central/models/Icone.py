from django.db import models

class Icone(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(unique=True, max_length=255)

    class Meta:
        managed = False
        db_table = 'icone'

    def __str__(self):
        return self.nome
