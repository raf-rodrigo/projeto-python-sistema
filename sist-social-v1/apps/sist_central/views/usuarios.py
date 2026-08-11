import hashlib
import random
import string
from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q
from django.http import JsonResponse
from django.contrib import messages
from apps.sist_central.models import Login
from apps.sist_social.models import RecursosHumanos

def list_users(request):
    """
    Lista todos os usuários com paginação e busca por nome, email ou login.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
    
    users = Login.objects.using('sist_central').all().order_by('id')
    if search:
        users = users.filter(
            Q(usuario__icontains=search) |
            Q(nome__icontains=search) |
            Q(email__icontains=search)
        )
        
    paginator = Paginator(users, int(per_page))  # usuários por página
    page_obj = paginator.get_page(page_number)
    
    # Buscar os Recursos Humanos correspondentes no banco default (sist_social)
    usernames = [u.usuario for u in page_obj.object_list]
    rhs = RecursosHumanos.objects.using('default').filter(memberID__in=usernames)
    rh_map = {rh.memberID: rh for rh in rhs}
    
    for u in page_obj.object_list:
        u.recurso_humano = rh_map.get(u.usuario)
        
    return render(request, 'sist_central/Usuarios/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def create_user(request):
    """
    Cadastra um novo usuário vinculando-o a um funcionário de Recursos Humanos.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    
    if request.method == 'POST':
        usuario = request.POST.get('usuario', '').strip()
        senha = request.POST.get('senha', '')
        confirmacao_senha = request.POST.get('confirmacao_senha', '')
        recurso_humano_id = request.POST.get('recurso_humano_id', '').strip()
        ativo = request.POST.get('ativo', '1')
        
        # Validações básicas
        if not usuario or not senha or not confirmacao_senha or not recurso_humano_id:
            errors.append("Todos os campos são obrigatórios.")
            
        if senha != confirmacao_senha:
            errors.append("A confirmação de senha não coincide com a senha informada.")
            
        if len(senha) < 3:
            errors.append("A senha deve ter pelo menos 3 caracteres.")
            
        # Verifica se o login de usuário já existe no banco central
        if Login.objects.using('sist_central').filter(usuario=usuario).exists():
            errors.append(f"O nome de usuário '{usuario}' já está cadastrado no sistema.")
            
        if not errors:
            try:
                rh = RecursosHumanos.objects.using('default').get(id=recurso_humano_id)
            except RecursosHumanos.DoesNotExist:
                errors.append("O funcionário do Recursos Humanos selecionado não existe.")
                
            if not errors:
                # Cria a senha criptografada em MD5
                senha_md5 = hashlib.md5(senha.encode()).hexdigest()
                
                # Salva o usuário no banco sist_central
                new_user = Login(
                    usuario=usuario,
                    nome=rh.nome,
                    email=rh.email,
                    senha=senha_md5,
                    ativo=int(ativo),
                    trocar_senha=0,
                )
                new_user.save(using='sist_central')
                
                # Atualiza o memberID no banco de Recursos Humanos (sist_social)
                rh.memberID = usuario
                rh.save(using='default')
                
                messages.success(request, f"Usuário '{usuario}' cadastrado com sucesso e associado a '{rh.nome}'.")
                return redirect('list_users')
                
    # Listar Recursos Humanos disponíveis (aqueles que não possuem um usuário associado)
    existing_usernames = list(Login.objects.using('sist_central').values_list('usuario', flat=True))
    recursos_humanos = RecursosHumanos.objects.using('default').exclude(
        memberID__in=existing_usernames
    ).order_by('nome')
    
    return render(request, 'sist_central/Usuarios/adicionar.html', {
        'recursos_humanos': recursos_humanos,
        'errors': errors,
        'form_data': request.POST if request.method == 'POST' else {}
    })


