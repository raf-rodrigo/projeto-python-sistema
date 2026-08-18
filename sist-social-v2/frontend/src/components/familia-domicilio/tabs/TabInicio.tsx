import React from 'react';
import SearchableSelect from '../../SearchableSelect';

interface TabInicioProps {
  editandoId: number | null;
  unidades: any[];
  origensCadastro: any[];
  tipoUnidadeAtendimentoId: string;
  origemCadastroId: string;
  dataCadastro: string;
  codigoCadUnico: string;
  dataUltAtualizacao: string;
  unidadeCadastroLabel: string;
  responsavelCadastroLabel: string;
  familias: any[];
  
  // Setters
  setTipoUnidadeAtendimentoId: (val: string) => void;
  setOrigemCadastroId: (val: string) => void;
  setDataCadastro: (val: string) => void;
  setCodigoCadUnico: (val: string) => void;
  
  // Ações
  setUnidadeOrigemNomeExibicao: (val: string) => void;
  setUnidadeDestinoPendente: (val: string) => void;
  setJustificativaTransferencia: (val: string) => void;
  setTransferenciaModalAberto: (val: boolean) => void;
}

export const TabInicio: React.FC<TabInicioProps> = ({
  editandoId,
  unidades,
  origensCadastro,
  tipoUnidadeAtendimentoId,
  origemCadastroId,
  dataCadastro,
  codigoCadUnico,
  dataUltAtualizacao,
  unidadeCadastroLabel,
  responsavelCadastroLabel,
  familias,
  setTipoUnidadeAtendimentoId,
  setOrigemCadastroId,
  setDataCadastro,
  setCodigoCadUnico,
  setUnidadeOrigemNomeExibicao,
  setUnidadeDestinoPendente,
  setJustificativaTransferencia,
  setTransferenciaModalAberto
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
      
      {/* Coluna 1: Campos do Cadastro */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Número do NIS (Responsável)*:</label>
          <input 
            type="text" 
            className="form-control" 
            value={codigoCadUnico} 
            onChange={e => setCodigoCadUnico(e.target.value)} 
            placeholder="Digite o NIS ou NIS do Responsável..." 
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Data Cadastro: *</label>
          <input 
            type="date" 
            className="form-control" 
            value={dataCadastro} 
            onChange={e => setDataCadastro(e.target.value)} 
            required 
            disabled={!!editandoId}
            style={editandoId ? { backgroundColor: '#f1f5f9', color: '#64748b' } : {}}
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Data de Última Atualização do Cadastro:</label>
          <input 
            type="date" 
            className="form-control" 
            value={dataUltAtualizacao ? dataUltAtualizacao.split('T')[0] : ''} 
            disabled 
            style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} 
          />
        </div>
      </div>

      {/* Coluna 2: Dados do Profissional e Unidade */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Unidade Cadastro:</label>
          <input 
            type="text" 
            className="form-control" 
            value={unidadeCadastroLabel} 
            disabled 
            style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} 
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Responsável pelo Cadastro:</label>
          <input 
            type="text" 
            className="form-control" 
            value={responsavelCadastroLabel} 
            disabled 
            style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} 
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Origem Cadastro:</label>
          <input 
            type="text" 
            className="form-control" 
            value={
              origensCadastro.find(o => o.id.toString() === origemCadastroId.toString())?.nome || 
              (origemCadastroId ? 'Carregando...' : 'Espontâneo')
            } 
            disabled 
            style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} 
          />
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Unidade de Atendimento da Família: *</label>
          <SearchableSelect 
            options={unidades.map(u => ({ id: u.id, label: u.nome_conhecido }))} 
            value={tipoUnidadeAtendimentoId} 
            onChange={val => {
              const novaId = val.toString();
              if (editandoId) {
                const familiaOriginal = familias.find(f => f.id === editandoId);
                const unidadeOriginalId = familiaOriginal?.unidade_atendimento_social_familia?.toString() || '';
                
                if (unidadeOriginalId && unidadeOriginalId !== novaId) {
                  const origNome = unidades.find(u => u.id.toString() === unidadeOriginalId)?.nome_conhecido || 'Unidade Geral';
                  setUnidadeOrigemNomeExibicao(origNome);
                  setUnidadeDestinoPendente(novaId);
                  setJustificativaTransferencia('');
                  setTransferenciaModalAberto(true);
                  return;
                }
              }
              setTipoUnidadeAtendimentoId(novaId);
            }} 
            placeholder="Selecione a Unidade..." 
            required 
          />
        </div>
      </div>

    </div>
  );
};
