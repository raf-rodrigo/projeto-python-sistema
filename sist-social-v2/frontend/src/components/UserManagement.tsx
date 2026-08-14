import { useState, useEffect } from 'react';
import { UserPlus, Edit2, Trash2, Shield, X, AlertCircle } from 'lucide-react';

interface Perfil {
  data_nascimento?: string;
  sexo: string;
  rg?: string;
  data_emissao_rg?: string;
  orgao_expedidor?: string;
  cpf: string;
  titulo_eleitor?: string;
  telefone?: string;
  celular?: string;
  escolaridade?: string;
  cep: string;
  tipo_logradouro?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  unidade_socioassistencial: boolean;
  orgao?: string;
  responsavel_orgao: boolean;
  tipo_servidor?: string;
  profissao?: string;
  funcao?: string;
  num_conselho_classe?: string;
  data_inicio_trabalho?: string;
  data_fim_trabalho?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  groups: number[];
  grupos_nomes: string[];
  perfil?: Perfil;
}

const GRUPOS_DISPONIVEIS = [
  { id: 1, nome: 'Administrador' },
  { id: 2, nome: 'Assistente Social' }
];

export default function UserManagement() {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  // Modais de Erro
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);
  const [fieldToFocus, setFieldToFocus] = useState<{ id: string, tab: 'detalhes' | 'pessoais' | 'endereco' | 'profissionais' } | null>(null);

  // Estados do Formulário/Modal
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'detalhes' | 'pessoais' | 'endereco' | 'profissionais'>('detalhes');

  // ABA 1 - DETALHES DE ACESSO
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  // ABA 2 - DADOS PESSOAIS
  const [dataNascimento, setDataNascimento] = useState('');
  const [sexo, setSexo] = useState('M');
  const [rg, setRg] = useState('');
  const [dataEmissaoRg, setDataEmissaoRg] = useState('');
  const [orgaoExpedidor, setOrgaoExpedidor] = useState('');
  const [cpf, setCpf] = useState('');
  const [tituloEleitor, setTituloEleitor] = useState('');
  const [telefone, setTelefone] = useState('');
  const [celular, setCelular] = useState('');
  const [escolaridade, setEscolaridade] = useState('');

  // ABA 3 - ENDEREÇO
  const [cep, setCep] = useState('');
  const [tipoLogradouro, setTipoLogradouro] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [uf, setUf] = useState('');

  // ABA 4 - DADOS PROFISSIONAIS
  const [unidadeSocioassistencial, setUnidadeSocioassistencial] = useState(false);
  const [orgao, setOrgao] = useState('');
  const [responsavelOrgao, setResponsavelOrgao] = useState(false);
  const [tipoServidor, setTipoServidor] = useState('');
  const [profissao, setProfissao] = useState('');
  
  // Listas de Profissões, Funções e Servidores para os campos de Select
  interface CboItem {
    id: number;
    codigo: number;
    nome: string;
  }
  interface FuncaoItem {
    id: number;
    nome: string;
  }
  interface ServidorItem {
    id: number;
    nome: string;
  }
  const [listaCbos, setListaCbos] = useState<CboItem[]>([]);
  const [listaFuncoes, setListaFuncoes] = useState<FuncaoItem[]>([]);
  const [listaTiposServidor, setListaTiposServidor] = useState<ServidorItem[]>([]);

  const carregarCbosEFuncoes = async () => {
    try {
      const resCbo = await fetch(`${API_URL}/api/cbos/?page_size=3000`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resCbo.ok) {
        const data = await resCbo.json();
        const cbos = (data.results || []).sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        setListaCbos(cbos);
      }

      const resFuncoes = await fetch(`${API_URL}/api/tipo_funcao/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resFuncoes.ok) {
        const data = await resFuncoes.json();
        const rawList = data.results || data || [];
        const funcoes = rawList.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        setListaFuncoes(funcoes);
      }

      const resServidores = await fetch(`${API_URL}/api/tipo_servidor/`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (resServidores.ok) {
        const data = await resServidores.json();
        const rawList = data.results || data || [];
        const servidores = rawList.sort((a: any, b: any) => a.nome.localeCompare(b.nome));
        setListaTiposServidor(servidores);
      }
    } catch (err) {
      console.error('Erro ao carregar profissões/funções/servidores:', err);
    }
  };

  const [funcao, setFuncao] = useState('');
  const [numConselhoClasse, setNumConselhoClasse] = useState('');
  const [dataInicioTrabalho, setDataInicioTrabalho] = useState('');
  const [dataFimTrabalho, setDataFimTrabalho] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');

  // Buscar usuários no backend
  const carregarUsuarios = () => {
    setCarregando(true);
    fetch(`${API_URL}/api/usuarios/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Não foi possível carregar os usuários.');
        return res.json();
      })
      .then((data: User[]) => setUsuarios(data))
      .catch(err => setErrorModalMsg(err.message))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    carregarUsuarios();
    carregarCbosEFuncoes();
  }, []);

  // Fechar o modal de erro e dar foco no campo correto
  const fecharErrorModal = () => {
    setErrorModalMsg(null);
    if (fieldToFocus) {
      setActiveModalTab(fieldToFocus.tab);
      setTimeout(() => {
        const el = document.getElementById(fieldToFocus.id);
        if (el) el.focus();
        setFieldToFocus(null);
      }, 100);
    }
  };

  // Buscar dados de endereço por CEP (ViaCEP)
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

      setBairro(data.bairro || '');
      setMunicipio(data.localidade || '');
      setUf(data.uf || '');

      // Tenta separar tipo de logradouro do nome (ex: "Rua das Flores" -> "Rua" e "das Flores")
      const logradouroCompleto = data.logradouro || '';
      if (logradouroCompleto) {
        const partes = logradouroCompleto.split(' ');
        const possivelTipo = partes[0];
        const tiposComuns = ['Rua', 'Avenida', 'Praça', 'Travessa', 'Alameda', 'Rodovia', 'Estrada', 'Beco', 'Galeria', 'Parque', 'Loteamento', 'Residencial'];
        
        if (tiposComuns.some(t => t.toLowerCase() === possivelTipo.toLowerCase())) {
          setTipoLogradouro(possivelTipo);
          setLogradouro(partes.slice(1).join(' '));
        } else {
          setTipoLogradouro('');
          setLogradouro(logradouroCompleto);
        }
      }

    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  // Abrir modal para criar novo
  const abrirNovoModal = () => {
    setEditandoId(null);
    setActiveModalTab('detalhes');
    setFieldToFocus(null);
    
    // Reset aba 1
    setUsername('');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setIsActive(true);
    setSelectedGroups([]);

    // Reset aba 2
    setDataNascimento('');
    setSexo('M');
    setRg('');
    setDataEmissaoRg('');
    setOrgaoExpedidor('');
    setCpf('');
    setTituloEleitor('');
    setTelefone('');
    setCelular('');
    setEscolaridade('');

    // Reset aba 3
    setCep('');
    setTipoLogradouro('');
    setLogradouro('');
    setNumero('');
    setComplemento('');
    setBairro('');
    setMunicipio('');
    setUf('');

    // Reset aba 4
    setUnidadeSocioassistencial(false);
    setOrgao('');
    setResponsavelOrgao(false);
    setTipoServidor('');
    setProfissao('');
    setFuncao('');
    setNumConselhoClasse('');
    setDataInicioTrabalho('');
    setDataFimTrabalho('');

    setModalAberto(true);
  };

  // Abrir modal para editar existente
  const abrirEditarModal = (user: User) => {
    setEditandoId(user.id);
    setActiveModalTab('detalhes');
    setFieldToFocus(null);

    // Carrega aba 1
    setUsername(user.username);
    setFirstName(user.first_name || '');
    setLastName(user.last_name || '');
    setEmail(user.email);
    setPassword('');
    setIsActive(user.is_active);
    setSelectedGroups(user.groups);

    // Carrega dados de perfil vinculados
    const perfil = user.perfil;
    if (perfil) {
      setDataNascimento(perfil.data_nascimento || '');
      setSexo(perfil.sexo || 'M');
      setRg(perfil.rg || '');
      setDataEmissaoRg(perfil.data_emissao_rg || '');
      setOrgaoExpedidor(perfil.orgao_expedidor || '');
      setCpf(perfil.cpf || '');
      setTituloEleitor(perfil.titulo_eleitor || '');
      setTelefone(perfil.telefone || '');
      setCelular(perfil.celular || '');
      setEscolaridade(perfil.escolaridade || '');

      setCep(perfil.cep || '');
      setTipoLogradouro(perfil.tipo_logradouro || '');
      setLogradouro(perfil.logradouro || '');
      setNumero(perfil.numero || '');
      setComplemento(perfil.complemento || '');
      setBairro(perfil.bairro || '');
      setMunicipio(perfil.municipio || '');
      setUf(perfil.uf || '');

      setUnidadeSocioassistencial(perfil.unidade_socioassistencial || false);
      setOrgao(perfil.orgao || '');
      setResponsavelOrgao(perfil.responsavel_orgao || false);
      setTipoServidor(perfil.tipo_servidor || '');
      setProfissao(perfil.profissao || '');
      setFuncao(perfil.funcao || '');
      setNumConselhoClasse(perfil.num_conselho_classe || '');
      setDataInicioTrabalho(perfil.data_inicio_trabalho || '');
      setDataFimTrabalho(perfil.data_fim_trabalho || '');
    }

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

  // Salvar (Criar ou Editar)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações no Frontend antes de mandar para a API (Aba 1)
    if (!firstName.trim()) {
      setFieldToFocus({ id: 'input-firstname', tab: 'detalhes' });
      setErrorModalMsg('O campo Nome é obrigatório.');
      return;
    }
    if (!email.trim()) {
      setFieldToFocus({ id: 'input-email', tab: 'detalhes' });
      setErrorModalMsg('O campo E-mail é obrigatório.');
      return;
    }

    // Aba 2
    if (!cpf.trim()) {
      setFieldToFocus({ id: 'input-cpf', tab: 'pessoais' });
      setErrorModalMsg('O campo CPF é obrigatório.');
      return;
    }
    if (!validarCPF(cpf)) {
      setFieldToFocus({ id: 'input-cpf', tab: 'pessoais' });
      setErrorModalMsg('O CPF informado é inválido.');
      return;
    }

    // Aba 3
    if (!cep.trim()) {
      setFieldToFocus({ id: 'input-cep', tab: 'endereco' });
      setErrorModalMsg('O campo CEP é obrigatório.');
      return;
    }

    // Aba 4 (Novas Validações Profissionais solicitadas)
    if (!orgao.trim()) {
      setFieldToFocus({ id: 'input-orgao', tab: 'profissionais' });
      setErrorModalMsg('O campo Órgão / Unidade é obrigatório.');
      return;
    }
    if (!tipoServidor.trim()) {
      setFieldToFocus({ id: 'input-tiposervidor', tab: 'profissionais' });
      setErrorModalMsg('O campo Tipo de Servidor é obrigatório.');
      return;
    }
    if (!profissao.trim()) {
      setFieldToFocus({ id: 'input-profissao', tab: 'profissionais' });
      setErrorModalMsg('O campo Profissão é obrigatório.');
      return;
    }
    if (!funcao.trim()) {
      setFieldToFocus({ id: 'input-funcao', tab: 'profissionais' });
      setErrorModalMsg('O campo Função é obrigatório.');
      return;
    }
    if (!numConselhoClasse.trim()) {
      setFieldToFocus({ id: 'input-numconselhoclasse', tab: 'profissionais' });
      setErrorModalMsg('O campo Nº Conselho de Classe é obrigatório.');
      return;
    }

    // Estrutura o payload com dados aninhados para o backend
    const payload: any = {
      first_name: firstName,
      last_name: lastName,
      email,
      is_active: isActive,
      groups: selectedGroups,
      perfil: {
        data_nascimento: dataNascimento || null,
        sexo,
        rg: rg || null,
        data_emissao_rg: dataEmissaoRg || null,
        orgao_expedidor: orgaoExpedidor || null,
        cpf: cpf,
        titulo_eleitor: tituloEleitor || null,
        telefone: telefone || null,
        celular: celular || null,
        escolaridade: escolaridade || null,
        cep: cep,
        tipo_logradouro: tipoLogradouro || null,
        logradouro: logradouro || null,
        numero: numero || null,
        complemento: complemento || null,
        bairro: bairro || null,
        municipio: municipio || null,
        uf: uf || null,
        unidade_socioassistencial: unidadeSocioassistencial,
        orgao: orgao,
        responsavel_orgao: responsavelOrgao,
        tipo_servidor: tipoServidor,
        profissao: profissao,
        funcao: funcao,
        num_conselho_classe: numConselhoClasse,
        data_inicio_trabalho: dataInicioTrabalho || null,
        data_fim_trabalho: dataFimTrabalho || null
      }
    };

    if (editandoId) {
      payload.username = username;
    }

    if (!editandoId || password) {
      payload.password = password;
    }

    const url = editandoId ? `${API_URL}/api/usuarios/${editandoId}/` : `${API_URL}/api/usuarios/`;
    const method = editandoId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        // Mapeia erros vindos da API do Django para focar nos campos
        if (data.first_name) {
          setFieldToFocus({ id: 'input-firstname', tab: 'detalhes' });
          throw new Error('O campo Nome é obrigatório no servidor.');
        }
        if (data.email) {
          setFieldToFocus({ id: 'input-email', tab: 'detalhes' });
          throw new Error('Formato de e-mail inválido ou já cadastrado.');
        }
        if (data.perfil?.cpf) {
          setFieldToFocus({ id: 'input-cpf', tab: 'pessoais' });
          throw new Error(data.perfil.cpf[0]);
        }
        if (data.perfil?.cep) {
          setFieldToFocus({ id: 'input-cep', tab: 'endereco' });
          throw new Error('O CEP informado é inválido.');
        }
        if (data.perfil?.orgao) {
          setFieldToFocus({ id: 'input-orgao', tab: 'profissionais' });
          throw new Error('O campo Órgão / Unidade é obrigatório no servidor.');
        }
        if (data.perfil?.tipo_servidor) {
          setFieldToFocus({ id: 'input-tiposervidor', tab: 'profissionais' });
          throw new Error('O campo Tipo de Servidor é obrigatório no servidor.');
        }
        if (data.perfil?.profissao) {
          setFieldToFocus({ id: 'input-profissao', tab: 'profissionais' });
          throw new Error('O campo Profissão é obrigatório no servidor.');
        }
        if (data.perfil?.funcao) {
          setFieldToFocus({ id: 'input-funcao', tab: 'profissionais' });
          throw new Error('O campo Função é obrigatório no servidor.');
        }
        if (data.perfil?.num_conselho_classe) {
          setFieldToFocus({ id: 'input-numconselhoclasse', tab: 'profissionais' });
          throw new Error('O campo Nº Conselho de Classe é obrigatório no servidor.');
        }
        
        throw new Error(data.error || data.detail || 'Erro ao processar requisição no servidor.');
      }

      setModalAberto(false);
      carregarUsuarios();
    } catch (err: any) {
      setErrorModalMsg(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este operador?')) return;

    try {
      const response = await fetch(`${API_URL}/api/usuarios/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao excluir usuário.');
      carregarUsuarios();
    } catch (err: any) {
      setErrorModalMsg(err.message);
    }
  };

  const handleGroupToggle = (groupId: number) => {
    setSelectedGroups(prev => 
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  return (
    <div className="user-management">
      <div className="welcome-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 className="welcome-title">Gestão de Recursos Humanos</h1>
          <p className="welcome-subtitle">Gerencie os operadores do sistema, perfis e dados corporativos.</p>
        </div>
        <button onClick={abrirNovoModal} className="btn-primary-action">
          <UserPlus size={18} />
          <span>Novo Operador</span>
        </button>
      </div>

      <div className="dashboard-card">
        <div className="card-body" style={{ padding: 0 }}>
          {carregando ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando operadores...</div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nome Completo</th>
                  <th>Usuário</th>
                  <th>E-mail</th>
                  <th>Perfil de Acesso</th>
                  <th>Cargo / Função</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(user => (
                  <tr key={user.id}>
                    <td>
                      <span className="font-semibold">{user.first_name} {user.last_name}</span>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {user.grupos_nomes.length === 0 ? (
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Sem grupo</span>
                        ) : (
                          user.grupos_nomes.map((nome, idx) => (
                            <span key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px', backgroundColor: '#eff6ff', color: '#1e40af', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                              <Shield size={10} />
                              {nome}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td>
                      {user.perfil?.funcao || user.perfil?.profissao || (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Não definido</span>
                      )}
                    </td>
                    <td>
                      <span className={`status-badge ${user.is_active ? 'status-done' : 'status-pending'}`}>
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button onClick={() => abrirEditarModal(user)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(user.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL DE FORMULÁRIO */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="bg-form" style={{ width: '100%', maxWidth: '650px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#0f172a' }}>
                {editandoId ? 'Editar Operador' : 'Novo Operador'}
              </h3>
              <button type="button" onClick={() => setModalAberto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={20} />
              </button>
            </div>

            {/* SELETOR DE ABAS */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '8px', marginBottom: '20px' }}>
              <button type="button" onClick={() => setActiveModalTab('detalhes')} style={{ padding: '8px 12px', border: 'none', background: 'none', borderBottom: activeModalTab === 'detalhes' ? '3px solid #f5911e' : 'none', fontWeight: activeModalTab === 'detalhes' ? 700 : 500, color: activeModalTab === 'detalhes' ? '#0f172a' : '#64748b', cursor: 'pointer', fontSize: '13px' }}>
                Acesso
              </button>
              <button type="button" onClick={() => setActiveModalTab('pessoais')} style={{ padding: '8px 12px', border: 'none', background: 'none', borderBottom: activeModalTab === 'pessoais' ? '3px solid #f5911e' : 'none', fontWeight: activeModalTab === 'pessoais' ? 700 : 500, color: activeModalTab === 'pessoais' ? '#0f172a' : '#64748b', cursor: 'pointer', fontSize: '13px' }}>
                Dados Pessoais
              </button>
              <button type="button" onClick={() => setActiveModalTab('endereco')} style={{ padding: '8px 12px', border: 'none', background: 'none', borderBottom: activeModalTab === 'endereco' ? '3px solid #f5911e' : 'none', fontWeight: activeModalTab === 'endereco' ? 700 : 500, color: activeModalTab === 'endereco' ? '#0f172a' : '#64748b', cursor: 'pointer', fontSize: '13px' }}>
                Endereço
              </button>
              <button type="button" onClick={() => setActiveModalTab('profissionais')} style={{ padding: '8px 12px', border: 'none', background: 'none', borderBottom: activeModalTab === 'profissionais' ? '3px solid #f5911e' : 'none', fontWeight: activeModalTab === 'profissionais' ? 700 : 500, color: activeModalTab === 'profissionais' ? '#0f172a' : '#64748b', cursor: 'pointer', fontSize: '13px' }}>
                Profissionais
              </button>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '6px' }}>
              
              {/* ABA 1: DETALHES DE ACESSO */}
              {activeModalTab === 'detalhes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome *</label>
                      <input type="text" id="input-firstname" className="form-control" value={firstName} onChange={e => setFirstName(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Sobrenome</label>
                      <input type="text" className="form-control" value={lastName} onChange={e => setLastName(e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>E-mail *</label>
                    <input type="email" id="input-email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Usuário (Login)</label>
                      <input type="text" className="form-control" value={editandoId ? username : "Gerado automaticamente"} disabled={true} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Senha {editandoId && '(opcional)'}</label>
                      <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required={!editandoId} placeholder={editandoId ? 'Manter atual' : ''} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Perfis de Acesso</label>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      {GRUPOS_DISPONIVEIS.map(g => (
                        <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                          <input type="checkbox" checked={selectedGroups.includes(g.id)} onChange={() => handleGroupToggle(g.id)} />
                          {g.nome}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input type="checkbox" id="isActiveCheck" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
                    <label htmlFor="isActiveCheck" style={{ fontSize: '13px', cursor: 'pointer' }}>Usuário Ativo</label>
                  </div>
                </div>
              )}

              {/* ABA 2: DADOS PESSOAIS */}
              {activeModalTab === 'pessoais' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>CPF *</label>
                      <input 
                        type="text" 
                        id="input-cpf" 
                        className="form-control" 
                        placeholder="Somente 11 números" 
                        value={cpf} 
                        onChange={e => {
                          const valorLimpo = e.target.value.replace(/\D/g, '');
                          if (valorLimpo.length <= 11) {
                            setCpf(valorLimpo);
                          }
                        }} 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Sexo</label>
                      <select className="form-control" value={sexo} onChange={e => setSexo(e.target.value)}>
                        <option value="M">Masculino</option>
                        <option value="F">Feminino</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Data de Nascimento</label>
                      <input type="date" className="form-control" value={dataNascimento} onChange={e => setDataNascimento(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Escolaridade</label>
                      <input type="text" className="form-control" value={escolaridade} onChange={e => setEscolaridade(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>RG</label>
                      <input type="text" className="form-control" value={rg} onChange={e => setRg(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Órgão Expedidor</label>
                      <input type="text" className="form-control" value={orgaoExpedidor} onChange={e => setOrgaoExpedidor(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Emissão RG</label>
                      <input type="date" className="form-control" value={dataEmissaoRg} onChange={e => setDataEmissaoRg(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: 'span 1' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Título Eleitor</label>
                      <input type="text" className="form-control" value={tituloEleitor} onChange={e => setTituloEleitor(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Telefone</label>
                      <input type="text" className="form-control" placeholder="(00) 0000-0000" value={telefone} onChange={e => setTelefone(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Celular</label>
                      <input type="text" className="form-control" placeholder="(00) 90000-0000" value={celular} onChange={e => setCelular(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 3: ENDEREÇO */}
              {activeModalTab === 'endereco' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>CEP *</label>
                      <input type="text" id="input-cep" className="form-control" placeholder="00000-000" value={cep} onChange={e => setCep(e.target.value)} onBlur={handleCepBlur} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo Logradouro</label>
                      <input type="text" className="form-control" placeholder="Rua, Avenida, etc." value={tipoLogradouro} onChange={e => setTipoLogradouro(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Logradouro</label>
                      <input type="text" className="form-control" value={logradouro} onChange={e => setLogradouro(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Número</label>
                      <input type="text" className="form-control" value={numero} onChange={e => setNumero(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: 'span 1' }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Complemento</label>
                      <input type="text" className="form-control" value={complemento} onChange={e => setComplemento(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Bairro</label>
                      <input type="text" className="form-control" value={bairro} onChange={e => setBairro(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Município</label>
                      <input type="text" className="form-control" value={municipio} onChange={e => setMunicipio(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Estado (UF)</label>
                      <input type="text" maxLength={2} placeholder="UF" className="form-control" value={uf} onChange={e => setUf(e.target.value.toUpperCase())} />
                    </div>
                  </div>
                </div>
              )}

              {/* ABA 4: DADOS PROFISSIONAIS */}
              {activeModalTab === 'profissionais' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Unidade Socioassistencial? *</label>
                      <select className="form-control" value={unidadeSocioassistencial ? 'true' : 'false'} onChange={e => setUnidadeSocioassistencial(e.target.value === 'true')}>
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Responsável pelo Órgão? *</label>
                      <select className="form-control" value={responsavelOrgao ? 'true' : 'false'} onChange={e => setResponsavelOrgao(e.target.value === 'true')}>
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Órgão / Unidade *</label>
                    <input type="text" id="input-orgao" className="form-control" value={orgao} onChange={e => setOrgao(e.target.value)} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Servidor *</label>
                      <select
                        id="input-tiposervidor"
                        className="form-control"
                        value={tipoServidor}
                        onChange={e => setTipoServidor(e.target.value)}
                      >
                        <option value="">Selecione o tipo de servidor...</option>
                        {listaTiposServidor.map(s => (
                          <option key={s.id} value={s.nome}>
                            {s.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Profissão *</label>
                      <select
                        id="input-profissao"
                        className="form-control"
                        value={profissao}
                        onChange={e => setProfissao(e.target.value)}
                      >
                        <option value="">Selecione uma profissão...</option>
                        {listaCbos.map(c => (
                          <option key={c.id} value={`${c.codigo} - ${c.nome}`}>
                            {c.codigo} - {c.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Função *</label>
                      <select
                        id="input-funcao"
                        className="form-control"
                        value={funcao}
                        onChange={e => setFuncao(e.target.value)}
                      >
                        <option value="">Selecione uma função...</option>
                        {listaFuncoes.map(f => (
                          <option key={f.id} value={f.nome}>
                            {f.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nº Conselho de Classe *</label>
                      <input type="text" id="input-numconselhoclasse" className="form-control" value={numConselhoClasse} onChange={e => setNumConselhoClasse(e.target.value)} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Início do Trabalho</label>
                      <input type="date" className="form-control" value={dataInicioTrabalho} onChange={e => setDataInicioTrabalho(e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Fim do Trabalho</label>
                      <input type="date" className="form-control" value={dataFimTrabalho} onChange={e => setDataFimTrabalho(e.target.value)} />
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button type="button" onClick={() => setModalAberto(false)} className="form-control" style={{ maxWidth: '100px', cursor: 'pointer' }}>Cancelar</button>
                <button type="submit" className="btn conecta text-white" style={{ maxWidth: '120px', marginTop: 0 }}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE ERRO INDEPENDENTE (ALERT DIALOG) */}
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
            <button type="button" onClick={fecharErrorModal} className="btn conecta text-white" style={{ width: '100%', marginTop: '8px' }}>
              Fechar e Corrigir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
