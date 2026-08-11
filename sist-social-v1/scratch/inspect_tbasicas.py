import os
import django
from django.db import connections

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

tables_to_inspect = [
    'tipo_trabalho',
    'tipo_serie_curso',
    'tipo_frequencia_escola',
    'tipo_curso_fez', # for Curso frequentou / TipoCursoFrequentou
    'tipo_curso_atual',
    'cid',
    'tipo_animal',
    'tipo_prioridade_scfv',
    'motivo_desligamento',
    'tipo_recurso',
    'feriados',
    'vulnerabilidades_sociais',
    'religioes',
    'bairros',
    'areas',
    'microareas',
    'potencialidades',
    'atos_infracionais',
    'motivo_atendimento',
    'tipo_medida_socioeduc',
    'tipo_deficiencia',
    'tipo_cbo',
    'tipo_contato_parente',
    'tipo_escolaridade_pront',
    'tipo_tempo_rua',
    'tipo_origem_cad',
    'publico_alvo',
    'tipo_sit_violencia',
    'origem_tipo_encaminhamento',
    'sit_privado_liberdade',
    'servico_social',
    'tipo_servico_protecao',
    'tipo_periodo',
    'caps',
    'raca_cor',
    'tipo_ocupacao',
    'tipo_etnia',
    'tipo_abastec_agua',
    'tipo_efeito_descumpr',
    'tipo_grupos_fam_mds', # Grupos Tradicionais e Específicos
    'tipo_mat_piso',
    'tipo_beneficios',
    'estados',
    'municipios',
    'pais'
]

with connections['default'].cursor() as cursor:
    cursor.execute("SHOW TABLES")
    all_tables = [row[0] for row in cursor.fetchall()]
    
    for tbl in tables_to_inspect:
        if tbl in all_tables:
            cursor.execute(f"DESCRIBE `{tbl}`")
            cols = cursor.fetchall()
            print(f"\nTABLE: {tbl}")
            for col in cols:
                print(f"  {col[0]}: {col[1]} (Null: {col[2]}, Key: {col[3]}, Default: {col[4]})")
        else:
            print(f"\nTABLE: {tbl} - NOT FOUND")
