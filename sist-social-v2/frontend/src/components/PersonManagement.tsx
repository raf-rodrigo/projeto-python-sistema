import { useState, useEffect } from 'react';
import { 
  User, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  AlertCircle
} from 'lucide-react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
  codigo?: string | number;
  cod_ibge?: number;
  municipio?: string;
  codigo_uf?: number;
}

interface Pessoa {
  id: number;
  nome: string;
  nome_social?: string;
  nis?: string;
  certidao_nascimento_data: string;
  sexo: 'Masc' | 'Fem';
  cpf: string;
  telefone?: string;
  celular?: string;
  email?: string;
  familia_domicilio?: number;
  familia_details?: {
    id: number;
    familia_codigo?: string;
  };
  situacao_de_rua: 'Sim' | 'Não';
  situacao_rua_detalhes?: {
    [key: string]: any;
  };
  tipo_parentesco?: number;
  parentesco_details?: TabelaBasicaItem;
  raca?: number;
  tipo_estado_civil?: number;
  orientacao_sexual?: number;
  
  // Filiação
  nome_mae?: string;
  nome_pai?: string;

  // Origem
  tipo_local_nascimento?: number;
  estado?: number;
  municipio?: number;
  
  // Documentos
  rg?: string;
  rg_digito?: string;
  rg_data_emissao?: string;
  rg_uf?: number;
  rg_orgao_emissor?: string;
  rne?: string;
  ctps?: string;
  ctps_serie?: string;
  ctps_data_emissao?: string;
  ctps_estado_emissor?: number;
  titulo_eleitor?: string;
  titulo_eleitor_zona?: string;
  titulo_eleitor_secao?: string;
  sus?: string;
  cnh?: string;
  reservista?: string;

  // Registro Civil
  tipo_registro_civil?: number;
  certidao?: 'Nascimento' | 'Casamento' | 'RANI';
  certidao_nascimento?: string;
  rani?: string;
  certidao_numero_matricula?: string;
  certidao_nome_cartorio?: string;
  certidao_data_registro?: string;
  certidao_uf_registro?: number;
  certidao_municipio_registro?: number;
  certidao_numero_livro_registro?: string;
  certidao_folha_livro_registro?: string;

  // Saúde
  portador_doenca_grave: 'Sim' | 'Não';
  tipo_deficiencia?: number;
  tipo_necessita_cuidados?: number;
  usa_medicamento_controlado: 'Sim' | 'Não';
  abuso_de_alcool: 'Sim' | 'Não';
  abuso_de_droga: 'Sim' | 'Não';
  medicamento_continuo: 'Sim' | 'Não';
  tratamento_saude: 'Sim' | 'Não';
  tipo_tratamento_caps?: number;

  // Educação
  escreve_le?: 'Sim' | 'Não';
  nome_escola?: string;
  codigo_inep_mec?: string;
  localizada_municipio?: 'Sim' | 'Não';
  estado_municipio_escola?: number;
  municipal_escola_membro?: number;
  tipo_curso_frequenta?: number;
  nome_curso_frequenta?: string;
  tipo_serie_curso_frequenta?: number;
  tipo_curso_frequentou?: number;
  curso_concluido: 'Sim' | 'Não';
  tipo_serie_curso_concluido?: number;

  // Trabalho
  trabalha?: 'Sim' | 'Não';
  afastado_trabalho?: 'Sim' | 'Não';
  atividade_agricula?: 'Sim' | 'Não';
  tipo_atividade?: number;
  qualificacao_profissional_cbo?: number;
  remuneracao_bruta: number;
  recebe_bolsa_familia: 'Sim' | 'Não';
  receita_bolsa_familia: number;
  receita_beneficio_prestacao_continuada: number;
  receita_aposentadoria_pensao: number;
  receita_seguro_desemprego: number;
  receita_pensao_alimenticia: number;
  receita_ajuda_doacao_regular: number;
  receita_outras_fontes: number;
  receita_programa_erradicacao_trabalho_infantil: number;
  
  observacao?: string;
}

