import django.apps
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, Http404
from django.contrib import messages
from django.core.paginator import Paginator
from django.db import models
from django.db.models import Q
from apps.sist_social.models import *

# Mapping of URL string names to actual Django Model classes
MODEL_MAPPING = {
    'OrientacaoSexual': 'OrientacaoSexual',
    'TipoTrabalho': 'TipoTrabalho',
    'TipoSerieCurso': 'TipoSerieCurso',
    'TipoFrequenciaEscolar': 'TipoFrequenciaEscolar',
    'TipoCursoFrequentou': 'TipoCursoFrequentou',
    'TipoCursoAtual': 'TipoCursoAtual',
    'TipoCID': 'TipoCID',
    'TipoAnimal': 'TipoAnimal',
    'PrioridadeSCFV': 'PrioridadeSCFV',
    'MotivoDesligamento': 'MotivoDesligamento',
    'TipoRecurso': 'TipoRecurso',
    'Feriados': 'Feriados',
    'VulnerabilidadeSocial': 'VulnerabilidadeSocial',
    'Religioes': 'Religioes',
    'Bairros': 'Bairros',
    'Areas': 'Areas',
    'MicroAreas': 'MicroAreas',
    'Potencialidades': 'Potencialidades',
    'AtosInfracionais': 'AtosInfracionais',
    'MotivoAtendimento': 'MotivoAtendimento',
    'TipoMedidaSocioeducativa': 'TipoMedidaSocioeducativa',
    'TipoDeficiencia': 'TipoDeficiencia',
    'TipoCbo': 'TipoCbo',
    'TipoContatoParente': 'TipoContatoParente',
    'TipoEscolaridadePront': 'TipoEscolaridadePront',
    'TipoTempoRua': 'TipoTempoRua',
    'TipoOrigemCad': 'TipoOrigemCad',
    'PublicoAlvo': 'PublicoAlvo',
    'TipoSitViolencia': 'TipoSitViolencia',
    'OrigemTipoEncaminhamento': 'OrigemTipoEncaminhamento',
    'SitPrivadoLiberdade': 'SitPrivadoLiberdade',
    'ServicoSocial': 'ServicoSocial',
    'TipoServicoProtecao': 'TipoServicoProtecao',
    'TipoPeriodo': 'TipoPeriodo',
    'Caps': 'Caps',
    'RacaCor': 'RacaCor',
    'TipoOcupacao': 'TipoOcupacao',
    'TipoEtnia': 'TipoEtnia',
    'AbastecimentoAgua': 'AbastecimentoAgua',
    'TipoEfeitoDesc': 'TipoEfeitoDesc',
    'GruposTradicionaisEspecificos': 'GruposTradicionaisEspecificos',
    'TipoMaterialPiso': 'TipoMaterialPiso',
    'TipoBeneficios': 'TipoBeneficios',
    'Estados': 'Estados',
    'Municipios': 'Municipios',
    'Pais': 'Pais',
    'TipoUnidRealizServs': 'TipoUnidRealizServs',
    'TipoTempoResidencia': 'TipoTempoResideCidade',
    'TipoSitViolCreas': 'TipoSitViolCreas',
    'TipoAreaSeguimento': 'TipoAreaSeguimento',
    'LugarNascimento': 'TipoLocNasc',
    'TipoLocNasc': 'TipoLocNasc',
    'TipoRegistroCivil': 'TipoRegCivil',
    'TipoRegCivil': 'TipoRegCivil',
    'TipoNivelEscolaridade': 'TipoNivelEscolaridade',
    'FormasAcessoUsuario': 'FormasAcessoUsuario',
    'TipoAcessibilidade': 'TipoAcessibilidade',
    'TipoDestinacaoLixo': 'TipoDestinacaoLixo',
    'TipoEscoamentoSanitario': 'TipoEscoamentoSanitario',
    'TipoEspecieDomicilio': 'TipoEspecieDomicilio',
    'TipoIluminacao': 'TipoIluminacao',
    'TipoMaterialConstrucao': 'TipoMaterialConstrucao',
    'TipoServsPgms': 'TipoServsPgms',
    'TipoServidorPublico': 'TipoServidorPublico',
    'TipoUnidades': 'TipoUnidades',
    'TipoOrgaosRecursos': 'TipoOrgaosRecursos',
    'TipoParentesco': 'TipoParentesco',
    'TipoEstadoCivil': 'TipoEstadoCivil',
    'TipoResidencia': 'TipoResidencia',
    'FaixaRendaPessoa': 'FaixaRendaPessoa',
    'FaixaRendaPercapta': 'FaixaRendaPercapta',
    'TipoServSocial': 'TipoServSocial',
    'TipoServicosSociais': 'TipoServSocial',
    'TipoFaixaEtaria': 'TipoFaixaEtaria',
}

