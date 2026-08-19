import { useState, useEffect } from 'react';
import { Building, PlusCircle } from 'lucide-react';

import { FamilyTable } from './familia-domicilio/FamilyTable';
import { FamilyDialogs } from './familia-domicilio/FamilyDialogs';
import { FamilyEditModal } from './familia-domicilio/FamilyEditModal';

interface TabelaBasicaItem {
  id: number;
  nome: string;
}

interface TransferenciaUnidadeItem {
  id: number;
  unidade_anterior_nome: string;
  unidade_nova_nome: string;
  operador_nome: string;
  data_transferencia: string;
  justificativa: string;
}

interface DomicilioDetails {
  id?: number;
  logradouro_cep?: string;
  logradouro_nome?: string;
  logradouro_numero?: string;
  logradouro_complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  latitude?: string;
  longitude?: string;
  complemento_adicional_endereco?: string;
  referencia_para_localizacao?: string;
}

interface FamiliaDomicilio {
  id: number;
  familia_codigo?: string;
  codigo_cadunico?: string;
  data_atualizacao?: string;
  domicilio?: number;
  domicilio_details?: DomicilioDetails;
  
  // Mantemos compatibilidade caso campos planos cheguem do backend legados
  logradouro_cep?: string;
  logradouro_nome?: string;
  logradouro_numero?: string;
  logradouro_complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  latitude?: string;
  longitude?: string;

  tempo_moradia_anos?: string;
  tempo_moradia_meses?: string;
  localizacao_domicilio?: 'Urbana' | 'Rural';
  area_risco?: 'Sim' | 'Não';
  area_conflito_violencia?: 'Sim' | 'Não';
  beneficio_bolsa_familia?: 'Sim' | 'Não';
  data_cadastro?: string;
  unidade_atendimento_social_familia?: number;
  unidade_atendimento_social_familia_details?: { id: number; nome_conhecido: string };
  origem_cadastro?: number;
  origem_cadastro_details?: { id: number; nome: string };
  unidade_cadastro?: number;
  unidade_cadastro_details?: { id: number; nome_conhecido: string };
  responsavel_cadastro?: number;
  responsavel_cadastro_details?: { id: number; username: string; first_name?: string; last_name?: string };
  observacoes?: string;
  responsavel_familiar_nome?: string;
  nis?: string;
  cpf?: string;
  telefone?: string;
  pbf?: string;
  ext_pobreza?: string;
  transferencias_details?: TransferenciaUnidadeItem[];
}

