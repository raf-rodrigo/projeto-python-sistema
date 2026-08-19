from django.db import models
from core.models.familia import FamiliaDomicilio
from core.models.tabela_basica import (
    TipoParentesco, OrientacaoSexual, Raca, TipoEstadoCivil, 
    TipoLocalNascimento, Estado, Municipio, TipoRegistroCivil, 
    TipoDeficiencia, TipoNecessitaCuidado, TipoTratamentoCaps, 
    TipoCurso, TipoSerieCurso, TipoAtividade, Cbo,
    TiposTemposResidenciasCidadesPopulacoesRuas,
    TiposContatosParentes, PopulacoesRuasTempoDeRua
)

class Pessoa(models.Model):
    SEXO_CHOICES = [
        ('Masc', 'Masculino'),
        ('Fem', 'Feminino'),
    ]
    SIM_NAO_CHOICES = [
        ('Sim', 'Sim'),
        ('Não', 'Não'),
    ]
    CERTIDAO_CHOICES = [
        ('Nascimento', 'Nascimento'),
        ('Casamento', 'Casamento'),
        ('RANI', 'RANI'),
    ]

    familia_domicilio = models.ForeignKey(FamiliaDomicilio, on_delete=models.SET_NULL, null=True, blank=True, related_name='membros', verbose_name="Família/Domicílio")
    situacao_de_rua = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Situação de Rua?")
    nome = models.CharField(max_length=255, verbose_name="Nome Completo")
    nis = models.CharField(max_length=20, null=True, blank=True, verbose_name="NIS")
    nome_social = models.CharField(max_length=255, null=True, blank=True, verbose_name="Nome Social")
    certidao_nascimento_data = models.DateField(verbose_name="Data de Nascimento")
    tipo_parentesco = models.ForeignKey(TipoParentesco, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Relação de Parentesco")
    sexo = models.CharField(max_length=5, choices=SEXO_CHOICES, verbose_name="Sexo")
    orientacao_sexual = models.ForeignKey(OrientacaoSexual, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Orientação Sexual")
    raca = models.ForeignKey(Raca, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Cor/Raça")
    tipo_estado_civil = models.ForeignKey(TipoEstadoCivil, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Estado Civil")
    
    # CONTATOS
    telefone = models.CharField(max_length=20, null=True, blank=True, verbose_name="Telefone")
    celular = models.CharField(max_length=20, null=True, blank=True, verbose_name="Celular")
    email = models.EmailField(null=True, blank=True, verbose_name="E-mail")

    # FILIAÇÃO
    nome_mae = models.CharField(max_length=255, null=True, blank=True, verbose_name="Nome da Mãe")
    indicado_mae_id = models.IntegerField(null=True, blank=True, verbose_name="ID Indicado Mãe")
    nome_pai = models.CharField(max_length=255, null=True, blank=True, verbose_name="Nome do Pai")
    indicado_pai_id = models.IntegerField(null=True, blank=True, verbose_name="ID Indicado Pai")

    # NASCIMENTO / NATURALIDADE
    tipo_local_nascimento = models.ForeignKey(TipoLocalNascimento, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tipo Local de Nascimento")
    pais_id = models.IntegerField(null=True, blank=True, default=1, verbose_name="País de Origem")
    estado = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True, related_name='pessoas_nascidas', verbose_name="Estado de Nascimento")
    municipio = models.ForeignKey(Municipio, on_delete=models.SET_NULL, null=True, blank=True, related_name='pessoas_nascidas', verbose_name="Município de Nascimento")
    codigo_ibge = models.CharField(max_length=15, null=True, blank=True, verbose_name="Código IBGE Nascimento")

    # REGISTRO CIVIL / CERTIDÕES
    tipo_registro_civil = models.ForeignKey(TipoRegistroCivil, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tipo de Registro Civil")
    certidao_nome_cartorio = models.CharField(max_length=255, null=True, blank=True, verbose_name="Nome do Cartório")
    certidao = models.CharField(max_length=15, choices=CERTIDAO_CHOICES, null=True, blank=True, verbose_name="Tipo de Certidão")
    certidao_numero_livro_registro = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nº do Livro")
    certidao_folha_livro_registro = models.CharField(max_length=50, null=True, blank=True, verbose_name="Folha do Livro")
    certidao_numero_matricula = models.CharField(max_length=100, null=True, blank=True, verbose_name="Nº Matrícula")
    certidao_nascimento = models.CharField(max_length=50, null=True, blank=True, verbose_name="Nº Certidão")
    rani = models.CharField(max_length=50, null=True, blank=True, verbose_name="RANI (Indígena)")
    certidao_data_registro = models.DateField(null=True, blank=True, verbose_name="Data do Registro")
    certidao_uf_registro = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True, related_name='certidoes_registradas', verbose_name="UF do Registro")
    certidao_municipio_registro = models.ForeignKey(Municipio, on_delete=models.SET_NULL, null=True, blank=True, related_name='certidoes_registradas', verbose_name="Município do Registro")
    certidao_codigo_ibge_registro = models.CharField(max_length=15, null=True, blank=True, verbose_name="IBGE Registro")

    # DOCUMENTOS
    rg = models.CharField(max_length=30, null=True, blank=True, verbose_name="RG")
    rg_digito = models.CharField(max_length=5, null=True, blank=True, verbose_name="Dígito RG")
    rg_data_emissao = models.DateField(null=True, blank=True, verbose_name="Data Emissão RG")
    rg_uf = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True, related_name='rgs_emitidos', verbose_name="UF Emissão RG")
    rg_orgao_emissor = models.CharField(max_length=50, null=True, blank=True, verbose_name="Órgão Emissor RG")
    cpf = models.CharField(max_length=14, unique=True, verbose_name="CPF")
    rne = models.CharField(max_length=30, null=True, blank=True, verbose_name="RNE (Estrangeiro)")
    ctps = models.CharField(max_length=30, null=True, blank=True, verbose_name="Carteira Trabalho (CTPS)")
    ctps_serie = models.CharField(max_length=20, null=True, blank=True, verbose_name="Série CTPS")
    ctps_data_emissao = models.DateField(null=True, blank=True, verbose_name="Data Emissão CTPS")
    ctps_estado_emissor = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True, related_name='ctps_emitidas', verbose_name="UF CTPS")
    titulo_eleitor = models.CharField(max_length=30, null=True, blank=True, verbose_name="Título Eleitor")
    titulo_eleitor_zona = models.CharField(max_length=10, null=True, blank=True, verbose_name="Zona Eleitoral")
    titulo_eleitor_secao = models.CharField(max_length=10, null=True, blank=True, verbose_name="Seção Eleitoral")
    cnh = models.CharField(max_length=30, null=True, blank=True, verbose_name="CNH")
    sus = models.CharField(max_length=30, null=True, blank=True, verbose_name="Cartão SUS")
    reservista = models.CharField(max_length=30, null=True, blank=True, verbose_name="Reservista")

    # SAÚDE
    portador_doenca_grave = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Doença Grave?")
    tipo_deficiencia = models.ForeignKey(TipoDeficiencia, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tipo de Deficiência")
    tipo_necessita_cuidados = models.ForeignKey(TipoNecessitaCuidado, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Necessita Cuidados?")
    usa_medicamento_controlado = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Medicamento Controlado?")
    usa_alcool = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Usa Álcool?")
    usa_droga = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Usa Droga?")
    transtorno_mental = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Possui Transtorno Mental?")
    medicamento_continuo = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Medicamento Contínuo?")
    tratamento_saude = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Em Tratamento Saúde?")
    tipo_tratamento_caps = models.ForeignKey(TipoTratamentoCaps, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tratamento CAPS")

    # EDUCAÇÃO
    escreve_le = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, null=True, blank=True, verbose_name="Escreve e Lê?")
    frequenta_escola_creche_id = models.IntegerField(null=True, blank=True, verbose_name="Frequenta Escola/Creche (ID)")
    nome_escola = models.CharField(max_length=255, null=True, blank=True, verbose_name="Nome da Escola")
    localizada_municipio = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, null=True, blank=True, verbose_name="Escola no Município?")
    estado_municipio_escola = models.ForeignKey(Estado, on_delete=models.SET_NULL, null=True, blank=True, related_name='escolas', verbose_name="UF Escola")
    municipal_escola_membro = models.ForeignKey(Municipio, on_delete=models.SET_NULL, null=True, blank=True, related_name='escolas', verbose_name="Município Escola")
    codigo_inep_mec = models.CharField(max_length=50, null=True, blank=True, verbose_name="Cód. INEP/MEC")
    tipo_curso_frequenta = models.ForeignKey(TipoCurso, on_delete=models.SET_NULL, null=True, blank=True, related_name='pessoas_frequentando', verbose_name="Curso Frequenta")
    nome_curso_frequenta = models.CharField(max_length=150, null=True, blank=True, verbose_name="Nome Curso Frequenta")
    tipo_serie_curso_frequenta = models.ForeignKey(TipoSerieCurso, on_delete=models.SET_NULL, null=True, blank=True, related_name='pessoas_frequentando', verbose_name="Série Frequenta")
    tipo_curso_frequentou = models.ForeignKey(TipoCurso, on_delete=models.SET_NULL, null=True, blank=True, related_name='pessoas_frequentou', verbose_name="Curso Frequentou")
    curso_concluido = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Concluiu Curso?")
    tipo_serie_curso_concluido = models.ForeignKey(TipoSerieCurso, on_delete=models.SET_NULL, null=True, blank=True, related_name='pessoas_concluido', verbose_name="Série Concluiu")

    # TRABALHO E RENDIMENTOS
    trabalha = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, null=True, blank=True, verbose_name="Trabalha Atualmente?")
    afastado_trabalho = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, null=True, blank=True, verbose_name="Afastado do Trabalho?")
    atividade_agricula = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, null=True, blank=True, verbose_name="Atividade Agrícola?")
    tipo_atividade = models.ForeignKey(TipoAtividade, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tipo de Atividade")
    qualificacao_profissional_cbo = models.ForeignKey(Cbo, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Profissão (CBO)")
    
    # Valores de Renda
    remuneracao_bruta = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Remuneração Bruta")
    receita_ajuda_doacao_regular = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Ajuda/Doação Regular")
    receita_aposentadoria_pensao = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Aposentadoria/Pensão")
    receita_beneficio_prestacao_continuada = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Benefício BPC")
    receita_seguro_desemprego = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Seguro Desemprego")
    receita_pensao_alimenticia = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Pensão Alimentícia")
    receita_outras_fontes = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Outras Fontes de Renda")
    recebe_bolsa_familia = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Recebe Bolsa Família?")
    receita_bolsa_familia = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Valor Bolsa Família")
    receita_programa_erradicacao_trabalho_infantil = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Valor PETI")

    observacao = models.TextField(null=True, blank=True, verbose_name="Observações")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'pessoas'
        verbose_name = "Pessoa"
        verbose_name_plural = "Pessoas"

    def __str__(self):
        return f"{self.nome} (CPF: {self.cpf})"

    def save(self, *args, **kwargs):
        from core.middleware import get_current_user
        from core.models.auditoria import AuditoriaLog
        from django.forms.models import model_to_dict

        is_new = self.pk is None
        old_values = {}

        if not is_new:
            try:
                orig = Pessoa.objects.get(pk=self.pk)
                old_values = model_to_dict(orig)
            except Pessoa.DoesNotExist:
                pass

        super().save(*args, **kwargs)

        new_values = model_to_dict(self)
        modificacoes = {}
        
        user = get_current_user()
        db_user = user if (user and user.is_authenticated) else None

        if is_new:
            for key, val in new_values.items():
                if val is not None and val != '':
                    modificacoes[key] = {"antigo": None, "novo": str(val)}
            
            AuditoriaLog.objects.create(
                usuario=db_user,
                modelo="Pessoa",
                registro_id=self.id,
                acao="CREATE",
                modificacoes=modificacoes
            )
        else:
            for key, val in new_values.items():
                old_val = old_values.get(key)
                if str(old_val) != str(val):
                    modificacoes[key] = {"antigo": str(old_val) if old_val is not None else None, "novo": str(val) if val is not None else None}

            if modificacoes:
                AuditoriaLog.objects.create(
                    usuario=db_user,
                    modelo="Pessoa",
                    registro_id=self.id,
                    acao="UPDATE",
                    modificacoes=modificacoes
                )

    def delete(self, *args, **kwargs):
        from core.middleware import get_current_user
        from core.models.auditoria import AuditoriaLog
        from django.forms.models import model_to_dict

        user = get_current_user()
        db_user = user if (user and user.is_authenticated) else None
        
        old_values = model_to_dict(self)
        modificacoes = {k: {"antigo": str(v) if v is not None else None, "novo": None} for k, v in old_values.items()}

        registro_id = self.id
        super().delete(*args, **kwargs)

        AuditoriaLog.objects.create(
            usuario=db_user,
            modelo="Pessoa",
            registro_id=registro_id,
            acao="DELETE",
            modificacoes=modificacoes
        )


class PessoaSituacaoRua(models.Model):
    SIM_NAO_CHOICES = [
        ('Sim', 'Sim'),
        ('Não', 'Não'),
    ]
    CARTEIRA_CHOICES = [
        ('Sim', 'Sim'),
        ('Não', 'Não'),
        ('Não Sabe', 'Não Sabe'),
    ]

    pessoa = models.OneToOneField(Pessoa, on_delete=models.CASCADE, related_name='situacao_rua_detalhes', verbose_name="Pessoa")
    
    # Abas Iniciais
    tempo_vive_na_rua = models.ForeignKey(PopulacoesRuasTempoDeRua, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tempo que vive na rua")
    tempo_mora_na_cidade = models.ForeignKey(TiposTemposResidenciasCidadesPopulacoesRuas, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tempo que mora na cidade")
    vive_com_familia_rua = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Vive com a família na rua?")
    contato_parente_fora_rua = models.ForeignKey(TiposContatosParentes, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Contato com parente fora de rua")
    teve_emprego_carteira_assinada = models.CharField(max_length=10, choices=CARTEIRA_CHOICES, default='Não', verbose_name="Teve emprego com carteira assinada?")

    # Onde Costumava Dormir
    dorme_rua = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Dorme na rua?")
    tempo_dorme_rua = models.IntegerField(null=True, blank=True, verbose_name="Frequência semanal dorme na rua")
    servico_acolhimento = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Dorme em serviço de acolhimento?")
    tempo_servico_acolhimento = models.IntegerField(null=True, blank=True, verbose_name="Frequência semanal dorme em acolhimento")
    domicilio_particular = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Dorme em domicílio particular?")
    tempo_domicilio_particular = models.IntegerField(null=True, blank=True, verbose_name="Frequência semanal dorme em dom. particular")
    outro_dormir = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Dorme de outra forma?")
    tempo_outro_dormir = models.IntegerField(null=True, blank=True, verbose_name="Frequência semanal dorme de outra forma")

    # Situação de Vulnerabilidade
    exploracao_infantil = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Exploração Infantil?")
    exploracao_sexual = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Exploração Sexual?")
    violencia_fisica = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Violência Física?")
    violencia_psicologica = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Violência Psicológica?")
    violencia_sexual = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Violência Sexual?")

    # Razões que Motivaram Viver na Rua
    respondeu_motivo = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Respondeu motivos?")
    nao_sabe_motivo = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Não sabe motivos?")
    perda_moradia = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Perda de moradia?")
    ameaca = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Ameaça?")
    problemas_familia = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Problemas familiares?")
    alcoolismo_droga = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Alcoolismo/Drogas?")
    desemprego = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Desemprego?")
    trabalho = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Trabalho?")
    saude = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Tratamento de saúde?")
    preferencia = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Preferência?")
    egresso = models.CharField(max_length=255, null=True, blank=True, verbose_name="Egresso?")
    outro_motivo = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Outro motivo?")

    # Participação de Atividade Comunitária
    respondeu_atividade = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Respondeu atividades?")
    atividade_escola = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Atividade em escola?")
    atividade_cooperativa = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Atividade em cooperativa?")
    atividade_movimento_social = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Atividade em movimento social?")
    nao_sabe_atividade = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Não sabe se frequentou?")

    # Atendimento Socioassistencial e Saúde
    atendido_cras = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Atendido por CRAS?")
    atendido_creas = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Atendido por CREAS?")
    atendido_centro_pop = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Atendido por Centro POP?")
    atendido_inst_gov = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Atendido por Inst. Gov?")
    atendido_inst_nao_gov = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Atendido por Inst. Não Gov?")
    atendido_hospital_geral = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Atendido por Hospital Geral?")
    nao_atendido = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Não atendido em nenhum local?")

    # Como Adquire o Sustento
    respondeu_sustento = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Respondeu sustento?")
    sustento_construcao_civil = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Sustento com cons. civil?")
    sustento_guardador_carro = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Sustento como guardador de carro?")
    sustento_carregador = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Sustento como carregador?")
    sustento_catador = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Sustento como catador?")
    sustento_servicos_gerais = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Sustento com servs. gerais?")
    sustento_pede_dinheiro = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Sustento pedindo dinheiro?")
    sustento_vendas = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Sustento com vendas?")
    sustento_outro = models.CharField(max_length=3, choices=SIM_NAO_CHOICES, default='Não', verbose_name="Sustento com outro meio?")

    # Observações e Responsável
    historico_pessoal = models.TextField(null=True, blank=True, verbose_name="Histórico Pessoal")
    data_cadastro = models.DateField(null=True, blank=True, verbose_name="Data Cadastro")
    profissional_responsavel = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Profissional Responsável")

    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'pessoas_situacoes_rua'
        verbose_name = "Situação de Rua do Cidadão"
        verbose_name_plural = "Situações de Rua dos Cidadãos"

    def __str__(self):
        return f"Situação de Rua de {self.pessoa.nome}"
