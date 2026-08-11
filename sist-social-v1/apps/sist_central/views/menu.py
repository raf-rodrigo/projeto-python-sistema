from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from apps.sist_central.models import Menu, Categoria, Pagina, Modulo

def list_menu(request):
    """
    Exibe a árvore hierárquica do menu do sistema e a lista de categorias.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    # 1. Carrega todas as categorias e páginas para mapeamento de nomes
    categorias_map = {c.id: c for c in Categoria.objects.using('sist_central').all()}
    paginas_map = {p.id: p for p in Pagina.objects.using('sist_central').all()}
    
    # 2. Carrega todos os itens de menu
    menu_items = Menu.objects.using('sist_central').all().order_by('ordem')
    
    # Monta a estrutura em memória
    tree_nodes = {}
    for item in menu_items:
        nome = "Desconhecido"
        icone = ""
        caminho = ""
        
        if item.tipo == 'C':
            cat = categorias_map.get(item.item_id)
            if cat:
                nome = f"📁 {cat.nome} (Categoria)"
                icone = cat.icone
        elif item.tipo == 'P':
            pag = paginas_map.get(item.item_id)
            if pag:
                nome = f"📄 {pag.nome} (Página)"
                icone = pag.icone
                caminho = pag.caminho
                
        tree_nodes[item.id] = {
            'id': item.id,
            'menu_id_acima': item.menu_id_acima,
            'tipo': item.tipo,
            'item_id': item.item_id,
            'ordem': item.ordem,
            'nome': nome,
            'icone': icone,
            'caminho': caminho,
            'children': []
        }
        
    menu_tree = []
    for node_id, node in tree_nodes.items():
        parent_id = node['menu_id_acima']
        if parent_id == 0:
            menu_tree.append(node)
        else:
            if parent_id in tree_nodes:
                tree_nodes[parent_id]['children'].append(node)
                
    # Ordenar recursivamente por ordem
    menu_tree.sort(key=lambda x: x['ordem'])
    for node in tree_nodes.values():
        node['children'].sort(key=lambda x: x['ordem'])
        
    # 3. Lista de categorias para exibição na aba secundária
    categorias = Categoria.objects.using('sist_central').all().select_related('modulo').order_by('nome')
    
    return render(request, 'sist_central/Menu/listar.html', {
        'menu_tree': menu_tree,
        'categorias': categorias,
    })


def create_menu_item(request):
    """
    Adiciona um novo nó/item na árvore de menus.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    
    if request.method == 'POST':
        menu_id_acima = int(request.POST.get('menu_id_acima', '0'))
        tipo = request.POST.get('tipo', 'C')
        item_id = request.POST.get('item_id', '')
        ordem = int(request.POST.get('ordem', '0'))
        
        if not item_id:
            errors.append("É necessário selecionar uma Categoria ou Página.")
            
        if not errors:
            try:
                new_item = Menu(
                    menu_id_acima=menu_id_acima,
                    tipo=tipo,
                    item_id=int(item_id),
                    ordem=ordem
                )
                new_item.save(using='sist_central')
                messages.success(request, "Item adicionado ao menu com sucesso!")
                return redirect('list_menu')
            except Exception as e:
                errors.append(f"Erro ao salvar item no menu: {str(e)}")
                
    # Opções para o formulário
    # Apenas itens de menu que são Categorias ('C') podem ser pais de outros itens
    menu_items = Menu.objects.using('sist_central').filter(tipo='C')
    categorias_map = {c.id: c.nome for c in Categoria.objects.using('sist_central').all()}
    
    parent_choices = []
    for m in menu_items:
        nome_cat = categorias_map.get(m.item_id, f"ID {m.item_id}")
        parent_choices.append({'id': m.id, 'nome': f"📁 {nome_cat}"})
        
    categorias_disponiveis = Categoria.objects.using('sist_central').filter(ativo=1).order_by('nome')
    paginas_disponiveis = Pagina.objects.using('sist_central').filter(ativo=1).order_by('nome')
    
    return render(request, 'sist_central/Menu/adicionar_item.html', {
        'parent_choices': parent_choices,
        'categorias': categorias_disponiveis,
        'paginas': paginas_disponiveis,
        'errors': errors
    })


