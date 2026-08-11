from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from django.contrib import messages
from apps.sist_central.models import Configuracoes

def list_configuracoes(request):
    """
    Lista todos os parâmetros de configuração geral com paginação e busca por chave ou descrição.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
    
    configs = Configuracoes.objects.using('sist_central').all().order_by('id')
    
    if search:
        configs = configs.filter(
            Q(chave__icontains=search) |
            Q(descricao__icontains=search)
        )
        
    paginator = Paginator(configs, int(per_page))
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'sist_central/Configuracoes/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def edit_configuracao(request, pk):
    """
    Edita o valor de um parâmetro de configuração específico.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    config = get_object_or_404(Configuracoes.objects.using('sist_central'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        valor = request.POST.get('valor', '').strip()
        
        # O campo de valor pode ser opcional ou obrigatório dependendo da regra,
        # mas permitimos gravar em branco caso necessário.
        config.valor = valor
        config.save(using='sist_central')
        
        messages.success(request, f"Parâmetro '{config.descricao or config.chave}' atualizado com sucesso!")
        return redirect('list_configuracoes')
        
    return render(request, 'sist_central/Configuracoes/editar.html', {
        'config': config,
        'errors': errors
    })
