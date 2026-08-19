import React from 'react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
}

interface TabSaudeEducacaoProps {
  portadorDoencaGrave: 'Sim' | 'Não';
  setPortadorDoencaGrave: (val: 'Sim' | 'Não') => void;
  tipoDeficienciaId: string;
  setTipoDeficienciaId: (val: string) => void;
  deficiencias: TabelaBasicaItem[];
  tipoNecessitaCuidadosId: string;
  setTipoNecessitaCuidadosId: (val: string) => void;
  necessidadesCuidados: TabelaBasicaItem[];
  usaMedicamentoControlado: 'Sim' | 'Não';
  setUsaMedicamentoControlado: (val: 'Sim' | 'Não') => void;
  medicamentoContinuo: 'Sim' | 'Não';
  setMedicamentoContinuo: (val: 'Sim' | 'Não') => void;
  usaAlcool: 'Sim' | 'Não';
  setUsaAlcool: (val: 'Sim' | 'Não') => void;
  usaDroga: 'Sim' | 'Não';
  setUsaDroga: (val: 'Sim' | 'Não') => void;
  transtornoMental: 'Sim' | 'Não';
  setTranstornoMental: (val: 'Sim' | 'Não') => void;
  tratamentoSaude: 'Sim' | 'Não';
  setTratamentoSaude: (val: 'Sim' | 'Não') => void;
  tipoTratamentoCapsId: string;
  setTipoTratamentoCapsId: (val: string) => void;
  tratamentosCaps: TabelaBasicaItem[];

  // Educação
  escreveLe: 'Sim' | 'Não';
  setEscreveLe: (val: 'Sim' | 'Não') => void;
  nomeEscola: string;
  setNomeEscola: (val: string) => void;
  codigoInepMec: string;
  setCodigoInepMec: (val: string) => void;
  tipoCursoFrequentaId: string;
  setTipoCursoFrequentaId: (val: string) => void;
  cursos: TabelaBasicaItem[];
  nomeCursoFrequenta: string;
  setNomeCursoFrequenta: (val: string) => void;
  tipoSerieCursoFrequentaId: string;
  setTipoSerieCursoFrequentaId: (val: string) => void;
  series: TabelaBasicaItem[];
  tipoCursoFrequentouId: string;
  setTipoCursoFrequentouId: (val: string) => void;
  cursoConcluido: 'Sim' | 'Não';
  setCursoConcluido: (val: 'Sim' | 'Não') => void;
  tipoSerieCursoConcluidoId: string;
  setTipoSerieCursoConcluidoId: (val: string) => void;
}

export const TabSaudeEducacao: React.FC<TabSaudeEducacaoProps> = ({
  portadorDoencaGrave,
  setPortadorDoencaGrave,
  tipoDeficienciaId,
  setTipoDeficienciaId,
  deficiencias,
  tipoNecessitaCuidadosId,
  setTipoNecessitaCuidadosId,
  necessidadesCuidados,
  usaMedicamentoControlado,
  setUsaMedicamentoControlado,
  medicamentoContinuo,
  setMedicamentoContinuo,
  usaAlcool,
  setUsaAlcool,
  usaDroga,
  setUsaDroga,
  transtornoMental,
  setTranstornoMental,
  tratamentoSaude,
  setTratamentoSaude,
  tipoTratamentoCapsId,
  setTipoTratamentoCapsId,
  tratamentosCaps,
  escreveLe,
  setEscreveLe,
  nomeEscola,
  setNomeEscola,
  codigoInepMec,
  setCodigoInepMec,
  tipoCursoFrequentaId,
  setTipoCursoFrequentaId,
  cursos,
  nomeCursoFrequenta,
  setNomeCursoFrequenta,
  tipoSerieCursoFrequentaId,
  setTipoSerieCursoFrequentaId,
  series,
  tipoCursoFrequentouId,
  setTipoCursoFrequentouId,
  cursoConcluido,
  setCursoConcluido,
  tipoSerieCursoConcluidoId,
  setTipoSerieCursoConcluidoId
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Doença Grave?</label>
          <select className="form-control" value={portadorDoencaGrave} onChange={e => setPortadorDoencaGrave(e.target.value as any)}>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Deficiência</label>
          <select className="form-control" value={tipoDeficienciaId} onChange={e => setTipoDeficienciaId(e.target.value)}>
            <option value="">Nenhuma</option>
            {deficiencias.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Necessita Cuidados?</label>
          <select className="form-control" value={tipoNecessitaCuidadosId} onChange={e => setTipoNecessitaCuidadosId(e.target.value)}>
            <option value="">Não</option>
            {necessidadesCuidados.map(n => <option key={n.id} value={n.id}>{n.nome}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Remédio Controlado?</label>
          <select className="form-control" value={usaMedicamentoControlado} onChange={e => setUsaMedicamentoControlado(e.target.value as any)}>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Remédio Contínuo?</label>
          <select className="form-control" value={medicamentoContinuo} onChange={e => setMedicamentoContinuo(e.target.value as any)}>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Usa Álcool?</label>
          <select className="form-control" value={usaAlcool} onChange={e => setUsaAlcool(e.target.value as any)}>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Usa Drogas?</label>
          <select className="form-control" value={usaDroga} onChange={e => setUsaDroga(e.target.value as any)}>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tratamento Saúde?</label>
          <select className="form-control" value={tratamentoSaude} onChange={e => setTratamentoSaude(e.target.value as any)}>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tratamento CAPS</label>
          <select className="form-control" value={tipoTratamentoCapsId} onChange={e => setTipoTratamentoCapsId(e.target.value)}>
            <option value="">Nenhum</option>
            {tratamentosCaps.map(tc => <option key={tc.id} value={tc.id}>{tc.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Transtorno Mental?</label>
          <select className="form-control" value={transtornoMental} onChange={e => setTranstornoMental(e.target.value as any)}>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
      </div>

      {/* EDUCAÇÃO */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Sabe Ler/Escrever?</label>
          <select className="form-control" value={escreveLe} onChange={e => setEscreveLe(e.target.value as any)}>
            <option value="Sim">Sim</option>
            <option value="Não">Não</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome da Escola</label>
          <input type="text" className="form-control" value={nomeEscola} onChange={e => setNomeEscola(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Cód. INEP</label>
          <input type="text" className="form-control" value={codigoInepMec} onChange={e => setCodigoInepMec(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Curso Frequenta</label>
          <select className="form-control" value={tipoCursoFrequentaId} onChange={e => setTipoCursoFrequentaId(e.target.value)}>
            <option value="">Selecione...</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Curso Frequenta</label>
          <input type="text" className="form-control" value={nomeCursoFrequenta} onChange={e => setNomeCursoFrequenta(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Série Frequenta</label>
          <select className="form-control" value={tipoSerieCursoFrequentaId} onChange={e => setTipoSerieCursoFrequentaId(e.target.value)}>
            <option value="">Selecione...</option>
            {series.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Curso Frequentou</label>
          <select className="form-control" value={tipoCursoFrequentouId} onChange={e => setTipoCursoFrequentouId(e.target.value)}>
            <option value="">Selecione...</option>
            {cursos.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Concluiu Curso?</label>
          <select className="form-control" value={cursoConcluido} onChange={e => setCursoConcluido(e.target.value as any)}>
            <option value="Não">Não</option>
            <option value="Sim">Sim</option>
          </select>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Série Concluiu</label>
          <select className="form-control" value={tipoSerieCursoConcluidoId} onChange={e => setTipoSerieCursoConcluidoId(e.target.value)}>
            <option value="">Selecione...</option>
            {series.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};
