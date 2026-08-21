from django.db import models
from django.contrib.auth.models import User
from core.models.pessoa import Pessoa
from core.models.familia import FamiliaDomicilio
from core.models.unidade import Unidade
from core.models.tabela_basica import TiposAtendimentos, MotivoAtendimento

class AtendimentoSocial(models.Model):
    MODALIDADE_CHOICES = [
        ('Simplificado', 'Simplificado'),
        ('Tecnico', 'Técnico'),
        ('Encaminhamento Interno', 'Encaminhamento Interno'),
        ('Referencia', 'Referência'),
        ('ContraReferencia', 'Contra-Referência'),
    ]
    
    STATUS_CHOICES = [
        ('Aberto', 'Aberto'),
        ('Finalizado', 'Finalizado'),
        ('Encaminhado', 'Encaminhado'),
        ('Esperando para ser aberto', 'Esperando para ser aberto'),
        ('Encaminhamento Tecnico', 'Encaminhamento Técnico'),
        ('Encaminhamento Interno', 'Encaminhamento Interno'),
    ]

    # Identificadores de controle e código legível
    codigo_atendimento = models.CharField(max_length=50, null=True, blank=True, verbose_name="Código do Atendimento")
    
    # Auto-relacionamento para encadeamento
    origem_atendimento = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos_derivados', verbose_name="Origem do Atendimento")
    
    # Modalidade e Status
    modalidade = models.CharField(max_length=30, choices=MODALIDADE_CHOICES, default='Simplificado', verbose_name="Modalidade de Atendimento")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Aberto', verbose_name="Status do Atendimento")

    # Relacionamentos de Entidades Principais
    pessoa = models.ForeignKey(Pessoa, on_delete=models.CASCADE, related_name='atendimentos_sociais', verbose_name="Pessoa Atendida")
    familia = models.ForeignKey(FamiliaDomicilio, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos_sociais', verbose_name="Família")
    prontuario = models.CharField(max_length=50, null=True, blank=True, verbose_name="Código do Prontuário")
    unidade_atendimento_social = models.ForeignKey(Unidade, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos_sociais', verbose_name="Unidade de Atendimento")

    # Informações Temporais
    data_atendimento = models.DateField(verbose_name="Data do Atendimento")
    data_anotacao = models.DateTimeField(auto_now_add=True, verbose_name="Data de Anotação no Sistema")

    # Motivos e Classificações
    motivo_atendimento = models.ForeignKey(MotivoAtendimento, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos_por_motivo', verbose_name="Forma de Acesso/Motivo do Atendimento")
    tipo_atendimento = models.ForeignKey(TiposAtendimentos, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos_por_tipo', verbose_name="Tipo do Atendimento")

    # Técnico Responsável Atendimento Inicial (Simples)
    tecnico_responsavel_inicial = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos_iniciais_responsavel', verbose_name="Técnico Responsável Inicial")
    funcao_tecnico_responsavel_inicial = models.CharField(max_length=150, null=True, blank=True, verbose_name="Função do Técnico Responsável Inicial")
    descricao_sumaria_atendimento = models.TextField(verbose_name="Descrição Sumária / Observações do Atendimento Inicial")

    # Técnico Responsável Atendimento Técnico (Acompanhamento)
    tecnico_responsavel_tecnico = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='atendimentos_tecnicos_responsavel', verbose_name="Técnico Responsável do Atendimento Técnico")
    funcao_tecnico_responsavel_tecnico = models.CharField(max_length=150, null=True, blank=True, verbose_name="Função do Técnico Responsável Técnico")
    descricao_atendimento_tecnico = models.TextField(null=True, blank=True, verbose_name="Descrição do Atendimento Técnico")

    # Outros Campos de Informação Geral
    informacoes = models.TextField(null=True, blank=True, verbose_name="Informações Adicionais")
    observacoes = models.TextField(null=True, blank=True, verbose_name="Observações Gerais")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'atendimentos_sociais'
        verbose_name = "Atendimento Social"
        verbose_name_plural = "Atendimentos Sociais"
        permissions = [
            ("visualizar_atendimento_tecnico", "Can visualizar atendimentos técnicos detalhados"),
        ]

    def __str__(self):
        return f"Atendimento {self.modalidade} {self.codigo_atendimento or self.id} - {self.pessoa.nome} em {self.data_atendimento}"

    def save(self, *args, **kwargs):
        # Auto-gera codigo_atendimento na criação
        super().save(*args, **kwargs)
        if not self.codigo_atendimento:
            self.codigo_atendimento = f"ATE_{self.id}"
            super().save(update_fields=['codigo_atendimento'])
