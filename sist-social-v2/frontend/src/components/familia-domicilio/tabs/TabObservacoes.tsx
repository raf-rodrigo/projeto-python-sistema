import React from 'react';

interface TabObservacoesProps {
  observacoes: string;
  setObservacoes: (val: string) => void;
}

export const TabObservacoes: React.FC<TabObservacoesProps> = ({
  observacoes,
  setObservacoes
}) => {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px' }}>
      <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
        Observações Gerais da Família
      </h4>
      <p style={{ margin: '0 0 12px 0', fontSize: '12px', color: '#64748b' }}>
        Utilize este espaço para registrar anotações gerais sobre o histórico familiar, ocorrências especiais ou informações adicionais não contempladas nas abas estruturadas.
      </p>
      <div>
        <textarea
          className="form-control"
          rows={10}
          value={observacoes}
          onChange={e => setObservacoes(e.target.value)}
          placeholder="Digite aqui as observações gerais sobre a família..."
          style={{ width: '100%', resize: 'vertical', fontFamily: 'inherit', fontSize: '13px', padding: '12px' }}
        />
      </div>
    </div>
  );
};
