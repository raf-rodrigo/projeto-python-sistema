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

        from django.contrib.auth.models import Group
        from core.models import RecursoHumano, Unidade

        group_admin, _ = Group.objects.get_or_create(name='Administradores')

        if not User.objects.filter(username=username).exists():
            self.stdout.write(f"Criando superusuário '{username}'...")
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(f"Superusuário '{username}' criado com sucesso!"))
        else:
            user = User.objects.get(username=username)
            self.stdout.write(self.style.WARNING(f"Superusuário '{username}' já existe. Ignorado."))

        # Garante que o usuário está no grupo de Administradores
        if not user.groups.filter(id=group_admin.id).exists():
            user.groups.add(group_admin)
            self.stdout.write(self.style.SUCCESS(f"Usuário '{username}' adicionado ao grupo '{group_admin.name}'."))


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

        # 1.1.2 Perfil Profissional para adm
        unidade_padrao = Unidade.objects.first()
        if not hasattr(user, 'recurso_humano') and unidade_padrao:
            self.stdout.write("Criando perfil profissional (Recurso Humano) para o adm...")
            rh = RecursoHumano.objects.create(
                usuario=user,
                cpf="000.000.000-00",
                cep="00000-000",
                logradouro="Rua Principal",
                numero="123",
                municipio="Cidade Padrão",
                uf="SP",
                unidade_socioassistencial=True
            )
            rh.unidades.add(unidade_padrao)
            self.stdout.write(self.style.SUCCESS("Perfil profissional do adm criado com sucesso!"))


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

        # 1.3 Origens de Cadastro Padrão
        from core.models.tabela_basica import TipoOrigemCadastro
        origens = [
            "CadUnico",
            "Busca Ativa",
            "Espontâneo",
            "Inscrição MCMV",
            "Visita Domiciliar",
            "Atendimento CRAS",
            "Atendimento CREAS",
            "Outros Atendimentos",
            "Conselho Tutelar"
        ]
        self.stdout.write("Sincronizando Origens de Cadastro...")
        for nome_origem in origens:
            TipoOrigemCadastro.objects.get_or_create(nome=nome_origem, defaults={"ativo": True})
        self.stdout.write(self.style.SUCCESS("Origens de Cadastro sincronizadas!"))

        # 1.4 Tipos de Unidade de Atendimento de Família
        from core.models.tabela_basica import TipoUnidadeAtendimentoFamilia
        if not TipoUnidadeAtendimentoFamilia.objects.exists():
            self.stdout.write("Criando Tipos de Unidade de Atendimento iniciais...")
            TipoUnidadeAtendimentoFamilia.objects.create(nome="CRAS", ativo=True)
            TipoUnidadeAtendimentoFamilia.objects.create(nome="CREAS", ativo=True)
            TipoUnidadeAtendimentoFamilia.objects.create(nome="Centro POP", ativo=True)
            TipoUnidadeAtendimentoFamilia.objects.create(nome="Outra Unidade", ativo=True)
            self.stdout.write(self.style.SUCCESS("Tipos de Unidade criados!"))

        # 1.5 Configurações do Sistema
        from core.models.configuracao import Configuracao
        self.stdout.write("Sincronizando Configurações do Sistema...")
        configs = [
            {"chave": "NOMESISTEMA", "descricao": "Nome do Sistema", "valor": "Plataforma SistSocial"},
            {"chave": "COORDSISTEMA", "descricao": "Coordenadas iniciais do mapa do sistema", "valor": '{"lat":-23.5489,"lng":-46.6388}'},
            {"chave": "IDCIDADE", "descricao": "ID da cidade em que o sistema está localizado", "valor": "3898"},
            {"chave": "AEPETI_NOTIFICACAO_GERAL", "descricao": "Caso esteja marcado como Sim, o sistema ira notificar todos os usuários de to", "valor": "S"},
            {"chave": "PIA_NOTIFICACAO_GERAL", "descricao": "Caso esteja marcado como Sim, o sistema ira notificar todos os usuários de to", "valor": "S"},
            {"chave": "NOME_PREFEITURA", "descricao": "Nome da Prefeitura", "valor": "Prefeitura Municipal"},
            {"chave": "SUBTITULO_PREFEITURA", "descricao": "Nome da Secretaria", "valor": "Secretaria Municipal de Assistência Social"},
            {"chave": "TITULO_MENU", "descricao": "Sigla Secretaria", "valor": "SMADS"},
            {"chave": "APIGOOGLEMAPS", "descricao": "Chave API Google Maps", "valor": None},
            {"chave": "BRASAOPM", "descricao": "Caminho imagem brasão", "valor": None},
            {"chave": "TIPOPRONTUARIO", "descricao": "Tipo de Prontuário Utilizado pelo Sistema (SUAS / CUSTOM)", "valor": "1"},
            {"chave": "LINKSUPORTE", "descricao": "Link para Suporte Secretaria - Vision", "valor": None},
            {"chave": "RODAPE_RELATORIO", "descricao": "Rodape Relatorios", "valor": "SistSocial - Gestão de Assistência Social"},
            {"chave": "APIGOOGLEAGENDA", "descricao": "agenda google", "valor": "mlou45meftojtkt720e2euv98s@group.calendar.google.com"},
            {"chave": "SUBTITULO_MENU", "descricao": "Sub", "valor": "Campo Limpo Paulista"},
            {"chave": "RM_LGMENU_FOOTER", "descricao": "Retirar brasão e rodapé do sistsocial", "valor": "1"},
            {"chave": "TESTE_IMG", "descricao": "asd", "valor": "/var/www/html/ci/sist_central/assets/img/sistema/Captura de tela de 2023-08-", "validacao": "img"},
            {"chave": "IMAGEM_LOGIN", "descricao": "Imagem da prefeitura vigente", "valor": None, "validacao": "img"},
            {"chave": "IMAGEM_RELATORIO", "descricao": "imagem rel", "valor": "../../../ci/arquivos/sist_social/sistema/imagens/brasao-relatorio.png"},
            {"chave": "VERIFICACAO_CPF", "descricao": "0 - Não valida CPF | 1 - Valida CPF e não permite 999... | 2 - Valida CPF e permil", "valor": "2"},
            {"chave": "EDITA_ENDERECO_NA_CRIACO_FAMILIA", "descricao": "Permite a edição dos campos relativo ao endereço após preenchimento auton", "valor": "0"},
            {"chave": "REENCAMINHAMENTO_TECNICO", "descricao": "Deverá condicionar se o botão de reencaminhamento estará disponível pra es", "valor": "1"},
            {"chave": "CONF_SELECT", "descricao": "TESTE", "valor": "1"},
            {"chave": "ATEND_INDIVIDUAL", "descricao": "Atendimento individual", "valor": "1"},
            {"chave": "etnia_required", "descricao": "0-Campo 'Etnia' não será obrigatório | 1 - Campo 'Etnia' será obrigatório", "valor": "0"},
            {"chave": "PERFIL_CADASTRO_BAIRRO_OFICIAL", "descricao": "Perfil com permissoes para acessar a interface de Bairros Oficiais", "valor": "Adm Sist Social"},
            {"chave": "LOGIN_VISION", "descricao": "valor 0: Não Possibilita login no Vision, valor 1: Possibilita login no Vision", "valor": "1"},
            {"chave": "LOGIN_BETHA", "descricao": "1: Renderiza botão de login com a Betha. 0: Não renderiza.", "valor": "0"},
            {"chave": "CREAS_RELATORIO_MENSAL_VISUALIZACA", "descricao": "O Perfis separados por virgula. O primeiro perfil pode ver todas as unidades e", "valor": "Adm Sist Social,Técnico Grupos,Tecnicos,Gestores,Coordenador Tecnico"},
            {"chave": "CRAS_RELATORIO_MENSAL_VISUALIZACAC", "descricao": "O Perfis separados por virgula. O primeiro perfil pode ver todas as unidades e", "valor": "Adm Sist Social,Técnico Grupos,Tecnicos,Gestores,Coordenador Tecnico"},
            {"chave": "LINHA_EXTREMA_POBREZA", "descricao": "Limite máximo de Linha de Extrema Pobreza", "valor": "209,00"},
            {"chave": "LINHA_POBREZA", "descricao": "Valor Teto Pobreza (mês)", "valor": "605,00"},
            {"chave": "LOGIN_SIST", "descricao": "1:Renderiza botão de login. 0:Não renderiza.", "valor": "1"},
            {"chave": "LOGIN_RECUPERA_SENHA", "descricao": "1:Renderiza link de recuperação de senha. 0:Não renderiza.", "valor": "1"},
            {"chave": "CHAMADO_ABERTO_ALERTA", "descricao": "Alerta o usuario caso existe algum chamado não concluído com a data anteri", "valor": "1"},
            {"chave": "CHAMADO_ABERTO_ALERTA_TEMPO", "descricao": "Intervalo em minutos que o usuário será alertado sobre a existência de chama", "valor": "3"},
            {"chave": "CHAMADO_ABERTO_ALERTA_INTERVALO", "descricao": "Intervalo em horas que um chamado aberto pode gerar um alerta.", "valor": "1"},
            {"chave": "PERMITE_DATA_RETROATIVA", "descricao": "1 : permite data retroativa na cricao e edição de atendimento técnico. 0: não p", "valor": "1"},
        ]
        for cfg in configs:
            Configuracao.objects.get_or_create(
                chave=cfg["chave"],
                defaults={
                    "descricao": cfg["descricao"],
                    "valor": cfg.get("valor"),
                    "validacao": cfg.get("validacao")
                }
            )
        self.stdout.write(self.style.SUCCESS("Configurações do Sistema sincronizadas!"))

        # 1.6 Países
        from core.models.tabela_basica import Pais
        self.stdout.write("Sincronizando Países...")
        paises_nomes = [
            "Brasil", "Argentina", "Paraguai", "Uruguai", "Venezuela", "Colômbia", 
            "Bolívia", "Chile", "Peru", "Equador", "Haiti", "Angola", "Estados Unidos",
            "Japão", "Itália", "Portugal", "Alemanha", "Espanha", "França", "China"
        ]
        for p_nome in paises_nomes:
            Pais.objects.get_or_create(nome=p_nome, defaults={"ativo": True})
        self.stdout.write(self.style.SUCCESS("Países sincronizados!"))

        # 1.7 Motivo Atendimento (Formas de Acesso)
        from core.models.tabela_basica import MotivoAtendimento
        self.stdout.write("Sincronizando Motivos de Atendimento...")
        motivos = [
            (1, 'Por demanda espontânea', True),
            (2, 'Agendamento', True),
            (3, 'Denúncia', True),
            (4, 'Em decorrência de Busca Ativa realizada pela equipe da unidade', True),
            (5, 'Em decorrência de Visita Domiciliar realizada pela equipe da unidade', True),
            (6, 'Em decorrência de encaminhamento realizado por outros serviços/unidades da Proteção Social Básica', True),
            (7, 'Em decorrência de encaminhamento realizado por outros serviços/unidades da Proteção Social Especial', True),
            (8, 'Em decorrência de encaminhamento realizado pela área de Saúde', True),
            (9, 'Em decorrência de encaminhamento realizado pela área de Educação', True),
            (10, 'Em decorrência de encaminhamento realizado outras políticas setoriais', True),
            (11, 'Em decorrência de encaminhamento realizado pelo Conselho Tutelar', True),
            (12, 'Em decorrência de encaminhamento realizado pelo Poder Judiciário', True),
            (13, 'Em decorrência de encaminhamento realizado pelo Sistema de Garantia de Direitos (Defensoria Pública, ministério Público, Delegacias)', True),
            (14, 'Situações de Vulnerabilidade', True),
            (15, 'Outros encaminhamentos ', True),
            (16, 'Contatos telefônicos para orientação/ agendamento', True),
            (17, 'Demanda reprimida benefício eventual', False),
        ]
        for mid, desc, is_active in motivos:
            MotivoAtendimento.objects.update_or_create(
                id=mid,
                defaults={"nome": desc, "ativo": is_active}
            )
        self.stdout.write(self.style.SUCCESS("Motivos de Atendimento sincronizados!"))

        # 1.8 Tipos de Atendimento
        from core.models.tabela_basica import TiposAtendimentos
        self.stdout.write("Sincronizando Tipos de Atendimento...")
        tipos = [
            (1, 'Atendimento Particularizado (CRAS)', 'Tecnico', True),
            (2, 'Atendimento em atividade coletiva de caráter continuado', 'Tecnico', True),
            (3, 'Participação em atividade coletiva de caráter não continuado', 'Tecnico', True),
            (4, 'Cadastramento / Atualização cadastral', 'Tecnico', True),
            (5, 'Acompanhamento do MSE - CREAS', 'Tecnico', True),
            (6, 'Solicitação / Concessão de Benefício Eventual', 'Tecnico', True),
            (7, 'Atendimento Particularizado Domiciliar (CREAS)', 'Tecnico', True),
            (8, 'Outros (CREAS)', 'Tecnico', True),
            (9, 'Atualização Cadastral', 'Simplificado', True),
            (10, 'Informações', 'Simplificado', True),
            (11, 'Acompanhamento Técnico (CRAS)', 'Simplificado', True),
            (12, 'Outros', 'Simplificado', True),
            (13, 'Atualização Cad Unico (CRAS)', 'Simplificado', True),
            (14, 'Atendimento Particularizado Domiciliar (CRAS)', 'Tecnico', True),
            (15, 'Ação que Alimenta', 'Tecnico', False),
            (16, 'Atendimento MSE ', 'Tecnico', False),
            (17, 'Denúncia ', 'Simplificado', True),
            (18, 'Agendamento', 'Simplificado', True),
            (19, 'Acolhida particularizada (CRAS)', 'Tecnico', True),
            (20, 'Orientações', 'Simplificado', True),
            (21, 'Inclusão Cad Unico (CRAS)', 'Simplificado', True),
            (22, 'Abordagem Social', 'Tecnico', False),
            (23, 'Solicitação de Carteirinha', 'Simplificado', True),
            (24, 'Acolhida Particularizada Domiciliar (CRAS)', 'Tecnico', True),
            (25, 'Inclusão Cad Unico - Domiciliar (CRAS)', 'Tecnico', True),
            (26, 'Acolhida Particularizada Domiciliar (CREAS)', 'Tecnico', True),
            (27, 'Acolhida particularizada (CREAS)', 'Tecnico', True),
            (28, 'Atendimento Particularizado (CREAS)', 'Tecnico', True),
            (30, 'Abordagem Social (CREAS)', 'Tecnico', True),
            (31, 'Entrega de Beneficios', 'Tecnico', True),
            (32, 'Encaminhamento para o CRAS', 'Tecnico', True),
            (33, 'Encaminhamento para o CREAS', 'Tecnico', True),
            (34, 'Atendimento Migrantes - CREAS', 'Tecnico', True),
            (35, 'Encaminhamento para acesso ao BPC (CRAS)', 'Tecnico', True),
            (36, 'Atendimento Particularizado (Centro POP)', 'Tecnico', True),
        ]
        for tid, desc, modal, is_active in tipos:
            TiposAtendimentos.objects.update_or_create(
                id=tid,
                defaults={"nome": desc, "modalidade": modal, "ativo": is_active}
            )
        self.stdout.write(self.style.SUCCESS("Tipos de Atendimento sincronizados!"))

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
