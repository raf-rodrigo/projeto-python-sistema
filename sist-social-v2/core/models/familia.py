from django.db import models
from django.contrib.auth.models import User
from core.models.tabela_basica import (
    TipoUnidadeAtendimentoFamilia, TipoOrigemCadastro, TipoEspecieDomicilio, 
    TipoResidencia, TipoPisoDomicilio, TipoConstrucaoDomicilio, 
    TipoIluminacaoDomicilio, TipoAbastecimentoAgua, TipoEscoamentoSanitario, 
    TipoColetaLixo, TipoAcessibilidadeDomicilio, TiposAnimais, 
    TipoGruposTradicionaisEspecificos
)
from core.models.unidade import Unidade

class FamiliaDomicilio(models.Model):
    LOCALIZACAO_CHOICES = [
        ('Urbana', 'Urbana'),
        ('Rural', 'Rural'),
    ]
    AREA_RISCO_CHOICES = [
        ('Sim', 'Sim'),
        ('Não', 'Não'),
    ]
    CALCAMENTO_CHOICES = [
        ('Total', 'Total'),
        ('Parcial', 'Parcial'),
        ('Não Existe', 'Não Existe'),
    ]
    VULNERABILIDADE_CHOICES = [
        ('Alto', 'Alto'),
        ('Médio', 'Médio'),
        ('Baixo', 'Baixo'),
    ]

    familia_codigo = models.CharField(max_length=50, null=True, blank=True, verbose_name="Código da Família")

    # ENDEREÇO
    logradouro_cep = models.CharField(max_length=9, null=True, blank=True, verbose_name="CEP")
    logradouro_nome = models.CharField(max_length=255, null=True, blank=True, verbose_name="Logradouro")
    logradouro_numero = models.CharField(max_length=20, null=True, blank=True, verbose_name="Número")
    logradouro_complemento = models.CharField(max_length=150, null=True, blank=True, verbose_name="Complemento")
    bairro = models.CharField(max_length=100, null=True, blank=True, verbose_name="Bairro")
    cidade = models.CharField(max_length=100, null=True, blank=True, verbose_name="Cidade")
    estado = models.CharField(max_length=2, null=True, blank=True, verbose_name="Estado (UF)")
    latitude = models.CharField(max_length=50, null=True, blank=True, verbose_name="Latitude")
    longitude = models.CharField(max_length=50, null=True, blank=True, verbose_name="Longitude")
    complemento_adicional_endereco = models.CharField(max_length=255, null=True, blank=True, verbose_name="Complemento Adicional")
    referencia_para_localizacao = models.CharField(max_length=255, null=True, blank=True, verbose_name="Ponto de Referência")
    telefone = models.CharField(max_length=20, null=True, blank=True, verbose_name="Telefone")

    # CADASTRO INICIAL
    tempo_moradia_anos = models.CharField(max_length=10, null=True, blank=True, verbose_name="Tempo de Moradia (Anos)")
    tempo_moradia_meses = models.CharField(max_length=10, null=True, blank=True, verbose_name="Tempo de Moradia (Meses)")
    localizacao_domicilio = models.CharField(max_length=10, choices=LOCALIZACAO_CHOICES, null=True, blank=True, verbose_name="Localização Domicílio")
    area_risco = models.CharField(max_length=3, choices=AREA_RISCO_CHOICES, null=True, blank=True, verbose_name="Área de Risco?")
    area_conflito_violencia = models.CharField(max_length=3, choices=AREA_RISCO_CHOICES, null=True, blank=True, verbose_name="Área de Conflito/Violência?")
    unidade_atendimento_social_familia = models.ForeignKey(Unidade, on_delete=models.SET_NULL, null=True, blank=True, related_name='familias_atendidas', verbose_name="Unidade Atendimento da Família")
    beneficio_bolsa_familia = models.CharField(max_length=3, choices=AREA_RISCO_CHOICES, null=True, blank=True, verbose_name="Bolsa Família?")
    data_cadastro = models.DateField(auto_now_add=True, verbose_name="Data de Cadastro")
    origem_cadastro = models.ForeignKey(TipoOrigemCadastro, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Origem Cadastro")
    unidade_cadastro = models.ForeignKey(Unidade, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Unidade do Cadastro")
    responsavel_cadastro = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Responsável pelo Cadastro")

    # CONDIÇÕES HABITACIONAIS
    tipo_especie_domicilio = models.ForeignKey(TipoEspecieDomicilio, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Espécie do Domicílio")
    tipo_residencia = models.ForeignKey(TipoResidencia, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tipo de Residência")
    total_pessoa_domicilio = models.CharField(max_length=10, null=True, blank=True, verbose_name="Total Pessoas Domicílio")
    pessoas_de_zero_a_dezessete = models.CharField(max_length=10, null=True, blank=True, verbose_name="Pessoas 0-17 anos")
    pessoas_de_dezoito_a_sessenta_e_quatro = models.CharField(max_length=10, null=True, blank=True, verbose_name="Pessoas 18-64 anos")
    pessoas_com_mais_de_sessenta_e_cinco = models.CharField(max_length=10, null=True, blank=True, verbose_name="Pessoas 65+ anos")
    total_familia_domicilio = models.CharField(max_length=10, null=True, blank=True, verbose_name="Total Família Domicílio")
    numero_comodos = models.CharField(max_length=10, null=True, blank=True, verbose_name="Número de Cômodos")
    numero_dormitorio = models.CharField(max_length=10, null=True, blank=True, verbose_name="Número de Dormitórios")
    numero_pessoa_dormitorio = models.CharField(max_length=10, null=True, blank=True, verbose_name="Número de Pessoas por Dormitório")
    tipo_piso_domicilio = models.ForeignKey(TipoPisoDomicilio, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tipo de Piso")
    tipo_construcao_domicilio = models.ForeignKey(TipoConstrucaoDomicilio, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tipo de Construção")
    tipo_iluminacao_domicilio = models.ForeignKey(TipoIluminacaoDomicilio, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tipo de Iluminação")
    agua_canalizada = models.CharField(max_length=3, choices=AREA_RISCO_CHOICES, null=True, blank=True, verbose_name="Água Canalizada?")
    tipo_abastecimento_agua = models.ForeignKey(TipoAbastecimentoAgua, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Abastecimento de Água")
    possue_banheiro = models.CharField(max_length=3, choices=AREA_RISCO_CHOICES, null=True, blank=True, verbose_name="Possui Banheiro?")
    tipo_escoamento_sanitario = models.ForeignKey(TipoEscoamentoSanitario, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Escoamento Sanitário")
    tipo_coleta_lixo = models.ForeignKey(TipoColetaLixo, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Coleta de Lixo")
    calcamento_na_frente_domicilio = models.CharField(max_length=15, choices=CALCAMENTO_CHOICES, null=True, blank=True, verbose_name="Calçamento em frente?")
    area_dificil_acesso = models.CharField(max_length=3, choices=AREA_RISCO_CHOICES, null=True, blank=True, verbose_name="Área de difícil acesso?")
    tipo_acessibilidade_domicilio = models.ForeignKey(TipoAcessibilidadeDomicilio, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Acessibilidade Domicílio")
    tipo_animal = models.ForeignKey(TiposAnimais, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Animais no Domicílio")

    # ETNIA
    codigo_povo_indigena = models.CharField(max_length=50, null=True, blank=True, verbose_name="Cód. Povo Indígena")
    povo_indigena = models.CharField(max_length=150, null=True, blank=True, verbose_name="Povo Indígena")
    codigo_reserva_indigena = models.CharField(max_length=50, null=True, blank=True, verbose_name="Cód. Reserva Indígena")
    reserva_indigena = models.CharField(max_length=150, null=True, blank=True, verbose_name="Reserva Indígena")
    codigo_comunidade_quilombola = models.CharField(max_length=50, null=True, blank=True, verbose_name="Cód. Comunidade Quilombola")
    comunidade_quilombola = models.CharField(max_length=150, null=True, blank=True, verbose_name="Comunidade Quilombola")

    # DESPESAS (Mensais)
    despesa_energia_eletrica = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Energia Elétrica")
    despesa_agua_esgoto = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Água/Esgoto")
    despesa_gas_carvao_lenha = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Gás/Lenha")
    despesa_alimentacao_higiene_limpeza = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Alimentação/Higiene")
    despesa_transporte = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Transporte")
    despesa_aluguel = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Aluguel")
    despesa_medicamento_uso_regular = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Medicamentos")
    despesa_combustivel = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Combustível")
    despesa_financiamento_imovel = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Financiamento Imóvel")
    despesa_financiamento_veiculo = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Financiamento Veículo")
    despesa_celular = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Celular")
    despesa_assinatura_tv = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa TV Assinatura")
    despesa_telefone_fixo = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Telefone Fixo")
    despesa_emprestimo = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Empréstimo")
    despesa_saude = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Saúde")
    despesa_educacao = models.DecimalField(max_digits=7, decimal_places=2, default=0.00, verbose_name="Despesa Educação")

    # CONDIÇÕES SOCIOASSISTENCIAIS
    renda_per_capita_sem_programas_sociais = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, verbose_name="Renda Per Capita Sem Programas")
    renda_per_capita_com_progamas_sociais = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True, verbose_name="Renda Per Capita Com Programas")
    codigo_conta_energia_eletrica = models.CharField(max_length=50, null=True, blank=True, verbose_name="Cód. Conta de Luz")
    codigo_estabelecimento_saude = models.CharField(max_length=50, null=True, blank=True, verbose_name="Cód. Posto Saúde")
    nome_estabelecimento_saude = models.CharField(max_length=150, null=True, blank=True, verbose_name="Posto de Saúde de Referência")
    grupos_tradicionais_especificos = models.ForeignKey(TipoGruposTradicionaisEspecificos, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Grupo Tradicional/Específico")
    nivel_vulnerabilidade = models.CharField(max_length=10, choices=VULNERABILIDADE_CHOICES, null=True, blank=True, verbose_name="Nível de Vulnerabilidade")

    observacoes = models.TextField(null=True, blank=True, verbose_name="Observações")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'familias_domicilios'
        verbose_name = "Família e Domicílio"
        verbose_name_plural = "Famílias e Domicílios"

    def __str__(self):
        return self.familia_codigo or f"Família {self.id}"

    def save(self, *args, **kwargs):
        # Gera o codigo de familia automaticamente (FAM-1, FAM-2, etc.) na criacao
        super().save(*args, **kwargs)
        if not self.familia_codigo:
            self.familia_codigo = f"FAM-{self.id}"
            super().save(update_fields=['familia_codigo'])
