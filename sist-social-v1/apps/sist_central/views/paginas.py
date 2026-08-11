from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
from django.contrib import messages
from apps.sist_central.models import Pagina, Modulo, Icone, PaginaTipo

def list_paginas(request):
    """
    Lista as páginas com busca por nome, caminho ou módulo.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
    
    paginas = Pagina.objects.using('sist_central').all().select_related('modulo', 'pagina_tipo').order_by('id')
    
    if search:
        paginas = paginas.filter(
            Q(nome__icontains=search) |
            Q(caminho__icontains=search) |
            Q(modulo__nome__icontains=search)
        )
        
    paginator = Paginator(paginas, int(per_page))
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'sist_central/Paginas/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def create_pagina(request):
    """
    Cadastra uma nova página no sistema.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    
    if request.method == 'POST':
        idchave = request.POST.get('idchave', '').strip()
        nome = request.POST.get('nome', '').strip()
        caminho = request.POST.get('caminho', '').strip()
        descricao = request.POST.get('descricao', '').strip()
        modulo_id = request.POST.get('modulo_id', '')
        pagina_tipo_id = request.POST.get('pagina_tipo_id', '')
        icone = request.POST.get('icone', '').strip()
        icone_id = request.POST.get('icone_id', '')
        ativo = request.POST.get('ativo', '1')
        
        if not nome or not caminho or not modulo_id:
            errors.append("Nome, Caminho (Rota) e Módulo são campos obrigatórios.")
            
        if not errors:
            try:
                modulo = Modulo.objects.using('sist_central').get(id=modulo_id)
                pagina_tipo = PaginaTipo.objects.using('sist_central').get(id=pagina_tipo_id) if pagina_tipo_id else None
                icone_rel = Icone.objects.using('sist_central').get(id=icone_id) if icone_id else None
                
                new_pagina = Pagina(
                    idchave=idchave or None,
                    modulo=modulo,
                    nome=nome,
                    caminho=caminho,
                    descricao=descricao or None,
                    icone=icone or None,
                    icone_rel=icone_rel,
                    ativo=int(ativo),
                    pagina_tipo=pagina_tipo
                )
                new_pagina.save(using='sist_central')
                
                messages.success(request, f"Página '{nome}' cadastrada com sucesso!")
                return redirect('list_paginas')
            except Exception as e:
                errors.append(f"Erro ao salvar página: {str(e)}")
                
    modulos = Modulo.objects.using('sist_central').filter(ativo=1).order_by('nome')
    tipos = PaginaTipo.objects.using('sist_central').all().order_by('nome')
    icones = Icone.objects.using('sist_central').all().order_by('nome')
    
    return render(request, 'sist_central/Paginas/adicionar.html', {
        'modulos': modulos,
        'tipos': tipos,
        'icones': icones,
        'errors': errors,
        'form_data': request.POST if request.method == 'POST' else {}
    })


def edit_pagina(request, pk):
    """
    Edita uma página existente.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    pagina = get_object_or_404(Pagina.objects.using('sist_central'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        idchave = request.POST.get('idchave', '').strip()
        nome = request.POST.get('nome', '').strip()
        caminho = request.POST.get('caminho', '').strip()
        descricao = request.POST.get('descricao', '').strip()
        modulo_id = request.POST.get('modulo_id', '')
        pagina_tipo_id = request.POST.get('pagina_tipo_id', '')
        icone = request.POST.get('icone', '').strip()
        icone_id = request.POST.get('icone_id', '')
        ativo = request.POST.get('ativo', '1')
        
        if not nome or not caminho or not modulo_id:
            errors.append("Nome, Caminho (Rota) e Módulo são campos obrigatórios.")
            
        if not errors:
            try:
                modulo = Modulo.objects.using('sist_central').get(id=modulo_id)
                pagina_tipo = PaginaTipo.objects.using('sist_central').get(id=pagina_tipo_id) if pagina_tipo_id else None
                icone_rel = Icone.objects.using('sist_central').get(id=icone_id) if icone_id else None
                
                pagina.idchave = idchave or None
                pagina.modulo = modulo
                pagina.nome = nome
                pagina.caminho = caminho
                pagina.descricao = descricao or None
                pagina.icone = icone or None
                pagina.icone_rel = icone_rel
                pagina.ativo = int(ativo)
                pagina.pagina_tipo = pagina_tipo
                pagina.save(using='sist_central')
                
                messages.success(request, f"Página '{nome}' atualizada com sucesso!")
                return redirect('list_paginas')
            except Exception as e:
                errors.append(f"Erro ao salvar página: {str(e)}")
                
    modulos = Modulo.objects.using('sist_central').filter(ativo=1).order_by('nome')
    tipos = PaginaTipo.objects.using('sist_central').all().order_by('nome')
    icones = Icone.objects.using('sist_central').all().order_by('nome')
    
    return render(request, 'sist_central/Paginas/editar.html', {
        'pagina': pagina,
        'modulos': modulos,
        'tipos': tipos,
        'icones': icones,
        'errors': errors
    })


def toggle_pagina_status(request, pk):
    """
    Inverte o status ativo/inativo da página (AJAX).
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        pagina = Pagina.objects.using('sist_central').get(pk=pk)
        pagina.ativo = 0 if pagina.ativo == 1 else 1
        pagina.save(using='sist_central')
        
        status_label = 'Ativa' if pagina.ativo == 1 else 'Inativa'
        return JsonResponse({
            'success': True,
            'ativo': pagina.ativo,
            'message': f"O status da página foi alterado para {status_label} com sucesso!"
        })
    except Pagina.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Página não encontrada.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