def edit_menu_item(request, pk):
    """
    Edita a ordenação ou o nó pai de um item de menu existente.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    menu_item = get_object_or_404(Menu.objects.using('sist_central'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        menu_id_acima = int(request.POST.get('menu_id_acima', '0'))
        ordem = int(request.POST.get('ordem', '0'))
        
        if menu_id_acima == menu_item.id:
            errors.append("Um item não pode ser pai de si mesmo.")
            
        if not errors:
            try:
                menu_item.menu_id_acima = menu_id_acima
                menu_item.ordem = ordem
                menu_item.save(using='sist_central')
                messages.success(request, "Item de menu atualizado com sucesso!")
                return redirect('list_menu')
            except Exception as e:
                errors.append(f"Erro ao salvar: {str(e)}")
                
    menu_items = Menu.objects.using('sist_central').filter(tipo='C').exclude(id=pk)
    categorias_map = {c.id: c.nome for c in Categoria.objects.using('sist_central').all()}
    paginas_map = {p.id: p.nome for p in Pagina.objects.using('sist_central').all()}
    
    parent_choices = []
    for m in menu_items:
        nome_cat = categorias_map.get(m.item_id, f"ID {m.item_id}")
        parent_choices.append({'id': m.id, 'nome': f"📁 {nome_cat}"})
        
    # Identifica o nome do item atual
    item_nome = "Desconhecido"
    if menu_item.tipo == 'C':
        item_nome = f"📁 {categorias_map.get(menu_item.item_id, 'Categoria')}"
    else:
        item_nome = f"📄 {paginas_map.get(menu_item.item_id, 'Página')}"
        
    return render(request, 'sist_central/Menu/editar_item.html', {
        'menu_item': menu_item,
        'item_nome': item_nome,
        'parent_choices': parent_choices,
        'errors': errors
    })


def delete_menu_item(request, pk):
    """
    Remove um item da estrutura do menu.
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        # Se for uma categoria, remove ou redefine os filhos antes de excluir?
        # Para simplificar, mudamos o menu_id_acima dos filhos para 0 (raiz)
        Menu.objects.using('sist_central').filter(menu_id_acima=pk).update(menu_id_acima=0)
        
        menu_item = Menu.objects.using('sist_central').get(pk=pk)
        menu_item.delete(using='sist_central')
        
        return JsonResponse({
            'success': True,
            'message': "O item foi removido da estrutura do menu com sucesso!"
        })
    except Menu.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Item não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


def create_categoria(request):
    """
    Cadastra uma nova categoria no sistema.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        modulo_id = request.POST.get('modulo_id', '')
        icone = request.POST.get('icone', '').strip()
        ativo = request.POST.get('ativo', '1')
        
        if not nome or not modulo_id:
            errors.append("Nome da categoria e Módulo são obrigatórios.")
            
        if not errors:
            try:
                modulo = Modulo.objects.using('sist_central').get(id=modulo_id)
                new_cat = Categoria(
                    modulo=modulo,
                    nome=nome,
                    icone=icone or None,
                    ativo=int(ativo)
                )
                new_cat.save(using='sist_central')
                messages.success(request, f"Categoria '{nome}' criada com sucesso!")
                return redirect('list_menu')
            except Exception as e:
                errors.append(f"Erro ao salvar: {str(e)}")
                
    modulos = Modulo.objects.using('sist_central').filter(ativo=1).order_by('nome')
    return render(request, 'sist_central/Menu/adicionar_categoria.html', {
        'modulos': modulos,
        'errors': errors
    })


def edit_categoria(request, pk):
    """
    Edita uma categoria existente.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    categoria = get_object_or_404(Categoria.objects.using('sist_central'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        modulo_id = request.POST.get('modulo_id', '')
        icone = request.POST.get('icone', '').strip()
        ativo = request.POST.get('ativo', '1')
        
        if not nome or not modulo_id:
            errors.append("Nome da categoria e Módulo são obrigatórios.")
            
        if not errors:
            try:
                modulo = Modulo.objects.using('sist_central').get(id=modulo_id)
                categoria.nome = nome
                categoria.modulo = modulo
                categoria.icone = icone or None
                categoria.ativo = int(ativo)
                categoria.save(using='sist_central')
                messages.success(request, f"Categoria '{nome}' atualizada com sucesso!")
                return redirect('list_menu')
            except Exception as e:
                errors.append(f"Erro ao salvar: {str(e)}")
                
    modulos = Modulo.objects.using('sist_central').filter(ativo=1).order_by('nome')
    return render(request, 'sist_central/Menu/editar_categoria.html', {
        'categoria': categoria,
        'modulos': modulos,
        'errors': errors
    })
