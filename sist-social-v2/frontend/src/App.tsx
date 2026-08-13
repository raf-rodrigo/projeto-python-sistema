import React, { useState } from 'react';
import './App.css';
import Dashboard from './Dashboard';

interface UserType {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  permissions: string[];
}

function App() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [unidade, setUnidade] = useState(localStorage.getItem('unidade') || '');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

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

  // Simulação de lista de unidades (no futuro virá da API)
  const unidades = [
    { id: '1', nome: 'CRAS Central' },
    { id: '2', nome: 'CREAS Norte' },
    { id: '3', nome: 'Unidade de Acolhimento Sul' }
  ];

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
                    onChange={(e) => setUsuario(e.target.value)}
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
                    {unidades.map((un) => (
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
