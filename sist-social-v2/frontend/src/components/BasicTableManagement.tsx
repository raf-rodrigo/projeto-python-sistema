import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, AlertCircle, List, Plus, Edit2, Trash2, X } from 'lucide-react';

interface Item {
  id: number;
  [key: string]: any;
}

// Lista organizada de todas as 58 tabelas básicas do sistema
const LISTA_TABELAS = [
  { id: 'municipios', label: 'Municípios do Brasil' },
  { id: 'cids', label: 'CIDs (Classificação de Doenças)' },
  { id: 'cbos', label: 'CBOs (Classificação de Ocupações)' },
  { id: 'estados', label: 'Estados' },
  { id: 'tipo_unidade', label: 'Unidades (Categorias)' },
  { id: 'tipo_servidor', label: 'Servidores (Vínculos)' },
  { id: 'tipo_profissao', label: 'Profissões (Categorias)' },
  { id: 'tipo_escolaridade', label: 'Escolaridades' },
  { id: 'tipo_area_segmento', label: 'Áreas/Segmentos' },
  { id: 'tipo_orgao_recurso', label: 'Órgãos Recursos' },
  { id: 'tipo_funcao', label: 'Funções' },
  { id: 'tipo_local_nascimento', label: 'Locais de Nascimento' },
  { id: 'raca', label: 'Raça' },
  { id: 'tipo_parentesco', label: 'Parentescos' },
  { id: 'tipo_curso', label: 'Cursos' },
  { id: 'tipo_qualificacao_profissional', label: 'Qualificações Profissionais' },
  { id: 'tipo_serie_curso', label: 'Séries de Curso' },
  { id: 'tipo_atividade', label: 'Atividades' },
  { id: 'tipo_estado_civil', label: 'Estados Civis' },
  { id: 'tipo_registro_civil', label: 'Registros Civis' },
  { id: 'tipo_necessita_cuidado', label: 'Necessidades de Cuidado' },
  { id: 'tipo_beneficio', label: 'Benefícios' },
  { id: 'orientacao_sexual', label: 'Orientação Sexual' },
  { id: 'tipo_tratamento_caps', label: 'Tratamentos CAPS' },
  { id: 'tipo_deficiencia', label: 'Deficiências' },
  { id: 'tipo_origem_cadastro', label: 'Origens de Cadastro' },
  { id: 'tipo_unidade_atendimento_familia', label: 'Unidades de Atendimento Familiar' },
  { id: 'tipo_especie_domicilio', label: 'Espécies de Domicílio' },
  { id: 'tipo_residencia', label: 'Residências' },
  { id: 'tipo_piso_domicilio', label: 'Pisos de Domicílio' },
  { id: 'tipo_construcao_domicilio', label: 'Construções de Domicílio' },
  { id: 'tipo_iluminacao_domicilio', label: 'Iluminações de Domicílio' },
  { id: 'tipo_abastecimento_agua', label: 'Abastecimentos de Água' },
  { id: 'tipo_escoamento_sanitario', label: 'Escoamentos Sanitários' },
  { id: 'tipo_coleta_lixo', label: 'Coletas de Lixo' },
  { id: 'tipo_acessibilidade_domicilio', label: 'Acessibilidades de Domicílio' },
  { id: 'tipo_grupos_tradicionais_especificos', label: 'Grupos Tradicionais/Específicos' },
  { id: 'religioes', label: 'Religiões' },
  { id: 'potencialidades', label: 'Potencialidades' },
  { id: 'vulnerabilidade_social', label: 'Vulnerabilidades Sociais' },
  { id: 'feriado', label: 'Feriados' },
  { id: 'tipos_atendimentos', label: 'Atendimentos' },
  { id: 'tipo_servico_protecao', label: 'Serviços de Proteção' },
  { id: 'faixa_etaria', label: 'Faixas Etárias' },
  { id: 'tipo_situacao_violencia_e_violacao_direitos', label: 'Situações de Violência/Violação de Direitos' },
  { id: 'tipo_medida_socioeducativa', label: 'Medidas Socioeducativas' },
  { id: 'tipo_encaminhamento', label: 'Encaminhamentos' },
  { id: 'tipo_servico_programa_projeto', label: 'Serviços/Programas/Projetos' },
  { id: 'tipos_animais', label: 'Animais' },
  { id: 'tipos_servicos_sociais', label: 'Serviços Sociais' },
  { id: 'tipos_contatos_parentes', label: 'Contatos de Parentes' },
  { id: 'tipos_tempos_residencias_cidades_populacoes_ruas', label: 'Tempos de Residência - População de Rua' },
  { id: 'tipos_orgaos', label: 'Órgãos' },
  { id: 'tipos_recursos', label: 'Recursos' },
  { id: 'tipos_periodos', label: 'Períodos' },
  { id: 'tipo_locais_realizacoes_servicos', label: 'Locais de Realização de Serviços' },
  { id: 'tipos_efeitos_descumprimentos_condicionalidades', label: 'Efeitos de Descumprimento de Condicionalidade' },
  { id: 'tipo_atividade_grupos', label: 'Atividades de Grupos' },
  { id: 'tipos_relacoes_convivencias_familiares', label: 'Relações de Convivência Familiar' }
].sort((a, b) => a.label.localeCompare(b.label));

