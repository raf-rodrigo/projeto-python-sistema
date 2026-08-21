import type { Atendimento, UsuarioResumo } from './AttendanceManagementTypes';

interface ReferralInitialInformationProps {
  atendimento?: Atendimento | null;
}

function nomeUsuario(usuario?: UsuarioResumo) {
  if (!usuario) return '-';
  return [usuario.first_name, usuario.last_name].filter(Boolean).join(' ') || usuario.username;
}

function dataBrasileira(data?: string) {
  return data ? new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR') : '-';
}

const fieldStyle = { backgroundColor: '#f1f5f9', color: '#475569' };
const labelStyle = { fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' } as const;

export default function ReferralInitialInformation({ atendimento }: ReferralInitialInformationProps) {
  const origem = atendimento?.origem_atendimento_details;
  if (!origem) {
    return (
      <div style={{ border: '1px solid #93c5fd', borderRadius: '12px', padding: '18px', backgroundColor: '#f8fbff' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>Informações do Atendimento Inicial</h4>
        <div style={{ padding: '18px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#475569', textAlign: 'center', fontSize: '13px' }}>
          Este atendimento técnico não possui atendimento inicial.
        </div>
      </div>
    );
  }

  return (
    <div style={{ border: '1px solid #93c5fd', borderRadius: '12px', padding: '18px', backgroundColor: '#f8fbff' }}>
      <h4 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700, color: '#1e3a8a' }}>
        Informações do Atendimento Inicial
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '14px' }}>
        <div><label style={labelStyle}>Unidade</label><input className="form-control" value={origem.unidade?.nome_conhecido || '-'} readOnly style={fieldStyle} /></div>
        <div><label style={labelStyle}>Data Atendimento</label><input className="form-control" value={dataBrasileira(origem.data_atendimento)} readOnly style={fieldStyle} /></div>
        <div><label style={labelStyle}>Nº do Atendimento</label><input className="form-control" value={origem.id} readOnly style={fieldStyle} /></div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
        <div><label style={labelStyle}>Forma de Acesso/Motivo do Atendimento</label><input className="form-control" value={origem.motivo_atendimento?.nome || '-'} readOnly style={fieldStyle} /></div>
        <div><label style={labelStyle}>Tipo Atendimento Inicial</label><input className="form-control" value={origem.tipo_atendimento?.nome || '-'} readOnly style={fieldStyle} /></div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>Observações Atendimento Inicial</label>
        <textarea className="form-control" rows={4} value={origem.descricao_sumaria_atendimento || origem.observacoes || ''} readOnly style={fieldStyle} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div><label style={labelStyle}>Responsável Atendimento Inicial</label><input className="form-control" value={nomeUsuario(origem.tecnico_responsavel)} readOnly style={fieldStyle} /></div>
        <div><label style={labelStyle}>Função</label><input className="form-control" value={origem.funcao_tecnico_responsavel || '-'} readOnly style={fieldStyle} /></div>
      </div>
    </div>
  );
}
