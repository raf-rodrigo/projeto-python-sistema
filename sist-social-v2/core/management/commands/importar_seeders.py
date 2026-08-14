import os
import re
from django.core.management.base import BaseCommand
from django.apps import apps
from django.db import transaction

# Diretório de seeders do Laravel (local temporário montado no Docker)
LARAVEL_SEEDERS_DIR = '/app/laravel_seeders/'

class Command(BaseCommand):
    help = 'Lê os seeders PHP do Laravel e popula as tabelas auxiliares correspondentes no Django.'

    def handle(self, *args, **options):
        self.stdout.write("=== Iniciando Importação de Seeders do Laravel ===")

        if not os.path.exists(LARAVEL_SEEDERS_DIR):
            self.stdout.write(self.style.ERROR(f"Diretório não encontrado: {LARAVEL_SEEDERS_DIR}"))
            return

        # Dicionário de mapeamento especial para tabelas cujo nome no Django difere do Laravel
        map_models = {
            'classificacao_brasileira_de_ocupacao': 'Cbo',
            'estado': 'Estado',
            'municipio': 'Municipio',
            'cid': 'Cid'
        }

        # Ignoramos tabelas transacionais ou muito grandes que são preenchidas por CSV ou rotinas específicas
        skip_tables = {'users', 'pessoas', 'familias_domicilios', 'atendimentos', 'prontuarios', 'agendas', 'paginas', 'arquivos_uploads', 'unidades', 'usuario_unidade', 'estado', 'municipio', 'cid', 'classificacao_brasileira_de_ocupacao'}

        # Obtém todos os modelos do app core
        core_models = apps.get_app_config('core').get_models()
        models_by_db_table = {}
        for m in core_models:
            db_table = m._meta.db_table
            models_by_db_table[db_table] = m

        arquivos = sorted(os.listdir(LARAVEL_SEEDERS_DIR))
        success_count = 0

        for arquivo in arquivos:
            if not arquivo.endswith('.php') or 'DatabaseSeeder' in arquivo:
                continue

            file_path = os.path.join(LARAVEL_SEEDERS_DIR, arquivo)
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # Descobre o nome da tabela física indicada no truncate ou insert
            table_match = re.search(r"DB::table\('([^']+)'\)", content)
            if not table_match:
                continue

            table_name = table_match.group(1)
            if table_name in skip_tables:
                continue

            # Busca o modelo correspondente no Django
            model = models_by_db_table.get(table_name)
            if not model:
                continue

            # Extrai os dados do array PHP. Exemplo: ['nome' => 'Física'], ['nome' => 'Cadeirante']
            # Captura blocos [...] ou array(...) contendo pares chave => valor
            records = []
            
            # Encontra todos os padrões de chave/valor no formato ['campo' => 'valor']
            # ou ['campo' => "valor"] ou ['campo' => 123]
            raw_records = re.findall(r"\[([^\]]+)\]", content)
            for raw in raw_records:
                # Se for a declaração do array principal do Laravel, ignora
                if '=>' not in raw:
                    continue
                
                # Transforma o par chave => valor PHP em dicionário Python
                record_dict = {}
                pairs = re.findall(r"['\"]([^'\"]+)['\"]\s*=>\s*(['\"]([^'\"]*)['\"]|([0-9a-zA-Z_]+))", raw)
                for pair in pairs:
                    key = pair[0]
                    val = pair[2] if pair[2] != '' else pair[3]
                    # Limpa strings de aspas
                    val = val.strip().strip("'").strip('"')
                    # Tenta converter para int se for numérico
                    if val.isdigit():
                        val = int(val)
                    record_dict[key] = val
                
                if record_dict:
                    records.append(record_dict)

            if not records:
                # Tenta outra regex para arrays mais simples ou formatos alternativos
                # Exemplo: ['Física', 'Mental']
                continue

            self.stdout.write(f"Importando {len(records)} registros para {model.__name__} (tabela: {table_name})...")

            try:
                with transaction.atomic():
                    # Evita duplicar registros se já existirem
                    created_count = 0
                    for rec in records:
                        # Tabelas padrão costumam ter 'nome' ou 'descricao'
                        nome_val = rec.get('nome') or rec.get('descricao')
                        if not nome_val:
                            # Se for chave/valor customizado, tenta usar o primeiro valor do dict
                            nome_val = list(rec.values())[0] if rec else None

                        if nome_val:
                            nome_val = str(nome_val).strip()
                            # Se o modelo tiver o campo nome
                            if hasattr(model, 'nome'):
                                if not model.objects.filter(nome=nome_val).exists():
                                    model.objects.create(nome=nome_val)
                                    created_count += 1
                            elif hasattr(model, 'descricao'):
                                if not model.objects.filter(descricao=nome_val).exists():
                                    model.objects.create(descricao=nome_val)
                                    created_count += 1
                    
                    if created_count > 0:
                        self.stdout.write(self.style.SUCCESS(f"-> {created_count} novos registros inseridos em {model.__name__}."))
                    else:
                        self.stdout.write(self.style.WARNING("-> Nenhum registro novo inserido (já existiam)."))
                    
                    success_count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"Erro ao salvar registros para {model.__name__}: {str(e)}"))

        self.stdout.write(self.style.SUCCESS(f"\n=== Importação finalizada! {success_count} tabelas processadas com sucesso. ==="))
