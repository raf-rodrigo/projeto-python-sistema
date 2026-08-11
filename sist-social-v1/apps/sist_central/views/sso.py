from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.http import JsonResponse
from apps.sist_central.models import Sso

def list_sso(request):
    """
    Lista as plataformas de login SSO e seus respectivos status.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    sso_list = Sso.objects.using('sist_central').all().order_by('id')
    return render(request, 'sist_central/Sso/listar.html', {
        'sso_list': sso_list
    })


def edit_sso(request, pk):
    """
    Edita as credenciais e endereços da plataforma SSO selecionada.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    sso = get_object_or_404(Sso.objects.using('sist_central'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        client_id = request.POST.get('client_id', '').strip()
        client_secret = request.POST.get('client_secret', '').strip()
        callback = request.POST.get('callback', '').strip()
        api_url = request.POST.get('api_url', '').strip()
        ativo = request.POST.get('ativo', '1')
        
        if not client_id or not callback or not api_url:
            errors.append("Os campos Client ID, Callback URL e API URL são obrigatórios.")
            
        if not errors:
            sso.client_id = client_id
            sso.client_secret = client_secret
            sso.callback = callback
            sso.api_url = api_url
            sso.ativo = int(ativo)
            sso.save(using='sist_central')
            
            # Sincroniza também a tabela de configurações para ativar/desativar botões na tela de login
            # e.g. LOGIN_VISION / LOGIN_BETHA se o status for alterado
            # (as chaves correspondentes são LOGIN_VISION e LOGIN_BETHA)
            key_name = f"LOGIN_{sso.plataforma.upper()}"
            from django.db import connections
            with connections['sist_central'].cursor() as cursor:
                cursor.execute(
                    "UPDATE configuracoes SET valor = %s WHERE chave = %s",
                    [str(sso.ativo), key_name]
                )
                
            messages.success(request, f"Integração SSO da plataforma '{sso.plataforma}' atualizada com sucesso.")
            return redirect('list_sso')
            
    return render(request, 'sist_central/Sso/editar.html', {
        'sso': sso,
        'errors': errors
    })


def toggle_sso_status(request, pk):
    """
    Alterna o status da integração SSO via AJAX.
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        sso = Sso.objects.using('sist_central').get(pk=pk)
        
        # Alterna 1 e 0
        sso.ativo = 0 if sso.ativo == 1 else 1
        sso.save(using='sist_central')
        
        # Sincroniza também a tabela configuracoes
        key_name = f"LOGIN_{sso.plataforma.upper()}"
        from django.db import connections
        with connections['sist_central'].cursor() as cursor:
            cursor.execute(
                "UPDATE configuracoes SET valor = %s WHERE chave = %s",
                [str(sso.ativo), key_name]
            )
            
        status_label = 'Ativo' if sso.ativo == 1 else 'Inativo'
        return JsonResponse({
            'success': True,
            'ativo': sso.ativo,
            'message': f"A integração SSO da '{sso.plataforma}' foi alterada para {status_label}!"
        })
    except Sso.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Integração não encontrada.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
