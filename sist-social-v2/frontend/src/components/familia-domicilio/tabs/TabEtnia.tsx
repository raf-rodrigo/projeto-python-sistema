import React, { useState, useEffect } from 'react';

interface TabEtniaProps {
  codigoPovoIndigena: string;
  povoIndigena: string;
  codigoReservaIndigena: string;
  reservaIndigena: string;
  codigoComunidadeQuilombola: string;
  comunidadeQuilombola: string;
  setCodigoPovoIndigena: (val: string) => void;
  setPovoIndigena: (val: string) => void;
  setCodigoReservaIndigena: (val: string) => void;
  setReservaIndigena: (val: string) => void;
  setCodigoComunidadeQuilombola: (val: string) => void;
  setComunidadeQuilombola: (val: string) => void;
}

export const TabEtnia: React.FC<TabEtniaProps> = ({
  codigoPovoIndigena,
  povoIndigena,
  codigoReservaIndigena,
  reservaIndigena,
  codigoComunidadeQuilombola,
  comunidadeQuilombola,
  setCodigoPovoIndigena,
  setPovoIndigena,
  setCodigoReservaIndigena,
  setReservaIndigena,
  setCodigoComunidadeQuilombola,
  setComunidadeQuilombola
}) => {
  // Estados locais para controlar as opções de Sim/Não dos blocos
  const [famIndigena, setFamIndigena] = useState<'Sim' | 'Não'>('Não');
  const [terraIndigena, setTerraIndigena] = useState<'Sim' | 'Não'>('Não');
  const [famQuilombola, setFamQuilombola] = useState<'Sim' | 'Não'>('Não');

  // Inicializa os controles Sim/Não com base no conteúdo existente vindo do banco
  useEffect(() => {
    if (codigoPovoIndigena || povoIndigena) {
      setFamIndigena('Sim');
    } else {
      setFamIndigena('Não');
    }

    if (codigoReservaIndigena || reservaIndigena) {
      setTerraIndigena('Sim');
    } else {
      setTerraIndigena('Não');
    }

    if (codigoComunidadeQuilombola || comunidadeQuilombola) {
      setFamQuilombola('Sim');
    } else {
      setFamQuilombola('Não');
    }
  }, [
    codigoPovoIndigena,
    povoIndigena,
    codigoReservaIndigena,
    reservaIndigena,
    codigoComunidadeQuilombola,
    comunidadeQuilombola
  ]);

  // Se o usuário marcar "Não" para Família Indígena, limpa os campos respectivos
  const handleFamIndigenaChange = (val: 'Sim' | 'Não') => {
    setFamIndigena(val);
    if (val === 'Não') {
      setCodigoPovoIndigena('');
      setPovoIndigena('');
    }
  };

  // Se o usuário marcar "Não" para Terra Indígena, limpa os campos respectivos
  const handleTerraIndigenaChange = (val: 'Sim' | 'Não') => {
    setTerraIndigena(val);
    if (val === 'Não') {
      setCodigoReservaIndigena('');
      setReservaIndigena('');
    }
  };

  // Se o usuário marcar "Não" para Quilombola, limpa os campos respectivos
  const handleFamQuilombolaChange = (val: 'Sim' | 'Não') => {
    setFamQuilombola(val);
    if (val === 'Não') {
      setCodigoComunidadeQuilombola('');
      setComunidadeQuilombola('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 🏹 Bloco Indígena */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🏹</span>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Etnia e Povo Indígena</h4>
        </div>
        
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Família Indígena */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Família Indígena?</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input 
                    type="radio" 
                    name="famIndigena" 
                    checked={famIndigena === 'Sim'} 
                    onChange={() => handleFamIndigenaChange('Sim')} 
                  /> Sim
                </label>
                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input 
                    type="radio" 
                    name="famIndigena" 
                    checked={famIndigena === 'Não'} 
                    onChange={() => handleFamIndigenaChange('Não')} 
                  /> Não
                </label>
              </div>
            </div>

            {/* Terra Indígena */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Reside em Terra ou Comunidade Indígena?</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input 
                    type="radio" 
                    name="terraIndigena" 
                    checked={terraIndigena === 'Sim'} 
                    onChange={() => handleTerraIndigenaChange('Sim')} 
                  /> Sim
                </label>
                <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input 
                    type="radio" 
                    name="terraIndigena" 
                    checked={terraIndigena === 'Não'} 
                    onChange={() => handleTerraIndigenaChange('Não')} 
                  /> Não
                </label>
              </div>
            </div>
          </div>

          {/* Inputs Condicionais da Família Indígena */}
          {famIndigena === 'Sim' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', borderLeft: '4px solid #10b981', paddingLeft: '16px', marginTop: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Código do Povo Indígena</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={codigoPovoIndigena} 
                  onChange={e => setCodigoPovoIndigena(e.target.value)} 
                  placeholder="Ex: 042"
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Povo ou Etnia Indígena</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={povoIndigena} 
                  onChange={e => setPovoIndigena(e.target.value)} 
                  placeholder="Ex: Guarani, Kaingang..."
                />
              </div>
            </div>
          )}

          {/* Inputs Condicionais da Terra Indígena */}
          {terraIndigena === 'Sim' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', borderLeft: '4px solid #3b82f6', paddingLeft: '16px', marginTop: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Código da Reserva Indígena</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={codigoReservaIndigena} 
                  onChange={e => setCodigoReservaIndigena(e.target.value)} 
                  placeholder="Ex: 928"
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome da Reserva Indígena</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={reservaIndigena} 
                  onChange={e => setReservaIndigena(e.target.value)} 
                  placeholder="Nome da reserva ou aldeia..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🏺 Bloco Quilombola */}
      <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '14px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.2rem' }}>🏺</span>
          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Comunidade Quilombola</h4>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Família Quilombola?</label>
            <div style={{ display: 'flex', gap: '16px' }}>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                <input 
                  type="radio" 
                  name="famQuilombola" 
                  checked={famQuilombola === 'Sim'} 
                  onChange={() => handleFamQuilombolaChange('Sim')} 
                /> Sim
              </label>
              <label style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                <input 
                  type="radio" 
                  name="famQuilombola" 
                  checked={famQuilombola === 'Não'} 
                  onChange={() => handleFamQuilombolaChange('Não')} 
                /> Não
              </label>
            </div>
          </div>

          {/* Inputs Condicionais da Família Quilombola */}
          {famQuilombola === 'Sim' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px', borderLeft: '4px solid #f59e0b', paddingLeft: '16px', marginTop: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Código da Comunidade Quilombola</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={codigoComunidadeQuilombola} 
                  onChange={e => setCodigoComunidadeQuilombola(e.target.value)} 
                  placeholder="Ex: 104"
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Nome da Comunidade Quilombola</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={comunidadeQuilombola} 
                  onChange={e => setComunidadeQuilombola(e.target.value)} 
                  placeholder="Nome da comunidade quilombola..."
                />
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
