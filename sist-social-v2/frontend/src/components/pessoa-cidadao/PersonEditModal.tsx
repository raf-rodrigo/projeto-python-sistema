import React from 'react';
import { TabDadosPessoais } from './tabs/TabDadosPessoais';
import { TabFiliacaoOrigem } from './tabs/TabFiliacaoOrigem';
import { TabDocumentacao } from './tabs/TabDocumentacao';
import { TabRegistroCivil } from './tabs/TabRegistroCivil';
import { TabSaudeEducacao } from './tabs/TabSaudeEducacao';
import { TabTrabalho } from './tabs/TabTrabalho';

interface PersonEditModalProps {
  editandoId: number | null;
  activeModalTab: string;
  setActiveModalTab: (tab: any) => void;
  setModalAberto: (val: boolean) => void;
  salvarPessoa: (e: React.FormEvent) => void;
  lockFamiliaSelect: boolean;
  cpf: string;
  setCpf: (val: string) => void;
  portadorDoencaGrave: 'Sim' | 'Não';
  setPortadorDoencaGrave: (val: 'Sim' | 'Não') => void;
  trabalha: 'Sim' | 'Não';
  setTrabalha: (val: 'Sim' | 'Não') => void;
  
  // Tabela Básicas / Listas
  familias: any[];
  racas: any[];
  orientacoesSexuais: any[];
  estadosCivis: any[];
  parentescos: any[];
  locaisNascimento: any[];
  estados: any[];
  municipios: any[];
  registrosCivis: any[];
  deficiencias: any[];
  necessidadesCuidados: any[];
  tratamentosCaps: any[];
  cursos: any[];
  series: any[];
  atividades: any[];
  cbos: any[];
  temposRua: any[];
  temposCidade: any[];
  contatosParentes: any[];

  // Estados dos formulários (Pessoais)
  familiaDomicilio: string;
  setFamiliaDomicilio: (val: string) => void;
  nome: string;
  setNome: (val: string) => void;
  nomeSocial: string;
  setNomeSocial: (val: string) => void;
  nis: string;
  setNis: (val: string) => void;
  certidaoNascimentoData: string;
  setCertidaoNascimentoData: (val: string) => void;
  sexo: 'Masc' | 'Fem';
  setSexo: (val: 'Masc' | 'Fem') => void;
  raca: string;
  setRaca: (val: string) => void;
  orientacaoSexual: string;
  setOrientacaoSexual: (val: string) => void;
  tipoEstadoCivil: string;
  setTipoEstadoCivil: (val: string) => void;
  tipoParentesco: string;
  setTipoParentesco: (val: string) => void;
  situacaoDeRua: 'Sim' | 'Não';
  setSituacaoDeRua: (val: 'Sim' | 'Não') => void;
  telefone: string;
  setTelefone: (val: string) => void;
  celular: string;
  setCelular: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  
  // Situação de Rua Sub-Abas
  subTabRua: any;
  setSubTabRua: (val: any) => void;
  tempoViveNaRua: string;
  setTempoViveNaRua: (val: string) => void;
  tempoMoraNaCidade: string;
  setTempoMoraNaCidade: (val: string) => void;
  viveComFamiliaRua: 'Sim' | 'Não';
  setViveComFamiliaRua: (val: 'Sim' | 'Não') => void;
  contatoParenteForaRua: string;
  setContatoParenteForaRua: (val: string) => void;
  teveEmpregoCarteiraAssinada: 'Sim' | 'Não' | 'Não Sabe';
  setTeveEmpregoCarteiraAssinada: (val: 'Sim' | 'Não' | 'Não Sabe') => void;

