import React from 'react';

interface TabelaBasicaItem {
  id: number;
  nome: string;
}

interface TabSocioassistenciaisProps {
  // Valores Renda
  rendaSemProgramas: string;
  rendaComProgramas: string;

  // Meio de transporte
  possuiMeioTransporte: string;
  transporteAutomovel: boolean;
  transporteMoto: boolean;
  transporteBicicleta: boolean;
  transporteOutros: boolean;

  // Saúde
  codigoEstabelecimentoSaude: string;
  nomeEstabelecimentoSaude: string;

  // Grupos Tradicionais (Tabela Básica)
  grupoTradicionalId: string;
  gruposTradicionaisList: TabelaBasicaItem[];

  // Nível Vulnerabilidade
  nivelVulnerabilidade: string;

  // Outras Informações (Checkboxes adicionais)
  infoTrabalhoInfantil: boolean;
  infoExtremaPobreza: boolean;
  infoRendaCidada: boolean;
  infoInsuficienciaAlimentar: boolean;
  infoBolsaFamilia: boolean;
  infoBpc: boolean;
  infoAcaoJovem: boolean;

  // Setters
  setRendaSemProgramas: (val: string) => void;
  setRendaComProgramas: (val: string) => void;

  setPossuiMeioTransporte: (val: string) => void;
  setTransporteAutomovel: (val: boolean) => void;
  setTransporteMoto: (val: boolean) => void;
  setTransporteBicicleta: (val: boolean) => void;
  setTransporteOutros: (val: boolean) => void;

  setCodigoEstabelecimentoSaude: (val: string) => void;
  setNomeEstabelecimentoSaude: (val: string) => void;

  setGrupoTradicionalId: (val: string) => void;
  setNivelVulnerabilidade: (val: string) => void;

  setInfoTrabalhoInfantil: (val: boolean) => void;
  setInfoExtremaPobreza: (val: boolean) => void;
  setInfoRendaCidada: (val: boolean) => void;
  setInfoInsuficienciaAlimentar: (val: boolean) => void;
  setInfoBolsaFamilia: (val: boolean) => void;
  setInfoBpc: (val: boolean) => void;
  setInfoAcaoJovem: (val: boolean) => void;
}

