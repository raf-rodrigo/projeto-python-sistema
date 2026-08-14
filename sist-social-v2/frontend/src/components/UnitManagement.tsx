import { useState, useEffect } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  MapPin, 
  Phone, 
  Clock, 
  AlertCircle
} from 'lucide-react';

interface TipoUnidade {
  id: number;
  nome: string;
}

interface Area {
  id: number;
  nome: string;
}

interface Unidade {
  id: number;
  tipo_unidade?: number;
  tipo_unidade_details?: TipoUnidade;
  codigo?: number;
  cnpj?: string;
  razao_social: string;
  nome_conhecido: string;
  cep: string;
  logradouro: string;
  logradouro_tipo?: string;
  logradouro_numero: string;
  logradouro_complemento?: string;
  municipio?: string;
  uf?: string;
  latitude?: string;
  longitude?: string;
  icone_mapa?: string;
  email?: string;
  telefone?: string;
  telefone2?: string;
  imovel_situacao: 'Nenhum' | 'Próprio' | 'Alugado' | 'Cedido';
  imovel_social: boolean;
  observacoes?: string;
  data_implantacao?: string;
  dias_funcionamento?: string[];
  area_atuacao?: number;
  area_atuacao_details?: Area;
  area_geo_atuacao?: string;
  area_geo_polig?: string;
  recursos_disponiveis?: string;
  sigla: string;
  natureza: 'Público' | 'Privado';
  horario_inicio?: string;
  horario_fim?: string;
}

