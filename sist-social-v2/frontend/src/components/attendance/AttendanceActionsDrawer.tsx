interface AttendanceActionsDrawerProps {
  atendimentoId: number | null;
  onClose: () => void;
  onFinish: () => void;
  onInternalReferral: () => void;
  onOpenRecord?: () => void;
  technical?: boolean;
  onPrint: () => void;
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

const technicalButtonStyle = {
  width: '100%',
  padding: '13px 10px',
  backgroundColor: '#ffffff',
  color: '#64748b',
  border: 'none',
  borderBottom: '1px solid #e2e8f0',
  fontSize: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: '8px',
  textAlign: 'left'
} as const;

export default function AttendanceActionsDrawer({ atendimentoId, onClose, onFinish, onInternalReferral, onOpenRecord, technical = false, onPrint }: AttendanceActionsDrawerProps) {

  const emDesenvolvimento = (acao: string) => alert(`${acao} em desenvolvimento.`);

  return (
    <aside style={{ backgroundColor: technical ? '#ffffff' : '#f8fafc', borderLeft: '1px solid #e2e8f0', padding: technical ? '20px 0' : '24px', display: 'flex', flexDirection: 'column', gap: technical ? '8px' : '16px', animation: 'slideRight 0.3s ease-out', minHeight: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', padding: technical ? '0 18px 18px' : '0 0 12px' }}>
        <h3 style={{ margin: 0, color: '#334155', fontSize: technical ? '22px' : '18px', fontWeight: 700 }}>Ações</h3>
        <button type="button" onClick={onClose} aria-label="Fechar ações" style={{ background: 'none', border: 'none', fontSize: '1.25rem', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
      </div>

      {technical ? (
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <button type="button" onClick={onFinish} style={{ ...technicalButtonStyle, color: '#ef4444', fontWeight: 700 }}>✖ Encerrar Atendimento</button>
          <button type="button" onClick={onPrint} style={technicalButtonStyle}>▣ Ver Impressão</button>
          <button type="button" onClick={onOpenRecord} style={technicalButtonStyle}>▤ Abrir Prontuário</button>
          <button type="button" onClick={() => emDesenvolvimento('Reencaminhamento interno')} style={technicalButtonStyle}>↔ Reencaminhamento Interno</button>
          <button type="button" onClick={() => emDesenvolvimento('Encaminhamento referência')} style={technicalButtonStyle}>↪ Encaminhamento Referência</button>
          <button type="button" onClick={() => emDesenvolvimento('Contra referência')} style={technicalButtonStyle}>↩ Contra Referência</button>
          <button type="button" onClick={() => emDesenvolvimento('Upload de documentos')} style={technicalButtonStyle}>☁ Upload Documentos</button>
          <button type="button" onClick={() => emDesenvolvimento('Associação a grupos')} style={technicalButtonStyle}>♣ Associação Grupos</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
          <button type="button" onClick={onFinish} style={{ ...secondaryButtonStyle, backgroundColor: '#fee2e2', color: '#ef4444', fontWeight: 700 }}>✖ Encerrar Atendimento</button>
          <button type="button" onClick={onPrint} style={secondaryButtonStyle}>🖨 Ver Impressão</button>
          <button type="button" onClick={onInternalReferral} style={secondaryButtonStyle}>⇄ Encaminhamento Interno</button>
          <button type="button" onClick={() => emDesenvolvimento('Agendamento')} style={secondaryButtonStyle}>📅 Agendamento</button>
          <button type="button" onClick={() => emDesenvolvimento('Visualização da agenda')} style={secondaryButtonStyle}>📅 Visualizar Agenda</button>
          <button type="button" onClick={() => emDesenvolvimento('Upload de documentos')} style={secondaryButtonStyle}>☁ Upload Documentos</button>
        </div>
      )}
    </aside>
  );
}
