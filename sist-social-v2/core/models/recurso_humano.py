from django.db import models
from django.contrib.auth.models import User

class RecursoHumano(models.Model):
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recurso_humano')

    # --- DADOS PESSOAIS ---
    data_nascimento = models.DateField(null=True, blank=True, verbose_name="Data de Nascimento")
    sexo = models.CharField(max_length=1, choices=[('M', 'Masculino'), ('F', 'Feminino')], default='M', verbose_name="Sexo")
    rg = models.CharField(max_length=20, blank=True, null=True, verbose_name="RG")
    data_emissao_rg = models.DateField(null=True, blank=True, verbose_name="Data de Emissão RG")
    orgao_expedidor = models.CharField(max_length=20, blank=True, null=True, verbose_name="Órgão Expedidor")
    cpf = models.CharField(max_length=14, unique=True, verbose_name="CPF")
    titulo_eleitor = models.CharField(max_length=20, blank=True, null=True, verbose_name="Título de Eleitor")
    telefone = models.CharField(max_length=15, blank=True, null=True, verbose_name="Telefone")
    celular = models.CharField(max_length=15, blank=True, null=True, verbose_name="Celular")
    escolaridade = models.ForeignKey('TipoEscolaridade', on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Escolaridade")

    # --- ENDEREÇO ---
    cep = models.CharField(max_length=9, verbose_name="CEP")
    tipo_logradouro = models.CharField(max_length=20, blank=True, null=True, verbose_name="Tipo de Logradouro")
    logradouro = models.CharField(max_length=150, blank=True, null=True, verbose_name="Logradouro")
    numero = models.CharField(max_length=10, blank=True, null=True, verbose_name="Número")
    complemento = models.CharField(max_length=100, blank=True, null=True, verbose_name="Complemento")
    bairro = models.CharField(max_length=100, blank=True, null=True, verbose_name="Bairro")
    municipio = models.CharField(max_length=100, blank=True, null=True, verbose_name="Município")
    uf = models.CharField(max_length=2, blank=True, null=True, verbose_name="UF")

    # --- DADOS PROFISSIONAIS ---
    unidade_socioassistencial = models.BooleanField(default=False, verbose_name="Unidade Socioassistencial?")
    unidades = models.ManyToManyField('Unidade', blank=True, related_name='profissionais', verbose_name="Unidades")
    responsavel_orgao = models.BooleanField(default=False, verbose_name="Responsável pela Unidade?")
    tipo_servidor = models.CharField(max_length=50, blank=True, null=True, verbose_name="Tipo de Servidor")
    profissao = models.CharField(max_length=100, blank=True, null=True, verbose_name="Profissão")
    funcao = models.CharField(max_length=100, blank=True, null=True, verbose_name="Função")
    num_conselho_classe = models.CharField(max_length=30, blank=True, null=True, verbose_name="Nº Conselho Classe")
    data_inicio_trabalho = models.DateField(null=True, blank=True, verbose_name="Data de Início do Trabalho")
    data_fim_trabalho = models.DateField(null=True, blank=True, verbose_name="Data de Fim do Trabalho")

    class Meta:
        verbose_name = "Recurso Humano"
        verbose_name_plural = "Recursos Humanos"

    def __str__(self):
        return f"Perfil: {self.usuario.username} - {self.cpf}"