export default function UnitManagement() {
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  
  // Listas de apoio para os dropdowns
  const [tiposUnidade, setTiposUnidade] = useState<TipoUnidade[]>([]);
  const [areasAtuacion, setAreasAtuacion] = useState<Area[]>([]);

  // Estados do Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<'dados' | 'endereco' | 'funcionamento' | 'infra'>('dados');
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);
  const [fieldToFocus, setFieldToFocus] = useState<{ id: string; tab: 'dados' | 'endereco' | 'funcionamento' | 'infra' } | null>(null);

  // Estados dos Campos do Formulário
  const [tipoUnidadeId, setTipoUnidadeId] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeConhecido, setNomeConhecido] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [logradouroNumero, setLogradouroNumero] = useState('');
  const [logradouroComplemento, setLogradouroComplemento] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [uf, setUf] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [telefone2, setTelefone2] = useState('');
  const [imovelSituacao, setImovelSituacao] = useState<'Nenhum' | 'Próprio' | 'Alugado' | 'Cedido'>('Nenhum');
  const [imovelSocial, setImovelSocial] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [dataImplantacao, setDataImplantacao] = useState('');
  const [diasFuncionamento, setDiasFuncionamento] = useState<string[]>(['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);
  const [areaAtuacaoId, setAreaAtuacaoId] = useState('');
  const [areaGeoAtuacao, setAreaGeoAtuacao] = useState('');
  const [recursosDisponiveis, setRecursosDisponiveis] = useState('');
  const [sigla, setSigla] = useState('');
  const [natureza, setNatureza] = useState<'Público' | 'Privado'>('Público');
  const [horarioInicio, setHorarioInicio] = useState('08:00');
  const [horarioFim, setHorarioFim] = useState('18:00');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');

  // Buscar Unidades e Auxiliares
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const resUnidades = await fetch(`${API_URL}/api/unidades/?search=${encodeURIComponent(busca)}`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resUnidades.ok) {
        const data = await resUnidades.json();
        setUnidades(data.results || data || []);
      }

      // Busca Tipos de Unidade
      const resTipos = await fetch(`${API_URL}/api/tipo_unidade/?page_size=200`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resTipos.ok) {
        const data = await resTipos.json();
        setTiposUnidade((data.results || data || []).sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
      }

      // Busca Áreas de Atuação
      const resAreas = await fetch(`${API_URL}/api/areas/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resAreas.ok) {
        const data = await resAreas.json();
        setAreasAtuacion((data.results || data || []).sort((a: any, b: any) => a.nome.localeCompare(b.nome)));
      }
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [busca]);

  // Busca CEP automático
  const handleCepBlur = async () => {
    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      if (!response.ok) return;
      const data = await response.json();
      if (data.erro) {
        setFieldToFocus({ id: 'input-cep', tab: 'endereco' });
        setErrorModalMsg('CEP não encontrado.');
        return;
      }
      setLogradouro(data.logradouro || '');
      setMunicipio(data.localidade || '');
      setUf(data.uf || '');
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  const abrirNovoModal = () => {
    setEditandoId(null);
    setActiveModalTab('dados');
    setFieldToFocus(null);

    // Resets
    setTipoUnidadeId('');
    setCodigo('');
    setCnpj('');
    setRazaoSocial('');
    setNomeConhecido('');
    setCep('');
    setLogradouro('');
    setLogradouroNumero('');
    setLogradouroComplemento('');
    setMunicipio('');
    setUf('');
    setLatitude('');
    setLongitude('');
    setEmail('');
    setTelefone('');
    setTelefone2('');
    setImovelSituacao('Nenhum');
    setImovelSocial(false);
    setObservacoes('');
    setDataImplantacao('');
    setDiasFuncionamento(['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);
    setAreaAtuacaoId('');
    setAreaGeoAtuacao('');
    setRecursosDisponiveis('');
    setSigla('');
    setNatureza('Público');
    setHorarioInicio('08:00');
    setHorarioFim('18:00');

    setModalAberto(true);
  };

  const abrirEditarModal = (u: Unidade) => {
    setEditandoId(u.id);
    setActiveModalTab('dados');
    setFieldToFocus(null);

    setTipoUnidadeId(u.tipo_unidade?.toString() || '');
    setCodigo(u.codigo?.toString() || '');
    setCnpj(u.cnpj || '');
    setRazaoSocial(u.razao_social);
    setNomeConhecido(u.nome_conhecido);
    setCep(u.cep);
    setLogradouro(u.logradouro);
    setLogradouroNumero(u.logradouro_numero);
    setLogradouroComplemento(u.logradouro_complemento || '');
    setMunicipio(u.municipio || '');
    setUf(u.uf || '');
    setLatitude(u.latitude || '');
    setLongitude(u.longitude || '');
    setEmail(u.email || '');
    setTelefone(u.telefone || '');
    setTelefone2(u.telefone2 || '');
    setImovelSituacao(u.imovel_situacao);
    setImovelSocial(u.imovel_social);
    setObservacoes(u.observacoes || '');
    setDataImplantacao(u.data_implantacao || '');
    setDiasFuncionamento(u.dias_funcionamento || ['Seg', 'Ter', 'Qua', 'Qui', 'Sex']);
    setAreaAtuacaoId(u.area_atuacao?.toString() || '');
    setAreaGeoAtuacao(u.area_geo_atuacao || '');
    setRecursosDisponiveis(u.recursos_disponiveis || '');
    setSigla(u.sigla);
    setNatureza(u.natureza);
    setHorarioInicio(u.horario_inicio || '08:00');
    setHorarioFim(u.horario_fim || '18:00');

    setModalAberto(true);
  };

  const salvarUnidade = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!nomeConhecido.trim()) {
      setFieldToFocus({ id: 'input-nome-conhecido', tab: 'dados' });
      setErrorModalMsg('O campo Nome Conhecido é obrigatório.');
      return;
    }
    if (!razaoSocial.trim()) {
      setFieldToFocus({ id: 'input-razao-social', tab: 'dados' });
      setErrorModalMsg('O campo Razão Social é obrigatório.');
      return;
    }
    if (!sigla.trim()) {
      setFieldToFocus({ id: 'input-sigla', tab: 'dados' });
      setErrorModalMsg('O campo Sigla é obrigatório.');
      return;
    }
    if (!cep.trim()) {
      setFieldToFocus({ id: 'input-cep', tab: 'endereco' });
      setErrorModalMsg('O campo CEP é obrigatório.');
      return;
    }
    if (!logradouro.trim()) {
      setFieldToFocus({ id: 'input-logradouro', tab: 'endereco' });
      setErrorModalMsg('O campo Logradouro é obrigatório.');
      return;
    }
    if (!logradouroNumero.trim()) {
      setFieldToFocus({ id: 'input-numero', tab: 'endereco' });
      setErrorModalMsg('O campo Número é obrigatório.');
      return;
    }

    const payload = {
      tipo_unidade: tipoUnidadeId ? parseInt(tipoUnidadeId) : null,
      codigo: codigo ? parseInt(codigo) : null,
      cnpj: cnpj || null,
      razao_social: razaoSocial,
      nome_conhecido: nomeConhecido,
      cep,
      logradouro,
      logradouro_numero: logradouroNumero,
      logradouro_complemento: logradouroComplemento || null,
      municipio: municipio || null,
      uf: uf || null,
      latitude: latitude || null,
      longitude: longitude || null,
      email: email || null,
      telefone: telefone || null,
      telefone2: telefone2 || null,
      imovel_situacao: imovelSituacao,
      imovel_social: imovelSocial,
      observacoes: observacoes || null,
      data_implantacao: dataImplantacao || null,
      dias_funcionamento: diasFuncionamento,
      area_atuacao: areaAtuacaoId ? parseInt(areaAtuacaoId) : null,
      area_geo_atuacao: areaGeoAtuacao || null,
      recursos_disponiveis: recursosDisponiveis || null,
      sigla,
      natureza,
      horario_inicio: horarioInicio || null,
      horario_fim: horarioFim || null,
    };

    try {
      const url = editandoId 
        ? `${API_URL}/api/unidades/${editandoId}/` 
        : `${API_URL}/api/unidades/`;
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
        setErrorModalMsg(errorData.detail || 'Erro ao salvar unidade.');
      }
    } catch (err) {
      setErrorModalMsg('Erro ao conectar-se com o servidor.');
    }
  };

  const deletarUnidade = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja realizar a exclusão lógica desta unidade?')) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/unidades/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        carregarDados();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDia = (dia: string) => {
    if (diasFuncionamento.includes(dia)) {
      setDiasFuncionamento(diasFuncionamento.filter(d => d !== dia));
    } else {
      setDiasFuncionamento([...diasFuncionamento, dia]);
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100%' }}>
      {/* Título */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 className="text-conecta" size={28} />
            Cadastro de Unidades
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>Gerencie as unidades socioassistenciais e postos de atendimento da rede municipal.</p>
        </div>
        <button 
          onClick={abrirNovoModal} 
          className="btn-primary-action"
        >
          <PlusCircle size={18} />
          Nova Unidade
        </button>
      </div>

      {/* Busca */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Pesquisar por nome, sigla, CNPJ ou razão social..."
          className="form-control"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Listagem */}
      {carregando ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Carregando unidades...</div>
      ) : unidades.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', color: '#64748b' }}>
          Nenhuma unidade cadastrada ou encontrada.
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table className="dashboard-table">
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '14px 16px' }}>Nome Conhecido / Sigla</th>
                <th>Tipo / Natureza</th>
                <th>Endereço / Contato</th>
                <th>Funcionamento</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {unidades.map(u => (
                <tr key={u.id}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{u.nome_conhecido}</div>
                    <span style={{ fontSize: '11px', backgroundColor: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{u.sigla}</span>
                    {u.codigo && <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>Cód: {u.codigo}</span>}
                  </td>
                  <td>
                    <div style={{ fontSize: '13px', color: '#334155' }}>{u.tipo_unidade_details?.nome || 'Não Definido'}</div>
                    <span style={{ 
                      fontSize: '11px', 
                      backgroundColor: u.natureza === 'Público' ? '#dcfce7' : '#fee2e2', 
                      color: u.natureza === 'Público' ? '#15803d' : '#991b1b', 
                      padding: '2px 6px', 
                      borderRadius: '4px', 
                      fontWeight: 600 
                    }}>{u.natureza}</span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} />
                      {u.logradouro}, {u.logradouro_numero} {u.municipio ? `- ${u.municipio}/${u.uf}` : ''}
                    </div>
                    {u.telefone && (
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Phone size={12} />
                        {u.telefone}
                      </div>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {u.horario_inicio || '08:00'} às {u.horario_fim || '18:00'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      {u.dias_funcionamento ? u.dias_funcionamento.join(', ') : 'Seg a Sex'}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                      <button 
                        onClick={() => abrirEditarModal(u)} 
                        title="Editar" 
                        style={{ border: 'none', backgroundColor: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => deletarUnidade(u.id)} 
                        title="Excluir (Lógica)" 
                        style={{ border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
                      >
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

      {/* MODAL DE CADASTRO / EDIÇÃO */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '750px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            
            {/* Header Modal */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                  {editandoId ? 'Editar Unidade' : 'Cadastrar Nova Unidade'}
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>Insira as informações gerais, funcionamento e localização geográfica da unidade.</p>
              </div>
              <button 
                onClick={() => setModalAberto(false)} 
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            {/* Tabs do Modal */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', padding: '0 16px' }}>
              {[
                { id: 'dados', label: 'Dados Gerais' },
                { id: 'endereco', label: 'Localização' },
                { id: 'funcionamento', label: 'Funcionamento' },
                { id: 'infra', label: 'Infraestrutura' }
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
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Body do Formulário */}
            <form onSubmit={salvarUnidade} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '24px', flex: 1 }}>
                
                {/* ABA 1: DADOS GERAIS */}
                {activeModalTab === 'dados' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Conhecido / Fantasia *</label>
                        <input type="text" id="input-nome-conhecido" className="form-control" value={nomeConhecido} onChange={e => setNomeConhecido(e.target.value)} placeholder="Ex: CRAS Central" />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Sigla *</label>
                        <input type="text" id="input-sigla" className="form-control" value={sigla} onChange={e => setSigla(e.target.value)} placeholder="Ex: CRASC" />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Razão Social *</label>
                      <input type="text" id="input-razao-social" className="form-control" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} placeholder="Ex: Secretaria Municipal de Assistência Social" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>CNPJ</label>
                        <input type="text" className="form-control" value={cnpj} onChange={e => setCnpj(e.target.value)} placeholder="Apenas números" maxLength={14} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Código da Unidade</label>
                        <input type="number" className="form-control" value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Ex: 123" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Categoria (Tipo) *</label>
                        <select className="form-control" value={tipoUnidadeId} onChange={e => setTipoUnidadeId(e.target.value)}>
                          <option value="">Selecione a categoria...</option>
                          {tiposUnidade.map(t => (
                            <option key={t.id} value={t.id}>{t.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Natureza *</label>
                        <select className="form-control" value={natureza} onChange={e => setNatureza(e.target.value as any)}>
                          <option value="Público">Público</option>
                          <option value="Privado">Privado</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data de Implantação</label>
                      <input type="date" className="form-control" value={dataImplantacao} onChange={e => setDataImplantacao(e.target.value)} />
                    </div>
                  </div>
                )}

                {/* ABA 2: LOCALIZAÇÃO */}
                {activeModalTab === 'endereco' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>CEP *</label>
                        <input type="text" id="input-cep" className="form-control" value={cep} onChange={e => setCep(e.target.value)} onBlur={handleCepBlur} placeholder="Digite o CEP" />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Logradouro *</label>
                        <input type="text" id="input-logradouro" className="form-control" value={logradouro} onChange={e => setLogradouro(e.target.value)} placeholder="Rua, Avenida, etc." />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Número *</label>
                        <input type="text" id="input-numero" className="form-control" value={logradouroNumero} onChange={e => setLogradouroNumero(e.target.value)} placeholder="Nº" />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Complemento</label>
                        <input type="text" className="form-control" value={logradouroComplemento} onChange={e => setLogradouroComplemento(e.target.value)} placeholder="Bloco, Apt, Sala..." />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Município</label>
                        <input type="text" className="form-control" value={municipio} onChange={e => setMunicipio(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>UF</label>
                        <input type="text" className="form-control" value={uf} onChange={e => setUf(e.target.value)} maxLength={2} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Latitude</label>
                        <input type="text" className="form-control" value={latitude} onChange={e => setLatitude(e.target.value)} placeholder="Ex: -23.550520" />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Longitude</label>
                        <input type="text" className="form-control" value={longitude} onChange={e => setLongitude(e.target.value)} placeholder="Ex: -46.633308" />
                      </div>
                    </div>
                  </div>
                )}

                {/* ABA 3: FUNCIONAMENTO E CONTATO */}
                {activeModalTab === 'funcionamento' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Telefone 1</label>
                        <input type="text" className="form-control" value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="Ex: (11) 98765-4321" />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Telefone 2 (Alternativo)</label>
                        <input type="text" className="form-control" value={telefone2} onChange={e => setTelefone2(e.target.value)} placeholder="Ex: (11) 91234-5678" />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>E-mail da Unidade</label>
                      <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="Ex: cras.norte@municipio.sp.gov.br" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Horário de Abertura</label>
                        <input type="time" className="form-control" value={horarioInicio} onChange={e => setHorarioInicio(e.target.value)} />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Horário de Fechamento</label>
                        <input type="time" className="form-control" value={horarioFim} onChange={e => setHorarioFim(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '8px' }}>Dias de Funcionamento</label>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(d => {
                          const ativo = diasFuncionamento.includes(d);
                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => toggleDia(d)}
                              style={{
                                padding: '8px 16px',
                                border: '1px solid',
                                borderColor: ativo ? '#f5911e' : '#cbd5e1',
                                backgroundColor: ativo ? '#fff7ed' : '#ffffff',
                                color: ativo ? '#f5911e' : '#475569',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {d}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* ABA 4: INFRAESTRUTURA E ATUAÇÃO */}
                {activeModalTab === 'infra' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Situação do Imóvel</label>
                        <select className="form-control" value={imovelSituacao} onChange={e => setImovelSituacao(e.target.value as any)}>
                          <option value="Nenhum">Nenhum</option>
                          <option value="Próprio">Próprio</option>
                          <option value="Alugado">Alugado</option>
                          <option value="Cedido">Cedido</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', height: '100%', paddingTop: '20px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer', fontWeight: 500 }}>
                          <input
                            type="checkbox"
                            checked={imovelSocial}
                            onChange={e => setImovelSocial(e.target.checked)}
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                          />
                          Imóvel Social?
                        </label>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Área de Atuação (Região)</label>
                        <select className="form-control" value={areaAtuacaoId} onChange={e => setAreaAtuacaoId(e.target.value)}>
                          <option value="">Selecione uma região...</option>
                          {areasAtuacion.map(a => (
                            <option key={a.id} value={a.id}>{a.nome}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Territórios de Abrangência (Bairros)</label>
                        <input type="text" className="form-control" value={areaGeoAtuacao} onChange={e => setAreaGeoAtuacao(e.target.value)} placeholder="Ex: Bairro Norte, Centro-Oeste" />
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Recursos e Salas Disponíveis</label>
                      <input type="text" className="form-control" value={recursosDisponiveis} onChange={e => setRecursosDisponiveis(e.target.value)} placeholder="Ex: 3 salas de atendimento, 1 auditório, banheiros adaptados" />
                    </div>

                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Observações</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={observacoes}
                        onChange={e => setObservacoes(e.target.value)}
                        placeholder="Insira detalhes adicionais sobre o atendimento, acessibilidade ou parcerias..."
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* Botões do Modal */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#f8fafc' }}>
                <button 
                  type="button" 
                  onClick={() => setModalAberto(false)} 
                  className="form-control" 
                  style={{ maxWidth: '100px', cursor: 'pointer', margin: 0 }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn conecta text-white" 
                  style={{ maxWidth: '120px', marginTop: 0 }}
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALERT DIALOG DE ERRO */}
      {errorModalMsg && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
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
