from django.db import models
from django.contrib.auth.models import User
from core.models.tabela_basica import TipoBeneficio
from core.models.pessoa import Pessoa
from core.models.familia import FamiliaDomicilio
from core.models.unidade import Unidade

class Beneficio(models.Model):
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Entregue', 'Entregue'),
        ('Cancelado', 'Cancelado'),
    ]

    tipo_beneficio = models.ForeignKey(TipoBeneficio, on_delete=models.CASCADE, verbose_name="Tipo de Benefício")
    pessoa = models.ForeignKey(Pessoa, on_delete=models.SET_NULL, null=True, blank=True, related_name='beneficios', verbose_name="Pessoa Beneficiária")
    data_beneficio = models.DateField(verbose_name="Data do Benefício")
    unidade = models.ForeignKey(Unidade, on_delete=models.SET_NULL, null=True, blank=True, related_name='beneficios_concedidos', verbose_name="Unidade Concessora")
    observacao = models.TextField(null=True, blank=True, verbose_name="Observações")
    valor_beneficio = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, verbose_name="Valor do Benefício")
    familia = models.ForeignKey(FamiliaDomicilio, on_delete=models.CASCADE, related_name='beneficios', verbose_name="Família Beneficiária")
    
    # Campo provisório para Prontuário até a tabela específica ser criada
    prontuario_id = models.IntegerField(null=True, blank=True, verbose_name="ID do Prontuário")
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente', verbose_name="Status")
    profissional = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='beneficios_cadastrados', verbose_name="Profissional Responsável")
    profissional_funcao = models.CharField(max_length=150, null=True, blank=True, verbose_name="Função do Profissional")
    
    # Inatividade
    data_inatividade = models.DateField(null=True, blank=True, verbose_name="Data de Inatividade")
    motivo = models.TextField(null=True, blank=True, verbose_name="Motivo Inatividade")
    
    # Entrega
    data_entrega = models.DateField(null=True, blank=True, verbose_name="Data da Entrega")
    tecnico_entrega = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='beneficios_entregues', verbose_name="Técnico da Entrega")
    
    # Alteração e status ativo
    data_alteracao = models.DateTimeField(auto_now=True, verbose_name="Última Alteração")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'beneficios'
        verbose_name = "Benefício"
        verbose_name_plural = "Benefícios"

    def __str__(self):
        return f"{self.tipo_beneficio.nome} - Família {self.familia.id} ({self.status})"
