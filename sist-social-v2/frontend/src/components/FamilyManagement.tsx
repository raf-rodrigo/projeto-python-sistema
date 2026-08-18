import { useState, useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import SearchableSelect from './SearchableSelect';
import { 
  Building, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  MapPin, 
  Search
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';

// Correção para ícones padrão do Leaflet no React
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface TabelaBasicaItem {
  id: number;
  nome: string;
}

  interface FamiliaDomicilio {
  id: number;
  familia_codigo?: string;
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
}

// Componente auxiliar para atualizar a visualização do Leaflet Map
function MapController({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 16);
  }, [coords, map]);
  return null;
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

  // Form Fields (Conforme o Mockup da Imagem)
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('SP');
  const [complemento, setComplemento] = useState('');

  // Coordenadas para o Mapa interativo Leaflet
  // Itapevi/São Paulo padrão se vazio [-23.5489, -46.6388]
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

  // Valores padrão/somente leitura carregados da sessão
  const [unidadeCadastroLabel, setUnidadeCadastroLabel] = useState('CREAS ITAPEGICA');
  const [responsavelCadastroLabel, setResponsavelCadastroLabel] = useState('Rafael Doimo');

  // Controle de abas da tela de edição (estilo imagem 12-42-25)
  const [activeEditTab, setActiveEditTab] = useState('endereco'); // 'endereco' selecionado por padrão na imagem
  const [codigoFamiliaExibicao, setCodigoFamiliaExibicao] = useState('');
  const [responsavelFamiliarNome, setResponsavelFamiliarNome] = useState('MARCELO DA SILVA');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');

  // Consulta endereço e coordenadas com Nominatim (OpenStreetMap) a partir do CEP
  const consultarCep = async (cepDigitado: string) => {
    const limpo = cepDigitado.replace(/\D/g, '');
    if (limpo.length === 8) {
      try {
        // Busca do ViaCEP para preencher campos rápidos
        const resVia = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
        if (resVia.ok) {
          const dadosVia = await resVia.json();
          if (!dadosVia.erro) {
            setLogradouro(dadosVia.logradouro || '');
            setBairro(dadosVia.bairro || '');
            setCidade(dadosVia.localidade || '');
            setUf(dadosVia.uf || 'SP');

            // Busca coordenadas de latitude/longitude usando Nominatim (OSM)
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
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [busca]);

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
    // Recupera dados do operador logado da sessão para autopreencher
    const sessionUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Obtém o nome conhecido da unidade ativa
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

    setErrorMsg(null);
    setModalAberto(true);
  };

  const abrirEditarModal = (f: FamiliaDomicilio) => {
    setEditandoId(f.id);
    setCep(f.logradouro_cep || '');
    setLogradouro(f.logradouro_nome || '');
    setNumero(f.logradouro_numero || '');
    setBairro(f.bairro || '');
    setCidade(f.cidade || '');
    setUf(f.estado || 'SP');
    setComplemento(f.logradouro_complemento || '');
    
    if (f.latitude && f.longitude) {
      setMapCoords([parseFloat(f.latitude), parseFloat(f.longitude)]);
      setLatitudeVal(f.latitude);
      setLongitudeVal(f.longitude);
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
    
    setUnidadeCadastroLabel(f.unidade_cadastro_details?.nome_conhecido || 'CREAS ITAPEGICA');
    setResponsavelCadastroLabel(
      f.responsavel_cadastro_details?.first_name 
        ? `${f.responsavel_cadastro_details.first_name} ${f.responsavel_cadastro_details.last_name || ''}`
        : f.responsavel_cadastro_details?.username || 'Rafael Doimo'
    );
    
    // Configura cabeçalho específico de edição
    setCodigoFamiliaExibicao(f.familia_codigo || `Fam-${f.id}`);
    setResponsavelFamiliarNome(f.responsavel_familiar_nome || 'NÃO CADASTRADO');
    setActiveEditTab('inicio');

    setErrorMsg(null);
    setModalAberto(true);
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
      responsavel_cadastro: sessionUser.id || null
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
        
        // Em vez de fechar o modal, abre imediatamente no modo de edição estruturado em abas
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

      {/* Tabela de Famílias */}
      {carregando ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Carregando dados...</div>
      ) : familias.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', color: '#64748b' }}>
          Nenhuma família cadastrada no sistema.
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table className="dashboard-table">
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '14px 16px' }}>Código da Família</th>
                <th>Endereço / Localização</th>
                <th>Coordenadas (Lat/Lon)</th>
                <th>Unidade Responsável</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {familias.map(f => (
                <tr key={f.id}>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{f.familia_codigo || `FAM-${f.id}`}</td>
                  <td>
                    <div>{f.logradouro_nome}, {f.logradouro_numero || 'S/N'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{f.bairro} - {f.cidade}/{f.estado}</div>
                  </td>
                  <td style={{ fontSize: '12px', color: '#475569' }}>
                    {f.latitude && f.longitude ? `${parseFloat(f.latitude).toFixed(4)}, ${parseFloat(f.longitude).toFixed(4)}` : 'Sem coordenadas'}
                  </td>
                  <td>{f.unidade_atendimento_social_familia_details?.nome_conhecido || 'Unidade Geral'}</td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button onClick={() => abrirEditarModal(f)} style={{ border: 'none', backgroundColor: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => deletarFamilia(f.id)} style={{ border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
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

      {/* MODAL CADASTRAR FAMÍLIA (Mockup V1) */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '1100px', borderRadius: '16px', display: 'flex', flexDirection: 'column', maxHeight: '95vh', overflow: 'hidden' }}>
            
             {/* Header com Código Família, RF e Ações */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                    Família Domicilio
                  </h3>
                  {editandoId && (
                    <div style={{ fontSize: '13px', color: '#475569', display: 'flex', gap: '16px' }}>
                      <span><strong>Código Família:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>{codigoFamiliaExibicao}</span></span>
                      <span><strong>RF:</strong> <span style={{ color: '#2563eb', fontWeight: 600 }}>{responsavelFamiliarNome}</span></span>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {editandoId && (
                    <>
                      <button type="button" style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        👁️ Visualizar Documentos
                      </button>
                      <button type="button" style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#2563eb', border: 'none', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        🖨️ Imprimir Ficha
                      </button>
                    </>
                  )}
                  <button onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer', marginLeft: '10px' }}>&times;</button>
                </div>
              </div>

              {/* Barra de 11 Abas da Família (Estilo imagem 12-42-25) */}
              {editandoId && (
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', borderBottom: '1px solid #e2e8f0', scrollbarWidth: 'thin' }}>
                  {[
                    { id: 'inicio', label: '➡ Início' },
                    { id: 'composicao', label: '👥 Composição Familiar' },
                    { id: 'endereco', label: '🗺 Endereço' },
                    { id: 'habitacionais', label: '🏠 Condições Habitacionais' },
                    { id: 'etnia', label: '🎨 Etnia do Grupo Familiar' },
                    { id: 'despesas', label: '💵 Despesas' },
                    { id: 'socioassistenciais', label: '🤝 Condições Socioassistenciais' },
                    { id: 'observacoes', label: '📝 Observações' },
                    { id: 'historico_atendimento', label: '📋 Histórico de Atendimento' },
                    { id: 'historico_transferencia', label: '🔄 Histórico de Transferência' },
                    { id: 'beneficios', label: '🤝 Benefícios Recebidos' },
                  ].map(tab => {
                    const isSelected = activeEditTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveEditTab(tab.id)}
                        style={{
                          padding: '8px 14px',
                          fontSize: '12px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          border: 'none',
                          borderTopLeftRadius: '6px',
                          borderTopRightRadius: '6px',
                          backgroundColor: isSelected ? '#10b981' : '#f3f4f6',
                          color: isSelected ? '#ffffff' : '#475569',
                          cursor: 'pointer',
                          transition: 'all 0.15s'
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={salvarFamilia} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '24px', gap: '20px' }}>
              {errorMsg && (
                <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>
                  {errorMsg}
                </div>
              )}

              {/* Aba 3: Endereço (Será visível quando o modo for Criação OU Aba Ativa for 'endereco') */}
              {(!editandoId || activeEditTab === 'endereco') && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                  
                  {/* Endereço Box */}
                  <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Cep: *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={cep} 
                        onChange={e => {
                          const val = e.target.value.replace(/\D/g, '');
                          if (val.length <= 8) setCep(val);
                        }} 
                        required 
                        placeholder="Apenas números (8 dígitos)" 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Logradouro:</label>
                      <input type="text" className="form-control" value={logradouro} onChange={e => setLogradouro(e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Número:</label>
                        <input type="text" className="form-control" value={numero} onChange={e => setNumero(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Bairro:</label>
                        <input type="text" className="form-control" value={bairro} onChange={e => setBairro(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Cidade:</label>
                      <input type="text" className="form-control" value={cidade} onChange={e => setCidade(e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>UF:</label>
                        <input type="text" className="form-control" value={uf} onChange={e => setUf(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Complemento:</label>
                        <input type="text" className="form-control" value={complemento} onChange={e => setComplemento(e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mapa Leaflet Box */}
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', height: '390px', position: 'relative' }}>
                  <MapContainer 
                    center={mapCoords} 
                    zoom={15} 
                    style={{ width: '100%', height: '100%', zIndex: 1 }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={mapCoords} />
                    <MapController coords={mapCoords} />
                  </MapContainer>
                  {latitudeVal && (
                    <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#334155', zIndex: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                      Lat: {parseFloat(latitudeVal).toFixed(6)} | Lon: {parseFloat(longitudeVal).toFixed(6)}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Box 2: Indicadores e Dados Socioassistenciais (Será visível quando o modo for Criação OU Aba Ativa for 'endereco') */}
              {(!editandoId || activeEditTab === 'endereco') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '20px', alignItems: 'center' }}>
                    {/* Tempo Moradia */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Tempo Moradia:</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="number" className="form-control" value={tempoMoradiaAnos} onChange={e => setTempoMoradiaAnos(e.target.value)} style={{ width: '80px' }} />
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Anos</span>
                        <input type="number" className="form-control" value={tempoMoradiaMeses} onChange={e => setTempoMoradiaMeses(e.target.value)} style={{ width: '80px' }} />
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Meses</span>
                      </div>
                    </div>

                    {/* Localização Domicilio (Radios) */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Localização do Domicílio</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="radio" name="localizacaoDomicilio" checked={localizacaoDomicilio === 'Urbana'} onChange={() => setLocalizacaoDomicilio('Urbana')} /> Urbana
                        </label>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="radio" name="localizacaoDomicilio" checked={localizacaoDomicilio === 'Rural'} onChange={() => setLocalizacaoDomicilio('Rural')} /> Rural
                        </label>
                      </div>
                    </div>

                    {/* Área Risco (Radios) */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Área de Risco</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="radio" name="areaRisco" checked={areaRisco === 'Sim'} onChange={() => setAreaRisco('Sim')} /> Sim
                        </label>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="radio" name="areaRisco" checked={areaRisco === 'Não'} onChange={() => setAreaRisco('Não')} /> Não
                        </label>
                      </div>
                    </div>

                    {/* Área Conflito (Radios) */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Área Conflito / Violência</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="radio" name="areaConflito" checked={areaConflito === 'Sim'} onChange={() => setAreaConflito('Sim')} /> Sim
                        </label>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="radio" name="areaConflito" checked={areaConflito === 'Não'} onChange={() => setAreaConflito('Não')} /> Não
                        </label>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'center' }}>
                    {/* Unidade Atendimento */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Unidade Atendimento da Família: *</label>
                      <SearchableSelect 
                        options={unidades.map(u => ({ id: u.id, label: u.nome_conhecido }))} 
                        value={tipoUnidadeAtendimentoId} 
                        onChange={val => setTipoUnidadeAtendimentoId(val.toString())} 
                        placeholder="Selecione a Unidade..." 
                        required 
                      />
                    </div>

                    {/* Bolsa Família (Radios) */}
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Benef. Bolsa Família</label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="radio" name="beneficioBolsaFamilia" checked={beneficioBolsaFamilia === 'Sim'} onChange={() => setBeneficioBolsaFamilia('Sim')} /> Sim
                        </label>
                        <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input type="radio" name="beneficioBolsaFamilia" checked={beneficioBolsaFamilia === 'Não'} onChange={() => setBeneficioBolsaFamilia('Não')} /> Não
                        </label>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Data Cadastro: *</label>
                      <input type="date" className="form-control" value={dataCadastro} onChange={e => setDataCadastro(e.target.value)} required />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Origem do Cadastro: *</label>
                      <SearchableSelect 
                        options={origensCadastro.map(o => ({ id: o.id, label: o.nome }))} 
                        value={origemCadastroId} 
                        onChange={val => setOrigemCadastroId(val.toString())} 
                        placeholder="Selecione a Origem..." 
                        required 
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Unidade Cadastro:</label>
                      <input type="text" className="form-control" value={unidadeCadastroLabel} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Responsável pelo Cadastro:</label>
                      <input type="text" className="form-control" value={responsavelCadastroLabel} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
                    </div>
                  </div>

                </div>
              )}

              {/* Botões de Ação */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '4px', color: '#dc2626', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '4px', color: '#ffffff', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                  Salvar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