export default function FamilyManagement() {
  const [familias, setFamilias] = useState<FamiliaDomicilio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  
  // Modais e controle de formulário
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tabelas Básicas
  const [origensCadastro, setOrigensCadastro] = useState<TabelaBasicaItem[]>([]);
  const [tiposUnidadeAtendimento, setTiposUnidadeAtendimento] = useState<TabelaBasicaItem[]>([]);
  const [unidades, setUnidades] = useState<any[]>([]);
  const [especiesDomicilio, setEspeciesDomicilio] = useState<any[]>([]);
  const [tiposResidencia, setTiposResidencia] = useState<any[]>([]);
  const [tiposPiso, setTiposPiso] = useState<any[]>([]);
  const [tiposConstrucao, setTiposConstrucao] = useState<any[]>([]);
  const [tiposIluminacao, setTiposIluminacao] = useState<any[]>([]);
  const [tiposAbastecimentoAgua, setTiposAbastecimentoAgua] = useState<any[]>([]);
  const [tiposEscoamentoSanitario, setTiposEscoamentoSanitario] = useState<any[]>([]);
  const [tiposColetaLixo, setTiposColetaLixo] = useState<any[]>([]);
  const [tiposAcessibilidade, setTiposAcessibilidade] = useState<any[]>([]);
  const [tiposAnimais, setTiposAnimais] = useState<any[]>([]);

  // Form Fields
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('SP');
  const [complemento, setComplemento] = useState('');

  const [mapCoords, setMapCoords] = useState<[number, number]>([-23.5489, -46.6388]);
  const [latitudeVal, setLatitudeVal] = useState('');
  const [longitudeVal, setLongitudeVal] = useState('');

  const [tempoMoradiaAnos, setTempoMoradiaAnos] = useState('');
  const [tempoMoradiaMeses, setTempoMoradiaMeses] = useState('');
  const [localizacaoDomicilio, setLocalizacaoDomicilio] = useState<'Urbana' | 'Rural'>('Urbana');
  const [areaRisco, setAreaRisco] = useState<'Sim' | 'Não'>('Não');
  const [areaConflito, setAreaConflito] = useState<'Sim' | 'Não'>('Não');
  const [beneficioBolsaFamilia, setBeneficioBolsaFamilia] = useState<'Sim' | 'Não'>('Não');

  const [tipoUnidadeAtendimentoId, setTipoUnidadeAtendimentoId] = useState('');
  const [origemCadastroId, setOrigemCadastroId] = useState('');
  const [dataCadastro, setDataCadastro] = useState(() => new Date().toISOString().split('T')[0]);

  // Grupo 1: Características Físicas
  const [especieDomicilioId, setEspecieDomicilioId] = useState('');
  const [tipoResidenciaId, setTipoResidenciaId] = useState('');
  const [tipoConstrucaoId, setTipoConstrucaoId] = useState('');
  const [tipoPisoId, setTipoPisoId] = useState('');
  const [tipoIluminacaoId, setTipoIluminacaoId] = useState('');
  const [acessibilidadeId, setAcessibilidadeId] = useState('');
  const [animalId, setAnimalId] = useState('');

  // Grupo 2: Saneamento e Infraestrutura
  const [aguaCanalizada, setAguaCanalizada] = useState('');
  const [abastecimentoAguaId, setAbastecimentoAguaId] = useState('');
  const [possuiBanheiro, setPossuiBanheiro] = useState('');
  const [escoamentoSanitarioId, setEscoamentoSanitarioId] = useState('');
  const [coletaLixoId, setColetaLixoId] = useState('');
  const [calcamentoFrente, setCalcamentoFrente] = useState('');
  const [dificilAcesso, setDificilAcesso] = useState('');

  // Grupo 3: Cômodos e Residentes
  const [numeroComodos, setNumeroComodos] = useState('');
  const [numeroDormitorios, setNumeroDormitorios] = useState('');
  const [pessoasDormitorio, setPessoasDormitorio] = useState('');
  const [totalPessoas, setTotalPessoas] = useState('');
  const [totalFamilias, setTotalFamilias] = useState('');
  const [pessoas0a17, setPessoas0a17] = useState('');
  const [pessoas18a64, setPessoas18a64] = useState('');
  const [pessoas65mais, setPessoas65mais] = useState('');

  // Valores padrão/somente leitura carregados da sessão
  const [unidadeCadastroLabel, setUnidadeCadastroLabel] = useState('CREAS ITAPEGICA');
  const [responsavelCadastroLabel, setResponsavelCadastroLabel] = useState('Rafael Doimo');

  // Controle de abas da tela de edição
  const [activeEditTab, setActiveEditTab] = useState('inicio');
  const [codigoFamiliaExibicao, setCodigoFamiliaExibicao] = useState('');
  const [responsavelFamiliarNome, setResponsavelFamiliarNome] = useState('MARCELO DA SILVA');
  const [codigoCadUnico, setCodigoCadUnico] = useState('');
  const [dataUltAtualizacao, setDataUltAtualizacao] = useState('');

  // Controle de Transferência de Unidade
  const [transferenciaModalAberto, setTransferenciaModalAberto] = useState(false);
  const [unidadeDestinoPendente, setUnidadeDestinoPendente] = useState('');
  const [justificativaTransferencia, setJustificativaTransferencia] = useState('');
  const [unidadeOrigemNomeExibicao, setUnidadeOrigemNomeExibicao] = useState('');
  const [localTransferencias, setLocalTransferencias] = useState<TransferenciaUnidadeItem[]>([]);

  // Estados da Aba Composição Familiar
  const [membrosFamilia, setMembrosFamilia] = useState<any[]>([]);
  const [modalEscolhaInclusao, setModalEscolhaInclusao] = useState(false);
  const [modalIncluirExistente, setModalIncluirExistente] = useState(false);
  const [modalTransferirPessoa, setModalTransferirPessoa] = useState(false);
  
  // Pesquisa de Pessoas Existentes
  const [buscaPessoasQuery, setBuscaPessoasQuery] = useState('');
  const [pessoasFiltradas, setPessoasFiltradas] = useState<any[]>([]);
  
  // Pessoa selecionada para vinculação/transferência
  const [pessoaSelecionadaPendente, setPessoaSelecionadaPendente] = useState<any>(null);
  const [novoParentescoId, setNovoParentescoId] = useState('');
  const [motivoTransferenciaPessoa, setMotivoTransferenciaPessoa] = useState('');
  const [observacoesTransferenciaPessoa, setObservacoesTransferenciaPessoa] = useState('');
  const [parentescosDisponiveis, setParentescosDisponiveis] = useState<any[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');

  // Consulta endereço e coordenadas CEP
  const consultarCep = async (cepDigitado: string) => {
    const limpo = cepDigitado.replace(/\D/g, '');
    if (limpo.length === 8) {
      try {
        const resVia = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
        if (resVia.ok) {
          const dadosVia = await resVia.json();
          if (!dadosVia.erro) {
            setLogradouro(dadosVia.logradouro || '');
            setBairro(dadosVia.bairro || '');
            setCidade(dadosVia.localidade || '');
            setUf(dadosVia.uf || 'SP');

            const query = `${dadosVia.logradouro}, ${dadosVia.bairro}, ${dadosVia.localidade}, Brasil`;
            const resGeocode = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
            if (resGeocode.ok) {
              const dadosGeo = await resGeocode.json();
              if (dadosGeo && dadosGeo.length > 0) {
                const lat = parseFloat(dadosGeo[0].lat);
                const lon = parseFloat(dadosGeo[0].lon);
                setMapCoords([lat, lon]);
                setLatitudeVal(lat.toString());
                setLongitudeVal(lon.toString());
              }
            }
          }
        }
      } catch (err) {
        console.error('Erro na geocodificação:', err);
      }
    }
  };

  useEffect(() => {
    if (cep) consultarCep(cep);
  }, [cep]);

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const res = await fetch(`${API_URL}/api/familias_domicilios/?search=${encodeURIComponent(busca)}`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        const resJson = await res.json();
        setFamilias(resJson.results || resJson || []);
      }

      // Tabelas Básicas

      // 1. Espécie do Domicílio
      const resEspecies = await fetch(`${API_URL}/api/tipo_especie_domicilio/?no_pagination=true`, { headers: {
      'Authorization': `Token ${token}` } });
      if (resEspecies.ok) setEspeciesDomicilio(await resEspecies.json());

      // 2. Tipo de Residência
      const resResidencia = await fetch(`${API_URL}/api/tipo_residencia/?no_pagination=true`, { headers: {
      'Authorization': `Token ${token}` } });
      if (resResidencia.ok) setTiposResidencia(await resResidencia.json());

      // 3. Tipo de Piso
      const resPiso = await fetch(`${API_URL}/api/tipo_piso_domicilio/?no_pagination=true`, { headers: {
      'Authorization': `Token ${token}` } });
      if (resPiso.ok) setTiposPiso(await resPiso.json());

      // 4. Tipo de Construção
      const resConstrucao = await fetch(`${API_URL}/api/tipo_construcao_domicilio/?no_pagination=true`, {
      headers: { 'Authorization': `Token ${token}` } });
      if (resConstrucao.ok) setTiposConstrucao(await resConstrucao.json());

      // 5. Tipo de Iluminação
      const resIluminacao = await fetch(`${API_URL}/api/tipo_iluminacao_domicilio/?no_pagination=true`, {
      headers: { 'Authorization': `Token ${token}` } });
      if (resIluminacao.ok) setTiposIluminacao(await resIluminacao.json());

      // 6. Abastecimento de Água
      const resAgua = await fetch(`${API_URL}/api/tipo_abastecimento_agua/?no_pagination=true`, { headers: {
      'Authorization': `Token ${token}` } });
      if (resAgua.ok) setTiposAbastecimentoAgua(await resAgua.json());

      // 7. Escoamento Sanitário
      const resEscoamento = await fetch(`${API_URL}/api/tipo_escoamento_sanitario/?no_pagination=true`, {
      headers: { 'Authorization': `Token ${token}` } });
      if (resEscoamento.ok) setTiposEscoamentoSanitario(await resEscoamento.json());

      // 8. Coleta de Lixo
      const resLixo = await fetch(`${API_URL}/api/tipo_coleta_lixo/?no_pagination=true`, { headers: {
      'Authorization': `Token ${token}` } });
      if (resLixo.ok) setTiposColetaLixo(await resLixo.json());

      // 9. Acessibilidade
      const resAcessibilidade = await fetch(`${API_URL}/api/tipo_acessibilidade_domicilio/?no_pagination=true`, {
      headers: { 'Authorization': `Token ${token}` } });
      if (resAcessibilidade.ok) setTiposAcessibilidade(await resAcessibilidade.json());

      // 10. Animais
      const resAnimais = await fetch(`${API_URL}/api/tipos_animais/?no_pagination=true`, { headers: {
      'Authorization': `Token ${token}` } });
      if (resAnimais.ok) setTiposAnimais(await resAnimais.json());


      const resOrigem = await fetch(`${API_URL}/api/tipo_origem_cadastro/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resOrigem.ok) {
        const resJson = await resOrigem.json();
        setOrigensCadastro(resJson.results || resJson || []);
      }

      const resTipoUnidade = await fetch(`${API_URL}/api/tipo_unidade_atendimento_familia/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resTipoUnidade.ok) {
        const resJson = await resTipoUnidade.json();
        setTiposUnidadeAtendimento(resJson.results || resJson || []);
      }

      const resUnidades = await fetch(`${API_URL}/api/unidades/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resUnidades.ok) {
        const resJson = await resUnidades.json();
        setUnidades(resJson.results || resJson || []);
      }

      const resParentescos = await fetch(`${API_URL}/api/tipo_parentesco/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resParentescos.ok) {
        const resJson = await resParentescos.json();
        setParentescosDisponiveis(resJson.results || resJson || []);
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

  // Intercepta retorno para manter o modal aberto na aba composição
  useEffect(() => {
    const deFamilia = localStorage.getItem('veioDeFamiliaVinculo');
    const familiaId = localStorage.getItem('familiaPendenteVinculoId');
    if (deFamilia === 'true' && familiaId && familias.length > 0) {
      localStorage.removeItem('veioDeFamiliaVinculo');
      localStorage.removeItem('familiaPendenteVinculoId');
      
      const fam = familias.find(f => f.id.toString() === familiaId.toString());
      if (fam) {
        abrirEditarModal(fam, 'composicao');
      }
    }
  }, [familias]);

  const abrirNovoModal = () => {
    setEditandoId(null);
    setCep('');
    setLogradouro('');
    setNumero('');
    setBairro('');
    setCidade('');
    setUf('');
    setComplemento('');
    setMapCoords([-23.5489, -46.6388]);
    setLatitudeVal('');
    setLongitudeVal('');
    setTempoMoradiaAnos('');
    setTempoMoradiaMeses('');
    setLocalizacaoDomicilio('Urbana');
    setAreaRisco('Não');
    setAreaConflito('Não');
    setBeneficioBolsaFamilia('Não');
    const sessionUnidadeId = localStorage.getItem('unidade');
    setTipoUnidadeAtendimentoId(sessionUnidadeId || '');
    setOrigemCadastroId('');
    setDataCadastro(new Date().toISOString().split('T')[0]);
    setCodigoCadUnico('');
    setDataUltAtualizacao('');
    setLocalTransferencias([]);
    setMembrosFamilia([]);

    const sessionUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (sessionUnidadeId) {
      const match = unidades.find(u => u.id.toString() === sessionUnidadeId.toString());
      setUnidadeCadastroLabel(match ? match.nome_conhecido : 'Unidade Geral');
    } else {
      setUnidadeCadastroLabel('Unidade Geral');
    }

    setResponsavelCadastroLabel(
      sessionUser.first_name 
        ? `${sessionUser.first_name} ${sessionUser.last_name || ''}`.trim() 
        : sessionUser.username || 'Operador'
    );

    setActiveEditTab('inicio');
    setErrorMsg(null);
    setModalAberto(true);
  };

  const abrirEditarModal = (f: FamiliaDomicilio, defaultTab: string = 'inicio') => {
    const dom = f.domicilio_details || {};
    setEditandoId(f.id);
    setCep(dom.logradouro_cep || f.logradouro_cep || '');
    setLogradouro(dom.logradouro_nome || f.logradouro_nome || '');
    setNumero(dom.logradouro_numero || f.logradouro_numero || '');
    setBairro(dom.bairro || f.bairro || '');
    setCidade(dom.cidade || f.cidade || '');
    setUf(dom.estado || f.estado || 'SP');
    setComplemento(dom.logradouro_complemento || f.logradouro_complemento || '');
    
    const lat = dom.latitude || f.latitude;
    const lon = dom.longitude || f.longitude;
    if (lat && lon) {
      setMapCoords([parseFloat(lat), parseFloat(lon)]);
      setLatitudeVal(lat);
      setLongitudeVal(lon);
    } else {
      setMapCoords([-23.5489, -46.6388]);
      setLatitudeVal('');
      setLongitudeVal('');
    }

    setTempoMoradiaAnos(f.tempo_moradia_anos || '');
    setTempoMoradiaMeses(f.tempo_moradia_meses || '');
    setLocalizacaoDomicilio(f.localizacao_domicilio || 'Urbana');
    setAreaRisco(f.area_risco || 'Não');
    setAreaConflito(f.area_conflito_violencia || 'Não');
    setBeneficioBolsaFamilia(f.beneficio_bolsa_familia || 'Não');
    setTipoUnidadeAtendimentoId(f.unidade_atendimento_social_familia?.toString() || '');
    setOrigemCadastroId(f.origem_cadastro?.toString() || '');
    setDataCadastro(f.data_cadastro || new Date().toISOString().split('T')[0]);
    setCodigoCadUnico(f.codigo_cadunico || '');
    setDataUltAtualizacao(f.data_atualizacao || '');
    
    setUnidadeCadastroLabel(f.unidade_cadastro_details?.nome_conhecido || 'CREAS ITAPEGICA');
    setResponsavelCadastroLabel(
      f.responsavel_cadastro_details?.first_name 
        ? `${f.responsavel_cadastro_details.first_name} ${f.responsavel_cadastro_details.last_name || ''}`
        : f.responsavel_cadastro_details?.username || 'Rafael Doimo'
    );
    
    setCodigoFamiliaExibicao(f.familia_codigo || `Fam-${f.id}`);
    setResponsavelFamiliarNome(f.responsavel_familiar_nome || 'NÃO CADASTRADO');
    setMembrosFamilia(f.membros_details || []);

    // Carrega dados habitacionais na edição
    setEspecieDomicilioId(f.tipo_especie_domicilio?.toString() || '');
    setTipoResidenciaId(f.tipo_residencia?.toString() || '');
    setTipoConstrucaoId(f.tipo_construcao_domicilio?.toString() || '');
    setTipoPisoId(f.tipo_piso_domicilio?.toString() || '');
    setTipoIluminacaoId(f.tipo_iluminacao_domicilio?.toString() || '');
    setAcessibilidadeId(f.tipo_acessibilidade_domicilio?.toString() || '');
    setAnimalId(f.tipo_animal?.toString() || '');

    setAguaCanalizada(f.agua_canalizada || 'Não');
    setAbastecimentoAguaId(f.tipo_abastecimento_agua?.toString() || '');
    setPossuiBanheiro(f.possue_banheiro || 'Não');
    setEscoamentoSanitarioId(f.tipo_escoamento_sanitario?.toString() || '');
    setColetaLixoId(f.tipo_coleta_lixo?.toString() || '');
    setCalcamentoFrente(f.calcamento_na_frente_domicilio || 'Não Existe');
    setDificilAcesso(f.area_dificil_acesso || 'Não');

    setNumeroComodos(f.numero_comodos || '');
    setNumeroDormitorios(f.numero_dormitorio || '');
    setPessoasDormitorio(f.numero_pessoa_dormitorio || '');
    setTotalPessoas(f.total_pessoa_domicilio || '');
    setTotalFamilias(f.total_familia_domicilio || '');
    setPessoas0a17(f.pessoas_de_zero_a_dezessete || '');
    setPessoas18a64(f.pessoas_de_dezoito_a_sessenta_e_quatro || '');
    setPessoas65mais(f.pessoas_com_mais_de_sessenta_e_cinco || '');
    
    if (f.transferencias_details) {
      setLocalTransferencias(f.transferencias_details);
    } else {
      setLocalTransferencias([]);
    }

    setActiveEditTab(defaultTab);
    setErrorMsg(null);
    setModalAberto(true);
  };

  const deletarFamilia = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta família permanentemente?')) {
      try {
        const res = await fetch(`${API_URL}/api/familias_domicilios/${id}/`, {
          method: 'DELETE',
          headers: { 'Authorization': `Token ${token}` }
        });
        if (res.ok) {
          setFamilias(prev => prev.filter(f => f.id !== id));
        } else {
          alert('Erro ao excluir família.');
        }
      } catch (err) {
        alert('Erro ao se conectar com a API.');
      }
    }
  };

  const salvarFamilia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep.trim() || !tipoUnidadeAtendimentoId || !origemCadastroId) {
      setErrorMsg('Preencha os campos obrigatórios (*).');
      return;
    }

    const sessionUser = JSON.parse(localStorage.getItem('user') || '{}');
    const sessionUnidadeId = localStorage.getItem('unidade');

    const payload = {
      domicilio_details: {
        logradouro_cep: cep,
        logradouro_nome: logradouro,
        logradouro_numero: numero,
        logradouro_complemento: complemento,
        bairro,
        cidade,
        estado: uf,
        latitude: latitudeVal,
        longitude: longitudeVal,
      },
      // Campos planos legados mantidos para retrocompatibilidade provisória do DRF
      logradouro_cep: cep,
      logradouro_nome: logradouro,
      logradouro_numero: numero,
      logradouro_complemento: complemento,
      bairro,
      cidade,
      estado: uf,
      latitude: latitudeVal,
      longitude: longitudeVal,
      
      tempo_moradia_anos: tempoMoradiaAnos,
      tempo_moradia_meses: tempoMoradiaMeses,
      localizacao_domicilio: localizacaoDomicilio,
      area_risco: areaRisco,
      area_conflito_violencia: areaConflito,
      beneficio_bolsa_familia: beneficioBolsaFamilia,
      unidade_atendimento_social_familia: parseInt(tipoUnidadeAtendimentoId),
      origem_cadastro: parseInt(origemCadastroId),
      data_cadastro: dataCadastro,
      unidade_cadastro: sessionUnidadeId ? parseInt(sessionUnidadeId) : null,
      responsavel_cadastro: sessionUser.id || null,
      codigo_cadunico: codigoCadUnico || null,
      justificativa_transferencia: justificativaTransferencia || null,
      unidade_cadastro: sessionUnidadeId ? parseInt(sessionUnidadeId) : null,
      responsavel_cadastro: sessionUser.id || null,
      codigo_cadunico: codigoCadUnico || null,
      justificativa_transferencia: justificativaTransferencia || null,

      // --- NOVOS CAMPOS HABITACIONAIS ---
      tipo_especie_domicilio: especieDomicilioId ? parseInt(especieDomicilioId) : null,
      tipo_residencia: tipoResidenciaId ? parseInt(tipoResidenciaId) : null,
      tipo_construcao_domicilio: tipoConstrucaoId ? parseInt(tipoConstrucaoId) : null,
      tipo_piso_domicilio: tipoPisoId ? parseInt(tipoPisoId) : null,
      tipo_iluminacao_domicilio: tipoIluminacaoId ? parseInt(tipoIluminacaoId) : null,
      tipo_acessibilidade_domicilio: acessibilidadeId ? parseInt(acessibilidadeId) : null,
      tipo_animal: animalId ? parseInt(animalId) : null,

      agua_canalizada: aguaCanalizada || null,
      tipo_abastecimento_agua: abastecimentoAguaId ? parseInt(abastecimentoAguaId) : null,
      possue_banheiro: possuiBanheiro || null,
      tipo_escoamento_sanitario: escoamentoSanitarioId ? parseInt(escoamentoSanitarioId) : null,
      tipo_coleta_lixo: coletaLixoId ? parseInt(coletaLixoId) : null,
      calcamento_na_frente_domicilio: calcamentoFrente || null,
      area_dificil_acesso: dificilAcesso || null,

      numero_comodos: numeroComodos || null,
      numero_dormitorio: numeroDormitorios || null,
      numero_pessoa_dormitorio: pessoasDormitorio || null,
      total_pessoa_domicilio: totalPessoas || null,
      total_familia_domicilio: totalFamilias || null,
      pessoas_de_zero_a_dezessete: pessoas0a17 || null,
      pessoas_de_dezoito_a_sessenta_e_quatro: pessoas18a64 || null,
      pessoas_com_mais_de_sessenta_e_cinco: pessoas65mais || null,

    };

    try {
      const url = editandoId ? `${API_URL}/api/familias_domicilios/${editandoId}/` : `${API_URL}/api/familias_domicilios/`;
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
        const savedData = await res.json();
        carregarDados();
        setEditandoId(savedData.id);
        setCodigoFamiliaExibicao(savedData.familia_codigo || `FAM-${savedData.id}`);
        setResponsavelFamiliarNome(savedData.responsavel_familiar_nome || 'NÃO CADASTRADO');
        setActiveEditTab('inicio');
      } else {
        const errJson = await res.json();
        setErrorMsg(errJson.detail || 'Ocorreu um erro ao salvar a família/domicílio.');
      }
    } catch (err) {
      setErrorMsg('Erro de conexão com a API.');
    }
  };

  const confirmarTransferenciaUnidade = async () => {
    if (!justificativaTransferencia.trim()) {
      alert('Justificativa de transferência é obrigatória!');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/familias_domicilios/${editandoId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          unidade_atendimento_social_familia: parseInt(unidadeDestinoPendente),
          justificativa_transferencia: justificativaTransferencia
        })
      });

      if (res.ok) {
        const updated = await res.json();
        setTipoUnidadeAtendimentoId(unidadeDestinoPendente);
        setTransferenciaModalAberto(false);
        alert('Unidade de atendimento transferida com sucesso!');
        
        if (updated.transferencias_details) {
          setLocalTransferencias(updated.transferencias_details);
        }
        carregarDados();
      } else {
        alert('Erro ao registrar a transferência.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building className="text-conecta" size={28} />
            Família / Domicílio
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>Gerencie o cadastro de domicílios e famílias assistidas.</p>
        </div>
        <button onClick={abrirNovoModal} className="btn-primary-action">
          <PlusCircle size={18} />
          Cadastrar Família
        </button>
      </div>

      {/* Busca */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Pesquisar por endereço, código da família ou bairro..."
          className="form-control"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ maxWidth: '350px' }}
        />
      </div>

      {/* Tabela Principal */}
      <FamilyTable 
        familias={familias}
        carregando={carregando}
        abrirEditarModal={abrirEditarModal}
        deletarFamilia={deletarFamilia}
      />

      {/* Modal Principal de Edição com as Abas */}
      {modalAberto && (
        <FamilyEditModal 
          editandoId={editandoId}
          codigoFamiliaExibicao={codigoFamiliaExibicao}
          responsavelFamiliarNome={responsavelFamiliarNome}
          activeEditTab={activeEditTab}
          setActiveEditTab={setActiveEditTab}
          setModalAberto={setModalAberto}
          salvarFamilia={salvarFamilia}
          errorMsg={errorMsg}
          unidades={unidades}
          origensCadastro={origensCadastro}
          tipoUnidadeAtendimentoId={tipoUnidadeAtendimentoId}
          origemCadastroId={origemCadastroId}
          dataCadastro={dataCadastro}
          codigoCadUnico={codigoCadUnico}
          dataUltAtualizacao={dataUltAtualizacao}
          unidadeCadastroLabel={unidadeCadastroLabel}
          responsavelCadastroLabel={responsavelCadastroLabel}
          familias={familias}
          setTipoUnidadeAtendimentoId={setTipoUnidadeAtendimentoId}
          setOrigemCadastroId={setOrigemCadastroId}
          setDataCadastro={setDataCadastro}
          setCodigoCadUnico={setCodigoCadUnico}
          setUnidadeOrigemNomeExibicao={setUnidadeOrigemNomeExibicao}
          setUnidadeDestinoPendente={setUnidadeDestinoPendente}
          setJustificativaTransferencia={setJustificativaTransferencia}
          setTransferenciaModalAberto={setTransferenciaModalAberto}
          membrosFamilia={membrosFamilia}
          token={token}
          API_URL={API_URL}
          setMembrosFamilia={setMembrosFamilia}
          carregarDados={carregarDados}
          setModalEscolhaInclusao={setModalEscolhaInclusao}
          setPessoaSelecionadaPendente={setPessoaSelecionadaPendente}
          setNovoParentescoId={setNovoParentescoId}
          setMotivoTransferenciaPessoa={setMotivoTransferenciaPessoa}
          setObservacoesTransferenciaPessoa={setObservacoesTransferenciaPessoa}
          setModalTransferirPessoa={setModalTransferirPessoa}
          cep={cep}
          logradouro={logradouro}
          numero={numero}
          bairro={bairro}
          cidade={cidade}
          uf={uf}
          complemento={complemento}
          mapCoords={mapCoords}
          latitudeVal={latitudeVal}
          longitudeVal={longitudeVal}
          tempoMoradiaAnos={tempoMoradiaAnos}
          tempoMoradiaMeses={tempoMoradiaMeses}
          setCep={setCep}
          setLogradouro={setLogradouro}
          setNumero={setNumero}
          setBairro={setBairro}
          setCidade={setCidade}
          setUf={setUf}
          setComplemento={setComplemento}
          setTempoMoradiaAnos={setTempoMoradiaAnos}
          setTempoMoradiaMeses={setTempoMoradiaMeses}
          localizacaoDomicilio={localizacaoDomicilio}
          setLocalizacaoDomicilio={setLocalizacaoDomicilio}
          areaRisco={areaRisco}
          setAreaRisco={setAreaRisco}
          areaConflito={areaConflito}
          setAreaConflito={setAreaConflito}
          beneficioBolsaFamilia={beneficioBolsaFamilia}
          setBeneficioBolsaFamilia={setBeneficioBolsaFamilia}
          localTransferencias={localTransferencias}
          especiesDomicilio={especiesDomicilio}
          tiposResidencia={tiposResidencia}
          tiposPiso={tiposPiso}
          tiposConstrucao={tiposConstrucao}
          tiposIluminacao={tiposIluminacao}
          tiposAbastecimentoAgua={tiposAbastecimentoAgua}
          tiposEscoamentoSanitario={tiposEscoamentoSanitario}
          tiposColetaLixo={tiposColetaLixo}
          tiposAcessibilidade={tiposAcessibilidade}
          tiposAnimais={tiposAnimais}
          especieDomicilioId={especieDomicilioId}
          tipoResidenciaId={tipoResidenciaId}
          tipoConstrucaoId={tipoConstrucaoId}
          tipoPisoId={tipoPisoId}
          tipoIluminacaoId={tipoIluminacaoId}
          acessibilidadeId={acessibilidadeId}
          animalId={animalId}
          aguaCanalizada={aguaCanalizada}
          abastecimentoAguaId={abastecimentoAguaId}
          possuiBanheiro={possuiBanheiro}
          escoamentoSanitarioId={escoamentoSanitarioId}
          coletaLixoId={coletaLixoId}
          calcamentoFrente={calcamentoFrente}
          dificilAcesso={dificilAcesso}
          numeroComodos={numeroComodos}
          numeroDormitorios={numeroDormitorios}
          pessoasDormitorio={pessoasDormitorio}
          totalPessoas={totalPessoas}
          totalFamilias={totalFamilias}
          pessoas0a17={pessoas0a17}
          pessoas18a64={pessoas18a64}
          pessoas65mais={pessoas65mais}
          setEspecieDomicilioId={setEspecieDomicilioId}
          setTipoResidenciaId={setTipoResidenciaId}
          setTipoConstrucaoId={setTipoConstrucaoId}
          setTipoPisoId={setTipoPisoId}
          setTipoIluminacaoId={setTipoIluminacaoId}
          setAcessibilidadeId={setAcessibilidadeId}
          setAnimalId={setAnimalId}
          setAguaCanalizada={setAguaCanalizada}
          setAbastecimentoAguaId={setAbastecimentoAguaId}
          setPossuiBanheiro={setPossuiBanheiro}
          setEscoamentoSanitarioId={setEscoamentoSanitarioId}
          setColetaLixoId={setColetaLixoId}
          setCalcamentoFrente={setCalcamentoFrente}
          setDificilAcesso={setDificilAcesso}
          setNumeroComodos={setNumeroComodos}
          setNumeroDormitorios={setNumeroDormitorios}
          setPessoasDormitorio={setPessoasDormitorio}
          setTotalPessoas={setTotalPessoas}
          setTotalFamilias={setTotalFamilias}
          setPessoas0a17={setPessoas0a17}
          setPessoas18a64={setPessoas18a64}
          setPessoas65mais={setPessoas65mais}
        />
      )}

      {/* Modais de suporte orquestrados */}
      <FamilyDialogs 
        API_URL={API_URL}
        token={token}
        editandoId={editandoId}
        codigoFamiliaExibicao={codigoFamiliaExibicao}
        modalEscolhaInclusao={modalEscolhaInclusao}
        setModalEscolhaInclusao={setModalEscolhaInclusao}
        setModalIncluirExistente={setModalIncluirExistente}
        modalIncluirExistente={modalIncluirExistente}
        setModalIncluirExistenteOnly={setModalIncluirExistente}
        buscaPessoasQuery={buscaPessoasQuery}
        setBuscaPessoasQuery={setBuscaPessoasQuery}
        pessoasFiltradas={pessoasFiltradas}
        setPessoasFiltradas={setPessoasFiltradas}
        setPessoaSelecionadaPendente={setPessoaSelecionadaPendente}
        setNovoParentescoId={setNovoParentescoId}
        setMotivoTransferenciaPessoa={setMotivoTransferenciaPessoa}
        setObservacoesTransferenciaPessoa={setObservacoesTransferenciaPessoa}
        setModalTransferirPessoa={setModalTransferirPessoa}
        setMembrosFamilia={setMembrosFamilia}
        modalTransferirPessoa={modalTransferirPessoa}
        pessoaSelecionadaPendente={pessoaSelecionadaPendente}
        setModalTransferirPessoaOnly={setModalTransferirPessoa}
        parentescosDisponiveis={parentescosDisponiveis}
        novoParentescoId={novoParentescoId}
        motivoTransferenciaPessoa={motivoTransferenciaPessoa}
        observacoesTransferenciaPessoa={observacoesTransferenciaPessoa}
        carregarDadosFamilia={carregarDados}
      />

      {/* Modal 4: Confirmação de Transferência de Unidade */}
      {transferenciaModalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: 700, color: '#dc2626' }}>
              Confirmar Transferência de Unidade
            </h3>
            <p style={{ fontSize: '14px', color: '#475569', marginBottom: '20px', lineHeight: 1.5 }}>
              Você está alterando a Unidade de Atendimento da família de <strong>{unidadeOrigemNomeExibicao}</strong> para <strong>{unidades.find(u => u.id.toString() === unidadeDestinoPendente.toString())?.nome_conhecido}</strong>.
            </p>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Justificativa da alteração: *
              </label>
              <textarea 
                className="form-control" 
                rows={4} 
                required 
                value={justificativaTransferencia} 
                onChange={e => setJustificativaTransferencia(e.target.value)} 
                placeholder="Informe o motivo da transferência de unidade..." 
                style={{ width: '100%', resize: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                type="button" 
                onClick={() => {
                  setTransferenciaModalAberto(false);
                  const familiaOriginal = familias.find(f => f.id === editandoId);
                  setTipoUnidadeAtendimentoId(familiaOriginal?.unidade_atendimento_social_familia?.toString() || '');
                }} 
                style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={confirmarTransferenciaUnidade} 
                style={{ padding: '8px 16px', backgroundColor: '#dc2626', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
              >
                Confirmar Transferência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
