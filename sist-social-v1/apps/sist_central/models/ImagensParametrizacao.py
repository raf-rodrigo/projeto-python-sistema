from django.db import models

class ImagensParametrizacao(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=50, unique=True)
    caminho = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'imagens_parametrizacao'

    def __str__(self):
        return f"{self.tipo}: {self.caminho}"
