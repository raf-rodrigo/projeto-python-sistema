"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.urls import path, re_path
from apps.sist_central.views import (
    login, logout, list_images, upload_image,
    list_users, create_user, edit_user, toggle_user_status, reset_user_password,
    manage_password_rules, list_configuracoes, edit_configuracao,
    list_sso, edit_sso, toggle_sso_status,
    list_perfis, create_perfil, edit_perfil, toggle_perfil_status, manage_perfil_permissions,
    list_paginas, create_pagina, edit_pagina, toggle_pagina_status,
    list_menu, create_menu_item, edit_menu_item, delete_menu_item, create_categoria, edit_categoria
)
from apps.sist_social.views import (
        dashboard, cadunico_stats_api, atendimentos_chart_api,
        list_recursos_humanos, create_recurso_humano, edit_recurso_humano, toggle_recurso_humano_status,
        index_idf_calculation, process_idf, verifica_data_processamento
    )
from apps.sist_social.views_cadastros import (
    list_unidades, create_unidade, edit_unidade, toggle_unidade_status,
    list_servicos, create_servico, edit_servico, toggle_servico_status,
    list_orgaos, create_orgao, edit_orgao, toggle_orgao_status,
    list_familias, create_familia, edit_familia, toggle_familia_status,
    list_pessoas, create_pessoa, edit_pessoa, toggle_pessoa_status
)
from apps.sist_social.views_tabelas_basicas import (
    list_tbasica, create_tbasica, insert_tbasica, edit_tbasica, update_tbasica, delete_tbasica
)
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', login, name='home'),
    path('login/', login, name='login'),
    path('logout/', logout, name='logout'),
    path('dashboard/', dashboard, name='dashboard'),
    path('DashBoardSocial/', dashboard, name='dashboard_legacy_slash'),
    path('DashBoardSocial', dashboard, name='dashboard_legacy'),
    path('dashboard/api/cadunico/', cadunico_stats_api, name='cadunico_stats_api'),
    path('dashboard/api/atendimentos/', atendimentos_chart_api, name='atendimentos_chart_api'),
    path('imagens/', list_images, name='list_images'),
    path('imagens/upload/', upload_image, name='upload_image'),
    path('Imagens/', list_images, name='list_images_legacy'),
    path('Imagens/upload', upload_image, name='upload_image_legacy'),
    
    # Usuários (Administração)
    path('usuario/', list_users, name='list_users'),
    path('Usuario/', list_users, name='list_users_legacy'),
    path('usuario/adicionar/', create_user, name='create_user'),
    path('usuario/editar/<int:pk>/', edit_user, name='edit_user'),
    path('usuario/status/<int:pk>/', toggle_user_status, name='toggle_user_status'),
    path('usuario/resetar-senha/<int:pk>/', reset_user_password, name='reset_user_password'),

    # Regras de Senhas (Administração)
    path('regras-senhas/', manage_password_rules, name='manage_password_rules'),
    path('RegrasSenhas/', manage_password_rules, name='manage_password_rules_legacy'),

    # Configurações Gerais (Administração)
    path('configuracoes/', list_configuracoes, name='list_configuracoes'),
    path('Configuracoes/', list_configuracoes, name='list_configuracoes_legacy'),
    path('configuracoes/editar/<int:pk>/', edit_configuracao, name='edit_configuracao'),

    # SSO (Administração)
    path('sso/', list_sso, name='list_sso'),
    path('Sso/', list_sso, name='list_sso_legacy'),
    path('sso/editar/<int:pk>/', edit_sso, name='edit_sso'),
    path('sso/status/<int:pk>/', toggle_sso_status, name='toggle_sso_status'),

    # Perfil (Administração)
    path('perfil/', list_perfis, name='list_perfis'),
    path('Perfil/', list_perfis, name='list_perfis_legacy'),
    path('perfil/adicionar/', create_perfil, name='create_perfil'),
    path('perfil/editar/<int:pk>/', edit_perfil, name='edit_perfil'),
    path('perfil/status/<int:pk>/', toggle_perfil_status, name='toggle_perfil_status'),
    path('perfil/permissoes/<int:pk>/', manage_perfil_permissions, name='manage_perfil_permissions'),

    # Páginas (Administração)
    path('paginas/', list_paginas, name='list_paginas'),
    path('Paginas/', list_paginas, name='list_paginas_legacy'),
    path('paginas/adicionar/', create_pagina, name='create_pagina'),
    path('paginas/editar/<int:pk>/', edit_pagina, name='edit_pagina'),
    path('paginas/status/<int:pk>/', toggle_pagina_status, name='toggle_pagina_status'),

    # Páginas (Legado Pagina/pagina singular)
    path('Pagina/', list_paginas, name='list_paginas_singular_legacy_slash'),
    path('Pagina', list_paginas, name='list_paginas_singular_legacy'),
    path('pagina/', list_paginas, name='list_paginas_singular_local_slash'),
    path('pagina', list_paginas, name='list_paginas_singular_local'),
    path('Pagina/adicionar', create_pagina, name='create_pagina_singular_legacy'),
    path('pagina/adicionar', create_pagina, name='create_pagina_singular_local'),
    path('Pagina/editar/<int:pk>', edit_pagina, name='edit_pagina_singular_legacy'),
    path('pagina/editar/<int:pk>', edit_pagina, name='edit_pagina_singular_local'),
    path('Pagina/status/<int:pk>', toggle_pagina_status, name='toggle_pagina_status_singular_legacy'),
    path('pagina/status/<int:pk>', toggle_pagina_status, name='toggle_pagina_status_singular_local'),

    # Menu Lateral (Administração)
    path('menu/', list_menu, name='list_menu'),
    path('Menu/', list_menu, name='list_menu_legacy'),
    path('menu/adicionar/', create_menu_item, name='create_menu_item'),
    path('menu/editar/<int:pk>/', edit_menu_item, name='edit_menu_item'),
    path('menu/deletar/<int:pk>/', delete_menu_item, name='delete_menu_item'),
    path('menu/categoria/adicionar/', create_categoria, name='create_categoria'),
    path('menu/categoria/editar/<int:pk>/', edit_categoria, name='edit_categoria'),

    # Menu Lateral (Legado menuLateral)
    path('menuLateral/', list_menu, name='list_menu_lateral_legacy_slash'),
    path('menuLateral', list_menu, name='list_menu_lateral_legacy'),
    path('menuLateral/adicionar', create_menu_item, name='create_menu_item_lateral_legacy'),
    path('menuLateral/editar/<int:pk>', edit_menu_item, name='edit_menu_item_lateral_legacy'),
    path('menuLateral/deletar/<int:pk>', delete_menu_item, name='delete_menu_item_lateral_legacy'),
    path('menuLateral/categoria/adicionar', create_categoria, name='create_categoria_lateral_legacy'),
    path('menuLateral/categoria/editar/<int:pk>', edit_categoria, name='edit_categoria_lateral_legacy'),

      # Recursos Humanos (Cadastro Básico)
      path('recursos-humanos/', list_recursos_humanos, name='list_recursos_humanos'),
      path('RecursosHumanos/', list_recursos_humanos, name='list_recursos_humanos_legacy'),
      path('recursos-humanos/adicionar/', create_recurso_humano, name='create_recurso_humano'),
      path('recursos-humanos/editar/<int:pk>/', edit_recurso_humano, name='edit_recurso_humano'),
      path('recursos-humanos/status/<int:pk>/', toggle_recurso_humano_status, name='toggle_recurso_humano_status'),

      # Unidades de Atendimento Social
      path('unidades-atendimento/', list_unidades, name='list_unidades'),
      path('UnidAtendSocial/', list_unidades, name='list_unidades_legacy_slash'),
      path('UnidAtendSocial', list_unidades, name='list_unidades_legacy'),
      path('UnidadeAtendimentoSocioassistencial/', list_unidades, name='list_unidades_socio_legacy_slash'),
      path('UnidadeAtendimentoSocioassistencial', list_unidades, name='list_unidades_socio_legacy'),
      path('UnidadeAtendimentoSocioassistencial/adicionar', create_unidade, name='create_unidade_socio_legacy'),
      path('UnidadeAtendimentoSocioassistencial/editar/<int:pk>', edit_unidade, name='edit_unidade_socio_legacy'),
      path('UnidadeAtendimentoSocioassistencial/status/<int:pk>', toggle_unidade_status, name='toggle_unidade_status_socio_legacy'),
      path('unidades-atendimento/adicionar/', create_unidade, name='create_unidade'),
      path('unidades-atendimento/editar/<int:pk>/', edit_unidade, name='edit_unidade'),
      path('unidades-atendimento/status/<int:pk>/', toggle_unidade_status, name='toggle_unidade_status'),

      # Serviços
      path('servicos/', list_servicos, name='list_servicos'),
      path('Servicos/', list_servicos, name='list_servicos_legacy_slash'),
      path('Servicos', list_servicos, name='list_servicos_legacy'),
      path('servicos/adicionar/', create_servico, name='create_servico'),
      path('servicos/editar/<int:pk>/', edit_servico, name='edit_servico'),
      path('servicos/status/<int:pk>/', toggle_servico_status, name='toggle_servico_status'),

      # Órgãos e Recursos
      path('orgaos-recursos/', list_orgaos, name='list_orgaos'),
      path('OrgaosRecursos/', list_orgaos, name='list_orgaos_legacy_slash'),
      path('OrgaosRecursos', list_orgaos, name='list_orgaos_legacy'),
      path('orgaos-recursos/adicionar/', create_orgao, name='create_orgao'),
      path('orgaos-recursos/editar/<int:pk>/', edit_orgao, name='edit_orgao'),
      path('orgaos-recursos/status/<int:pk>/', toggle_orgao_status, name='toggle_orgao_status'),

      # Calcular IDF
      path('calcular-idf/', index_idf_calculation, name='index_idf_calculation'),
      path('calcular-idf/processar/', process_idf, name='process_idf'),
      path('calcular-idf/verificar/', verifica_data_processamento, name='verifica_data_processamento'),
      # Calcular IDF (Legado)
      path('ProcesIdfFamilia/', index_idf_calculation, name='index_idf_calculation_legacy_slash'),
      path('ProcesIdfFamilia', index_idf_calculation, name='index_idf_calculation_legacy'),
      path('ProcesIdfFamilia/processaIdf', process_idf, name='process_idf_legacy'),
      path('ProcesIdfFamilia/verifica_data_processamento', verifica_data_processamento, name='verifica_data_processamento_legacy'),

      # Famílias / Domicílios
      path('familias-domicilio/', list_familias, name='list_familias'),
      path('FamiliaDomicilio/', list_familias, name='list_familias_legacy_slash'),
      path('FamiliaDomicilio', list_familias, name='list_familias_legacy'),
      path('familias-domicilio/adicionar/', create_familia, name='create_familia'),
      path('FamiliaDomicilio/adicionar', create_familia, name='create_familia_legacy'),
      path('familias-domicilio/editar/<int:pk>/', edit_familia, name='edit_familia'),
      path('FamiliaDomicilio/editar/<int:pk>', edit_familia, name='edit_familia_legacy'),
      path('familias-domicilio/status/<int:pk>/', toggle_familia_status, name='toggle_familia_status'),
      path('FamiliaDomicilio/status/<int:pk>', toggle_familia_status, name='toggle_familia_status_legacy'),

      # Pessoas
      path('pessoas/', list_pessoas, name='list_pessoas'),
      path('Pessoas/', list_pessoas, name='list_pessoas_legacy_slash'),
      path('Pessoas', list_pessoas, name='list_pessoas_legacy'),
      path('pessoas/adicionar/', create_pessoa, name='create_pessoa'),
      path('Pessoas/adicionar', create_pessoa, name='create_pessoa_legacy'),
      path('pessoas/editar/<int:pk>/', edit_pessoa, name='edit_pessoa'),
      path('Pessoas/editar/<int:pk>', edit_pessoa, name='edit_pessoa_legacy'),
      path('pessoas/status/<int:pk>/', toggle_pessoa_status, name='toggle_pessoa_status'),
      path('Pessoas/status/<int:pk>', toggle_pessoa_status, name='toggle_pessoa_status_legacy'),

      # Tabelas Básicas Genéricas
      path('Tbasicas/<str:model_name>', list_tbasica, name='tbasica_list_legacy'),
      path('Tbasicas/<str:model_name>/', list_tbasica, name='tbasica_list_legacy_slash'),
      path('Tbasicas/<str:model_name>/criar', create_tbasica, name='tbasica_create_legacy'),
      path('Tbasicas/<str:model_name>/editar/<int:pk>', edit_tbasica, name='tbasica_edit_legacy'),
      path('Tbasicas/<str:model_name>/editar/<int:pk>/', edit_tbasica, name='tbasica_edit_legacy_slash'),
      path('Tbasicas/<str:model_name>/inserir', insert_tbasica, name='tbasica_insert_legacy'),
      path('Tbasicas/<str:model_name>/atualizar', update_tbasica, name='tbasica_update_legacy'),
      path('Tbasicas/<str:model_name>/deletar', delete_tbasica, name='tbasica_delete_legacy'),
]

