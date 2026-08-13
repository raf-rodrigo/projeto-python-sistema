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
from core.views import login_view, menu_list_view, UserViewSet  # 3. Importa o UserViewSet

# 4. Criando e registrando a rota do CRUD de usuário
router = DefaultRouter()
router.register(r'usuarios', UserViewSet, basename='usuario')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login_view, name='login'),
    path('api/menus/', menu_list_view, name='menu-list'),
    path('api/', include(router.urls)),                        # 5. Incluindo as rotas geradas
]
