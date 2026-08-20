import React from 'react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
}

interface TabCondicoesHabitacionaisProps {
  // Valores
  totalPessoas: string;
  pessoas0a17: string;
  pessoas18a64: string;
  pessoas65mais: string;
  totalFamilias: string;
  numeroComodos: string;
  numeroDormitorios: string;
  pessoasDormitorio: string;
  aguaCanalizada: string;
  possuiBanheiro: string;
  calcamentoFrente: string;
  dificilAcesso: string;
  
  // IDs Tabelas Básicas
  especieDomicilioId: string;
  tipoResidenciaId: string;
  tipoPisoId: string;
  tipoConstrucaoId: string;
  tipoIluminacaoId: string;
  abastecimentoAguaId: string;
  escoamentoSanitarioId: string;
  coletaLixoId: string;
  acessibilidadeId: string;
  animalId: string;

  // Setters
  setTotalPessoas: (val: string) => void;
  setPessoas0a17: (val: string) => void;
  setPessoas18a64: (val: string) => void;
  setPessoas65mais: (val: string) => void;
  setTotalFamilias: (val: string) => void;
  setNumeroComodos: (val: string) => void;
  setNumeroDormitorios: (val: string) => void;
  setPessoasDormitorio: (val: string) => void;
  setAguaCanalizada: (val: string) => void;
  setPossuiBanheiro: (val: string) => void;
  setCalcamentoFrente: (val: string) => void;
  setDificilAcesso: (val: string) => void;

  setEspecieDomicilioId: (val: string) => void;
  setTipoResidenciaId: (val: string) => void;
  setTipoPisoId: (val: string) => void;
  setTipoConstrucaoId: (val: string) => void;
  setTipoIluminacaoId: (val: string) => void;
  setAbastecimentoAguaId: (val: string) => void;
  setEscoamentoSanitarioId: (val: string) => void;
  setColetaLixoId: (val: string) => void;
  setAcessibilidadeId: (val: string) => void;
  setAnimalId: (val: string) => void;

  // Listas de Tabelas Básicas vindas da API
  especiesDomicilio: TabelaBasicaItem[];
  tiposResidencia: TabelaBasicaItem[];
  tiposPiso: TabelaBasicaItem[];
  tiposConstrucao: TabelaBasicaItem[];
  tiposIluminacao: TabelaBasicaItem[];
  tiposAbastecimentoAgua: TabelaBasicaItem[];
  tiposEscoamentoSanitario: TabelaBasicaItem[];
  tiposColetaLixo: TabelaBasicaItem[];
  tiposAcessibilidade: TabelaBasicaItem[];
  tiposAnimais: TabelaBasicaItem[];

  // Propriedades extras opcionais vindas do Modal
  membrosFamilia?: any[];
  familias?: any[];
  editandoId?: number | null;
  cep?: string;
  logradouro?: string;
  numero?: string;
}

