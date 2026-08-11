from django.db import models

class Login(models.Model):
    id = models.IntegerField(primary_key=True)
    usuario = models.CharField(max_length=100)
    nome = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, null=True, blank=True)
    senha = models.CharField(max_length=255)
    avatar_imagem = models.CharField(max_length=255, null=True, blank=True)
    ativo = models.IntegerField(default=1)
    pagina_inicial_id = models.IntegerField(null=True, blank=True)
    trocar_senha = models.IntegerField(null=True, blank=True)
    data_senha = models.CharField(max_length=255, null=True, blank=True)
    uid_senha = models.CharField(max_length=255, null=True, blank=True)
    atend_sigiloso = models.CharField(max_length=255, null=True, blank=True)
    hash_sist = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'usuario'