# Mapeamento de rotas legadas direto na raiz para Tabelas Básicas
legacy_root_models = [
    'PublicoAlvo', 'LugarNascimento', 'TipoRegistroCivil', 'Religioes', 'Caps',
    'Bairros', 'Areas', 'MicroAreas', 'Potencialidades', 'AtosInfracionais',
    'MotivoAtendimento', 'OrigemTipoEncaminhamento', 'SitPrivadoLiberdade',
    'ServicoSocial', 'TipoServicoProtecao', 'TipoPeriodo', 'TipoMedidaSocioeducativa',
    'VulnerabilidadeSocial', 'OrientacaoSexual', 'TipoTrabalho', 'TipoSerieCurso',
    'TipoFrequenciaEscolar', 'TipoCursoFrequentou', 'TipoCursoAtual', 'TipoCID',
    'TipoAnimal', 'PrioridadeSCFV', 'MotivoDesligamento', 'TipoRecurso', 'Feriados',
    'TipoDeficiencia', 'TipoCbo', 'TipoContatoParente', 'TipoEscolaridadePront',
    'TipoTempoRua', 'TipoOrigemCad', 'TipoSitViolencia', 'RacaCor', 'TipoOcupacao',
    'TipoEtnia', 'AbastecimentoAgua', 'TipoEfeitoDesc', 'GruposTradicionaisEspecificos',
    'TipoMaterialPiso', 'TipoBeneficios', 'Estados', 'Municipios', 'Pais',
    'TipoUnidRealizServs', 'TipoTempoResidencia', 'TipoSitViolCreas', 'TipoAreaSeguimento',
    'TipoLocNasc', 'TipoRegCivil', 'TipoUnidades', 'TipoOrgaosRecursos', 'TipoParentesco',
    'TipoEstadoCivil', 'TipoResidencia', 'FaixaRendaPessoa', 'FaixaRendaPercapta',
    'TipoServSocial', 'TipoServicosSociais', 'TipoNivelEscolaridade', 'FormasAcessoUsuario',
    'TipoAcessibilidade', 'TipoDestinacaoLixo', 'TipoEscoamentoSanitario', 'TipoEspecieDomicilio',
    'TipoIluminacao', 'TipoMaterialConstrucao', 'TipoServsPgms', 'TipoServidorPublico',
    'TipoFaixaEtaria'
]

