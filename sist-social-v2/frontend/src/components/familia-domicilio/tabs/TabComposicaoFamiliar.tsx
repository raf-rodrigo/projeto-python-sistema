import React from 'react';

interface TabComposicaoFamiliarProps {
  editandoId: number | null;
  membrosFamilia: any[];
  token: string | null;
  API_URL: string;
  setMembrosFamilia: React.Dispatch<React.SetStateAction<any[]>>;
  carregarDados: () => void;
  setModalEscolhaInclusao: (val: boolean) => void;
  setPessoaSelecionadaPendente: (val: any) => void;
  setNovoParentescoId: (val: string) => void;
  setMotivoTransferenciaPessoa: (val: string) => void;
  setObservacoesTransferenciaPessoa: (val: string) => void;
  setModalTransferirPessoa: (val: boolean) => void;
}

export const TabComposicaoFamiliar: React.FC<TabComposicaoFamiliarProps> = ({
  editandoId,
  membrosFamilia,
  token,
  API_URL,
  setMembrosFamilia,
  carregarDados,
  setModalEscolhaInclusao,
  setPessoaSelecionadaPendente,
  setNovoParentescoId,
  setMotivoTransferenciaPessoa,
  setObservacoesTransferenciaPessoa,
  setModalTransferirPessoa
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Botões de Ação da Aba */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button 
          type="button" 
          onClick={() => setModalEscolhaInclusao(true)} 
          style={{ padding: '8px 16px', backgroundColor: '#10b981', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ➕ Adicionar Membro na Família
        </button>
        <button 
          type="button" 
          onClick={async () => {
            const res = await fetch(`${API_URL}/api/familias_domicilios/${editandoId}/`, {
              headers: { 'Authorization': `Token ${token}` }
            });
            if (res.ok) {
              const updated = await res.json();
              setMembrosFamilia(updated.membros_details || []);
            }
          }} 
          style={{ padding: '8px 16px', backgroundColor: '#fff', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '6px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
        >
          🔄 Atualizar Lista de Composição
        </button>
      </div>

      {/* Tabela de Membros */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569', width: '100px' }}>Ação</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Nome Completo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>NIS/PIS/PASEP</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Celular</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Sexo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Data de Nascimento</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Relação de Parentesco</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Certidão de Óbito</th>
            </tr>
          </thead>
          <tbody>
            {membrosFamilia.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#ffffff' }}>
                  Nenhum membro vinculado a esta família.
                </td>
              </tr>
            ) : (
              membrosFamilia.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        type="button" 
                        onClick={() => {
                          window.location.hash = `pessoas`;
                          localStorage.setItem('editandoPessoaPendenteId', m.id.toString());
                        }} 
                        style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0 }}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button 
                        type="button" 
                        onClick={async () => {
                          if (confirm(`Deseja desvincular ${m.nome} desta família?`)) {
                            const res = await fetch(`${API_URL}/api/pessoas/${m.id}/`, {
                              method: 'PATCH',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Token ${token}`
                              },
                              body: JSON.stringify({ familia_domicilio: null, tipo_parentesco: null })
                            });
                            if (res.ok) {
                              setMembrosFamilia(prev => prev.filter(item => item.id !== m.id));
                              carregarDados();
                            }
                          }
                        }} 
                        style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0 }}
                        title="Excluir/Desvincular"
                      >
                        🗑️
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setPessoaSelecionadaPendente(m);
                          setNovoParentescoId('');
                          setMotivoTransferenciaPessoa('');
                          setObservacoesTransferenciaPessoa('');
                          setModalTransferirPessoa(true);
                        }} 
                        style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: 0 }}
                        title="Transferir Família"
                      >
                        🔄
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 600 }}>{m.nome}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{m.nis || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{m.celular || m.telefone || 'N/A'}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{m.sexo}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {m.certidao_nascimento_data ? new Date(m.certidao_nascimento_data).toLocaleDateString('pt-BR') : 'N/A'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#1e3a8a', fontWeight: 600 }}>
                    {m.parentesco_details?.nome || 'Não definido'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>
                    {m.certidao_obito_numero ? 'Sim' : 'Não'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};
