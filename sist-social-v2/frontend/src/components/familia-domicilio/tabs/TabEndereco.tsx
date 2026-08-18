import React from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Componente para atualizar o centro do mapa
const MapController: React.FC<{ coords: [number, number] }> = ({ coords }) => {
  const map = useMap();
  React.useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
};

interface TabEnderecoProps {
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento: string;
  mapCoords: [number, number];
  latitudeVal: string;
  longitudeVal: string;
  tempoMoradiaAnos: string;
  tempoMoradiaMeses: string;
  
  // Setters
  setCep: (val: string) => void;
  setLogradouro: (val: string) => void;
  setNumero: (val: string) => void;
  setBairro: (val: string) => void;
  setCidade: (val: string) => void;
  setUf: (val: string) => void;
  setComplemento: (val: string) => void;
  setTempoMoradiaAnos: (val: string) => void;
  setTempoMoradiaMeses: (val: string) => void;
}

export const TabEndereco: React.FC<TabEnderecoProps> = ({
  cep,
  logradouro,
  numero,
  bairro,
  cidade,
  uf,
  complemento,
  mapCoords,
  latitudeVal,
  longitudeVal,
  tempoMoradiaAnos,
  tempoMoradiaMeses,
  setCep,
  setLogradouro,
  setNumero,
  setBairro,
  setCidade,
  setUf,
  setComplemento,
  setTempoMoradiaAnos,
  setTempoMoradiaMeses
}) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
      
      {/* Endereço Box */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', padding: '20px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Cep: *</label>
            <input 
              type="text" 
              className="form-control" 
              value={cep} 
              onChange={e => {
                const val = e.target.value.replace(/\D/g, '');
                if (val.length <= 8) setCep(val);
              }} 
              required 
              placeholder="Apenas números (8 dígitos)" 
            />
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Logradouro:</label>
            <input type="text" className="form-control" value={logradouro} onChange={e => setLogradouro(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Número:</label>
              <input type="text" className="form-control" value={numero} onChange={e => setNumero(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Bairro:</label>
              <input type="text" className="form-control" value={bairro} onChange={e => setBairro(e.target.value)} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Cidade:</label>
            <input type="text" className="form-control" value={cidade} onChange={e => setCidade(e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>UF:</label>
              <input type="text" className="form-control" value={uf} onChange={e => setUf(e.target.value)} />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Complemento:</label>
              <input type="text" className="form-control" value={complemento} onChange={e => setComplemento(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Mapa Leaflet Box */}
      <div style={{ border: '1px solid #cbd5e1', borderRadius: '12px', overflow: 'hidden', height: '390px', position: 'relative' }}>
        <MapContainer 
          center={mapCoords} 
          zoom={15} 
          style={{ width: '100%', height: '100%', zIndex: 1 }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={mapCoords} />
          <MapController coords={mapCoords} />
        </MapContainer>
        {latitudeVal && (
          <div style={{ position: 'absolute', bottom: '10px', left: '10px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, color: '#334155', zIndex: 10, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            Lat: {parseFloat(latitudeVal).toFixed(6)} | Lon: {parseFloat(longitudeVal).toFixed(6)}
          </div>
        )}
      </div>

      {/* Tempo Moradia (sempre visível na aba Endereço) */}
      <div style={{ gridColumn: 'span 2', marginTop: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Tempo de Residência/Moradia no Município:</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="number" className="form-control" value={tempoMoradiaAnos} onChange={e => setTempoMoradiaAnos(e.target.value)} style={{ width: '80px', padding: '6px 12px' }} />
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Anos</span>
          <input type="number" className="form-control" value={tempoMoradiaMeses} onChange={e => setTempoMoradiaMeses(e.target.value)} style={{ width: '80px', padding: '6px 12px' }} />
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Meses</span>
        </div>
      </div>

    </div>
  );
};