def edit_user(request, pk):
    """
    Edita um usuário existente e ajusta seu vínculo com Recursos Humanos.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    user = get_object_or_404(Login.objects.using('sist_central'), pk=pk)
    
    # Busca o Recursos Humanos vinculado atualmente pelo username
    rh_current = RecursosHumanos.objects.using('default').filter(memberID=user.usuario).first()
    errors = []
    
    if request.method == 'POST':
        usuario = request.POST.get('usuario', '').strip()
        senha = request.POST.get('senha', '')
        confirmacao_senha = request.POST.get('confirmacao_senha', '')
        recurso_humano_id = request.POST.get('recurso_humano_id', '').strip()
        ativo = request.POST.get('ativo', '1')
        
        if not usuario or not recurso_humano_id:
            errors.append("Nome de usuário e vínculo com Recursos Humanos são obrigatórios.")
            
        if senha:
            if senha != confirmacao_senha:
                errors.append("A confirmação de senha não coincide com a senha informada.")
            elif len(senha) < 3:
                errors.append("A senha deve ter pelo menos 3 caracteres.")
                
        # Verifica se o novo username já está em uso por outro usuário
        if usuario != user.usuario and Login.objects.using('sist_central').filter(usuario=usuario).exists():
            errors.append(f"O nome de usuário '{usuario}' já está sendo utilizado por outro cadastro.")
            
        if not errors:
            try:
                new_rh = RecursosHumanos.objects.using('default').get(id=recurso_humano_id)
            except RecursosHumanos.DoesNotExist:
                errors.append("O funcionário do Recursos Humanos selecionado não existe.")
                
            if not errors:
                old_usuario = user.usuario
                user.usuario = usuario
                user.nome = new_rh.nome
                user.email = new_rh.email
                user.ativo = int(ativo)
                
                if senha:
                    user.senha = hashlib.md5(senha.encode()).hexdigest()
                    
                # Ajusta os vínculos no Recursos Humanos
                if rh_current and rh_current.id != new_rh.id:
                    # Desvincula o funcionário de RH antigo
                    rh_current.memberID = None
                    rh_current.save(using='default')
                    # Vincula o novo funcionário
                    new_rh.memberID = usuario
                    new_rh.save(using='default')
                else:
                    # Atualiza o memberID do funcionário caso o username tenha mudado
                    new_rh.memberID = usuario
                    new_rh.save(using='default')
                    
                user.save(using='sist_central')
                
                messages.success(request, f"Usuário '{usuario}' atualizado com sucesso.")
                return redirect('list_users')
                
    # Listar Recursos Humanos disponíveis (excluindo outros que já possuem usuário, mas incluindo o atual)
    existing_usernames = list(Login.objects.using('sist_central').exclude(pk=pk).values_list('usuario', flat=True))
    recursos_humanos = RecursosHumanos.objects.using('default').exclude(
        memberID__in=existing_usernames
    ).order_by('nome')
    
    return render(request, 'sist_central/Usuarios/editar.html', {
        'user': user,
        'recursos_humanos': recursos_humanos,
        'rh_current': rh_current,
        'errors': errors,
    })


def toggle_user_status(request, pk):
    """
    Alterna o status do usuário (Ativo / Inativo) via requisição AJAX.
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        user = Login.objects.using('sist_central').get(pk=pk)
        
        # Alterna entre 1 (Ativo) e 0 (Inativo)
        if user.ativo == 1:
            user.ativo = 0
        else:
            user.ativo = 1
            
        user.save(using='sist_central')
        status_label = 'Ativo' if user.ativo == 1 else 'Inativo'
        return JsonResponse({
            'success': True,
            'ativo': user.ativo,
            'message': f"O status do usuário foi alterado para {status_label} com sucesso!"
        })
    except Login.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Usuário não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


def reset_user_password(request, pk):
    """
    Gera uma nova senha aleatória temporária e força a troca no próximo login.
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    if pk == 1:
        return JsonResponse({
            'success': False,
            'message': 'Não é permitido resetar a senha do administrador principal (ID 1).'
        })
        
    try:
        user = Login.objects.using('sist_central').get(pk=pk)
        
        # Gera uma senha amigável de 8 caracteres (letras e números)
        chars = string.ascii_letters + string.digits
        senha_provisoria = "".join(random.choice(chars) for _ in range(8))
        
        # Grava o hash em MD5 e sinaliza para trocar de senha
        user.senha = hashlib.md5(senha_provisoria.encode()).hexdigest()
        user.trocar_senha = 1
        user.save(using='sist_central')
        
        return JsonResponse({
            'success': True,
            'username': user.usuario,
            'nome': user.nome,
            'email': user.email,
            'senha_provisoria': senha_provisoria,
            'message': f"A senha de {user.usuario} foi resetada!"
        })
    except Login.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Usuário não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
