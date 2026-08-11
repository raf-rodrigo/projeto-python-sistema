from django.db import models

class Menu(models.Model):
    id = models.AutoField(primary_key=True)
    menu_id_acima = models.IntegerField(default=0)  # 0 for root category / page
    tipo = models.CharField(max_length=1)  # C = Category, P = Page
    item_id = models.IntegerField()  # ID of Categoria or Pagina
    ordem = models.IntegerField(default=0)

    class Meta:
        managed = False
        db_table = 'menu'

    def __str__(self):
        return f"Menu ID {self.id} (Tipo: {self.tipo}, Item: {self.item_id}, Ordem: {self.ordem})"
