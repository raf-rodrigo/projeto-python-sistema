import React from 'react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
}

interface TabDocumentacaoProps {
  cpf: string;
  setCpf: (val: string) => void;
  rg: string;
  setRg: (val: string) => void;
  rgDigito: string;
  setRgDigito: (val: string) => void;
  rgOrgaoEmissor: string;
  setRgOrgaoEmissor: (val: string) => void;
  rgUfId: string;
  setRgUfId: (val: string) => void;
  estados: TabelaBasicaItem[];
  rgDataEmissao: string;
  setRgDataEmissao: (val: string) => void;
  sus: string;
  setSus: (val: string) => void;
  cnh: string;
  setCnh: (val: string) => void;
  reservista: string;
  setReservista: (val: string) => void;
  rne: string;
  setRne: (val: string) => void;
  ctps: string;
  setCtps: (val: string) => void;
  ctpsSerie: string;
  setCtpsSerie: (val: string) => void;
  tituloEleitor: string;
  setTituloEleitor: (val: string) => void;
  tituloEleitorZona: string;
  setTituloEleitorZona: (val: string) => void;
  tituloEleitorSecao: string;
  setTituloEleitorSecao: (val: string) => void;
}

export const TabDocumentacao: React.FC<TabDocumentacaoProps> = ({
  cpf,
  setCpf,
  rg,
  setRg,
  rgDigito,
  setRgDigito,
  rgOrgaoEmissor,
  setRgOrgaoEmissor,
  rgUfId,
  setRgUfId,
  estados,
  rgDataEmissao,
  setRgDataEmissao,
  sus,
  setSus,
  cnh,
  setCnh,
  reservista,
  setReservista,
  rne,
  setRne,
  ctps,
  setCtps,
  ctpsSerie,
  setCtpsSerie,
  tituloEleitor,
  setTituloEleitor,
  tituloEleitorZona,
  setTituloEleitorZona,
  tituloEleitorSecao,
  setTituloEleitorSecao
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Box 1: Documentos Principais */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Documentos Básicos (CPF e RG)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>CPF: *</label>
            <input type="text" id="input-cpf" className="form-control" value={cpf} onChange={e => setCpf(e.target.value)} maxLength={11} placeholder="Apenas números" required />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>RG / Identidade:</label>
            <input type="text" className="form-control" value={rg} onChange={e => setRg(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Dígito RG:</label>
            <input type="text" className="form-control" value={rgDigito} onChange={e => setRgDigito(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Órgão Emissor RG:</label>
            <input type="text" className="form-control" value={rgOrgaoEmissor} onChange={e => setRgOrgaoEmissor(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>UF Emissão RG:</label>
            <select className="form-control" value={rgUfId} onChange={e => setRgUfId(e.target.value)}>
              <option value="">Selecione...</option>
              {estados.map(est => <option key={est.id} value={est.id}>{est.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Data Emissão RG:</label>
            <input type="date" className="form-control" value={rgDataEmissao} onChange={e => setRgDataEmissao(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Box 2: Trabalho, Outros Documentos e Eleitor */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Outros Documentos
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Cartão SUS:</label>
            <input type="text" className="form-control" value={sus} onChange={e => setSus(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>CNH:</label>
            <input type="text" className="form-control" value={cnh} onChange={e => setCnh(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Reservista (Masc):</label>
            <input type="text" className="form-control" value={reservista} onChange={e => setReservista(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>RNE (Estrangeiro):</label>
            <input type="text" className="form-control" value={rne} onChange={e => setRne(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>CTPS (Carteira de Trabalho):</label>
            <input type="text" className="form-control" value={ctps} onChange={e => setCtps(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Série CTPS:</label>
            <input type="text" className="form-control" value={ctpsSerie} onChange={e => setCtpsSerie(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Título Eleitor:</label>
            <input type="text" className="form-control" value={tituloEleitor} onChange={e => setTituloEleitor(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Zona Eleitoral:</label>
            <input type="text" className="form-control" value={tituloEleitorZona} onChange={e => setTituloEleitorZona(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Seção Eleitoral:</label>
            <input type="text" className="form-control" value={tituloEleitorSecao} onChange={e => setTituloEleitorSecao(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};
