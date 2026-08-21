import React from 'react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
  codigo?: string | number;
}

interface TabTrabalhoProps {
  trabalha: 'Sim' | 'Não';
  setTrabalha: (val: 'Sim' | 'Não') => void;
  tipoAtividadeId: string;
  setTipoAtividadeId: (val: string) => void;
  atividades: TabelaBasicaItem[];
  qualificacaoProfissionalCboId: string;
  setQualificacaoProfissionalCboId: (val: string) => void;
  cbos: TabelaBasicaItem[];
  remuneracaoBruta: string;
  setRemuneracaoBruta: (val: string) => void;
  recebeBolsaFamilia: 'Sim' | 'Não';
  setRecebeBolsaFamilia: (val: 'Sim' | 'Não') => void;
  receitaBolsaFamilia: string;
  setReceitaBolsaFamilia: (val: string) => void;
  receitaBpc: string;
  setReceitaBpc: (val: string) => void;
  receitaAposentadoria: string;
  setReceitaAposentadoria: (val: string) => void;
  receitaSeguroDesemprego: string;
  setReceitaSeguroDesemprego: (val: string) => void;
  receitaPensaoAlimenticia: string;
  setReceitaPensaoAlimenticia: (val: string) => void;
  receitaAjudaDoacao: string;
  setReceitaAjudaDoacao: (val: string) => void;
  receitaOutrasFontes: string;
  setReceitaOutrasFontes: (val: string) => void;
  receitaPeti: string;
  setReceitaPeti: (val: string) => void;
}

export const TabTrabalho: React.FC<TabTrabalhoProps> = ({
  trabalha,
  setTrabalha,
  tipoAtividadeId,
  setTipoAtividadeId,
  atividades,
  qualificacaoProfissionalCboId,
  setQualificacaoProfissionalCboId,
  cbos,
  remuneracaoBruta,
  setRemuneracaoBruta,
  recebeBolsaFamilia,
  setRecebeBolsaFamilia,
  receitaBolsaFamilia,
  setReceitaBolsaFamilia,
  receitaBpc,
  setReceitaBpc,
  receitaAposentadoria,
  setReceitaAposentadoria,
  receitaSeguroDesemprego,
  setReceitaSeguroDesemprego,
  receitaPensaoAlimenticia,
  setReceitaPensaoAlimenticia,
  receitaAjudaDoacao,
  setReceitaAjudaDoacao,
  receitaOutrasFontes,
  setReceitaOutrasFontes,
  receitaPeti,
  setReceitaPeti
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Box 1: Situação de Ocupação e Trabalho */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Trabalho e Ocupação Atual
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Trabalha atualmente?</label>
            <select className="form-control" value={trabalha} onChange={e => setTrabalha(e.target.value as any)}>
              <option value="Não">Não</option>
              <option value="Sim">Sim</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Atividade:</label>
            <select className="form-control" value={tipoAtividadeId} onChange={e => setTipoAtividadeId(e.target.value)}>
              <option value="">Selecione...</option>
              {atividades.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Profissão (CBO):</label>
            <select className="form-control" value={qualificacaoProfissionalCboId} onChange={e => setQualificacaoProfissionalCboId(e.target.value)}>
              <option value="">Selecione...</option>
              {cbos.map(c => <option key={c.id} value={c.id}>{c.codigo} - {c.nome}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Remuneração Bruta R$:</label>
            <input type="number" step="0.01" className="form-control" value={remuneracaoBruta} onChange={e => setRemuneracaoBruta(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Bolsa Família?</label>
            <select className="form-control" value={recebeBolsaFamilia} onChange={e => setRecebeBolsaFamilia(e.target.value as any)}>
              <option value="Não">Não</option>
              <option value="Sim">Sim</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Valor Bolsa Família R$:</label>
            <input type="number" step="0.01" className="form-control" value={receitaBolsaFamilia} onChange={e => setReceitaBolsaFamilia(e.target.value)} disabled={recebeBolsaFamilia === 'Não'} />
          </div>
        </div>
      </div>

      {/* Box 2: Rendas e Outros Benefícios */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Outros Benefícios e Rendas Mensais
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Receita BPC R$:</label>
            <input type="number" step="0.01" className="form-control" value={receitaBpc} onChange={e => setReceitaBpc(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Aposentadoria/Pensão R$:</label>
            <input type="number" step="0.01" className="form-control" value={receitaAposentadoria} onChange={e => setReceitaAposentadoria(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Seguro Desemprego R$:</label>
            <input type="number" step="0.01" className="form-control" value={receitaSeguroDesemprego} onChange={e => setReceitaSeguroDesemprego(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Pensão Alimentícia R$:</label>
            <input type="number" step="0.01" className="form-control" value={receitaPensaoAlimenticia} onChange={e => setReceitaPensaoAlimenticia(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Ajuda/Doações R$:</label>
            <input type="number" step="0.01" className="form-control" value={receitaAjudaDoacao} onChange={e => setReceitaAjudaDoacao(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Outras Fontes R$:</label>
            <input type="number" step="0.01" className="form-control" value={receitaOutrasFontes} onChange={e => setReceitaOutrasFontes(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Valor PETI R$:</label>
            <input type="number" step="0.01" className="form-control" value={receitaPeti} onChange={e => setReceitaPeti(e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
};