  // Onde Dorme
  dormeRua: 'Sim' | 'Não';
  setDormeRua: (val: 'Sim' | 'Não') => void;
  tempoDormeRua: string;
  setTempoDormeRua: (val: string) => void;
  servicoAcolhimento: 'Sim' | 'Não';
  setServicoAcolhimento: (val: 'Sim' | 'Não') => void;
  tempoServicoAcolhimento: string;
  setTempoServicoAcolhimento: (val: string) => void;
  domicilioParticular: 'Sim' | 'Não';
  setDomicilioParticular: (val: 'Sim' | 'Não') => void;
  tempoDomicilioParticular: string;
  setTempoDomicilioParticular: (val: string) => void;
  outroDormir: 'Sim' | 'Não';
  setOutroDormir: (val: 'Sim' | 'Não') => void;
  tempoOutroDormir: string;
  setTempoOutroDormir: (val: string) => void;

  // Vulnerabilidades
  exploracaoInfantil: 'Sim' | 'Não';
  setExploracaoInfantil: (val: 'Sim' | 'Não') => void;
  exploracaoSexual: 'Sim' | 'Não';
  setExploracaoSexual: (val: 'Sim' | 'Não') => void;
  violenciaFisica: 'Sim' | 'Não';
  setViolenciaFisica: (val: 'Sim' | 'Não') => void;
  violenciaPsicologica: 'Sim' | 'Não';
  setViolenciaPsicologica: (val: 'Sim' | 'Não') => void;
  violenciaSexual: 'Sim' | 'Não';
  setViolenciaSexual: (val: 'Sim' | 'Não') => void;

  // Razões Rua
  respondeuMotivo: 'Sim' | 'Não';
  setRespondeuMotivo: (val: 'Sim' | 'Não') => void;
  naoSabeMotivo: 'Sim' | 'Não';
  setNaoSabeMotivo: (val: 'Sim' | 'Não') => void;
  perdaMoradia: 'Sim' | 'Não';
  setPerdaMoradia: (val: 'Sim' | 'Não') => void;
  ameaca: 'Sim' | 'Não';
  setAmeaca: (val: 'Sim' | 'Não') => void;
  problemasFamilia: 'Sim' | 'Não';
  setProblemasFamilia: (val: 'Sim' | 'Não') => void;
  alcoolismoDroga: 'Sim' | 'Não';
  setAlcoolismoDroga: (val: 'Sim' | 'Não') => void;
  desemprego: 'Sim' | 'Não';
  setDesemprego: (val: 'Sim' | 'Não') => void;
  trabalhoMotivo: 'Sim' | 'Não';
  setTrabalhoMotivo: (val: 'Sim' | 'Não') => void;
  saudeMotivo: 'Sim' | 'Não';
  setSaudeMotivo: (val: 'Sim' | 'Não') => void;
  preferenciaMotivo: 'Sim' | 'Não';
  setPreferenciaMotivo: (val: 'Sim' | 'Não') => void;
  egresso: string;
  setEgresso: (val: string) => void;
  outroMotivo: 'Sim' | 'Não';
  setOutroMotivo: (val: 'Sim' | 'Não') => void;

  // Atividade Comunitária
  respondeuAtividade: 'Sim' | 'Não';
  setRespondeuAtividade: (val: 'Sim' | 'Não') => void;
  atividadeEscola: 'Sim' | 'Não';
  setAtividadeEscola: (val: 'Sim' | 'Não') => void;
  atividadeCooperativa: 'Sim' | 'Não';
  setAtividadeCooperativa: (val: 'Sim' | 'Não') => void;
  atividadeMovimentoSocial: 'Sim' | 'Não';
  setAtividadeMovimentoSocial: (val: 'Sim' | 'Não') => void;
  naoSabeAtividade: 'Sim' | 'Não';
  setNaoSabeAtividade: (val: 'Sim' | 'Não') => void;