EXPLICIT_CONFIGS = {
    'Estados': {
        'title': 'Estados (UF)',
        'fields': [
            {'name': 'nome', 'label': 'Nome do Estado', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'sigla', 'label': 'Sigla', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'cod_ibge', 'label': 'Código IBGE', 'type': 'text', 'required': False, 'list_display': True},
        ]
    },
    'Municipios': {
        'title': 'Municípios',
        'fields': [
            {'name': 'nome', 'label': 'Nome do Município', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'cod_ibge', 'label': 'Código IBGE', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'id_uf', 'label': 'ID UF', 'type': 'number', 'required': False, 'list_display': True},
        ]
    },
    'Feriados': {
        'title': 'Feriados',
        'fields': [
            {'name': 'descricao', 'label': 'Descrição', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'data_ocorrencia', 'label': 'Data', 'type': 'date', 'required': True, 'list_display': True},
            {'name': 'ano', 'label': 'Ano', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'tipo', 'label': 'Tipo', 'type': 'select', 'required': True, 'list_display': True, 'options': [('fixo', 'Fixo'), ('móvel', 'Móvel')]},
            {'name': 'ativo', 'label': 'Ativo', 'type': 'checkbox', 'required': False, 'list_display': True},
        ]
    },
    'Bairros': {
        'title': 'Bairros',
        'fields': [
            {'name': 'nome_oficial', 'label': 'Nome Oficial', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'nome_correios', 'label': 'Nome Correios', 'type': 'text', 'required': False, 'list_display': True},
            {'name': 'cep', 'label': 'CEP', 'type': 'text', 'required': False, 'list_display': True},
            {'name': 'area_geo', 'label': 'Área Geográfica', 'type': 'text', 'required': False, 'list_display': True},
            {'name': 'ativo', 'label': 'Ativo', 'type': 'checkbox', 'required': False, 'list_display': True},
        ]
    },
    'TipoCID': {
        'title': 'CID (Classificação de Doenças)',
        'fields': [
            {'name': 'codigo', 'label': 'Código CID', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'descricao', 'label': 'Descrição', 'type': 'textarea', 'required': True, 'list_display': True},
            {'name': 'codigo_cid_dez', 'label': 'Código CID-10', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'ativo', 'label': 'Ativo', 'type': 'text', 'required': False, 'list_display': False},
        ]
    },
    'TipoCbo': {
        'title': 'CBO (Ocupações)',
        'fields': [
            {'name': 'codigo', 'label': 'Código CBO', 'type': 'text', 'required': True, 'list_display': True},
            {'name': 'ocupacao', 'label': 'Ocupação', 'type': 'text', 'required': True, 'list_display': True},
        ]
    }
}

def get_main_field_name(model_class):
    field_names = [f.name for f in model_class._meta.fields]
    for priority in ['nome', 'name', 'descricao', 'tipo', 'ocupacao', 'situacao', 'funcao', 'serie', 'material', 'medida', 'contato', 'abastecimento', 'efeito', 'periodo', 'raca_cor', 'escolaridade', 'curso', 'tempo_vive_rua', 'tempo_reside', 'unidade', 'origem']:
        if priority in field_names:
            return priority
    for f in model_class._meta.fields:
        if f.name != 'id':
            return f.name
    return 'id'

