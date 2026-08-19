from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from core.models import Estado, Municipio, Cid, Cbo
from core.serializers import EstadoSerializer, MunicipioSerializer, CidSerializer, CboSerializer

# Paginação padrão de 15 registros por página para tabelas grandes
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 15
    page_size_query_param = 'page_size'
    max_page_size = 3000

class EstadoViewSet(viewsets.ModelViewSet):
    queryset = Estado.objects.all().order_by('nome')
    serializer_class = EstadoSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nome', 'sigla']

class MunicipioViewSet(viewsets.ModelViewSet):
    queryset = Municipio.objects.all().order_by('municipio')
    serializer_class = MunicipioSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['municipio', 'codigo_ibge']

    def get_queryset(self):
        queryset = super().get_queryset()
        # Permite filtrar por UF se enviado
        codigo_uf = self.request.query_params.get('codigo_uf')
        if codigo_uf:
            queryset = queryset.filter(codigo_uf=codigo_uf)
        return queryset

class CidViewSet(viewsets.ModelViewSet):
    queryset = Cid.objects.all().order_by('codigo')
    serializer_class = CidSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['codigo', 'descricao']

class CboViewSet(viewsets.ModelViewSet):
    queryset = Cbo.objects.all().order_by('codigo')
    serializer_class = CboSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter]
    search_fields = ['codigo', 'nome']

from core.models.tabela_basica import *
from core.serializers.tabela_basica_serializers import *

