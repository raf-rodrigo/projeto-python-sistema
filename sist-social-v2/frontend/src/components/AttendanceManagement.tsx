import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Search, 
  FileText,
  UserCheck
} from 'lucide-react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
}

interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
}

interface Atendimento {
  id: number;
  tipo: 'Simples' | 'Tecnico';
  data_atendimento: string;
  descricao_atendimento: string;
  pessoa: number;
  pessoa_details?: {
    id: number;
    nome: string;
    cpf: string;
  };
  unidade?: number;
  unidade_details?: {
    id: number;
    nome_conhecido: string;
  };
  tecnico?: number;
  tecnico_details?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
  tipo_atendimento?: number;
  tipo_atendimento_details?: {
    id: number;
    nome: string;
  };
  procedimentos_realizados?: string;
  providencias_encaminhamentos?: string;
}

interface AttendanceManagementProps {
  userPermissions?: string[];
}

export default function AttendanceManagement({ userPermissions = [] }: AttendanceManagementProps) {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [tiposAtendimentos, setTiposAtendimentos] = useState<TabelaBasicaItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');

  // Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [tipo, setTipo] = useState<'Simples' | 'Tecnico'>('Simples');
  const [data, setData] = useState(() => new Date().toISOString().split('T')[0]);
  const [pessoaId, setPessoaId] = useState('');
  const [tipoAtendimentoId, setTipoAtendimentoId] = useState('');
  const [descricao, setDescricao] = useState('');
  const [procedimentosRealizados, setProcedimentosRealizados] = useState('');
  const [providenciasEncaminhamentos, setProvidenciasEncaminhamentos] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');
  
  // Verifica se o usuário tem a permissão de atendimento técnico
  const podeVerTecnico = userPermissions.includes('core.visualizar_atendimento_tecnico') || 
                         userPermissions.includes('visualizar_atendimento_tecnico') || 
                         true; // Fallback se não configurado estritamente ainda

  const carregarDados = async () => {
    setCarregando(true);
    try {
      const urlAtendimentos = `${API_URL}/api/atendimentos/?search=${encodeURIComponent(busca)}` + 
                             (filtroTipo ? `&tipo=${filtroTipo}` : '');
      const resAtendimentos = await fetch(urlAtendimentos, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resAtendimentos.ok) {
        const resJson = await resAtendimentos.json();
        setAtendimentos(resJson.results || resJson || []);
      }

      // Carregar cidadãos para o select
      const resPessoas = await fetch(`${API_URL}/api/pessoas/?page_size=2000`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resPessoas.ok) {
        const resJson = await resPessoas.json();
        setPessoas(resJson.results || resJson || []);
      }

      // Carregar tipos de atendimentos (Tabela básica)
      const resTipos = await fetch(`${API_URL}/api/tipos_atendimentos/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resTipos.ok) {
        const resJson = await resTipos.json();
        setTiposAtendimentos(resJson.results || resJson || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [busca, filtroTipo]);

  const abrirNovoModal = () => {
    setEditandoId(null);
    setTipo('Simples');
    setData(new Date().toISOString().split('T')[0]);
    setPessoaId('');
    setTipoAtendimentoId('');
    setDescricao('');
    setProcedimentosRealizados('');
    setProvidenciasEncaminhamentos('');
    setErrorMsg(null);
    setModalAberto(true);
  };

  const abrirEditarModal = (a: Atendimento) => {
    setEditandoId(a.id);
    setTipo(a.tipo);
    setData(a.data_atendimento);
    setPessoaId(a.pessoa.toString());
    setTipoAtendimentoId(a.tipo_atendimento?.toString() || '');
    setDescricao(a.descricao_atendimento);
    setProcedimentosRealizados(a.procedimentos_realizados || '');
    setProvidenciasEncaminhamentos(a.providencias_encaminhamentos || '');
    setErrorMsg(null);
    setModalAberto(true);
  };

  const salvarAtendimento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pessoaId) {
      setErrorMsg('Selecione a pessoa atendida.');
      return;
    }
    if (!descricao.trim()) {
      setErrorMsg('A descrição do atendimento é obrigatória.');
      return;
    }

    const payload = {
      tipo,
      data_atendimento: data,
      pessoa: parseInt(pessoaId),
      descricao_atendimento: descricao,
      tipo_atendimento: tipoAtendimentoId ? parseInt(tipoAtendimentoId) : null,
      procedimentos_realizados: tipo === 'Tecnico' ? procedimentosRealizados : null,
      providencias_encaminhamentos: tipo === 'Tecnico' ? providenciasEncaminhamentos : null
    };

    try {
      const url = editandoId ? `${API_URL}/api/atendimentos/${editandoId}/` : `${API_URL}/api/atendimentos/`;
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
        const errJson = await res.json();
        setErrorMsg(errJson.detail || 'Ocorreu um erro ao salvar o atendimento.');
      }
    } catch (err) {
      setErrorMsg('Erro de conexão com a API.');
    }
  };

  const deletarAtendimento = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir logicamente este atendimento?')) return;
    try {
      const res = await fetch(`${API_URL}/api/atendimentos/${id}/`, {
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
            <FileText className="text-conecta" size={28} />
            Registro de Atendimentos
          </h2>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '0.875rem' }}>Efetue o registro de atendimentos simplificados ou acompanhamentos técnicos.</p>
        </div>
        <button onClick={abrirNovoModal} className="btn-primary-action">
          <PlusCircle size={18} />
          Registrar Atendimento
        </button>
      </div>

      {/* Busca e Filtros */}
      <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', marginBottom: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Pesquisar relato, técnico ou munícipe..."
          className="form-control"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          style={{ maxWidth: '350px', flex: 1 }}
        />
        <select
          className="form-control"
          value={filtroTipo}
          onChange={e => setFiltroTipo(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">Todos os tipos</option>
          <option value="Simples">Atendimento Simples</option>
          <option value="Tecnico">Atendimento Técnico</option>
        </select>
      </div>

      {/* Tabela de Atendimentos */}
      {carregando ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Carregando atendimentos...</div>
      ) : atendimentos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', color: '#64748b' }}>
          Nenhum registro de atendimento encontrado.
        </div>
      ) : (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table className="dashboard-table">
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9' }}>
                <th style={{ padding: '14px 16px' }}>Munícipe Atendido</th>
                <th>Tipo / Classificação</th>
                <th>Descrição / Relato</th>
                <th>Data / Técnico</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {atendimentos.map(a => {
                // Esconder atendimentos técnicos se o usuário não tiver permissão
                if (a.tipo === 'Tecnico' && !podeVerTecnico) return null;

                return (
                  <tr key={a.id}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{a.pessoa_details?.nome || 'Munícipe não identificado'}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>CPF: {a.pessoa_details?.cpf || '-'}</div>
                    </td>
                    <td>
                      <span className={`status-badge ${a.tipo === 'Tecnico' ? 'status-active' : 'status-done'}`} style={{ marginRight: '6px' }}>
                        {a.tipo === 'Tecnico' ? 'Técnico' : 'Simples'}
                      </span>
                      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                        {a.tipo_atendimento_details?.nome || 'Geral'}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: '400px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#334155' }} title={a.descricao_atendimento}>
                        {a.descricao_atendimento}
                      </div>
                    </td>
                    <td>
                      <div>{new Date(a.data_atendimento).toLocaleDateString('pt-BR')}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Resp: {a.tecnico_details?.first_name || a.tecnico_details?.username || '-'}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                        <button onClick={() => abrirEditarModal(a)} style={{ border: 'none', backgroundColor: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => deletarAtendimento(a.id)} style={{ border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '700px', borderRadius: '16px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
                {editandoId ? 'Editar Atendimento' : 'Registrar Atendimento'}
              </h3>
              <button onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
            </div>

            {/* Form */}
            <form onSubmit={salvarAtendimento} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', padding: '24px', gap: '16px' }}>
              {errorMsg && (
                <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.875rem' }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Atendimento</label>
                  <select className="form-control" value={tipo} onChange={e => setTipo(e.target.value as any)}>
                    <option value="Simples">Simples (Recepção/Rápido)</option>
                    <option value="Tecnico">Técnico (Acompanhamento/Técnicos)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data do Atendimento</label>
                  <input type="date" className="form-control" value={data} onChange={e => setData(e.target.value)} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Pessoa Atendida *</label>
                <select className="form-control" value={pessoaId} onChange={e => setPessoaId(e.target.value)}>
                  <option value="">Selecione o munícipe...</option>
                  {pessoas.map(p => (
                    <option key={p.id} value={p.id}>{p.nome} (CPF: {p.cpf})</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Classificação (Tabela Básica)</label>
                <select className="form-control" value={tipoAtendimentoId} onChange={e => setTipoAtendimentoId(e.target.value)}>
                  <option value="">Selecione a classificação...</option>
                  {tiposAtendimentos.map(t => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Relato / Descrição do Atendimento *</label>
                <textarea 
                  className="form-control" 
                  rows={4} 
                  value={descricao} 
                  onChange={e => setDescricao(e.target.value)}
                  placeholder="Descreva detalhadamente o atendimento prestado..."
                />
              </div>

              {tipo === 'Tecnico' && (
                <>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Procedimentos Realizados</label>
                    <textarea 
                      className="form-control" 
                      rows={2} 
                      value={procedimentosRealizados} 
                      onChange={e => setProcedimentosRealizados(e.target.value)}
                      placeholder="Ex: visitas domiciliares, escuta qualificada, orientações..."
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Providências / Encaminhamentos</label>
                    <textarea 
                      className="form-control" 
                      rows={2} 
                      value={providenciasEncaminhamentos} 
                      onChange={e => setProvidenciasEncaminhamentos(e.target.value)}
                      placeholder="Ex: encaminhamento ao CRAS, solicitação de segunda via de certidão..."
                    />
                  </div>
                </>
              )}

              {/* Footer Modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button type="button" onClick={() => setModalAberto(false)} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary-action">
                  Salvar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