def get_model_config(model_name):
    mapped_name = MODEL_MAPPING.get(model_name)
    if not mapped_name:
        # Fallback case-insensitive
        for key, val in MODEL_MAPPING.items():
            if key.lower() == model_name.lower():
                mapped_name = val
                break
                
    if not mapped_name:
        raise Http404("Tabela básica não cadastrada.")
        
    try:
        model = django.apps.apps.get_model('sist_social', mapped_name)
    except LookupError:
        raise Http404(f"Model {mapped_name} não encontrado no app sist_social.")
        
    # Check if we have an explicit config
    if mapped_name in EXPLICIT_CONFIGS:
        config = EXPLICIT_CONFIGS[mapped_name].copy()
        config['model'] = model
        config['model_name'] = model_name
        config['main_field'] = get_main_field_name(model)
        return config
        
    # Build dynamic config
    fields = []
    main_field = get_main_field_name(model)
    
    for f in model._meta.fields:
        if f.name == 'id':
            continue
            
        field_type = 'text'
        if f.name in ['ativo', 'status'] and isinstance(f, (models.IntegerField, models.BooleanField)):
            field_type = 'checkbox'
        elif isinstance(f, models.TextField):
            field_type = 'textarea'
        elif isinstance(f, (models.IntegerField, models.PositiveIntegerField)):
            field_type = 'number'
        elif isinstance(f, models.DateField):
            field_type = 'date'
            
        fields.append({
            'name': f.name,
            'label': f.verbose_name.title() if f.verbose_name else f.name.replace('_', ' ').title(),
            'type': field_type,
            'required': not f.null and not f.blank,
            'list_display': f.name in [main_field, 'ativo', 'codigo', 'sigla']
        })
        
    # Custom titles
    title = mapped_name.replace('Tipo', 'Tipo ').strip()
    if title.startswith('Tipo '):
        title = 'Tipo de ' + title[5:]
        
    return {
        'model': model,
        'model_name': model_name,
        'title': title,
        'fields': fields,
        'main_field': main_field
    }


def list_tbasica(request, model_name):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    config = get_model_config(model_name)
    model = config['model']
    main_field = config['main_field']
    
    search = request.GET.get('search', '').strip()
    page_number = request.GET.get('page', 1)
    per_page = request.GET.get('per_page', '10')
    if per_page not in ['10', '25', '50', '100']:
        per_page = '10'
        
    # Query database
    queryset = model.objects.using('default').all().order_by('-id')
    
    if search:
        # Search on main text field or code
        filters = Q(**{f"{main_field}__icontains": search})
        if 'codigo' in [f.name for f in model._meta.fields]:
            filters |= Q(codigo__icontains=search)
        queryset = queryset.filter(filters)
        
    paginator = Paginator(queryset, int(per_page))
    page_obj = paginator.get_page(page_number)
    
    # Process items to attach standard label representation
    for item in page_obj:
        item.display_values = []
        for field in config['fields']:
            if field['list_display']:
                val = getattr(item, field['name'])
                if field['type'] == 'checkbox':
                    val = 'Ativo' if val == 1 else 'Inativo'
                item.display_values.append(val)
        
    return render(request, 'sist_social/Tbasicas/listar.html', {
        'config': config,
        'page_obj': page_obj,
        'search': search,
        'per_page': per_page,
    })


def create_tbasica(request, model_name):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    config = get_model_config(model_name)
    
    return render(request, 'sist_social/Tbasicas/criar.html', {
        'config': config,
        'form_data': {}
    })