  // Atendimento e Saúde
  atendidoCras: 'Sim' | 'Não';
  setAtendidoCras: (val: 'Sim' | 'Não') => void;
  atendidoCreas: 'Sim' | 'Não';
  setAtendidoCreas: (val: 'Sim' | 'Não') => void;
  atendidoCentroPop: 'Sim' | 'Não';
  setAtendidoCentroPop: (val: 'Sim' | 'Não') => void;
  atendidoInstGov: 'Sim' | 'Não';
  setAtendidoInstGov: (val: 'Sim' | 'Não') => void;
  atendidoInstNaoGov: 'Sim' | 'Não';
  setAtendidoInstNaoGov: (val: 'Sim' | 'Não') => void;
  atendidoHospitalGeral: 'Sim' | 'Não';
  setAtendidoHospitalGeral: (val: 'Sim' | 'Não') => void;
  naoAtendido: 'Sim' | 'Não';
  setNaoAtendido: (val: 'Sim' | 'Não') => void;
  usaAlcool: 'Sim' | 'Não';
  setUsaAlcool: (val: 'Sim' | 'Não') => void;
  usaDroga: 'Sim' | 'Não';
  setUsaDroga: (val: 'Sim' | 'Não') => void;
  transtornoMental: 'Sim' | 'Não';
  setTranstornoMental: (val: 'Sim' | 'Não') => void;

  // Sustento
  respondeuSustento: 'Sim' | 'Não';
  setRespondeuSustento: (val: 'Sim' | 'Não') => void;
  sustentoConstrucaoCivil: 'Sim' | 'Não';
  setSustentoConstrucaoCivil: (val: 'Sim' | 'Não') => void;
  sustentoGuardadorCarro: 'Sim' | 'Não';
  setSustentoGuardadorCarro: (val: 'Sim' | 'Não') => void;
  sustentoCarregador: 'Sim' | 'Não';
  setSustentoCarregador: (val: 'Sim' | 'Não') => void;
  sustentoCatador: 'Sim' | 'Não';
  setSustentoCatador: (val: 'Sim' | 'Não') => void;
  sustentoServicosGerais: 'Sim' | 'Não';
  setSustentoServicosGerais: (val: 'Sim' | 'Não') => void;
  sustentoPedeDinheiro: 'Sim' | 'Não';
  setSustentoPedeDinheiro: (val: 'Sim' | 'Não') => void;
  sustentoVendas: 'Sim' | 'Não';
  setSustentoVendas: (val: 'Sim' | 'Não') => void;
  sustentoOutro: 'Sim' | 'Não';
  setSustentoOutro: (val: 'Sim' | 'Não') => void;

  // Obs & Cadastro Rua
  historicoPessoal: string;
  setHistoricoPessoal: (val: string) => void;
  dataCadastroRua: string;
  setDataCadastroRua: (val: string) => void;
  user: any;

  // Filiação
  nomeMae: string;
  setNomeMae: (val: string) => void;
  nomePai: string;
  setNomePai: (val: string) => void;
  tipoLocalNascimento: string;
  setTipoLocalNascimento: (val: string) => void;
  estadoId: string;
  setEstadoId: (val: string) => void;
  municipioId: string;
  setMunicipioId: (val: string) => void;

  // Documentos
  rg: string;
  setRg: (val: string) => void;
  rgDigito: string;
  setRgDigito: (val: string) => void;
  rgOrgaoEmissor: string;
  setRgOrgaoEmissor: (val: string) => void;
  rgUfId: string;
  setRgUfId: (val: string) => void;
  rgDataEmissao: string;
  setRgDataEmissao: (val: string) => void;
  sus: string;
  setSus: (val: string) => void;
  cnh: string;
  setCnh: (val: string) => void;
  reservista: string;
  setReservista: (val: string) => void;
  rne: string;
  setRne: (val: string) => void;
  ctps: string;
  setCtps: (val: string) => void;
  ctpsSerie: string;
  setCtpsSerie: (val: string) => void;
  tituloEleitor: string;
  setTituloEleitor: (val: string) => void;
  tituloEleitorZona: string;
  setTituloEleitorZona: (val: string) => void;
  tituloEleitorSecao: string;
  setTituloEleitorSecao: (val: string) => void;

