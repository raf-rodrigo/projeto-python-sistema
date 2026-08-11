from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from django.db import connections
from django.http import JsonResponse
from django.contrib import messages
from apps.sist_central.models import Perfil, Modulo

def list_perfis(request):
    """
    Lista todos os perfis com paginação e busca por nome ou módulo.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
    
    perfis = Perfil.objects.using('sist_central').all().select_related('modulo').order_by('id')
    
    if search:
        perfis = perfis.filter(
            Q(nome__icontains=search) |
            Q(modulo__nome__icontains=search)
        )
        
    paginator = Paginator(perfis, int(per_page))
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'sist_central/Perfil/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def create_perfil(request):
    """
    Cria um novo perfil de usuário.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        modulo_id = request.POST.get('modulo_id', '')
        ativo = request.POST.get('ativo', '1')
        perfil_consultor = request.POST.get('perfil_consultor', '0')
        perfil_tecnico = request.POST.get('perfil_tecnico', '0')
        
        if not nome or not modulo_id:
            errors.append("Nome do perfil e Módulo do sistema são obrigatórios.")
            
        if Perfil.objects.using('sist_central').filter(nome=nome).exists():
            errors.append(f"O perfil '{nome}' já existe cadastrado.")
            
        if not errors:
            try:
                modulo = Modulo.objects.using('sist_central').get(id=modulo_id)
                new_perfil = Perfil(
                    nome=nome,
                    modulo=modulo,
                    ativo=int(ativo),
                    perfil_consultor=int(perfil_consultor),
                    perfil_tecnico=int(perfil_tecnico)
                )
                new_perfil.save(using='sist_central')
                
                messages.success(request, f"Perfil '{nome}' cadastrado com sucesso!")
                return redirect('list_perfis')
            except Modulo.DoesNotExist:
                errors.append("O Módulo do sistema selecionado não é válido.")
                
    modulos = Modulo.objects.using('sist_central').filter(ativo=1).order_by('nome')
    return render(request, 'sist_central/Perfil/adicionar.html', {
        'modulos': modulos,
        'errors': errors,
        'form_data': request.POST if request.method == 'POST' else {}
    })


def edit_perfil(request, pk):
    """
    Edita um perfil existente.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    perfil = get_object_or_404(Perfil.objects.using('sist_central'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        modulo_id = request.POST.get('modulo_id', '')
        ativo = request.POST.get('ativo', '1')
        perfil_consultor = request.POST.get('perfil_consultor', '0')
        perfil_tecnico = request.POST.get('perfil_tecnico', '0')
        
        if not nome or not modulo_id:
            errors.append("Nome do perfil e Módulo do sistema são obrigatórios.")
            
        if nome != perfil.nome and Perfil.objects.using('sist_central').filter(nome=nome).exists():
            errors.append(f"O perfil '{nome}' já existe em outro cadastro.")
            
        if not errors:
            try:
                modulo = Modulo.objects.using('sist_central').get(id=modulo_id)
                perfil.nome = nome
                perfil.modulo = modulo
                perfil.ativo = int(ativo)
                perfil.perfil_consultor = int(perfil_consultor)
                perfil.perfil_tecnico = int(perfil_tecnico)
                perfil.save(using='sist_central')
                
                messages.success(request, f"Perfil '{nome}' atualizado com sucesso!")
                return redirect('list_perfis')
            except Modulo.DoesNotExist:
                errors.append("O Módulo do sistema selecionado não é válido.")
                
    modulos = Modulo.objects.using('sist_central').filter(ativo=1).order_by('nome')
    return render(request, 'sist_central/Perfil/editar.html', {
        'perfil': perfil,
        'modulos': modulos,
        'errors': errors
    })


def toggle_perfil_status(request, pk):
    """
    Inverte o status ativo/inativo do perfil de usuário (AJAX).
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        perfil = Perfil.objects.using('sist_central').get(pk=pk)
        perfil.ativo = 0 if perfil.ativo == 1 else 1
        perfil.save(using='sist_central')
        
        status_label = 'Ativo' if perfil.ativo == 1 else 'Inativo'
        return JsonResponse({
            'success': True,
            'ativo': perfil.ativo,
            'message': f"O status do perfil foi alterado para {status_label} com sucesso!"
        })
    except Perfil.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Perfil não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


