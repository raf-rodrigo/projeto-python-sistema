import React from 'react';
import SearchableSelect from '../../SearchableSelect';

interface TabelaBasicaItem {
  id: number;
  nome: string;
  codigo?: string | number;
}

interface TabCondicoesHabitacionaisProps {
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

  especieDomicilioId: string;
  tipoResidenciaId: string;
  tipoConstrucaoId: string;
  tipoPisoId: string;
  tipoIluminacaoId: string;
  acessibilidadeId: string;
  animalId: string;
  aguaCanalizada: string;
  abastecimentoAguaId: string;
  possuiBanheiro: string;
  escoamentoSanitarioId: string;
  coletaLixoId: string;
  calcamentoFrente: string;
  dificilAcesso: string;
  numeroComodos: string;
  numeroDormitorios: string;
  pessoasDormitorio: string;
  totalPessoas: string;
  totalFamilias: string;
  pessoas0a17: string;
  pessoas18a64: string;
  pessoas65mais: string;

  setEspecieDomicilioId: (val: string) => void;
  setTipoResidenciaId: (val: string) => void;
  setTipoConstrucaoId: (val: string) => void;
  setTipoPisoId: (val: string) => void;
  setTipoIluminacaoId: (val: string) => void;
  setAcessibilidadeId: (val: string) => void;
  setAnimalId: (val: string) => void;
  setAguaCanalizada: (val: string) => void;
  setAbastecimentoAguaId: (val: string) => void;
  setPossuiBanheiro: (val: string) => void;
  setEscoamentoSanitarioId: (val: string) => void;
  setColetaLixoId: (val: string) => void;
  setCalcamentoFrente: (val: string) => void;
  setDificilAcesso: (val: string) => void;
  setNumeroComodos: (val: string) => void;
  setNumeroDormitorios: (val: string) => void;
  setPessoasDormitorio: (val: string) => void;
  setTotalPessoas: (val: string) => void;
  setTotalFamilias: (val: string) => void;
  setPessoas0a17: (val: string) => void;
  setPessoas18a64: (val: string) => void;
  setPessoas65mais: (val: string) => void;

  membrosFamilia: any[];
  familias: any[];
  editandoId: number | null;
  cep: string;
  logradouro: string;
  numero: string;
}

