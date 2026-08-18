import React from 'react';
import SearchableSelect from '../SearchableSelect';

interface FamilyDialogsProps {
  API_URL: string;
  token: string | null;
  editandoId: number | null;
  codigoFamiliaExibicao: string;
  
  // Modal 1: Escolha inclusão
  modalEscolhaInclusao: boolean;
  setModalEscolhaInclusao: (val: boolean) => void;
  setModalIncluirExistente: (val: boolean) => void;

  // Modal 2: Incluir existente
  modalIncluirExistente: boolean;
  setModalIncluirExistenteOnly: (val: boolean) => void;
  buscaPessoasQuery: string;
  setBuscaPessoasQuery: (val: string) => void;
  pessoasFiltradas: any[];
  setPessoasFiltradas: (val: any[]) => void;
  setPessoaSelecionadaPendente: (val: any) => void;
  setNovoParentescoId: (val: string) => void;
  setMotivoTransferenciaPessoa: (val: string) => void;
  setObservacoesTransferenciaPessoa: (val: string) => void;
  setModalTransferirPessoa: (val: boolean) => void;
  setMembrosFamilia: React.Dispatch<React.SetStateAction<any[]>>;

  // Modal 3: Transferir cidadão de família
  modalTransferirPessoa: boolean;
  pessoaSelecionadaPendente: any;
  setModalTransferirPessoaOnly: (val: boolean) => void;
  parentescosDisponiveis: any[];
  novoParentescoId: string;
  motivoTransferenciaPessoa: string;
  observacoesTransferenciaPessoa: string;
  carregarDadosFamilia: () => void;
}

