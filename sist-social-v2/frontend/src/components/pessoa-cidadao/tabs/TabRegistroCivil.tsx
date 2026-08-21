import React from 'react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
  codigo?: string | number;
  cod_ibge?: number;
  municipio?: string;
  codigo_uf?: number;
}

interface TabRegistroCivilProps {
  tipoRegistroCivilId: string;
  setTipoRegistroCivilId: (val: string) => void;
  registrosCivis: TabelaBasicaItem[];
  certidao: string;
  setCertidao: (val: string) => void;
  certidaoNascimento: string;
  setCertidaoNascimento: (val: string) => void;
  rani: string;
  setRani: (val: string) => void;
  certidaoNumeroMatricula: string;
  setCertidaoNumeroMatricula: (val: string) => void;
  certidaoNomeCartorio: string;
  setCertidaoNomeCartorio: (val: string) => void;
  certidaoNumeroLivroRegistro: string;
  setCertidaoNumeroLivroRegistro: (val: string) => void;
  certidaoFolhaLivroRegistro: string;
  setCertidaoFolhaLivroRegistro: (val: string) => void;
  certidaoDataRegistro: string;
  setCertidaoDataRegistro: (val: string) => void;
  certidaoUfRegistroId: string;
  setCertidaoUfRegistroId: (val: string) => void;
  estados: TabelaBasicaItem[];
  certidaoMunicipioRegistroId: string;
  setCertidaoMunicipioRegistroId: (val: string) => void;
  municipios: TabelaBasicaItem[];
}

export const TabRegistroCivil: React.FC<TabRegistroCivilProps> = ({
  tipoRegistroCivilId,
  setTipoRegistroCivilId,
  registrosCivis,
  certidao,
  setCertidao,
  certidaoNascimento,
  setCertidaoNascimento,
  rani,
  setRani,
  certidaoNumeroMatricula,
  setCertidaoNumeroMatricula,
  certidaoNomeCartorio,
  setCertidaoNomeCartorio,
  certidaoNumeroLivroRegistro,
  setCertidaoNumeroLivroRegistro,
  certidaoFolhaLivroRegistro,
  setCertidaoFolhaLivroRegistro,
  certidaoDataRegistro,
  setCertidaoDataRegistro,
  certidaoUfRegistroId,
  setCertidaoUfRegistroId,
  estados,
  certidaoMunicipioRegistroId,
  setCertidaoMunicipioRegistroId,
  municipios
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Box 1: Dados do Registro Civil */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Informações de Registro Civil
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Registro Civil:</label>
            <select className="form-control" value={tipoRegistroCivilId} onChange={e => setTipoRegistroCivilId(e.target.value)}>
              <option value="">Selecione...</option>
              {registrosCivis.map(rc => <option key={rc.id} value={rc.id}>{rc.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Certidão:</label>
            <select className="form-control" value={certidao} onChange={e => setCertidao(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="Nascimento">Nascimento</option>
              <option value="Casamento">Casamento</option>
              <option value="RANI">RANI</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Nº Certidão:</label>
            <input type="text" className="form-control" value={certidaoNascimento} onChange={e => setCertidaoNascimento(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Termo RANI (Indígena):</label>
            <input type="text" className="form-control" value={rani} onChange={e => setRani(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Nº Matrícula Certidão:</label>
            <input type="text" className="form-control" value={certidaoNumeroMatricula} onChange={e => setCertidaoNumeroMatricula(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome do Cartório:</label>
            <input type="text" className="form-control" value={certidaoNomeCartorio} onChange={e => setCertidaoNomeCartorio(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} />
          </div>
        </div>
      </div>

      {/* Box 2: Livro e Localização do Cartório */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Livro e Localização do Registro
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Nº do Livro:</label>
            <input type="text" className="form-control" value={certidaoNumeroLivroRegistro} onChange={e => setCertidaoNumeroLivroRegistro(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Folha do Livro:</label>
            <input type="text" className="form-control" value={certidaoFolhaLivroRegistro} onChange={e => setCertidaoFolhaLivroRegistro(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Data Registro Certidão:</label>
            <input type="date" className="form-control" value={certidaoDataRegistro} onChange={e => setCertidaoDataRegistro(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>UF do Registro:</label>
            <select className="form-control" value={certidaoUfRegistroId} onChange={e => setCertidaoUfRegistroId(e.target.value)}>
              <option value="">Selecione...</option>
              {estados.map(est => <option key={est.id} value={est.id}>{est.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Município do Registro:</label>
            <select className="form-control" value={certidaoMunicipioRegistroId} onChange={e => setCertidaoMunicipioRegistroId(e.target.value)}>
              <option value="">Selecione...</option>
              {(() => {
                const selectedCodIbge = estados.find(e => e.id.toString() === certidaoUfRegistroId)?.cod_ibge;
                return municipios
                  .filter(m => !certidaoUfRegistroId || m.codigo_uf === selectedCodIbge)
                  .map(mun => <option key={mun.id} value={mun.id}>{mun.municipio}</option>);
              })()}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
