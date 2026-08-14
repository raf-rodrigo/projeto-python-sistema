"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include                           # 1. Adiciona o 'include'
from rest_framework.routers import DefaultRouter                 # 2. Importa o roteador de DRF
import inspect
import re
from core import views  # Importa todas as views de core

# 4. Criando e registrando a rota do CRUD de usuário, menus e tabelas básicas
router = DefaultRouter()
router.register(r'usuarios', views.UserViewSet, basename='usuario')
router.register(r'gerenciamento-menus', views.MenuViewSet, basename='gerenciamento-menu')
router.register(r'grupos', views.GroupViewSet, basename='grupo')

# Registra dinamicamente todos os ViewSets de tabelas básicas do core
for name, obj in inspect.getmembers(views):
    if inspect.isclass(obj) and name.endswith('ViewSet') and name not in {'UserViewSet', 'MenuViewSet', 'GroupViewSet'}:
        # Converte NomeDaViewSet para nome_da_view_set
        url_name = re.sub(r'(?<!^)(?=[A-Z])', '_', name[:-7]).lower()
        
        # Ajuste especial para manter consistência de pluralização/nomenclatura
        if url_name == 'estado':
            url_name = 'estados'
        elif url_name == 'municipio':
            url_name = 'municipios'
        elif url_name == 'cid':
            url_name = 'cids'
        elif url_name == 'cbo':
            url_name = 'cbos'
        elif url_name == 'area':
            url_name = 'areas'
        elif url_name == 'unidade':
            url_name = 'unidades'
        elif url_name == 'familia_domicilio':
            url_name = 'familias_domicilios'
        elif url_name == 'pessoa':
            url_name = 'pessoas'
            
        router.register(url_name, obj, basename=url_name)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', views.login_view, name='login'),
    path('api/menus/', views.menu_list_view, name='menu-list'),
    path('api/', include(router.urls)),                        # 5. Incluindo as rotas geradas
]