def manage_perfil_permissions(request, pk):
    """
    Lista e altera os vínculos do menu da árvore do sistema para um perfil específico.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    perfil = get_object_or_404(Perfil.objects.using('sist_central'), pk=pk)
    
    # 1. Atualiza permissões no banco ao submeter o formulário (POST)
    if request.method == 'POST':
        menu_ids = request.POST.getlist('menus')
        try:
            with connections['sist_central'].cursor() as cursor:
                # Remove permissões anteriores
                cursor.execute("DELETE FROM perfil_has_menu WHERE perfil_id = %s", [pk])
                # Insere as novas vinculações
                for m_id in menu_ids:
                    cursor.execute(
                        "INSERT INTO perfil_has_menu (perfil_id, menu_id) VALUES (%s, %s)",
                        [pk, int(m_id)]
                    )
            messages.success(request, f"Permissões do perfil '{perfil.nome}' salvas com sucesso!")
            return redirect('list_perfis')
        except Exception as e:
            messages.error(request, f"Erro ao salvar permissões: {str(e)}")
            
    # 2. Carrega árvore de menus no GET
    with connections['sist_central'].cursor() as cursor:
        # Menus ativos vinculados a este perfil
        cursor.execute("SELECT menu_id FROM perfil_has_menu WHERE perfil_id = %s", [pk])
        permissoes_atuais = {row[0] for row in cursor.fetchall()}
        
        # Busca categorias (tipo C)
        cursor.execute("""
            SELECT M.id, M.menu_id_acima, CAT.nome, M.ordem 
            FROM menu M 
            JOIN categoria CAT ON CAT.id = M.item_id 
            WHERE M.tipo = 'C'
        """)
        categorias = cursor.fetchall()
        
        # Busca páginas (tipo P)
        cursor.execute("""
            SELECT M.id, M.menu_id_acima, PAG.nome, M.ordem 
            FROM menu M 
            JOIN pagina PAG ON PAG.id = M.item_id 
            WHERE M.tipo = 'P'
        """)
        paginas = cursor.fetchall()

    menu_items = {}
    
    # Montagem das categorias
    for row in categorias:
        menu_id, menu_id_acima, nome, ordem = row
        menu_items[menu_id] = {
            'id': menu_id,
            'menu_id_acima': menu_id_acima,
            'nome': f"📁 {nome} (Categoria)",
            'marcado': menu_id in permissoes_atuais,
            'children': [],
            'ordem': ordem
        }
        
    # Montagem das páginas
    for row in paginas:
        menu_id, menu_id_acima, nome, ordem = row
        menu_items[menu_id] = {
            'id': menu_id,
            'menu_id_acima': menu_id_acima,
            'nome': f"📄 {nome} (Página)",
            'marcado': menu_id in permissoes_atuais,
            'children': [],
            'ordem': ordem
        }
        
    # Montagem da estrutura de árvore
    menu_tree = []
    for menu_id, item in menu_items.items():
        id_pai = item['menu_id_acima']
        if id_pai == 0:
            menu_tree.append(item)
        else:
            if id_pai in menu_items:
                menu_items[id_pai]['children'].append(item)
                
    # Ordenar itens principais por ordem
    menu_tree.sort(key=lambda x: x['ordem'])
    for item in menu_items.values():
        item['children'].sort(key=lambda x: x['ordem'])
        
    return render(request, 'sist_central/Perfil/permissoes.html', {
        'perfil': perfil,
        'menu_tree': menu_tree
    })
