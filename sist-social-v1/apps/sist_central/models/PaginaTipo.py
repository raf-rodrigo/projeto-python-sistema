from django.db import models

class PaginaTipo(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagina_tipo'

    def __str__(self):
        return self.nome
