from django.db import models
from .Modulo import Modulo
from .Icone import Icone
from .PaginaTipo import PaginaTipo

class Pagina(models.Model):
    id = models.AutoField(primary_key=True)
    idchave = models.CharField(max_length=100, blank=True, null=True)
    modulo = models.ForeignKey(Modulo, models.DO_NOTHING, db_column='modulo_id')
    nome = models.CharField(max_length=255)
    caminho = models.CharField(max_length=255)
    descricao = models.CharField(max_length=500, blank=True, null=True)
    icone = models.CharField(max_length=255, blank=True, null=True)  # CSS class / text representation
    icone_rel = models.ForeignKey(Icone, models.DO_NOTHING, db_column='icone_id', blank=True, null=True)
    ativo = models.IntegerField(default=1)  # 1 = Ativo, 0 = Inativo
    pagina_tipo = models.ForeignKey(PaginaTipo, models.DO_NOTHING, db_column='pagina_tipo_id', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pagina'

    def __str__(self):
        return self.nome
