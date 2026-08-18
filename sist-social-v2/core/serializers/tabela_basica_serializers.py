from rest_framework import serializers
from core.models import Estado, Municipio, Cid, Cbo

class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'

class MunicipioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Municipio
        fields = '__all__'

class CidSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cid
        fields = '__all__'

class CboSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cbo
        fields = '__all__'

from core.models.tabela_basica import *

class TipoUnidadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoUnidade
        fields = '__all__'


class TipoServidorSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoServidor
        fields = '__all__'


class TipoProfissaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoProfissao
        fields = '__all__'


class TipoEscolaridadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEscolaridade
        fields = '__all__'


class TipoAreaSegmentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAreaSegmento
        fields = '__all__'


class TipoOrgaoRecursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoOrgaoRecurso
        fields = '__all__'


class TipoFuncaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoFuncao
        fields = '__all__'


class TipoLocalNascimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoLocalNascimento
        fields = '__all__'






class RacaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raca
        fields = '__all__'


class TipoParentescoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoParentesco
        fields = '__all__'


class TipoCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoCurso
        fields = '__all__'


class TipoQualificacaoProfissionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoQualificacaoProfissional
        fields = '__all__'


class TipoSerieCursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoSerieCurso
        fields = '__all__'


class TipoAtividadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAtividade
        fields = '__all__'


class TipoEstadoCivilSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEstadoCivil
        fields = '__all__'


class TipoRegistroCivilSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoRegistroCivil
        fields = '__all__'


class TipoNecessitaCuidadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoNecessitaCuidado
        fields = '__all__'


class TipoBeneficioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoBeneficio
        fields = '__all__'


class OrientacaoSexualSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrientacaoSexual
        fields = '__all__'


class TipoTratamentoCapsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoTratamentoCaps
        fields = '__all__'


class TipoDeficienciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoDeficiencia
        fields = '__all__'






class TipoOrigemCadastroSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoOrigemCadastro
        fields = '__all__'


class TipoUnidadeAtendimentoFamiliaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoUnidadeAtendimentoFamilia
        fields = '__all__'


class TipoEspecieDomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEspecieDomicilio
        fields = '__all__'


class TipoResidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoResidencia
        fields = '__all__'


class TipoPisoDomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPisoDomicilio
        fields = '__all__'


class TipoConstrucaoDomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoConstrucaoDomicilio
        fields = '__all__'


class TipoIluminacaoDomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoIluminacaoDomicilio
        fields = '__all__'


class TipoAbastecimentoAguaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAbastecimentoAgua
        fields = '__all__'


class TipoEscoamentoSanitarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEscoamentoSanitario
        fields = '__all__'


class TipoColetaLixoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoColetaLixo
        fields = '__all__'


class TipoAcessibilidadeDomicilioSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAcessibilidadeDomicilio
        fields = '__all__'


class TipoGruposTradicionaisEspecificosSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoGruposTradicionaisEspecificos
        fields = '__all__'


class ReligioesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Religioes
        fields = '__all__'


class PotencialidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Potencialidades
        fields = '__all__'


class VulnerabilidadeSocialSerializer(serializers.ModelSerializer):
    class Meta:
        model = VulnerabilidadeSocial
        fields = '__all__'


class FeriadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feriado
        fields = '__all__'


class TiposAtendimentosSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposAtendimentos
        fields = '__all__'


class MotivoAtendimentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotivoAtendimento
        fields = '__all__'


class TipoServicoProtecaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoServicoProtecao
        fields = '__all__'


class FaixaEtariaSerializer(serializers.ModelSerializer):
    class Meta:
        model = FaixaEtaria
        fields = '__all__'


class TipoSituacaoViolenciaEViolacaoDireitosSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoSituacaoViolenciaEViolacaoDireitos
        fields = '__all__'


class TipoMedidaSocioeducativaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoMedidaSocioeducativa
        fields = '__all__'


class TipoEncaminhamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoEncaminhamento
        fields = '__all__'


class TipoServicoProgramaProjetoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoServicoProgramaProjeto
        fields = '__all__'


class TiposAnimaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposAnimais
        fields = '__all__'


class TiposServicosSociaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposServicosSociais
        fields = '__all__'


class TiposContatosParentesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposContatosParentes
        fields = '__all__'


class TiposTemposResidenciasCidadesPopulacoesRuasSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposTemposResidenciasCidadesPopulacoesRuas
        fields = '__all__'


class TiposOrgaosSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposOrgaos
        fields = '__all__'


class TiposRecursosSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposRecursos
        fields = '__all__'


class TiposPeriodosSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposPeriodos
        fields = '__all__'


class TipoLocaisRealizacoesServicosSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoLocaisRealizacoesServicos
        fields = '__all__'


class TiposEfeitosDescumprimentosCondicionalidadesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposEfeitosDescumprimentosCondicionalidades
        fields = '__all__'


class TipoAtividadeGruposSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAtividadeGrupos
        fields = '__all__'


class TiposRelacoesConvivenciasFamiliaresSerializer(serializers.ModelSerializer):
    class Meta:
        model = TiposRelacoesConvivenciasFamiliares
        fields = '__all__'


class PopulacoesRuasTempoDeRuaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PopulacoesRuasTempoDeRua
        fields = '__all__'
