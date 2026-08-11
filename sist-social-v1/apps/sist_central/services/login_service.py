import hashlib
from django.db import connections
from apps.sist_central.models import Login
from apps.sist_social.models import RecursosHumanos, UnidadeAtendimentoSocial


def validar_usuario(usuario_digitado, senha_digitada):
    senha_md5 = hashlib.md5(senha_digitada.encode()).hexdigest()

    try:
        usuario = Login.objects.using('sist_central').get(
            usuario=usuario_digitado,
            senha=senha_md5,
            ativo=1
        )
        return usuario, None
    except Login.DoesNotExist:
        return None, 'Usuário ou senha incorretos.'


def obter_unidades_usuario(usuario_nome):
    try:
        # Busca o Recurso Humano associado ao usuário
        rh = RecursosHumanos.objects.using('default').get(memberID=usuario_nome)
        if not rh.unidades:
            return [], "Este usuário não possui unidades vinculadas."
            
        unidades_ids = [int(i.strip()) for i in rh.unidades.split(',') if i.strip().isdigit()]
        if not unidades_ids:
            return [], "Este usuário não possui unidades válidas vinculadas."
            
        unidades = UnidadeAtendimentoSocial.objects.using('default').filter(id__in=unidades_ids)
        return list(unidades), None
    except RecursosHumanos.DoesNotExist:
        return [], "Usuário não cadastrado no Recursos Humanos do sistema social."


def atualizar_unidade_usuario(usuario_nome, unidade_id):
    try:
        rh = RecursosHumanos.objects.using('default').get(memberID=usuario_nome)
        rh.onde_trab_social = int(unidade_id)
        rh.save(using='default', update_fields=['onde_trab_social'])
        
        # Obter detalhes da unidade
        unidade = UnidadeAtendimentoSocial.objects.using('default').get(id=unidade_id)
        return unidade, None
    except Exception as e:
        return None, str(e)


def registrar_sessao(request, usuario, unidade=None):
    nome = usuario.nome or usuario.usuario

    request.session['usuarioLogado'] = True
    request.session['idUsuario'] = usuario.id
    request.session['memberID'] = usuario.usuario
    request.session['nomeUsuario'] = nome
    request.session['nomeUsuarioIniciais'] = gerar_iniciais(nome)
    request.session['avatarUsuario'] = usuario.avatar_imagem
    request.session['paginaInicialUsuario'] = usuario.pagina_inicial_id
    request.session['trocaSenhaSistema'] = usuario.trocar_senha
    request.session['perfilAtual'] = 'padrao'
    
    if unidade:
        request.session['unidadeLogada'] = unidade.nome_conhecido or unidade.razao_social
        request.session['unidadeLogadaId'] = unidade.id
    else:
        request.session['unidadeLogada'] = 'Nenhuma'
        request.session['unidadeLogadaId'] = None


def gerar_iniciais(nome):
    partes = nome.split()
    if not partes:
        return ''

    if len(partes) == 1:
        return partes[0][0].upper()

    return f'{partes[0][0]}{partes[-1][0]}'.upper()


def obter_perfis_usuario(usuario_id):
    with connections['sist_central'].cursor() as cursor:
        cursor.execute("SELECT perfil_id FROM usuario_has_perfil WHERE usuario_id = %s", [usuario_id])
        return [row[0] for row in cursor.fetchall()]