for model in legacy_root_models:
    urlpatterns += [
        path(f'{model}', list_tbasica, {'model_name': model}, name=f'legacy_{model.lower()}_list'),
        path(f'{model}/', list_tbasica, {'model_name': model}, name=f'legacy_{model.lower()}_list_slash'),
        path(f'{model}/criar', create_tbasica, {'model_name': model}, name=f'legacy_{model.lower()}_create'),
        path(f'{model}/editar/<int:pk>', edit_tbasica, {'model_name': model}, name=f'legacy_{model.lower()}_edit'),
        path(f'{model}/editar/<int:pk>/', edit_tbasica, {'model_name': model}, name=f'legacy_{model.lower()}_edit_slash'),
        path(f'{model}/inserir', insert_tbasica, {'model_name': model}, name=f'legacy_{model.lower()}_insert'),
        path(f'{model}/atualizar', update_tbasica, {'model_name': model}, name=f'legacy_{model.lower()}_update'),
        path(f'{model}/deletar', delete_tbasica, {'model_name': model}, name=f'legacy_{model.lower()}_delete'),
    ]


urlpatterns += [
    re_path(r'^media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]


handler400 = 'django.views.defaults.bad_request'
handler403 = 'django.views.defaults.permission_denied'
handler404 = 'django.views.defaults.page_not_found'
handler500 = 'django.views.defaults.server_error'