export const TabCondicoesHabitacionais: React.FC<TabCondicoesHabitacionaisProps> = ({
  totalPessoas,
  pessoas0a17,
  pessoas18a64,
  pessoas65mais,
  totalFamilias,
  numeroComodos,
  numeroDormitorios,
  pessoasDormitorio,
  aguaCanalizada,
  possuiBanheiro,
  calcamentoFrente,
  dificilAcesso,
  especieDomicilioId,
  tipoResidenciaId,
  tipoPisoId,
  tipoConstrucaoId,
  tipoIluminacaoId,
  abastecimentoAguaId,
  escoamentoSanitarioId,
  coletaLixoId,
  acessibilidadeId,
  animalId,
  setTotalPessoas,
  setPessoas0a17,
  setPessoas18a64,
  setPessoas65mais,
  setTotalFamilias,
  setNumeroComodos,
  setNumeroDormitorios,
  setPessoasDormitorio,
  setAguaCanalizada,
  setPossuiBanheiro,
  setCalcamentoFrente,
  setDificilAcesso,
  setEspecieDomicilioId,
  setTipoResidenciaId,
  setTipoPisoId,
  setTipoConstrucaoId,
  setTipoIluminacaoId,
  setAbastecimentoAguaId,
  setEscoamentoSanitarioId,
  setColetaLixoId,
  setAcessibilidadeId,
  setAnimalId,
  especiesDomicilio,
  tiposResidencia,
  tiposPiso,
  tiposConstrucao,
  tiposIluminacao,
  tiposAbastecimentoAgua,
  tiposEscoamentoSanitario,
  tiposColetaLixo,
  tiposAcessibilidade,
  tiposAnimais
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* CARD 1: Estrutura da Residência */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Estrutura e Ocupação do Domicílio
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nº Cômodos:</label>
            <input type="number" className="form-control" value={numeroComodos} onChange={e => setNumeroComodos(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nº Dormitórios:</label>
            <input type="number" className="form-control" value={numeroDormitorios} onChange={e => setNumeroDormitorios(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Pessoas por Dormitório:</label>
            <input type="number" className="form-control" value={pessoasDormitorio} onChange={e => setPessoasDormitorio(e.target.value)} placeholder="0" />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Total Pessoas:</label>
            <input type="number" className="form-control" value={totalPessoas} onChange={e => setTotalPessoas(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Crianças 0-17:</label>
            <input type="number" className="form-control" value={pessoas0a17} onChange={e => setPessoas0a17(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Adultos 18-64:</label>
            <input type="number" className="form-control" value={pessoas18a64} onChange={e => setPessoas18a64(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Idosos 65+:</label>
            <input type="number" className="form-control" value={pessoas65mais} onChange={e => setPessoas65mais(e.target.value)} placeholder="0" />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Total Família:</label>
            <input type="number" className="form-control" value={totalFamilias} onChange={e => setTotalFamilias(e.target.value)} placeholder="0" />
          </div>
        </div>
      </div>

      {/* CARD 2: Classificações de Infraestrutura (Dropdowns tabelas básicas) */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Características e Classificação Física
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Espécie do Domicílio:</label>
            <select className="form-control" value={especieDomicilioId} onChange={e => setEspecieDomicilioId(e.target.value)}>
              <option value="">Selecione...</option>
              {especiesDomicilio.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Residência:</label>
            <select className="form-control" value={tipoResidenciaId} onChange={e => setTipoResidenciaId(e.target.value)}>
              <option value="">Selecione...</option>
              {tiposResidencia.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Piso:</label>
            <select className="form-control" value={tipoPisoId} onChange={e => setTipoPisoId(e.target.value)}>
              <option value="">Selecione...</option>
              {tiposPiso.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Construção:</label>
            <select className="form-control" value={tipoConstrucaoId} onChange={e => setTipoConstrucaoId(e.target.value)}>
              <option value="">Selecione...</option>
              {tiposConstrucao.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Iluminação:</label>
            <select className="form-control" value={tipoIluminacaoId} onChange={e => setTipoIluminacaoId(e.target.value)}>
              <option value="">Selecione...</option>
              {tiposIluminacao.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Acessibilidade no Domicílio:</label>
            <select className="form-control" value={acessibilidadeId} onChange={e => setAcessibilidadeId(e.target.value)}>
              <option value="">Selecione...</option>
              {tiposAcessibilidade.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Animais no Domicílio:</label>
            <select className="form-control" value={animalId} onChange={e => setAnimalId(e.target.value)}>
              <option value="">Selecione...</option>
              {tiposAnimais.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* CARD 3: Saneamento, Acesso e Banheiro */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Saneamento e Acesso
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Abastecimento de Água:</label>
            <select className="form-control" value={abastecimentoAguaId} onChange={e => setAbastecimentoAguaId(e.target.value)}>
              <option value="">Selecione...</option>
              {tiposAbastecimentoAgua.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Escoamento Sanitário:</label>
            <select className="form-control" value={escoamentoSanitarioId} onChange={e => setEscoamentoSanitarioId(e.target.value)}>
              <option value="">Selecione...</option>
              {tiposEscoamentoSanitario.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Coleta de Lixo:</label>
            <select className="form-control" value={coletaLixoId} onChange={e => setColetaLixoId(e.target.value)}>
              <option value="">Selecione...</option>
              {tiposColetaLixo.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Água Canalizada?</label>
            <select className="form-control" value={aguaCanalizada} onChange={e => setAguaCanalizada(e.target.value as 'Sim' | 'Não')}>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Possui Banheiro?</label>
            <select className="form-control" value={possuiBanheiro} onChange={e => setPossuiBanheiro(e.target.value as 'Sim' | 'Não')}>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Calçamento em Frente?</label>
            <select className="form-control" value={calcamentoFrente} onChange={e => setCalcamentoFrente(e.target.value as 'Total' | 'Parcial' | 'Não Existe')}>
              <option value="Total">Total</option>
              <option value="Parcial">Parcial</option>
              <option value="Não Existe">Não Existe</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Área de Difícil Acesso?</label>
            <select className="form-control" value={dificilAcesso} onChange={e => setDificilAcesso(e.target.value as 'Sim' | 'Não')}>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  );
};