  // Registro Civil
  tipoRegistroCivilId: string;
  setTipoRegistroCivilId: (val: string) => void;
  certidao: string;
  setCertidao: (val: string) => void;
  certidaoNascimento: string;
  setCertidaoNascimento: (val: string) => void;
  rani: string;
  setRani: (val: string) => void;
  certidaoNumeroMatricula: string;
  setCertidaoNumeroMatricula: (val: string) => void;
  certidaoNomeCartorio: string;
  setCertidaoNomeCartorio: (val: string) => void;
  certidaoNumeroLivroRegistro: string;
  setCertidaoNumeroLivroRegistro: (val: string) => void;
  certidaoFolhaLivroRegistro: string;
  setCertidaoFolhaLivroRegistro: (val: string) => void;
  certidaoDataRegistro: string;
  setCertidaoDataRegistro: (val: string) => void;
  certidaoUfRegistroId: string;
  setCertidaoUfRegistroId: (val: string) => void;
  certidaoMunicipioRegistroId: string;
  setCertidaoMunicipioRegistroId: (val: string) => void;

  // Saúde & Educação
  tipoDeficienciaId: string;
  setTipoDeficienciaId: (val: string) => void;
  tipoNecessitaCuidadosId: string;
  setTipoNecessitaCuidadosId: (val: string) => void;
  usaMedicamentoControlado: 'Sim' | 'Não';
  setUsaMedicamentoControlado: (val: 'Sim' | 'Não') => void;
  medicamentoContinuo: 'Sim' | 'Não';
  setMedicamentoContinuo: (val: 'Sim' | 'Não') => void;

  tratamentoSaude: 'Sim' | 'Não';
  setTratamentoSaude: (val: 'Sim' | 'Não') => void;
  tipoTratamentoCapsId: string;
  setTipoTratamentoCapsId: (val: string) => void;
  escreveLe: 'Sim' | 'Não';
  setEscreveLe: (val: 'Sim' | 'Não') => void;
  nomeEscola: string;
  setNomeEscola: (val: string) => void;
  codigoInepMec: string;
  setCodigoInepMec: (val: string) => void;
  tipoCursoFrequentaId: string;
  setTipoCursoFrequentaId: (val: string) => void;
  nomeCursoFrequenta: string;
  setNomeCursoFrequenta: (val: string) => void;
  tipoSerieCursoFrequentaId: string;
  setTipoSerieCursoFrequentaId: (val: string) => void;
  tipoCursoFrequentouId: string;
  setTipoCursoFrequentouId: (val: string) => void;
  cursoConcluido: 'Sim' | 'Não';
  setCursoConcluido: (val: 'Sim' | 'Não') => void;
  tipoSerieCursoConcluidoId: string;
  setTipoSerieCursoConcluidoId: (val: string) => void;

  // Trabalho
  tipoAtividadeId: string;
  setTipoAtividadeId: (val: string) => void;
  qualificacaoProfissionalCboId: string;
  setQualificacaoProfissionalCboId: (val: string) => void;
  remuneracaoBruta: string;
  setRemuneracaoBruta: (val: string) => void;
  recebeBolsaFamilia: 'Sim' | 'Não';
  setRecebeBolsaFamilia: (val: 'Sim' | 'Não') => void;
  receitaBolsaFamilia: string;
  setReceitaBolsaFamilia: (val: string) => void;
  receitaBpc: string;
  setReceitaBpc: (val: string) => void;
  receitaAposentadoria: string;
  setReceitaAposentadoria: (val: string) => void;
  receitaSeguroDesemprego: string;
  setReceitaSeguroDesemprego: (val: string) => void;
  receitaPensaoAlimenticia: string;
  setReceitaPensaoAlimenticia: (val: string) => void;
  receitaAjudaDoacao: string;
  setReceitaAjudaDoacao: (val: string) => void;
  receitaOutrasFontes: string;
  setReceitaOutrasFontes: (val: string) => void;
  receitaPeti: string;
  setReceitaPeti: (val: string) => void;

  // Obs
  observacao: string;
  setObservacao: (val: string) => void;
}

