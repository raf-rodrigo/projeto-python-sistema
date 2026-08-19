import { useState, useEffect } from 'react';
import { User, PlusCircle, AlertCircle } from 'lucide-react';

import { PersonTable } from './pessoa-cidadao/PersonTable';
import { PersonEditModal } from './pessoa-cidadao/PersonEditModal';

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
  parentesco_details?: TabelaBasicaItem;
  familia_details?: {
    id: number;
    familia_codigo?: string;
  };
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
  const [familias, setFamilias] = useState<TabelaBasicaItem[]>([]);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'pessoais' | 'filiacao' | 'documentos' | 'registro' | 'saude_edu' | 'trabalho' | 'observacoes'>('pessoais');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);
  const [fieldToFocus, setFieldToFocus] = useState<{ id: string; tab: any } | null>(null);

  // Travamento do select de família
  const [lockFamiliaSelect, setLockFamiliaSelect] = useState(false);

  // Estados do Formulário
  const [familiaDomicilio, setFamiliaDomicilio] = useState('');
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
  const [situacaoDeRua, setSituacaoDeRua] = useState<'Padrao' | 'Rua' | 'Migrante' | 'Ambos'>('Padrao');
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
  const [dataCadastroRua, setDataCadastroRua] = useState(() => new Date().toISOString().split('T')[0]);

  // Tab 2: Filiação
  const [nomeMae, setNomeMae] = useState('');
  const [nomePai, setNomePai] = useState('');
  const [tipoLocalNascimento, setTipoLocalNascimento] = useState('');
  const [estadoId, setEstadoId] = useState('');
  const [municipioId, setMunicipioId] = useState('');

  // Tab 3: Documentação
  const [rg, setRg] = useState('');
  const [rgDigito, setRgDigito] = useState('');
  const [rgOrgaoEmissor, setRgOrgaoEmissor] = useState('');
  const [rgUfId, setRgUfId] = useState('');
  const [rgDataEmissao, setRgDataEmissao] = useState('');
  const [sus, setSus] = useState('');
  const [cnh, setCnh] = useState('');
  const [reservista, setReservista] = useState('');
  const [rne, setRne] = useState('');
  const [ctps, setCtps] = useState('');
  const [ctpsSerie] = useState('');
  const [tituloEleitor, setTituloEleitor] = useState('');
  const [tituloEleitorZona, setTituloEleitorZona] = useState('');
  const [tituloEleitorSecao, setTituloEleitorSecao] = useState('');

  // Tab 4: Registro Civil
  const [tipoRegistroCivilId, setTipoRegistroCivilId] = useState('');
  const [certidao, setCertidao] = useState('');
  const [certidaoNascimento, setCertidaoNascimento] = useState('');
  const [rani, setRani] = useState('');
  const [certidaoNumeroMatricula, setCertidaoNumeroMatricula] = useState('');
  const [certidaoNomeCartorio, setCertidaoNomeCartorio] = useState('');
  const [certidaoNumeroLivroRegistro, setCertidaoNumeroLivroRegistro] = useState('');
  const [certidaoFolhaLivroRegistro, setCertidaoFolhaLivroRegistro] = useState('');
  const [certidaoDataRegistro, setCertidaoDataRegistro] = useState('');
  const [certidaoUfRegistroId, setCertidaoUfRegistroId] = useState('');
  const [certidaoMunicipioRegistroId, setCertidaoMunicipioRegistroId] = useState('');

  // Tab 5: Saúde e Educação
  const [portadorDoencaGrave, setPortadorDoencaGrave] = useState<'Sim' | 'Não'>('Não');
  const [tipoDeficienciaId, setTipoDeficienciaId] = useState('');
  const [tipoNecessitaCuidadosId, setTipoNecessitaCuidadosId] = useState('');
  const [usaMedicamentoControlado, setUsaMedicamentoControlado] = useState<'Sim' | 'Não'>('Não');
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

  // Tab 6: Trabalho
  const [trabalha, setTrabalha] = useState<'Sim' | 'Não'>('Não');
  const [afastadoTrabalho, setAfastadoTrabalho] = useState<'Sim' | 'Não'>('Não');
  const [atividadeAgricula, setAtividadeAgricula] = useState<'Sim' | 'Não'>('Não');
  const [tipoAtividadeId, setTipoAtividadeId] = useState('');
  const [qualificacaoProfissionalCboId, setQualificacaoProfissionalCboId] = useState('');
  const [remuneracaoBruta, setRemuneracaoBruta] = useState('');
  const [recebeBolsaFamilia, setRecebeBolsaFamilia] = useState<'Sim' | 'Não'>('Não');
  const [receitaBolsaFamilia, setReceitaBolsaFamilia] = useState('');
  const [receitaBpc, setReceitaBpc] = useState('');
  const [receitaAposentadoria, setReceitaAposentadoria] = useState('');
  const [receitaSeguroDesemprego, setReceitaSeguroDesemprego] = useState('');
  const [receitaPensaoAlimenticia, setReceitaPensaoAlimenticia] = useState('');
  const [receitaAjudaDoacao, setReceitaAjudaDoacao] = useState('');
  const [receitaOutrasFontes, setReceitaOutrasFontes] = useState('');
  const [receitaPeti, setReceitaPeti] = useState('');

  // Tab 7: Observação Geral
  const [observacao, setObservacao] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const res = await fetch(`${API_URL}/api/pessoas/?search=${encodeURIComponent(busca)}`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPessoas(data.results || data || []);
      }

      // Tabelas Básicas
      const responseParentesco = await fetch(`${API_URL}/api/tipo_parentesco/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseParentesco.ok) {
        const d = await responseParentesco.json();
        setParentescos(d.results || d || []);
      }

      const responseRaca = await fetch(`${API_URL}/api/raca/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseRaca.ok) {
        const d = await responseRaca.json();
        setRacas(d.results || d || []);
      }

      const responseOrientacao = await fetch(`${API_URL}/api/orientacao_sexual/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseOrientacao.ok) {
        const d = await responseOrientacao.json();
        setOrientacoesSexuais(d.results || d || []);
      }

      const responseEstadoCivil = await fetch(`${API_URL}/api/tipo_estado_civil/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseEstadoCivil.ok) {
        const d = await responseEstadoCivil.json();
        setEstadosCivis(d.results || d || []);
      }

      const responseLocalNascimento = await fetch(`${API_URL}/api/tipo_local_nascimento/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseLocalNascimento.ok) {
        const d = await responseLocalNascimento.json();
        setLocaisNascimento(d.results || d || []);
      }

      const responseEstados = await fetch(`${API_URL}/api/estados/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseEstados.ok) {
        const d = await responseEstados.json();
        setEstados(d.results || d || []);
      }

      const responseMunicipios = await fetch(`${API_URL}/api/municipios/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseMunicipios.ok) {
        const d = await responseMunicipios.json();
        setMunicipios(d.results || d || []);
      }

      const responseRegistroCivil = await fetch(`${API_URL}/api/tipo_registro_civil/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseRegistroCivil.ok) {
        const d = await responseRegistroCivil.json();
        setRegistrosCivis(d.results || d || []);
      }

      const responseDeficiencias = await fetch(`${API_URL}/api/tipo_deficiencia/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseDeficiencias.ok) {
        const d = await responseDeficiencias.json();
        setDeficiencias(d.results || d || []);
      }

      const responseNecessidades = await fetch(`${API_URL}/api/tipo_necessita_cuidados/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseNecessidades.ok) {
        const d = await responseNecessidades.json();
        setNecessidadesCuidados(d.results || d || []);
      }

      const responseCaps = await fetch(`${API_URL}/api/tipo_tratamento_caps/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseCaps.ok) {
        const d = await responseCaps.json();
        setTratamentosCaps(d.results || d || []);
      }

      const responseCursos = await fetch(`${API_URL}/api/tipo_curso/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseCursos.ok) {
        const d = await responseCursos.json();
        setCursos(d.results || d || []);
      }

      const responseSeries = await fetch(`${API_URL}/api/tipo_serie/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseSeries.ok) {
        const d = await responseSeries.json();
        setSeries(d.results || d || []);
      }

      const responseAtividades = await fetch(`${API_URL}/api/tipo_atividade/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseAtividades.ok) {
        const d = await responseAtividades.json();
        setAtividades(d.results || d || []);
      }

      const responseCbos = await fetch(`${API_URL}/api/cbo/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseCbos.ok) {
        const d = await responseCbos.json();
        setCbos(d.results || d || []);
      }

      const responseTemposRua = await fetch(`${API_URL}/api/tempo_rua/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseTemposRua.ok) {
        const d = await responseTemposRua.json();
        setTemposRua(d.results || d || []);
      }

      const responseTemposCidade = await fetch(`${API_URL}/api/tempo_cidade/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseTemposCidade.ok) {
        const d = await responseTemposCidade.json();
        setTemposCidade(d.results || d || []);
      }

      const responseContatos = await fetch(`${API_URL}/api/contato_parente/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseContatos.ok) {
        const d = await responseContatos.json();
        setContatosParentes(d.results || d || []);
      }

      const responseFamilias = await fetch(`${API_URL}/api/familias_domicilios/`, { headers: { 'Authorization': `Token ${token}` } });
      if (responseFamilias.ok) {
        const fData = await responseFamilias.json();
        setFamilias(fData.results || fData || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [busca]);

  // Vínculo reativo e travamento vindo de adicionar membro de família
  useEffect(() => {
    const pendenteId = localStorage.getItem('editandoPessoaPendenteId');
    if (pendenteId && pessoas.length > 0) {
      localStorage.removeItem('editandoPessoaPendenteId');
      const pObj = pessoas.find(p => p.id.toString() === pendenteId.toString());
      if (pObj) {
        abrirEditarModal(pObj);
      }
    }

    const abrirImediato = localStorage.getItem('abrirCadastroNovaPessoaImediato');
    const familiaId = localStorage.getItem('familiaPendenteVinculoId');
    if (abrirImediato === 'true' && familias.length > 0) {
      localStorage.removeItem('abrirCadastroNovaPessoaImediato');
      abrirNovoModal();
      if (familiaId) {
        setFamiliaDomicilio(familiaId);
        setLockFamiliaSelect(true);
      }
    }
  }, [pessoas, familias]);

  const abrirNovoModal = () => {
    setEditandoId(null);
    setFamiliaDomicilio('');
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
    setSituacaoDeRua('Padrao');
    setTempoViveNaRua('');
    setTempoMoraNaCidade('');
    setViveComFamiliaRua('Não');
    setContatoParenteForaRua('');
    setTeveEmpregoCarteiraAssinada('Não');
    setDormeRua('Não');
    setTempoDormeRua('');
    setServicoAcolhimento('Não');
    setTempoServicoAcolhimento('');
    setDomicilioParticular('Não');
    setTempoDomicilioParticular('');
    setOutroDormir('Não');
    setTempoOutroDormir('');
    setExploracaoInfantil('Não');
    setExploracaoSexual('Não');
    setViolenciaFisica('Não');
    setViolenciaPsicologica('Não');
    setViolenciaSexual('Não');
    setRespondeuMotivo('Não');
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
    setRespondeuAtividade('Não');
    setAtividadeEscola('Não');
    setAtividadeCooperativa('Não');
    setAtividadeMovimentoSocial('Não');
    setNaoSabeAtividade('Não');
    setAtendidoCras('Não');
    setAtendidoCreas('Não');
    setAtendidoCentroPop('Não');
    setAtendidoInstGov('Não');
    setAtendidoInstNaoGov('Não');
    setAtendidoHospitalGeral('Não');
    setNaoAtendido('Não');
    setUsaAlcool('Não');
    setUsaDroga('Não');
    setTranstornoMental('Não');
    setRespondeuSustento('Não');
    setSustentoConstrucaoCivil('Não');
    setSustentoGuardadorCarro('Não');
    setSustentoCarregador('Não');
    setSustentoCatador('Não');
    setSustentoServicosGerais('Não');
    setSustentoPedeDinheiro('Não');
    setSustentoVendas('Não');
    setSustentoOutro('Não');
    setHistoricoPessoal('');
    setDataCadastroRua(new Date().toISOString().split('T')[0]);
    setNomeMae('');
    setNomePai('');
    setTipoLocalNascimento('');
    setEstadoId('');
    setMunicipioId('');
    setRg('');
    setRgDigito('');
    setRgOrgaoEmissor('');
    setRgUfId('');
    setRgDataEmissao('');
    setSus('');
    setCnh('');
    setReservista('');
    setRne('');
    setCtps('');
    setTituloEleitor('');
    setTituloEleitorZona('');
    setTituloEleitorSecao('');
    setTipoRegistroCivilId('');
    setCertidao('');
    setCertidaoNascimento('');
    setRani('');
    setCertidaoNumeroMatricula('');
    setCertidaoNomeCartorio('');
    setCertidaoNumeroLivroRegistro('');
    setCertidaoFolhaLivroRegistro('');
    setCertidaoDataRegistro('');
    setCertidaoUfRegistroId('');
    setCertidaoMunicipioRegistroId('');
    setPortadorDoencaGrave('Não');
    setTipoDeficienciaId('');
    setTipoNecessitaCuidadosId('');
    setUsaMedicamentoControlado('Não');
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
    setRemuneracaoBruta('');
    setRecebeBolsaFamilia('Não');
    setReceitaBolsaFamilia('');
    setReceitaBpc('');
    setReceitaAposentadoria('');
    setReceitaSeguroDesemprego('');
    setReceitaPensaoAlimenticia('');
    setReceitaAjudaDoacao('');
    setReceitaOutrasFontes('');
    setReceitaPeti('');
    setObservacao('');
    
    setLockFamiliaSelect(false);
    setActiveModalTab('pessoais');
    setErrorModalMsg(null);
    setModalAberto(true);
  };

  const abrirEditarModal = (p: any) => {
    setEditandoId(p.id);
    setFamiliaDomicilio(p.familia_domicilio || '');
    setNome(p.nome || '');
    setNomeSocial(p.nome_social || '');
    setNis(p.nis || '');
    setCertidaoNascimentoData(p.certidao_nascimento_data || '');
    setSexo(p.sexo || 'Fem');
    setCpf(p.cpf || '');
    setTelefone(p.telefone || '');
    setCelular(p.celular || '');
    setEmail(p.email || '');
    setTipoParentesco(p.tipo_parentesco || '');
    setRaca(p.raca || '');
    setTipoEstadoCivil(p.tipo_estado_civil || '');
    setOrientacaoSexual(p.orientacao_sexual || '');
    setSituacaoDeRua(p.situacao_de_rua || 'Padrao');

    if (p.situacao_rua_detalhes) {
      const d = p.situacao_rua_detalhes;
      setTempoViveNaRua(d.tempo_vive_na_rua || '');
      setTempoMoraNaCidade(d.tempo_mora_na_cidade || '');
      setViveComFamiliaRua(d.vive_com_familia_rua || 'Não');
      setContatoParenteForaRua(d.contato_parente_fora_rua || '');
      setTeveEmpregoCarteiraAssinada(d.teve_emprego_carteira_assinada || 'Não');
      setDormeRua(d.dorme_rua || 'Não');
      setTempoDormeRua(d.tempo_dorme_rua || '');
      setServicoAcolhimento(d.servico_acolhimento || 'Não');
      setTempoServicoAcolhimento(d.tempo_servico_acolhimento || '');
      setDomicilioParticular(d.domicilio_particular || 'Não');
      setTempoDomicilioParticular(d.tempo_domicilio_particular || '');
      setOutroDormir(d.outro_dormir || 'Não');
      setTempoOutroDormir(d.tempo_outro_dormir || '');
      setExploracaoInfantil(d.exploracao_infantil || 'Não');
      setExploracaoSexual(d.exploracao_sexual || 'Não');
      setViolenciaFisica(d.violencia_fisica || 'Não');
      setViolenciaPsicologica(d.violencia_psicologica || 'Não');
      setViolenciaSexual(d.violencia_sexual || 'Não');
      setRespondeuMotivo(d.respondeu_motivo || 'Não');
      setNaoSabeMotivo(d.nao_sabe_motivo || 'Não');
      setPerdaMoradia(d.perda_moradia || 'Não');
      setAmeaca(d.ameaca || 'Não');
      setProblemasFamilia(d.problemas_familia || 'Não');
      setAlcoolismoDroga(d.alcoolismo_droga || 'Não');
      setDesemprego(d.desemprego || 'Não');
      setTrabalhoMotivo(d.trabalho_motivo || 'Não');
      setSaudeMotivo(d.saude_motivo || 'Não');
      setPreferenciaMotivo(d.preferencia_motivo || 'Não');
      setEgresso(d.egresso || '');
      setOutroMotivo(d.outro_motivo || 'Não');
      setRespondeuAtividade(d.respondeu_atividade || 'Não');
      setAtividadeEscola(d.atividade_escola || 'Não');
      setAtividadeCooperativa(d.atividade_cooperativa || 'Não');
      setAtividadeMovimentoSocial(d.atividade_movimento_social || 'Não');
      setNaoSabeAtividade(d.nao_sabe_atividade || 'Não');
      setAtendidoCras(d.atendido_cras || 'Não');
      setAtendidoCreas(d.atendido_creas || 'Não');
      setAtendidoCentroPop(d.atendido_centro_pop || 'Não');
      setAtendidoInstGov(d.atendido_inst_gov || 'Não');
      setAtendidoInstNaoGov(d.atendido_inst_nao_gov || 'Não');
      setAtendidoHospitalGeral(d.atendido_hospital_geral || 'Não');
      setNaoAtendido(d.nao_atendido || 'Não');

      setRespondeuSustento(d.respondeu_sustento || 'Não');
      setSustentoConstrucaoCivil(d.sustento_construcao_civil || 'Não');
      setSustentoGuardadorCarro(d.sustento_guardador_carro || 'Não');
      setSustentoCarregador(d.sustento_carregador || 'Não');
      setSustentoCatador(d.sustento_catador || 'Não');
      setSustentoServicosGerais(d.sustento_servicos_generais || 'Não');
      setSustentoPedeDinheiro(d.sustento_pede_dinheiro || 'Não');
      setSustentoVendas(d.sustento_vendas || 'Não');
      setSustentoOutro(d.sustento_outro || 'Não');
      setHistoricoPessoal(d.historico_pessoal || '');
      setDataCadastroRua(d.data_cadastro_rua || new Date().toISOString().split('T')[0]);
    } else {
      setTempoViveNaRua('');
      setTempoMoraNaCidade('');
      setViveComFamiliaRua('Não');
      setContatoParenteForaRua('');
      setTeveEmpregoCarteiraAssinada('Não');
      setDormeRua('Não');
      setTempoDormeRua('');
      setServicoAcolhimento('Não');
      setTempoServicoAcolhimento('');
      setDomicilioParticular('Não');
      setTempoDomicilioParticular('');
      setOutroDormir('Não');
      setTempoOutroDormir('');
      setExploracaoInfantil('Não');
      setExploracaoSexual('Não');
      setViolenciaFisica('Não');
      setViolenciaPsicologica('Não');
      setViolenciaSexual('Não');
      setRespondeuMotivo('Não');
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
      setRespondeuAtividade('Não');
      setAtividadeEscola('Não');
      setAtividadeCooperativa('Não');
      setAtividadeMovimentoSocial('Não');
      setNaoSabeAtividade('Não');
      setAtendidoCras('Não');
      setAtendidoCreas('Não');
      setAtendidoCentroPop('Não');
      setAtendidoInstGov('Não');
      setAtendidoInstNaoGov('Não');
      setAtendidoHospitalGeral('Não');
      setNaoAtendido('Não');
      setUsaAlcool('Não');
      setUsaDroga('Não');
      setTranstornoMental('Não');
      setRespondeuSustento('Não');
      setSustentoConstrucaoCivil('Não');
      setSustentoGuardadorCarro('Não');
      setSustentoCarregador('Não');
      setSustentoCatador('Não');
      setSustentoServicosGerais('Não');
      setSustentoPedeDinheiro('Não');
      setSustentoVendas('Não');
      setSustentoOutro('Não');
      setHistoricoPessoal('');
      setDataCadastroRua(new Date().toISOString().split('T')[0]);
    }

    setNomeMae(p.nome_mae || '');
    setNomePai(p.nome_pai || '');
    setTipoLocalNascimento(p.tipo_local_nascimento || '');
    setEstadoId(p.estado || '');
    setMunicipioId(p.municipio || '');

    setRg(p.rg || '');
    setRgDigito(p.rg_digito || '');
    setRgOrgaoEmissor(p.rg_orgao_emissor || '');
    setRgUfId(p.rg_uf || '');
    setRgDataEmissao(p.rg_data_emissao || '');
    setSus(p.sus || '');
    setCnh(p.cnh || '');
    setReservista(p.reservista || '');
    setRne(p.rne || '');
    setCtps(p.ctps || '');
    setTituloEleitor(p.titulo_eleitor || '');
    setTituloEleitorZona(p.titulo_eleitor_zona || '');
    setTituloEleitorSecao(p.titulo_eleitor_secao || '');

    setTipoRegistroCivilId(p.tipo_registro_civil || '');
    setCertidao(p.certidao || '');
    setCertidaoNascimento(p.certidao_nascimento || '');
    setRani(p.rani || '');
    setCertidaoNumeroMatricula(p.certidao_numero_matricula || '');
    setCertidaoNomeCartorio(p.certidao_nome_cartorio || '');
    setCertidaoNumeroLivroRegistro(p.certidao_numero_livro_registro || '');
    setCertidaoFolhaLivroRegistro(p.certidao_folha_livro_registro || '');
    setCertidaoDataRegistro(p.certidao_data_registro || '');
    setCertidaoUfRegistroId(p.certidao_uf_registro || '');
    setCertidaoMunicipioRegistroId(p.certidao_municipio_registro || '');

    setPortadorDoencaGrave(p.portador_doenca_grave || 'Não');
    setTipoDeficienciaId(p.tipo_deficiencia || '');
    setTipoNecessitaCuidadosId(p.tipo_necessita_cuidados || '');
    setUsaMedicamentoControlado(p.usa_medicamento_controlado || 'Não');
    setMedicamentoContinuo(p.medicamento_continuo || 'Não');
    setUsaAlcool(p.usa_alcool || 'Não');
    setUsaDroga(p.usa_droga || 'Não');
    setTranstornoMental(p.transtorno_mental || 'Não');
    setTratamentoSaude(p.tratamento_saude || 'Não');
    setTipoTratamentoCapsId(p.tipo_tratamento_caps || '');

    setEscreveLe(p.escreve_le || 'Sim');
    setNomeEscola(p.nome_escola || '');
    setCodigoInepMec(p.codigo_inep_mec || '');
    setLocalizadaMunicipio(p.localizada_municipio || 'Sim');
    setEstadoMunicipioEscolaId(p.estado_municipio_escola || '');
    setMunicipalEscolaMembroId(p.municipal_escola_membro || '');
    setTipoCursoFrequentaId(p.tipo_curso_frequenta || '');
    setNomeCursoFrequenta(p.nome_curso_frequenta || '');
    setTipoSerieCursoFrequentaId(p.tipo_serie_curso_frequenta || '');
    setTipoCursoFrequentouId(p.tipo_curso_frequentou || '');
    setCursoConcluido(p.curso_concluido || 'Não');
    setTipoSerieCursoConcluidoId(p.tipo_serie_curso_concluido || '');

    setTrabalha(p.trabalha || 'Não');
    setAfastadoTrabalho(p.afastado_trabalho || 'Não');
    setAtividadeAgricula(p.atividade_agricula || 'Não');
    setTipoAtividadeId(p.tipo_atividade || '');
    setQualificacaoProfissionalCboId(p.qualificacao_profissional_cbo || '');
    setRemuneracaoBruta(p.remuneracao_bruta || '');
    setRecebeBolsaFamilia(p.recebe_bolsa_familia || 'Não');
    setReceitaBolsaFamilia(p.receita_bolsa_familia || '');
    setReceitaBpc(p.receita_beneficio_prestacao_continuada || '');
    setReceitaAposentadoria(p.receita_aposentadoria_pensao || '');
    setReceitaSeguroDesemprego(p.receita_seguro_desemprego || '');
    setReceitaPensaoAlimenticia(p.receita_pensao_alimenticia || '');
    setReceitaAjudaDoacao(p.receita_ajuda_doacao_regular || '');
    setReceitaOutrasFontes(p.receita_outras_fontes || '');
    setReceitaPeti(p.receita_programa_erradicacao_trabalho_infantil || '');

    setObservacao(p.observacao || '');
    
    setLockFamiliaSelect(false);
    setActiveModalTab('pessoais');
    setErrorModalMsg(null);
    setModalAberto(true);
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

  const salvarPessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !certidaoNascimentoData) {
      setFieldToFocus({ id: 'input-nome', tab: 'pessoais' });
      setErrorModalMsg('O campo Nome Completo e Data de Nascimento são obrigatórios!');
      return;
    }

    if (!cpf.trim() || cpf.replace(/\D/g, '').length !== 11) {
      setFieldToFocus({ id: 'input-cpf', tab: 'documentos' });
      setErrorModalMsg('O campo CPF é obrigatório e precisa ter 11 dígitos!');
      return;
    }

    const payload = {
      familia_domicilio: familiaDomicilio ? parseInt(familiaDomicilio) : null,
      nome,
      nome_social: nomeSocial || null,
      nis: nis || null,
      certidao_nascimento_data: certidaoNascimentoData,
      sexo,
      cpf,
      telefone: telefone || null,
      celular: celular || null,
      email: email || null,
      tipo_parentesco: tipoParentesco ? parseInt(tipoParentesco) : null,
      raca: raca ? parseInt(raca) : null,
      tipo_estado_civil: tipoEstadoCivil ? parseInt(tipoEstadoCivil) : null,
      orientacao_sexual: orientacaoSexual ? parseInt(orientacaoSexual) : null,
      situacao_de_rua: situacaoDeRua,
      situacao_rua_detalhes: (situacaoDeRua === 'Rua' || situacaoDeRua === 'Ambos') ? {
        tempo_vive_na_rua: tempoViveNaRua || null,
        tempo_mora_na_cidade: tempoMoraNaCidade || null,
        vive_com_familia_rua: viveComFamiliaRua,
        contato_parente_fora_rua: contatoParenteForaRua || null,
        teve_emprego_carteira_assinada: teveEmpregoCarteiraAssinada,
        dorme_rua: dormeRua,
        tempo_dorme_rua: tempoDormeRua || null,
        servico_acolhimento: servicoAcolhimento,
        tempo_servico_acolhimento: tempoServicoAcolhimento || null,
        domicilio_particular: domicilioParticular,
        tempo_domicilio_particular: tempoDomicilioParticular || null,
        outro_dormir: outroDormir,
        tempo_outro_dormir: tempoOutroDormir || null,
        exploracao_infantil: exploracaoInfantil,
        exploracao_sexual: exploracaoSexual,
        violencia_fisica: violenciaFisica,
        violencia_psicologica: violenciaPsicologica,
        violencia_sexual: violenciaSexual,
        respondeu_motivo: respondeuMotivo,
        nao_sabe_motivo: naoSabeMotivo,
        perda_moradia: perdaMoradia,
        ameaca: ameaca,
        problemas_familia: problemasFamilia,
        alcoolismo_droga: alcoolismoDroga,
        desemprego: desemprego,
        trabalho_motivo: trabalhoMotivo,
        saude_motivo: saudeMotivo,
        preferencia_motivo: preferenciaMotivo,
        egresso: egresso || null,
        outro_motivo: outroMotivo,
        respondeu_atividade: respondeuAtividade,
        atividade_escola: atividadeEscola,
        atividade_cooperativa: atividadeCooperativa,
        atividade_movimento_social: atividadeMovimentoSocial,
        nao_sabe_atividade: naoSabeAtividade,
        atendido_cras: atendidoCras,
        atendido_creas: atendidoCreas,
        atendido_centro_pop: atendidoCentroPop,
        atendido_inst_gov: atendidoInstGov,
        atendido_inst_nao_gov: atendidoInstNaoGov,
        atendido_hospital_geral: atendidoHospitalGeral,
        nao_atendido: naoAtendido,

        respondeu_sustento: respondeuSustento,
        sustento_construcao_civil: sustentoConstrucaoCivil,
        sustento_guardador_carro: sustentoGuardadorCarro,
        sustento_carregador: sustentoCarregador,
        sustento_catador: sustentoCatador,
        sustento_servicos_generais: sustentoServicosGerais,
        sustento_pede_dinheiro: sustentoPedeDinheiro,
        sustento_vendas: sustentoVendas,
        sustento_outro: sustentoOutro,
        historico_pessoal: historicoPessoal || null,
        data_cadastro_rua: dataCadastroRua
      } : null,
      nome_mae: nomeMae || null,
      nome_pai: nomePai || null,
      tipo_local_nascimento: tipoLocalNascimento ? parseInt(tipoLocalNascimento) : null,
      estado: estadoId ? parseInt(estadoId) : null,
      municipio: municipioId ? parseInt(municipioId) : null,
      rg: rg || null,
      rg_digito: rgDigito || null,
      rg_orgao_emissor: rgOrgaoEmissor || null,
      rg_uf: rgUfId ? parseInt(rgUfId) : null,
      rg_data_emissao: rgDataEmissao || null,
      sus: sus || null,
      cnh: cnh || null,
      reservista: reservista || null,
      rne: rne || null,
      ctps: ctps || null,
      titulo_eleitor: tituloEleitor || null,
      titulo_eleitor_zona: tituloEleitorZona || null,
      titulo_eleitor_secao: tituloEleitorSecao || null,
      tipo_registro_civil: tipoRegistroCivilId ? parseInt(tipoRegistroCivilId) : null,
      certidao: certidao || null,
      certidao_nascimento: certidaoNascimento || null,
      rani: rani || null,
      certidao_numero_matricula: certidaoNumeroMatricula || null,
      certidao_nome_cartorio: certidaoNomeCartorio || null,
      certidao_numero_livro_registro: certidaoNumeroLivroRegistro || null,
      certidao_folha_livro_registro: certidaoFolhaLivroRegistro || null,
      portador_doenca_grave: portadorDoencaGrave,
      tipo_deficiencia: tipoDeficienciaId ? parseInt(tipoDeficienciaId) : null,
      tipo_necessita_cuidados: tipoNecessitaCuidadosId ? parseInt(tipoNecessitaCuidadosId) : null,
      usa_medicamento_controlado: usaMedicamentoControlado,
      usa_alcool: usaAlcool,
      usa_droga: usaDroga,
      transtorno_mental: transtornoMental,
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
        
        const deFamilia = localStorage.getItem('veioDeFamiliaVinculo');
        if (deFamilia === 'true') {
          window.location.hash = 'familias';
        }
      } else {
        const errorData = await res.json();
        setErrorModalMsg(errorData.detail || 'Erro ao salvar pessoa.');
      }
    } catch (err) {
      setErrorModalMsg('Erro de conexão.');
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

      {/* Tabela de Munícipes */}
      <PersonTable 
        pessoas={pessoas}
        carregando={carregando}
        abrirEditarModal={abrirEditarModal}
        deletarPessoa={deletarPessoa}
      />

      {/* Modal Principal de Cadastro/Edição de Munícipes */}
      {modalAberto && (
        <PersonEditModal 
          editandoId={editandoId}
          activeModalTab={activeModalTab}
          setActiveModalTab={setActiveModalTab}
          setModalAberto={setModalAberto}
          salvarPessoa={salvarPessoa}
          lockFamiliaSelect={lockFamiliaSelect}
          familias={familias}
          racas={racas}
          orientacoesSexuais={orientacoesSexuais}
          estadosCivis={estadosCivis}
          parentescos={parentescos}
          locaisNascimento={locaisNascimento}
          estados={estados}
          municipios={municipios}
          registrosCivis={registrosCivis}
          deficiencias={deficiencias}
          necessidadesCuidados={necessidadesCuidados}
          tratamentosCaps={tratamentosCaps}
          cursos={cursos}
          series={series}
          atividades={atividades}
          cbos={cbos}
          temposRua={temposRua}
          temposCidade={temposCidade}
          contatosParentes={contatosParentes}
          familiaDomicilio={familiaDomicilio}
          setFamiliaDomicilio={setFamiliaDomicilio}
          nome={nome}
          setNome={setNome}
          nomeSocial={nomeSocial}
          setNomeSocial={setNomeSocial}
          nis={nis}
          setNis={setNis}
          certidaoNascimentoData={certidaoNascimentoData}
          setCertidaoNascimentoData={setCertidaoNascimentoData}
          sexo={sexo}
          setSexo={setSexo}
          raca={raca}
          setRaca={setRaca}
          orientacaoSexual={orientacaoSexual}
          setOrientacaoSexual={setOrientacaoSexual}
          tipoEstadoCivil={tipoEstadoCivil}
          setTipoEstadoCivil={setTipoEstadoCivil}
          tipoParentesco={tipoParentesco}
          setTipoParentesco={setTipoParentesco}
          situacaoDeRua={situacaoDeRua}
          setSituacaoDeRua={setSituacaoDeRua}
          telefone={telefone}
          setTelefone={setTelefone}
          celular={celular}
          setCelular={setCelular}
          email={email}
          setEmail={setEmail}
          subTabRua={subTabRua}
          setSubTabRua={setSubTabRua}
          tempoViveNaRua={tempoViveNaRua}
          setTempoViveNaRua={setTempoViveNaRua}
          tempoMoraNaCidade={tempoMoraNaCidade}
          setTempoMoraNaCidade={setTempoMoraNaCidade}
          viveComFamiliaRua={viveComFamiliaRua}
          setViveComFamiliaRua={setViveComFamiliaRua}
          contatoParenteForaRua={contatoParenteForaRua}
          setContatoParenteForaRua={setContatoParenteForaRua}
          teveEmpregoCarteiraAssinada={teveEmpregoCarteiraAssinada}
          setTeveEmpregoCarteiraAssinada={setTeveEmpregoCarteiraAssinada}
          dormeRua={dormeRua}
          setDormeRua={setDormeRua}
          tempoDormeRua={tempoDormeRua}
          setTempoDormeRua={setTempoDormeRua}
          servicoAcolhimento={servicoAcolhimento}
          setServicoAcolhimento={setServicoAcolhimento}
          tempoServicoAcolhimento={tempoServicoAcolhimento}
          setTempoServicoAcolhimento={setTempoServicoAcolhimento}
          domicilioParticular={domicilioParticular}
          setDomicilioParticular={setDomicilioParticular}
          tempoDomicilioParticular={tempoDomicilioParticular}
          setTempoDomicilioParticular={setTempoDomicilioParticular}
          outroDormir={outroDormir}
          setOutroDormir={setOutroDormir}
          tempoOutroDormir={tempoOutroDormir}
          setTempoOutroDormir={setTempoOutroDormir}
          exploracaoInfantil={exploracaoInfantil}
          setExploracaoInfantil={setExploracaoInfantil}
          exploracaoSexual={exploracaoSexual}
          setExploracaoSexual={setExploracaoSexual}
          violenciaFisica={violenciaFisica}
          setViolenciaFisica={setViolenciaFisica}
          violenciaPsicologica={violenciaPsicologica}
          setViolenciaPsicologica={setViolenciaPsicologica}
          violenciaSexual={violenciaSexual}
          setViolenciaSexual={setViolenciaSexual}
          respondeuMotivo={respondeuMotivo}
          setRespondeuMotivo={setRespondeuMotivo}
          naoSabeMotivo={naoSabeMotivo}
          setNaoSabeMotivo={setNaoSabeMotivo}
          perdaMoradia={perdaMoradia}
          setPerdaMoradia={setPerdaMoradia}
          ameaca={ameaca}
          setAmeaca={setAmeaca}
          problemasFamilia={problemasFamilia}
          setProblemasFamilia={setProblemasFamilia}
          alcoolismoDroga={alcoolismoDroga}
          setAlcoolismoDroga={setAlcoolismoDroga}
          desemprego={desemprego}
          setDesemprego={setDesemprego}
          trabalhoMotivo={trabalhoMotivo}
          setTrabalhoMotivo={setTrabalhoMotivo}
          saudeMotivo={saudeMotivo}
          setSaudeMotivo={setSaudeMotivo}
          preferenciaMotivo={preferenciaMotivo}
          setPreferenciaMotivo={setPreferenciaMotivo}
          egresso={egresso}
          setEgresso={setEgresso}
          outroMotivo={outroMotivo}
          setOutroMotivo={setOutroMotivo}
          respondeuAtividade={respondeuAtividade}
          setRespondeuAtividade={setRespondeuAtividade}
          atividadeEscola={atividadeEscola}
          setAtividadeEscola={setAtividadeEscola}
          atividadeCooperativa={atividadeCooperativa}
          setAtividadeCooperativa={setAtividadeCooperativa}
          atividadeMovimentoSocial={atividadeMovimentoSocial}
          setAtividadeMovimentoSocial={setAtividadeMovimentoSocial}
          naoSabeAtividade={naoSabeAtividade}
          setNaoSabeAtividade={setNaoSabeAtividade}
          atendidoCras={atendidoCras}
          setAtendidoCras={setAtendidoCras}
          atendidoCreas={atendidoCreas}
          setAtendidoCreas={setAtendidoCreas}
          atendidoCentroPop={atendidoCentroPop}
          setAtendidoCentroPop={setAtendidoCentroPop}
          atendidoInstGov={atendidoInstGov}
          setAtendidoInstGov={setAtendidoInstGov}
          atendidoInstNaoGov={atendidoInstNaoGov}
          setAtendidoInstNaoGov={setAtendidoInstNaoGov}
          atendidoHospitalGeral={atendidoHospitalGeral}
          setAtendidoHospitalGeral={setAtendidoHospitalGeral}
          naoAtendido={naoAtendido}
          setNaoAtendido={setNaoAtendido}
          usaAlcool={usaAlcool}
          setUsaAlcool={setUsaAlcool}
          usaDroga={usaDroga}
          setUsaDroga={setUsaDroga}
          transtornoMental={transtornoMental}
          setTranstornoMental={setTranstornoMental}
          respondeuSustento={respondeuSustento}
          setRespondeuSustento={setRespondeuSustento}
          sustentoConstrucaoCivil={sustentoConstrucaoCivil}
          setSustentoConstrucaoCivil={setSustentoConstrucaoCivil}
          sustentoGuardadorCarro={sustentoGuardadorCarro}
          setSustentoGuardadorCarro={setSustentoGuardadorCarro}
          sustentoCarregador={sustentoCarregador}
          setSustentoCarregador={setSustentoCarregador}
          sustentoCatador={sustentoCatador}
          setSustentoCatador={setSustentoCatador}
          sustentoServicosGerais={sustentoServicosGerais}
          setSustentoServicosGerais={setSustentoServicosGerais}
          sustentoPedeDinheiro={sustentoPedeDinheiro}
          setSustentoPedeDinheiro={setSustentoPedeDinheiro}
          sustentoVendas={sustentoVendas}
          setSustentoVendas={setSustentoVendas}
          sustentoOutro={sustentoOutro}
          setSustentoOutro={setSustentoOutro}
          historicoPessoal={historicoPessoal}
          setHistoricoPessoal={setHistoricoPessoal}
          dataCadastroRua={dataCadastroRua}
          setDataCadastroRua={setDataCadastroRua}
          user={user}
          nomeMae={nomeMae}
          setNomeMae={setNomeMae}
          nomePai={nomePai}
          setNomePai={setNomePai}
          tipoLocalNascimento={tipoLocalNascimento}
          setTipoLocalNascimento={setTipoLocalNascimento}
          estadoId={estadoId}
          setEstadoId={setEstadoId}
          municipioId={municipioId}
          setMunicipioId={setMunicipioId}
          rg={rg}
          setRg={setRg}
          rgDigito={rgDigito}
          setRgDigito={setRgDigito}
          rgOrgaoEmissor={rgOrgaoEmissor}
          setRgOrgaoEmissor={setRgOrgaoEmissor}
          rgUfId={rgUfId}
          setRgUfId={setRgUfId}
          rgDataEmissao={rgDataEmissao}
          setRgDataEmissao={setRgDataEmissao}
          sus={sus}
          setSus={setSus}
          cnh={cnh}
          setCnh={setCnh}
          reservista={reservista}
          setReservista={setReservista}
          rne={rne}
          setRne={setRne}
          ctps={ctps}
          setCtps={setCtps}
          ctpsSerie={ctpsSerie}
          setCtpsSerie={() => {}}
          cpf={cpf}
          setCpf={setCpf}
          tituloEleitor={tituloEleitor}
          setTituloEleitor={setTituloEleitor}
          tituloEleitorZona={tituloEleitorZona}
          setTituloEleitorZona={setTituloEleitorZona}
          tituloEleitorSecao={tituloEleitorSecao}
          setTituloEleitorSecao={setTituloEleitorSecao}
          tipoRegistroCivilId={tipoRegistroCivilId}
          setTipoRegistroCivilId={setTipoRegistroCivilId}
          certidao={certidao}
          setCertidao={setCertidao}
          certidaoNascimento={certidaoNascimento}
          setCertidaoNascimento={setCertidaoNascimento}
          rani={rani}
          setRani={setRani}
          certidaoNumeroMatricula={certidaoNumeroMatricula}
          setCertidaoNumeroMatricula={setCertidaoNumeroMatricula}
          certidaoNomeCartorio={certidaoNomeCartorio}
          setCertidaoNomeCartorio={setCertidaoNomeCartorio}
          certidaoNumeroLivroRegistro={certidaoNumeroLivroRegistro}
          setCertidaoNumeroLivroRegistro={setCertidaoNumeroLivroRegistro}
          certidaoFolhaLivroRegistro={certidaoFolhaLivroRegistro}
          setCertidaoFolhaLivroRegistro={setCertidaoFolhaLivroRegistro}
          certidaoDataRegistro={certidaoDataRegistro}
          setCertidaoDataRegistro={setCertidaoDataRegistro}
          certidaoUfRegistroId={certidaoUfRegistroId}
          setCertidaoUfRegistroId={setCertidaoUfRegistroId}
          certidaoMunicipioRegistroId={certidaoMunicipioRegistroId}
          setCertidaoMunicipioRegistroId={setCertidaoMunicipioRegistroId}
          tipoDeficienciaId={tipoDeficienciaId}
          setTipoDeficienciaId={setTipoDeficienciaId}
          tipoNecessitaCuidadosId={tipoNecessitaCuidadosId}
          setTipoNecessitaCuidadosId={setTipoNecessitaCuidadosId}
          usaMedicamentoControlado={usaMedicamentoControlado}
          setUsaMedicamentoControlado={setUsaMedicamentoControlado}
          medicamentoContinuo={medicamentoContinuo}
          setMedicamentoContinuo={setMedicamentoContinuo}

          tratamentoSaude={tratamentoSaude}
          setTratamentoSaude={setTratamentoSaude}
          tipoTratamentoCapsId={tipoTratamentoCapsId}
          setTipoTratamentoCapsId={setTipoTratamentoCapsId}
          escreveLe={escreveLe}
          setEscreveLe={setEscreveLe}
          nomeEscola={nomeEscola}
          setNomeEscola={setNomeEscola}
          codigoInepMec={codigoInepMec}
          setCodigoInepMec={setCodigoInepMec}
          tipoCursoFrequentaId={tipoCursoFrequentaId}
          setTipoCursoFrequentaId={setTipoCursoFrequentaId}
          nomeCursoFrequenta={nomeCursoFrequenta}
          setNomeCursoFrequenta={setNomeCursoFrequenta}
          tipoSerieCursoFrequentaId={tipoSerieCursoFrequentaId}
          setTipoSerieCursoFrequentaId={setTipoSerieCursoFrequentaId}
          tipoCursoFrequentouId={tipoCursoFrequentouId}
          setTipoCursoFrequentouId={setTipoCursoFrequentouId}
          cursoConcluido={cursoConcluido}
          setCursoConcluido={setCursoConcluido}
          tipoSerieCursoConcluidoId={tipoSerieCursoConcluidoId}
          setTipoSerieCursoConcluidoId={setTipoSerieCursoConcluidoId}
          tipoAtividadeId={tipoAtividadeId}
          setTipoAtividadeId={setTipoAtividadeId}
          portadorDoencaGrave={portadorDoencaGrave}
          setPortadorDoencaGrave={setPortadorDoencaGrave}
          trabalha={trabalha}
          setTrabalha={setTrabalha}
          qualificacaoProfissionalCboId={qualificacaoProfissionalCboId}
          setQualificacaoProfissionalCboId={setQualificacaoProfissionalCboId}
          remuneracaoBruta={remuneracaoBruta}
          setRemuneracaoBruta={setRemuneracaoBruta}
          recebeBolsaFamilia={recebeBolsaFamilia}
          setRecebeBolsaFamilia={setRecebeBolsaFamilia}
          receitaBolsaFamilia={receitaBolsaFamilia}
          setReceitaBolsaFamilia={setReceitaBolsaFamilia}
          receitaBpc={receitaBpc}
          setReceitaBpc={setReceitaBpc}
          receitaAposentadoria={receitaAposentadoria}
          setReceitaAposentadoria={setReceitaAposentadoria}
          receitaSeguroDesemprego={receitaSeguroDesemprego}
          setReceitaSeguroDesemprego={setReceitaSeguroDesemprego}
          receitaPensaoAlimenticia={receitaPensaoAlimenticia}
          setReceitaPensaoAlimenticia={setReceitaPensaoAlimenticia}
          receitaAjudaDoacao={receitaAjudaDoacao}
          setReceitaAjudaDoacao={setReceitaAjudaDoacao}
          receitaOutrasFontes={receitaOutrasFontes}
          setReceitaOutrasFontes={setReceitaOutrasFontes}
          receitaPeti={receitaPeti}
          setReceitaPeti={setReceitaPeti}
          observacao={observacao}
          setObservacao={setObservacao}
        />
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
