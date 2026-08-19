from django.db import models

class Estado(models.Model):
    cod_ibge = models.IntegerField(unique=True, verbose_name="Código IBGE")
    sigla = models.CharField(max_length=2, unique=True, verbose_name="Sigla")
    nome = models.CharField(max_length=100, unique=True, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'estado'
        verbose_name = "Estado"
        verbose_name_plural = "Estados"

    def __str__(self):
        return f"{self.nome} ({self.sigla})"

class Municipio(models.Model):
    codigo_uf = models.IntegerField(verbose_name="Código UF")
    codigo_ibge = models.CharField(max_length=20, verbose_name="Código IBGE")
    municipio = models.CharField(max_length=255, verbose_name="Município")

    class Meta:
        db_table = 'municipio'
        verbose_name = "Município"
        verbose_name_plural = "Municípios"

    def __str__(self):
        return self.municipio

class Cid(models.Model):
    codigo = models.CharField(max_length=20, verbose_name="Código")
    descricao = models.CharField(max_length=255, verbose_name="Descrição")
    codigo_cid = models.CharField(max_length=20, verbose_name="Código CID")

    class Meta:
        db_table = 'cid'
        verbose_name = "CID"
        verbose_name_plural = "CIDs"

    def __str__(self):
        return f"{self.codigo} - {self.descricao}"

class Cbo(models.Model):
    codigo = models.IntegerField(verbose_name="Código")
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'classificacao_brasileira_de_ocupacao'
        verbose_name = "CBO"
        verbose_name_plural = "CBOs"

    def __str__(self):
        return f"{self.codigo} - {self.nome}"

class TipoUnidade(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_unidade'
        verbose_name = "TipoUnidade"
        verbose_name_plural = "TipoUnidades"
        
    def __str__(self):
        return self.nome


class TipoServidor(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_servidor'
        verbose_name = "TipoServidor"
        verbose_name_plural = "TipoServidors"
        
    def __str__(self):
        return self.nome


class TipoProfissao(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_profissao'
        verbose_name = "TipoProfissao"
        verbose_name_plural = "TipoProfissaos"
        
    def __str__(self):
        return self.nome


class TipoEscolaridade(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_escolaridade'
        verbose_name = "TipoEscolaridade"
        verbose_name_plural = "TipoEscolaridades"
        
    def __str__(self):
        return self.nome


class TipoAreaSegmento(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_area_segmento'
        verbose_name = "TipoAreaSegmento"
        verbose_name_plural = "TipoAreaSegmentos"
        
    def __str__(self):
        return self.nome


class TipoOrgaoRecurso(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_orgao_recurso'
        verbose_name = "TipoOrgaoRecurso"
        verbose_name_plural = "TipoOrgaoRecursos"
        
    def __str__(self):
        return self.nome


class TipoFuncao(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_funcao'
        verbose_name = "TipoFuncao"
        verbose_name_plural = "TipoFuncaos"
        
    def __str__(self):
        return self.nome


class TipoLocalNascimento(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_local_nascimento'
        verbose_name = "TipoLocalNascimento"
        verbose_name_plural = "TipoLocalNascimentos"
        
    def __str__(self):
        return self.nome






class Raca(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'raca'
        verbose_name = "Raca"
        verbose_name_plural = "Racas"
        
    def __str__(self):
        return self.nome


class TipoParentesco(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_parentesco'
        verbose_name = "TipoParentesco"
        verbose_name_plural = "TipoParentescos"
        
    def __str__(self):
        return self.nome


class TipoCurso(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_curso'
        verbose_name = "TipoCurso"
        verbose_name_plural = "TipoCursos"
        
    def __str__(self):
        return self.nome


class TipoQualificacaoProfissional(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_qualificacao_profissional'
        verbose_name = "TipoQualificacaoProfissional"
        verbose_name_plural = "TipoQualificacaoProfissionals"
        
    def __str__(self):
        return self.nome


class TipoSerieCurso(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_serie_curso'
        verbose_name = "TipoSerieCurso"
        verbose_name_plural = "TipoSerieCursos"
        
    def __str__(self):
        return self.nome


class TipoAtividade(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_atividade'
        verbose_name = "TipoAtividade"
        verbose_name_plural = "TipoAtividades"
        
    def __str__(self):
        return self.nome


class TipoEstadoCivil(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_estado_civil'
        verbose_name = "TipoEstadoCivil"
        verbose_name_plural = "TipoEstadoCivils"
        
    def __str__(self):
        return self.nome


class TipoRegistroCivil(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_registro_civil'
        verbose_name = "TipoRegistroCivil"
        verbose_name_plural = "TipoRegistroCivils"
        
    def __str__(self):
        return self.nome


class TipoNecessitaCuidado(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_necessita_cuidado'
        verbose_name = "TipoNecessitaCuidado"
        verbose_name_plural = "TipoNecessitaCuidados"
        
    def __str__(self):
        return self.nome


class TipoBeneficio(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_beneficio'
        verbose_name = "TipoBeneficio"
        verbose_name_plural = "TipoBeneficios"
        
    def __str__(self):
        return self.nome


class OrientacaoSexual(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'orientacao_sexual'
        verbose_name = "OrientacaoSexual"
        verbose_name_plural = "OrientacaoSexuals"
        
    def __str__(self):
        return self.nome


class TipoTratamentoCaps(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_tratamento_caps'
        verbose_name = "TipoTratamentoCaps"
        verbose_name_plural = "TipoTratamentoCapss"
        
    def __str__(self):
        return self.nome


class TipoDeficiencia(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_deficiencia'
        verbose_name = "TipoDeficiencia"
        verbose_name_plural = "TipoDeficiencias"
        
    def __str__(self):
        return self.nome






class TipoOrigemCadastro(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_origem_cadastro'
        verbose_name = "TipoOrigemCadastro"
        verbose_name_plural = "TipoOrigemCadastros"
        
    def __str__(self):
        return self.nome


class TipoUnidadeAtendimentoFamilia(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_unidade_atendimento_familia'
        verbose_name = "TipoUnidadeAtendimentoFamilia"
        verbose_name_plural = "TipoUnidadeAtendimentoFamilias"
        
    def __str__(self):
        return self.nome


class TipoEspecieDomicilio(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_especie_domicilio'
        verbose_name = "TipoEspecieDomicilio"
        verbose_name_plural = "TipoEspecieDomicilios"
        
    def __str__(self):
        return self.nome


class TipoResidencia(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_residencia'
        verbose_name = "TipoResidencia"
        verbose_name_plural = "TipoResidencias"
        
    def __str__(self):
        return self.nome


class TipoPisoDomicilio(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_piso_domicilio'
        verbose_name = "TipoPisoDomicilio"
        verbose_name_plural = "TipoPisoDomicilios"
        
    def __str__(self):
        return self.nome


class TipoConstrucaoDomicilio(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_construcao_domicilio'
        verbose_name = "TipoConstrucaoDomicilio"
        verbose_name_plural = "TipoConstrucaoDomicilios"
        
    def __str__(self):
        return self.nome


class TipoIluminacaoDomicilio(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_iluminacao_domicilio'
        verbose_name = "TipoIluminacaoDomicilio"
        verbose_name_plural = "TipoIluminacaoDomicilios"
        
    def __str__(self):
        return self.nome


class TipoAbastecimentoAgua(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_abastecimento_agua'
        verbose_name = "TipoAbastecimentoAgua"
        verbose_name_plural = "TipoAbastecimentoAguas"
        
    def __str__(self):
        return self.nome


class TipoEscoamentoSanitario(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_escoamento_sanitario'
        verbose_name = "TipoEscoamentoSanitario"
        verbose_name_plural = "TipoEscoamentoSanitarios"
        
    def __str__(self):
        return self.nome


class TipoColetaLixo(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_coleta_lixo'
        verbose_name = "TipoColetaLixo"
        verbose_name_plural = "TipoColetaLixos"
        
    def __str__(self):
        return self.nome


class TipoAcessibilidadeDomicilio(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_acessibilidade_domicilio'
        verbose_name = "TipoAcessibilidadeDomicilio"
        verbose_name_plural = "TipoAcessibilidadeDomicilios"
        
    def __str__(self):
        return self.nome


class TipoGruposTradicionaisEspecificos(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_grupos_tradicionais_especificos'
        verbose_name = "TipoGruposTradicionaisEspecificos"
        verbose_name_plural = "TipoGruposTradicionaisEspecificoss"
        
    def __str__(self):
        return self.nome


class Religioes(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'religioes'
        verbose_name = "Religioes"
        verbose_name_plural = "Religioess"
        
    def __str__(self):
        return self.nome


class Potencialidades(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'potencialidades'
        verbose_name = "Potencialidades"
        verbose_name_plural = "Potencialidadess"
        
    def __str__(self):
        return self.nome


class VulnerabilidadeSocial(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'vulnerabilidade_social'
        verbose_name = "VulnerabilidadeSocial"
        verbose_name_plural = "VulnerabilidadeSocials"
        
    def __str__(self):
        return self.nome


class Feriado(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'feriado'
        verbose_name = "Feriado"
        verbose_name_plural = "Feriados"
        
    def __str__(self):
        return self.nome


class TiposAtendimentos(models.Model):
    MODALIDADE_CHOICES = [
        ('Simplificado', 'Simplificado'),
        ('Tecnico', 'Técnico'),
        ('Ambos', 'Ambos'),
    ]
    nome = models.CharField(max_length=255, verbose_name="Nome")
    modalidade = models.CharField(max_length=15, choices=MODALIDADE_CHOICES, default='Ambos', verbose_name="Modalidade de Filtro")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_atendimentos'
        verbose_name = "TiposAtendimentos"
        verbose_name_plural = "TiposAtendimentoss"
        
    def __str__(self):
        return self.nome


class MotivoAtendimento(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'motivo_atendimento'
        verbose_name = "MotivoAtendimento"
        verbose_name_plural = "MotivosAtendimentos"
        
    def __str__(self):
        return self.nome


class TipoServicoProtecao(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_servico_protecao'
        verbose_name = "TipoServicoProtecao"
        verbose_name_plural = "TipoServicoProtecaos"
        
    def __str__(self):
        return self.nome


class FaixaEtaria(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'faixa_etaria'
        verbose_name = "FaixaEtaria"
        verbose_name_plural = "FaixaEtarias"
        
    def __str__(self):
        return self.nome


class TipoSituacaoViolenciaEViolacaoDireitos(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_situacao_violencia_e_violacao_direitos'
        verbose_name = "TipoSituacaoViolenciaEViolacaoDireitos"
        verbose_name_plural = "TipoSituacaoViolenciaEViolacaoDireitoss"
        
    def __str__(self):
        return self.nome


class TipoMedidaSocioeducativa(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_medida_socioeducativa'
        verbose_name = "TipoMedidaSocioeducativa"
        verbose_name_plural = "TipoMedidaSocioeducativas"
        
    def __str__(self):
        return self.nome


class TipoEncaminhamento(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_encaminhamento'
        verbose_name = "TipoEncaminhamento"
        verbose_name_plural = "TipoEncaminhamentos"
        
    def __str__(self):
        return self.nome


class TipoServicoProgramaProjeto(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_servico_programa_projeto'
        verbose_name = "TipoServicoProgramaProjeto"
        verbose_name_plural = "TipoServicoProgramaProjetos"
        
    def __str__(self):
        return self.nome


class TiposAnimais(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_animais'
        verbose_name = "TiposAnimais"
        verbose_name_plural = "TiposAnimaiss"
        
    def __str__(self):
        return self.nome


class TiposServicosSociais(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_servicos_sociais'
        verbose_name = "TiposServicosSociais"
        verbose_name_plural = "TiposServicosSociaiss"
        
    def __str__(self):
        return self.nome


class TiposContatosParentes(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_contatos_parentes'
        verbose_name = "TiposContatosParentes"
        verbose_name_plural = "TiposContatosParentess"
        
    def __str__(self):
        return self.nome


class TiposTemposResidenciasCidadesPopulacoesRuas(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_tempos_residencias_cidades_populacoes_ruas'
        verbose_name = "TiposTemposResidenciasCidadesPopulacoesRuas"
        verbose_name_plural = "TiposTemposResidenciasCidadesPopulacoesRuass"
        
    def __str__(self):
        return self.nome


class TiposOrgaos(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_orgaos'
        verbose_name = "TiposOrgaos"
        verbose_name_plural = "TiposOrgaoss"
        
    def __str__(self):
        return self.nome


class TiposRecursos(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_recursos'
        verbose_name = "TiposRecursos"
        verbose_name_plural = "TiposRecursoss"
        
    def __str__(self):
        return self.nome


class TiposPeriodos(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_periodos'
        verbose_name = "TiposPeriodos"
        verbose_name_plural = "TiposPeriodoss"
        
    def __str__(self):
        return self.nome


class TipoLocaisRealizacoesServicos(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_locais_realizacoes_servicos'
        verbose_name = "TipoLocaisRealizacoesServicos"
        verbose_name_plural = "TipoLocaisRealizacoesServicoss"
        
    def __str__(self):
        return self.nome


class TiposEfeitosDescumprimentosCondicionalidades(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_efeitos_descumprimentos_condicionalidades'
        verbose_name = "TiposEfeitosDescumprimentosCondicionalidades"
        verbose_name_plural = "TiposEfeitosDescumprimentosCondicionalidadess"
        
    def __str__(self):
        return self.nome


class TipoAtividadeGrupos(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipo_atividade_grupos'
        verbose_name = "TipoAtividadeGrupos"
        verbose_name_plural = "TipoAtividadeGruposs"
        
    def __str__(self):
        return self.nome


class TiposRelacoesConvivenciasFamiliares(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")
    
    class Meta:
        db_table = 'tipos_relacoes_convivencias_familiares'
        verbose_name = "TiposRelacoesConvivenciasFamiliares"
        verbose_name_plural = "TiposRelacoesConvivenciasFamiliaress"
        
    def __str__(self):
        return self.nome


class PopulacoesRuasTempoDeRua(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'populacoes_ruas_tempo_de_rua'
        verbose_name = "Tempo de Rua"
        verbose_name_plural = "Tempos de Rua"

    def __str__(self):
        return self.nome


class Pais(models.Model):
    nome = models.CharField(max_length=255, verbose_name="Nome")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        db_table = 'pais'
        verbose_name = "País"
        verbose_name_plural = "Países"

    def __str__(self):
        return self.nome
