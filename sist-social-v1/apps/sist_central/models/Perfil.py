from django.db import models
from .Modulo import Modulo

class Perfil(models.Model):
    id = models.AutoField(primary_key=True)
    modulo = models.ForeignKey(Modulo, on_delete=models.DO_NOTHING, db_column='modulo_id')
    nome = models.CharField(max_length=255, unique=True)
    ativo = models.IntegerField(default=1)  # 1 = Ativo, 0 = Inativo, 2 = Suspenso/Pendente
    perfil_id_externo = models.IntegerField(null=True, blank=True)
    perfil_consultor = models.IntegerField(default=0)  # 1 = Sim, 0 = Não
    perfil_tecnico = models.IntegerField(null=True, blank=True, default=0)  # 1 = Sim, 0 = Não

    class Meta:
        managed = False
        db_table = 'perfil'

    def __str__(self):
        return self.nome