export const TabCondicoesHabitacionais: React.FC<TabCondicoesHabitacionaisProps> = ({
  especiesDomicilio,
  tiposResidencia,
  tiposPiso,
  tiposConstrucao,
  tiposIluminacao,
  tiposAbastecimentoAgua,
  tiposEscoamentoSanitario,
  tiposColetaLixo,
  tiposAcessibilidade,
  tiposAnimais,
  especieDomicilioId,
  tipoResidenciaId,
  tipoConstrucaoId,
  tipoPisoId,
  tipoIluminacaoId,
  acessibilidadeId,
  animalId,
  aguaCanalizada,
  abastecimentoAguaId,
  possuiBanheiro,
  escoamentoSanitarioId,
  coletaLixoId,
  calcamentoFrente,
  dificilAcesso,
  numeroComodos,
  numeroDormitorios,
  pessoasDormitorio,
  totalPessoas,
  totalFamilias,
  pessoas0a17,
  pessoas18a64,
  pessoas65mais,
  setEspecieDomicilioId,
  setTipoResidenciaId,
  setTipoConstrucaoId,
  setTipoPisoId,
  setTipoIluminacaoId,
  setAcessibilidadeId,
  setAnimalId,
  setAguaCanalizada,
  setAbastecimentoAguaId,
  setPossuiBanheiro,
  setEscoamentoSanitarioId,
  setColetaLixoId,
  setCalcamentoFrente,
  setDificilAcesso,
  setNumeroComodos,
  setNumeroDormitorios,
  setPessoasDormitorio,
  setTotalPessoas,
  setTotalFamilias,
  setPessoas0a17,
  setPessoas18a64,
  setPessoas65mais,
  membrosFamilia,
  familias,
  editandoId,
  cep,
  logradouro,
  numero
}) => {

  // Efeito 1: Calcula o total de pessoas e as faixas etárias baseando-se na composição familiar
  React.useEffect(() => {
    // 1. Total de pessoas da composição familiar
    setTotalPessoas(membrosFamilia.length.toString());

    // 2. Contagem de pessoas por faixa etária
    let count0to17 = 0;
    let count18to64 = 0;
    let count65plus = 0;

    membrosFamilia.forEach(m => {
      const dobString = m.certidao_nascimento_data || m.certidao_nascimento_data_exibicao;
      if (dobString) {
        const dob = new Date(dobString);
        const ageMs = Date.now() - dob.getTime();
        const ageDate = new Date(ageMs);
        const age = Math.abs(ageDate.getUTCFullYear() - 1970);
        if (age <= 17) {
          count0to17++;
        } else if (age >= 18 && age <= 64) {
          count18to64++;
        } else if (age >= 65) {
          count65plus++;
        }
      }
    });

    setPessoas0a17(count0to17.toString());
    setPessoas18a64(count18to64.toString());
    setPessoas65mais(count65plus.toString());
  }, [membrosFamilia, setTotalPessoas, setPessoas0a17, setPessoas18a64, setPessoas65mais]);

  // Efeito 2: Calcula o total de famílias no mesmo endereço
  React.useEffect(() => {
    if (logradouro && numero && cep && familias.length > 0) {
      const cleanCep = (c: string) => c.replace(/\D/g, '');
      const addrFamilies = familias.filter(f => 
        f.logradouro_nome?.trim().toLowerCase() === logradouro.trim().toLowerCase() &&
        f.logradouro_numero?.trim().toString() === numero.trim().toString() &&
        cleanCep(f.logradouro_cep || '') === cleanCep(cep)
      );
      
      const isCurrentInList = editandoId ? addrFamilies.some(f => f.id === editandoId) : false;
      const count = isCurrentInList ? addrFamilies.length : addrFamilies.length + 1;
      setTotalFamilias(count.toString());
    } else {
      setTotalFamilias('1'); // Padrão é pelo menos a família atual
    }
  }, [logradouro, numero, cep, familias, editandoId, setTotalFamilias]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* GRUPO 1: Características Físicas e Tipo de Habitação */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', backgroundColor: '#f8fafc' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
          Características Físicas e Tipo de Habitação
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Espécie do Domicílio</label>
            <SearchableSelect 
              options={especiesDomicilio.map(e => ({ id: e.id, label: e.nome }))}
              value={especieDomicilioId}
              onChange={val => setEspecieDomicilioId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Residência</label>
            <SearchableSelect 
              options={tiposResidencia.map(e => ({ id: e.id, label: e.nome }))}
              value={tipoResidenciaId}
              onChange={val => setTipoResidenciaId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Construção</label>
            <SearchableSelect 
              options={tiposConstrucao.map(e => ({ id: e.id, label: e.nome }))}
              value={tipoConstrucaoId}
              onChange={val => setTipoConstrucaoId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Piso</label>
            <SearchableSelect 
              options={tiposPiso.map(e => ({ id: e.id, label: e.nome }))}
              value={tipoPisoId}
              onChange={val => setTipoPisoId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Tipo de Iluminação</label>
            <SearchableSelect 
              options={tiposIluminacao.map(e => ({ id: e.id, label: e.nome }))}
              value={tipoIluminacaoId}
              onChange={val => setTipoIluminacaoId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Acessibilidade do Domicílio</label>
            <SearchableSelect 
              options={tiposAcessibilidade.map(e => ({ id: e.id, label: e.nome }))}
              value={acessibilidadeId}
              onChange={val => setAcessibilidadeId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Animais no Domicílio</label>
            <SearchableSelect 
              options={tiposAnimais.map(e => ({ id: e.id, label: e.nome }))}
              value={animalId}
              onChange={val => setAnimalId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
        </div>
      </div>

      {/* GRUPO 2: Saneamento e Infraestrutura Urbana */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', backgroundColor: '#f8fafc' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
          Saneamento e Infraestrutura Urbana
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Água Canalizada?</label>
            <select className="form-control" value={aguaCanalizada} onChange={e => setAguaCanalizada(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Abastecimento de Água</label>
            <SearchableSelect 
              options={tiposAbastecimentoAgua.map(e => ({ id: e.id, label: e.nome }))}
              value={abastecimentoAguaId}
              onChange={val => setAbastecimentoAguaId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Possui Banheiro?</label>
            <select className="form-control" value={possuiBanheiro} onChange={e => setPossuiBanheiro(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Escoamento Sanitário</label>
            <SearchableSelect 
              options={tiposEscoamentoSanitario.map(e => ({ id: e.id, label: e.nome }))}
              value={escoamentoSanitarioId}
              onChange={val => setEscoamentoSanitarioId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Coleta de Lixo</label>
            <SearchableSelect 
              options={tiposColetaLixo.map(e => ({ id: e.id, label: e.nome }))}
              value={coletaLixoId}
              onChange={val => setColetaLixoId(val.toString())}
              placeholder="Selecione..."
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Calçamento em Frente?</label>
            <select className="form-control" value={calcamentoFrente} onChange={e => setCalcamentoFrente(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="Total">Total</option>
              <option value="Parcial">Parcial</option>
              <option value="Não Existe">Não Existe</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Área de Difícil Acesso?</label>
            <select className="form-control" value={dificilAcesso} onChange={e => setDificilAcesso(e.target.value)}>
              <option value="">Selecione...</option>
              <option value="Sim">Sim</option>
              <option value="Não">Não</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRUPO 3: Cômodos e Densidade de Residentes */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', backgroundColor: '#f8fafc' }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '13px', fontWeight: 700, color: '#1e293b', borderBottom: '1px solid #cbd5e1', paddingBottom: '8px' }}>
          Cômodos e Densidade de Residentes
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Número de Cômodos</label>
            <input type="number" min="0" className="form-control" value={numeroComodos} onChange={e => setNumeroComodos(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Número de Dormitórios</label>
            <input type="number" min="0" className="form-control" value={numeroDormitorios} onChange={e => setNumeroDormitorios(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Número de Pessoas por Dormitório</label>
            <input type="number" min="0" className="form-control" value={pessoasDormitorio} onChange={e => setPessoasDormitorio(e.target.value)} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Total de Pessoas no Domicílio (Auto)</label>
            <input type="number" min="0" className="form-control" value={totalPessoas} readOnly style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Total de Famílias no Domicílio (Auto)</label>
            <input type="number" min="0" className="form-control" value={totalFamilias} readOnly style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Pessoas de 0 a 17 anos (Auto)</label>
            <input type="number" min="0" className="form-control" value={pessoas0a17} readOnly style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Pessoas de 18 a 64 anos (Auto)</label>
            <input type="number" min="0" className="form-control" value={pessoas18a64} readOnly style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Pessoas de 65+ anos (Auto)</label>
            <input type="number" min="0" className="form-control" value={pessoas65mais} readOnly style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
          </div>
        </div>
      </div>

    </div>
  );
};
