import os
import csv
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from core.models import Estado, Municipio, Cid, Cbo

User = get_user_model()

class Command(BaseCommand):
    help = 'Popula o banco de dados com superusuário inicial e importa dados das Tabelas Básicas a partir de CSVs.'

    def handle(self, *args, **options):
        self.stdout.write("=== Inicializando população de dados ===")

        # 1. Superusuário adm
        username = 'adm'
        password = 'adm123'
        email = 'adm@sistsocial.com'

        if not User.objects.filter(username=username).exists():
            self.stdout.write(f"Criando superusuário '{username}'...")
            User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f"Superusuário '{username}' criado com sucesso!"))
        else:
            self.stdout.write(self.style.WARNING(f"Superusuário '{username}' já existe. Ignorado."))

        # 1.1 Unidade Padrão
        from core.models import Unidade
        if not Unidade.objects.exists():
            self.stdout.write("Criando Unidade Padrão inicial...")
            Unidade.objects.create(
                razao_social="Unidade Social Padrão LTDA",
                nome_conhecido="Unidade Social Padrão",
                cep="00000-000",
                logradouro="Rua Principal",
                logradouro_numero="123",
                sigla="USP",
                ativo=True
            )
            self.stdout.write(self.style.SUCCESS("Unidade Padrão criada com sucesso!"))
        else:
            self.stdout.write(self.style.WARNING("Unidade Padrão já existe. Ignorado."))

        # 1.2 Menus Padrão
        from core.models import Menu
        if not Menu.objects.exists():
            self.stdout.write("Criando Menus iniciais...")
            Menu.objects.create(nome="Atendimentos", url="atendimentos", icone="FileText", ordem=1, ativo=True)
            Menu.objects.create(nome="Famílias", url="familias", icone="Home", ordem=2, ativo=True)
            Menu.objects.create(nome="Pessoas", url="pessoas", icone="Users", ordem=3, ativo=True)
            Menu.objects.create(nome="Unidades", url="unidades", icone="Building", ordem=4, ativo=True)
            Menu.objects.create(nome="Usuários", url="usuarios", icone="UserCheck", ordem=5, ativo=True)
            Menu.objects.create(nome="Tabelas Básicas", url="tabelas", icone="Table", ordem=6, ativo=True)
            Menu.objects.create(nome="Configurar Menus", url="gerenciamento-menus", icone="Settings", ordem=7, ativo=True)
            self.stdout.write(self.style.SUCCESS("Menus iniciais criados com sucesso!"))
        else:
            self.stdout.write(self.style.WARNING("Menus já existem. Ignorado."))



        # Pasta padrão para os CSVs
        csv_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), 'import_csv')
        
        # 2. Importação das Tabelas Básicas
        self.stdout.write("\nVerificando arquivos CSV para Tabelas Básicas...")
        
        self.importar_estados(os.path.join(csv_dir, 'estado.csv'))
        self.importar_municipios(os.path.join(csv_dir, 'municipio.csv'))
        self.importar_cids(os.path.join(csv_dir, 'cid.csv'))
        self.importar_cbos(os.path.join(csv_dir, 'cbo.csv'))

        self.stdout.write(self.style.SUCCESS("\n=== Processo de população finalizado ==="))

    def ler_csv_rows_and_headers(self, file_path):
        """Lê o arquivo CSV retornando a lista de linhas brutas e os cabeçalhos normalizados (em minúsculo e sem acento/sujeira)"""
        if not os.path.exists(file_path):
            self.stdout.write(self.style.WARNING(f"Arquivo não encontrado: {file_path}"))
            return None, None
        
        encoding_to_try = 'utf-8-sig'
        try:
            # Tenta ler as primeiras linhas para testar a decodificação
            with open(file_path, mode='r', encoding='utf-8-sig') as f:
                f.read(1024)
        except UnicodeDecodeError:
            encoding_to_try = 'latin-1'

        with open(file_path, mode='r', encoding=encoding_to_try) as f:
            # Detecta o delimitador
            sample = f.read(2048)
            f.seek(0)
            delimiter = ';' if ';' in sample else ','
            
            reader = csv.reader(f, delimiter=delimiter)
            try:
                headers = next(reader)
            except StopIteration:
                return None, None
            
            # Normaliza os cabeçalhos para facilitar busca (minúsculo, remove caracteres especiais e espaços)
            headers_clean = []
            for h in headers:
                clean = h.lower().strip()
                # Remove sujeiras comuns de decodificação de acentos
                clean = clean.replace('', '').replace('ó', 'o').replace('í', 'i').replace('ú', 'u')
                headers_clean.append(clean)
                
            return list(reader), headers_clean

    def importar_estados(self, file_path):
        rows, headers = self.ler_csv_rows_and_headers(file_path)
        if not rows or not headers:
            return

        self.stdout.write(f"Importando Estados de {file_path}...")
        
        # Mapeia colunas dinamicamente
        idx_cod = -1
        idx_sigla = -1
        idx_nome = -1
        
        for i, h in enumerate(headers):
            if 'codigo' in h or 'cod' in h or 'ibge' in h:
                idx_cod = i
            elif 'uf' in h or 'sigla' in h:
                idx_sigla = i
            elif 'estado' in h or 'nome' in h:
                idx_nome = i

        if idx_cod == -1 or idx_sigla == -1 or idx_nome == -1:
            self.stdout.write(self.style.ERROR(f"Erro: Colunas não identificadas no CSV de Estados. Cabeçalhos lidos: {headers}"))
            return

        objs_to_create = []
        for row in rows:
            if not row or len(row) <= max(idx_cod, idx_sigla, idx_nome):
                continue
            
            cod_str = row[idx_cod].strip()
            sigla = row[idx_sigla].strip().upper()[:2]
            nome = row[idx_nome].strip()
            
            if cod_str and sigla and nome:
                cod_val = int(cod_str)
                if not Estado.objects.filter(cod_ibge=cod_val).exists():
                    objs_to_create.append(Estado(
                        cod_ibge=cod_val,
                        sigla=sigla,
                        nome=nome
                    ))
        
        if objs_to_create:
            Estado.objects.bulk_create(objs_to_create)
            self.stdout.write(self.style.SUCCESS(f"{len(objs_to_create)} estados importados com sucesso!"))
        else:
            self.stdout.write(self.style.WARNING("Nenhum novo estado inserido."))

    def importar_municipios(self, file_path):
        rows, headers = self.ler_csv_rows_and_headers(file_path)
        if not rows or not headers:
            return

        self.stdout.write(f"Importando Municípios de {file_path} (isso pode levar alguns segundos)...")
        
        # Mapeia colunas dinamicamente
        idx_ibge = -1
        idx_municipio = -1
        idx_uf = -1
        
        for i, h in enumerate(headers):
            # Prioriza colunas contendo IBGE para evitar colunas TOM
            if 'ibge' in h and ('codigo' in h or 'cod' in h):
                idx_ibge = i
            elif 'ibge' in h and ('municipio' in h or 'mun' in h):
                idx_municipio = i
            elif h == 'uf':
                idx_uf = i

        # Fallbacks caso não ache cabeçalhos específicos
        if idx_ibge == -1:
            for i, h in enumerate(headers):
                if 'ibge' in h:
                    idx_ibge = i
                    break
        if idx_municipio == -1:
            for i, h in enumerate(headers):
                if 'municipio' in h or 'nome' in h:
                    idx_municipio = i
                    break

        if idx_ibge == -1 or idx_municipio == -1:
            self.stdout.write(self.style.ERROR(f"Erro: Colunas não identificadas no CSV de Municípios. Cabeçalhos lidos: {headers}"))
            return

        objs_to_create = []
        ibges_existentes = set(Municipio.objects.values_list('codigo_ibge', flat=True))

        for row in rows:
            if not row or len(row) <= max(idx_ibge, idx_municipio):
                continue
            
            cod_ibge = row[idx_ibge].strip()
            mun = row[idx_municipio].strip()
            
            if cod_ibge and mun:
                if cod_ibge not in ibges_existentes:
                    # Extrai os 2 primeiros dígitos do código IBGE do município para obter o código da UF
                    cod_uf = int(cod_ibge[:2])
                    
                    objs_to_create.append(Municipio(
                        codigo_uf=cod_uf,
                        codigo_ibge=cod_ibge,
                        municipio=mun
                    ))
                    ibges_existentes.add(cod_ibge)
        
        if objs_to_create:
            Municipio.objects.bulk_create(objs_to_create, batch_size=1000)
            self.stdout.write(self.style.SUCCESS(f"{len(objs_to_create)} municípios importados com sucesso!"))
        else:
            self.stdout.write(self.style.WARNING("Nenhum novo município inserido."))

    def importar_cids(self, file_path):
        rows, headers = self.ler_csv_rows_and_headers(file_path)
        if not rows or not headers:
            return

        self.stdout.write(f"Importando CID de {file_path}...")
        
        idx_codigo = -1
        idx_desc = -1
        idx_cod_cid = -1
        
        for i, h in enumerate(headers):
            if h == 'codigo':
                idx_codigo = i
            elif 'descricao' in h or 'nome' in h:
                idx_desc = i
            elif 'codigo_cid' in h or 'cid' in h:
                idx_cod_cid = i

        if idx_codigo == -1:
            idx_codigo = 0
        if idx_desc == -1:
            idx_desc = 1
        if idx_cod_cid == -1:
            idx_cod_cid = idx_codigo

        objs_to_create = []
        codigos_existentes = set(Cid.objects.values_list('codigo', flat=True))

        for row in rows:
            if not row or len(row) <= max(idx_codigo, idx_desc):
                continue
            
            codigo = row[idx_codigo].strip()
            desc = row[idx_desc].strip()
            cod_cid = row[idx_cod_cid].strip() if idx_cod_cid < len(row) else codigo
            
            if codigo and desc:
                if codigo not in codigos_existentes:
                    objs_to_create.append(Cid(
                        codigo=codigo,
                        descricao=desc,
                        codigo_cid=cod_cid
                    ))
                    codigos_existentes.add(codigo)
        
        if objs_to_create:
            Cid.objects.bulk_create(objs_to_create, batch_size=1000)
            self.stdout.write(self.style.SUCCESS(f"{len(objs_to_create)} registros CID importados!"))
        else:
            self.stdout.write(self.style.WARNING("Nenhum novo CID inserido."))

    def importar_cbos(self, file_path):
        rows, headers = self.ler_csv_rows_and_headers(file_path)
        if not rows or not headers:
            return

        self.stdout.write(f"Importando CBO de {file_path}...")
        
        idx_codigo = -1
        idx_nome = -1
        
        for i, h in enumerate(headers):
            if 'codigo' in h or 'cbo' in h:
                idx_codigo = i
            elif 'titulo' in h or 'nome' in h or 'descricao' in h:
                idx_nome = i

        if idx_codigo == -1:
            idx_codigo = 0
        if idx_nome == -1:
            idx_nome = 1

        objs_to_create = []
        codigos_existentes = set(Cbo.objects.values_list('codigo', flat=True))

        for row in rows:
            if not row or len(row) <= max(idx_codigo, idx_nome):
                continue
            
            codigo = row[idx_codigo].strip()
            nome = row[idx_nome].strip()
            
            if codigo and nome:
                try:
                    cod_int = int(codigo)
                    if cod_int not in codigos_existentes:
                        objs_to_create.append(Cbo(
                            codigo=cod_int,
                            nome=nome
                        ))
                        codigos_existentes.add(cod_int)
                except ValueError:
                    continue
        
        if objs_to_create:
            Cbo.objects.bulk_create(objs_to_create, batch_size=1000)
            self.stdout.write(self.style.SUCCESS(f"{len(objs_to_create)} registros CBO importados!"))
        else:
            self.stdout.write(self.style.WARNING("Nenhum novo CBO inserido."))
