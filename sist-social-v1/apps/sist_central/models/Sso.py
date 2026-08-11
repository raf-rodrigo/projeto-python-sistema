from django.db import models

class Sso(models.Model):
    PLATAFORMA_CHOICES = [
        ('Vision', 'Vision'),
        ('Betha', 'Betha'),
    ]

    id = models.AutoField(primary_key=True)
    client_id = models.CharField(max_length=255, unique=True)
    client_secret = models.CharField(max_length=500, null=True, blank=True)
    callback = models.CharField(max_length=500)
    api_url = models.CharField(max_length=500)
    plataforma = models.CharField(max_length=10, choices=PLATAFORMA_CHOICES)
    ativo = models.IntegerField(default=1)  # 1 = Ativo, 0 = Inativo
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_used_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = 'sso'

    def __str__(self):
        return f"SSO {self.plataforma} ({'Ativo' if self.ativo == 1 else 'Inativo'})"