export const FamilyDialogs: React.FC<FamilyDialogsProps> = ({
  API_URL,
  token,
  editandoId,
  codigoFamiliaExibicao,
  modalEscolhaInclusao,
  setModalEscolhaInclusao,
  setModalIncluirExistente,
  modalIncluirExistente,
  setModalIncluirExistenteOnly,
  buscaPessoasQuery,
  setBuscaPessoasQuery,
  pessoasFiltradas,
  setPessoasFiltradas,
  setPessoaSelecionadaPendente,
  setNovoParentescoId,
  setMotivoTransferenciaPessoa,
  setObservacoesTransferenciaPessoa,
  setModalTransferirPessoa,
  setMembrosFamilia,
  modalTransferirPessoa,
  pessoaSelecionadaPendente,
  setModalTransferirPessoaOnly,
  parentescosDisponiveis,
  novoParentescoId,
  motivoTransferenciaPessoa,
  observacoesTransferenciaPessoa,
  carregarDadosFamilia
}) => {
  return (
    <>
      {/* 1. Modal Escolha Inclusão */}
      {modalEscolhaInclusao && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', textAlign: 'center' }}>Adicionar Membro Familiar</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button 
                type="button" 
                onClick={() => {
                  setModalEscolhaInclusao(false);
                  setBuscaPessoasQuery('');
                  setPessoasFiltradas([]);
                  setModalIncluirExistente(true);
                }} 
                style={{ padding: '12px', backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
              >
                🔍 Incluir Pessoa já cadastrada
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setModalEscolhaInclusao(false);
                  localStorage.setItem('veioDeFamiliaVinculo', 'true');
                  if (editandoId) {
                    localStorage.setItem('familiaPendenteVinculoId', editandoId.toString());
                  }
                  window.location.hash = `pessoas`;
                  localStorage.setItem('abrirCadastroNovaPessoaImediato', 'true');
                }} 
                style={{ padding: '12px', backgroundColor: '#f97316', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
              >
                👤 Cadastrar Nova Pessoa
              </button>
              <button 
                type="button" 
                onClick={() => setModalEscolhaInclusao(false)} 
                style={{ padding: '12px', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Incluir Pessoa (Existente) */}
      {modalIncluirExistente && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '850px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#334155' }}>
                👤 Incluir Pessoa
              </h3>
              <button onClick={() => setModalIncluirExistenteOnly(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Pesquisar por nome ou CPF..." 
                value={buscaPessoasQuery} 
                onChange={async e => {
                  const val = e.target.value;
                  setBuscaPessoasQuery(val);
                  if (val.trim().length >= 2) {
                    const res = await fetch(`${API_URL}/api/pessoas/?search=${encodeURIComponent(val)}`, {
                      headers: { 'Authorization': `Token ${token}` }
                    });
                    if (res.ok) {
                      const resJson = await res.json();
                      setPessoasFiltradas(resJson.results || resJson || []);
                    }
                  } else {
                    setPessoasFiltradas([]);
                  }
                }} 
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '8px', marginBottom: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569' }}>Nome Completo</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569' }}>Identificação</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569' }}>Data Nascimento</th>
                    <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569' }}>CPF</th>
                    <th style={{ padding: '10px 16px', textAlign: 'center', color: '#475569', width: '120px' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {pessoasFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b' }}>
                        {buscaPessoasQuery.length < 2 ? 'Digite pelo menos 2 caracteres para pesquisar...' : 'Nenhuma pessoa encontrada.'}
                      </td>
                    </tr>
                  ) : (
                    pessoasFiltradas.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '10px 16px', fontWeight: 600, color: '#334155' }}>{p.nome}</td>
                        <td style={{ padding: '10px 16px', color: '#475569' }}>{p.nis || 'N/A'}</td>
                        <td style={{ padding: '10px 16px', color: '#475569' }}>
                          {p.certidao_nascimento_data ? new Date(p.certidao_nascimento_data).toLocaleDateString('pt-BR') : 'N/A'}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#475569' }}>{p.cpf || 'N/A'}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                            {p.familia_domicilio ? (
                              <button 
                                type="button" 
                                onClick={() => {
                                  setModalIncluirExistenteOnly(false);
                                  setPessoaSelecionadaPendente(p);
                                  setNovoParentescoId('');
                                  setMotivoTransferenciaPessoa('');
                                  setObservacoesTransferenciaPessoa('');
                                  setModalTransferirPessoa(true);
                                }} 
                                style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                title="Transferir de Família"
                              >
                                🔄 Transferir
                              </button>
                            ) : (
                              <button 
                                type="button" 
                                onClick={async () => {
                                  const parentesco = prompt('Digite a relação de parentesco (1 para RF, 2 para Cônjuge, etc.):', '3');
                                  if (parentesco) {
                                    const res = await fetch(`${API_URL}/api/pessoas/${p.id}/`, {
                                      method: 'PATCH',
                                      headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Token ${token}`
                                      },
                                      body: JSON.stringify({
                                        familia_domicilio: editandoId,
                                        tipo_parentesco: parseInt(parentesco)
                                      })
                                    });
                                    if (res.ok) {
                                      alert('Pessoa vinculada com sucesso.');
                                      setModalIncluirExistenteOnly(false);
                                      const upRes = await fetch(`${API_URL}/api/familias_domicilios/${editandoId}/`, {
                                        headers: { 'Authorization': `Token ${token}` }
                                      });
                                      if (upRes.ok) {
                                        const updated = await upRes.json();
                                        setMembrosFamilia(updated.membros_details || []);
                                      }
                                    }
                                  }
                                }} 
                                style={{ padding: '6px 10px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                title="Incluir diretamente"
                              >
                                ➕ Incluir
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Transferir Pessoa */}
      {modalTransferirPessoa && pessoaSelecionadaPendente && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10001 }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '90%', maxWidth: '650px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#334155' }}>
                Transferir Pessoa
              </h3>
              <button onClick={() => setModalTransferirPessoaOnly(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#94a3b8' }}>&times;</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Nome:</label>
                <input type="text" className="form-control" value={pessoaSelecionadaPendente.nome} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Código da Família Atual:</label>
                  <input type="text" className="form-control" value={pessoaSelecionadaPendente.familia_details?.familia_codigo || 'Sem Família'} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Grau de Parentesco Atual:</label>
                  <input type="text" className="form-control" value={pessoaSelecionadaPendente.parentesco_details?.nome || 'Não definido'} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Nova Família:</label>
                  <input type="text" className="form-control" value={codigoFamiliaExibicao} disabled style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Grau de Parentesco (na nova família)*:</label>
                  <SearchableSelect 
                    options={parentescosDisponiveis.map(p => ({ id: p.id, label: p.nome }))} 
                    value={novoParentescoId} 
                    onChange={val => setNovoParentescoId(val.toString())} 
                    placeholder="Selecione..." 
                    required 
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Motivo*:</label>
                  <select 
                    className="form-control" 
                    value={motivoTransferenciaPessoa} 
                    onChange={e => setMotivoTransferenciaPessoa(e.target.value)}
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Casamento/União">Casamento/União</option>
                    <option value="Separação/Divórcio">Separação/Divórcio</option>
                    <option value="Independência Financeira">Independência Financeira</option>
                    <option value="Mudança de Residência">Mudança de Residência</option>
                    <option value="Correção de Cadastro">Correção de Cadastro</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>Observações:</label>
                  <textarea 
                    className="form-control" 
                    rows={3} 
                    value={observacoesTransferenciaPessoa} 
                    onChange={e => setObservacoesTransferenciaPessoa(e.target.value)} 
                    placeholder="Escreva detalhes..." 
                    style={{ resize: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '16px', marginTop: '10px' }}>
                <button 
                  type="button" 
                  onClick={() => setModalTransferirPessoaOnly(false)} 
                  style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', border: 'none', borderRadius: '6px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button 
                  type="button" 
                  disabled={!novoParentescoId || !motivoTransferenciaPessoa}
                  onClick={async () => {
                    const payload = {
                      familia_domicilio: editandoId,
                      tipo_parentesco: parseInt(novoParentescoId),
                      motivo_transferencia: motivoTransferenciaPessoa,
                      observacoes_transferencia: observacoesTransferenciaPessoa
                    };

                    try {
                      const res = await fetch(`${API_URL}/api/pessoas/${pessoaSelecionadaPendente.id}/`, {
                        method: 'PATCH',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Token ${token}`
                        },
                        body: JSON.stringify(payload)
                      });

                      if (res.ok) {
                        alert('Pessoa transferida de família com sucesso.');
                        setModalTransferirPessoaOnly(false);
                        
                        const upRes = await fetch(`${API_URL}/api/familias_domicilios/${editandoId}/`, {
                          headers: { 'Authorization': `Token ${token}` }
                        });
                        if (upRes.ok) {
                          const updated = await upRes.json();
                          setMembrosFamilia(updated.membros_details || []);
                        }
                        
                        carregarDadosFamilia();
                      } else {
                        alert('Erro ao realizar a transferência no servidor.');
                      }
                    } catch (err) {
                      alert('Erro de conexão ao transferir.');
                    }
                  }} 
                  style={{ padding: '8px 16px', backgroundColor: '#10b981', border: 'none', borderRadius: '6px', color: '#ffffff', fontWeight: 600, cursor: 'pointer', opacity: (novoParentescoId && motivoTransferenciaPessoa) ? 1 : 0.6 }}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