class TipoUnidadeViewSet(viewsets.ModelViewSet):
    queryset = TipoUnidade.objects.filter(ativo=True)
    serializer_class = TipoUnidadeSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoServidorViewSet(viewsets.ModelViewSet):
    queryset = TipoServidor.objects.filter(ativo=True)
    serializer_class = TipoServidorSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoProfissaoViewSet(viewsets.ModelViewSet):
    queryset = TipoProfissao.objects.filter(ativo=True)
    serializer_class = TipoProfissaoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoEscolaridadeViewSet(viewsets.ModelViewSet):
    queryset = TipoEscolaridade.objects.filter(ativo=True)
    serializer_class = TipoEscolaridadeSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoAreaSegmentoViewSet(viewsets.ModelViewSet):
    queryset = TipoAreaSegmento.objects.filter(ativo=True)
    serializer_class = TipoAreaSegmentoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoOrgaoRecursoViewSet(viewsets.ModelViewSet):
    queryset = TipoOrgaoRecurso.objects.filter(ativo=True)
    serializer_class = TipoOrgaoRecursoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoFuncaoViewSet(viewsets.ModelViewSet):
    queryset = TipoFuncao.objects.filter(ativo=True)
    serializer_class = TipoFuncaoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoLocalNascimentoViewSet(viewsets.ModelViewSet):
    queryset = TipoLocalNascimento.objects.filter(ativo=True)
    serializer_class = TipoLocalNascimentoSerializer







    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class RacaViewSet(viewsets.ModelViewSet):
    queryset = Raca.objects.filter(ativo=True)
    serializer_class = RacaSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoParentescoViewSet(viewsets.ModelViewSet):
    queryset = TipoParentesco.objects.filter(ativo=True)
    serializer_class = TipoParentescoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoCursoViewSet(viewsets.ModelViewSet):
    queryset = TipoCurso.objects.filter(ativo=True)
    serializer_class = TipoCursoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoQualificacaoProfissionalViewSet(viewsets.ModelViewSet):
    queryset = TipoQualificacaoProfissional.objects.filter(ativo=True)
    serializer_class = TipoQualificacaoProfissionalSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoSerieCursoViewSet(viewsets.ModelViewSet):
    queryset = TipoSerieCurso.objects.filter(ativo=True)
    serializer_class = TipoSerieCursoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoAtividadeViewSet(viewsets.ModelViewSet):
    queryset = TipoAtividade.objects.filter(ativo=True)
    serializer_class = TipoAtividadeSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoEstadoCivilViewSet(viewsets.ModelViewSet):
    queryset = TipoEstadoCivil.objects.filter(ativo=True)
    serializer_class = TipoEstadoCivilSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoRegistroCivilViewSet(viewsets.ModelViewSet):
    queryset = TipoRegistroCivil.objects.filter(ativo=True)
    serializer_class = TipoRegistroCivilSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoNecessitaCuidadoViewSet(viewsets.ModelViewSet):
    queryset = TipoNecessitaCuidado.objects.filter(ativo=True)
    serializer_class = TipoNecessitaCuidadoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoBeneficioViewSet(viewsets.ModelViewSet):
    queryset = TipoBeneficio.objects.filter(ativo=True)
    serializer_class = TipoBeneficioSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class OrientacaoSexualViewSet(viewsets.ModelViewSet):
    queryset = OrientacaoSexual.objects.filter(ativo=True)
    serializer_class = OrientacaoSexualSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoTratamentoCapsViewSet(viewsets.ModelViewSet):
    queryset = TipoTratamentoCaps.objects.filter(ativo=True)
    serializer_class = TipoTratamentoCapsSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoDeficienciaViewSet(viewsets.ModelViewSet):
    queryset = TipoDeficiencia.objects.filter(ativo=True)
    serializer_class = TipoDeficienciaSerializer







    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoOrigemCadastroViewSet(viewsets.ModelViewSet):
    queryset = TipoOrigemCadastro.objects.filter(ativo=True)
    serializer_class = TipoOrigemCadastroSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoUnidadeAtendimentoFamiliaViewSet(viewsets.ModelViewSet):
    queryset = TipoUnidadeAtendimentoFamilia.objects.filter(ativo=True)
    serializer_class = TipoUnidadeAtendimentoFamiliaSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoEspecieDomicilioViewSet(viewsets.ModelViewSet):
    queryset = TipoEspecieDomicilio.objects.filter(ativo=True)
    serializer_class = TipoEspecieDomicilioSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoResidenciaViewSet(viewsets.ModelViewSet):
    queryset = TipoResidencia.objects.filter(ativo=True)
    serializer_class = TipoResidenciaSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoPisoDomicilioViewSet(viewsets.ModelViewSet):
    queryset = TipoPisoDomicilio.objects.filter(ativo=True)
    serializer_class = TipoPisoDomicilioSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoConstrucaoDomicilioViewSet(viewsets.ModelViewSet):
    queryset = TipoConstrucaoDomicilio.objects.filter(ativo=True)
    serializer_class = TipoConstrucaoDomicilioSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoIluminacaoDomicilioViewSet(viewsets.ModelViewSet):
    queryset = TipoIluminacaoDomicilio.objects.filter(ativo=True)
    serializer_class = TipoIluminacaoDomicilioSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoAbastecimentoAguaViewSet(viewsets.ModelViewSet):
    queryset = TipoAbastecimentoAgua.objects.filter(ativo=True)
    serializer_class = TipoAbastecimentoAguaSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoEscoamentoSanitarioViewSet(viewsets.ModelViewSet):
    queryset = TipoEscoamentoSanitario.objects.filter(ativo=True)
    serializer_class = TipoEscoamentoSanitarioSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoColetaLixoViewSet(viewsets.ModelViewSet):
    queryset = TipoColetaLixo.objects.filter(ativo=True)
    serializer_class = TipoColetaLixoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoAcessibilidadeDomicilioViewSet(viewsets.ModelViewSet):
    queryset = TipoAcessibilidadeDomicilio.objects.filter(ativo=True)
    serializer_class = TipoAcessibilidadeDomicilioSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoGruposTradicionaisEspecificosViewSet(viewsets.ModelViewSet):
    queryset = TipoGruposTradicionaisEspecificos.objects.filter(ativo=True)
    serializer_class = TipoGruposTradicionaisEspecificosSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class ReligioesViewSet(viewsets.ModelViewSet):
    queryset = Religioes.objects.filter(ativo=True)
    serializer_class = ReligioesSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class PotencialidadesViewSet(viewsets.ModelViewSet):
    queryset = Potencialidades.objects.filter(ativo=True)
    serializer_class = PotencialidadesSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class VulnerabilidadeSocialViewSet(viewsets.ModelViewSet):
    queryset = VulnerabilidadeSocial.objects.filter(ativo=True)
    serializer_class = VulnerabilidadeSocialSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class FeriadoViewSet(viewsets.ModelViewSet):
    queryset = Feriado.objects.filter(ativo=True)
    serializer_class = FeriadoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposAtendimentosViewSet(viewsets.ModelViewSet):
    serializer_class = TiposAtendimentosSerializer

    def get_queryset(self):
        queryset = TiposAtendimentos.objects.filter(ativo=True)
        modalidade = self.request.query_params.get('modalidade')
        if modalidade:
            # Filtra por aquela modalidade ou que atenda a Ambos
            from django.db.models import Q
            queryset = queryset.filter(Q(modalidade=modalidade) | Q(modalidade='Ambos'))
        return queryset.order_by('nome')

    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()


