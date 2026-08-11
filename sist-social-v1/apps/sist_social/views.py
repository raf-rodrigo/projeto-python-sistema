from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from apps.sist_social.services.dashboard_service import DashboardService
from django.core.paginator import Paginator
from django.db.models import Q
from django.contrib import messages
from apps.sist_social.models import UnidadeAtendimentoSocial, RecursosHumanos
from apps.sist_central.models import Login


def dashboard(request):
    """
    Renders the main dashboard page template.
    Checks user session.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
    return render(request, 'sist_social/Dashboard/dashboard.html')


def cadunico_stats_api(request):
    """
    Returns CADUNICO aggregated stats as JSON.
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    try:
        data = DashboardService.get_cadunico_stats()
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def atendimentos_chart_api(request):
    """
    Returns daily atendimentos counts between start and end dates as JSON.
    Accepts both GET and POST.
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'error': 'Unauthorized'}, status=401)

    # Resolve date range
    if request.method == 'POST':
        start_str = request.POST.get('start')
        end_str = request.POST.get('end')
    else:
        start_str = request.GET.get('start')
        end_str = request.GET.get('end')

    # Defaults to last 7 days if not provided
    if not start_str or not end_str:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=6)
    else:
        try:
            start_date = datetime.strptime(start_str, '%Y-%m-%d')
            end_date = datetime.strptime(end_str, '%Y-%m-%d')
        except ValueError:
            return JsonResponse({'error': 'Invalid date format. Expected YYYY-MM-DD.'}, status=400)

    try:
        data = DashboardService.get_atendimentos_period(start_date, end_date)
        return JsonResponse(data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
    
#  --- Módulo de Recursos Humanos ---
def list_recursos_humanos(request):
    """ Lista os funcionários de Recursos Humanos com paginação e busca por nome, email ou CPF. """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
    
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'

    rhs = RecursosHumanos.objects.using('default').all().order_by('id')

    if search:
        rhs = rhs.filter(
            Q(nome__icontains=search) | 
            Q(email__icontains=search) | 
            Q(cpf_num__icontains=search)
        )
    
    paginator = Paginator(rhs, int(per_page))
    page_obj = paginator.get_page(page_number)

    # Mapea as unidades de atendimento principais 
    unidades_ids = [rh.onde_trab_social for rh in page_obj.object_list if rh.onde_trab_social]
    unidades = UnidadeAtendimentoSocial.objects.using('default').filter(id__in=unidades_ids)
    unidades_map = {u.id: u for u in unidades}

    for rh in page_obj.object_list:
        rh.unidade_principal = unidades_map.get(rh.onde_trab_social)

    return render(request, 'sist_social/RecursosHumanos/listar.html', {
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })

def create_recurso_humano(request):
    """ Cria um novo funcionário no Recurso Humanos."""
    if not request.session.get('usuarioLogado'):
        return redirect('login')
    
    erros = []

    if request.method == 'POST':
        nome = request.POST.get('nome', '').strip()
        apelido = request.POST.get('apelido', '').strip()
        email = request.POST.get('email', '').strip()
        cpf_num = request.POST.get('cpf_num', '').strip()
        sexo = request.POST.get('sexo', '').strip()
        celular = request.POST.get('celular', '').strip()
        onde_trab_social = request.POST.get('onde_trab_social', '').strip()
        ativo = request.POST.get('ativo', '1').strip()

        # Unidades vinculadas (multiplas sessão)
        unidades_list = request.POST.getlist('unidades')
        unidades_str = ",".join(unidades_list) if unidades_list else None


        if not nome or not sexo:
            erros.append("Nome e sexo são campos obrigatórios.")

        if not erros:
            rh = RecursosHumanos(
                nome=nome,
                apelido=apelido,
                email=email,
                cpf_num=cpf_num,
                sexo=sexo,
                celular=celular,
                unidades=unidades_str,
                onde_trab_social=int(onde_trab_social) if onde_trab_social else None,
                ativo=int(ativo),
                responsavel='Não',
            )
            rh.save(using='default')

            messages.success(request, F"Funcionário '{nome}' cadastrado com sucesso.")
            return redirect('listar_recursos_humanos')
        
    # Busca todas as unidades para popular os selects
    unidades = UnidadeAtendimentoSocial.objects.using('default').all().order_by('nome_conhecido')

    return render(request, 'sist_social/RecursosHumanos/adicionar.html', {
        'unidades': unidades,
        'erros': erros,
        'form_data': request.POST if  request.method == 'POST' else {}
    })


def edit_recurso_humano(request, pk):                                                                                                                                                  
    """                                                                                                                                                                                
    Edita um funcionário de Recursos Humanos existente e sincroniza com o usuário caso vinculado.                                                                                      
    """                                                                                                                                                                                
    if not request.session.get('usuarioLogado'):                                                                                                                                       
        return redirect('login')                                                                                                                                                       
                                                                                                                                                                                        
    rh = get_object_or_404(RecursosHumanos.objects.using('default'), pk=pk)                                                                                                            
    errors = []                                                                                                                                                                        
                                                                                                                                                                                        
    if request.method == 'POST':                                                                                                                                                       
        nome = request.POST.get('nome', '').strip()                                                                                                                                    
        apelido = request.POST.get('apelido', '').strip()                                                                                                                              
        email = request.POST.get('email', '').strip()                                                                                                                                  
        cpf_num = request.POST.get('cpf_num', '').strip()                                                                                                                              
        sexo = request.POST.get('sexo', '')                                                                                                                                            
        celular = request.POST.get('celular', '').strip()                                                                                                                              
        onde_trab_social = request.POST.get('onde_trab_social', '').strip()                                                                                                            
        ativo = request.POST.get('ativo', '1')                                                                                                                                         
                                                                                                                                                                                        
        unidades_list = request.POST.getlist('unidades')                                                                                                                               
        unidades_str = ",".join(unidades_list) if unidades_list else None                                                                                                              
                                                                                                                                                                                        
        if not nome or not sexo:                                                                                                                                                       
            errors.append("Nome e Sexo são campos obrigatórios.")                                                                                                                      
                                                                                                                                                                                        
        if not errors:                                                                                                                                                                 
            rh.nome = nome                                                                                                                                                             
            rh.apelido = apelido                                                                                                                                                       
            rh.email = email                                                                                                                                                           
            rh.cpf_num = cpf_num                                                                                                                                                       
            rh.sexo = sexo                                                                                                                                                             
            rh.celular = celular                                                                                                                                                       
            rh.unidades = unidades_str                                                                                                                                                 
            rh.onde_trab_social = int(onde_trab_social) if onde_trab_social else None                                                                                                  
            rh.ativo = int(ativo)                                                                                                                                                      
            rh.unid_social = 'Sim' if unidades_str else 'Não'                                                                                                                          
                                                                                                                                                                                        
            rh.save(using='default')                                                                                                                                                   
                                                                                                                                                                                        
            # Sincroniza dados com a tabela de usuários caso este RH esteja vinculado                                                                                                  
            if rh.memberID:                                                                                                                                                            
                Login.objects.using('sist_central').filter(usuario=rh.memberID).update(                                                                                                
                    nome=nome,                                                                                                                                                         
                    email=email                                                                                                                                                        
                )                                                                                                                                                                      
                                                                                                                                                                                        
            messages.success(request, f"Funcionário '{nome}' atualizado com sucesso.")                                                                                                 
            return redirect('list_recursos_humanos')                                                                                                                                   
                                                                                                                                                                                        
    # Processa unidades do funcionário para preencher o formulário                                                                                                                     
    unidades = UnidadeAtendimentoSocial.objects.using('default').all().order_by('nome_conhecido')                                                                                      
    selected_unidades = [int(u) for u in rh.unidades.split(',') if u.strip().isdigit()] if rh.unidades else []

    return render(request, 'sist_social/RecursosHumanos/editar.html', {
        'rh': rh,
        'unidades': unidades,
        'selected_unidades': selected_unidades,
        'errors': errors
    })


def toggle_recurso_humano_status(request, pk):
    """
    Inverte o status ativo/inativo do funcionário e do usuário vinculado (AJAX).
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'message': 'Não autorizado.'}, status=401)

    try:
        rh = RecursosHumanos.objects.using('default').get(pk=pk)

        # Alterna o status (1 = Ativo, 0 = Inativo)
        rh.ativo = 0 if rh.ativo == 1 else 1
        rh.save(using='default')

        # Desativa também o usuário se estiver associado a este funcionário
        if rh.memberID:
            Login.objects.using('sist_central').filter(usuario=rh.memberID).update(ativo=rh.ativo)

        status_label = 'Ativo' if rh.ativo == 1 else 'Inativo'
        return JsonResponse({
            'success': True,
            'ativo': rh.ativo,
            'message': f"O status do funcionário foi alterado para {status_label} com sucesso!"
        })
    except RecursosHumanos.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Funcionário não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)}, status=500)


