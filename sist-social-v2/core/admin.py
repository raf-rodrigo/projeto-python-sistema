from django.contrib import admin
from .models import Menu, Configuracao

class SubmenuInline(admin.TabularInline):
    model = Menu
    fk_name = 'pai'
    extra = 1
    verbose_name = "Submenu"
    verbose_name_plural = "Submenus"

@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    list_display = ('nome', 'url', 'icone', 'pai', 'ordem', 'ativo')
    list_filter = ('ativo', 'pai')
    search_fields = ('nome', 'url')
    ordering = ('pai', 'ordem', 'nome')
    filter_horizontal = ('grupos',)
    inlines = [SubmenuInline]

@admin.register(Configuracao)
class ConfiguracaoAdmin(admin.ModelAdmin):
    list_display = ('chave', 'descricao', 'valor', 'validacao')
    search_fields = ('chave', 'descricao', 'valor')


