import React from 'react';

interface TabHistoricoTransferenciaProps {
  localTransferencias: any[];
}

export const TabHistoricoTransferencia: React.FC<TabHistoricoTransferenciaProps> = ({
  localTransferencias
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Controles de Registros e Pesquisa */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
          <select className="form-control" style={{ width: '70px', padding: '4px 8px' }} defaultValue="10">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>resultados por página</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
          <span>Pesquisar</span>
          <input type="text" className="form-control" style={{ width: '200px', padding: '6px 12px' }} />
        </div>
      </div>

      {/* Tabela do Histórico */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Unidade antiga</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Unidade atualizada</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Responsável</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Data da alteração</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Justificativa</th>
            </tr>
          </thead>
          <tbody>
            {localTransferencias.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#ffffff' }}>
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              localTransferencias.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{t.unidade_anterior_nome}</td>
                  <td style={{ padding: '12px 16px', color: '#334155' }}>{t.unidade_nova_nome}</td>
                  <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>{t.operador_nome}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>
                    {new Date(t.data_transferencia).toLocaleString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569', maxWidth: '300px', wordBreak: 'break-all' }}>{t.justificativa}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação do Histórico */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
        <span>Mostrando {localTransferencias.length > 0 ? 1 : 0} até {localTransferencias.length} de {localTransferencias.length} registros</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button type="button" className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px', cursor: 'not-allowed' }} disabled>Anterior</button>
          <button type="button" className="btn-secondary" style={{ padding: '4px 12px', fontSize: '12px', cursor: 'not-allowed' }} disabled>Próximo</button>
        </div>
      </div>

    </div>
  );
};
