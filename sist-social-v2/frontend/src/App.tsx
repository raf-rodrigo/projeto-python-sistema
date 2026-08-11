import React, { useState } from 'react';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [unidade, setUnidade] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Simulação de lista de unidades (no futuro virá da API)
  const unidades = [
    { id: '1', nome: 'CRAS Central' },
    { id: '2', nome: 'CREAS Norte' },
    { id: '3', nome: 'Unidade de Acolhimento Sul' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    // Simulação de login por enquanto
    setTimeout(() => {
      alert(`Tentando logar com: \nUsuário: ${usuario}\nUnidade ID: ${unidade}`);
      setCarregando(false);
    }, 1500);
  };

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
