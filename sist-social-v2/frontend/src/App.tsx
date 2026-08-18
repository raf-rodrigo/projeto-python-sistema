import React, { useState } from 'react';
import './css/App.css';
import Dashboard from './components/Dashboard';

interface UserType {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  permissions: string[];
  groups?: string[];
}

function App() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [unidade, setUnidade] = useState(localStorage.getItem('unidade') || '');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [unidadesList, setUnidadesList] = useState<any[]>([]);

  // Estados de Autenticação
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<UserType | null>(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

  // Carrega as unidades associadas ao usuário inserido no input de login
  const buscarUnidadesDoUsuario = async (username: string) => {
    if (!username.trim()) {
      setUnidadesList([]);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/login/unidades/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (res.ok) {
        const data: any[] = await res.json();
        setUnidadesList(data || []);
        
        // Regra: se o usuário tiver apenas 1 unidade vinculada, seleciona ela automaticamente
        if (data && data.length === 1) {
          setUnidade(data[0].id.toString());
        } else {
          setUnidade('');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    try {
      const response = await fetch(`${API_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: usuario,
          password: senha,
          unidade_id: unidade,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar login.');
      }

      // Sucesso no login
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('unidade', data.unidade_id);

      // Redireciona para o dashboard principal limpando hash anterior
      window.location.hash = 'dashboard';

      setToken(data.token);
      setUser(data.user);
    } catch (err: any) {
      setErro(err.message || 'Erro de conexão com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('unidade');
    setToken(null);
    setUser(null);
    setUsuario('');
    setSenha('');
  };

  // Se já estiver logado, renderiza o Dashboard
  if (token && user) {
    // Administradores ou superusuários têm acesso irrestrito
    const eAdmin = user.permissions.includes('superuser') || 
                   user.permissions.includes('auth.change_user') ||
                   user.groups?.some(g => g.toLowerCase() === 'administradores' || g.toLowerCase() === 'admin') || 
                   user.username.toLowerCase() === 'admin';

    const semUnidade = !unidade;
    const semProfissional = user.tem_profissional === false;
    const semPerfilAcesso = !user.groups || user.groups.length === 0;

    if (!eAdmin && (semUnidade || semProfissional || semPerfilAcesso)) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' }}>
          <div style={{ backgroundColor: '#ffffff', maxWidth: '480px', width: '100%', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', color: '#ef4444', marginBottom: '16px' }}>⚠️</div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Acesso Restrito</h2>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: '1.6', marginBottom: '24px' }}>
              {semPerfilAcesso ? (
                <>
                  Detectamos que sua conta não possui nenhum <strong>Perfil de Acesso</strong> (Grupo) atribuído.
                </>
              ) : (
                <>
                  Detectamos que sua conta não possui uma <strong>Unidade de Atendimento</strong> selecionada ou faltam os dados obrigatórios do seu perfil profissional (Aba Profissionais). 
                </>
              )}
              <br /><br />
              Por favor, procure o seu <strong>gestor</strong> para regularizar o seu cadastro no sistema.
            </p>
            <button 
              onClick={handleLogout} 
              style={{ padding: '10px 20px', backgroundColor: '#ef4444', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Voltar para Login
            </button>
          </div>
        </div>
      );
    }

    return (
      <Dashboard 
        user={user} 
        unidadeId={unidade} 
        onLogout={handleLogout} 
      />
    );
  }

  return (
    <div className="outer-wrapper corpo">
      <div className="inner-wrapper">
        <form onSubmit={handleSubmit} id="formLogin">
          <div className="container">
            <div className="bg-form">
              {/* Espaço reservado para a Imagem do Login */}
              <div className="text-center margin-img">
                <div className="image-placeholder">
                  <span>[ Imagem de Login do Sistema ]</span>
                </div>
              </div>

              <div id="blocoLogin">
                {erro && (
                  <div style={{
                    backgroundColor: '#fee2e2',
                    border: '1px solid #fca5a5',
                    color: '#b91c1c',
                    padding: '10px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    fontSize: '13px',
                    textAlign: 'center',
                    fontWeight: 500
                  }}>
                    {erro}
                  </div>
                )}

                 <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Usuário"
                    id="usuario"
                    value={usuario}
                    onChange={(e) => {
                      setUsuario(e.target.value);
                      buscarUnidadesDoUsuario(e.target.value);
                    }}
                    onBlur={() => buscarUnidadesDoUsuario(usuario)}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Senha"
                    id="senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <select
                    id="selUnidade"
                    className="form-control"
                    value={unidade}
                    onChange={(e) => setUnidade(e.target.value)}
                    required
                  >
                    <option value="">-- Selecione a Unidade --</option>
                    {unidadesList.map((un) => (
                      <option key={un.id} value={un.id}>
                        {un.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn conecta text-white"
                  disabled={carregando}
                >
                  {carregando ? 'Conectando...' : 'Conectar'}
                </button>

                <div className="links">
                  <a href="#recuperar" className="text-dark">
                    Recuperar senha?
                  </a>
                </div>
              </div>
            </div>

            <div className="footer">
              <div className="rodape">
                <small>
                  Copyright & Copyleft &copy; Desenvolvido por Rafael Rodrigo Doimo.
                </small>
                <div className="footer-lliege">
                  <small><i>powered by</i></small>
                  <div className="logo-placeholder">[ Logo Rodapé ]</div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {carregando && (
        <div className="loader" id="carregando">
          <div className="pulse">[ Carregando... ]</div>
        </div>
      )}
    </div>
  );
}

export default App;