export const TabSocioassistenciais: React.FC<TabSocioassistenciaisProps> = ({
  rendaSemProgramas,
  rendaComProgramas,
  possuiMeioTransporte,
  transporteAutomovel,
  transporteMoto,
  transporteBicicleta,
  transporteOutros,
  codigoEstabelecimentoSaude,
  nomeEstabelecimentoSaude,
  grupoTradicionalId,
  gruposTradicionaisList,
  nivelVulnerabilidade,
  infoTrabalhoInfantil,
  infoExtremaPobreza,
  infoRendaCidada,
  infoInsuficienciaAlimentar,
  infoBolsaFamilia,
  infoBpc,
  infoAcaoJovem,
  setRendaSemProgramas,
  setRendaComProgramas,
  setPossuiMeioTransporte,
  setTransporteAutomovel,
  setTransporteMoto,
  setTransporteBicicleta,
  setTransporteOutros,
  setCodigoEstabelecimentoSaude,
  setNomeEstabelecimentoSaude,
  setGrupoTradicionalId,
  setNivelVulnerabilidade,
  setInfoTrabalhoInfantil,
  setInfoExtremaPobreza,
  setInfoRendaCidada,
  setInfoInsuficienciaAlimentar,
  setInfoBolsaFamilia,
  setInfoBpc,
  setInfoAcaoJovem
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* CARD 1: Rendimentos */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Rendimento e Renda Per Capita
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Renda Per Capita Sem Programas Sociais (R$):
            </label>
            <input 
              type="number" 
              step="0.01"
              className="form-control" 
              value={rendaSemProgramas} 
              onChange={e => setRendaSemProgramas(e.target.value)} 
              placeholder="0.00" 
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Renda Per Capita Com Programas Sociais (R$):
            </label>
            <input 
              type="number" 
              step="0.01"
              className="form-control" 
              value={rendaComProgramas} 
              onChange={e => setRendaComProgramas(e.target.value)} 
              placeholder="0.00" 
            />
          </div>
        </div>
      </div>

      {/* CARD 2: Transporte */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Meios de Transporte
        </h4>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Possui meio de transporte?</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="possuiMeioTransporte" 
                checked={possuiMeioTransporte === 'Sim'} 
                onChange={() => setPossuiMeioTransporte('Sim')} 
              /> Sim
            </label>
            <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="possuiMeioTransporte" 
                checked={possuiMeioTransporte === 'Não' || !possuiMeioTransporte} 
                onChange={() => {
                  setPossuiMeioTransporte('Não');
                  setTransporteAutomovel(false);
                  setTransporteMoto(false);
                  setTransporteBicicleta(false);
                  setTransporteOutros(false);
                }} 
              /> Não
            </label>
          </div>
        </div>

        {possuiMeioTransporte === 'Sim' && (
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px' }}>Quais meios de transporte?</label>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={transporteAutomovel} 
                  onChange={e => setTransporteAutomovel(e.target.checked)} 
                /> Automóvel
              </label>
              <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={transporteMoto} 
                  onChange={e => setTransporteMoto(e.target.checked)} 
                /> Motocicleta
              </label>
              <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={transporteBicicleta} 
                  onChange={e => setTransporteBicicleta(e.target.checked)} 
                /> Bicicleta
              </label>
              <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={transporteOutros} 
                  onChange={e => setTransporteOutros(e.target.checked)} 
                /> Outros
              </label>
            </div>
          </div>
        )}
      </div>

      {/* CARD 3: Saúde e Grupos Tradicionais */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Saúde e Grupos Específicos
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Cód. Estabelecimento Saúde:</label>
            <input 
              type="text" 
              className="form-control" 
              value={codigoEstabelecimentoSaude} 
              onChange={e => setCodigoEstabelecimentoSaude(e.target.value)} 
              placeholder="Ex: 123456" 
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome Estabelecimento Saúde:</label>
            <input 
              type="text" 
              className="form-control" 
              value={nomeEstabelecimentoSaude} 
              onChange={e => setNomeEstabelecimentoSaude(e.target.value)} 
              placeholder="Ex: UBS Centro" 
            />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Grupo Tradicional e Específico:</label>
          <select 
            className="form-control" 
            value={grupoTradicionalId} 
            onChange={e => setGrupoTradicionalId(e.target.value)}
          >
            <option value="">Selecione...</option>
            {gruposTradicionaisList.map(item => (
              <option key={item.id} value={item.id}>{item.nome}</option>
            ))}
          </select>
        </div>
      </div>

      {/* CARD 4: Nível de Vulnerabilidade */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Nível de Vulnerabilidade
        </h4>
        
        <div style={{ display: 'flex', gap: '24px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="nivelVulnerabilidade" 
              checked={nivelVulnerabilidade === 'Alto'} 
              onChange={() => setNivelVulnerabilidade('Alto')} 
            /> Alto
          </label>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#eab308', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="nivelVulnerabilidade" 
              checked={nivelVulnerabilidade === 'Médio'} 
              onChange={() => setNivelVulnerabilidade('Médio')} 
            /> Médio
          </label>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input 
              type="radio" 
              name="nivelVulnerabilidade" 
              checked={nivelVulnerabilidade === 'Baixo'} 
              onChange={() => setNivelVulnerabilidade('Baixo')} 
            /> Baixo
          </label>
        </div>
      </div>

      {/* CARD 5: Outras Informações */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <h4 style={{ margin: '0 0 16px 0', color: '#1e3a8a', fontSize: '14px', fontWeight: 700, borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
          Outras Informações e Indicadores
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <input 
              type="checkbox" 
              checked={infoTrabalhoInfantil} 
              onChange={e => setInfoTrabalhoInfantil(e.target.checked)} 
            /> Indicação de Trabalho Infantil
          </label>
          
          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <input 
              type="checkbox" 
              checked={infoExtremaPobreza} 
              onChange={e => setInfoExtremaPobreza(e.target.checked)} 
            /> Situação Extrema Pobreza
          </label>

          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <input 
              type="checkbox" 
              checked={infoRendaCidada} 
              onChange={e => setInfoRendaCidada(e.target.checked)} 
            /> Recebe Renda Cidadã
          </label>

          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <input 
              type="checkbox" 
              checked={infoInsuficienciaAlimentar} 
              onChange={e => setInfoInsuficienciaAlimentar(e.target.checked)} 
            /> Insuficiência Alimentar na Família
          </label>

          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <input 
              type="checkbox" 
              checked={infoBolsaFamilia} 
              onChange={e => setInfoBolsaFamilia(e.target.checked)} 
            /> Beneficiário Bolsa Família
          </label>

          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <input 
              type="checkbox" 
              checked={infoBpc} 
              onChange={e => setInfoBpc(e.target.checked)} 
            /> Membros Beneficiários do BPC
          </label>

          <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <input 
              type="checkbox" 
              checked={infoAcaoJovem} 
              onChange={e => setInfoAcaoJovem(e.target.checked)} 
            /> Recebe Ação Jovem
          </label>
        </div>
      </div>

    </div>
  );
};
