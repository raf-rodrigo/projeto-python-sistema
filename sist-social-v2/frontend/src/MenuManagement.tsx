import { useState, useEffect } from 'react';
import { Plus, Trash2, X, AlertCircle, ChevronDown, ChevronRight, Settings, Save, Search } from 'lucide-react';

interface Menu {
  id: number;
  nome: string;
  url?: string;
  icone?: string;
  pai?: number;
  pai_nome?: string;
  ordem: number;
  ativo: boolean;
  grupos: number[];
  grupos_nomes: string[];
}

interface Grupo {
  id: number;
  name: string;
}

export default function MenuManagement() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');

  // Controla quais menus principais estão expandidos na árvore esquerda
  const [arvoreExpandida, setArvoreExpandida] = useState<Record<number, boolean>>({});

  // Modais de Erro
  const [errorModalMsg, setErrorModalMsg] = useState<string | null>(null);
  const [fieldToFocus, setFieldToFocus] = useState<{ id: string } | null>(null);

  // Item selecionado para edição na coluna da direita (se null, exibe painel vazio ou de instruções)
  const [itemSelecionado, setItemSelecionado] = useState<Menu | null>(null);
  
  // Estado para quando estivermos criando um novo menu
  const [modoCriacao, setModoCriacao] = useState<'root' | 'sub' | null>(null);
  const [paiCriacaoId, setPaiCriacaoId] = useState<number | undefined>(undefined);

  // Campos do Formulário de Edição/Criação
  const [nome, setNome] = useState('');
  const [url, setUrl] = useState('');
  const [icone, setIcone] = useState('');
  const [pai, setPai] = useState<number | undefined>(undefined);
  const [ordem, setOrdem] = useState(0);
  const [ativo, setAtivo] = useState(true);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');

  // Carregar Menus e Perfis
  const carregarDados = async () => {
    setCarregando(true);
    try {
      const headers = { 'Authorization': `Token ${token}` };
      const resMenus = await fetch(`${API_URL}/api/gerenciamento-menus/`, { headers });
      if (!resMenus.ok) throw new Error('Não foi possível carregar os menus.');
      const dataMenus = await resMenus.json();
      setMenus(dataMenus);

      const resGrupos = await fetch(`${API_URL}/api/grupos/`, { headers });
      if (!resGrupos.ok) throw new Error('Não foi possível carregar os perfis de acesso.');
      const dataGrupos = await resGrupos.json();
      setGrupos(dataGrupos);

      // Auto-expande todos os menus principais no carregamento
      const expandir: Record<number, boolean> = {};
      dataMenus.forEach((m: Menu) => {
        if (!m.pai) expandir[m.id] = true;
      });
      setArvoreExpandida(expandir);

    } catch (err: any) {
      setErrorModalMsg(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const fecharErrorModal = () => {
    setErrorModalMsg(null);
    if (fieldToFocus) {
      setTimeout(() => {
        const el = document.getElementById(fieldToFocus.id);
        if (el) el.focus();
        setFieldToFocus(null);
      }, 100);
    }
  };

  // Carregar dados de um item na área de edição (Direita)
  const selecionarItem = (menu: Menu) => {
    setModoCriacao(null);
    setPaiCriacaoId(undefined);
    setItemSelecionado(menu);
    setNome(menu.nome);
    setUrl(menu.url || '');
    setIcone(menu.icone || '');
    setPai(menu.pai || undefined);
    setOrdem(menu.ordem);
    setAtivo(menu.ativo);
    setSelectedGroups(menu.grupos);
  };

  // Habilitar modo criação de menu principal (Root)
  const iniciarCriacaoRoot = () => {
    setItemSelecionado(null);
    setModoCriacao('root');
    setPaiCriacaoId(undefined);
    setNome('');
    setUrl('');
    setIcone('');
    setPai(undefined);
    setOrdem(0);
    setAtivo(true);
    setSelectedGroups([]);
  };

  // Habilitar modo criação de submenu (Sub)
  const iniciarCriacaoSub = (paiId: number) => {
    const menuPai = menus.find(m => m.id === paiId);
    setItemSelecionado(null);
    setModoCriacao('sub');
    setPaiCriacaoId(paiId);
    setNome('');
    setUrl('');
    setIcone('');
    setPai(paiId);
    setOrdem(0);
    setAtivo(true);
    setSelectedGroups(menuPai ? menuPai.grupos : []);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setFieldToFocus({ id: 'input-nome' });
      setErrorModalMsg('O campo Nome do Menu é obrigatório.');
      return;
    }

    const payload = {
      nome,
      url: url.trim() || null,
      icone: icone.trim() || null,
      pai: pai || null,
      ordem: Number(ordem),
      ativo,
      grupos: selectedGroups
    };

    const editandoId = itemSelecionado?.id;
    const targetUrl = editandoId ? `${API_URL}/api/gerenciamento-menus/${editandoId}/` : `${API_URL}/api/gerenciamento-menus/`;
    const method = editandoId ? 'PUT' : 'POST';

    try {
      const response = await fetch(targetUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.nome) {
          setFieldToFocus({ id: 'input-nome' });
          throw new Error('O nome do menu é obrigatório.');
        }
        throw new Error(data.error || data.detail || 'Erro ao salvar o item.');
      }

      // Limpa seleções e recarrega
      setItemSelecionado(null);
      setModoCriacao(null);
      carregarDados();
    } catch (err: any) {
      setErrorModalMsg(err.message);
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Impede de selecionar para editar ao clicar em excluir
    if (!confirm('Deseja realmente excluir este item de menu?')) return;

    try {
      const response = await fetch(`${API_URL}/api/gerenciamento-menus/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${token}` }
      });

      if (!response.ok) throw new Error('Erro ao excluir o item.');
      
      setItemSelecionado(null);
      setModoCriacao(null);
      carregarDados();
    } catch (err: any) {
      setErrorModalMsg(err.message);
    }
  };

  const toggleExpandir = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setArvoreExpandida(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleGroupToggle = (groupId: number) => {
    setSelectedGroups(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  // Monta a estrutura em árvore para a coluna da esquerda
  const menusPrincipais = menus.filter(m => !m.pai);
  const submenusDe = (paiId: number) => menus.filter(m => m.pai === paiId);

  // Filtragem da árvore pela busca do usuário
  const menusPrincipaisFiltrados = menusPrincipais.filter(m => {
    const nomeBate = m.nome.toLowerCase().includes(busca.toLowerCase());
    const submenus = submenusDe(m.id);
    const algumSubmenuBate = submenus.some(sub => sub.nome.toLowerCase().includes(busca.toLowerCase()));
    return nomeBate || algumSubmenuBate;
  });

  return (
    <div className="menu-management">
      <div className="welcome-section" style={{ marginBottom: '24px' }}>
        <h1 className="welcome-title">Cadastro de Menu</h1>
        <p className="welcome-subtitle">Gerencie de forma visual a estrutura de pastas e acessos do menu lateral.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '4fr 5fr', gap: '24px', alignItems: 'start' }}>
        
        {/* COLUNA ESQUERDA: ÁRVORE HIERÁRQUICA */}
        <div className="dashboard-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Buscar por item do menu..." 
                value={busca} 
                onChange={e => setBusca(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            </div>
            <button 
              onClick={iniciarCriacaoRoot} 
              className="btn-logout" 
              style={{ display: 'flex', gap: '6px', alignItems: 'center', backgroundColor: '#10b981', borderColor: '#10b981', color: '#ffffff', width: 'auto', fontSize: '12px' }}
            >
              <Plus size={16} />
              <span>Adicionar item ao Menu</span>
            </button>
          </div>

          <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f8fafc', maxHeight: '60vh', overflowY: 'auto' }}>
            {carregando ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>Carregando estrutura...</div>
            ) : menusPrincipaisFiltrados.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>Nenhum menu encontrado</div>
            ) : (
              menusPrincipaisFiltrados.map(item => {
                const submenus = submenusDe(item.id);
                const temSub = submenus.length > 0;
                const expandido = !!arvoreExpandida[item.id];
                const estaSelecionado = itemSelecionado?.id === item.id;

                return (
                  <div key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    
                    {/* Linha do Menu Principal */}
                    <div 
                      onClick={() => selecionarItem(item)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '10px 14px', 
                        backgroundColor: estaSelecionado ? '#f1f5f9' : '#ffffff', 
                        cursor: 'pointer',
                        fontWeight: 600,
                        color: estaSelecionado ? '#f5911e' : '#0f172a'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button 
                          onClick={(e) => toggleExpandir(item.id, e)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 0 }}
                        >
                          {temSub ? (
                            expandido ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                          ) : (
                            <span style={{ width: '16px' }} />
                          )}
                        </button>
                        <span>{item.nome}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        {/* Botão de adicionar submenu */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); iniciarCriacaoSub(item.id); }}
                          title="Adicionar Submenu"
                          style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                        >
                          <Plus size={14} />
                        </button>
                        {/* Botão de excluir */}
                        <button 
                          onClick={(e) => handleDelete(item.id, e)}
                          title="Excluir Menu"
                          style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Submenus aninhados */}
                    {temSub && expandido && (
                      <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
                        {submenus.map(sub => {
                          const subSelecionado = itemSelecionado?.id === sub.id;
                          return (
                            <div 
                              key={sub.id}
                              onClick={() => selecionarItem(sub)}
                              style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'space-between', 
                                padding: '8px 14px 8px 36px', 
                                borderBottom: '1px solid #f1f5f9',
                                cursor: 'pointer',
                                fontSize: '13px',
                                backgroundColor: subSelecionado ? '#f1f5f9' : 'transparent',
                                color: subSelecionado ? '#f5911e' : '#475569'
                              }}
                            >
                              <span>↳ {sub.nome}</span>
                              <button 
                                onClick={(e) => handleDelete(sub.id, e)}
                                title="Excluir Submenu"
                                style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '3px', cursor: 'pointer', display: 'flex' }}
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUNA DIREITA: FORMULÁRIO DE DETALHES */}
        <div className="dashboard-card" style={{ padding: '24px' }}>
          
          {!itemSelecionado && !modoCriacao ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <Settings size={48} style={{ color: '#94a3b8', marginBottom: '16px', display: 'inline-block' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 8px 0', color: '#334155' }}>Detalhes do Item de Menu</h3>
              <p style={{ fontSize: '0.875rem', margin: 0 }}>Selecione um menu na árvore à esquerda para editar seus detalhes ou clique em "Adicionar" para criar um novo.</p>
            </div>
          ) : (
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  {modoCriacao === 'root' && 'Novo Menu Principal'}
                  {modoCriacao === 'sub' && `Novo Submenu para: ${menus.find(m => m.id === paiCriacaoId)?.nome}`}
                  {itemSelecionado && `Detalhes do Item: ${itemSelecionado.nome}`}
                </h3>
                <button 
                  type="button" 
                  onClick={() => { setItemSelecionado(null); setModoCriacao(null); }} 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome do Menu *</label>
                <input 
                  type="text" 
                  id="input-nome" 
                  className="form-control" 
                  value={nome} 
                  onChange={e => setNome(e.target.value)} 
                  placeholder="Ex: Recursos Humanos, Financeiro" 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Caminho (URL/Tab)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)} 
                    placeholder="Ex: recursos-humanos, usuarios" 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Ícone (Nome Lucide)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={icone} 
                    onChange={e => setIcone(e.target.value)} 
                    placeholder="Ex: Users, Folders, Shield" 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Ordem</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={ordem} 
                    onChange={e => setOrdem(Number(e.target.value))} 
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input 
                      type="checkbox" 
                      checked={ativo} 
                      onChange={e => setAtivo(e.target.checked)} 
                    />
                    Menu Ativo
                  </label>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>Perfis com Acesso</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                  {grupos.map(g => (
                    <label key={g.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                      <input 
                        type="checkbox" 
                        checked={selectedGroups.includes(g.id)} 
                        onChange={() => handleGroupToggle(g.id)} 
                      />
                      {g.name}
                    </label>
                  ))}
                  {grupos.length === 0 && (
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>Carregando perfis...</span>
                  )}
                </div>
                <small style={{ color: '#64748b', fontSize: '11px', display: 'block', marginTop: '4px' }}>
                  Se nenhum perfil for selecionado, todos os usuários logados terão acesso a este menu.
                </small>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button 
                  type="button" 
                  onClick={() => { setItemSelecionado(null); setModoCriacao(null); }} 
                  className="form-control" 
                  style={{ maxWidth: '100px', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn conecta text-white" 
                  style={{ maxWidth: '120px', marginTop: 0, display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Save size={16} />
                  <span>Salvar</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* MODAL DE ERRO */}
      {errorModalMsg && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
          <div style={{ width: '100%', maxWidth: '400px', padding: '24px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', backgroundColor: '#fee2e2', borderRadius: '9999px', color: '#ef4444' }}>
              <AlertCircle size={32} />
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Erro de Validação</h4>
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
