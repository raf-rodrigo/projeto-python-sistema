import React, { useEffect, useState } from 'react';

interface AtendimentoItem {
  id: number;
  codigo_atendimento: string;
  modalidade: string;
  status: string;
  data_atendimento: string;
  pessoa_nome: string;
  tecnico_responsavel_inicial_nome?: string;
  tecnico_responsavel_tecnico_nome?: string;
  descricao_sumaria_atendimento: string;
  observacoes?: string;
}

interface TabHistoricoAtendimentoProps {
  editandoId: number;
  API_URL: string;
  token: string | null;
}

export const TabHistoricoAtendimento: React.FC<TabHistoricoAtendimentoProps> = ({
  editandoId,
  API_URL,
  token
}) => {
  const [atendimentos, setAtendimentos] = useState<AtendimentoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState('');
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [paginaAtual, setPaginaAtual] = useState(1);

  useEffect(() => {
    const buscarAtendimentos = async () => {
      try {
        const res = await fetch(`${API_URL}/api/atendimentos_sociais/?familia=${editandoId}`, {
          headers: { 'Authorization': `Token ${token}` }
        });
        if (res.ok) {
          const dados = await res.json();
          setAtendimentos(dados.results || dados || []);
        }
      } catch (err) {
        console.error('Erro ao buscar histórico de atendimentos:', err);
      } finally {
        setLoading(false);
      }
    };

    if (editandoId) {
      buscarAtendimentos();
    }
  }, [editandoId, API_URL, token]);

  // Filtro de pesquisa
  const atendimentosFiltrados = atendimentos.filter(atend => {
    const termo = pesquisa.toLowerCase();
    return (
      (atend.pessoa_nome && atend.pessoa_nome.toLowerCase().includes(termo)) ||
      (atend.modalidade && atend.modalidade.toLowerCase().includes(termo)) ||
      (atend.descricao_sumaria_atendimento && atend.descricao_sumaria_atendimento.toLowerCase().includes(termo)) ||
      (atend.status && atend.status.toLowerCase().includes(termo))
    );
  });

  // Paginação
  const totalRegistros = atendimentosFiltrados.length;
  const paginasTotais = Math.ceil(totalRegistros / itensPorPagina) || 1;
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const atendimentosPaginados = atendimentosFiltrados.slice(indiceInicio, indiceInicio + itensPorPagina);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Carregando histórico...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Controles de Registros e Pesquisa */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
          <select 
            className="form-control" 
            style={{ width: '70px', padding: '4px 8px' }} 
            value={itensPorPagina} 
            onChange={e => {
              setItensPorPagina(parseInt(e.target.value));
              setPaginaAtual(1);
            }}
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <span>resultados por página</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
          <span>Pesquisar</span>
          <input 
            type="text" 
            className="form-control" 
            style={{ width: '200px', padding: '6px 12px' }} 
            value={pesquisa} 
            onChange={e => {
              setPesquisa(e.target.value);
              setPaginaAtual(1);
            }} 
          />
        </div>
      </div>

      {/* Tabela do Histórico */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Data</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Modalidade</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Munícipe Atendido</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Técnico Responsável</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Descrição / Resumo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {atendimentosPaginados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#ffffff' }}>
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              atendimentosPaginados.map(atend => {
                const dataFormatada = atend.data_atendimento 
                  ? new Date(atend.data_atendimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                  : 'N/A';
                
                const tecnico = atend.tecnico_responsavel_inicial_nome || atend.tecnico_responsavel_tecnico_nome || 'N/A';

                return (
                  <tr key={atend.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>{dataFormatada}</td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: atend.modalidade === 'Tecnico' ? '#fee2e2' : '#e0f2fe',
                        color: atend.modalidade === 'Tecnico' ? '#dc2626' : '#0369a1'
                      }}>
                        {atend.modalidade}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 600 }}>{atend.pessoa_nome || 'Não Informado'}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{tecnico}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={atend.descricao_sumaria_atendimento}>
                      {atend.descricao_sumaria_atendimento}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: atend.status === 'Finalizado' ? '#dcfce7' : '#fef9c3',
                        color: atend.status === 'Finalizado' ? '#16a34a' : '#ca8a04'
                      }}>
                        {atend.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação do Histórico */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b', marginTop: '8px' }}>
        <span>Mostrando {totalRegistros > 0 ? indiceInicio + 1 : 0} até {Math.min(indiceInicio + itensPorPagina, totalRegistros)} de {totalRegistros} registros</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            style={{ padding: '4px 12px', fontSize: '12px', cursor: paginaAtual === 1 ? 'not-allowed' : 'pointer' }} 
            disabled={paginaAtual === 1}
            onClick={() => setPaginaAtual(prev => prev - 1)}
          >
            Anterior
          </button>
          <button 
            type="button" 
            className="btn-secondary" 
            style={{ padding: '4px 12px', fontSize: '12px', cursor: paginaAtual === paginasTotais ? 'not-allowed' : 'pointer' }} 
            disabled={paginaAtual === paginasTotais}
            onClick={() => setPaginaAtual(prev => prev + 1)}
          >
            Próximo
          </button>
        </div>
      </div>

    </div>
  );
};