def obter_menu_sistema(usuario_id):
    perfil_ids = obter_perfis_usuario(usuario_id)
    if not perfil_ids:
        return []
        
    placeholders = ', '.join(['%s'] * len(perfil_ids))
    
    # Query de categorias
    query_cat = f"""
        SELECT DISTINCT M.id, M.menu_id_acima, CAT.nome, ico.nome as nome_icone, M.ordem
        FROM perfil_has_menu PFM
        JOIN menu M ON M.id = PFM.menu_id
        JOIN categoria CAT ON CAT.id = M.item_id
        LEFT JOIN icone ico ON ico.id = CAT.icone_id
        WHERE PFM.perfil_id IN ({placeholders}) AND M.tipo = 'C'
    """
    
    # Query de páginas
    query_pag = f"""
        SELECT DISTINCT M.id, M.menu_id_acima, PAG.nome, ico.nome as nome_icone, M.ordem,
               PAG.caminho as caminho_pagina, mdl.caminho as caminho_modulo
        FROM perfil_has_menu PFM
        JOIN menu M ON M.id = PFM.menu_id
        JOIN pagina PAG ON PAG.id = M.item_id
        JOIN modulo mdl ON mdl.id = PAG.modulo_id
        LEFT JOIN icone ico ON ico.id = PAG.icone_id
        WHERE PFM.perfil_id IN ({placeholders}) AND M.tipo = 'P'
    """
    
    with connections['sist_central'].cursor() as cursor:
        cursor.execute(query_cat, perfil_ids)
        categorias = cursor.fetchall()
        
        cursor.execute(query_pag, perfil_ids)
        paginas = cursor.fetchall()

    menu_items = {}
    
    # Processar categorias
    for row in categorias:
        menu_id = row[0]
        menu_id_acima = row[1]
        nome = row[2]
        icone = row[3] or "fa-folder"
        ordem = row[4]
        
        menu_items[menu_id] = {
            'id': menu_id,
            'menu_id_acima': menu_id_acima,
            'nome': nome,
            'url': '#',
            'icone': icone,
            'ordem': ordem,
            'children': []
        }
        
    # Processar páginas
    for row in paginas:
        menu_id = row[0]
        menu_id_acima = row[1]
        nome = row[2]
        icone = row[3] or "fa-file"
        ordem = row[4]
        caminho_pagina = row[5]
        caminho_modulo = row[6]
        
        # Gera o link para o CodeIgniter legado ou rotas locais
        migrated_tbasicas = {
            'Tbasicas/OrientacaoSexual': 'OrientacaoSexual',
            'Tbasicas/TipoTrabalho': 'TipoTrabalho',
            'Tbasicas/TipoSerieCurso': 'TipoSerieCurso',
            'Tbasicas/TipoFrequenciaEscolar': 'TipoFrequenciaEscolar',
            'Tbasicas/TipoCursoFrequentou': 'TipoCursoFrequentou',
            'Tbasicas/TipoCursoAtual': 'TipoCursoAtual',
            'Tbasicas/TipoCID': 'TipoCID',
            'Tbasicas/TipoAnimal': 'TipoAnimal',
            'Tbasicas/PrioridadeSCFV': 'PrioridadeSCFV',
            'Tbasicas/MotivoDesligamento': 'MotivoDesligamento',
            'Tbasicas/TipoRecurso': 'TipoRecurso',
            'Tbasicas/Feriados': 'Feriados',
            'tipo_unidades_view.php': 'TipoUnidades',
            'tipo_orgaos_recursos_view.php': 'TipoOrgaosRecursos',
            'tipo_deficiencia_view.php': 'TipoDeficiencia',
            'tipo_unid_realiz_servs_view.php': 'TipoUnidRealizServs',
            'tipo_cbo_view.php': 'TipoCbo',
            'tipo_contato_parente_view.php': 'TipoContatoParente',
            'tipo_escolaridade_pront_view.php': 'TipoEscolaridadePront',
            'tipo_tempo_rua_view.php': 'TipoTempoRua',
            'tipo_origem_cad_view.php': 'TipoOrigemCad',
            'tipo_parentesco_view.php': 'TipoParentesco',
            'tipo_sit_viol_creas_view.php': 'TipoSitViolCreas',
            'tipo_sit_violencia_view.php': 'TipoSitViolencia',
            'estados_view.php': 'Estados',
            'municipios_view.php': 'Municipios',
            'pais': 'Pais',
            'TipoTempoResidencia': 'TipoTempoResidencia',
            'TipoAreaSeguimento': 'TipoAreaSeguimento',
            'Tbasicas/TipoTempoResidencia': 'TipoTempoResidencia',
            'Tbasicas/TipoAreaSeguimento': 'TipoAreaSeguimento',
            'PublicoAlvo': 'PublicoAlvo',
            'LugarNascimento': 'LugarNascimento',
            'TipoRegistroCivil': 'TipoRegistroCivil',
            'Religioes': 'Religioes',
            'Caps': 'Caps',
            'Bairros': 'Bairros',
            'Areas': 'Areas',
            'MicroAreas': 'MicroAreas',
            'Potencialidades': 'Potencialidades',
            'AtosInfracionais': 'AtosInfracionais',
            'MotivoAtendimento': 'MotivoAtendimento',
            'OrigemTipoEncaminhamento': 'OrigemTipoEncaminhamento',
            'SitPrivadoLiberdade': 'SitPrivadoLiberdade',
            'ServicoSocial': 'ServicoSocial',
            'TipoServicoProtecao': 'TipoServicoProtecao',
            'TipoPeriodo': 'TipoPeriodo',
            'TipoMedidaSocioeducativa': 'TipoMedidaSocioeducativa',
            'VulnerabilidadeSocial': 'VulnerabilidadeSocial',
            'tipo_etnia_view.php': 'TipoEtnia',
            'tipo_faixa_etaria_view.php': 'TipoFaixaEtaria',
        }
        caminho_clean = caminho_pagina.strip('/')
        if caminho_clean in migrated_tbasicas:
            url = f"/Tbasicas/{migrated_tbasicas[caminho_clean]}"
        elif caminho_clean.startswith('Tbasicas/'):
            model_name = caminho_clean.split('/')[-1]
            url = f"/Tbasicas/{model_name}"
        elif caminho_pagina.endswith('.php'):
            url = f"/ci/{caminho_modulo}/{caminho_pagina}"
        else:
            url = f"/{caminho_pagina}" if not caminho_pagina.startswith('/') else caminho_pagina
        if url.startswith('/Tbasicas/'):
            icone = ''
        menu_items[menu_id] = {
            'id': menu_id,
            'menu_id_acima': menu_id_acima,
            'nome': nome,
            'url': url,
            'icone': icone,
            'ordem': ordem,
            'children': []
        }

    # Montar a árvore recursiva
    menu_tree = []
    for menu_id, item in menu_items.items():
        id_pai = item['menu_id_acima']
        if id_pai == 0:
            menu_tree.append(item)
        else:
            if id_pai in menu_items:
                menu_items[id_pai]['children'].append(item)
                
    # Ordenar recursivamente por ordem
    menu_tree.sort(key=lambda x: x['ordem'])
    for item in menu_items.values():
        item['children'].sort(key=lambda x: x['ordem'])
        nome_menu = item['nome'].lower()
        tem_filhos_tbasicas = any(
            child['url'].startswith('/Tbasicas/')
            for child in item['children']
        )
        if 'grupo' in nome_menu:
            item['icone'] = 'fa-users'
        elif 'agendamento' in nome_menu:
            item['icone'] = 'fa-calendar-days'
        elif 'atendimento' in nome_menu:
            item['icone'] = 'fa-hand-holding-heart'
        elif 'cadastro' in nome_menu and ('basico' in nome_menu or 'básico' in nome_menu):
            item['icone'] = 'fa-edit'
        elif tem_filhos_tbasicas or ('tabela' in nome_menu and ('basica' in nome_menu or 'básica' in nome_menu)):
            item['icone'] = 'fa-table'
        
    return menu_tree
