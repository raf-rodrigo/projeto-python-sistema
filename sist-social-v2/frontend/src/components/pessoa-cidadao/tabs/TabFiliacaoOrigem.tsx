import React from 'react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
  codigo?: string | number;
  cod_ibge?: number;
  municipio?: string;
  codigo_uf?: number;
}

interface TabFiliacaoOrigemProps {
  nomeMae: string;
  setNomeMae: (val: string) => void;
  nomePai: string;
  setNomePai: (val: string) => void;
  tipoLocalNascimento: string;
  setTipoLocalNascimento: (val: string) => void;
  locaisNascimento: TabelaBasicaItem[];
  estadoId: string;
  setEstadoId: (val: string) => void;
  estados: TabelaBasicaItem[];
  municipioId: string;
  setMunicipioId: (val: string) => void;
  municipios: TabelaBasicaItem[];
}

export const TabFiliacaoOrigem: React.FC<TabFiliacaoOrigemProps> = ({
  nomeMae,
  setNomeMae,
  nomePai,
  setNomePai,
  tipoLocalNascimento,
  setTipoLocalNascimento,
  locaisNascimento,
  estadoId,
  setEstadoId,
  estados,
  municipioId,
  setMunicipioId,
  municipios
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Completo da Mãe</label>
        <input type="text" className="form-control" value={nomeMae} onChange={e => setNomeMae(e.target.value)} />
      </div>
      <div>
        <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Completo do Pai</label>
        <input type="text" className="form-control" value={nomePai} onChange={e => setNomePai(e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Local de Nascimento (Especie)</label>
          <select className="form-control" value={tipoLocalNascimento} onChange={e => setTipoLocalNascimento(e.target.value)}>
            <option value="">Selecione...</option>
            {locaisNascimento.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Estado (UF)</label>
          <select className="form-control" value={estadoId} onChange={e => setEstadoId(e.target.value)}>
            <option value="">Selecione...</option>
            {estados.map(est => <option key={est.id} value={est.id}>{est.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Município de Nascimento</label>
          <select className="form-control" value={municipioId} onChange={e => setMunicipioId(e.target.value)}>
            <option value="">Selecione...</option>
            {(() => {
              const selectedCodIbge = estados.find(e => e.id.toString() === estadoId)?.cod_ibge;
              return municipios
                .filter(m => !estadoId || m.codigo_uf === selectedCodIbge)
                .map(mun => <option key={mun.id} value={mun.id}>{mun.municipio}</option>);
            })()}
          </select>
        </div>
      </div>
    </div>
  );
};
