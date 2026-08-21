import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import UserManagement from './UserManagement';
import MenuManagement from './MenuManagement';
import BasicTableManagement from './BasicTableManagement';
import UnitManagement from './UnitManagement';
import PersonManagement from './PersonManagement';
import AttendanceManagement from './AttendanceManagement';
import FamilyManagement from './FamilyManagement';
import { 
  Users, 
  UserCheck, 
  Clock, 
  PlusCircle, 
  Search,
  Building
} from 'lucide-react';

interface DashboardProps {
  user: {
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    permissions: string[];
    groups?: string[];
  };
  unidadeId: string;
  onLogout: () => void;
}

export default function Dashboard({ user, unidadeId, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState(() => window.location.hash.replace('#', '') || 'dashboard');
  const [triggerNovoAtendimento, setTriggerNovoAtendimento] = useState(false);

  const [unidadesList, setUnidadesList] = useState<any[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      const tab = window.location.hash.replace('#', '') || 'dashboard';
      setActiveTab(tab);
      // Reset trigger on direct URL/sidebar changes
      if (tab !== 'atendimentos') {
        setTriggerNovoAtendimento(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/unidades/`, {
      headers: { 'Authorization': `Token ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUnidadesList(data.results || data || []);
      })
      .catch(err => console.error(err));
  }, []);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

  // Obter o nome real da unidade ativa
  const getUnidadeNome = (id: string) => {
    const match = unidadesList.find(u => u.id.toString() === id.toString());
    return match ? match.nome_conhecido : 'Carregando unidade...';
  };

  const usernameDisplay = user.first_name 
    ? `${user.first_name} ${user.last_name || ''}`.trim() 
    : user.username;

  // Função auxiliar para gerar iniciais reais do operador
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const userInitials = getInitials(usernameDisplay);

  // Exibe o primeiro grupo dele, ou "Operador" se não houver
  const userRoleDisplay = user.groups && user.groups.length > 0 
    ? user.groups[0] 
    : 'Operador';

  // Estatísticas fictícias para preencher o Dashboard
  const estatisticas = [
    { title: 'Famílias Cadastradas', value: '1.240', change: '+12% este mês', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Atendimentos Hoje', value: '42', change: '8 pendentes', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Benefícios Concedidos', value: '850', change: '+3% este mês', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Agendamentos', value: '18', change: 'Para amanhã: 12', icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const atendimentosRecentes = [
    { id: 1, nome: 'Maria Silva Costa', servico: 'Bolsa Família - Atualização', hora: '10:30', status: 'Concluído' },
    { id: 2, nome: 'João Santos Oliveira', servico: 'Cesta Básica - Solicitação', hora: '11:15', status: 'Em Andamento' },
    { id: 3, nome: 'Ana Paula Rodrigues', servico: 'Apoio Psicológico', hora: '11:45', status: 'Aguardando' },
    { id: 4, nome: 'Carlos Eduardo Souza', servico: 'Encaminhamento BPC', hora: '12:00', status: 'Aguardando' },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar Componentizada */}
      <Sidebar 
        onLogout={onLogout} 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Navbar */}
        <header className="topbar">
          <div className="unidade-badge">
            <Building size={16} />
            <span>{getUnidadeNome(unidadeId)}</span>
          </div>

          <div className="user-profile">
            <div className="avatar">
              {userInitials}
            </div>
            <div className="user-info">
              <span className="user-name">{usernameDisplay}</span>
              <span className="user-role">{userRoleDisplay}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Pages/Body */}
        <div className="content-body">
          {activeTab === 'usuarios' ? (
            <UserManagement />
          ) : activeTab === 'unidades' ? (
            <UnitManagement />
          ) : activeTab === 'pessoas' ? (
            <PersonManagement />
          ) : activeTab === 'familias' ? (
            <FamilyManagement />
          ) : activeTab === 'atendimentos' ? (
            <AttendanceManagement userPermissions={user.permissions} triggerNovo={triggerNovoAtendimento} unidadeId={unidadeId} currentUser={user} />
          ) : activeTab === 'gerenciamento-menus' ? (
            <MenuManagement />
          ) : activeTab === 'tabelas' ? (
            <BasicTableManagement />
          ) : (
            <>
              <div className="welcome-section">
                <h1 className="welcome-title">Olá, {usernameDisplay}!</h1>
                <p className="welcome-subtitle">Confira o resumo das atividades e atendimentos da sua unidade hoje.</p>
              </div>

              {/* Cards de Estatísticas */}
              <div className="stats-grid">
                {estatisticas.map((stat, idx) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={idx} className="stat-card">
                      <div className="stat-card-header">
                        <span className="stat-card-title">{stat.title}</span>
                        <div className={`stat-icon-wrapper ${stat.bg} ${stat.color}`}>
                          <IconComponent size={20} />
                        </div>
                      </div>
                      <div className="stat-card-body">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-change">{stat.change}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Seção Principal de Conteúdo */}
              <div className="dashboard-grid">
                {/* Ações Rápidas */}
                <div className="dashboard-card side-card">
                  <div className="card-header">
                    <h3 className="card-title">Ações Rápidas</h3>
                  </div>
                  <div className="card-body quick-actions-container">
                    <button 
                      onClick={() => {
                        setTriggerNovoAtendimento(true);
                        setActiveTab('atendimentos');
                        window.location.hash = '#atendimentos';
                      }} 
                      className="quick-action-btn"
                    >
                      <PlusCircle size={20} />
                      <div className="action-text">
                        <span className="action-title">Novo Atendimento</span>
                        <span className="action-desc">Registrar atendimento de hoje</span>
                      </div>
                    </button>
                    <button onClick={() => setActiveTab('pessoas')} className="quick-action-btn">
                      <Users size={20} />
                      <div className="action-text">
                        <span className="action-title">Novo Cadastro</span>
                        <span className="action-desc">Inserir uma nova família</span>
                      </div>
                    </button>
                    <button className="quick-action-btn">
                      <Search size={20} />
                      <div className="action-text">
                        <span className="action-title">Buscar Prontuário</span>
                        <span className="action-desc">Pesquisar histórico social</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Atendimentos Recentes */}
                <div className="dashboard-card main-card">
                  <div className="card-header">
                    <h3 className="card-title">Fila de Atendimentos Recentes</h3>
                    <button className="btn-text">Ver todos</button>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="dashboard-table">
                        <thead>
                          <tr>
                            <th>Nome</th>
                            <th>Serviço/Solicitação</th>
                            <th>Horário</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {atendimentosRecentes.map((atendimento) => (
                            <tr key={atendimento.id}>
                              <td className="font-semibold">{atendimento.nome}</td>
                              <td>{atendimento.servico}</td>
                              <td>{atendimento.hora}</td>
                              <td>
                                <span className={`status-badge ${
                                  atendimento.status === 'Concluído' ? 'status-done' :
                                  atendimento.status === 'Em Andamento' ? 'status-active' :
                                  'status-pending'
                                }`}>
                                  {atendimento.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
