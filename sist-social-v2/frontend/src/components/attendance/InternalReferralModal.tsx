import type { FormEvent } from 'react';
import type { Pessoa, Profissional, UnidadeResumo } from './AttendanceManagementTypes';

interface InternalReferralModalProps {
  open: boolean;
  familyLabel: string;
  recordLabel: string;
  person?: Pessoa;
  reason: string;
  date: string;
  professionalId: string;
  professionals: Profissional[];
  units: UnidadeResumo[];
  error: string;
  saving: boolean;
  onReasonChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onProfessionalChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}

export default function InternalReferralModal(props: InternalReferralModalProps) {
  if (!props.open) return null;

  const selectedProfessional = props.professionals.find(item => item.id.toString() === props.professionalId);
  const professionalUnits = (selectedProfessional?.perfil?.unidades || [])
    .map(unitId => props.units.find(unit => unit.id === unitId)?.nome_conhecido)
    .filter(Boolean);
  const unitLabel = professionalUnits.join(', ') || 'Sem unidade de trabalho vinculada';

  const professionalLabel = (professional: Profissional) => {
    const name = [professional.first_name, professional.last_name].filter(Boolean).join(' ') || professional.username;
    const unitNames = (professional.perfil?.unidades || [])
      .map(unitId => props.units.find(unit => unit.id === unitId)?.nome_conhecido)
      .filter(Boolean);
    return `${name} — ${unitNames.join(', ') || 'Sem unidade vinculada'}`;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2100, padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '820px', maxHeight: 'calc(100vh - 40px)', borderRadius: '14px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#334155' }}>Encaminhamento Interno</h3>
          <button type="button" onClick={props.onClose} style={{ border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#64748b' }}>&times;</button>
        </div>

        <form onSubmit={props.onSubmit} style={{ overflowY: 'auto', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {props.error && <div style={{ padding: '10px 12px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: '8px', fontSize: '13px' }}>{props.error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Família</label><input className="form-control" value={props.familyLabel || 'Sem vínculo'} readOnly style={{ backgroundColor: '#f1f5f9' }} /></div>
            <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Prontuário</label><input className="form-control" value={props.recordLabel || 'Nenhum'} readOnly style={{ backgroundColor: '#f1f5f9' }} /></div>
          </div>

          <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Pessoa</label><input className="form-control" value={props.person?.nome || 'Munícipe não identificado'} readOnly style={{ backgroundColor: '#f1f5f9' }} /></div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Motivo do Encaminhamento *</label>
            <textarea className="form-control" rows={4} value={props.reason} onChange={event => props.onReasonChange(event.target.value)} required />
            <div style={{ fontSize: '11px', marginTop: '4px', color: props.reason.trim().length >= 21 ? '#059669' : '#64748b' }}>
              {props.reason.trim().length >= 21 ? 'Quantidade mínima atendida.' : `Insira no mínimo ${21 - props.reason.trim().length} caracteres.`}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '16px' }}>
            <div><label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Data *</label><input type="date" className="form-control" value={props.date} onChange={event => props.onDateChange(event.target.value)} required /></div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>Profissional de destino *</label>
              <select className="form-control" value={props.professionalId} onChange={event => props.onProfessionalChange(event.target.value)} required>
                <option value="">Selecione o técnico e sua unidade</option>
                {props.professionals.map(professional => <option key={professional.id} value={professional.id}>{professionalLabel(professional)}</option>)}
              </select>
            </div>
          </div>

          {selectedProfessional && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#eff6ff' }}>
              <div><label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Técnico selecionado</label><div style={{ fontWeight: 600, color: '#1e3a8a' }}>{[selectedProfessional.first_name, selectedProfessional.last_name].filter(Boolean).join(' ') || selectedProfessional.username}</div></div>
              <div><label style={{ fontSize: '11px', fontWeight: 600, color: '#475569' }}>Unidade de trabalho</label><div style={{ fontWeight: 600, color: '#1e3a8a' }}>{unitLabel}</div></div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '14px', borderTop: '1px solid #e2e8f0' }}>
            <button type="button" onClick={props.onClose} style={{ padding: '9px 16px', border: '1px solid #cbd5e1', borderRadius: '7px', backgroundColor: '#ffffff', cursor: 'pointer' }}>Voltar</button>
            <button type="submit" disabled={props.saving} className="btn-primary-action">{props.saving ? 'Encaminhando...' : 'Encaminhar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
