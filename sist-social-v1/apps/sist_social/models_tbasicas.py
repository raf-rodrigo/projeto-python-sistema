from django.db import models

class TipoTrabalho(models.Model):
    id = models.AutoField(primary_key=True)
    funcao = models.CharField(max_length=60, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_trabalho'

    def __str__(self):
        return self.funcao or f"Tipo Trabalho {self.id}"


class TipoSerieCurso(models.Model):
    id = models.AutoField(primary_key=True)
    serie = models.CharField(max_length=30, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_serie_curso'

    def __str__(self):
        return self.serie or f"Série Curso {self.id}"


class TipoFrequenciaEscolar(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_frequencia_escola'

    def __str__(self):
        return self.tipo or f"Frequência {self.id}"


class TipoCursoFrequentou(models.Model):
    id = models.AutoField(primary_key=True)
    curso = models.CharField(max_length=100, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_curso_fez'

    def __str__(self):
        return self.curso or f"Curso Frequentou {self.id}"


class TipoCursoAtual(models.Model):
    id = models.AutoField(primary_key=True)
    curso = models.CharField(max_length=70, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_curso_atual'

    def __str__(self):
        return self.curso or f"Curso Atual {self.id}"


class TipoCID(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=255)
    descricao = models.TextField()
    codigo_cid_dez = models.CharField(max_length=255)
    ativo = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cid'

    def __str__(self):
        return f"{self.codigo} - {self.descricao}"


class TipoAnimal(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=255)
    ativo = models.CharField(max_length=100)
    status = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_animal'

    def __str__(self):
        return self.tipo or f"Tipo Animal {self.id}"


class PrioridadeSCFV(models.Model):
    id = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_prioridade_scfv'

    def __str__(self):
        return self.descricao or f"Prioridade SCFV {self.id}"


class MotivoDesligamento(models.Model):
    id = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    ativo = models.IntegerField(default=1)
    grupo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'motivo_desligamento'

    def __str__(self):
        return self.descricao or f"Motivo Desligamento {self.id}"


class TipoRecurso(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_recurso'

    def __str__(self):
        return self.nome or f"Tipo Recurso {self.id}"


class Feriados(models.Model):
    id = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    ano = models.CharField(max_length=4)
    data_ocorrencia = models.DateField()
    tipo = models.CharField(max_length=10)
    ativo = models.IntegerField(default=1)
    status = models.CharField(max_length=10, default='ativo')

    class Meta:
        managed = False
        db_table = 'feriados'

    def __str__(self):
        return f"{self.data_ocorrencia}: {self.descricao}"


class VulnerabilidadeSocial(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=10, blank=True, null=True)
    nivel_severidade = models.CharField(max_length=10, blank=True, null=True)
    prioridade_atendimento = models.CharField(max_length=10, blank=True, null=True)
    ativo = models.IntegerField(default=1)
    status = models.CharField(max_length=10, default='ativo')

    class Meta:
        managed = False
        db_table = 'vulnerabilidades_sociais'

    def __str__(self):
        return self.nome or f"Vulnerabilidade {self.id}"


class Religioes(models.Model):
    id = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    ativo = models.IntegerField(default=1)
    status = models.CharField(max_length=10, default='ativo')

    class Meta:
        managed = False
        db_table = 'religioes'

    def __str__(self):
        return self.descricao or f"Religião {self.id}"


class Bairros(models.Model):
    id = models.AutoField(primary_key=True)
    nome_oficial = models.CharField(max_length=60, blank=True, null=True)
    nome_correios = models.CharField(max_length=60, blank=True, null=True)
    area_geo = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)
    cep = models.CharField(max_length=8, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'bairros'

    def __str__(self):
        return self.nome_oficial or self.nome_correios or f"Bairro {self.id}"


class Areas(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'areas'

    def __str__(self):
        return self.name or f"Área {self.id}"


class MicroAreas(models.Model):
    id = models.AutoField(primary_key=True)
    area_id = models.IntegerField()
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'microareas'

    def __str__(self):
        return self.name or f"MicroÁrea {self.id}"


class Potencialidades(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=255)
    descricao = models.TextField(blank=True, null=True)
    categoria = models.CharField(max_length=100, blank=True, null=True)
    nivel_desenvolvimento = models.CharField(max_length=20, blank=True, null=True)
    prioridade_investimento = models.CharField(max_length=20, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'potencialidades'

    def __str__(self):
        return self.nome or f"Potencialidade {self.id}"


class AtosInfracionais(models.Model):
    id = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    artigo_infringido = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=10, default='ativo')
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'atos_infracionais'

    def __str__(self):
        return self.descricao or f"Ato Infracional {self.id}"


class MotivoAtendimento(models.Model):
    id = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=255)
    status = models.CharField(max_length=10, default='ativo')
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'motivo_atendimento'

    def __str__(self):
        return self.descricao or f"Motivo Atendimento {self.id}"


class TipoMedidaSocioeducativa(models.Model):
    id = models.AutoField(primary_key=True)
    medida = models.CharField(max_length=60, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_medida_socioeduc'

    def __str__(self):
        return self.medida or f"Medida Socioeducativa {self.id}"


class TipoDeficiencia(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_deficiencia'

    def __str__(self):
        return self.tipo or f"Deficiência {self.id}"


class TipoCbo(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=6, blank=True, null=True)
    ocupacao = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_cbo'

    def __str__(self):
        return f"{self.codigo} - {self.ocupacao}"


class TipoContatoParente(models.Model):
    id = models.AutoField(primary_key=True)
    contato = models.CharField(max_length=40)
    field1 = models.CharField(max_length=40, blank=True, null=True)
    field2 = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_contato_parente'

    def __str__(self):
        return self.contato or f"Contato Parente {self.id}"


class TipoEscolaridadePront(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=2, blank=True, null=True)
    escolaridade = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_escolaridade_pront'

    def __str__(self):
        return self.escolaridade or f"Escolaridade {self.id}"


class TipoTempoRua(models.Model):
    id = models.AutoField(primary_key=True)
    tempo_vive_rua = models.CharField(max_length=40, blank=True, null=True)
    field1 = models.CharField(max_length=40, blank=True, null=True)
    field2 = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_tempo_rua'

    def __str__(self):
        return self.tempo_vive_rua or f"Tempo Rua {self.id}"


class TipoOrigemCad(models.Model):
    id = models.AutoField(primary_key=True)
    origem = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_origem_cad'

    def __str__(self):
        return self.origem or f"Origem Cadastro {self.id}"


class PublicoAlvo(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=200, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'publico_alvo'

    def __str__(self):
        return self.nome or f"Público Alvo {self.id}"


class TipoSitViolencia(models.Model):
    id = models.AutoField(primary_key=True)
    situacao = models.CharField(max_length=80, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_sit_violencia'

    def __str__(self):
        return self.situacao or f"Situação/Violação {self.id}"


class OrigemTipoEncaminhamento(models.Model):
    id = models.AutoField(primary_key=True)
    idchave = models.CharField(max_length=55, blank=True, null=True)
    descricao = models.CharField(max_length=55, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'origem_tipo_encaminhamento'

    def __str__(self):
        return self.descricao or f"Origem Encaminhamento {self.id}"


class SitPrivadoLiberdade(models.Model):
    id = models.AutoField(primary_key=True)
    idchave = models.CharField(max_length=55, blank=True, null=True)
    situacao = models.CharField(max_length=55, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'sit_privado_liberdade'

    def __str__(self):
        return self.situacao or f"Sit Privado Liberdade {self.id}"


class ServicoSocial(models.Model):
    id = models.AutoField(primary_key=True)
    idchave = models.CharField(max_length=55, blank=True, null=True)
    nome = models.CharField(max_length=85, blank=True, null=True)
    descricao = models.TextField(blank=True, null=True)
    tipo_servico_protecao_id = models.IntegerField(blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'servico_social'

    def __str__(self):
        return self.nome or f"Serviço Social {self.id}"


class TipoServicoProtecao(models.Model):
    id = models.AutoField(primary_key=True)
    idchave = models.CharField(max_length=55, blank=True, null=True)
    nome = models.CharField(max_length=55, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_servico_protecao'

    def __str__(self):
        return self.nome or f"Tipo Proteção {self.id}"


class TipoPeriodo(models.Model):
    id = models.AutoField(primary_key=True)
    periodo = models.CharField(max_length=255, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_periodo'

    def __str__(self):
        return self.periodo or f"Tipo Período {self.id}"


class Caps(models.Model):
    id = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=80)
    ativo = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'caps'

    def __str__(self):
        return self.descricao or f"CAPS {self.id}"


class RacaCor(models.Model):
    id = models.AutoField(primary_key=True)
    raca_cor = models.CharField(max_length=15, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'raca_cor'

    def __str__(self):
        return self.raca_cor or f"Raça/Cor {self.id}"


class TipoOcupacao(models.Model):
    id = models.AutoField(primary_key=True)
    ocupacao = models.CharField(max_length=50, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_ocupacao'

    def __str__(self):
        return self.ocupacao or f"Ocupação {self.id}"


class TipoEtnia(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_etnia'

    def __str__(self):
        return self.tipo or f"Etnia {self.id}"


class AbastecimentoAgua(models.Model):
    id = models.AutoField(primary_key=True)
    abastecimento = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_abastec_agua'

    def __str__(self):
        return self.abastecimento or f"Abastecimento {self.id}"


class TipoEfeitoDesc(models.Model):
    id = models.AutoField(primary_key=True)
    efeito = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_efeito_descumpr'

    def __str__(self):
        return self.efeito or f"Efeito Descumprimento {self.id}"


class GruposTradicionaisEspecificos(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=3, blank=True, null=True)
    tipo = models.CharField(max_length=60, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_grupos_fam_mds'

    def __str__(self):
        return self.tipo or f"Grupo {self.id}"


class TipoMaterialPiso(models.Model):
    id = models.AutoField(primary_key=True)
    material = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_mat_piso'

    def __str__(self):
        return self.material or f"Material Piso {self.id}"


class TipoBeneficios(models.Model):
    id = models.AutoField(primary_key=True)
    beneficio = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)
    tipo_unidade_id = models.IntegerField(blank=True, null=True)
    rma_linha = models.CharField(max_length=100, blank=True, null=True)
    categoria = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'tipo_beneficios'

    def __str__(self):
        return self.beneficio or f"Tipo Benefício {self.id}"


class Estados(models.Model):
    id = models.AutoField(primary_key=True)
    cod_ibge = models.CharField(max_length=4, blank=True, null=True)
    sigla = models.CharField(max_length=2, blank=True, null=True)
    nome = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'estados'

    def __str__(self):
        return self.nome or f"Estado {self.id}"


class Municipios(models.Model):
    id = models.AutoField(primary_key=True)
    id_uf = models.IntegerField(blank=True, null=True)
    cod_ibge = models.CharField(max_length=7, blank=True, null=True)
    nome = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'municipios'

    def __str__(self):
        return self.nome or f"Município {self.id}"


class Pais(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=50)
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'pais'

    def __str__(self):
        return self.nome or f"País {self.id}"


class TipoUnidRealizServs(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=2)
    unidade = models.CharField(max_length=60, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_unid_realiz_servs'

    def __str__(self):
        return self.unidade or f"Tipo Unid Realiz Servs {self.id}"


class TipoTempoResideCidade(models.Model):
    id = models.AutoField(primary_key=True)
    tempo_reside = models.CharField(max_length=40)
    field1 = models.CharField(max_length=40, blank=True, null=True)
    field2 = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_tempo_reside_cidade'

    def __str__(self):
        return self.tempo_reside or f"Tempo Reside {self.id}"


class TipoSitViolCreas(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=2, blank=True, null=True)
    situacao = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_sit_viol_creas'

    def __str__(self):
        return self.situacao or f"Sit Viol CREAS {self.id}"


class TipoAreaSeguimento(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=50, blank=True, null=True)
    field1 = models.CharField(max_length=40, blank=True, null=True)
    field2 = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_areas_segmentos'

    def __str__(self):
        return self.nome or f"Tipo Área/Segmento {self.id}"


class TipoLocNasc(models.Model):
    id = models.AutoField(primary_key=True)
    local = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_loc_nasc'

    def __str__(self):
        return self.local or f"Local Nascimento {self.id}"


class TipoRegCivil(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_reg_civil'

    def __str__(self):
        return self.tipo or f"Tipo Registro Civil {self.id}"


class TipoNivelEscolaridade(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=2, blank=True, null=True)
    tipo = models.CharField(max_length=60, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'escolaridade'

    def __str__(self):
        return self.tipo or f"Escolaridade {self.id}"


class FormasAcessoUsuario(models.Model):
    id = models.AutoField(primary_key=True)
    forma = models.CharField(max_length=100, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'forma_acesso'

    def __str__(self):
        return self.forma or f"Forma Acesso {self.id}"


class TipoAcessibilidade(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=100, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_acessibilidade'

    def __str__(self):
        return self.tipo or f"Tipo Acessibilidade {self.id}"


class TipoDestinacaoLixo(models.Model):
    id = models.AutoField(primary_key=True)
    destino = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_dest_lixo'

    def __str__(self):
        return self.destino or f"Destinação Lixo {self.id}"


class TipoEscoamentoSanitario(models.Model):
    id = models.AutoField(primary_key=True)
    escoamento = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_escoa_sanit'

    def __str__(self):
        return self.escoamento or f"Escoamento Sanitário {self.id}"


class TipoEspecieDomicilio(models.Model):
    id = models.AutoField(primary_key=True)
    especie = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_espec_domic'

    def __str__(self):
        return self.especie or f"Espécie Domicílio {self.id}"


class TipoIluminacao(models.Model):
    id = models.AutoField(primary_key=True)
    ilumincao = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_iluminacao'

    def __str__(self):
        return self.ilumincao or f"Iluminação {self.id}"


class TipoMaterialConstrucao(models.Model):
    id = models.AutoField(primary_key=True)
    material = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_mat_construcao'

    def __str__(self):
        return self.material or f"Material Construção {self.id}"


class TipoServsPgms(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=2, blank=True, null=True)
    nome = models.CharField(max_length=100, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_serv_pgm_prj'

    def __str__(self):
        return self.nome or f"Serviço/Programa/Projeto {self.id}"


class TipoServidorPublico(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_servidor'

    def __str__(self):
        return self.tipo or f"Tipo Servidor Público {self.id}"


class TipoFaixaEtaria(models.Model):
    id = models.AutoField(primary_key=True)
    faixa_inicio = models.CharField(max_length=2, blank=True, null=True)
    faixa_final = models.CharField(max_length=2, blank=True, null=True)
    label_faixa = models.CharField(max_length=40, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_faixa_etaria'

    def __str__(self):
        return self.label_faixa or f"Faixa Etária {self.id}"




