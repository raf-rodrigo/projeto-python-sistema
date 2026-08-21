interface AttendanceActionsDrawerProps {
  atendimentoId: number | null;
  onClose: () => void;
  onFinish: () => void;
  onInternalReferral: () => void;
  apiUrl: string;
}

const secondaryButtonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#f1f5f9',
  color: '#475569',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px'
} as const;

export default function AttendanceActionsDrawer({ atendimentoId, onClose, onFinish, onInternalReferral, apiUrl }: AttendanceActionsDrawerProps) {
  return (
    <aside style={{ backgroundColor: '#f8fafc', borderLeft: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', animation: 'slideRight 0.3s ease-out' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#334155', fontSize: '18px', fontWeight: 700 }}>Ações</h3>
        <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
        <button type="button" onClick={onFinish} style={{ ...secondaryButtonStyle, backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: 700 }}>✖ Encerrar Atendimento</button>
        <button type="button" onClick={() => atendimentoId && window.open(`${apiUrl}/api/atendimentos_sociais/${atendimentoId}/pdf/`, '_blank')} style={secondaryButtonStyle}>🖨 Ver Impressão</button>
        <button type="button" onClick={onInternalReferral} style={secondaryButtonStyle}>⇄ Encaminhamento Interno</button>
        <button type="button" onClick={() => alert('Funcionalidade de agendamento em desenvolvimento.')} style={secondaryButtonStyle}>📅 Agendamento</button>
        <button type="button" onClick={() => alert('Funcionalidade de visualização de agenda em desenvolvimento.')} style={secondaryButtonStyle}>📅 Visualizar Agenda</button>
        <button type="button" onClick={() => alert('Funcionalidade de upload de documentos em desenvolvimento.')} style={secondaryButtonStyle}>☁ Upload Documentos</button>
      </div>
    </aside>
  );
}