export const PersonEditModal: React.FC<PersonEditModalProps> = ({
  editandoId,
  activeModalTab,
  setActiveModalTab,
  setModalAberto,
  salvarPessoa,
  lockFamiliaSelect,
  cpf,
  setCpf,
  portadorDoencaGrave,
  setPortadorDoencaGrave,
  trabalha,
  setTrabalha,
  familias,
  racas,
  orientacoesSexuais,
  estadosCivis,
  parentescos,
  locaisNascimento,
  estados,
  municipios,
  registrosCivis,
  deficiencias,
  necessidadesCuidados,
  tratamentosCaps,
  cursos,
  series,
  atividades,
  cbos,
  temposRua,
  temposCidade,
  contatosParentes,
  familiaDomicilio,
  setFamiliaDomicilio,
  nome,
  setNome,
  nomeSocial,
  setNomeSocial,
  nis,
  setNis,
  certidaoNascimentoData,
  setCertidaoNascimentoData,
  sexo,
  setSexo,
  raca,
  setRaca,
  orientacaoSexual,
  setOrientacaoSexual,
  tipoEstadoCivil,
  setTipoEstadoCivil,
  tipoParentesco,
  setTipoParentesco,
  situacaoDeRua,
  setSituacaoDeRua,
  telefone,
  setTelefone,
  celular,
  setCelular,
  email,
  setEmail,
  subTabRua,
  setSubTabRua,
  tempoViveNaRua,
  setTempoViveNaRua,
  tempoMoraNaCidade,
  setTempoMoraNaCidade,
  viveComFamiliaRua,
  setViveComFamiliaRua,
  contatoParenteForaRua,
  setContatoParenteForaRua,
  teveEmpregoCarteiraAssinada,
  setTeveEmpregoCarteiraAssinada,
  dormeRua,
  setDormeRua,
  tempoDormeRua,
  setTempoDormeRua,
  servicoAcolhimento,
  setServicoAcolhimento,
  tempoServicoAcolhimento,
  setTempoServicoAcolhimento,
  domicilioParticular,
  setDomicilioParticular,
  tempoDomicilioParticular,
  setTempoDomicilioParticular,
  outroDormir,
  setOutroDormir,
  tempoOutroDormir,
  setTempoOutroDormir,
  exploracaoInfantil,
  setExploracaoInfantil,
  exploracaoSexual,
  setExploracaoSexual,
  violenciaFisica,
  setViolenciaFisica,
  violenciaPsicologica,
  setViolenciaPsicologica,
  violenciaSexual,
  setViolenciaSexual,
  respondeuMotivo,
  setRespondeuMotivo,
  naoSabeMotivo,
  setNaoSabeMotivo,
  perdaMoradia,
  setPerdaMoradia,
  ameaca,
  setAmeaca,
  problemasFamilia,
  setProblemasFamilia,
  alcoolismoDroga,
  setAlcoolismoDroga,
  desemprego,
  setDesemprego,
  trabalhoMotivo,
  setTrabalhoMotivo,
  saudeMotivo,
  setSaudeMotivo,
  preferenciaMotivo,
  setPreferenciaMotivo,
  egresso,
  setEgresso,
  outroMotivo,
  setOutroMotivo,
  respondeuAtividade,
  setRespondeuAtividade,
  atividadeEscola,
  setAtividadeEscola,
  atividadeCooperativa,
  setAtividadeCooperativa,
  atividadeMovimentoSocial,
  setAtividadeMovimentoSocial,
  naoSabeAtividade,
  setNaoSabeAtividade,
  atendidoCras,
  setAtendidoCras,
  atendidoCreas,
  setAtendidoCreas,
  atendidoCentroPop,
  setAtendidoCentroPop,
  atendidoInstGov,
  setAtendidoInstGov,
  atendidoInstNaoGov,
  setAtendidoInstNaoGov,
  atendidoHospitalGeral,
  setAtendidoHospitalGeral,
  naoAtendido,
  setNaoAtendido,
  usaAlcool,
  setUsaAlcool,
  usaDroga,
  setUsaDroga,
  transtornoMental,
  setTranstornoMental,
  respondeuSustento,
  setRespondeuSustento,
  sustentoConstrucaoCivil,
  setSustentoConstrucaoCivil,
  sustentoGuardadorCarro,
  setSustentoGuardadorCarro,
  sustentoCarregador,
  setSustentoCarregador,
  sustentoCatador,
  setSustentoCatador,
  sustentoServicosGerais,
  setSustentoServicosGerais,
  sustentoPedeDinheiro,
  setSustentoPedeDinheiro,
  sustentoVendas,
  setSustentoVendas,
  sustentoOutro,
  setSustentoOutro,
  historicoPessoal,
  setHistoricoPessoal,
  dataCadastroRua,
  setDataCadastroRua,
  user,
  nomeMae,
  setNomeMae,
  nomePai,
  setNomePai,
  tipoLocalNascimento,
  setTipoLocalNascimento,
  estadoId,
  setEstadoId,
  municipioId,
  setMunicipioId,
  rg,
  setRg,
  rgDigito,
  setRgDigito,
  rgOrgaoEmissor,
  setRgOrgaoEmissor,
  rgUfId,
  setRgUfId,
  rgDataEmissao,
  setRgDataEmissao,
  sus,
  setSus,
  cnh,
  setCnh,
  reservista,
  setReservista,
  rne,
  setRne,
  ctps,
  setCtps,
  ctpsSerie,
  setCtpsSerie,
  tituloEleitor,
  setTituloEleitor,
  tituloEleitorZona,
  setTituloEleitorZona,
  tituloEleitorSecao,
  setTituloEleitorSecao,
  tipoRegistroCivilId,
  setTipoRegistroCivilId,
  certidao,
  setCertidao,
  certidaoNascimento,
  setCertidaoNascimento,
  rani,
  setRani,
  certidaoNumeroMatricula,
  setCertidaoNumeroMatricula,
  certidaoNomeCartorio,
  setCertidaoNomeCartorio,
  certidaoNumeroLivroRegistro,
  setCertidaoNumeroLivroRegistro,
  certidaoFolhaLivroRegistro,
  setCertidaoFolhaLivroRegistro,
  certidaoDataRegistro,
  setCertidaoDataRegistro,
  certidaoUfRegistroId,
  setCertidaoUfRegistroId,
  certidaoMunicipioRegistroId,
  setCertidaoMunicipioRegistroId,
  tipoDeficienciaId,
  setTipoDeficienciaId,
  tipoNecessitaCuidadosId,
  setTipoNecessitaCuidadosId,
  usaMedicamentoControlado,
  setUsaMedicamentoControlado,
  medicamentoContinuo,
  setMedicamentoContinuo,

  tratamentoSaude,
  setTratamentoSaude,
  tipoTratamentoCapsId,
  setTipoTratamentoCapsId,
  escreveLe,
  setEscreveLe,
  nomeEscola,
  setNomeEscola,
  codigoInepMec,
  setCodigoInepMec,
  tipoCursoFrequentaId,
  setTipoCursoFrequentaId,
  nomeCursoFrequenta,
  setNomeCursoFrequenta,
  tipoSerieCursoFrequentaId,
  setTipoSerieCursoFrequentaId,
  tipoCursoFrequentouId,
  setTipoCursoFrequentouId,
  cursoConcluido,
  setCursoConcluido,
  tipoSerieCursoConcluidoId,
  setTipoSerieCursoConcluidoId,
  tipoAtividadeId,
  setTipoAtividadeId,
  qualificacaoProfissionalCboId,
  setQualificacaoProfissionalCboId,
  remuneracaoBruta,
  setRemuneracaoBruta,
  recebeBolsaFamilia,
  setRecebeBolsaFamilia,
  receitaBolsaFamilia,
  setReceitaBolsaFamilia,
  receitaBpc,
  setReceitaBpc,
  receitaAposentadoria,
  setReceitaAposentadoria,
  receitaSeguroDesemprego,
  setReceitaSeguroDesemprego,
  receitaPensaoAlimenticia,
  setReceitaPensaoAlimenticia,
  receitaAjudaDoacao,
  setReceitaAjudaDoacao,
  receitaOutrasFontes,
  setReceitaOutrasFontes,
  receitaPeti,
  setReceitaPeti,
  observacao,
  setObservacao
}) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '1150px', borderRadius: '16px', display: 'flex', flexDirection: 'column', maxHeight: '96vh' }}>
        
        {/* Header Modal */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              {editandoId ? 'Editar Pessoa (Munícipe)' : 'Nova Pessoa (Munícipe)'}
            </h3>
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
              <TabDadosPessoais 
                familiaDomicilio={familiaDomicilio}
                setFamiliaDomicilio={setFamiliaDomicilio}
                lockFamiliaSelect={lockFamiliaSelect}
                familias={familias}
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
                orientacoesSexuais={orientacoesSexuais}
                racas={racas}
                tipoEstadoCivil={tipoEstadoCivil}
                setTipoEstadoCivil={setTipoEstadoCivil}
                estadosCivis={estadosCivis}
                tipoParentesco={tipoParentesco}
                setTipoParentesco={setTipoParentesco}
                parentescos={parentescos}
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
                temposRua={temposRua}
                tempoMoraNaCidade={tempoMoraNaCidade}
                setTempoMoraNaCidade={setTempoMoraNaCidade}
                temposCidade={temposCidade}
                viveComFamiliaRua={viveComFamiliaRua}
                setViveComFamiliaRua={setViveComFamiliaRua}
                contatoParenteForaRua={contatoParenteForaRua}
                setContatoParenteForaRua={setContatoParenteForaRua}
                contatosParentes={contatosParentes}
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
              />
            )}

            {/* TAB 2: FILIAÇÃO E ORIGEM */}
            {activeModalTab === 'filiacao' && (
              <TabFiliacaoOrigem 
                nomeMae={nomeMae}
                setNomeMae={setNomeMae}
                nomePai={nomePai}
                setNomePai={setNomePai}
                tipoLocalNascimento={tipoLocalNascimento}
                setTipoLocalNascimento={setTipoLocalNascimento}
                locaisNascimento={locaisNascimento}
                estadoId={estadoId}
                setEstadoId={setEstadoId}
                estados={estados}
                municipioId={municipioId}
                setMunicipioId={setMunicipioId}
                municipios={municipios}
              />
            )}

            {/* TAB 3: DOCUMENTAÇÃO */}
            {activeModalTab === 'documentos' && (
              <TabDocumentacao 
                cpf={cpf}
                setCpf={setCpf}
                rg={rg}
                setRg={setRg}
                rgDigito={rgDigito}
                setRgDigito={setRgDigito}
                rgOrgaoEmissor={rgOrgaoEmissor}
                setRgOrgaoEmissor={setRgOrgaoEmissor}
                rgUfId={rgUfId}
                setRgUfId={setRgUfId}
                estados={estados}
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
                setCtpsSerie={setCtpsSerie}
                tituloEleitor={tituloEleitor}
                setTituloEleitor={setTituloEleitor}
                tituloEleitorZona={tituloEleitorZona}
                setTituloEleitorZona={setTituloEleitorZona}
                tituloEleitorSecao={tituloEleitorSecao}
                setTituloEleitorSecao={setTituloEleitorSecao}
              />
            )}

            {/* TAB 4: REGISTRO CIVIL */}
            {activeModalTab === 'registro' && (
              <TabRegistroCivil 
                tipoRegistroCivilId={tipoRegistroCivilId}
                setTipoRegistroCivilId={setTipoRegistroCivilId}
                registrosCivis={registrosCivis}
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
                estados={estados}
                certidaoMunicipioRegistroId={certidaoMunicipioRegistroId}
                setCertidaoMunicipioRegistroId={setCertidaoMunicipioRegistroId}
                municipios={municipios}
              />
            )}

            {/* TAB 5: SAÚDE E EDUCAÇÃO */}
            {activeModalTab === 'saude_edu' && (
              <TabSaudeEducacao 
                portadorDoencaGrave={portadorDoencaGrave}
                setPortadorDoencaGrave={setPortadorDoencaGrave}
                tipoDeficienciaId={tipoDeficienciaId}
                setTipoDeficienciaId={setTipoDeficienciaId}
                deficiencias={deficiencias}
                tipoNecessitaCuidadosId={tipoNecessitaCuidadosId}
                setTipoNecessitaCuidadosId={setTipoNecessitaCuidadosId}
                necessidadesCuidados={necessidadesCuidados}
                usaMedicamentoControlado={usaMedicamentoControlado}
                setUsaMedicamentoControlado={setUsaMedicamentoControlado}
                medicamentoContinuo={medicamentoContinuo}
                setMedicamentoContinuo={setMedicamentoContinuo}
                usaAlcool={usaAlcool}
                setUsaAlcool={setUsaAlcool}
                usaDroga={usaDroga}
                setUsaDroga={setUsaDroga}
                transtornoMental={transtornoMental}
                setTranstornoMental={setTranstornoMental}
                tratamentoSaude={tratamentoSaude}
                setTratamentoSaude={setTratamentoSaude}
                tipoTratamentoCapsId={tipoTratamentoCapsId}
                setTipoTratamentoCapsId={setTipoTratamentoCapsId}
                tratamentosCaps={tratamentosCaps}
                escreveLe={escreveLe}
                setEscreveLe={setEscreveLe}
                nomeEscola={nomeEscola}
                setNomeEscola={setNomeEscola}
                codigoInepMec={codigoInepMec}
                setCodigoInepMec={setCodigoInepMec}
                tipoCursoFrequentaId={tipoCursoFrequentaId}
                setTipoCursoFrequentaId={setTipoCursoFrequentaId}
                cursos={cursos}
                nomeCursoFrequenta={nomeCursoFrequenta}
                setNomeCursoFrequenta={setNomeCursoFrequenta}
                tipoSerieCursoFrequentaId={tipoSerieCursoFrequentaId}
                setTipoSerieCursoFrequentaId={setTipoSerieCursoFrequentaId}
                series={series}
                tipoCursoFrequentouId={tipoCursoFrequentouId}
                setTipoCursoFrequentouId={setTipoCursoFrequentouId}
                cursoConcluido={cursoConcluido}
                setCursoConcluido={setCursoConcluido}
                tipoSerieCursoConcluidoId={tipoSerieCursoConcluidoId}
                setTipoSerieCursoConcluidoId={setTipoSerieCursoConcluidoId}
              />
            )}

            {/* TAB 6: TRABALHO E RENDAS */}
            {activeModalTab === 'trabalho' && (
              <TabTrabalho 
                trabalha={trabalha}
                setTrabalha={setTrabalha}
                tipoAtividadeId={tipoAtividadeId}
                setTipoAtividadeId={setTipoAtividadeId}
                atividades={atividades}
                qualificacaoProfissionalCboId={qualificacaoProfissionalCboId}
                setQualificacaoProfissionalCboId={setQualificacaoProfissionalCboId}
                cbos={cbos}
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
              />
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
                  placeholder="Insira detalhes sobre o contexto familiar..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            )}

          </div>

          <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
            <button 
              type="button" 
              onClick={() => {
                setModalAberto(false);
                const deFamilia = localStorage.getItem('veioDeFamiliaVinculo');
                if (deFamilia === 'true') {
                  window.location.hash = 'familias';
                }
              }} 
              className="form-control" 
              style={{ maxWidth: '100px', cursor: 'pointer', margin: 0 }}
            >
              Cancelar
            </button>
            <button type="submit" className="btn conecta text-white" style={{ maxWidth: '120px', marginTop: 0 }}>
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