from django.db import connections, transaction

def index_idf_calculation(request):
    """
    Renders the IDF Calculation dashboard page.
    """
    if not request.session.get('usuarioLogado'):
        return redirect('login')
    return render(request, 'sist_social/IDF/ProcIdfFamilia.html')


def verifica_data_processamento(request):
    """
    Verifies if IDF records already exist for the selected month/year.
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'status': 'error', 'message': 'Não autorizado.'}, status=401)
        
    if request.method == 'POST':
        mes = request.POST.get('mes')
        ano = request.POST.get('ano')
        
        if not mes or not ano or not mes.isdigit() or not ano.isdigit():
            return JsonResponse({'status': 'error', 'message': 'Mês ou ano inválido.'})
            
        try:
            with connections['default'].cursor() as cursor:
                cursor.execute(
                    "SELECT COUNT(*) FROM idf_familia WHERE MONTH(data_proces) = %s AND YEAR(data_proces) = %s",
                    [int(mes), int(ano)]
                )
                count = cursor.fetchone()[0]
                
            if count > 0:
                return JsonResponse({'status': 'exists'})
            else:
                return JsonResponse({'status': 'not_exists'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
            
    return JsonResponse({'status': 'error', 'message': 'Método inválido.'}, status=400)


def process_idf(request):
    """
    Computes the IDF (Indice de Desenvolvimento Familiar) for all families and stores the results.
    """
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'status': 'error', 'message': 'Não autorizado.'}, status=401)
        
    if request.method == 'POST':
        data_proces_str = request.POST.get('data_proces')
        if not data_proces_str:
            return JsonResponse({'status': 'error', 'message': 'Data de processamento obrigatória.'}, status=400)
            
        try:
            # Converts dd/mm/yyyy to YYYY-MM-DD
            data_proces_dt = datetime.strptime(data_proces_str, '%d/%m/%Y')
            data_proces_mysql = data_proces_dt.strftime('%Y-%m-%d')
        except ValueError:
            return JsonResponse({'status': 'error', 'message': 'Formato de data inválido. Use dd/mm/yyyy.'}, status=400)
            
        try:
            with connections['default'].cursor() as cursor:
                # 1. Fetch all family IDs
                cursor.execute("SELECT id FROM familia_domicilio")
                familias = [row[0] for row in cursor.fetchall()]
                
                # 2. Delete existing calculations for the same month and year
                cursor.execute(
                    "DELETE FROM idf_familia WHERE MONTH(data_proces) = %s AND YEAR(data_proces) = %s",
                    [data_proces_dt.month, data_proces_dt.year]
                )
                
                # 3. Calculate for each family inside a single atomic transaction for massive speedup
                with transaction.atomic(using='default'):
                    for fam_id in familias:
                        # Dim 1
                        cursor.execute("""
                            SELECT
                                count(id) as TotFam,
                                (SELECT COUNT(*) FROM pessoas p WHERE p.cod_familia = fam.id) AS num_pes,
                                SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM pessoas p WHERE p.cod_familia = fam.id AND TIMESTAMPDIFF(YEAR, dta_nasc_pes, CURDATE()) < 12) THEN 1 ELSE 0 END) AS TotV5,
                                SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM pessoas p WHERE p.cod_familia = fam.id AND TIMESTAMPDIFF(YEAR, dta_nasc_pes, CURDATE()) BETWEEN 0 AND 18) THEN 1 ELSE 0 END) AS TotV6,
                                SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM pessoas p WHERE p.cod_familia = fam.id AND TIMESTAMPDIFF(YEAR, dta_nasc_pes, CURDATE()) BETWEEN 0 AND 24) THEN 1 ELSE 0 END) AS TotV7,
                                SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM pessoas p WHERE p.cod_familia = fam.id AND cod_def_memb = 'Sim') THEN 1 ELSE 0 END) AS TotV8,
                                SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM pessoas p WHERE p.cod_familia = fam.id AND TIMESTAMPDIFF(YEAR, dta_nasc_pes, CURDATE()) >= 60) THEN 1 ELSE 0 END) AS TotV9,
                                SUM(CASE WHEN NOT EXISTS (SELECT 1 FROM pessoas p WHERE p.cod_familia = fam.id AND cod_parent_rf_pes = '2') THEN 1 ELSE 0 END) AS TotV10,
                                SUM(CASE WHEN (SELECT COUNT(*) FROM pessoas p WHERE p.cod_familia = fam.id) / 2 < (SELECT COUNT(*) FROM pessoas p WHERE p.cod_familia = fam.id AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 18 AND 65) THEN 1 ELSE 0 END) AS TotV11
                            FROM
                                familia_domicilio as fam
                            WHERE fam.id = %s
                        """, [fam_id])
                        row_dim1 = cursor.fetchone()
                        
                        if not row_dim1 or row_dim1[0] == 0:
                            continue
                            
                        num_pes = row_dim1[1]
                        tot_fam = num_pes if num_pes > 0 else 1
                        
                        V5_norm = (tot_fam - (row_dim1[2] or 0)) / tot_fam
                        V6_norm = (tot_fam - (row_dim1[3] or 0)) / tot_fam
                        V7_norm = (tot_fam - (row_dim1[4] or 0)) / tot_fam
                        V8_norm = (tot_fam - (row_dim1[5] or 0)) / tot_fam
                        V9_norm = (tot_fam - (row_dim1[6] or 0)) / tot_fam
                        V10_norm = (tot_fam - (row_dim1[7] or 0)) / tot_fam
                        V11_norm = (tot_fam - (row_dim1[8] or 0)) / tot_fam
                        
                        Cp3 = (V5_norm + V6_norm + V7_norm) / 3
                        Cp4 = (V8_norm + V9_norm) / 2
                        Cp5 = (V10_norm + V11_norm) / 2
                        dim1 = 1 - ((Cp3 + Cp4 + Cp5) / 3)
                        
                        # Dim 2
                        cursor.execute("""
                            SELECT
                                COUNT(id) as TotFam,
                                SUM(CASE WHEN NOT EXISTS (
                                  SELECT 1 FROM pessoas p 
                                  WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) > 24 
                                    AND p.cod_sabe_ler_escrever_memb = 'Não'
                                ) THEN 0 ELSE 1 END) AS TotC1,
                                SUM(CASE WHEN EXISTS (
                                  SELECT 1 FROM pessoas p 
                                  WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) > 24 
                                    AND p.cod_curso_frequentou_memb IN ('4', '5', '6', '7', '10', '11')
                                ) THEN 1 ELSE 0 END) AS TotC3,
                                SUM(CASE WHEN EXISTS (
                                  SELECT 1 FROM pessoas p 
                                  WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) > 24 
                                    AND p.cod_curso_frequentou_memb IN ('8', '9', '12')
                                ) THEN 1 ELSE 0 END) AS TotC4,
                                SUM(CASE WHEN EXISTS (
                                  SELECT 1 FROM pessoas p 
                                  WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) > 24 
                                    AND (p.cod_curso_frequentou_memb = '13' OR p.cod_curso_freq_memb = '13')
                                ) THEN 1 ELSE 0 END) AS TotC5,
                                SUM(CASE WHEN EXISTS (
                                  SELECT 1 FROM pessoas p 
                                  WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) > 24 
                                    AND (p.quali_profis IS NOT NULL)
                                ) THEN 1 ELSE 0 END) AS TotC6
                            FROM
                                familia_domicilio AS fam
                            WHERE fam.id = %s
                        """, [fam_id])
                        row_dim2 = cursor.fetchone()
                        
                        C1_norm = (tot_fam - (row_dim2[1] or 0)) / tot_fam
                        C3_norm = (tot_fam - (row_dim2[2] or 0)) / tot_fam
                        C4_norm = (tot_fam - (row_dim2[3] or 0)) / tot_fam
                        C5_norm = (tot_fam - (row_dim2[4] or 0)) / tot_fam
                        C6_norm = (tot_fam - (row_dim2[5] or 0)) / tot_fam
                        
                        Cp7 = C1_norm
                        Cp8 = (C3_norm + C4_norm + C5_norm) / 3
                        Cp9 = C6_norm
                        dim2 = 1 - ((Cp7 + Cp8 + Cp9) / 3)
                        
                        # Dim 3
                        cursor.execute("""
                            SELECT
                                COUNT(id) as TotFam,
                                SUM(CASE WHEN 
                                    (SELECT COUNT(*) FROM pessoas p WHERE p.cod_familia = fam.id) / 2 < (SELECT COUNT(*) FROM pessoas p 
                                WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 18 AND 65
                                    AND p.cod_trabalhou_memb = 'Sim')
                                THEN 1 ELSE 0 END) AS TotT1,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p 
                                WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 18 AND 65 
                                    AND p.qtd_meses_12_memb > 6
                                ) THEN 1 ELSE 0 END) AS TotT2,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p 
                                WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 18 AND 65
                                    AND p.cod_principal_trab_memb IN ('4', '6', '8')
                                ) THEN 1 ELSE 0 END) AS TotT3,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p 
                                WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 18 AND 65 
                                    AND p.cod_agric_trab_memb = 'Não' 
                                ) THEN 1 ELSE 0 END) AS TotT4,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p 
                                WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 18 AND 65 
                                    AND (p.val_remuner_empr_memb > 1400)
                                ) THEN 1 ELSE 0 END) AS TotT5,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p 
                                WHERE p.cod_familia = fam.id 
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 18 AND 65 
                                    AND (p.val_remuner_empr_memb > 2800)
                                ) THEN 1 ELSE 0 END) AS TotT6 
                            FROM
                                familia_domicilio AS fam
                            WHERE fam.id = %s
                        """, [fam_id])
                        row_dim3 = cursor.fetchone()
                        
                        T1_norm = (tot_fam - (row_dim3[1] or 0)) / tot_fam
                        T2_norm = (tot_fam - (row_dim3[2] or 0)) / tot_fam
                        T3_norm = (tot_fam - (row_dim3[3] or 0)) / tot_fam
                        T4_norm = (tot_fam - (row_dim3[4] or 0)) / tot_fam
                        T5_norm = (tot_fam - (row_dim3[5] or 0)) / tot_fam
                        T6_norm = (tot_fam - (row_dim3[6] or 0)) / tot_fam
                        
                        Cp10 = (T1_norm + T2_norm) / 2
                        Cp11 = (T3_norm + T4_norm) / 2
                        Cp12 = (T5_norm + T6_norm) / 2
                        dim3 = 1 - ((Cp10 + Cp11 + Cp12) / 3)
                        
                        # Dim 4
                        cursor.execute("""
                            SELECT
                                COUNT(fam.id) as TotFam,  
                                SUM(CASE WHEN (SELECT SUM(val_remuner_empr_memb) FROM pessoas WHERE cod_familia = fam.id) / COALESCE(npes, 1) > 109 THEN 1 ELSE 0 END) AS TotR1,  
                                SUM(CASE WHEN (val_desp_energia + val_desp_agua_esgoto + val_desp_gas + val_desp_alim + val_desp_transp + val_desp_aluguel + val_desp_medic) / COALESCE(npes, 1) > 109 THEN 1 ELSE 0 END) AS TotR2,
                                SUM(CASE WHEN val_desp_alim / COALESCE(qtd_pessoas_domic, 1) > 109 THEN 1 ELSE 0 END) AS TotR3,
                                SUM(CASE WHEN val_renda_media_fam / COALESCE(npes, 1) > 218 THEN 1 ELSE 0 END) AS TotR4,
                                SUM(CASE WHEN (val_desp_energia + val_desp_agua_esgoto + val_desp_gas + val_desp_alim + val_desp_transp + val_desp_aluguel + val_desp_medic) / COALESCE(npes, 1) > 218 THEN 1 ELSE 0 END) AS TotR5,
                                SUM(CASE 
                                    WHEN (SELECT SUM(val_remuner_empr_memb) FROM pessoas WHERE cod_familia = fam.cod_familia) >
                                        (SELECT SUM(val_bpc_loas + val_pbf + val_peti) FROM pessoas WHERE cod_familia = fam.id)
                                    THEN 1 ELSE 0 
                                END) AS TotR6
                            FROM
                                familia_domicilio fam
                            LEFT JOIN
                                (SELECT 
                                    cod_familia,
                                    SUM(val_remuner_empr_memb) / COUNT(*) AS rpc,
                                    count(*) as npes
                                FROM
                                    pessoas
                                GROUP BY
                                    cod_familia) AS renda_per_capita ON fam.id = renda_per_capita.cod_familia
                            WHERE fam.id = %s
                        """, [fam_id])
                        row_dim4 = cursor.fetchone()
                        
                        R1_norm = (tot_fam - (row_dim4[1] or 0)) / tot_fam
                        R2_norm = (tot_fam - (row_dim4[2] or 0)) / tot_fam
                        R3_norm = (tot_fam - (row_dim4[3] or 0)) / tot_fam
                        R4_norm = (tot_fam - (row_dim4[4] or 0)) / tot_fam
                        R5_norm = (tot_fam - (row_dim4[5] or 0)) / tot_fam
                        R6_norm = (tot_fam - (row_dim4[6] or 0)) / tot_fam
                        
                        Cp13 = (R1_norm + R2_norm) / 2
                        Cp14 = (R3_norm + R4_norm) / 2
                        Cp15 = (R5_norm + R6_norm) / 2
                        dim4 = 1 - ((Cp13 + Cp14 + Cp15) / 3)
                        
                        # Dim 5
                        cursor.execute("""
                            SELECT
                                COUNT(id) as TotFam,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p
                                    WHERE p.cod_familia = fam.id
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) < 14
                                    AND p.cod_trabalhou_memb = 'Sim'
                                ) THEN 1 ELSE 0 END) AS TotD1,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p
                                    WHERE p.cod_familia = fam.id
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) < 16
                                    AND p.cod_trabalhou_memb = 'Sim'
                                ) THEN 1 ELSE 0 END) AS TotD2,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p
                                    WHERE p.cod_familia = fam.id
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 0 AND 6
                                    AND p.ind_freq_escola_memb IN ('3', '4')
                                ) THEN 1 ELSE 0 END) AS TotD3,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p
                                    WHERE p.cod_familia = fam.id
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 7 AND 14
                                    AND p.ind_freq_escola_memb IN ('3', '4')
                                ) THEN 1 ELSE 0 END) AS TotD4,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p
                                    WHERE p.cod_familia = fam.id
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 7 AND 17
                                    AND p.ind_freq_escola_memb IN ('3', '4')
                                ) THEN 1 ELSE 0 END) AS TotD5,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p
                                    WHERE p.cod_familia = fam.id
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 10 AND 14
                                    AND p.cod_sabe_ler_escrever_memb = 'Não'
                                ) THEN 1 ELSE 0 END) AS TotD7,
                                SUM(CASE WHEN EXISTS (
                                    SELECT 1 FROM pessoas p
                                    WHERE p.cod_familia = fam.id
                                    AND TIMESTAMPDIFF(YEAR, p.dta_nasc_pes, CURDATE()) BETWEEN 15 AND 17
                                    AND p.cod_sabe_ler_escrever_memb = 'Não'
                                ) THEN 1 ELSE 0 END) AS TotD8
                            FROM
                                familia_domicilio AS fam
                            WHERE fam.id = %s
                        """, [fam_id])
                        row_dim5 = cursor.fetchone()
                        
                        D1_norm = (tot_fam - (row_dim5[1] or 0)) / tot_fam
                        D2_norm = (tot_fam - (row_dim5[2] or 0)) / tot_fam
                        D3_norm = (tot_fam - (row_dim5[3] or 0)) / tot_fam
                        D4_norm = (tot_fam - (row_dim5[4] or 0)) / tot_fam
                        D5_norm = (tot_fam - (row_dim5[5] or 0)) / tot_fam
                        D7_norm = (tot_fam - (row_dim5[6] or 0)) / tot_fam
                        D8_norm = (tot_fam - (row_dim5[7] or 0)) / tot_fam
                        
                        Cp16 = (D1_norm + D2_norm) / 2
                        Cp17 = (D3_norm + D4_norm + D5_norm) / 3
                        Cp18 = (D7_norm + D8_norm) / 2
                        dim5 = 1 - ((Cp16 + Cp17 + Cp18) / 3)
                        
                        # Dim 6
                        cursor.execute("""
                            SELECT
                                COUNT(id) as TotFam,
                                SUM(CASE WHEN tipo_residencia IN ('1', '5') THEN 1 ELSE 0 END) AS TotH1,
                                SUM(CASE WHEN tipo_residencia IN ('3', '4', '6') THEN 1 ELSE 0 END) AS TotH2,
                                SUM(CASE WHEN qtd_pessoas_domic / COALESCE(qtd_comodos_dorm, 1) <= 2 THEN 1 ELSE 0 END) AS TotH3,
                                SUM(CASE WHEN cod_material_domic IN ('1', '2') THEN 1 ELSE 0 END) AS TotH4,
                                SUM(CASE WHEN cod_abast_agua = '1' THEN 1 ELSE 0 END) AS TotH5,
                                SUM(CASE WHEN cod_escoa_sanit IN ('1', '2') THEN 1 ELSE 0 END) AS TotH6,
                                SUM(CASE WHEN cod_dest_lixo IN ('1', '2') THEN 1 ELSE 0 END) AS TotH7,
                                SUM(CASE WHEN cod_ilumi IN ('1', '2','3') THEN 1 ELSE 0 END) AS TotH8
                            FROM
                                familia_domicilio AS fam 
                            WHERE fam.id = %s
                        """, [fam_id])
                        row_dim6 = cursor.fetchone()
                        
                        H1_norm = (tot_fam - (row_dim6[1] or 0)) / tot_fam
                        H2_norm = (tot_fam - (row_dim6[2] or 0)) / tot_fam
                        H3_norm = (tot_fam - (row_dim6[3] or 0)) / tot_fam
                        H4_norm = (tot_fam - (row_dim6[4] or 0)) / tot_fam
                        H5_norm = (tot_fam - (row_dim6[5] or 0)) / tot_fam
                        H6_norm = (tot_fam - (row_dim6[6] or 0)) / tot_fam
                        H7_norm = (tot_fam - (row_dim6[7] or 0)) / tot_fam
                        H8_norm = (tot_fam - (row_dim6[8] or 0)) / tot_fam
                        
                        Cp19 = (H1_norm + H2_norm) / 2
                        Cp20 = H3_norm
                        Cp21 = H4_norm
                        Cp22 = H5_norm
                        Cp23 = H6_norm
                        Cp24 = H7_norm
                        Cp25 = H8_norm
                        dim6 = 1 - ((Cp19 + Cp20 + Cp21 + Cp22 + Cp23 + Cp24 + Cp25) / 7)
                        
                        # Synthetic index
                        ind_sintetico = (dim1 + dim2 + dim3 + dim4 + dim5 + dim6) / 6.0
                        
                        cursor.execute("""
                            INSERT INTO idf_familia (
                                id_familia, data_proces, dim1, dim2, dim3, dim4, dim5, dim6, ind_sintetico
                            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        """, [
                            fam_id, data_proces_mysql,
                            round(dim1, 2), round(dim2, 2), round(dim3, 2),
                            round(dim4, 2), round(dim5, 2), round(dim6, 2),
                            round(ind_sintetico, 1)
                        ])
                        
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f"Erro no processamento do IDF: {str(e)}"}, status=500)
            
    return JsonResponse({'status': 'error', 'message': 'Método inválido.'}, status=400)

