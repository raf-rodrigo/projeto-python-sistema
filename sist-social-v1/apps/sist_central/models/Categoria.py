from django.db import models
from .Modulo import Modulo
from .Icone import Icone

class Categoria(models.Model):
    id = models.AutoField(primary_key=True)
    modulo = models.ForeignKey(Modulo, models.DO_NOTHING, db_column='modulo_id')
    nome = models.CharField(max_length=255)
    icone = models.CharField(max_length=255, blank=True, null=True)  # CSS class / text representation
    icone_rel = models.ForeignKey(Icone, models.DO_NOTHING, db_column='icone_id', blank=True, null=True)
    ativo = models.IntegerField(default=1)  # 1 = Ativo, 0 = Inativo

    class Meta:
        managed = False
        db_table = 'categoria'

    def __str__(self):
        return self.nome
