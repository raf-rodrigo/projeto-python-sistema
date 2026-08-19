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
  paises: TabelaBasicaItem[];
  paisId: string;
  setPaisId: (val: string) => void;
  idCidadePadrao: string;
  idEstadoPadrao: string;
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
  municipios,
  paises,
  paisId,
  setPaisId,
  idCidadePadrao,
  idEstadoPadrao
}) => {
  React.useEffect(() => {
    if (tipoLocalNascimento?.toString() === '1') { // Neste município
      setEstadoId(idEstadoPadrao?.toString() || '');
      setMunicipioId(idCidadePadrao?.toString() || '');
      setPaisId('1'); // Brasil
    } else if (tipoLocalNascimento?.toString() === '3') { // Em outro país
      setEstadoId('');
      setMunicipioId('');
    } else {
      setPaisId('1'); // Brasil
    }
  }, [tipoLocalNascimento, idCidadePadrao, idEstadoPadrao, setEstadoId, setMunicipioId, setPaisId]);

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
          <select className="form-control" value={tipoLocalNascimento?.toString() || ''} onChange={e => setTipoLocalNascimento(e.target.value)}>
            <option value="">Selecione...</option>
            {locaisNascimento.map(l => <option key={l.id} value={l.id.toString()}>{l.nome}</option>)}
          </select>
        </div>

        {tipoLocalNascimento?.toString() === '3' ? (
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>País onde nasceu</label>
            <select className="form-control" value={paisId?.toString() || ''} onChange={e => setPaisId(e.target.value)}>
              <option value="">Selecione...</option>
              {paises.map(p => <option key={p.id} value={p.id.toString()}>{p.nome}</option>)}
            </select>
          </div>
        ) : (
          <>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Estado (UF)</label>
              <select 
                className="form-control" 
                value={estadoId?.toString() || ''} 
                onChange={e => setEstadoId(e.target.value)}
                disabled={tipoLocalNascimento?.toString() === '1'}
              >
                <option value="">Selecione...</option>
                {estados.map(est => <option key={est.id} value={est.id.toString()}>{est.nome}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Município de Nascimento</label>
              <select 
                className="form-control" 
                value={municipioId?.toString() || ''} 
                onChange={e => setMunicipioId(e.target.value)}
                disabled={tipoLocalNascimento?.toString() === '1'}
              >
                <option value="">Selecione...</option>
                {(() => {
                  const selectedCodIbge = estados.find(e => e.id.toString() === estadoId?.toString())?.cod_ibge;
                  const list = municipios.filter(m => !estadoId || m.codigo_uf === selectedCodIbge);
                  if (tipoLocalNascimento?.toString() === '1' && !list.some(m => m.id.toString() === idCidadePadrao?.toString())) {
                    const defaultMun = municipios.find(m => m.id.toString() === idCidadePadrao?.toString());
                    if (defaultMun) list.push(defaultMun);
                  }
                  return list.map(mun => <option key={mun.id} value={mun.id.toString()}>{mun.municipio}</option>);
                })()}
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
