from django.shortcuts import render, redirect
from django.contrib import messages
from apps.sist_central.models import RegrasSenhas

def manage_password_rules(request):
    """
    Carrega e edita a regra de senha global (ID 1) do sistema central.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    try:
        # Busca a regra global de ID 1 no banco sist_central
        regras = RegrasSenhas.objects.using('sist_central').get(pk=1)
    except RegrasSenhas.DoesNotExist:
        # Caso não exista por algum motivo de teste, criamos uma vazia na memória
        regras = RegrasSenhas(id=1)

    if request.method == 'POST':
        # Captura e converte os valores enviados pelo formulário
        validade_senha = request.POST.get('validade_senha', '180')
        quantidade_minima_caracteres = request.POST.get('quantidade_minima_caracteres', '8')
        quantidade_minuscula = request.POST.get('quantidade_minuscula', '0')
        quantidade_maiuscula = request.POST.get('quantidade_maiuscula', '0')
        quantidade_caracteres_especiais = request.POST.get('quantidade_caracteres_especiais', '0')
        tempo_aviso = request.POST.get('tempo_aviso', '10')
        tempo_recuperacao = request.POST.get('tempo_recuperacao', '0')
        permitir_reutilizacao = request.POST.get('permitir_reutilizacao', '0')

        # Atualiza os dados do objeto
        regras.validade_senha = int(validade_senha)
        regras.quantidade_minima_caracteres = int(quantidade_minima_caracteres)
        regras.quantidade_minuscula = int(quantidade_minuscula)
        regras.quantidade_maiuscula = int(quantidade_maiuscula)
        regras.quantidade_caracteres_especiais = int(quantidade_caracteres_especiais)
        regras.tempo_aviso = int(tempo_aviso)
        regras.tempo_recuperacao = int(tempo_recuperacao)
        regras.permitir_reutilizacao = int(permitir_reutilizacao)

        # Salva especificando o banco 'sist_central'
        regras.save(using='sist_central')
        
        messages.success(request, "Diretrizes de complexidade de senhas atualizadas com sucesso!")
        return redirect('manage_password_rules')

    return render(request, 'sist_central/Senhas/regras.html', {
        'regras': regras
    })
