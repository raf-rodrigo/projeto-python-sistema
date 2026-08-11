from django.db import models
from .models_tbasicas import *

class TipoUnidades(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=25, blank=True, null=True)
    icone_mapa = models.CharField(max_length=50, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_unidades'

    def __str__(self):
        return self.tipo or f"Tipo Unidade {self.id}"


class UnidadeAtendimentoSocial(models.Model):
    id = models.AutoField(primary_key=True)
    tipo_unidade = models.ForeignKey(TipoUnidades, models.DO_NOTHING, db_column='tipo_unidade_id', blank=True, null=True)
    codigo = models.CharField(max_length=12, blank=True, null=True)
    cnpj = models.CharField(max_length=18, blank=True, null=True)
    razao_social = models.CharField(max_length=70, blank=True, null=True)
    nome_conhecido = models.CharField(max_length=40, blank=True, null=True)
    cep = models.CharField(max_length=9, blank=True, null=True)
    tipo_lograd = models.CharField(max_length=20, blank=True, null=True)
    logradouro = models.CharField(max_length=50, blank=True, null=True)
    lograd_num = models.CharField(max_length=10, blank=True, null=True)
    lograd_compl = models.CharField(max_length=20, blank=True, null=True)
    bairro = models.CharField(max_length=40, blank=True, null=True)
    municipio = models.CharField(max_length=40, blank=True, null=True)
    uf = models.CharField(max_length=2, blank=True, null=True)
    geo_lat = models.FloatField(blank=True, null=True)
    geo_lgt = models.FloatField(blank=True, null=True)
    icone_mapa = models.CharField(max_length=40, blank=True, null=True)
    email = models.CharField(max_length=80, blank=True, null=True)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    situacao_imovel = models.CharField(max_length=10, blank=True, null=True)
    imovel_social = models.CharField(max_length=3, default='Não')
    horario_func = models.CharField(max_length=50, blank=True, null=True)
    observacao = models.TextField(blank=True, null=True)
    dta_implantacao = models.DateField(blank=True, null=True)
    dias_func = models.TextField(blank=True, null=True)
    area_geo_atuacao = models.TextField(blank=True, null=True)
    area_geo_polig = models.TextField(blank=True, null=True)
    recursos_disponiveis = models.TextField(blank=True, null=True)
    telefone2 = models.CharField(max_length=15, blank=True, null=True)
    sigla = models.CharField(max_length=15, blank=True, null=True)
    natureza = models.CharField(max_length=7, default='Pública')
    ativo = models.IntegerField(default=1)
    hora_ini = models.CharField(max_length=10, blank=True, null=True)
    hora_fim = models.CharField(max_length=10, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'unid_atend_social'

    def __str__(self):
        return self.nome_conhecido or self.razao_social or f"Unidade {self.id}"


class RecursosHumanos(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=60, null=True, blank=True)
    apelido = models.CharField(max_length=40, null=True, blank=True)
    email = models.CharField(max_length=60, null=True, blank=True)
    cpf_num = models.CharField(max_length=15, null=True, blank=True)
    sexo = models.CharField(max_length=4)  # Masc ou Fem
    celular = models.CharField(max_length=15, null=True, blank=True)
    unidades = models.CharField(max_length=255, null=True, blank=True)  # IDs separados por vírgula (ex: "1,2,3")
    onde_trab_social = models.PositiveIntegerField(db_column='onde_trab_social', null=True, blank=True) # Unidade principal
    memberID = models.CharField(max_length=60, db_column='memberID', null=True, blank=True) # Nome de usuário vinculado
    ativo = models.IntegerField(default=1)  # 1 = Ativo, 0 = Inativo
    unid_social = models.CharField(max_length=3, default='Não')
    responsavel = models.CharField(max_length=3, default='Não')

    class Meta:
        managed = False
        db_table = 'recursos_humanos'

    def __str__(self):
        return self.nome or self.memberID or f"Recurso Humano {self.id}"


class IdfFamilia(models.Model):
    id = models.AutoField(primary_key=True)
    id_familia = models.PositiveIntegerField()
    data_proces = models.DateField(blank=True, null=True)
    dim1 = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    dim2 = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    dim3 = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    dim4 = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    dim5 = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    dim6 = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    ind_sintetico = models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'idf_familia'

    def __str__(self):
        return f"IDF Familia {self.id_familia} - {self.data_proces}"


class TipoServSocial(models.Model):
    id = models.AutoField(primary_key=True)
    descricao = models.CharField(max_length=130, blank=True, null=True)
    nivel_compl = models.CharField(max_length=30)
    usuarios = models.TextField(blank=True, null=True)
    abrangencia = models.CharField(max_length=30)
    objetivos = models.TextField(blank=True, null=True)
    condicoes = models.TextField(blank=True, null=True)
    formas_acesso = models.TextField(blank=True, null=True)
    ativo = models.IntegerField(default=1)
    sigla = models.CharField(max_length=30, blank=True, null=True)
    tipo_unidade_id = models.IntegerField(blank=True, null=True)
    rma_linha = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_serv_social'

    def __str__(self):
        return self.descricao or f"Tipo Servico {self.id}"


class Servicos(models.Model):
    id = models.AutoField(primary_key=True)
    unidade = models.ForeignKey(UnidadeAtendimentoSocial, models.DO_NOTHING, db_column='unidade', blank=True, null=True)
    tipo_serv = models.ForeignKey(TipoServSocial, models.DO_NOTHING, db_column='tipo_serv', blank=True, null=True)
    prev_atend_mens = models.IntegerField(blank=True, null=True)
    prev_atend_anual = models.IntegerField(blank=True, null=True)
    previsao_orcament = models.FloatField(blank=True, null=True)
    rec_fin_fmas = models.FloatField(blank=True, null=True)
    rec_fin_fmdca = models.FloatField(blank=True, null=True)
    rec_fin_feas = models.FloatField(blank=True, null=True)
    rec_fin_fedca = models.FloatField(blank=True, null=True)
    rec_fin_fnas = models.FloatField(blank=True, null=True)
    rec_fin_fndca = models.FloatField(blank=True, null=True)
    rec_fin_outro = models.FloatField(blank=True, null=True)
    outra_fonte_fin = models.CharField(max_length=100, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'servicos'

    def __str__(self):
        return f"Serviço ID {self.id}"


class TipoOrgaosRecursos(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=40, blank=True, null=True)
    area_atuacao = models.PositiveIntegerField(blank=True, null=True)
    icone_mapa = models.CharField(max_length=50, blank=True, null=True)
    ativo = models.IntegerField(default=1)

    class Meta:
        managed = False
        db_table = 'tipo_orgaos_recursos'

    def __str__(self):
        return self.nome or f"Tipo Orgao/Recurso {self.id}"


class OrgaosRecursos(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=50, blank=True, null=True)
    sigla = models.CharField(max_length=20, blank=True, null=True)
    esfera = models.CharField(max_length=10)
    cnpj = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=60, blank=True, null=True)
    telefone = models.CharField(max_length=15, blank=True, null=True)
    telefone2 = models.CharField(max_length=15, blank=True, null=True)
    cep = models.CharField(max_length=9, blank=True, null=True)
    tipo_lograd = models.CharField(max_length=20, blank=True, null=True)
    logradouro = models.CharField(max_length=50, blank=True, null=True)
    lograd_num = models.CharField(max_length=10, blank=True, null=True)
    lograd_compl = models.CharField(max_length=20, blank=True, null=True)
    bairro = models.CharField(max_length=40, blank=True, null=True)
    municipio = models.CharField(max_length=40, blank=True, null=True)
    uf = models.CharField(max_length=2, blank=True, null=True)
    geo_lat = models.FloatField(blank=True, null=True)
    geo_lgt = models.FloatField(blank=True, null=True)
    icone_mapa = models.CharField(max_length=40, blank=True, null=True)
    tipo_orgao = models.ForeignKey(TipoOrgaosRecursos, models.DO_NOTHING, db_column='tipo_orgao', blank=True, null=True)
    horario_func = models.CharField(max_length=50, blank=True, null=True)
    recursos_disponiveis = models.TextField(blank=True, null=True)
    num_lei_criacao = models.CharField(max_length=40, blank=True, null=True)
    dt_lei_criacao = models.DateField(blank=True, null=True)
    num_lei_atualiz = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(default=1)
    hora_ini = models.CharField(max_length=10, blank=True, null=True)
    hora_fim = models.CharField(max_length=10, blank=True, null=True)
    recursos_humanos = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orgaos_recursos'

    def __str__(self):
        return self.nome or f"Orgao/Recurso {self.id}"


class OrientacaoSexual(models.Model):
    id = models.AutoField(primary_key=True)
    nome = models.CharField(max_length=60, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'orientacao_sexual'

    def __str__(self):
        return self.nome or f"Orientacao Sexual {self.id}"


class TipoEstadoCivil(models.Model):
    id = models.AutoField(primary_key=True)
    estado_civil = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_estado_civil'

    def __str__(self):
        return self.estado_civil or f"Estado Civil {self.id}"


class TipoParentesco(models.Model):
    id = models.AutoField(primary_key=True)
    codigo = models.CharField(max_length=2)
    tipo = models.CharField(max_length=40)

    class Meta:
        managed = False
        db_table = 'tipo_parentesco'

    def __str__(self):
        return self.tipo or f"Parentesco {self.id}"


class TipoResidencia(models.Model):
    id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=40, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'tipo_residencia'

    def __str__(self):
        return self.tipo or f"Tipo Residencia {self.id}"


class FaixaRendaPessoa(models.Model):
    id = models.AutoField(primary_key=True)
    faixa = models.IntegerField(blank=True, null=True)
    descricao = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'faixa_renda_pessoa'

    def __str__(self):
        return self.descricao or f"Faixa Renda Pessoa {self.id}"


class FaixaRendaPercapta(models.Model):
    id = models.AutoField(primary_key=True)
    faixa = models.IntegerField(unique=True)
    valor = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'faixa_renda_percapta'

    def __str__(self):
        return self.valor or f"Faixa Renda Percapta {self.id}"


class FamiliaDomicilio(models.Model):
    id = models.AutoField(primary_key=True)
    cadastro_unid_atend_social_id = models.PositiveIntegerField(blank=True, null=True)
    chv_prefeitura = models.CharField(max_length=13, blank=True, null=True)
    cod_familia = models.CharField(unique=True, max_length=11, blank=True, null=True)
    cod_familia_cad_unico = models.CharField(unique=True, max_length=11, blank=True, null=True)
    dat_cadastr_fam = models.DateField(blank=True, null=True)
    dat_alter_fam = models.DateField(blank=True, null=True)
    cod_est_cadastro = models.CharField(max_length=1, blank=True, null=True)
    ind_cad_valido_fam = models.CharField(max_length=1, blank=True, null=True)
    cod_condic_cad = models.CharField(max_length=1, blank=True, null=True)
    val_renda_media_fam = models.FloatField(blank=True, null=True)
    ind_trab_infantil_fam = models.CharField(max_length=1, blank=True, null=True)
    cod_munic_ibge_2 = models.CharField(max_length=2, blank=True, null=True)
    cod_munic_ibge_5 = models.CharField(max_length=5, blank=True, null=True)
    cod_ibge_distr = models.CharField(max_length=2, blank=True, null=True)
    cod_ibge_subdistr = models.CharField(max_length=2, blank=True, null=True)
    cod_ibge_setor_cens = models.CharField(max_length=4, blank=True, null=True)
    cod_modal_fam = models.CharField(max_length=1, blank=True, null=True)
    cod_forma_coleta = models.CharField(max_length=1, blank=True, null=True)
    dta_entrevista = models.DateField(blank=True, null=True)
    nom_local_fam = models.CharField(max_length=76, blank=True, null=True)
    nom_tip_lograd = models.CharField(max_length=38, blank=True, null=True)
    nom_logradouro = models.CharField(max_length=114, blank=True, null=True)
    num_lograd = models.CharField(max_length=16, blank=True, null=True)
    des_compl_fam = models.CharField(max_length=22, blank=True, null=True)
    des_compl_adic = models.CharField(max_length=75, blank=True, null=True)
    cep_lograd = models.CharField(max_length=8, blank=True, null=True)
    refer_local_fam = models.TextField(blank=True, null=True)
    nom_entrevistador = models.PositiveIntegerField(blank=True, null=True)
    txt_obs_entrevist = models.TextField(blank=True, null=True)
    cod_orig_pref = models.CharField(max_length=13, blank=True, null=True)
    cod_orig_fam = models.CharField(max_length=11, blank=True, null=True)
    dat_lim_atua_cad = models.DateField(blank=True, null=True)
    flag_fam_alt = models.CharField(max_length=1, blank=True, null=True)
    dat_atualiz_fam = models.DateField(blank=True, null=True)
    cod_unid_territ = models.CharField(max_length=10, blank=True, null=True)
    nom_unid_territ = models.CharField(max_length=100, blank=True, null=True)
    cod_loc_fam = models.CharField(max_length=6, blank=True, null=True)
    cod_espec_domic = models.PositiveIntegerField(blank=True, null=True)
    qtd_comodos_domic = models.CharField(max_length=2, blank=True, null=True)
    qtd_comodos_dorm = models.CharField(max_length=2, blank=True, null=True)
    cod_material_piso = models.PositiveIntegerField(blank=True, null=True)
    cod_material_domic = models.PositiveIntegerField(blank=True, null=True)
    cod_agua_canaliz = models.CharField(max_length=3, blank=True, null=True)
    cod_abast_agua = models.PositiveIntegerField(blank=True, null=True)
    cod_banh_domic = models.CharField(max_length=3, blank=True, null=True)
    cod_escoa_sanit = models.PositiveIntegerField(blank=True, null=True)
    cod_dest_lixo = models.PositiveIntegerField(blank=True, null=True)
    cod_ilumi = models.PositiveIntegerField(blank=True, null=True)
    cod_calcam_domic = models.CharField(max_length=10, blank=True, null=True)
    cod_fam_indigena = models.CharField(max_length=3, blank=True, null=True)
    cod_povo_indigena = models.CharField(max_length=3, blank=True, null=True)
    nom_povo_indigena = models.CharField(max_length=70, blank=True, null=True)
    cod_indig_reside_fam = models.CharField(max_length=3, blank=True, null=True)
    cod_reserva_indigena = models.CharField(max_length=6, blank=True, null=True)
    nom_reserva_indigena = models.CharField(max_length=70, blank=True, null=True)
    ind_reserva_indigena = models.CharField(max_length=1, blank=True, null=True)
    ind_fam_quilombola = models.CharField(max_length=3, blank=True, null=True)
    cod_comun_quilombola = models.CharField(max_length=4, blank=True, null=True)
    nom_comun_quilombola = models.CharField(max_length=120, blank=True, null=True)
    ind_comun_quilombola = models.CharField(max_length=1, blank=True, null=True)
    qtd_pessoas_domic = models.CharField(max_length=2, blank=True, null=True)
    qtd_familias_domic = models.CharField(max_length=2, blank=True, null=True)
    qtd_pessoas_inter_0_17 = models.CharField(max_length=2, blank=True, null=True)
    ind_pessoas_inter_0_17 = models.CharField(max_length=1, blank=True, null=True)
    qtd_pessoas_inter_18_64 = models.CharField(max_length=2, blank=True, null=True)
    ind_pessoas_inter_18_64 = models.CharField(max_length=1, blank=True, null=True)
    qtd_pessoas_inter_65 = models.CharField(max_length=2, blank=True, null=True)
    ind_pessoas_inter_65 = models.CharField(max_length=1, blank=True, null=True)
    val_desp_energia = models.FloatField(blank=True, null=True)
    ind_desp_energia = models.CharField(max_length=1, blank=True, null=True)
    val_desp_agua_esgoto = models.FloatField(blank=True, null=True)
    ind_desp_agua_esgoto = models.CharField(max_length=1, blank=True, null=True)
    val_desp_gas = models.FloatField(blank=True, null=True)
    ind_desp_gas = models.CharField(max_length=1, blank=True, null=True)
    val_desp_alim = models.FloatField(blank=True, null=True)
    ind_desp_alim = models.CharField(max_length=1, blank=True, null=True)
    val_desp_transp = models.FloatField(blank=True, null=True)
    ind_desp_transp = models.CharField(max_length=1, blank=True, null=True)
    val_desp_aluguel = models.FloatField(blank=True, null=True)
    ind_desp_aluguel = models.CharField(max_length=1, blank=True, null=True)
    val_desp_medic = models.FloatField(blank=True, null=True)
    ind_desp_medic = models.CharField(max_length=1, blank=True, null=True)
    nom_estab_assist_saude = models.CharField(max_length=70, blank=True, null=True)
    num_estab_saude = models.CharField(max_length=12, blank=True, null=True)
    nom_centro_assit = models.CharField(max_length=70, blank=True, null=True)
    cod_centro_assit = models.CharField(max_length=12, blank=True, null=True)
    atendimento_unid_atend_social_id = models.PositiveIntegerField(blank=True, null=True)
    num_pessoas_dormit = models.CharField(max_length=2, blank=True, null=True)
    domic_acessib = models.PositiveIntegerField(blank=True, null=True)
    area_risco_desab_alag = models.CharField(max_length=3, blank=True, null=True)
    area_dificil_acesso = models.CharField(max_length=3, blank=True, null=True)
    area_conflito_violenc = models.CharField(max_length=3, blank=True, null=True)
    geo_lat = models.FloatField(blank=True, null=True)
    geo_lgt = models.FloatField(blank=True, null=True)
    tipo_residencia = models.ForeignKey(TipoResidencia, models.DO_NOTHING, db_column='tipo_residencia', blank=True, null=True)
    fone_contato = models.CharField(max_length=14, blank=True, null=True)
    cod_rf = models.ForeignKey('Pessoas', models.DO_NOTHING, db_column='cod_rf', blank=True, null=True, related_name='familia_responsavel')
    nivel_atencao = models.CharField(max_length=5, blank=True, null=True)
    ind_pbf = models.CharField(max_length=1, blank=True, null=True)
    origem_cad = models.PositiveIntegerField(blank=True, null=True)
    sit_extr_pobreza = models.CharField(max_length=1, blank=True, null=True)
    ind_bpc = models.CharField(max_length=1, blank=True, null=True)
    ind_pbf_1 = models.CharField(max_length=40, blank=True, null=True)
    tempo_moradia = models.IntegerField(blank=True, null=True)
    tempo_moradia_meses = models.IntegerField(blank=True, null=True)
    ind_parc_mds_fam = models.PositiveIntegerField(blank=True, null=True)
    cod_cta_energ = models.CharField(max_length=20, blank=True, null=True)
    bairro_oficial = models.PositiveIntegerField(blank=True, null=True)
    val_desp_combust = models.FloatField(blank=True, null=True)
    ind_desp_combust = models.CharField(max_length=1, blank=True, null=True)
    val_desp_financ_imovel = models.FloatField(blank=True, null=True)
    ind_desp_financ_imovel = models.CharField(max_length=1, blank=True, null=True)
    val_desp_financ_veic = models.FloatField(blank=True, null=True)
    ind_desp_financ_veic = models.CharField(max_length=1, blank=True, null=True)
    val_desp_celular = models.FloatField(blank=True, null=True)
    ind_desp_celular = models.CharField(max_length=1, blank=True, null=True)
    val_desp_tv_assinat = models.FloatField(blank=True, null=True)
    ind_desp_tv_assinat = models.CharField(max_length=1, blank=True, null=True)
    val_desp_fone_fixo = models.FloatField(blank=True, null=True)
    ind_desp_fone_fixo = models.CharField(max_length=1, blank=True, null=True)
    val_desp_emprestimo = models.FloatField(blank=True, null=True)
    ind_desp_emprestimo = models.CharField(max_length=1, blank=True, null=True)
    val_desp_saude = models.FloatField(blank=True, null=True)
    ind_desp_saude = models.CharField(max_length=1, blank=True, null=True)
    val_desp_educacao = models.FloatField(blank=True, null=True)
    ind_desp_vest = models.CharField(max_length=1, blank=True, null=True)
    val_desp_vest = models.FloatField(blank=True, null=True)
    ind_desp_outro = models.CharField(max_length=1, blank=True, null=True)
    val_desp_outro = models.FloatField(blank=True, null=True)
    ind_desp_educacao = models.CharField(max_length=1, blank=True, null=True)
    ind_renda_cidada = models.CharField(max_length=1, blank=True, null=True)
    ind_acao_jovem = models.CharField(max_length=1, blank=True, null=True)
    tem_meio_transp = models.CharField(max_length=3)
    ind_carro = models.CharField(max_length=1, blank=True, null=True)
    ind_moto = models.CharField(max_length=1, blank=True, null=True)
    ind_bike = models.CharField(max_length=1, blank=True, null=True)
    ind_transp_outro = models.CharField(max_length=1, blank=True, null=True)
    ativo = models.IntegerField(blank=True, null=True)
    sig_uf_proc_fam = models.PositiveIntegerField(blank=True, null=True)
    nom_munic_proc_fam = models.PositiveIntegerField(blank=True, null=True)
    id_beneficio = models.CharField(max_length=100, blank=True, null=True)
    id_unid_antiga = models.CharField(max_length=100, blank=True, null=True)
    datatable_hist_length = models.CharField(max_length=100, blank=True, null=True)
    ind_insuf_alimentar = models.CharField(max_length=100, blank=True, null=True)
    possui_animal = models.CharField(max_length=100, blank=True, null=True)
    tipo_animal = models.CharField(max_length=100, blank=True, null=True)
    datatable_hist_transf_length = models.CharField(max_length=100, blank=True, null=True)
    field_c = models.CharField(db_column='_c', max_length=100, blank=True, null=True)
    unipessoal = models.IntegerField(blank=True, null=True)
    fx_rfpc = models.ForeignKey(FaixaRendaPercapta, models.DO_NOTHING, db_column='fx_rfpc', blank=True, null=True)
    vlr_renda_total_fam = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'familia_domicilio'

    def __str__(self):
        return self.cod_familia or f"Familia Domicilio {self.id}"


class Pessoas(models.Model):
    id = models.AutoField(primary_key=True)
    chv_prefeitura = models.CharField(max_length=13, blank=True, null=True)
    cod_familia = models.ForeignKey(FamiliaDomicilio, models.DO_NOTHING, db_column='cod_familia', blank=True, null=True, related_name='membros')
    num_membro_fam = models.CharField(max_length=11, blank=True, null=True)
    dta_cad_memb = models.DateField(blank=True, null=True)
    dta_atual_memb = models.DateField(blank=True, null=True)
    cod_est_cad_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_trab_inf_pes = models.CharField(max_length=1, blank=True, null=True)
    num_ordem_pes = models.CharField(max_length=2, blank=True, null=True)
    nom_pessoa = models.CharField(max_length=70, blank=True, null=True)
    num_nis_pes = models.CharField(max_length=11, blank=True, null=True)
    nom_apelido_pes = models.CharField(max_length=40, blank=True, null=True)
    cod_sexo_pes = models.CharField(max_length=4)
    dta_nasc_pes = models.DateField(blank=True, null=True)
    cod_parent_rf_pes = models.ForeignKey(TipoParentesco, models.DO_NOTHING, db_column='cod_parent_rf_pes', blank=True, null=True)
    cod_raca_pes = models.PositiveIntegerField(blank=True, null=True)
    nom_mae_pes = models.CharField(max_length=70, blank=True, null=True)
    ind_nom_mae = models.CharField(max_length=1, blank=True, null=True)
    nom_pai_pes = models.CharField(max_length=70, blank=True, null=True)
    ind_nom_pai = models.CharField(max_length=1, blank=True, null=True)
    cod_loc_nasc_pes = models.PositiveIntegerField(blank=True, null=True)
    sig_uf_nasc_pes = models.PositiveIntegerField(blank=True, null=True)
    ind_uf_nasc_pes = models.CharField(max_length=1, blank=True, null=True)
    nom_ibge_munic_nasc_pes = models.PositiveIntegerField(blank=True, null=True)
    cod_ibge_munic_nasc = models.CharField(max_length=7, blank=True, null=True)
    ind_ibge_munic_nasc = models.CharField(max_length=1, blank=True, null=True)
    nom_pais_orig_pes = models.CharField(max_length=40, blank=True, null=True)
    id_pais = models.IntegerField(blank=True, null=True)
    ind_pais_orig_pes = models.CharField(max_length=1, blank=True, null=True)
    cod_cert_reg_pessoa = models.PositiveIntegerField(blank=True, null=True)
    cod_orig_pref_pes = models.CharField(max_length=13, blank=True, null=True)
    cod_orig_fam_pes = models.CharField(max_length=11, blank=True, null=True)
    ind_transf_pes = models.CharField(max_length=1, blank=True, null=True)
    nom_orig_alt_pes = models.CharField(max_length=60, blank=True, null=True)
    chv_natur_pes_atual = models.CharField(max_length=13, blank=True, null=True)
    chv_natur_pes_orig = models.CharField(max_length=13, blank=True, null=True)
    num_nis_orig = models.CharField(max_length=11, blank=True, null=True)
    cod_pais_orig_pes = models.CharField(max_length=4, blank=True, null=True)
    estado_civil = models.ForeignKey(TipoEstadoCivil, models.DO_NOTHING, db_column='estado_civil', blank=True, null=True)
    cod_cert_civ_pes = models.CharField(max_length=10, blank=True, null=True)
    nom_cartorio_pes = models.CharField(max_length=70, blank=True, null=True)
    cod_livro_cert_pes = models.CharField(max_length=14, blank=True, null=True)
    cod_folha_cert_pes = models.CharField(max_length=4, blank=True, null=True)
    cod_termo_cert_pes = models.CharField(max_length=40, blank=True, null=True)
    dta_emis_cert_pes = models.DateField(blank=True, null=True)
    sig_uf_cert_pes = models.PositiveIntegerField(blank=True, null=True)
    nom_munic_cert_pes = models.PositiveIntegerField(blank=True, null=True)
    cod_ibge_munic_cert_pes = models.CharField(max_length=7, blank=True, null=True)
    cod_cart_cert_pes = models.CharField(max_length=15, blank=True, null=True)
    num_cpf_pes = models.CharField(max_length=14, blank=True, null=True)
    num_rne = models.CharField(max_length=50, blank=True, null=True)
    num_rg_pes = models.CharField(max_length=16, blank=True, null=True)
    cod_compl_pes = models.CharField(max_length=5, blank=True, null=True)
    dta_emis_id_pes = models.DateField(blank=True, null=True)
    sig_uf_id_pes = models.CharField(max_length=2, blank=True, null=True)
    sig_orgao_emis_pes = models.CharField(max_length=8, blank=True, null=True)
    num_cart_trab_pes = models.CharField(max_length=7, blank=True, null=True)
    num_serie_cart_trab_pes = models.CharField(max_length=5, blank=True, null=True)
    dta_emis_cart_trab_pes = models.DateField(blank=True, null=True)
    sig_uf_ctps_pes = models.CharField(max_length=2, blank=True, null=True)
    num_tit_eleit_pes = models.CharField(max_length=13, blank=True, null=True)
    num_zona_eleit_pes = models.CharField(max_length=4, blank=True, null=True)
    num_secao_eleit_pes = models.CharField(max_length=4, blank=True, null=True)
    cod_def_memb = models.CharField(max_length=3, blank=True, null=True)
    ind_def_cegueira_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_def_baixa_vis_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_def_surdez_prof_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_def_surdez_leve_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_def_fisica_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_def_mental_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_def_sind_down_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_def_transt_mental_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_ajuda_nao_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_ajuda_familia_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_ajuda_espec_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_ajuda_viz_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_ajuda_inst_memb = models.CharField(max_length=1, blank=True, null=True)
    ind_ajuda_outra_memb = models.CharField(max_length=1, blank=True, null=True)
    cod_sabe_ler_escrever_memb = models.CharField(max_length=3, blank=True, null=True)
    ind_freq_escola_memb = models.PositiveIntegerField(blank=True, null=True)
    nom_escola_memb = models.CharField(max_length=70, blank=True, null=True)
    cod_escola_loc_memb = models.CharField(max_length=3, blank=True, null=True)
    sig_uf_escola_memb = models.PositiveIntegerField(blank=True, null=True)
    nom_munic_escola_memb = models.PositiveIntegerField(blank=True, null=True)
    cod_ibge_munic_esc_memb = models.PositiveIntegerField(blank=True, null=True)
    cod_inep_memb = models.CharField(max_length=8, blank=True, null=True)
    ind_censo_inep_memb = models.CharField(max_length=1, blank=True, null=True)
    cod_curso_freq_memb = models.PositiveIntegerField(blank=True, null=True)
    cod_ano_serie_freq_memb = models.PositiveIntegerField(blank=True, null=True)
    cod_curso_frequentou_memb = models.PositiveIntegerField(blank=True, null=True)
    cod_ano_serie_frequentou_memb = models.PositiveIntegerField(blank=True, null=True)
    cod_concluiu_frequentou_memb = models.CharField(max_length=3, blank=True, null=True)
    cod_trabalhou_memb = models.CharField(max_length=3, blank=True, null=True)
    cod_afastado_trab_memb = models.CharField(max_length=3, blank=True, null=True)
    cod_agric_trab_memb = models.CharField(max_length=3, blank=True, null=True)
    cod_principal_trab_memb = models.PositiveIntegerField(blank=True, null=True)
    val_remuner_empr_memb = models.FloatField(blank=True, null=True)
    ind_val_remun_emp_memb = models.CharField(max_length=1, blank=True, null=True)
    cod_trab_12meses_memb = models.CharField(max_length=1, blank=True, null=True)
    qtd_meses_12_memb = models.CharField(max_length=2, blank=True, null=True)
    val_renda_bruta_memb = models.FloatField(blank=True, null=True)
    val_renda_doacao_memb = models.FloatField(blank=True, null=True)
    ind_val_renda_doacao_memb = models.CharField(max_length=1, blank=True, null=True)
    val_renda_aposent_memb = models.FloatField(blank=True, null=True)
    ind_val_renda_aposent_memb = models.CharField(max_length=1, blank=True, null=True)
    val_renda_seg_desemp_memb = models.FloatField(blank=True, null=True)
    ind_val_renda_seg_desemp = models.CharField(max_length=1, blank=True, null=True)
    val_renda_pens_alim_memb = models.FloatField(blank=True, null=True)
    ind_val_renda_pens_alim = models.CharField(max_length=1, blank=True, null=True)
    val_outras_rendas_memb = models.FloatField(blank=True, null=True)
    ind_val_outras_rendas = models.CharField(max_length=1, blank=True, null=True)
    observacoes = models.TextField(blank=True, null=True)
    usa_medic_controlado = models.CharField(max_length=3, blank=True, null=True)
    uso_abusivo_alcool = models.CharField(max_length=3, blank=True, null=True)
    uso_abusivo_drogas = models.CharField(max_length=3, blank=True, null=True)
    portador_doenca_grave = models.CharField(max_length=3, blank=True, null=True)
    descricao_doenca_grave = models.TextField(blank=True, null=True)
    nome_curso_frequenta = models.CharField(max_length=50, blank=True, null=True)
    val_bpc_loas = models.FloatField(blank=True, null=True)
    ind_val_bpc_loas = models.CharField(max_length=1, blank=True, null=True)
    status_pes = models.CharField(max_length=7, blank=True, null=True)
    fone_pessoa = models.CharField(max_length=14, blank=True, null=True)
    val_pbf = models.FloatField(blank=True, null=True)
    val_peti = models.FloatField(blank=True, null=True)
    quali_profis = models.PositiveIntegerField(blank=True, null=True)
    origem_cad = models.PositiveIntegerField(blank=True, null=True)
    celular_pessoa = models.CharField(max_length=15, blank=True, null=True)
    email = models.CharField(max_length=100, blank=True, null=True)
    ind_cadeirante = models.CharField(max_length=1, blank=True, null=True)
    ind_situacao_rua = models.CharField(max_length=1, blank=True, null=True)
    marc_pbf = models.CharField(max_length=3, blank=True, null=True)
    val_aux_reclusao = models.FloatField(blank=True, null=True)
    ind_val_aux_reclusao = models.CharField(max_length=1, blank=True, null=True)
    val_aux_doenca = models.FloatField(blank=True, null=True)
    ind_val_aux_doenca = models.CharField(max_length=1, blank=True, null=True)
    val_renda_cidada = models.FloatField(blank=True, null=True)
    ind_val_renda_cidada = models.CharField(max_length=1, blank=True, null=True)
    val_acao_jovem = models.FloatField(blank=True, null=True)
    ind_val_acao_jovem = models.CharField(max_length=1, blank=True, null=True)
    val_renda_mens_vitalicia = models.FloatField(blank=True, null=True)
    ind_val_renda_mens_vital = models.CharField(max_length=1, blank=True, null=True)
    orientacao_sexual = models.ForeignKey(OrientacaoSexual, models.DO_NOTHING, db_column='orientacao_sexual_id', blank=True, null=True)
    ativo = models.IntegerField(default=1)
    cod_matricula_cert_pes = models.CharField(max_length=45, blank=True, null=True)
    cod_cert_pes = models.CharField(max_length=45, blank=True, null=True)
    cod_caps = models.IntegerField(blank=True, null=True)
    usa_medic_continuo = models.CharField(max_length=3, blank=True, null=True)
    faz_trat_caps = models.CharField(max_length=3, blank=True, null=True)
    usa_medic_cont_qual = models.CharField(max_length=80, blank=True, null=True)
    id_pessoa = models.CharField(max_length=100, blank=True, null=True)
    num_cnh = models.CharField(max_length=100, blank=True, null=True)
    num_sus = models.CharField(max_length=100, blank=True, null=True)
    num_reservista = models.CharField(max_length=100, blank=True, null=True)
    tratamento_saude = models.CharField(max_length=100, blank=True, null=True)
    faz_tratamento_qual = models.CharField(max_length=100, blank=True, null=True)
    teste = models.CharField(max_length=100, blank=True, null=True)
    cids = models.CharField(max_length=100, blank=True, null=True)
    cids_field = models.CharField(db_column='cids[]', max_length=100, blank=True, null=True)
    id_municipe = models.IntegerField(blank=True, null=True)
    id_municipe_decode = models.CharField(max_length=255, blank=True, null=True)
    frequenta_unidade_saude = models.CharField(max_length=3, blank=True, null=True)
    escola_cep = models.CharField(max_length=9, blank=True, null=True)
    escola_logradouro = models.CharField(max_length=255, blank=True, null=True)
    escola_numero = models.CharField(max_length=10, blank=True, null=True)
    fx_renda_individual_805 = models.IntegerField(blank=True, null=True)
    fx_renda_individual_808 = models.ForeignKey(FaixaRendaPessoa, models.DO_NOTHING, db_column='fx_renda_individual_808', blank=True, null=True)
    fx_renda_individual_809_1 = models.IntegerField(blank=True, null=True)
    fx_renda_individual_809_2 = models.IntegerField(blank=True, null=True)
    fx_renda_individual_809_3 = models.IntegerField(blank=True, null=True)
    fx_renda_individual_809_4 = models.IntegerField(blank=True, null=True)
    fx_renda_individual_809_5 = models.IntegerField(blank=True, null=True)
    ind_identidade_genero = models.PositiveIntegerField(blank=True, null=True)
    ind_transgenero = models.PositiveIntegerField(blank=True, null=True)
    ind_tipo_identidade_genero = models.PositiveIntegerField(blank=True, null=True)
    grau_instrucao = models.PositiveIntegerField(blank=True, null=True)
    certidao_obito = models.CharField(max_length=44, blank=True, null=True)
    data_obito = models.DateField(blank=True, null=True)
    cartorio_registro_obito = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'pessoas'

    def __str__(self):
        return self.nom_pessoa or f"Pessoa {self.id}"