class MotivoAtendimentoViewSet(viewsets.ModelViewSet):
    queryset = MotivoAtendimento.objects.filter(ativo=True).order_by('nome')
    serializer_class = MotivoAtendimentoSerializer

    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoServicoProtecaoViewSet(viewsets.ModelViewSet):
    queryset = TipoServicoProtecao.objects.filter(ativo=True)
    serializer_class = TipoServicoProtecaoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class FaixaEtariaViewSet(viewsets.ModelViewSet):
    queryset = FaixaEtaria.objects.filter(ativo=True)
    serializer_class = FaixaEtariaSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoSituacaoViolenciaEViolacaoDireitosViewSet(viewsets.ModelViewSet):
    queryset = TipoSituacaoViolenciaEViolacaoDireitos.objects.filter(ativo=True)
    serializer_class = TipoSituacaoViolenciaEViolacaoDireitosSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoMedidaSocioeducativaViewSet(viewsets.ModelViewSet):
    queryset = TipoMedidaSocioeducativa.objects.filter(ativo=True)
    serializer_class = TipoMedidaSocioeducativaSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoEncaminhamentoViewSet(viewsets.ModelViewSet):
    queryset = TipoEncaminhamento.objects.filter(ativo=True)
    serializer_class = TipoEncaminhamentoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoServicoProgramaProjetoViewSet(viewsets.ModelViewSet):
    queryset = TipoServicoProgramaProjeto.objects.filter(ativo=True)
    serializer_class = TipoServicoProgramaProjetoSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposAnimaisViewSet(viewsets.ModelViewSet):
    queryset = TiposAnimais.objects.filter(ativo=True)
    serializer_class = TiposAnimaisSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposServicosSociaisViewSet(viewsets.ModelViewSet):
    queryset = TiposServicosSociais.objects.filter(ativo=True)
    serializer_class = TiposServicosSociaisSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposContatosParentesViewSet(viewsets.ModelViewSet):
    queryset = TiposContatosParentes.objects.filter(ativo=True)
    serializer_class = TiposContatosParentesSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposTemposResidenciasCidadesPopulacoesRuasViewSet(viewsets.ModelViewSet):
    queryset = TiposTemposResidenciasCidadesPopulacoesRuas.objects.filter(ativo=True)
    serializer_class = TiposTemposResidenciasCidadesPopulacoesRuasSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposOrgaosViewSet(viewsets.ModelViewSet):
    queryset = TiposOrgaos.objects.filter(ativo=True)
    serializer_class = TiposOrgaosSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposRecursosViewSet(viewsets.ModelViewSet):
    queryset = TiposRecursos.objects.filter(ativo=True)
    serializer_class = TiposRecursosSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposPeriodosViewSet(viewsets.ModelViewSet):
    queryset = TiposPeriodos.objects.filter(ativo=True)
    serializer_class = TiposPeriodosSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoLocaisRealizacoesServicosViewSet(viewsets.ModelViewSet):
    queryset = TipoLocaisRealizacoesServicos.objects.filter(ativo=True)
    serializer_class = TipoLocaisRealizacoesServicosSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposEfeitosDescumprimentosCondicionalidadesViewSet(viewsets.ModelViewSet):
    queryset = TiposEfeitosDescumprimentosCondicionalidades.objects.filter(ativo=True)
    serializer_class = TiposEfeitosDescumprimentosCondicionalidadesSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TipoAtividadeGruposViewSet(viewsets.ModelViewSet):
    queryset = TipoAtividadeGrupos.objects.filter(ativo=True)
    serializer_class = TipoAtividadeGruposSerializer



    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
class TiposRelacoesConvivenciasFamiliaresViewSet(viewsets.ModelViewSet):
    queryset = TiposRelacoesConvivenciasFamiliares.objects.filter(ativo=True)
    serializer_class = TiposRelacoesConvivenciasFamiliaresSerializer

    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()


class PopulacoesRuasTempoDeRuaViewSet(viewsets.ModelViewSet):
    queryset = PopulacoesRuasTempoDeRua.objects.filter(ativo=True)
    serializer_class = PopulacoesRuasTempoDeRuaSerializer

    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()


class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.filter(ativo=True).order_by('nome')
    serializer_class = PaisSerializer

    def perform_destroy(self, instance):
        instance.ativo = False
        instance.save()
