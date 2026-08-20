import React, { useEffect, useState } from 'react';

interface BeneficioItem {
  id: number;
  tipo_beneficio: number;
  tipo_beneficio_details?: { id: number; nome: string };
  pessoa?: number | null;
  pessoa_nome?: string;
  data_beneficio: string;
  valor_beneficio: string;
  status: string;
  observacao?: string;
}

interface TabBeneficiosProps {
  editandoId: number;
  API_URL: string;
  token: string | null;
}

export const TabBeneficios: React.FC<TabBeneficiosProps> = ({
  editandoId,
  API_URL,
  token
}) => {
  const [beneficios, setBeneficios] = useState<BeneficioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pesquisa, setPesquisa] = useState('');
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [paginaAtual, setPaginaAtual] = useState(1);

  const buscarBeneficios = async () => {
    try {
      const res = await fetch(`${API_URL}/api/beneficios/?familia=${editandoId}`, {
        headers: { 'Authorization': `Token ${token}` }
      });
      if (res.ok) {
        const dados = await res.json();
        setBeneficios(dados.results || dados || []);
      }
    } catch (err) {
      console.error('Erro ao buscar benefícios:', err);
    }
  };

  useEffect(() => {
    const inicializar = async () => {
      setLoading(true);
      await buscarBeneficios();
      setLoading(false);
    };
    if (editandoId) {
      inicializar();
    }
  }, [editandoId, API_URL, token]);

  // Filtro de pesquisa
  const beneficiosFiltrados = beneficios.filter(b => {
    const termo = pesquisa.toLowerCase();
    return (
      (b.tipo_beneficio_details?.nome && b.tipo_beneficio_details.nome.toLowerCase().includes(termo)) ||
      (b.pessoa_nome && b.pessoa_nome.toLowerCase().includes(termo)) ||
      (b.observacao && b.observacao.toLowerCase().includes(termo))
    );
  });

  // Paginação
  const totalRegistros = beneficiosFiltrados.length;
  const paginasTotais = Math.ceil(totalRegistros / itensPorPagina) || 1;
  const indiceInicio = (paginaAtual - 1) * itensPorPagina;
  const beneficiosPaginados = beneficiosFiltrados.slice(indiceInicio, indiceInicio + itensPorPagina);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Carregando dados...</div>;
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
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Benefício</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Beneficiário</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Valor</th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#475569' }}>Observação</th>
            </tr>
          </thead>
          <tbody>
            {beneficiosPaginados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#64748b', backgroundColor: '#ffffff' }}>
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              beneficiosPaginados.map(b => {
                const dataFormatada = b.data_beneficio 
                  ? new Date(b.data_beneficio).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) 
                  : 'N/A';
                
                return (
                  <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{dataFormatada}</td>
                    <td style={{ padding: '12px 16px', color: '#1e3a8a', fontWeight: 600 }}>{b.tipo_beneficio_details?.nome || 'Não Informado'}</td>
                    <td style={{ padding: '12px 16px', color: '#475569', fontWeight: 500 }}>{b.pessoa_nome || 'Família Geral'}</td>
                    <td style={{ padding: '12px 16px', color: '#334155', fontWeight: 500 }}>
                      {parseFloat(b.valor_beneficio) > 0 
                        ? `R$ ${parseFloat(b.valor_beneficio).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` 
                        : 'Sem Custo'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{b.observacao || 'N/A'}</td>
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
