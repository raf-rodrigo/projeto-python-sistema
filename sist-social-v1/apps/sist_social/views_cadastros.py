from django.shortcuts import render, redirect, get_object_or_404
from django.core.paginator import Paginator
from django.db.models import Q, Prefetch
from django.http import JsonResponse
from django.contrib import messages
from datetime import datetime
from apps.sist_social.models import (
    UnidadeAtendimentoSocial, TipoUnidades,
    Servicos, TipoServSocial,
    OrgaosRecursos, TipoOrgaosRecursos,
    OrientacaoSexual, TipoEstadoCivil, TipoParentesco, TipoResidencia,
    FaixaRendaPessoa, FaixaRendaPercapta, FamiliaDomicilio, Pessoas
)
from apps.sist_central.models import Configuracoes

# =========================================================================
# 1. UNIDADE DE ATENDIMENTO SOCIAL (CRUD)
# =========================================================================

def list_unidades(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
        
    unidades = UnidadeAtendimentoSocial.objects.using('default').all().select_related('tipo_unidade').order_by('id')
    
    if search:
        unidades = unidades.filter(
            Q(nome_conhecido__icontains=search) |
            Q(razao_social__icontains=search) |
            Q(municipio__icontains=search) |
            Q(sigla__icontains=search)
        )
        
    paginator = Paginator(unidades, int(per_page))
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'sist_social/Unidades/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def create_unidade(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    if request.method == 'POST':
        nome_conhecido = request.POST.get('nome_conhecido', '').strip()
        razao_social = request.POST.get('razao_social', '').strip()
        tipo_unidade_id = request.POST.get('tipo_unidade_id', '')
        codigo = request.POST.get('codigo', '').strip()
        cnpj = request.POST.get('cnpj', '').strip()
        cep = request.POST.get('cep', '').strip()
        tipo_lograd = request.POST.get('tipo_lograd', '').strip()
        logradouro = request.POST.get('logradouro', '').strip()
        lograd_num = request.POST.get('lograd_num', '').strip()
        lograd_compl = request.POST.get('lograd_compl', '').strip()
        bairro = request.POST.get('bairro', '').strip()
        municipio = request.POST.get('municipio', '').strip()
        uf = request.POST.get('uf', '').strip()
        email = request.POST.get('email', '').strip()
        telefone = request.POST.get('telefone', '').strip()
        horario_func = request.POST.get('horario_func', '').strip()
        observacao = request.POST.get('observacao', '').strip()
        imovel_social = request.POST.get('imovel_social', 'Não')
        natureza = request.POST.get('natureza', 'Pública')
        ativo = request.POST.get('ativo', '1')
        
        if not nome_conhecido or not tipo_unidade_id:
            errors.append("Nome Conhecido e Tipo de Unidade são obrigatórios.")
            
        if not errors:
            try:
                tipo_u = TipoUnidades.objects.using('default').get(id=tipo_unidade_id)
                new_unidade = UnidadeAtendimentoSocial(
                    nome_conhecido=nome_conhecido,
                    razao_social=razao_social or None,
                    tipo_unidade=tipo_u,
                    codigo=codigo or None,
                    cnpj=cnpj or None,
                    cep=cep or None,
                    tipo_lograd=tipo_lograd or None,
                    logradouro=logradouro or None,
                    lograd_num=lograd_num or None,
                    lograd_compl=lograd_compl or None,
                    bairro=bairro or None,
                    municipio=municipio or None,
                    uf=uf or None,
                    email=email or None,
                    telefone=telefone or None,
                    horario_func=horario_func or None,
                    observacao=observacao or None,
                    imovel_social=imovel_social,
                    natureza=natureza,
                    ativo=int(ativo)
                )
                new_unidade.save(using='default')
                messages.success(request, f"Unidade '{nome_conhecido}' cadastrada com sucesso!")
                return redirect('list_unidades')
            except Exception as e:
                errors.append(f"Erro ao salvar unidade: {str(e)}")
                
    tipos = TipoUnidades.objects.using('default').filter(ativo=1).order_by('tipo')
    return render(request, 'sist_social/Unidades/adicionar.html', {
        'tipos': tipos,
        'errors': errors,
        'form_data': request.POST if request.method == 'POST' else {}
    })


def edit_unidade(request, pk):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    unidade = get_object_or_404(UnidadeAtendimentoSocial.objects.using('default'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        nome_conhecido = request.POST.get('nome_conhecido', '').strip()
        razao_social = request.POST.get('razao_social', '').strip()
        tipo_unidade_id = request.POST.get('tipo_unidade_id', '')
        codigo = request.POST.get('codigo', '').strip()
        cnpj = request.POST.get('cnpj', '').strip()
        cep = request.POST.get('cep', '').strip()
        tipo_lograd = request.POST.get('tipo_lograd', '').strip()
        logradouro = request.POST.get('logradouro', '').strip()
        lograd_num = request.POST.get('lograd_num', '').strip()
        lograd_compl = request.POST.get('lograd_compl', '').strip()
        bairro = request.POST.get('bairro', '').strip()
        municipio = request.POST.get('municipio', '').strip()
        uf = request.POST.get('uf', '').strip()
        email = request.POST.get('email', '').strip()
        telefone = request.POST.get('telefone', '').strip()
        horario_func = request.POST.get('horario_func', '').strip()
        observacao = request.POST.get('observacao', '').strip()
        imovel_social = request.POST.get('imovel_social', 'Não')
        natureza = request.POST.get('natureza', 'Pública')
        ativo = request.POST.get('ativo', '1')
        
        if not nome_conhecido or not tipo_unidade_id:
            errors.append("Nome Conhecido e Tipo de Unidade são obrigatórios.")
            
        if not errors:
            try:
                tipo_u = TipoUnidades.objects.using('default').get(id=tipo_unidade_id)
                unidade.nome_conhecido = nome_conhecido
                unidade.razao_social = razao_social or None
                unidade.tipo_unidade = tipo_u
                unidade.codigo = codigo or None
                unidade.cnpj = cnpj or None
                unidade.cep = cep or None
                unidade.tipo_lograd = tipo_lograd or None
                unidade.logradouro = logradouro or None
                unidade.lograd_num = lograd_num or None
                unidade.lograd_compl = lograd_compl or None
                unidade.bairro = bairro or None
                unidade.municipio = municipio or None
                unidade.uf = uf or None
                unidade.email = email or None
                unidade.telefone = telefone or None
                unidade.horario_func = horario_func or None
                unidade.observacao = observacao or None
                unidade.imovel_social = imovel_social
                unidade.natureza = natureza
                unidade.ativo = int(ativo)
                unidade.save(using='default')
                
                messages.success(request, f"Unidade '{nome_conhecido}' atualizada com sucesso!")
                return redirect('list_unidades')
            except Exception as e:
                errors.append(f"Erro ao atualizar unidade: {str(e)}")
                
    tipos = TipoUnidades.objects.using('default').filter(ativo=1).order_by('tipo')
    return render(request, 'sist_social/Unidades/editar.html', {
        'unidade': unidade,
        'tipos': tipos,
        'errors': errors
    })


def toggle_unidade_status(request, pk):
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        unidade = UnidadeAtendimentoSocial.objects.using('default').get(pk=pk)
        unidade.ativo = 0 if unidade.ativo == 1 else 1
        unidade.save(using='default')
        
        status_label = 'Ativa' if unidade.ativo == 1 else 'Inativa'
        return JsonResponse({
            'success': True,
            'ativo': unidade.ativo,
            'message': f"O status da unidade foi alterado para {status_label} com sucesso!"
        })
    except UnidadeAtendimentoSocial.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Unidade não encontrada.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


# =========================================================================
# 2. SERVIÇOS SOCIAIS (CRUD)
# =========================================================================

def list_servicos(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
        
    servicos = Servicos.objects.using('default').all().select_related('unidade', 'tipo_serv').order_by('id')
    
    if search:
        servicos = servicos.filter(
            Q(unidade__nome_conhecido__icontains=search) |
            Q(tipo_serv__descricao__icontains=search)
        )
        
    paginator = Paginator(servicos, int(per_page))
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'sist_social/Servicos/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def create_servico(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    if request.method == 'POST':
        unidade_id = request.POST.get('unidade_id', '')
        tipo_serv_id = request.POST.get('tipo_serv_id', '')
        prev_atend_mens = request.POST.get('prev_atend_mens', '0')
        prev_atend_anual = request.POST.get('prev_atend_anual', '0')
        previsao_orcament = request.POST.get('previsao_orcament', '0.0')
        rec_fin_fmas = request.POST.get('rec_fin_fmas', '0.0')
        rec_fin_fmdca = request.POST.get('rec_fin_fmdca', '0.0')
        rec_fin_feas = request.POST.get('rec_fin_feas', '0.0')
        rec_fin_fedca = request.POST.get('rec_fin_fedca', '0.0')
        rec_fin_fnas = request.POST.get('rec_fin_fnas', '0.0')
        rec_fin_fndca = request.POST.get('rec_fin_fndca', '0.0')
        rec_fin_outro = request.POST.get('rec_fin_outro', '0.0')
        outra_fonte_fin = request.POST.get('outra_fonte_fin', '').strip()
        ativo = request.POST.get('ativo', '1')
        
        if not unidade_id or not tipo_serv_id:
            errors.append("Unidade e Tipo de Serviço são obrigatórios.")
            
        if not errors:
            try:
                unidade = UnidadeAtendimentoSocial.objects.using('default').get(id=unidade_id)
                tipo_serv = TipoServSocial.objects.using('default').get(id=tipo_serv_id)
                
                new_servico = Servicos(
                    unidade=unidade,
                    tipo_serv=tipo_serv,
                    prev_atend_mens=int(prev_atend_mens) if prev_atend_mens else 0,
                    prev_atend_anual=int(prev_atend_anual) if prev_atend_anual else 0,
                    previsao_orcament=float(previsao_orcament) if previsao_orcament else 0.0,
                    rec_fin_fmas=float(rec_fin_fmas) if rec_fin_fmas else 0.0,
                    rec_fin_fmdca=float(rec_fin_fmdca) if rec_fin_fmdca else 0.0,
                    rec_fin_feas=float(rec_fin_feas) if rec_fin_feas else 0.0,
                    rec_fin_fedca=float(rec_fin_fedca) if rec_fin_fedca else 0.0,
                    rec_fin_fnas=float(rec_fin_fnas) if rec_fin_fnas else 0.0,
                    rec_fin_fndca=float(rec_fin_fndca) if rec_fin_fndca else 0.0,
                    rec_fin_outro=float(rec_fin_outro) if rec_fin_outro else 0.0,
                    outra_fonte_fin=outra_fonte_fin or None,
                    ativo=int(ativo)
                )
                new_servico.save(using='default')
                messages.success(request, "Serviço cadastrado com sucesso!")
                return redirect('list_servicos')
            except Exception as e:
                errors.append(f"Erro ao salvar serviço: {str(e)}")
                
    unidades = UnidadeAtendimentoSocial.objects.using('default').filter(ativo=1).order_by('nome_conhecido')
    tipos = TipoServSocial.objects.using('default').filter(ativo=1).order_by('descricao')
    return render(request, 'sist_social/Servicos/adicionar.html', {
        'unidades': unidades,
        'tipos': tipos,
        'errors': errors,
        'form_data': request.POST if request.method == 'POST' else {}
    })


def edit_servico(request, pk):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    servico = get_object_or_404(Servicos.objects.using('default'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        unidade_id = request.POST.get('unidade_id', '')
        tipo_serv_id = request.POST.get('tipo_serv_id', '')
        prev_atend_mens = request.POST.get('prev_atend_mens', '0')
        prev_atend_anual = request.POST.get('prev_atend_anual', '0')
        previsao_orcament = request.POST.get('previsao_orcament', '0.0')
        rec_fin_fmas = request.POST.get('rec_fin_fmas', '0.0')
        rec_fin_fmdca = request.POST.get('rec_fin_fmdca', '0.0')
        rec_fin_feas = request.POST.get('rec_fin_feas', '0.0')
        rec_fin_fedca = request.POST.get('rec_fin_fedca', '0.0')
        rec_fin_fnas = request.POST.get('rec_fin_fnas', '0.0')
        rec_fin_fndca = request.POST.get('rec_fin_fndca', '0.0')
        rec_fin_outro = request.POST.get('rec_fin_outro', '0.0')
        outra_fonte_fin = request.POST.get('outra_fonte_fin', '').strip()
        ativo = request.POST.get('ativo', '1')
        
        if not unidade_id or not tipo_serv_id:
            errors.append("Unidade e Tipo de Serviço são obrigatórios.")
            
        if not errors:
            try:
                unidade = UnidadeAtendimentoSocial.objects.using('default').get(id=unidade_id)
                tipo_serv = TipoServSocial.objects.using('default').get(id=tipo_serv_id)
                
                servico.unidade = unidade
                servico.tipo_serv = tipo_serv
                servico.prev_atend_mens = int(prev_atend_mens) if prev_atend_mens else 0
                servico.prev_atend_anual = int(prev_atend_anual) if prev_atend_anual else 0
                servico.previsao_orcament = float(previsao_orcament) if previsao_orcament else 0.0
                servico.rec_fin_fmas = float(rec_fin_fmas) if rec_fin_fmas else 0.0
                servico.rec_fin_fmdca = float(rec_fin_fmdca) if rec_fin_fmdca else 0.0
                servico.rec_fin_feas = float(rec_fin_feas) if rec_fin_feas else 0.0
                servico.rec_fin_fedca = float(rec_fin_fedca) if rec_fin_fedca else 0.0
                servico.rec_fin_fnas = float(rec_fin_fnas) if rec_fin_fnas else 0.0
                servico.rec_fin_fndca = float(rec_fin_fndca) if rec_fin_fndca else 0.0
                servico.rec_fin_outro = float(rec_fin_outro) if rec_fin_outro else 0.0
                servico.outra_fonte_fin = outra_fonte_fin or None
                servico.ativo = int(ativo)
                servico.save(using='default')
                
                messages.success(request, "Serviço atualizado com sucesso!")
                return redirect('list_servicos')
            except Exception as e:
                errors.append(f"Erro ao atualizar serviço: {str(e)}")
                
    unidades = UnidadeAtendimentoSocial.objects.using('default').filter(ativo=1).order_by('nome_conhecido')
    tipos = TipoServSocial.objects.using('default').filter(ativo=1).order_by('descricao')
    return render(request, 'sist_social/Servicos/editar.html', {
        'servico': servico,
        'unidades': unidades,
        'tipos': tipos,
        'errors': errors
    })


def toggle_servico_status(request, pk):
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        servico = Servicos.objects.using('default').get(pk=pk)
        servico.ativo = 0 if servico.ativo == 1 else 1
        servico.save(using='default')
        
        status_label = 'Ativo' if servico.ativo == 1 else 'Inativo'
        return JsonResponse({
            'success': True,
            'ativo': servico.ativo,
            'message': f"O status do serviço foi alterado para {status_label} com sucesso!"
        })
    except Servicos.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Serviço não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


# =========================================================================
# 3. ÓRGÃOS E RECURSOS SOCIAIS (CRUD)
# =========================================================================

def list_orgaos(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
        
    orgaos = OrgaosRecursos.objects.using('default').all().select_related('tipo_orgao').order_by('id')
    
    if search:
        orgaos = orgaos.filter(
            Q(nome__icontains=search) |
            Q(sigla__icontains=search) |
            Q(esfera__icontains=search) |
            Q(municipio__icontains=search)
        )
        
    paginator = Paginator(orgaos, int(per_page))
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'sist_social/Orgaos/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def create_orgao(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        sigla = request.POST.get('sigla', '').strip()
        esfera = request.POST.get('esfera', 'Municipal')
        cnpj = request.POST.get('cnpj', '').strip()
        email = request.POST.get('email', '').strip()
        telefone = request.POST.get('telefone', '').strip()
        telefone2 = request.POST.get('telefone2', '').strip()
        cep = request.POST.get('cep', '').strip()
        tipo_lograd = request.POST.get('tipo_lograd', '').strip()
        logradouro = request.POST.get('logradouro', '').strip()
        lograd_num = request.POST.get('lograd_num', '').strip()
        lograd_compl = request.POST.get('lograd_compl', '').strip()
        bairro = request.POST.get('bairro', '').strip()
        municipio = request.POST.get('municipio', '').strip()
        uf = request.POST.get('uf', '').strip()
        tipo_orgao_id = request.POST.get('tipo_orgao_id', '')
        horario_func = request.POST.get('horario_func', '').strip()
        recursos_disponiveis = request.POST.get('recursos_disponiveis', '').strip()
        num_lei_criacao = request.POST.get('num_lei_criacao', '').strip()
        dt_lei_criacao_str = request.POST.get('dt_lei_criacao', '').strip()
        num_lei_atualiz = request.POST.get('num_lei_atualiz', '').strip()
        hora_ini = request.POST.get('hora_ini', '').strip()
        hora_fim = request.POST.get('hora_fim', '').strip()
        ativo = request.POST.get('ativo', '1')
        
        if not nome or not tipo_orgao_id:
            errors.append("Nome do Órgão/Recurso e Tipo de Órgão são obrigatórios.")
        
        dt_lei_criacao = None
        if dt_lei_criacao_str:
            try:
                dt_lei_criacao = datetime.strptime(dt_lei_criacao_str, "%Y-%m-%d").date()
            except ValueError:
                errors.append("Data da lei de criação inválida. Formato esperado: AAAA-MM-DD")
            
        if not errors:
            try:
                tipo_o = TipoOrgaosRecursos.objects.using('default').get(id=tipo_orgao_id)
                new_orgao = OrgaosRecursos(
                    nome=nome,
                    sigla=sigla or None,
                    esfera=esfera,
                    cnpj=cnpj or None,
                    email=email or None,
                    telefone=telefone or None,
                    telefone2=telefone2 or None,
                    cep=cep or None,
                    tipo_lograd=tipo_lograd or None,
                    logradouro=logradouro or None,
                    lograd_num=lograd_num or None,
                    lograd_compl=lograd_compl or None,
                    bairro=bairro or None,
                    municipio=municipio or None,
                    uf=uf or None,
                    tipo_orgao=tipo_o,
                    horario_func=horario_func or None,
                    recursos_disponiveis=recursos_disponiveis or None,
                    num_lei_criacao=num_lei_criacao or None,
                    dt_lei_criacao=dt_lei_criacao,
                    num_lei_atualiz=num_lei_atualiz or None,
                    hora_ini=hora_ini or None,
                    hora_fim=hora_fim or None,
                    ativo=int(ativo)
                )
                new_orgao.save(using='default')
                messages.success(request, f"Órgão/Recurso '{nome}' cadastrado com sucesso!")
                return redirect('list_orgaos')
            except Exception as e:
                errors.append(f"Erro ao salvar órgão: {str(e)}")
                
    tipos = TipoOrgaosRecursos.objects.using('default').filter(ativo=1).order_by('nome')
    return render(request, 'sist_social/Orgaos/adicionar.html', {
        'tipos': tipos,
        'errors': errors,
        'form_data': request.POST if request.method == 'POST' else {}
    })


def edit_orgao(request, pk):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    orgao = get_object_or_404(OrgaosRecursos.objects.using('default'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        sigla = request.POST.get('sigla', '').strip()
        esfera = request.POST.get('esfera', 'Municipal')
        cnpj = request.POST.get('cnpj', '').strip()
        email = request.POST.get('email', '').strip()
        telefone = request.POST.get('telefone', '').strip()
        telefone2 = request.POST.get('telefone2', '').strip()
        cep = request.POST.get('cep', '').strip()
        tipo_lograd = request.POST.get('tipo_lograd', '').strip()
        logradouro = request.POST.get('logradouro', '').strip()
        lograd_num = request.POST.get('lograd_num', '').strip()
        lograd_compl = request.POST.get('lograd_compl', '').strip()
        bairro = request.POST.get('bairro', '').strip()
        municipio = request.POST.get('municipio', '').strip()
        uf = request.POST.get('uf', '').strip()
        tipo_orgao_id = request.POST.get('tipo_orgao_id', '')
        horario_func = request.POST.get('horario_func', '').strip()
        recursos_disponiveis = request.POST.get('recursos_disponiveis', '').strip()
        num_lei_criacao = request.POST.get('num_lei_criacao', '').strip()
        dt_lei_criacao_str = request.POST.get('dt_lei_criacao', '').strip()
        num_lei_atualiz = request.POST.get('num_lei_atualiz', '').strip()
        hora_ini = request.POST.get('hora_ini', '').strip()
        hora_fim = request.POST.get('hora_fim', '').strip()
        ativo = request.POST.get('ativo', '1')
        
        if not nome or not tipo_orgao_id:
            errors.append("Nome do Órgão/Recurso e Tipo de Órgão são obrigatórios.")
        
        dt_lei_criacao = None
        if dt_lei_criacao_str:
            try:
                dt_lei_criacao = datetime.strptime(dt_lei_criacao_str, "%Y-%m-%d").date()
            except ValueError:
                errors.append("Data da lei de criação inválida. Formato esperado: AAAA-MM-DD")
            
        if not errors:
            try:
                tipo_o = TipoOrgaosRecursos.objects.using('default').get(id=tipo_orgao_id)
                orgao.nome = nome
                orgao.sigla = sigla or None
                orgao.esfera = esfera
                orgao.cnpj = cnpj or None
                orgao.email = email or None
                orgao.telefone = telefone
                orgao.telefone2 = telefone2 or None
                orgao.cep = cep or None
                orgao.tipo_lograd = tipo_lograd or None
                orgao.logradouro = logradouro or None
                orgao.lograd_num = lograd_num or None
                orgao.lograd_compl = lograd_compl or None
                orgao.bairro = bairro or None
                orgao.municipio = municipio or None
                orgao.uf = uf or None
                orgao.tipo_orgao = tipo_o
                orgao.horario_func = horario_func or None
                orgao.recursos_disponiveis = recursos_disponiveis or None
                orgao.num_lei_criacao = num_lei_criacao or None
                orgao.dt_lei_criacao = dt_lei_criacao
                orgao.num_lei_atualiz = num_lei_atualiz or None
                orgao.hora_ini = hora_ini or None
                orgao.hora_fim = hora_fim or None
                orgao.ativo = int(ativo)
                orgao.save(using='default')
                
                messages.success(request, f"Órgão/Recurso '{nome}' atualizado com sucesso!")
                return redirect('list_orgaos')
            except Exception as e:
                errors.append(f"Erro ao atualizar órgão: {str(e)}")
                
    tipos = TipoOrgaosRecursos.objects.using('default').filter(ativo=1).order_by('nome')
    return render(request, 'sist_social/Orgaos/editar.html', {
        'orgao': orgao,
        'tipos': tipos,
        'errors': errors
    })


def toggle_orgao_status(request, pk):
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        orgao = OrgaosRecursos.objects.using('default').get(pk=pk)
        orgao.ativo = 0 if orgao.ativo == 1 else 1
        orgao.save(using='default')
        
        status_label = 'Ativo' if orgao.ativo == 1 else 'Inativo'
        return JsonResponse({
            'success': True,
            'ativo': orgao.ativo,
            'message': f"O status do órgão foi alterado para {status_label} com sucesso!"
        })
    except OrgaosRecursos.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Órgão não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


# =========================================================================
# 4. FAMÍLIAS DOMICÍLIO (CRUD)
# =========================================================================

def list_familias(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
        
    rf_prefetch = Prefetch(
        'membros',
        queryset=Pessoas.objects.using('default').filter(cod_parent_rf_pes_id=1),
        to_attr='rf_members'
    )
    
    familias = FamiliaDomicilio.objects.using('default').all().select_related('cod_rf', 'tipo_residencia').prefetch_related(rf_prefetch).order_by('-id')
    
    if search:
        familias = familias.filter(
            Q(cod_familia__icontains=search) |
            Q(nom_logradouro__icontains=search) |
            Q(nom_local_fam__icontains=search) |
            Q(cod_rf__nom_pessoa__icontains=search) |
            Q(membros__nom_pessoa__icontains=search, membros__cod_parent_rf_pes_id=1)
        ).distinct()
        
    paginator = Paginator(familias, int(per_page))
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'sist_social/Familias/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def create_familia(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    if request.method == 'POST':
        cod_familia = request.POST.get('cod_familia', '').strip()
        cod_familia_cad_unico = request.POST.get('cod_familia_cad_unico', '').strip() or None
        fone_contato = request.POST.get('fone_contato', '').strip() or None
        cep_lograd = request.POST.get('cep_lograd', '').strip().replace('-', '') or None
        nom_logradouro = request.POST.get('nom_logradouro', '').strip() or None
        num_lograd = request.POST.get('num_lograd', '').strip() or None
        des_compl_fam = request.POST.get('des_compl_fam', '').strip() or None
        nom_local_fam = request.POST.get('nom_local_fam', '').strip() or None
        tipo_residencia_id = request.POST.get('tipo_residencia_id', '')
        fx_rfpc_id = request.POST.get('fx_rfpc_id', '')
        vlr_renda_total_fam = request.POST.get('vlr_renda_total_fam', '')
        val_renda_media_fam = request.POST.get('val_renda_media_fam', '')
        ind_pbf = request.POST.get('ind_pbf', '0')
        geo_lat = request.POST.get('geo_lat', '').strip() or None
        geo_lgt = request.POST.get('geo_lgt', '').strip() or None
        ativo = request.POST.get('ativo', '1')
        
        if not cod_familia:
            errors.append("Código da Família é obrigatório.")
            
        if not errors:
            try:
                tipo_res = None
                if tipo_residencia_id:
                    tipo_res = TipoResidencia.objects.using('default').get(id=tipo_residencia_id)
                
                fx_percapta = None
                if fx_rfpc_id:
                    fx_percapta = FaixaRendaPercapta.objects.using('default').get(id=fx_rfpc_id)
                    
                vlr_renda = float(vlr_renda_total_fam) if vlr_renda_total_fam else None
                vlr_media = float(val_renda_media_fam) if val_renda_media_fam else None
                
                new_familia = FamiliaDomicilio(
                    cod_familia=cod_familia,
                    cod_familia_cad_unico=cod_familia_cad_unico,
                    fone_contato=fone_contato,
                    cep_lograd=cep_lograd,
                    nom_logradouro=nom_logradouro,
                    num_lograd=num_lograd,
                    des_compl_fam=des_compl_fam,
                    nom_local_fam=nom_local_fam,
                    tipo_residencia=tipo_res,
                    fx_rfpc=fx_percapta,
                    vlr_renda_total_fam=vlr_renda,
                    val_renda_media_fam=vlr_media,
                    ind_pbf=ind_pbf,
                    geo_lat=float(geo_lat) if geo_lat else None,
                    geo_lgt=float(geo_lgt) if geo_lgt else None,
                    ativo=int(ativo),
                    tem_meio_transp='Não'
                )
                new_familia.save(using='default')
                messages.success(request, f"Família '{cod_familia}' cadastrada com sucesso!")
                return redirect('list_familias')
            except Exception as e:
                errors.append(f"Erro ao salvar família: {str(e)}")
                
    tipos_residencia = TipoResidencia.objects.using('default').filter(ativo=1).order_by('tipo')
    faixas_renda = FaixaRendaPercapta.objects.using('default').all().order_by('faixa')
    
    google_maps_key = ''
    try:
        google_maps_key = Configuracoes.objects.using('sist_central').get(chave='APIGOOGLEMAPS').valor or ''
    except Exception:
        pass
        
    return render(request, 'sist_social/Familias/adicionar.html', {
        'tipos_residencia': tipos_residencia,
        'faixas_renda': faixas_renda,
        'errors': errors,
        'form_data': request.POST if request.method == 'POST' else {},
        'google_maps_key': google_maps_key
    })


def edit_familia(request, pk):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    familia = get_object_or_404(FamiliaDomicilio.objects.using('default'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        cod_familia = request.POST.get('cod_familia', '').strip()
        cod_familia_cad_unico = request.POST.get('cod_familia_cad_unico', '').strip() or None
        fone_contato = request.POST.get('fone_contato', '').strip() or None
        cep_lograd = request.POST.get('cep_lograd', '').strip().replace('-', '') or None
        nom_logradouro = request.POST.get('nom_logradouro', '').strip() or None
        num_lograd = request.POST.get('num_lograd', '').strip() or None
        des_compl_fam = request.POST.get('des_compl_fam', '').strip() or None
        nom_local_fam = request.POST.get('nom_local_fam', '').strip() or None
        tipo_residencia_id = request.POST.get('tipo_residencia_id', '')
        fx_rfpc_id = request.POST.get('fx_rfpc_id', '')
        vlr_renda_total_fam = request.POST.get('vlr_renda_total_fam', '')
        val_renda_media_fam = request.POST.get('val_renda_media_fam', '')
        ind_pbf = request.POST.get('ind_pbf', '0')
        cod_rf_id = request.POST.get('cod_rf_id', '')
        geo_lat = request.POST.get('geo_lat', '').strip() or None
        geo_lgt = request.POST.get('geo_lgt', '').strip() or None
        ativo = request.POST.get('ativo', '1')
        
        if not cod_familia:
            errors.append("Código da Família é obrigatório.")
            
        if not errors:
            try:
                tipo_res = None
                if tipo_residencia_id:
                    tipo_res = TipoResidencia.objects.using('default').get(id=tipo_residencia_id)
                
                fx_percapta = None
                if fx_rfpc_id:
                    fx_percapta = FaixaRendaPercapta.objects.using('default').get(id=fx_rfpc_id)
                
                rf_pessoa = None
                if cod_rf_id:
                    rf_pessoa = Pessoas.objects.using('default').get(id=cod_rf_id)
                    
                vlr_renda = float(vlr_renda_total_fam) if vlr_renda_total_fam else None
                vlr_media = float(val_renda_media_fam) if val_renda_media_fam else None
                
                familia.cod_familia = cod_familia
                familia.cod_familia_cad_unico = cod_familia_cad_unico
                familia.fone_contato = fone_contato
                familia.cep_lograd = cep_lograd
                familia.nom_logradouro = nom_logradouro
                familia.num_lograd = num_lograd
                familia.des_compl_fam = des_compl_fam
                familia.nom_local_fam = nom_local_fam
                familia.tipo_residencia = tipo_res
                familia.fx_rfpc = fx_percapta
                familia.vlr_renda_total_fam = vlr_renda
                familia.val_renda_media_fam = vlr_media
                familia.ind_pbf = ind_pbf
                familia.cod_rf = rf_pessoa
                familia.geo_lat = float(geo_lat) if geo_lat else None
                familia.geo_lgt = float(geo_lgt) if geo_lgt else None
                familia.ativo = int(ativo)
                familia.save(using='default')
                
                messages.success(request, f"Família '{cod_familia}' atualizada com sucesso!")
                return redirect('list_familias')
            except Exception as e:
                errors.append(f"Erro ao atualizar família: {str(e)}")
                
    tipos_residencia = TipoResidencia.objects.using('default').filter(ativo=1).order_by('tipo')
    faixas_renda = FaixaRendaPercapta.objects.using('default').all().order_by('faixa')
    membros = Pessoas.objects.using('default').filter(cod_familia=familia).order_by('nom_pessoa')
    
    google_maps_key = ''
    try:
        google_maps_key = Configuracoes.objects.using('sist_central').get(chave='APIGOOGLEMAPS').valor or ''
    except Exception:
        pass
        
    return render(request, 'sist_social/Familias/editar.html', {
        'familia': familia,
        'tipos_residencia': tipos_residencia,
        'faixas_renda': faixas_renda,
        'membros': membros,
        'errors': errors,
        'google_maps_key': google_maps_key
    })


def toggle_familia_status(request, pk):
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        familia = FamiliaDomicilio.objects.using('default').get(pk=pk)
        familia.ativo = 0 if familia.ativo == 1 else 1
        familia.save(using='default')
        
        status_label = 'Ativa' if familia.ativo == 1 else 'Inativa'
        return JsonResponse({
            'success': True,
            'ativo': familia.ativo,
            'message': f"O status da família foi alterado para {status_label} com sucesso!"
        })
    except FamiliaDomicilio.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Família não encontrada.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


# =========================================================================
# 5. PESSOAS (CRUD)
# =========================================================================

def list_pessoas(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
        
    pessoas = Pessoas.objects.using('default').all().select_related('cod_familia', 'cod_parent_rf_pes').order_by('-id')
    
    if search:
        pessoas = pessoas.filter(
            Q(nom_pessoa__icontains=search) |
            Q(num_nis_pes__icontains=search) |
            Q(num_cpf_pes__icontains=search) |
            Q(cod_familia__cod_familia__icontains=search)
        )
        
    paginator = Paginator(pessoas, int(per_page))
    page_obj = paginator.get_page(page_number)
    
    return render(request, 'sist_social/Pessoas/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def create_pessoa(request):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    errors = []
    if request.method == 'POST':
        nom_pessoa = request.POST.get('nom_pessoa', '').strip()
        nom_apelido_pes = request.POST.get('nom_apelido_pes', '').strip() or None
        cod_sexo_pes = request.POST.get('cod_sexo_pes', 'Masc')
        dta_nasc_pes_str = request.POST.get('dta_nasc_pes', '').strip()
        num_nis_pes = request.POST.get('num_nis_pes', '').strip() or None
        num_cpf_pes = request.POST.get('num_cpf_pes', '').strip().replace('.', '').replace('-', '') or None
        celular_pessoa = request.POST.get('celular_pessoa', '').strip() or None
        fone_pessoa = request.POST.get('fone_pessoa', '').strip() or None
        email = request.POST.get('email', '').strip() or None
        cod_familia_id = request.POST.get('cod_familia_id', '')
        cod_parent_rf_pes_id = request.POST.get('cod_parent_rf_pes_id', '')
        orientacao_sexual_id = request.POST.get('orientacao_sexual_id', '')
        estado_civil_id = request.POST.get('estado_civil_id', '')
        ativo = request.POST.get('ativo', '1')
        
        if not nom_pessoa:
            errors.append("Nome é obrigatório.")
        if not dta_nasc_pes_str:
            errors.append("Data de Nascimento é obrigatória.")
        if not cod_familia_id:
            errors.append("Família é obrigatória.")
            
        dta_nasc_pes = None
        if dta_nasc_pes_str:
            try:
                dta_nasc_pes = datetime.strptime(dta_nasc_pes_str, "%Y-%m-%d").date()
            except ValueError:
                errors.append("Data de Nascimento inválida. Formato esperado: AAAA-MM-DD")
                
        if not errors:
            try:
                familia = FamiliaDomicilio.objects.using('default').get(id=cod_familia_id)
                
                parentesco = None
                if cod_parent_rf_pes_id:
                    parentesco = TipoParentesco.objects.using('default').get(id=cod_parent_rf_pes_id)
                    
                orientacao = None
                if orientacao_sexual_id:
                    orientacao = OrientacaoSexual.objects.using('default').get(id=orientacao_sexual_id)
                    
                est_civil = None
                if estado_civil_id:
                    est_civil = TipoEstadoCivil.objects.using('default').get(id=estado_civil_id)
                    
                new_pessoa = Pessoas(
                    nom_pessoa=nom_pessoa,
                    nom_apelido_pes=nom_apelido_pes,
                    cod_sexo_pes=cod_sexo_pes,
                    dta_nasc_pes=dta_nasc_pes,
                    num_nis_pes=num_nis_pes,
                    num_cpf_pes=num_cpf_pes,
                    celular_pessoa=celular_pessoa,
                    fone_pessoa=fone_pessoa,
                    email=email,
                    cod_familia=familia,
                    cod_parent_rf_pes=parentesco,
                    orientacao_sexual=orientacao,
                    estado_civil=est_civil,
                    ativo=int(ativo),
                    frequenta_unidade_saude='Não'
                )
                new_pessoa.save(using='default')
                messages.success(request, f"Pessoa '{nom_pessoa}' cadastrada com sucesso!")
                return redirect('list_pessoas')
            except Exception as e:
                errors.append(f"Erro ao salvar pessoa: {str(e)}")
                
    familias = FamiliaDomicilio.objects.using('default').filter(ativo=1).order_by('cod_familia')
    parentescos = TipoParentesco.objects.using('default').all().order_by('tipo')
    orientacoes = OrientacaoSexual.objects.using('default').filter(ativo=1).order_by('nome')
    estados_civis = TipoEstadoCivil.objects.using('default').filter(ativo=1).order_by('estado_civil')
    
    return render(request, 'sist_social/Pessoas/adicionar.html', {
        'familias': familias,
        'parentescos': parentescos,
        'orientacoes': orientacoes,
        'estados_civis': estados_civis,
        'errors': errors,
        'form_data': request.POST if request.method == 'POST' else {}
    })


def edit_pessoa(request, pk):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    pessoa = get_object_or_404(Pessoas.objects.using('default'), pk=pk)
    errors = []
    
    if request.method == 'POST':
        nom_pessoa = request.POST.get('nom_pessoa', '').strip()
        nom_apelido_pes = request.POST.get('nom_apelido_pes', '').strip() or None
        cod_sexo_pes = request.POST.get('cod_sexo_pes', 'Masc')
        dta_nasc_pes_str = request.POST.get('dta_nasc_pes', '').strip()
        num_nis_pes = request.POST.get('num_nis_pes', '').strip() or None
        num_cpf_pes = request.POST.get('num_cpf_pes', '').strip().replace('.', '').replace('-', '') or None
        celular_pessoa = request.POST.get('celular_pessoa', '').strip() or None
        fone_pessoa = request.POST.get('fone_pessoa', '').strip() or None
        email = request.POST.get('email', '').strip() or None
        cod_familia_id = request.POST.get('cod_familia_id', '')
        cod_parent_rf_pes_id = request.POST.get('cod_parent_rf_pes_id', '')
        orientacao_sexual_id = request.POST.get('orientacao_sexual_id', '')
        estado_civil_id = request.POST.get('estado_civil_id', '')
        ativo = request.POST.get('ativo', '1')
        
        if not nom_pessoa:
            errors.append("Nome é obrigatório.")
        if not dta_nasc_pes_str:
            errors.append("Data de Nascimento é obrigatória.")
        if not cod_familia_id:
            errors.append("Família é obrigatória.")
            
        dta_nasc_pes = None
        if dta_nasc_pes_str:
            try:
                dta_nasc_pes = datetime.strptime(dta_nasc_pes_str, "%Y-%m-%d").date()
            except ValueError:
                errors.append("Data de Nascimento inválida. Formato esperado: AAAA-MM-DD")
                
        if not errors:
            try:
                familia = FamiliaDomicilio.objects.using('default').get(id=cod_familia_id)
                
                parentesco = None
                if cod_parent_rf_pes_id:
                    parentesco = TipoParentesco.objects.using('default').get(id=cod_parent_rf_pes_id)
                    
                orientacao = None
                if orientacao_sexual_id:
                    orientacao = OrientacaoSexual.objects.using('default').get(id=orientacao_sexual_id)
                    
                est_civil = None
                if estado_civil_id:
                    est_civil = TipoEstadoCivil.objects.using('default').get(id=estado_civil_id)
                    
                pessoa.nom_pessoa = nom_pessoa
                pessoa.nom_apelido_pes = nom_apelido_pes
                pessoa.cod_sexo_pes = cod_sexo_pes
                pessoa.dta_nasc_pes = dta_nasc_pes
                pessoa.num_nis_pes = num_nis_pes
                pessoa.num_cpf_pes = num_cpf_pes
                pessoa.celular_pessoa = celular_pessoa
                pessoa.fone_pessoa = fone_pessoa
                pessoa.email = email
                pessoa.cod_familia = familia
                pessoa.cod_parent_rf_pes = parentesco
                pessoa.orientacao_sexual = orientacao
                pessoa.estado_civil = est_civil
                pessoa.ativo = int(ativo)
                pessoa.save(using='default')
                
                messages.success(request, f"Pessoa '{nom_pessoa}' atualizada com sucesso!")
                return redirect('list_pessoas')
            except Exception as e:
                errors.append(f"Erro ao atualizar pessoa: {str(e)}")
                
    familias = FamiliaDomicilio.objects.using('default').filter(ativo=1).order_by('cod_familia')
    parentescos = TipoParentesco.objects.using('default').all().order_by('tipo')
    orientacoes = OrientacaoSexual.objects.using('default').filter(ativo=1).order_by('nome')
    estados_civis = TipoEstadoCivil.objects.using('default').filter(ativo=1).order_by('estado_civil')
    
    return render(request, 'sist_social/Pessoas/editar.html', {
        'pessoa': pessoa,
        'familias': familias,
        'parentescos': parentescos,
        'orientacoes': orientacoes,
        'estados_civis': estados_civis,
        'errors': errors
    })


def toggle_pessoa_status(request, pk):
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)
        
    try:
        pessoa = Pessoas.objects.using('default').get(pk=pk)
        pessoa.ativo = 0 if pessoa.ativo == 1 else 1
        pessoa.save(using='default')
        
        status_label = 'Ativa' if pessoa.ativo == 1 else 'Inativa'
        return JsonResponse({
            'success': True,
            'ativo': pessoa.ativo,
            'message': f"O status da pessoa foi alterado para {status_label} com sucesso!"
        })
    except Pessoas.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Pessoa não encontrada.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)