export default function PersonManagement() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  // Dropdowns (Tabelas Básicas)
  const [parentescos, setParentescos] = useState<TabelaBasicaItem[]>([]);
  const [racas, setRacas] = useState<TabelaBasicaItem[]>([]);
  const [orientacoesSexuais, setOrientacoesSexuais] = useState<TabelaBasicaItem[]>([]);
  const [estadosCivis, setEstadosCivis] = useState<TabelaBasicaItem[]>([]);
  const [locaisNascimento, setLocaisNascimento] = useState<TabelaBasicaItem[]>([]);
  const [estados, setEstados] = useState<TabelaBasicaItem[]>([]);
  const [municipios, setMunicipios] = useState<TabelaBasicaItem[]>([]);
  const [registrosCivis, setRegistrosCivis] = useState<TabelaBasicaItem[]>([]);
  const [deficiencias, setDeficiencias] = useState<TabelaBasicaItem[]>([]);
  const [necessidadesCuidados, setNecessidadesCuidados] = useState<TabelaBasicaItem[]>([]);
  const [tratamentosCaps, setTratamentosCaps] = useState<TabelaBasicaItem[]>([]);
  const [cursos, setCursos] = useState<TabelaBasicaItem[]>([]);
  const [series, setSeries] = useState<TabelaBasicaItem[]>([]);
  const [atividades, setAtividades] = useState<TabelaBasicaItem[]>([]);
  const [cbos, setCbos] = useState<TabelaBasicaItem[]>([]);
  const [temposRua, setTemposRua] = useState<TabelaBasicaItem[]>([]);
  const [temposCidade, setTemposCidade] = useState<TabelaBasicaItem[]>([]);
  const [contatosParentes, setContatosParentes] = useState<TabelaBasicaItem[]>([]);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'pessoais' | 'filiacao' | 'documentos' | 'registro' | 'saude_edu' | 'trabalho' | 'observacoes'>('pessoais');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);
  const [fieldToFocus, setFieldToFocus] = useState<{ id: string; tab: any } | null>(null);

  // Estados do Formulário
  const [nome, setNome] = useState('');
  const [nomeSocial, setNomeSocial] = useState('');
  const [nis, setNis] = useState('');
  const [certidaoNascimentoData, setCertidaoNascimentoData] = useState('');
  const [sexo, setSexo] = useState<'Masc' | 'Fem'>('Fem');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [email, setEmail] = useState('');
  const [tipoParentesco, setTipoParentesco] = useState('');
  const [raca, setRaca] = useState('');
  const [tipoEstadoCivil, setTipoEstadoCivil] = useState('');
  const [orientacaoSexual, setOrientacaoSexual] = useState('');
  const [situacaoDeRua, setSituacaoDeRua] = useState<'Sim' | 'Não'>('Não');
  const [tempoViveNaRua, setTempoViveNaRua] = useState('');
  const [tempoMoraNaCidade, setTempoMoraNaCidade] = useState('');
  const [viveComFamiliaRua, setViveComFamiliaRua] = useState<'Sim' | 'Não'>('Não');
  const [contatoParenteForaRua, setContatoParenteForaRua] = useState('');
  const [teveEmpregoCarteiraAssinada, setTeveEmpregoCarteiraAssinada] = useState<'Sim' | 'Não' | 'Não Sabe'>('Não');

  // Sub-abas de Situação de Rua
  const [subTabRua, setSubTabRua] = useState<'inicio' | 'dormir' | 'vulnerabilidade' | 'motivos' | 'atividade' | 'atendimento' | 'sustento' | 'observacoes'>('inicio');

  // Onde Costumava Dormir
  const [dormeRua, setDormeRua] = useState<'Sim' | 'Não'>('Não');
  const [tempoDormeRua, setTempoDormeRua] = useState('');
  const [servicoAcolhimento, setServicoAcolhimento] = useState<'Sim' | 'Não'>('Não');
  const [tempoServicoAcolhimento, setTempoServicoAcolhimento] = useState('');
  const [domicilioParticular, setDomicilioParticular] = useState<'Sim' | 'Não'>('Não');
  const [tempoDomicilioParticular, setTempoDomicilioParticular] = useState('');
  const [outroDormir, setOutroDormir] = useState<'Sim' | 'Não'>('Não');
  const [tempoOutroDormir, setTempoOutroDormir] = useState('');

  // Situação de Vulnerabilidade
  const [exploracaoInfantil, setExploracaoInfantil] = useState<'Sim' | 'Não'>('Não');
  const [exploracaoSexual, setExploracaoSexual] = useState<'Sim' | 'Não'>('Não');
  const [violenciaFisica, setViolenciaFisica] = useState<'Sim' | 'Não'>('Não');
  const [violenciaPsicologica, setViolenciaPsicologica] = useState<'Sim' | 'Não'>('Não');
  const [violenciaSexual, setViolenciaSexual] = useState<'Sim' | 'Não'>('Não');

  // Razões Viver na Rua
  const [respondeuMotivo, setRespondeuMotivo] = useState<'Sim' | 'Não'>('Não');
  const [naoSabeMotivo, setNaoSabeMotivo] = useState<'Sim' | 'Não'>('Não');
  const [perdaMoradia, setPerdaMoradia] = useState<'Sim' | 'Não'>('Não');
  const [ameaca, setAmeaca] = useState<'Sim' | 'Não'>('Não');
  const [problemasFamilia, setProblemasFamilia] = useState<'Sim' | 'Não'>('Não');
  const [alcoolismoDroga, setAlcoolismoDroga] = useState<'Sim' | 'Não'>('Não');
  const [desemprego, setDesemprego] = useState<'Sim' | 'Não'>('Não');
  const [trabalhoMotivo, setTrabalhoMotivo] = useState<'Sim' | 'Não'>('Não');
  const [saudeMotivo, setSaudeMotivo] = useState<'Sim' | 'Não'>('Não');
  const [preferenciaMotivo, setPreferenciaMotivo] = useState<'Sim' | 'Não'>('Não');
  const [egresso, setEgresso] = useState('');
  const [outroMotivo, setOutroMotivo] = useState<'Sim' | 'Não'>('Não');

  // Participação de Atividade Comunitária
  const [respondeuAtividade, setRespondeuAtividade] = useState<'Sim' | 'Não'>('Não');
  const [atividadeEscola, setAtividadeEscola] = useState<'Sim' | 'Não'>('Não');
  const [atividadeCooperativa, setAtividadeCooperativa] = useState<'Sim' | 'Não'>('Não');
  const [atividadeMovimentoSocial, setAtividadeMovimentoSocial] = useState<'Sim' | 'Não'>('Não');
  const [naoSabeAtividade, setNaoSabeAtividade] = useState<'Sim' | 'Não'>('Não');

  // Atendimento Socioassistencial e Saúde
  const [atendidoCras, setAtendidoCras] = useState<'Sim' | 'Não'>('Não');
  const [atendidoCreas, setAtendidoCreas] = useState<'Sim' | 'Não'>('Não');
  const [atendidoCentroPop, setAtendidoCentroPop] = useState<'Sim' | 'Não'>('Não');
  const [atendidoInstGov, setAtendidoInstGov] = useState<'Sim' | 'Não'>('Não');
  const [atendidoInstNaoGov, setAtendidoInstNaoGov] = useState<'Sim' | 'Não'>('Não');
  const [atendidoHospitalGeral, setAtendidoHospitalGeral] = useState<'Sim' | 'Não'>('Não');
  const [naoAtendido, setNaoAtendido] = useState<'Sim' | 'Não'>('Não');
  const [usaAlcool, setUsaAlcool] = useState<'Sim' | 'Não'>('Não');
  const [usaDroga, setUsaDroga] = useState<'Sim' | 'Não'>('Não');
  const [transtornoMental, setTranstornoMental] = useState<'Sim' | 'Não'>('Não');

  // Como Adquire o Sustento
  const [respondeuSustento, setRespondeuSustento] = useState<'Sim' | 'Não'>('Não');
  const [sustentoConstrucaoCivil, setSustentoConstrucaoCivil] = useState<'Sim' | 'Não'>('Não');
  const [sustentoGuardadorCarro, setSustentoGuardadorCarro] = useState<'Sim' | 'Não'>('Não');
  const [sustentoCarregador, setSustentoCarregador] = useState<'Sim' | 'Não'>('Não');
  const [sustentoCatador, setSustentoCatador] = useState<'Sim' | 'Não'>('Não');
  const [sustentoServicosGerais, setSustentoServicosGerais] = useState<'Sim' | 'Não'>('Não');
  const [sustentoPedeDinheiro, setSustentoPedeDinheiro] = useState<'Sim' | 'Não'>('Não');
  const [sustentoVendas, setSustentoVendas] = useState<'Sim' | 'Não'>('Não');
  const [sustentoOutro, setSustentoOutro] = useState<'Sim' | 'Não'>('Não');

  // Observações e Profissional
  const [historicoPessoal, setHistoricoPessoal] = useState('');
  const [dataCadastroRua, setDataCadastroRua] = useState('');
  const [profissionalResponsavel, setProfissionalResponsavel] = useState('');

  // Filiação e Naturalidade
  const [nomeMae, setNomeMae] = useState('');
  const [nomePai, setNomePai] = useState('');
  const [tipoLocalNascimento, setTipoLocalNascimento] = useState('');
  const [estadoId, setEstadoId] = useState('');
  const [municipioId, setMunicipioId] = useState('');

  // Documentos
  const [rg, setRg] = useState('');
  const [rgDigito, setRgDigito] = useState('');
  const [rgDataEmissao, setRgDataEmissao] = useState('');
  const [rgUfId, setRgUfId] = useState('');
  const [rgOrgaoEmissor, setRgOrgaoEmissor] = useState('');
  const [rne, setRne] = useState('');
  const [ctps, setCtps] = useState('');
  const [ctpsSerie, setCtpsSerie] = useState('');
  const [ctpsDataEmissao, setCtpsDataEmissao] = useState('');
  const [ctpsEstadoEmissorId, setCtpsEstadoEmissorId] = useState('');
  const [tituloEleitor, setTituloEleitor] = useState('');
  const [tituloEleitorZona, setTituloEleitorZona] = useState('');
  const [tituloEleitorSecao, setTituloEleitorSecao] = useState('');
  const [sus, setSus] = useState('');
  const [cnh, setCnh] = useState('');
  const [reservista, setReservista] = useState('');

  // Registro Civil
  const [tipoRegistroCivilId, setTipoRegistroCivilId] = useState('');
  const [certidao, setCertidao] = useState('');
  const [certidaoNascimento, setCertidaoNascimento] = useState('');
  const [rani, setRani] = useState('');
  const [certidaoNumeroMatricula, setCertidaoNumeroMatricula] = useState('');
  const [certidaoNomeCartorio, setCertidaoNomeCartorio] = useState('');
  const [certidaoDataRegistro, setCertidaoDataRegistro] = useState('');
  const [certidaoUfRegistroId, setCertidaoUfRegistroId] = useState('');
  const [certidaoMunicipioRegistroId, setCertidaoMunicipioRegistroId] = useState('');
  const [certidaoNumeroLivroRegistro, setCertidaoNumeroLivroRegistro] = useState('');
  const [certidaoFolhaLivroRegistro, setCertidaoFolhaLivroRegistro] = useState('');

  // Saúde e Educação
  const [portadorDoencaGrave, setPortadorDoencaGrave] = useState<'Sim' | 'Não'>('Não');
  const [tipoDeficienciaId, setTipoDeficienciaId] = useState('');
  const [tipoNecessitaCuidadosId, setTipoNecessitaCuidadosId] = useState('');
  const [usaMedicamentoControlado, setUsaMedicamentoControlado] = useState<'Sim' | 'Não'>('Não');
  const [abusoDeAlcool, setAbusoDeAlcool] = useState<'Sim' | 'Não'>('Não');
  const [abusoDeDroga, setAbusoDeDroga] = useState<'Sim' | 'Não'>('Não');
  const [medicamentoContinuo, setMedicamentoContinuo] = useState<'Sim' | 'Não'>('Não');
  const [tratamentoSaude, setTratamentoSaude] = useState<'Sim' | 'Não'>('Não');
  const [tipoTratamentoCapsId, setTipoTratamentoCapsId] = useState('');
  
  const [escreveLe, setEscreveLe] = useState<'Sim' | 'Não'>('Sim');
  const [nomeEscola, setNomeEscola] = useState('');
  const [codigoInepMec, setCodigoInepMec] = useState('');
  const [localizadaMunicipio, setLocalizadaMunicipio] = useState<'Sim' | 'Não'>('Sim');
  const [estadoMunicipioEscolaId, setEstadoMunicipioEscolaId] = useState('');
  const [municipalEscolaMembroId, setMunicipalEscolaMembroId] = useState('');
  const [tipoCursoFrequentaId, setTipoCursoFrequentaId] = useState('');
  const [nomeCursoFrequenta, setNomeCursoFrequenta] = useState('');
  const [tipoSerieCursoFrequentaId, setTipoSerieCursoFrequentaId] = useState('');
  const [tipoCursoFrequentouId, setTipoCursoFrequentouId] = useState('');
  const [cursoConcluido, setCursoConcluido] = useState<'Sim' | 'Não'>('Não');
  const [tipoSerieCursoConcluidoId, setTipoSerieCursoConcluidoId] = useState('');

  // Trabalho e Renda
  const [trabalha, setTrabalha] = useState<'Sim' | 'Não'>('Não');
  const [afastadoTrabalho, setAfastadoTrabalho] = useState<'Sim' | 'Não'>('Não');
  const [atividadeAgricula, setAtividadeAgricula] = useState<'Sim' | 'Não'>('Não');
  const [tipoAtividadeId, setTipoAtividadeId] = useState('');
  const [qualificacaoProfissionalCboId, setQualificacaoProfissionalCboId] = useState('');
  
  const [remuneracaoBruta, setRemuneracaoBruta] = useState('0.00');
  const [recebeBolsaFamilia, setRecebeBolsaFamilia] = useState<'Sim' | 'Não'>('Não');
  const [receitaBolsaFamilia, setReceitaBolsaFamilia] = useState('0.00');
  const [receitaBpc, setReceitaBpc] = useState('0.00');
  const [receitaAposentadoria, setReceitaAposentadoria] = useState('0.00');
  const [receitaSeguroDesemprego, setReceitaSeguroDesemprego] = useState('0.00');
  const [receitaPensaoAlimenticia, setReceitaPensaoAlimenticia] = useState('0.00');
  const [receitaAjudaDoacao, setReceitaAjudaDoacao] = useState('0.00');
  const [receitaOutrasFontes, setReceitaOutrasFontes] = useState('0.00');
  const [receitaPeti, setReceitaPeti] = useState('0.00');

  const [observacao, setObservacao] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');

  // Carregar dados iniciais e listagem
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const resPessoas = await fetch(`${API_URL}/api/pessoas/?search=${encodeURIComponent(busca)}`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resPessoas.ok) {
        const data = await resPessoas.json();
        setPessoas(data.results || data || []);
      }

      // Busca tabelas de apoio necessárias
      const fetchAuxiliar = async (endpoint: string, stateSetter: any) => {
        const res = await fetch(`${API_URL}/api/${endpoint}`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          stateSetter(data.results || data || []);
        }
      };

      await Promise.all([
        fetchAuxiliar('tipo_parentesco/', setParentescos),
        fetchAuxiliar('raca/', setRacas),
        fetchAuxiliar('orientacao_sexual/', setOrientacoesSexuais),
        fetchAuxiliar('tipo_estado_civil/', setEstadosCivis),
        fetchAuxiliar('tipo_local_nascimento/', setLocaisNascimento),
        fetchAuxiliar('estados/', setEstados),
        fetchAuxiliar('municipios/?page_size=2000', setMunicipios),
        fetchAuxiliar('tipo_registro_civil/', setRegistrosCivis),
        fetchAuxiliar('tipo_deficiencia/', setDeficiencias),
        fetchAuxiliar('tipo_necessita_cuidado/', setNecessidadesCuidados),
        fetchAuxiliar('tipo_tratamento_caps/', setTratamentosCaps),
        fetchAuxiliar('tipo_curso/', setCursos),
        fetchAuxiliar('tipo_serie_curso/', setSeries),
        fetchAuxiliar('tipo_atividade/', setAtividades),
        fetchAuxiliar('cbos/?page_size=3000', setCbos),
        fetchAuxiliar('populacoes_ruas_tempo_de_rua/', setTemposRua),
        fetchAuxiliar('tipos_tempos_residencias_cidades_populacoes_ruas/', setTemposCidade),
        fetchAuxiliar('tipos_contatos_parentes/', setContatosParentes)
      ]);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [busca]);

  const abrirNovoModal = () => {
    setEditandoId(null);
    setActiveModalTab('pessoais');
    setFieldToFocus(null);

    // Resets
    setNome('');
    setNomeSocial('');
    setNis('');
    setCertidaoNascimentoData('');
    setSexo('Fem');
    setCpf('');
    setTelefone('');
    setCelular('');
    setEmail('');
    setTipoParentesco('');
    setRaca('');
    setTipoEstadoCivil('');
    setOrientacaoSexual('');
    setSituacaoDeRua('Não');
    setTempoViveNaRua('');
    setTempoMoraNaCidade('');
    setViveComFamiliaRua('Não');
    setContatoParenteForaRua('Não');
    setTeveEmpregoCarteiraAssinada('Não');
    setNomeMae('');
    setNomePai('');
    setTipoLocalNascimento('');
    setEstadoId('');
    setMunicipioId('');
    setRg('');
    setRgDigito('');
    setRgDataEmissao('');
    setRgUfId('');
    setRgOrgaoEmissor('');
    setRne('');
    setCtps('');
    setCtpsSerie('');
    setCtpsDataEmissao('');
    setCtpsEstadoEmissorId('');
    setTituloEleitor('');
    setTituloEleitorZona('');
    setTituloEleitorSecao('');
    setSus('');
    setCnh('');
    setReservista('');
    setTipoRegistroCivilId('');
    setCertidao('');
    setCertidaoNascimento('');
    setRani('');
    setCertidaoNumeroMatricula('');
    setCertidaoNomeCartorio('');
    setCertidaoDataRegistro('');
    setCertidaoUfRegistroId('');
    setCertidaoMunicipioRegistroId('');
    setCertidaoNumeroLivroRegistro('');
    setCertidaoFolhaLivroRegistro('');
    setPortadorDoencaGrave('Não');
    setTipoDeficienciaId('');
    setTipoNecessitaCuidadosId('');
    setUsaMedicamentoControlado('Não');
    setAbusoDeAlcool('Não');
    setAbusoDeDroga('Não');
    setMedicamentoContinuo('Não');
    setTratamentoSaude('Não');
    setTipoTratamentoCapsId('');
    setEscreveLe('Sim');
    setNomeEscola('');
    setCodigoInepMec('');
    setLocalizadaMunicipio('Sim');
    setEstadoMunicipioEscolaId('');
    setMunicipalEscolaMembroId('');
    setTipoCursoFrequentaId('');
    setNomeCursoFrequenta('');
    setTipoSerieCursoFrequentaId('');
    setTipoCursoFrequentouId('');
    setCursoConcluido('Não');
    setTipoSerieCursoConcluidoId('');
    setTrabalha('Não');
    setAfastadoTrabalho('Não');
    setAtividadeAgricula('Não');
    setTipoAtividadeId('');
    setQualificacaoProfissionalCboId('');
    setRemuneracaoBruta('0.00');
    setRecebeBolsaFamilia('Não');
    setReceitaBolsaFamilia('0.00');
    setReceitaBpc('0.00');
    setReceitaAposentadoria('0.00');
    setReceitaSeguroDesemprego('0.00');
    setReceitaPensaoAlimenticia('0.00');
    setReceitaAjudaDoacao('0.00');
    setReceitaOutrasFontes('0.00');
    setReceitaPeti('0.00');
    setObservacao('');

    setModalAberto(true);
  };

  const abrirEditarModal = (p: Pessoa) => {
    setEditandoId(p.id);
    setActiveModalTab('pessoais');
    setFieldToFocus(null);

    setNome(p.nome);
    setNomeSocial(p.nome_social || '');
    setNis(p.nis || '');
    setCertidaoNascimentoData(p.certidao_nascimento_data);
    setSexo(p.sexo);
    setCpf(p.cpf);
    setTelefone(p.telefone || '');
    setCelular(p.celular || '');
    setEmail(p.email || '');
    setTipoParentesco(p.tipo_parentesco?.toString() || '');
    setRaca(p.raca?.toString() || '');
    setTipoEstadoCivil(p.tipo_estado_civil?.toString() || '');
    setOrientacaoSexual(p.orientacao_sexual?.toString() || '');
    setSituacaoDeRua(p.situacao_de_rua);
    setTempoViveNaRua(p.situacao_rua_detalhes?.tempo_vive_na_rua?.toString() || '');
    setTempoMoraNaCidade(p.situacao_rua_detalhes?.tempo_mora_na_cidade?.toString() || '');
    setViveComFamiliaRua(p.situacao_rua_detalhes?.vive_com_familia_rua || 'Não');
    setContatoParenteForaRua(p.situacao_rua_detalhes?.contato_parente_fora_rua?.toString() || '');
    setTeveEmpregoCarteiraAssinada(p.situacao_rua_detalhes?.teve_emprego_carteira_assinada || 'Não');

    // Onde Costumava Dormir
    setDormeRua(p.situacao_rua_detalhes?.dorme_rua || 'Não');
    setTempoDormeRua(p.situacao_rua_detalhes?.tempo_dorme_rua?.toString() || '');
    setServicoAcolhimento(p.situacao_rua_detalhes?.servico_acolhimento || 'Não');
    setTempoServicoAcolhimento(p.situacao_rua_detalhes?.tempo_servico_acolhimento?.toString() || '');
    setDomicilioParticular(p.situacao_rua_detalhes?.domicilio_particular || 'Não');
    setTempoDomicilioParticular(p.situacao_rua_detalhes?.tempo_domicilio_particular?.toString() || '');
    setOutroDormir(p.situacao_rua_detalhes?.outro_dormir || 'Não');
    setTempoOutroDormir(p.situacao_rua_detalhes?.tempo_outro_dormir?.toString() || '');

    // Situação de Vulnerabilidade
    setExploracaoInfantil(p.situacao_rua_detalhes?.exploracao_infantil || 'Não');
    setExploracaoSexual(p.situacao_rua_detalhes?.exploracao_sexual || 'Não');
    setViolenciaFisica(p.situacao_rua_detalhes?.violencia_fisica || 'Não');
    setViolenciaPsicologica(p.situacao_rua_detalhes?.violencia_psicologica || 'Não');
    setViolenciaSexual(p.situacao_rua_detalhes?.violencia_sexual || 'Não');

    // Razões Viver na Rua
    setRespondeuMotivo(p.situacao_rua_detalhes?.respondeu_motivo || 'Não');
    setNaoSabeMotivo(p.situacao_rua_detalhes?.nao_sabe_motivo || 'Não');
    setPerdaMoradia(p.situacao_rua_detalhes?.perda_moradia || 'Não');
    setAmeaca(p.situacao_rua_detalhes?.ameaca || 'Não');
    setProblemasFamilia(p.situacao_rua_detalhes?.problemas_familia || 'Não');
    setAlcoolismoDroga(p.situacao_rua_detalhes?.alcoolismo_droga || 'Não');
    setDesemprego(p.situacao_rua_detalhes?.desemprego || 'Não');
    setTrabalhoMotivo(p.situacao_rua_detalhes?.trabalho || 'Não');
    setSaudeMotivo(p.situacao_rua_detalhes?.saude || 'Não');
    setPreferenciaMotivo(p.situacao_rua_detalhes?.preferencia || 'Não');
    setEgresso(p.situacao_rua_detalhes?.egresso || '');
    setOutroMotivo(p.situacao_rua_detalhes?.outro_motivo || 'Não');

    // Participação de Atividade Comunitária
    setRespondeuAtividade(p.situacao_rua_detalhes?.respondeu_atividade || 'Não');
    setAtividadeEscola(p.situacao_rua_detalhes?.atividade_escola || 'Não');
    setAtividadeCooperativa(p.situacao_rua_detalhes?.atividade_cooperativa || 'Não');
    setAtividadeMovimentoSocial(p.situacao_rua_detalhes?.atividade_movimento_social || 'Não');
    setNaoSabeAtividade(p.situacao_rua_detalhes?.nao_sabe_atividade || 'Não');

    // Atendimento Socioassistencial e Saúde
    setAtendidoCras(p.situacao_rua_detalhes?.atendido_cras || 'Não');
    setAtendidoCreas(p.situacao_rua_detalhes?.atendido_creas || 'Não');
    setAtendidoCentroPop(p.situacao_rua_detalhes?.atendido_centro_pop || 'Não');
    setAtendidoInstGov(p.situacao_rua_detalhes?.atendido_inst_gov || 'Não');
    setAtendidoInstNaoGov(p.situacao_rua_detalhes?.atendido_inst_nao_gov || 'Não');
    setAtendidoHospitalGeral(p.situacao_rua_detalhes?.atendido_hospital_geral || 'Não');
    setNaoAtendido(p.situacao_rua_detalhes?.nao_atendido || 'Não');
    setUsaAlcool(p.situacao_rua_detalhes?.usa_alcool || 'Não');
    setUsaDroga(p.situacao_rua_detalhes?.usa_droga || 'Não');
    setTranstornoMental(p.situacao_rua_detalhes?.transtorno_mental || 'Não');

    // Como Adquire o Sustento
    setRespondeuSustento(p.situacao_rua_detalhes?.respondeu_sustento || 'Não');
    setSustentoConstrucaoCivil(p.situacao_rua_detalhes?.sustento_construcao_civil || 'Não');
    setSustentoGuardadorCarro(p.situacao_rua_detalhes?.sustento_guardador_carro || 'Não');
    setSustentoCarregador(p.situacao_rua_detalhes?.sustento_carregador || 'Não');
    setSustentoCatador(p.situacao_rua_detalhes?.sustento_catador || 'Não');
    setSustentoServicosGerais(p.situacao_rua_detalhes?.sustento_servicos_gerais || 'Não');
    setSustentoPedeDinheiro(p.situacao_rua_detalhes?.sustento_pede_dinheiro || 'Não');
    setSustentoVendas(p.situacao_rua_detalhes?.sustento_vendas || 'Não');
    setSustentoOutro(p.situacao_rua_detalhes?.sustento_outro || 'Não');

    // Observações e Responsável
    setHistoricoPessoal(p.situacao_rua_detalhes?.historico_pessoal || '');
    setDataCadastroRua(p.situacao_rua_detalhes?.data_cadastro || '');
    setProfissionalResponsavel(p.situacao_rua_detalhes?.profissional_responsavel?.toString() || '');
    setNomeMae(p.nome_mae || '');
    setNomePai(p.nome_pai || '');
    setTipoLocalNascimento(p.tipo_local_nascimento?.toString() || '');
    setEstadoId(p.estado?.toString() || '');
    setMunicipioId(p.municipio?.toString() || '');
    setRg(p.rg || '');
    setRgDigito(p.rg_digito || '');
    setRgDataEmissao(p.rg_data_emissao || '');
    setRgUfId(p.rg_uf?.toString() || '');
    setRgOrgaoEmissor(p.rg_orgao_emissor || '');
    setRne(p.rne || '');
    setCtps(p.ctps || '');
    setCtpsSerie(p.ctps_serie || '');
    setCtpsDataEmissao(p.ctps_data_emissao || '');
    setCtpsEstadoEmissorId(p.ctps_estado_emissor?.toString() || '');
    setTituloEleitor(p.titulo_eleitor || '');
    setTituloEleitorZona(p.titulo_eleitor_zona || '');
    setTituloEleitorSecao(p.titulo_eleitor_secao || '');
    setSus(p.sus || '');
    setCnh(p.cnh || '');
    setReservista(p.reservista || '');
    setTipoRegistroCivilId(p.tipo_registro_civil?.toString() || '');
    setCertidao(p.certidao || '');
    setCertidaoNascimento(p.certidao_nascimento || '');
    setRani(p.rani || '');
    setCertidaoNumeroMatricula(p.certidao_numero_matricula || '');
    setCertidaoNomeCartorio(p.certidao_nome_cartorio || '');
    setCertidaoDataRegistro(p.certidao_data_registro || '');
    setCertidaoUfRegistroId(p.certidao_uf_registro?.toString() || '');
    setCertidaoMunicipioRegistroId(p.certidao_municipio_registro?.toString() || '');
    setCertidaoNumeroLivroRegistro(p.certidao_numero_livro_registro || '');
    setCertidaoFolhaLivroRegistro(p.certidao_folha_livro_registro || '');
    setPortadorDoencaGrave(p.portador_doenca_grave);
    setTipoDeficienciaId(p.tipo_deficiencia?.toString() || '');
    setTipoNecessitaCuidadosId(p.tipo_necessita_cuidados?.toString() || '');
    setUsaMedicamentoControlado(p.usa_medicamento_controlado);
    setAbusoDeAlcool(p.abuso_de_alcool);
    setAbusoDeDroga(p.abuso_de_droga);
    setMedicamentoContinuo(p.medicamento_continuo);
    setTratamentoSaude(p.tratamento_saude);
    setTipoTratamentoCapsId(p.tipo_tratamento_caps?.toString() || '');
    setEscreveLe(p.escreve_le || 'Sim');
    setNomeEscola(p.nome_escola || '');
    setCodigoInepMec(p.codigo_inep_mec || '');
    setLocalizadaMunicipio(p.localizada_municipio || 'Sim');
    setEstadoMunicipioEscolaId(p.estado_municipio_escola?.toString() || '');
    setMunicipalEscolaMembroId(p.municipal_escola_membro?.toString() || '');
    setTipoCursoFrequentaId(p.tipo_curso_frequenta?.toString() || '');
    setNomeCursoFrequenta(p.nome_curso_frequenta || '');
    setTipoSerieCursoFrequentaId(p.tipo_serie_curso_frequenta?.toString() || '');
    setTipoCursoFrequentouId(p.tipo_curso_frequentou?.toString() || '');
    setCursoConcluido(p.curso_concluido);
    setTipoSerieCursoConcluidoId(p.tipo_serie_curso_concluido?.toString() || '');
    setTrabalha(p.trabalha || 'Não');
    setAfastadoTrabalho(p.afastado_trabalho || 'Não');
    setAtividadeAgricula(p.atividade_agricula || 'Não');
    setTipoAtividadeId(p.tipo_atividade?.toString() || '');
    setQualificacaoProfissionalCboId(p.qualificacao_profissional_cbo?.toString() || '');
    setRemuneracaoBruta(p.remuneracao_bruta.toString());
    setRecebeBolsaFamilia(p.recebe_bolsa_familia);
    setReceitaBolsaFamilia(p.receita_bolsa_familia.toString());
    setReceitaBpc(p.receita_beneficio_prestacao_continuada.toString());
    setReceitaAposentadoria(p.receita_aposentadoria_pensao.toString());
    setReceitaSeguroDesemprego(p.receita_seguro_desemprego.toString());
    setReceitaPensaoAlimenticia(p.receita_pensao_alimenticia.toString());
    setReceitaAjudaDoacao(p.receita_ajuda_doacao_regular.toString());
    setReceitaOutrasFontes(p.receita_outras_fontes.toString());
    setReceitaPeti(p.receita_programa_erradicacao_trabalho_infantil.toString());
    setObservacao(p.observacao || '');

    setModalAberto(true);
  };

  // Helper para validação matemática de CPF no Frontend
  const validarCPF = (value: string) => {
    const cleanCpf = value.replace(/\D/g, '');
    if (cleanCpf.length !== 11) return false;
    if (cleanCpf === cleanCpf[0].repeat(11)) return false;

    for (let t = 9; t < 11; t++) {
      let d = 0;
      for (let c = 0; c < t; c++) {
        d += parseInt(cleanCpf[c]) * ((t + 1) - c);
      }
      d = (d * 10) % 11;
      if (d === 10 || d === 11) d = 0;
      if (d !== parseInt(cleanCpf[t])) return false;
    }
    return true;
  };

  const salvarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setFieldToFocus({ id: 'input-nome', tab: 'pessoais' });
      setErrorModalMsg('O campo Nome Completo é obrigatório.');
      return;
    }
    if (!certidaoNascimentoData) {
      setFieldToFocus({ id: 'input-nascimento', tab: 'pessoais' });
      setErrorModalMsg('A data de nascimento é obrigatória.');
      return;
    }
    if (!cpf.trim()) {
      setFieldToFocus({ id: 'input-cpf', tab: 'documentos' });
      setErrorModalMsg('O campo CPF é obrigatório.');
      return;
    }
    if (!validarCPF(cpf)) {
      setFieldToFocus({ id: 'input-cpf', tab: 'documentos' });
      setErrorModalMsg('CPF inválido (formato incorreto ou dígitos verificadores inválidos).');
      return;
    }

    const payload = {
      nome,
      nome_social: nomeSocial || null,
      nis: nis || null,
      certidao_nascimento_data: certidaoNascimentoData,
      sexo,
      cpf,
      telefone: situacaoDeRua === 'Sim' ? null : (telefone || null),
      celular: situacaoDeRua === 'Sim' ? null : (celular || null),
      email: situacaoDeRua === 'Sim' ? null : (email || null),
      tipo_parentesco: tipoParentesco ? parseInt(tipoParentesco) : null,
      raca: raca ? parseInt(raca) : null,
      tipo_estado_civil: tipoEstadoCivil ? parseInt(tipoEstadoCivil) : null,
      orientacao_sexual: orientacaoSexual ? parseInt(orientacaoSexual) : null,
      situacao_de_rua: situacaoDeRua,
      situacao_rua_detalhes: situacaoDeRua === 'Sim' ? {
        tempo_vive_na_rua: tempoViveNaRua ? parseInt(tempoViveNaRua) : null,
        tempo_mora_na_cidade: tempoMoraNaCidade ? parseInt(tempoMoraNaCidade) : null,
        vive_com_familia_rua: viveComFamiliaRua,
        contato_parente_fora_rua: contatoParenteForaRua ? parseInt(contatoParenteForaRua) : null,
        teve_emprego_carteira_assinada: teveEmpregoCarteiraAssinada,

        // Onde Costumava Dormir
        dorme_rua: dormeRua,
        tempo_dorme_rua: tempoDormeRua ? parseInt(tempoDormeRua) : null,
        servico_acolhimento: servicoAcolhimento,
        tempo_servico_acolhimento: tempoServicoAcolhimento ? parseInt(tempoServicoAcolhimento) : null,
        domicilio_particular: domicilioParticular,
        tempo_domicilio_particular: tempoDomicilioParticular ? parseInt(tempoDomicilioParticular) : null,
        outro_dormir: outroDormir,
        tempo_outro_dormir: tempoOutroDormir ? parseInt(tempoOutroDormir) : null,

        // Situação de Vulnerabilidade
        exploracao_infantil: exploracaoInfantil,
        exploracao_sexual: exploracaoSexual,
        violencia_fisica: violenciaFisica,
        violencia_psicologica: violenciaPsicologica,
        violencia_sexual: violenciaSexual,

        // Razões Viver na Rua
        respondeu_motivo: respondeuMotivo,
        nao_sabe_motivo: naoSabeMotivo,
        perda_moradia: perdaMoradia,
        ameaca: ameaca,
        problemas_familia: problemasFamilia,
        alcoolismo_droga: alcoolismoDroga,
        desemprego: desemprego,
        trabalho: trabalhoMotivo,
        saude: saudeMotivo,
        preferencia: preferenciaMotivo,
        egresso: egresso || null,
        outro_motivo: outroMotivo,

        // Participação de Atividade Comunitária
        respondeu_atividade: respondeuAtividade,
        atividade_escola: atividadeEscola,
        atividade_cooperativa: atividadeCooperativa,
        atividade_movimento_social: atividadeMovimentoSocial,
        nao_sabe_atividade: naoSabeAtividade,

        // Atendimento Socioassistencial e Saúde
        atendido_cras: atendidoCras,
        atendido_creas: atendidoCreas,
        atendido_centro_pop: atendidoCentroPop,
        atendido_inst_gov: atendidoInstGov,
        atendido_inst_nao_gov: atendidoInstNaoGov,
        atendido_hospital_geral: atendidoHospitalGeral,
        nao_atendido: naoAtendido,
        usa_alcool: usaAlcool,
        usa_droga: usaDroga,
        transtorno_mental: transtornoMental,

        // Como Adquire o Sustento
        respondeu_sustento: respondeuSustento,
        sustento_construcao_civil: sustentoConstrucaoCivil,
        sustento_guardador_carro: sustentoGuardadorCarro,
        sustento_carregador: sustentoCarregador,
        sustento_catador: sustentoCatador,
        sustento_servicos_gerais: sustentoServicosGerais,
        sustento_pede_dinheiro: sustentoPedeDinheiro,
        sustento_vendas: sustentoVendas,
        sustento_outro: sustentoOutro,

        // Observações e Responsável
        historico_pessoal: historicoPessoal || null,
        data_cadastro: dataCadastroRua || null,
        profissional_responsavel: profissionalResponsavel ? parseInt(profissionalResponsavel) : null
      } : null,
      nome_mae: nomeMae || null,
      nome_pai: nomePai || null,
      tipo_local_nascimento: tipoLocalNascimento ? parseInt(tipoLocalNascimento) : null,
      estado: estadoId ? parseInt(estadoId) : null,
      municipio: municipioId ? parseInt(municipioId) : null,
      rg: rg || null,
      rg_digito: rgDigito || null,
      rg_data_emissao: rgDataEmissao || null,
      rg_uf: rgUfId ? parseInt(rgUfId) : null,
      rg_orgao_emissor: rgOrgaoEmissor || null,
      rne: rne || null,
      ctps: ctps || null,
      ctps_serie: ctpsSerie || null,
      ctps_data_emissao: ctpsDataEmissao || null,
      ctps_estado_emissor: ctpsEstadoEmissorId ? parseInt(ctpsEstadoEmissorId) : null,
      titulo_eleitor: tituloEleitor || null,
      titulo_eleitor_zona: tituloEleitorZona || null,
      titulo_eleitor_secao: tituloEleitorSecao || null,
      sus: sus || null,
      cnh: cnh || null,
      reservista: reservista || null,
      tipo_registro_civil: tipoRegistroCivilId ? parseInt(tipoRegistroCivilId) : null,
      certidao: certidao || null,
      certidao_nascimento: certidaoNascimento || null,
      rani: rani || null,
      certidao_numero_matricula: certidaoNumeroMatricula || null,
      certidao_nome_cartorio: certidaoNomeCartorio || null,
      certidao_data_registro: certidaoDataRegistro || null,
      certidao_uf_registro: certidaoUfRegistroId ? parseInt(certidaoUfRegistroId) : null,
      certidao_municipio_registro: certidaoMunicipioRegistroId ? parseInt(certidaoMunicipioRegistroId) : null,
      certidao_numero_livro_registro: certidaoNumeroLivroRegistro || null,
      certidao_folha_livro_registro: certidaoFolhaLivroRegistro || null,
      portador_doenca_grave: portadorDoencaGrave,
      tipo_deficiencia: tipoDeficienciaId ? parseInt(tipoDeficienciaId) : null,
      tipo_necessita_cuidados: tipoNecessitaCuidadosId ? parseInt(tipoNecessitaCuidadosId) : null,
      usa_medicamento_controlado: usaMedicamentoControlado,
      abuso_de_alcool: abusoDeAlcool,
      abuso_de_droga: abusoDeDroga,
      medicamento_continuo: medicamentoContinuo,
      tratamento_saude: tratamentoSaude,
      tipo_tratamento_caps: tipoTratamentoCapsId ? parseInt(tipoTratamentoCapsId) : null,
      escreve_le: escreveLe,
      nome_escola: nomeEscola || null,
      codigo_inep_mec: codigoInepMec || null,
      localizada_municipio: localizadaMunicipio,
      estado_municipio_escola: estadoMunicipioEscolaId ? parseInt(estadoMunicipioEscolaId) : null,
      municipal_escola_membro: municipalEscolaMembroId ? parseInt(municipalEscolaMembroId) : null,
      tipo_curso_frequenta: tipoCursoFrequentaId ? parseInt(tipoCursoFrequentaId) : null,
      nome_curso_frequenta: nomeCursoFrequenta || null,
      tipo_serie_curso_frequenta: tipoSerieCursoFrequentaId ? parseInt(tipoSerieCursoFrequentaId) : null,
      tipo_curso_frequentou: tipoCursoFrequentouId ? parseInt(tipoCursoFrequentouId) : null,
      curso_concluido: cursoConcluido,
      tipo_serie_curso_concluido: tipoSerieCursoConcluidoId ? parseInt(tipoSerieCursoConcluidoId) : null,
      trabalha,
      afastado_trabalho: afastadoTrabalho,
      atividade_agricula: atividadeAgricula,
      tipo_atividade: tipoAtividadeId ? parseInt(tipoAtividadeId) : null,
      qualificacao_profissional_cbo: qualificacaoProfissionalCboId ? parseInt(qualificacaoProfissionalCboId) : null,
      remuneracao_bruta: parseFloat(remuneracaoBruta) || 0,
      recebe_bolsa_familia: recebeBolsaFamilia,
      receita_bolsa_familia: parseFloat(receitaBolsaFamilia) || 0,
      receita_beneficio_prestacao_continuada: parseFloat(receitaBpc) || 0,
      receita_aposentadoria_pensao: parseFloat(receitaAposentadoria) || 0,
      receita_seguro_desemprego: parseFloat(receitaSeguroDesemprego) || 0,
      receita_pensao_alimenticia: parseFloat(receitaPensaoAlimenticia) || 0,
      receita_ajuda_doacao_regular: parseFloat(receitaAjudaDoacao) || 0,
      receita_outras_fontes: parseFloat(receitaOutrasFontes) || 0,
      receita_programa_erradicacao_trabalho_infantil: parseFloat(receitaPeti) || 0,
      observacao: observacao || null
    };

    try {
      const url = editandoId ? `${API_URL}/api/pessoas/${editandoId}/` : `${API_URL}/api/pessoas/`;
      const method = editandoId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setModalAberto(false);
        carregarDados();
      } else {
        const errorData = await res.json();
        setErrorModalMsg(errorData.detail || 'Erro ao salvar pessoa.');
      }
    } catch (err) {
      setErrorModalMsg('Erro de conexão.');
    }
  };

  const deletarPessoa = async (id: number) => {
    if (!window.confirm('Excluir logicamente esta pessoa?')) return;
    try {
      const res = await fetch(`${API_URL}/api/pessoas/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) carregarDados();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User className="text-conecta" size={28} />
            Cadastro de Pessoa (Munícipe)
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>Cadastre e gerencie o perfil de cada munícipe atendido.</p>
        </div>
        <button onClick={abrirNovoModal} className="btn-primary-action">
          <PlusCircle size={18} />
          Cadastrar Pessoa
        </button>
      </div>

      {/* Busca */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Pesquisar por nome, CPF, NIS ou nome social..."
          className="form-control"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Tabela de Pessoas */}
      {carregando ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Carregando cidadãos...</div>
      ) : pessoas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', color: '#64748b' }}>
          Nenhum cidadão cadastrado ou encontrado.
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table className="dashboard-table">
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '14px 16px' }}>Nome Completo / CPF</th>
                <th>NIS / Nascimento</th>
                <th>Parentesco / Família</th>
                <th>Contato</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{p.nome}</div>
                    {p.nome_social && <span style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>({p.nome_social})</span>}
                    <div style={{ fontSize: '12px', color: '#64748b' }}>CPF: {p.cpf}</div>
                  </td>
                  <td>
                    <div>NIS: {p.nis || 'Não informado'}</div>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      Nascimento: {new Date(p.certidao_nascimento_data).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td>
                    <div>{p.parentesco_details?.nome || 'Chefe da Família'}</div>
                    <span style={{ fontSize: '11px', backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                      {p.familia_details?.familia_codigo || 'Sem vínculo'}
                    </span>
                  </td>
                  <td>
                    {p.celular || p.telefone || 'Sem telefone'}
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{p.email || ''}</div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button onClick={() => abrirEditarModal(p)} style={{ border: 'none', backgroundColor: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => deletarPessoa(p.id)} style={{ border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '1150px', borderRadius: '16px', display: 'flex', flexDirection: 'column', maxHeight: '96vh' }}>
            
            {/* Header Modal */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  {editandoId ? 'Editar Pessoa (Munícipe)' : 'Nova Pessoa (Munícipe)'}
                </h3>
                {/* <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Configure os dados de registro social, documentação, saúde, trabalho e rendas.</p> */}
              </div>
              <button onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '0 16px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              {[
                { id: 'pessoais', label: 'Dados Pessoais' },
                { id: 'filiacao', label: 'Filiação & Origem' },
                { id: 'documentos', label: 'Documentos' },
                { id: 'registro', label: 'Registro Civil' },
                { id: 'saude_edu', label: 'Saúde & Educação' },
                { id: 'trabalho', label: 'Trabalho & Rendas' },
                { id: 'observacoes', label: 'Observações' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveModalTab(t.id as any)}
                  style={{
                    padding: '12px 16px',
                    border: 'none',
                    background: 'none',
                    borderBottom: activeModalTab === t.id ? '2px solid #f5911e' : '2px solid transparent',
                    color: activeModalTab === t.id ? '#f5911e' : '#64748b',
                    fontWeight: activeModalTab === t.id ? 600 : 500,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={salvarPessoa} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '24px', flex: 1 }}>

                {/* TAB 1: DADOS PESSOAIS */}
                {activeModalTab === 'pessoais' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Familia *</label>
                        <select className="form-control"></select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Completo *</label>
                        <input type="text" id="input-nome" className="form-control" value={nome} onChange={e => setNome(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Social</label>
                        <input type="text" className="form-control" value={nomeSocial} onChange={e => setNomeSocial(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>NIS</label>
                        <input type="text" className="form-control" value={nis} onChange={e => setNis(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data de Nascimento *</label>
                        <input type="date" id="input-nascimento" className="form-control" value={certidaoNascimentoData} onChange={e => setCertidaoNascimentoData(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Sexo *</label>
                        <select className="form-control" value={sexo} onChange={e => setSexo(e.target.value as any)}>
                          <option value="Fem">Feminino</option>
                          <option value="Masc">Masculino</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Raça/Cor</label>
                        <select className="form-control" value={raca} onChange={e => setRaca(e.target.value)}>
                          <option value="">Selecione...</option>
                          {racas.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Orientação Sexual</label>
                        <select className="form-control" value={orientacaoSexual} onChange={e => setOrientacaoSexual(e.target.value)}>
                          <option value="">Selecione...</option>
                          {orientacoesSexuais.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Estado Civil</label>
                        <select className="form-control" value={tipoEstadoCivil} onChange={e => setTipoEstadoCivil(e.target.value)}>
                          <option value="">Selecione...</option>
                          {estadosCivis.map(ec => <option key={ec.id} value={ec.id}>{ec.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Parentesco</label>
                        <select className="form-control" value={tipoParentesco} onChange={e => setTipoParentesco(e.target.value)}>
                          <option value="">Selecione...</option>
                          {parentescos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Situação de Rua?</label>
                        <select className="form-control" value={situacaoDeRua} onChange={e => setSituacaoDeRua(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                    </div>

                    {situacaoDeRua === 'Não' ? (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Telefone</label>
                          <input type="text" className="form-control" value={telefone} onChange={e => setTelefone(e.target.value)} />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Celular</label>
                          <input type="text" className="form-control" value={celular} onChange={e => setCelular(e.target.value)} />
                        </div>
                        <div>
                          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>E-mail</label>
                          <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        
                        {/* Sub-Abas Secundárias */}
                        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '0 8px', overflowX: 'auto', whiteSpace: 'nowrap', gap: '4px' }}>
                          {[
                            { id: 'inicio', label: 'Início' },
                            { id: 'dormir', label: 'Onde Dorme' },
                            { id: 'vulnerabilidade', label: 'Vulnerabilidades' },
                            { id: 'motivos', label: 'Razões de Rua' },
                            { id: 'atividade', label: 'Atividade Comunitária' },
                            { id: 'atendimento', label: 'Atendimento & Saúde' },
                            { id: 'sustento', label: 'Como se Sustenta' },
                            { id: 'observacoes', label: 'Obs & Cadastro' }
                          ].map(st => (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => setSubTabRua(st.id as any)}
                              style={{
                                padding: '8px 12px',
                                border: 'none',
                                background: 'none',
                                borderBottom: subTabRua === st.id ? '2px solid #1e3a8a' : '2px solid transparent',
                                color: subTabRua === st.id ? '#1e3a8a' : '#64748b',
                                fontWeight: subTabRua === st.id ? 600 : 500,
                                fontSize: '0.78rem',
                                cursor: 'pointer'
                              }}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>

                        {/* Conteúdos das Sub-abas */}
                        
                        {/* 1. INÍCIO */}
                        {subTabRua === 'inicio' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tempo que vive na rua *</label>
                                <select className="form-control" value={tempoViveNaRua} onChange={e => setTempoViveNaRua(e.target.value)}>
                                  <option value="">Selecione...</option>
                                  {temposRua.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tempo que mora na cidade *</label>
                                <select className="form-control" value={tempoMoraNaCidade} onChange={e => setTempoMoraNaCidade(e.target.value)}>
                                  <option value="">Selecione...</option>
                                  {temposCidade.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                </select>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Vive com a família na rua? *</label>
                                <select className="form-control" value={viveComFamiliaRua} onChange={e => setViveComFamiliaRua(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Contato com parente fora de rua? *</label>
                                <select className="form-control" value={contatoParenteForaRua} onChange={e => setContatoParenteForaRua(e.target.value)}>
                                  <option value="">Selecione...</option>
                                  {contatosParentes.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Teve emprego com carteira assinada? *</label>
                                <select className="form-control" value={teveEmpregoCarteiraAssinada} onChange={e => setTeveEmpregoCarteiraAssinada(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                  <option value="Não Sabe">Não Sabe</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. ONDE COSTUMAVA DORMIR */}
                        {subTabRua === 'dormir' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <div style={{ border: '1px solid #f1f5f9', padding: '12px', borderRadius: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Dorme na rua?</label>
                                <select className="form-control" value={dormeRua} onChange={e => setDormeRua(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                                {dormeRua === 'Sim' && (
                                  <div style={{ marginTop: '8px' }}>
                                    <label style={{ fontSize: '11px', color: '#64748b' }}>Frequência semanal (vezes de 0 a 7):</label>
                                    <input type="number" min="0" max="7" className="form-control" value={tempoDormeRua} onChange={e => setTempoDormeRua(e.target.value)} />
                                  </div>
                                )}
                              </div>
                              <div style={{ border: '1px solid #f1f5f9', padding: '12px', borderRadius: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Serviço de Acolhimento / Casa Passagem?</label>
                                <select className="form-control" value={servicoAcolhimento} onChange={e => setServicoAcolhimento(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                                {servicoAcolhimento === 'Sim' && (
                                  <div style={{ marginTop: '8px' }}>
                                    <label style={{ fontSize: '11px', color: '#64748b' }}>Frequência semanal (vezes de 0 a 7):</label>
                                    <input type="number" min="0" max="7" className="form-control" value={tempoServicoAcolhimento} onChange={e => setTempoServicoAcolhimento(e.target.value)} />
                                  </div>
                                )}
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                              <div style={{ border: '1px solid #f1f5f9', padding: '12px', borderRadius: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Dorme em domicílio particular?</label>
                                <select className="form-control" value={domicilioParticular} onChange={e => setDomicilioParticular(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                                {domicilioParticular === 'Sim' && (
                                  <div style={{ marginTop: '8px' }}>
                                    <label style={{ fontSize: '11px', color: '#64748b' }}>Frequência semanal (vezes de 0 a 7):</label>
                                    <input type="number" min="0" max="7" className="form-control" value={tempoDomicilioParticular} onChange={e => setTempoDomicilioParticular(e.target.value)} />
                                  </div>
                                )}
                              </div>
                              <div style={{ border: '1px solid #f1f5f9', padding: '12px', borderRadius: '8px' }}>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Outra forma de dormir?</label>
                                <select className="form-control" value={outroDormir} onChange={e => setOutroDormir(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                                {outroDormir === 'Sim' && (
                                  <div style={{ marginTop: '8px' }}>
                                    <label style={{ fontSize: '11px', color: '#64748b' }}>Frequência semanal (vezes de 0 a 7):</label>
                                    <input type="number" min="0" max="7" className="form-control" value={tempoOutroDormir} onChange={e => setTempoOutroDormir(e.target.value)} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. SITUAÇÃO DE VULNERABILIDADE */}
                        {subTabRua === 'vulnerabilidade' && (
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                            <div>
                              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Exploração Infantil?</label>
                              <select className="form-control" value={exploracaoInfantil} onChange={e => setExploracaoInfantil(e.target.value as any)}>
                                <option value="Não">Não</option>
                                <option value="Sim">Sim</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Exploração Sexual?</label>
                              <select className="form-control" value={exploracaoSexual} onChange={e => setExploracaoSexual(e.target.value as any)}>
                                <option value="Não">Não</option>
                                <option value="Sim">Sim</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Violência Física?</label>
                              <select className="form-control" value={violenciaFisica} onChange={e => setViolenciaFisica(e.target.value as any)}>
                                <option value="Não">Não</option>
                                <option value="Sim">Sim</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Violência Psicológica?</label>
                              <select className="form-control" value={violenciaPsicologica} onChange={e => setViolenciaPsicologica(e.target.value as any)}>
                                <option value="Não">Não</option>
                                <option value="Sim">Sim</option>
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Violência Sexual?</label>
                              <select className="form-control" value={violenciaSexual} onChange={e => setViolenciaSexual(e.target.value as any)}>
                                <option value="Não">Não</option>
                                <option value="Sim">Sim</option>
                              </select>
                            </div>
                          </div>
                        )}

                        {/* 4. RAZÕES VIVER NA RUA */}
                        {subTabRua === 'motivos' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', display: 'block', marginBottom: '4px' }}>Respondeu sobre os motivos? *</label>
                                <select className="form-control" value={respondeuMotivo} onChange={e => {
                                  const val = e.target.value as any;
                                  setRespondeuMotivo(val);
                                  if (val === 'Não') {
                                    setNaoSabeMotivo('Não');
                                    setPerdaMoradia('Não');
                                    setAmeaca('Não');
                                    setProblemasFamilia('Não');
                                    setAlcoolismoDroga('Não');
                                    setDesemprego('Não');
                                    setTrabalhoMotivo('Não');
                                    setSaudeMotivo('Não');
                                    setPreferenciaMotivo('Não');
                                    setEgresso('');
                                    setOutroMotivo('Não');
                                  }
                                }}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              {respondeuMotivo === 'Sim' && (
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Não Sabe os motivos?</label>
                                  <select className="form-control" value={naoSabeMotivo} onChange={e => setNaoSabeMotivo(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                              )}
                            </div>

                            {respondeuMotivo === 'Sim' && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Perda de moradia?</label>
                                  <select className="form-control" value={perdaMoradia} onChange={e => setPerdaMoradia(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Ameaças / Violência?</label>
                                  <select className="form-control" value={ameaca} onChange={e => setAmeaca(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Problemas com familiares?</label>
                                  <select className="form-control" value={problemasFamilia} onChange={e => setProblemasFamilia(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Alcoolismo / Uso drogas?</label>
                                  <select className="form-control" value={alcoolismoDroga} onChange={e => setAlcoolismoDroga(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Desemprego?</label>
                                  <select className="form-control" value={desemprego} onChange={e => setDesemprego(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Fator relacionado ao Trabalho?</label>
                                  <select className="form-control" value={trabalhoMotivo} onChange={e => setTrabalhoMotivo(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tratamento de Saúde?</label>
                                  <select className="form-control" value={saudeMotivo} onChange={e => setSaudeMotivo(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Opção / Preferência?</label>
                                  <select className="form-control" value={preferenciaMotivo} onChange={e => setPreferenciaMotivo(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Outros motivos?</label>
                                  <select className="form-control" value={outroMotivo} onChange={e => setOutroMotivo(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div style={{ gridColumn: 'span 3' }}>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Egresso do sistema prisional / internação?</label>
                                  <input type="text" className="form-control" value={egresso} onChange={e => setEgresso(e.target.value)} placeholder="Ex: Sim, penitenciária X, ou descreva..." />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 5. PARTICIPAÇÃO EM ATIVIDADE COMUNITÁRIA */}
                        {subTabRua === 'atividade' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', display: 'block', marginBottom: '4px' }}>Respondeu sobre atividades? *</label>
                                <select className="form-control" value={respondeuAtividade} onChange={e => {
                                  const val = e.target.value as any;
                                  setRespondeuAtividade(val);
                                  if (val === 'Não') {
                                    setAtividadeEscola('Não');
                                    setAtividadeCooperativa('Não');
                                    setAtividadeMovimentoSocial('Não');
                                    setNaoSabeAtividade('Não');
                                  }
                                }}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              {respondeuAtividade === 'Sim' && (
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Não sabe se frequentou?</label>
                                  <select className="form-control" value={naoSabeAtividade} onChange={e => setNaoSabeAtividade(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                              )}
                            </div>

                            {respondeuAtividade === 'Sim' && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Participa em Escola?</label>
                                  <select className="form-control" value={atividadeEscola} onChange={e => setAtividadeEscola(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Participa em Cooperativa?</label>
                                  <select className="form-control" value={atividadeCooperativa} onChange={e => setAtividadeCooperativa(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Participa em Movimento Social?</label>
                                  <select className="form-control" value={atividadeMovimentoSocial} onChange={e => setAtividadeMovimentoSocial(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 6. ATENDIMENTO E SAÚDE */}
                        {subTabRua === 'atendimento' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                              <div>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Atendido por CRAS?</label>
                                <select className="form-control" value={atendidoCras} onChange={e => setAtendidoCras(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Atendido por CREAS?</label>
                                <select className="form-control" value={atendidoCreas} onChange={e => setAtendidoCreas(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Atendido Centro POP?</label>
                                <select className="form-control" value={atendidoCentroPop} onChange={e => setAtendidoCentroPop(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Local Governamental?</label>
                                <select className="form-control" value={atendidoInstGov} onChange={e => setAtendidoInstGov(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                              <div>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Organização Não Gov?</label>
                                <select className="form-control" value={atendidoInstNaoGov} onChange={e => setAtendidoInstNaoGov(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Hospital Geral?</label>
                                <select className="form-control" value={atendidoHospitalGeral} onChange={e => setAtendidoHospitalGeral(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              <div>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Não foi atendido?</label>
                                <select className="form-control" value={naoAtendido} onChange={e => setNaoAtendido(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              <div style={{ backgroundColor: '#fdf2f8', padding: '2px', borderRadius: '4px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#9d174d', display: 'block', marginBottom: '4px' }}>Usa álcool?</label>
                                <select className="form-control" value={usaAlcool} onChange={e => setUsaAlcool(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                              <div style={{ backgroundColor: '#fdf2f8', padding: '2px', borderRadius: '4px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#9d174d', display: 'block', marginBottom: '4px' }}>Usa outras drogas?</label>
                                <select className="form-control" value={usaDroga} onChange={e => setUsaDroga(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                              <div style={{ backgroundColor: '#fdf2f8', padding: '2px', borderRadius: '4px' }}>
                                <label style={{ fontSize: '11px', fontWeight: 600, color: '#9d174d', display: 'block', marginBottom: '4px' }}>Possui transtorno mental?</label>
                                <select className="form-control" value={transtornoMental} onChange={e => setTranstornoMental(e.target.value as any)}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 7. COMO ADQUIRE SUSTENTO */}
                        {subTabRua === 'sustento' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 700, color: '#1e3a8a', display: 'block', marginBottom: '4px' }}>Respondeu sobre meios de sustento? *</label>
                                <select className="form-control" value={respondeuSustento} onChange={e => {
                                  const val = e.target.value as any;
                                  setRespondeuSustento(val);
                                  if (val === 'Não') {
                                    setSustentoConstrucaoCivil('Não');
                                    setSustentoGuardadorCarro('Não');
                                    setSustentoCarregador('Não');
                                    setSustentoCatador('Não');
                                    setSustentoServicosGerais('Não');
                                    setSustentoPedeDinheiro('Não');
                                    setSustentoVendas('Não');
                                    setSustentoOutro('Não');
                                  }
                                }}>
                                  <option value="Não">Não</option>
                                  <option value="Sim">Sim</option>
                                </select>
                              </div>
                            </div>

                            {respondeuSustento === 'Sim' && (
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Construção Civil?</label>
                                  <select className="form-control" value={sustentoConstrucaoCivil} onChange={e => setSustentoConstrucaoCivil(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Guardador de carro / Flanelinha?</label>
                                  <select className="form-control" value={sustentoGuardadorCarro} onChange={e => setSustentoGuardadorCarro(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Carregador / Carreto?</label>
                                  <select className="form-control" value={sustentoCarregador} onChange={e => setSustentoCarregador(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Catador mat. reciclável?</label>
                                  <select className="form-control" value={sustentoCatador} onChange={e => setSustentoCatador(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Serviços Gerais / Limpeza?</label>
                                  <select className="form-control" value={sustentoServicosGerais} onChange={e => setSustentoServicosGerais(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Pede Dinheiro / Esmolas?</label>
                                  <select className="form-control" value={sustentoPedeDinheiro} onChange={e => setSustentoPedeDinheiro(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Vendas informais?</label>
                                  <select className="form-control" value={sustentoVendas} onChange={e => setSustentoVendas(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Outro meio de sustento?</label>
                                  <select className="form-control" value={sustentoOutro} onChange={e => setSustentoOutro(e.target.value as any)}>
                                    <option value="Não">Não</option>
                                    <option value="Sim">Sim</option>
                                  </select>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* 8. OBSERVAÇÕES & CADASTRO */}
                        {subTabRua === 'observacoes' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Histórico Pessoal / Observações</label>
                              <textarea className="form-control" rows={3} value={historicoPessoal} onChange={e => setHistoricoPessoal(e.target.value)} placeholder="Digite o histórico pessoal ou observações adicionais..." />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data de Cadastro na Situação de Rua *</label>
                                <input type="date" className="form-control" value={dataCadastroRua} onChange={e => setDataCadastroRua(e.target.value)} />
                              </div>
                              <div>
                                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Profissional Responsável</label>
                                <input type="text" className="form-control" value={user?.first_name ? `${user.first_name} (${user.username})` : user?.username || ''} disabled style={{ backgroundColor: '#f1f5f9' }} />
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: FILIAÇÃO E ORIGEM */}
                {activeModalTab === 'filiacao' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Completo da Mãe</label>
                      <input type="text" className="form-control" value={nomeMae} onChange={e => setNomeMae(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Completo do Pai</label>
                      <input type="text" className="form-control" value={nomePai} onChange={e => setNomePai(e.target.value)} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Local de Nascimento (Especie)</label>
                        <select className="form-control" value={tipoLocalNascimento} onChange={e => setTipoLocalNascimento(e.target.value)}>
                          <option value="">Selecione...</option>
                          {locaisNascimento.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Estado (UF)</label>
                        <select className="form-control" value={estadoId} onChange={e => setEstadoId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {estados.map(est => <option key={est.id} value={est.id}>{est.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Município de Nascimento</label>
                        <select className="form-control" value={municipioId} onChange={e => setMunicipioId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {(() => {
                            const selectedCodIbge = estados.find(e => e.id.toString() === estadoId)?.cod_ibge;
                            return municipios
                              .filter(m => !estadoId || m.codigo_uf === selectedCodIbge)
                              .map(mun => <option key={mun.id} value={mun.id}>{mun.municipio}</option>);
                          })()}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: DOCUMENTAÇÃO */}
                {activeModalTab === 'documentos' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>CPF *</label>
                        <input type="text" id="input-cpf" className="form-control" value={cpf} onChange={e => setCpf(e.target.value)} maxLength={11} placeholder="Apenas números" />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>RG / Identidade</label>
                        <input type="text" className="form-control" value={rg} onChange={e => setRg(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Dígito RG</label>
                        <input type="text" className="form-control" value={rgDigito} onChange={e => setRgDigito(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Órgão Emissor RG</label>
                        <input type="text" className="form-control" value={rgOrgaoEmissor} onChange={e => setRgOrgaoEmissor(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>UF Emissão RG</label>
                        <select className="form-control" value={rgUfId} onChange={e => setRgUfId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {estados.map(est => <option key={est.id} value={est.id}>{est.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data Emissão RG</label>
                        <input type="date" className="form-control" value={rgDataEmissao} onChange={e => setRgDataEmissao(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Cartão SUS</label>
                        <input type="text" className="form-control" value={sus} onChange={e => setSus(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>CNH</label>
                        <input type="text" className="form-control" value={cnh} onChange={e => setCnh(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Reservista (Masc)</label>
                        <input type="text" className="form-control" value={reservista} onChange={e => setReservista(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>RNE (Estrangeiro)</label>
                        <input type="text" className="form-control" value={rne} onChange={e => setRne(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>CTPS (Carteira de Trabalho)</label>
                        <input type="text" className="form-control" value={ctps} onChange={e => setCtps(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Série CTPS</label>
                        <input type="text" className="form-control" value={ctpsSerie} onChange={e => setCtpsSerie(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Título Eleitor</label>
                        <input type="text" className="form-control" value={tituloEleitor} onChange={e => setTituloEleitor(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Zona Eleitoral</label>
                        <input type="text" className="form-control" value={tituloEleitorZona} onChange={e => setTituloEleitorZona(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Seção Eleitoral</label>
                        <input type="text" className="form-control" value={tituloEleitorSecao} onChange={e => setTituloEleitorSecao(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: REGISTRO CIVIL */}
                {activeModalTab === 'registro' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Registro Civil</label>
                        <select className="form-control" value={tipoRegistroCivilId} onChange={e => setTipoRegistroCivilId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {registrosCivis.map(rc => <option key={rc.id} value={rc.id}>{rc.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Certidão</label>
                        <select className="form-control" value={certidao} onChange={e => setCertidao(e.target.value)}>
                          <option value="">Selecione...</option>
                          <option value="Nascimento">Nascimento</option>
                          <option value="Casamento">Casamento</option>
                          <option value="RANI">RANI</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nº Certidão</label>
                        <input type="text" className="form-control" value={certidaoNascimento} onChange={e => setCertidaoNascimento(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Termo RANI (Indígena)</label>
                        <input type="text" className="form-control" value={rani} onChange={e => setRani(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nº Matrícula Certidão</label>
                        <input type="text" className="form-control" value={certidaoNumeroMatricula} onChange={e => setCertidaoNumeroMatricula(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome do Cartório</label>
                        <input type="text" className="form-control" value={certidaoNomeCartorio} onChange={e => setCertidaoNomeCartorio(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nº do Livro</label>
                        <input type="text" className="form-control" value={certidaoNumeroLivroRegistro} onChange={e => setCertidaoNumeroLivroRegistro(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Folha do Livro</label>
                        <input type="text" className="form-control" value={certidaoFolhaLivroRegistro} onChange={e => setCertidaoFolhaLivroRegistro(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data Registro Certidão</label>
                        <input type="date" className="form-control" value={certidaoDataRegistro} onChange={e => setCertidaoDataRegistro(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>UF do Registro</label>
                        <select className="form-control" value={certidaoUfRegistroId} onChange={e => setCertidaoUfRegistroId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {estados.map(est => <option key={est.id} value={est.id}>{est.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Município do Registro</label>
                        <select className="form-control" value={certidaoMunicipioRegistroId} onChange={e => setCertidaoMunicipioRegistroId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {(() => {
                            const selectedCodIbge = estados.find(e => e.id.toString() === certidaoUfRegistroId)?.cod_ibge;
                            return municipios
                              .filter(m => !certidaoUfRegistroId || m.codigo_uf === selectedCodIbge)
                              .map(mun => <option key={mun.id} value={mun.id}>{mun.municipio}</option>);
                          })()}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: SAÚDE E EDUCAÇÃO */}
                {activeModalTab === 'saude_edu' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Doença Grave?</label>
                        <select className="form-control" value={portadorDoencaGrave} onChange={e => setPortadorDoencaGrave(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Deficiência</label>
                        <select className="form-control" value={tipoDeficienciaId} onChange={e => setTipoDeficienciaId(e.target.value)}>
                          <option value="">Nenhuma</option>
                          {deficiencias.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Necessita Cuidados?</label>
                        <select className="form-control" value={tipoNecessitaCuidadosId} onChange={e => setTipoNecessitaCuidadosId(e.target.value)}>
                          <option value="">Não</option>
                          {necessidadesCuidados.map(n => <option key={n.id} value={n.id}>{n.nome}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Remédio Controlado?</label>
                        <select className="form-control" value={usaMedicamentoControlado} onChange={e => setUsaMedicamentoControlado(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Remédio Contínuo?</label>
                        <select className="form-control" value={medicamentoContinuo} onChange={e => setMedicamentoContinuo(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Abuso Álcool?</label>
                        <select className="form-control" value={abusoDeAlcool} onChange={e => setAbusoDeAlcool(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Abuso Drogas?</label>
                        <select className="form-control" value={abusoDeDroga} onChange={e => setAbusoDeDroga(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tratamento Saúde?</label>
                        <select className="form-control" value={tratamentoSaude} onChange={e => setTratamentoSaude(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tratamento CAPS</label>
                        <select className="form-control" value={tipoTratamentoCapsId} onChange={e => setTipoTratamentoCapsId(e.target.value)}>
                          <option value="">Nenhum</option>
                          {tratamentosCaps.map(tc => <option key={tc.id} value={tc.id}>{tc.nome}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* EDUCAÇÃO */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Sabe Ler/Escrever?</label>
                        <select className="form-control" value={escreveLe} onChange={e => setEscreveLe(e.target.value as any)}>
                          <option value="Sim">Sim</option>
                          <option value="Não">Não</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome da Escola</label>
                        <input type="text" className="form-control" value={nomeEscola} onChange={e => setNomeEscola(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Cód. INEP</label>
                        <input type="text" className="form-control" value={codigoInepMec} onChange={e => setCodigoInepMec(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Curso Frequenta</label>
                        <select className="form-control" value={tipoCursoFrequentaId} onChange={e => setTipoCursoFrequentaId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Curso Frequenta</label>
                        <input type="text" className="form-control" value={nomeCursoFrequenta} onChange={e => setNomeCursoFrequenta(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Série Frequenta</label>
                        <select className="form-control" value={tipoSerieCursoFrequentaId} onChange={e => setTipoSerieCursoFrequentaId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {series.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Curso Frequentou</label>
                        <select className="form-control" value={tipoCursoFrequentouId} onChange={e => setTipoCursoFrequentouId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Concluiu Curso?</label>
                        <select className="form-control" value={cursoConcluido} onChange={e => setCursoConcluido(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Série Concluiu</label>
                        <select className="form-control" value={tipoSerieCursoConcluidoId} onChange={e => setTipoSerieCursoConcluidoId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {series.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 6: TRABALHO E RENDAS */}
                {activeModalTab === 'trabalho' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Trabalha atualmente?</label>
                        <select className="form-control" value={trabalha} onChange={e => setTrabalha(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo Atividade</label>
                        <select className="form-control" value={tipoAtividadeId} onChange={e => setTipoAtividadeId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {atividades.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Profissão (CBO)</label>
                        <select className="form-control" value={qualificacaoProfissionalCboId} onChange={e => setQualificacaoProfissionalCboId(e.target.value)}>
                          <option value="">Selecione...</option>
                          {cbos.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.nome}</option>)}
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Remuneração Bruta R$</label>
                        <input type="number" step="0.01" className="form-control" value={remuneracaoBruta} onChange={e => setRemuneracaoBruta(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Bolsa Família?</label>
                        <select className="form-control" value={recebeBolsaFamilia} onChange={e => setRecebeBolsaFamilia(e.target.value as any)}>
                          <option value="Não">Não</option>
                          <option value="Sim">Sim</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Valor Bolsa Família R$</label>
                        <input type="number" step="0.01" className="form-control" value={receitaBolsaFamilia} onChange={e => setReceitaBolsaFamilia(e.target.value)} disabled={recebeBolsaFamilia === 'Não'} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Receita BPC R$</label>
                        <input type="number" step="0.01" className="form-control" value={receitaBpc} onChange={e => setReceitaBpc(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Aposentadoria/Pensão R$</label>
                        <input type="number" step="0.01" className="form-control" value={receitaAposentadoria} onChange={e => setReceitaAposentadoria(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Seguro Desemprego R$</label>
                        <input type="number" step="0.01" className="form-control" value={receitaSeguroDesemprego} onChange={e => setReceitaSeguroDesemprego(e.target.value)} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Pensão Alimen. R$</label>
                        <input type="number" step="0.01" className="form-control" value={receitaPensaoAlimenticia} onChange={e => setReceitaPensaoAlimenticia(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Ajuda/Doações R$</label>
                        <input type="number" step="0.01" className="form-control" value={receitaAjudaDoacao} onChange={e => setReceitaAjudaDoacao(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Outras Fontes R$</label>
                        <input type="number" step="0.01" className="form-control" value={receitaOutrasFontes} onChange={e => setReceitaOutrasFontes(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Valor PETI R$</label>
                        <input type="number" step="0.01" className="form-control" value={receitaPeti} onChange={e => setReceitaPeti(e.target.value)} />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 7: OBSERVAÇÕES */}
                {activeModalTab === 'observacoes' && (
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Histórico / Observações Sociais</label>
                    <textarea
                      className="form-control"
                      rows={8}
                      value={observacao}
                      onChange={e => setObservacao(e.target.value)}
                      placeholder="Insira detalhes sobre o contexto familiar, vulnerabilidades específicas identificadas, encaminhamentos ou pareceres sociais..."
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                )}

              </div>

              {/* Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
                <button type="button" onClick={() => setModalAberto(false)} className="form-control" style={{ maxWidth: '100px', cursor: 'pointer', margin: 0 }}>
                  Cancelar
                </button>
                <button type="submit" className="btn conecta text-white" style={{ maxWidth: '120px', marginTop: 0 }}>
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALERT DIALOG ERROR */}
      {errorModalMsg && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '9999px', color: '#ef4444' }}>
              <AlertCircle size={32} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Validação Falhou</h4>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>{errorModalMsg}</p>
            </div>
            <button 
              type="button" 
              onClick={() => {
                setErrorModalMsg(null);
                if (fieldToFocus) {
                  setActiveModalTab(fieldToFocus.tab);
                  setTimeout(() => {
                    const el = document.getElementById(fieldToFocus.id);
                    if (el) el.focus();
                    setFieldToFocus(null);
                  }, 100);
                }
              }} 
              className="btn conecta text-white" 
              style={{ width: '100%', marginTop: '8px' }}
            >
              Fechar e Corrigir
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
