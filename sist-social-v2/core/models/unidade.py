from django.db import models
from core.models.tabela_basica import TipoUnidade

class Area(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    descricao = models.CharField(max_length=255, verbose_name="Descrição")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'areas'
        verbose_name = "Área"
        verbose_name_plural = "Áreas"

    def __str__(self):
        return self.nome

class Unidade(models.Model):
    IMOVIL_SITUACAO_CHOICES = [
        ('Nenhum', 'Nenhum'),
        ('Próprio', 'Próprio'),
        ('Alugado', 'Alugado'),
        ('Cedido', 'Cedido')
    ]
    NATUREZA_CHOICES = [
        ('Público', 'Público'),
        ('Privado', 'Privado')
    ]

    tipo_unidade = models.ForeignKey(TipoUnidade, on_delete=models.SET_NULL, null=True, blank=True, related_name='unidades', verbose_name="Tipo de Unidade")
    codigo = models.IntegerField(null=True, blank=True, verbose_name="Código")
    cnpj = models.CharField(max_length=20, null=True, blank=True, verbose_name="CNPJ")
    razao_social = models.CharField(max_length=255, verbose_name="Razão Social")
    nome_conhecido = models.CharField(max_length=255, verbose_name="Nome Conhecido")
    cep = models.CharField(max_length=9, verbose_name="CEP")
    logradouro = models.CharField(max_length=255, verbose_name="Logradouro")
    logradouro_tipo = models.CharField(max_length=50, null=True, blank=True, verbose_name="Tipo de Logradouro")
    logradouro_numero = models.CharField(max_length=20, verbose_name="Número")
    logradouro_complemento = models.CharField(max_length=150, null=True, blank=True, verbose_name="Complemento")
    municipio = models.CharField(max_length=150, null=True, blank=True, verbose_name="Município")
    uf = models.CharField(max_length=2, null=True, blank=True, verbose_name="UF")
    latitude = models.CharField(max_length=50, blank=True, null=True, verbose_name="Latitude")
    longitude = models.CharField(max_length=50, blank=True, null=True, verbose_name="Longitude")
    icone_mapa = models.CharField(max_length=100, null=True, blank=True, verbose_name="Ícone do Mapa")
    email = models.EmailField(null=True, blank=True, verbose_name="E-mail")
    telefone = models.CharField(max_length=20, null=True, blank=True, verbose_name="Telefone 1")
    telefone2 = models.CharField(max_length=20, null=True, blank=True, verbose_name="Telefone 2")
    imovel_situacao = models.CharField(max_length=20, choices=IMOVIL_SITUACAO_CHOICES, default='Nenhum', verbose_name="Situação do Imóvel")
    imovel_social = models.BooleanField(default=False, verbose_name="Imóvel Social?")
    observacoes = models.TextField(null=True, blank=True, verbose_name="Observações")
    data_implantacao = models.CharField(max_length=50, blank=True, null=True, verbose_name="Data de Implantação")
    dias_funcionamento = models.JSONField(null=True, blank=True, verbose_name="Dias de Funcionamento")
    area_atuacao = models.ForeignKey(Area, on_delete=models.SET_NULL, null=True, blank=True, related_name='unidades', verbose_name="Área de Atuação")
    area_geo_atuacao = models.CharField(max_length=255, null=True, blank=True, verbose_name="Área Geográfica de Atuação")
    area_geo_polig = models.TextField(null=True, blank=True, verbose_name="Polígono Geográfico")
    recursos_disponiveis = models.CharField(max_length=255, null=True, blank=True, verbose_name="Recursos Disponíveis")
    sigla = models.CharField(max_length=50, verbose_name="Sigla")
    natureza = models.CharField(max_length=20, choices=NATUREZA_CHOICES, default='Público', verbose_name="Natureza")
    horario_inicio = models.CharField(max_length=5, null=True, blank=True, verbose_name="Horário de Início")
    horario_fim = models.CharField(max_length=5, null=True, blank=True, verbose_name="Horário de Fim")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'unidades'
        verbose_name = "Unidade"
        verbose_name_plural = "Unidades"

    def __str__(self):
        return f"{self.nome_conhecido} ({self.sigla})"
