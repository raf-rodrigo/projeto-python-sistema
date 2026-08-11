from django.shortcuts import render, redirect
from apps.sist_central.models.ImagensParametrizacao import ImagensParametrizacao
from apps.sist_central.services.login_service import (
    validar_usuario,
    registrar_sessao,
    obter_unidades_usuario,
    atualizar_unidade_usuario
)


def render_login_page(request, context):
    """
    Helper to inject custom parametrized branding images into the login page context.
    """
    try:
        images = {img.tipo: img.caminho for img in ImagensParametrizacao.objects.using('sist_central').filter(
            tipo__in=['login', 'background_login', 'rodape']
        )}
        if 'login' in images:
            context['img_login_url'] = f"/media/{images['login']}"
        if 'background_login' in images:
            context['img_background_url'] = f"/media/{images['background_login']}"
        if 'rodape' in images:
            context['img_rodape_url'] = f"/media/{images['rodape']}"
    except Exception:
        pass
    return render(request, 'sist_central/Login/login.html', context)


def login(request):
    usuario_digitado = ""
    senha_digitada = ""
    
    if request.method == 'POST':
        usuario_digitado = request.POST.get('usuario', '')
        senha_digitada = request.POST.get('senha', '')
        unidade_selecionada = request.POST.get('selUnidade', '')

        # 1. Valida Usuário e Senha
        usuario, erro = validar_usuario(usuario_digitado, senha_digitada)

        if erro:
            return render_login_page(request, {
                'msgErros': erro,
                'renderiza_login_sistsocial': 1,
                'renderiza_sso': 0,
                'renderiza_sso_betha': 0,
                'renderiza_recupera_senha': 1,
            })

        # 2. Busca as unidades vinculadas ao usuário no Recursos Humanos
        unidades, erro_unidade = obter_unidades_usuario(usuario_digitado)
        if erro_unidade:
            return render_login_page(request, {
                'msgErros': erro_unidade,
                'renderiza_login_sistsocial': 1,
                'renderiza_sso': 0,
                'renderiza_sso_betha': 0,
                'renderiza_recupera_senha': 1,
                'usuario_digitado': usuario_digitado,
            })

        # 3. Trata unidades
        if len(unidades) > 1:
            # Se possui múltiplas unidades e ainda não selecionou
            if not unidade_selecionada:
                return render_login_page(request, {
                    'renderiza_login_sistsocial': 1,
                    'renderiza_sso': 0,
                    'renderiza_sso_betha': 0,
                    'renderiza_recupera_senha': 1,
                    'usuario_digitado': usuario_digitado,
                    'senha_digitada': senha_digitada,  # Passa para manter no form
                    'unidades': unidades,
                    'mostrar_unidades': True,
                    'msgAviso': 'Este usuário está cadastrado em mais de uma unidade. Por gentileza, selecione a unidade desejada.'
                })
            else:
                # O usuário selecionou uma unidade
                unidade_obj, erro_atualizacao = atualizar_unidade_usuario(usuario_digitado, unidade_selecionada)
                if erro_atualizacao:
                    return render_login_page(request, {
                        'msgErros': f"Erro ao selecionar unidade: {erro_atualizacao}",
                        'renderiza_login_sistsocial': 1,
                        'renderiza_sso': 0,
                        'renderiza_sso_betha': 0,
                        'renderiza_recupera_senha': 1,
                        'usuario_digitado': usuario_digitado,
                        'senha_digitada': senha_digitada,
                        'unidades': unidades,
                        'mostrar_unidades': True,
                    })
        elif len(unidades) == 1:
            # Possui exatamente 1 unidade, seleciona automaticamente
            unidade_obj, erro_atualizacao = atualizar_unidade_usuario(usuario_digitado, unidades[0].id)
            if erro_atualizacao:
                return render_login_page(request, {
                    'msgErros': f"Erro ao selecionar unidade padrão: {erro_atualizacao}",
                    'renderiza_login_sistsocial': 1,
                    'renderiza_sso': 0,
                    'renderiza_sso_betha': 0,
                    'renderiza_recupera_senha': 1,
                    'usuario_digitado': usuario_digitado,
                })
        else:
            return render_login_page(request, {
                'msgErros': "Este usuário não possui unidades cadastradas.",
                'renderiza_login_sistsocial': 1,
                'renderiza_sso': 0,
                'renderiza_sso_betha': 0,
                'renderiza_recupera_senha': 1,
                'usuario_digitado': usuario_digitado,
            })

        # 4. Registra Sessão e Redireciona
        registrar_sessao(request, usuario, unidade_obj)

        return redirect('dashboard')

    return render_login_page(request, {
        'renderiza_login_sistsocial': 1,
        'renderiza_sso': 0,
        'renderiza_sso_betha': 0,
        'renderiza_recupera_senha': 1,
    })


def logout(request):
    request.session.flush()
    return redirect('login')