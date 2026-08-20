import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';

interface FamiliaDomicilio {
  id: number;
  familia_codigo?: string;
  prontuario?: string;
  responsavel_familiar_nome?: string;
  nis?: string;
  cpf?: string;
  telefone?: string;
  pbf?: string;
  ext_pobreza?: string;
}

interface FamilyTableProps {
  familias: FamiliaDomicilio[];
  carregando: boolean;
  abrirEditarModal: (f: any) => void;
  deletarFamilia: (id: number) => void;
}

export const FamilyTable: React.FC<FamilyTableProps> = ({
  familias,
  carregando,
  abrirEditarModal,
  deletarFamilia
}) => {
  if (carregando) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Carregando dados...</div>;
  }

  if (familias.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', color: '#64748b' }}>
        Nenhuma família cadastrada no sistema.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', overflowX: 'auto' }}>
      <table className="dashboard-table" style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '90px' }}>Código</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '90px' }}>Prontuário</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '220px' }}>Nome RF</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '110px' }}>NIS</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '120px' }}>CPF</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '120px' }}>Telefone</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '80px' }}>PBF</th>
            <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 700, color: '#475569', minWidth: '110px' }}>Extr.Pobreza</th>
            <th style={{ padding: '14px 16px', width: '120px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#475569' }}>Ação</th>
          </tr>
        </thead>
        <tbody>
          {familias.map(f => {
            const isRfAguardando = f.responsavel_familiar_nome === 'AGUARDANDO CADASTRO DE RF';
            return (
              <tr key={f.id} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '13px' }}>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: isRfAguardando ? '#ef4444' : '#1e3a8a' }}>
                  {f.familia_codigo || `FAM-${f.id}`}
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 500, color: isRfAguardando ? '#ef4444' : '#475569' }}>
                  {f.prontuario || `SADS-${f.id}`}
                </td>
                <td style={{ 
                  padding: '14px 16px',
                  fontWeight: 600, 
                  color: isRfAguardando ? '#ef4444' : '#334155',
                  maxWidth: '260px',
                  whiteSpace: 'normal',
                  wordBreak: 'keep-all'
                }}>
                  {f.responsavel_familiar_nome}
                </td>
                <td style={{ padding: '14px 16px', color: isRfAguardando ? '#ef4444' : '#64748b' }}>{f.nis || 'N/A'}</td>
                <td style={{ padding: '14px 16px', color: isRfAguardando ? '#ef4444' : '#64748b' }}>{f.cpf || 'N/A'}</td>
                <td style={{ padding: '14px 16px', color: isRfAguardando ? '#ef4444' : '#64748b' }}>{f.telefone || 'N/A'}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{f.pbf || 'Não'}</td>
                <td style={{ padding: '14px 16px', color: '#475569' }}>{f.ext_pobreza || 'Não'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button onClick={() => abrirEditarModal(f)} style={{ border: 'none', backgroundColor: 'transparent', color: '#0284c7', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Editar">
                      <Edit3 size={16} />
                    </button>
                    <button onClick={() => deletarFamilia(f.id)} style={{ border: 'none', backgroundColor: 'transparent', color: '#ef4444', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center' }} title="Excluir">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