def insert_tbasica(request, model_name):
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'messages': {'auth': 'Não autorizado.'}}, status=401)
        
    if request.method != 'POST':
        return JsonResponse({'success': False, 'messages': {'method': 'Método inválido.'}}, status=405)
        
    config = get_model_config(model_name)
    model = config['model']
    
    errors = {}
    obj_data = {}
    
    for field in config['fields']:
        val = request.POST.get(field['name'], '').strip()
        if field['required'] and not val and field['type'] != 'checkbox':
            errors[field['name']] = f"O campo {field['label']} é obrigatório."
            
        if field['type'] == 'checkbox':
            # Checkbox values are usually '1' or '0'
            obj_data[field['name']] = 1 if request.POST.get(field['name']) else 0
        elif field['type'] == 'number':
            obj_data[field['name']] = int(val) if val.isdigit() else None
        elif field['type'] == 'date':
            obj_data[field['name']] = val if val else None
        else:
            obj_data[field['name']] = val if val else None
            
    if errors:
        return JsonResponse({'success': False, 'messages': errors})
        
    try:
        obj = model(**obj_data)
        obj.save(using='default')
        return JsonResponse({'success': True, 'id': obj.id})
    except Exception as e:
        return JsonResponse({'success': False, 'messages': {'error': str(e)}})


def edit_tbasica(request, model_name, pk):
    if not request.session.get('usuarioLogado'):
        return redirect('login')
        
    config = get_model_config(model_name)
    model = config['model']
    
    obj = get_object_or_404(model.objects.using('default'), pk=pk)
    
    # Pre-populate form data and attach directly to field configs
    fields_with_values = []
    for field in config['fields']:
        f_copy = field.copy()
        raw_val = getattr(obj, field['name'])
        
        if field['type'] == 'date' and raw_val:
            if hasattr(raw_val, 'strftime'):
                f_copy['value'] = raw_val.strftime('%Y-%m-%d')
            else:
                f_copy['value'] = str(raw_val)
        else:
            f_copy['value'] = raw_val if raw_val is not None else ''
            
        fields_with_values.append(f_copy)
        
    return render(request, 'sist_social/Tbasicas/editar.html', {
        'config': config,
        'fields': fields_with_values,
        'pk': pk,
        'id': obj.id
    })


def update_tbasica(request, model_name):
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'messages': {'auth': 'Não autorizado.'}}, status=401)
        
    if request.method != 'POST':
        return JsonResponse({'success': False, 'messages': {'method': 'Método inválido.'}}, status=405)
        
    config = get_model_config(model_name)
    model = config['model']
    
    pk = request.POST.get('id')
    if not pk:
        return JsonResponse({'success': False, 'messages': {'id': 'ID é obrigatório para atualização.'}})
        
    obj = get_object_or_404(model.objects.using('default'), pk=pk)
    
    errors = {}
    for field in config['fields']:
        val = request.POST.get(field['name'], '').strip()
        if field['required'] and not val and field['type'] != 'checkbox':
            errors[field['name']] = f"O campo {field['label']} é obrigatório."
            
        if field['type'] == 'checkbox':
            setattr(obj, field['name'], 1 if request.POST.get(field['name']) else 0)
        elif field['type'] == 'number':
            setattr(obj, field['name'], int(val) if val.isdigit() else None)
        elif field['type'] == 'date':
            setattr(obj, field['name'], val if val else None)
        else:
            setattr(obj, field['name'], val if val else None)
            
    if errors:
        return JsonResponse({'success': False, 'messages': errors})
        
    try:
        obj.save(using='default')
        return JsonResponse({'success': True, 'id': obj.id})
    except Exception as e:
        return JsonResponse({'success': False, 'messages': {'error': str(e)}})


def delete_tbasica(request, model_name):
    if not request.session.get('usuarioLogado'):
        return JsonResponse({'success': False, 'messages': 'Não autorizado.'}, status=401)
        
    if request.method != 'POST':
        return JsonResponse({'success': False, 'messages': 'Método inválido.'}, status=405)
        
    config = get_model_config(model_name)
    model = config['model']
    
    pk = request.POST.get('id')
    if not pk:
        return JsonResponse({'success': False, 'messages': 'ID é obrigatório.'})
        
    try:
        obj = model.objects.using('default').get(pk=pk)
        obj.delete(using='default')
        return JsonResponse({'success': True})
    except model.DoesNotExist:
        return JsonResponse({'success': False, 'messages': 'Registro não encontrado.'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'messages': str(e)}, status=500)
