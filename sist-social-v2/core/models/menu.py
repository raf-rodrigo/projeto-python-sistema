from django.db import models
from django.contrib.auth.models import Group

class Menu(models.Model):
    nome = models.CharField(max_length=100, verbose_name="Nome do Menu")
    url = models.CharField(max_length=200, blank=True, null=True, verbose_name="Caminho/URL")
    icone = models.CharField(max_length=50, blank=True, null=True, verbose_name="Ícone (Lucide)")
    pai = models.ForeignKey(
        'self', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='submenus',
        verbose_name="Menu Pai"
    )
    ordem = models.PositiveIntegerField(default=0, verbose_name="Ordem de Exibição")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    grupos = models.ManyToManyField(
        Group,
        blank=True,
        related_name='menus',
        verbose_name="Grupos com Acesso"
    )

    class Meta:
        ordering = ['ordem', 'nome']
        verbose_name = "Menu"
        verbose_name_plural = "Menus"

    def __str__(self):
        if self.pai:
            return f"{self.pai.nome} > {self.nome}"
        return self.nome
