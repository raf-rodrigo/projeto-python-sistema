import { Edit3, Trash2 } from 'lucide-react';
import type { Atendimento } from './AttendanceManagementTypes';

interface AttendanceTableProps {
  atendimentos: Atendimento[];
  carregando: boolean;
  onEdit: (atendimento: Atendimento) => void;
  onDelete: (id: number) => void;
}

function modalidadeLabel(atendimento: Atendimento) {
  if (atendimento.origem_atendimento) return 'Encaminhamento Interno';
  if (atendimento.modalidade === 'Tecnico') return 'Técnico';
  if (atendimento.modalidade === 'Referencia') return 'Referência';
  if (atendimento.modalidade === 'ContraReferencia') return 'Contrarreferência';
  return atendimento.modalidade;
}

export default function AttendanceTable({ atendimentos, carregando, onEdit, onDelete }: AttendanceTableProps) {
  if (carregando) {
    return <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Carregando atendimentos...</div>;
  }

  if (atendimentos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#ffffff', borderRadius: '12px', color: '#64748b' }}>
        Nenhum registro de atendimento encontrado.
      </div>
    );
  }

  return (
    <div className="table-responsive" style={{ backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)', overflow: 'hidden' }}>
      <table className="dashboard-table">
        <thead>
          <tr style={{ backgroundColor: '#f1f5f9' }}>
            <th style={{ padding: '14px 16px' }}>Data</th>
            <th style={{ minWidth: '220px' }}>Munícipe Atendido</th>
            <th>Número do Prontuário</th>
            <th>Tipo de Atendimento</th>
            <th>Modalidade</th>
            <th>Técnico</th>
            <th>Status</th>
            <th style={{ width: '100px', textAlign: 'center' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {atendimentos.map(atendimento => {
            const tecnico = atendimento.tecnico_responsavel_tecnico_details || atendimento.tecnico_responsavel_inicial_details;
            const nomeTecnico = tecnico
              ? [tecnico.first_name, tecnico.last_name].filter(Boolean).join(' ') || tecnico.username
              : '-';

            return (
              <tr key={atendimento.id}>
                <td style={{ padding: '14px 16px' }}>{new Date(`${atendimento.data_atendimento}T00:00:00`).toLocaleDateString('pt-BR')}</td>
                <td style={{ minWidth: '220px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{atendimento.pessoa_details?.nome || 'Munícipe não identificado'}</div>
                </td>
                <td>{atendimento.prontuario || '-'}</td>
                <td>{atendimento.tipo_atendimento_details?.nome || 'Geral'}</td>
                <td>{modalidadeLabel(atendimento)}</td>
                <td>{nomeTecnico}</td>
                <td><span style={{ fontWeight: 600 }}>{atendimento.status}</span></td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <button onClick={() => onEdit(atendimento)} style={{ border: 'none', backgroundColor: '#f1f5f9', color: '#475569', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Edit3 size={16} /></button>
                    <button onClick={() => onDelete(atendimento.id)} style={{ border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
