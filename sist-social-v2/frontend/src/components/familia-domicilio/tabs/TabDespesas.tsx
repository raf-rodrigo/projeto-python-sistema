import React from 'react';

interface TabDespesasProps {
  despesaEnergiaEletrica: string;
  despesaAguaEsgoto: string;
  despesaGasCarvaoLenha: string;
  despesaAlimentacaoHigieneLimpeza: string;
  despesaTransporte: string;
  despesaAluguel: string;
  despesaMedicamentoUsoRegular: string;
  despesaCombustivel: string;
  despesaFinanciamentoImovel: string;
  despesaFinanciamentoVeiculo: string;
  despesaCelular: string;
  despesaAssinaturaTv: string;
  despesaTelefoneFixo: string;
  despesaEmprestimo: string;
  despesaSaude: string;
  despesaEducacao: string;
  setDespesaEnergiaEletrica: (val: string) => void;
  setDespesaAguaEsgoto: (val: string) => void;
  setDespesaGasCarvaoLenha: (val: string) => void;
  setDespesaAlimentacaoHigieneLimpeza: (val: string) => void;
  setDespesaTransporte: (val: string) => void;
  setDespesaAluguel: (val: string) => void;
  setDespesaMedicamentoUsoRegular: (val: string) => void;
  setDespesaCombustivel: (val: string) => void;
  setDespesaFinanciamentoImovel: (val: string) => void;
  setDespesaFinanciamentoVeiculo: (val: string) => void;
  setDespesaCelular: (val: string) => void;
  setDespesaAssinaturaTv: (val: string) => void;
  setDespesaTelefoneFixo: (val: string) => void;
  setDespesaEmprestimo: (val: string) => void;
  setDespesaSaude: (val: string) => void;
  setDespesaEducacao: (val: string) => void;
}

export const TabDespesas: React.FC<TabDespesasProps> = ({
  despesaEnergiaEletrica,
  despesaAguaEsgoto,
  despesaGasCarvaoLenha,
  despesaAlimentacaoHigieneLimpeza,
  despesaTransporte,
  despesaAluguel,
  despesaMedicamentoUsoRegular,
  despesaCombustivel,
  despesaFinanciamentoImovel,
  despesaFinanciamentoVeiculo,
  despesaCelular,
  despesaAssinaturaTv,
  despesaTelefoneFixo,
  despesaEmprestimo,
  despesaSaude,
  despesaEducacao,
  setDespesaEnergiaEletrica,
  setDespesaAguaEsgoto,
  setDespesaGasCarvaoLenha,
  setDespesaAlimentacaoHigieneLimpeza,
  setDespesaTransporte,
  setDespesaAluguel,
  setDespesaMedicamentoUsoRegular,
  setDespesaCombustivel,
  setDespesaFinanciamentoImovel,
  setDespesaFinanciamentoVeiculo,
  setDespesaCelular,
  setDespesaAssinaturaTv,
  setDespesaTelefoneFixo,
  setDespesaEmprestimo,
  setDespesaSaude,
  setDespesaEducacao
}) => {

  const calcularTotalDespesas = () => {
    const parser = (val: string) => {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? 0 : parsed;
    };

    const total = 
      parser(despesaEnergiaEletrica) +
      parser(despesaAguaEsgoto) +
      parser(despesaGasCarvaoLenha) +
      parser(despesaAlimentacaoHigieneLimpeza) +
      parser(despesaTransporte) +
      parser(despesaAluguel) +
      parser(despesaMedicamentoUsoRegular) +
      parser(despesaCombustivel) +
      parser(despesaFinanciamentoImovel) +
      parser(despesaFinanciamentoVeiculo) +
      parser(despesaCelular) +
      parser(despesaAssinaturaTv) +
      parser(despesaTelefoneFixo) +
      parser(despesaEmprestimo) +
      parser(despesaSaude) +
      parser(despesaEducacao);

    return total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Box de Exibição do Valor Total das Despesas */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#ecfdf5', 
        border: '1px solid #a7f3d0', 
        borderRadius: '12px', 
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>💵</span>
          <div>
            <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#065f46' }}>Total de Despesas Mensais</h4>
            <span style={{ fontSize: '11px', color: '#047857' }}>Soma total de todos os custos declarados abaixo</span>
          </div>
        </div>
        <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857' }}>
          R$ {calcularTotalDespesas()}
        </div>
      </div>

      {/* Grid de Inputs das Despesas */}
      <div style={{ 
        border: '1px solid #e2e8f0', 
        borderRadius: '12px', 
        padding: '24px', 
        backgroundColor: '#ffffff',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '20px'
      }}>
        
        {/* Coluna 1 */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Energia Elétrica:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaEnergiaEletrica} 
            onChange={e => setDespesaEnergiaEletrica(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Água e esgoto:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaAguaEsgoto} 
            onChange={e => setDespesaAguaEsgoto(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Gás, carvão ou lenha:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaGasCarvaoLenha} 
            onChange={e => setDespesaGasCarvaoLenha(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Alimentação, higiene e limpeza:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaAlimentacaoHigieneLimpeza} 
            onChange={e => setDespesaAlimentacaoHigieneLimpeza(e.target.value)} 
          />
        </div>

        {/* Coluna 2 */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Transporte:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaTransporte} 
            onChange={e => setDespesaTransporte(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Aluguel:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaAluguel} 
            onChange={e => setDespesaAluguel(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Medicamento de uso regular:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaMedicamentoUsoRegular} 
            onChange={e => setDespesaMedicamentoUsoRegular(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Combustível:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaCombustivel} 
            onChange={e => setDespesaCombustivel(e.target.value)} 
          />
        </div>

        {/* Coluna 3 */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Financiamento Imóvel:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaFinanciamentoImovel} 
            onChange={e => setDespesaFinanciamentoImovel(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Financiamento Veículo:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaFinanciamentoVeiculo} 
            onChange={e => setDespesaFinanciamentoVeiculo(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Celular:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaCelular} 
            onChange={e => setDespesaCelular(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>TV por Assinatura:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaAssinaturaTv} 
            onChange={e => setDespesaAssinaturaTv(e.target.value)} 
          />
        </div>

        {/* Coluna 4 */}
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Telefone Fixo:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaTelefoneFixo} 
            onChange={e => setDespesaTelefoneFixo(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Empréstimo:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaEmprestimo} 
            onChange={e => setDespesaEmprestimo(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Despesas com Saúde:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaSaude} 
            onChange={e => setDespesaSaude(e.target.value)} 
          />
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Despesas com Educação:</label>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            className="form-control" 
            value={despesaEducacao} 
            onChange={e => setDespesaEducacao(e.target.value)} 
          />
        </div>

      </div>

    </div>
  );
};