export default function BasicTableManagement() {
  const [tabela, setTabela] = useState('municipios');
  const [data, setData] = useState<Item[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');
  const [buscaTemporaria, setBuscaTemporaria] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados para CRUD
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Item | null>(null);
  const [campoNome, setCampoNome] = useState('');
  const [salvando, setSalvando] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
  const token = localStorage.getItem('token');
  const itemsPerPage = 15;

  const isEditableTabela = !['municipios', 'cids', 'cbos', 'estados'].includes(tabela);

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);
    try {
      const url = `${API_URL}/api/${tabela}/?page=${pagina}&search=${encodeURIComponent(busca)}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Token ${token}` }
      });
      
      if (!res.ok) {
        if (res.status === 404 && pagina > 1) {
          setPagina(1);
          return;
        }
        throw new Error('Erro ao carregar dados do servidor.');
      }
      
      const resJson = await res.json();
      if (Array.isArray(resJson)) {
        setData(resJson);
        setTotalCount(resJson.length);
      } else {
        setData(resJson.results || []);
        setTotalCount(resJson.count || 0);
      }
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, [tabela, pagina, busca]);

  const handleTabelaChange = (novaTabela: string) => {
    setTabela(novaTabela);
    setPagina(1);
    setBusca('');
    setBuscaTemporaria('');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagina(1);
    setBusca(buscaTemporaria);
  };

  // Funções de CRUD (POST, PUT, DELETE)
  const abrirCriacao = () => {
    setItemSelecionado(null);
    setCampoNome('');
    setModalAberto(true);
  };

  const abrirEdicao = (item: Item) => {
    setItemSelecionado(item);
    setCampoNome(item.nome || item.descricao || '');
    setModalAberto(true);
  };

  const handleExcluir = async (id: number) => {
    if (!window.confirm('Tem certeza de que deseja excluir este registro?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/${tabela}/${id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Não foi possível excluir o registro. Ele pode estar sendo utilizado em outros cadastros.');
      }

      alert('Registro excluído com sucesso!');
      carregarDados();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSalvar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campoNome.trim()) {
      alert('O campo Descrição/Nome é obrigatório.');
      return;
    }

    setSalvando(true);
    try {
      const url = itemSelecionado 
        ? `${API_URL}/api/${tabela}/${itemSelecionado.id}/` 
        : `${API_URL}/api/${tabela}/`;
      
      const method = itemSelecionado ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ nome: campoNome.trim() })
      });

      if (!res.ok) {
        throw new Error('Erro ao salvar as alterações.');
      }

      alert(itemSelecionado ? 'Registro atualizado com sucesso!' : 'Novo registro adicionado com sucesso!');
      setModalAberto(false);
      carregarDados();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSalvando(false);
    }
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

  const getConfig = () => {
    switch (tabela) {
      case 'municipios':
        return {
          titulo: 'Municípios do Brasil',
          headers: ['Código UF', 'Código IBGE', 'Município'],
          renderRow: (item: Item) => (
            <>
              <td>{item.codigo_uf}</td>
              <td style={{ fontFamily: 'monospace' }}>{item.codigo_ibge}</td>
              <td className="font-semibold">{item.municipio}</td>
            </>
          )
        };
      case 'cids':
        return {
          titulo: 'Classificação Internacional de Doenças (CID)',
          headers: ['Código', 'Descrição', 'Código CID'],
          renderRow: (item: Item) => (
            <>
              <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.codigo}</td>
              <td>{item.descricao}</td>
              <td style={{ fontFamily: 'monospace' }}>{item.codigo_cid}</td>
            </>
          )
        };
      case 'cbos':
        return {
          titulo: 'Classificação Brasileira de Ocupações (CBO)',
          headers: ['Código CBO', 'Nome / Atividade'],
          renderRow: (item: Item) => (
            <>
              <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.codigo}</td>
              <td className="font-semibold">{item.nome}</td>
            </>
          )
        };
      case 'estados':
        return {
          titulo: 'Estados',
          headers: ['Código IBGE', 'Sigla', 'Nome'],
          renderRow: (item: Item) => (
            <>
              <td>{item.cod_ibge}</td>
              <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{item.sigla}</td>
              <td className="font-semibold">{item.nome}</td>
            </>
          )
        };
      default: {
        const itemTabela = LISTA_TABELAS.find(t => t.id === tabela);
        return {
          titulo: itemTabela ? itemTabela.label : 'Tabela Auxiliar',
          headers: ['ID', 'Descrição / Nome'],
          renderRow: (item: Item) => (
            <>
              <td>{item.id}</td>
              <td className="font-semibold">{item.nome || item.descricao || 'Sem descrição'}</td>
            </>
          )
        };
      }
    }
  };

  const config = getConfig();
  const isPaginado = tabela !== 'estados';

  return (
    <div className="basic-table-management">
      <div className="welcome-section" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="welcome-title">Tabelas Básicas</h1>
          <p className="welcome-subtitle">Gerencie os catálogos e dados auxiliares do sistema</p>
        </div>
        
        {/* Seletor Dropdown no Topo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '320px' }}>
          <List size={20} style={{ color: '#64748b' }} />
          <select 
            className="form-control" 
            value={tabela} 
            onChange={e => handleTabelaChange(e.target.value)}
            style={{ fontWeight: 600, color: '#0f172a', border: '1px solid #cbd5e1', cursor: 'pointer' }}
          >
            {LISTA_TABELAS.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="dashboard-card">
        {/* Barra de Ferramentas: Busca + Botão Novo Registro */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '12px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', width: '100%', maxWidth: '400px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="text"
                className="form-control"
                placeholder={`Pesquisar...`}
                value={buscaTemporaria}
                onChange={e => setBuscaTemporaria(e.target.value)}
                style={{ paddingLeft: '36px' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            </div>
            <button type="submit" className="btn-logout" style={{ width: 'auto', backgroundColor: '#f5911e', borderColor: '#f5911e', color: '#ffffff' }}>
              Buscar
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {isEditableTabela && (
              <button 
                onClick={abrirCriacao}
                className="btn-primary-action"
              >
                <Plus size={16} />
                Novo Registro
              </button>
            )}
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
              Total de registros: <span style={{ fontWeight: 700, color: '#0f172a' }}>{totalCount}</span>
            </div>
          </div>
        </div>

        {/* Tabela de Resultados */}
        <div className="card-body" style={{ padding: 0 }}>
          {erro && (
            <div style={{ padding: '24px', display: 'flex', gap: '10px', color: '#ef4444', alignItems: 'center', justifyContent: 'center' }}>
              <AlertCircle size={20} />
              <span>{erro}</span>
            </div>
          )}

          {carregando ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Carregando dados da tabela...</div>
          ) : data.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontStyle: 'italic' }}>
              Nenhum registro encontrado.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    {config.headers.map((h, i) => (
                      <th key={i}>{h}</th>
                    ))}
                    {isEditableTabela && <th style={{ width: '120px', textAlign: 'center' }}>Ações</th>}
                  </tr>
                </thead>
                <tbody>
                  {data.map(item => (
                    <tr key={item.id}>
                      {config.renderRow(item)}
                      {isEditableTabela && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            <button 
                              onClick={() => abrirEdicao(item)}
                              style={{ border: 'none', background: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px' }}
                              title="Editar"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleExcluir(item.id)}
                              style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              title="Excluir"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rodapé: Paginação */}
        {!erro && totalCount > 0 && isPaginado && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Página <span className="font-semibold" style={{ color: '#0f172a' }}>{pagina}</span> de <span className="font-semibold" style={{ color: '#0f172a' }}>{totalPages}</span>
            </span>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setPagina(1)}
                disabled={pagina === 1 || carregando}
                className="btn-logout"
                style={{ width: 'auto', padding: '6px 8px', border: '1px solid #cbd5e1', backgroundColor: pagina === 1 ? '#e2e8f0' : '#ffffff', color: '#475569', cursor: pagina === 1 ? 'not-allowed' : 'pointer' }}
                title="Primeira página"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                disabled={pagina === 1 || carregando}
                className="btn-logout"
                style={{ width: 'auto', padding: '6px 8px', border: '1px solid #cbd5e1', backgroundColor: pagina === 1 ? '#e2e8f0' : '#ffffff', color: '#475569', cursor: pagina === 1 ? 'not-allowed' : 'pointer' }}
                title="Página anterior"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div style={{ padding: '0 8px', alignSelf: 'center', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                {pagina}
              </div>

              <button
                onClick={() => setPagina(prev => Math.min(prev + 1, totalPages))}
                disabled={pagina === totalPages || carregando}
                className="btn-logout"
                style={{ width: 'auto', padding: '6px 8px', border: '1px solid #cbd5e1', backgroundColor: pagina === totalPages ? '#e2e8f0' : '#ffffff', color: '#475569', cursor: pagina === totalPages ? 'not-allowed' : 'pointer' }}
                title="Próxima página"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setPagina(totalPages)}
                disabled={pagina === totalPages || carregando}
                className="btn-logout"
                style={{ width: 'auto', padding: '6px 8px', border: '1px solid #cbd5e1', backgroundColor: pagina === totalPages ? '#e2e8f0' : '#ffffff', color: '#475569', cursor: pagina === totalPages ? 'not-allowed' : 'pointer' }}
                title="Última página"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay para Adicionar/Editar */}
      {modalAberto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div className="dashboard-card" style={{ width: '100%', maxWidth: '500px', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                {itemSelecionado ? `Editar Registro - ${config.titulo}` : `Novo Registro - ${config.titulo}`}
              </h3>
              <button 
                onClick={() => setModalAberto(false)}
                style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSalvar}>
              <div style={{ padding: '20px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontWeight: 600, color: '#475569', marginBottom: '8px', display: 'block' }}>
                    Nome / Descrição
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Digite a descrição ou nome..."
                    value={campoNome}
                    onChange={e => setCampoNome(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8fafc' }}>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="btn-logout"
                  style={{ width: 'auto', backgroundColor: '#ffffff', color: '#475569', border: '1px solid #cbd5e1' }}
                  disabled={salvando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-logout"
                  style={{ width: 'auto', backgroundColor: '#f5911e', borderColor: '#f5911e', color: '#ffffff', fontWeight: 600 }}
                  disabled={salvando}
                >
                  {salvando ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
