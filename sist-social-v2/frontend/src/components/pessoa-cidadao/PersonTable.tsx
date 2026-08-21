import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
}

interface Pessoa {
  id: number;
  nome: string;
  nome_social?: string;
  nis?: string;
  certidao_nascimento_data: string;
  sexo: 'Masc' | 'Fem';
  cpf: string;
  telefone?: string;
  celular?: string;
  email?: string;
  parentesco_details?: TabelaBasicaItem;
  familia_details?: {
    id: number;
    familia_codigo?: string;
  };
}

interface PersonTableProps {
  pessoas: Pessoa[];
  carregando: boolean;
  abrirEditarModal: (p: Pessoa) => void;
  deletarPessoa: (id: number) => void;
}

export const PersonTable: React.FC<PersonTableProps> = ({
  pessoas,
  carregando,
  abrirEditarModal,
  deletarPessoa
}) => {
  if (carregando) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Carregando dados...</div>;
  }

  if (pessoas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', color: '#64748b' }}>
        Nenhum munícipe cadastrado no sistema.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <table className="dashboard-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569', width: '280px', minWidth: '240px' }}>Munícipe</th>
            <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Código Família</th>
            <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Identificação (NIS)</th>
            <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Data Nasc.</th>
            <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569' }}>CPF</th>
            <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Sexo</th>
            <th style={{ textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Grau Parentesco</th>
            <th style={{ width: '120px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {pessoas.map(p => (
            <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '13px' }}>
              <td style={{ padding: '14px 16px', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.nome}>{p.nome}</span>
                  {p.nome_social && <span style={{ fontSize: '11px', color: '#f97316', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.nome_social}>Nome Social: {p.nome_social}</span>}
                </div>
              </td>
              <td style={{ fontWeight: 600, color: '#1e3a8a' }}>
                {p.familia_details?.familia_codigo || 'Sem vínculo'}
              </td>
              <td style={{ color: '#475569' }}>{p.nis || 'N/A'}</td>
              <td style={{ color: '#64748b' }}>
                {p.certidao_nascimento_data ? new Date(p.certidao_nascimento_data).toLocaleDateString('pt-BR') : 'N/A'}
              </td>
              <td style={{ color: '#64748b' }}>{p.cpf || 'N/A'}</td>
              <td style={{ color: '#475569' }}>{p.sexo}</td>
              <td style={{ fontWeight: 500, color: '#475569' }}>
                {p.parentesco_details?.nome || 'N/A'}
              </td>
              <td>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                  <button onClick={() => abrirEditarModal(p)} style={{ border: 'none', backgroundColor: 'transparent', color: '#0284c7', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Editar">
                    <Edit3 size={16} />
                  </button>
                  <button onClick={() => deletarPessoa(p.id)} style={{ border: 'none', backgroundColor: 'transparent', color: '#ef4444', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Excluir">
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
