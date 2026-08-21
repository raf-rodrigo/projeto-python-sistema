import React from 'react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
  familia_codigo?: string;
}

interface TabDadosPessoaisProps {
  familiaDomicilio: string;
  setFamiliaDomicilio: (val: string) => void;
  lockFamiliaSelect: boolean;
  familias: TabelaBasicaItem[];
  nome: string;
  setNome: (val: string) => void;
  nomeSocial: string;
  setNomeSocial: (val: string) => void;
  nis: string;
  setNis: (val: string) => void;
  certidaoNascimentoData: string;
  setCertidaoNascimentoData: (val: string) => void;
  sexo: 'Masc' | 'Fem';
  setSexo: (val: 'Masc' | 'Fem') => void;
  raca: string;
  setRaca: (val: string) => void;
  orientacaoSexual: string;
  setOrientacaoSexual: (val: string) => void;
  orientacoesSexuais: TabelaBasicaItem[];
  racas: TabelaBasicaItem[];
  tipoEstadoCivil: string;
  setTipoEstadoCivil: (val: string) => void;
  estadosCivis: TabelaBasicaItem[];
  tipoParentesco: string;
  setTipoParentesco: (val: string) => void;
  parentescos: TabelaBasicaItem[];
  situacaoDeRua: 'Padrao' | 'Rua' | 'Migrante' | 'Ambos';
  setSituacaoDeRua: (val: 'Padrao' | 'Rua' | 'Migrante' | 'Ambos') => void;
  
  // Contatos (Se Não rua)
  telefone: string;
  setTelefone: (val: string) => void;
  celular: string;
  setCelular: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;

}

export const TabDadosPessoais: React.FC<TabDadosPessoaisProps> = ({
  familiaDomicilio,
  setFamiliaDomicilio,
  lockFamiliaSelect,
  familias,
  nome,
  setNome,
  nomeSocial,
  setNomeSocial,
  nis,
  setNis,
  certidaoNascimentoData,
  setCertidaoNascimentoData,
  sexo,
  setSexo,
  raca,
  setRaca,
  orientacaoSexual,
  setOrientacaoSexual,
  orientacoesSexuais,
  racas,
  tipoEstadoCivil,
  setTipoEstadoCivil,
  estadosCivis,
  tipoParentesco,
  setTipoParentesco,
  parentescos,
  situacaoDeRua,
  setSituacaoDeRua,
  telefone,
  setTelefone,
  celular,
  setCelular,
  email,
  setEmail
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Box 1: Perfil Cadastral e Identificação */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Identificação e Perfil
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Situação Atual:</label>
            <select className="form-control" value={situacaoDeRua} onChange={e => setSituacaoDeRua(e.target.value as any)}>
              <option value="Padrao">Padrão</option>
              <option value="Rua">Situação de Rua</option>
              <option value="Migrante">Migrante</option>
              <option value="Ambos">Situação de Rua e Migrante</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Família:</label>
            <select className="form-control" value={familiaDomicilio} onChange={e => setFamiliaDomicilio(e.target.value)} disabled={lockFamiliaSelect}>
              <option value="">Selecione...</option>
              {familias.map(f => (
                <option key={f.id} value={f.id}>
                  {f.familia_codigo || `FAM-${f.id}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Completo: *</label>
            <input type="text" id="input-nome" className="form-control" value={nome} onChange={e => setNome(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Social:</label>
            <input type="text" className="form-control" value={nomeSocial} onChange={e => setNomeSocial(e.target.value.toUpperCase())} style={{ textTransform: 'uppercase' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>NIS:</label>
            <input type="text" className="form-control" value={nis} onChange={e => setNis(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Data de Nascimento: *</label>
            <input type="date" id="input-nascimento" className="form-control" value={certidaoNascimentoData} onChange={e => setCertidaoNascimentoData(e.target.value)} required />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Sexo: *</label>
            <select className="form-control" value={sexo} onChange={e => setSexo(e.target.value as any)} required>
              <option value="Fem">Feminino</option>
              <option value="Masc">Masculino</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Raça/Cor:</label>
            <select className="form-control" value={raca} onChange={e => setRaca(e.target.value)}>
              <option value="">Selecione...</option>
              {racas.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Orientação Sexual:</label>
            <select className="form-control" value={orientacaoSexual} onChange={e => setOrientacaoSexual(e.target.value)}>
              <option value="">Selecione...</option>
              {orientacoesSexuais.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Estado Civil:</label>
            <select className="form-control" value={tipoEstadoCivil} onChange={e => setTipoEstadoCivil(e.target.value)}>
              <option value="">Selecione...</option>
              {estadosCivis.map(ec => <option key={ec.id} value={ec.id}>{ec.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Parentesco:</label>
            <select className="form-control" value={tipoParentesco} onChange={e => setTipoParentesco(e.target.value)}>
              <option value="">Selecione...</option>
              {parentescos.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Contatos / Sub-Abas Rua */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Meios de Contato
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Telefone:</label>
            <input type="text" className="form-control" value={telefone} onChange={e => setTelefone(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Celular:</label>
            <input type="text" className="form-control" value={celular} onChange={e => setCelular(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>E-mail:</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};
