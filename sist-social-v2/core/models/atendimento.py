from django.db import models
from django.contrib.auth.models import User
from core.models.pessoa import Pessoa
from core.models.unidade import Unidade
from core.models.tabela_basica import TiposAtendimentos

class Atendimento(models.Model):
    TIPO_CHOICES = [
        ('Simples', 'Simples'),
        ('Tecnico', 'Técnico'),
    ]

    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES, default='Simples', verbose_name="Tipo de Atendimento")
    data_atendimento = models.DateField(verbose_name="Data do Atendimento")
    descricao_atendimento = models.TextField(verbose_name="Descrição/Relato do Atendimento")
    
    # Relações
    pessoa = models.ForeignKey(Pessoa, on_delete=models.CASCADE, related_name='atendimentos', verbose_name="Pessoa Atendida")
    unidade = models.ForeignKey(Unidade, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos', verbose_name="Unidade")
    tecnico = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos_realizados', verbose_name="Técnico/Responsável")
    
    # Classificação e apoio (usado especialmente no técnico ou detalhamento)
    tipo_atendimento = models.ForeignKey(TiposAtendimentos, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tipo de Atendimento (Tabela Básica)")
    procedimentos_realizados = models.TextField(null=True, blank=True, verbose_name="Procedimentos Realizados")
    providencias_encaminhamentos = models.TextField(null=True, blank=True, verbose_name="Providências e Encaminhamentos")

    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'atendimentos'
        verbose_name = "Atendimento"
        verbose_name_plural = "Atendimentos"

        permissions = [
            ("visualizar_atendimento_tecnico", "Can visualizar atendimentos técnicos detalhados"),
        ]

    def __str__(self):
        return f"Atendimento {self.tipo} - {self.pessoa.nome} em {self.data_atendimento}"
