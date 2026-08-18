import { useState, useEffect, useRef } from 'react';

interface SearchableSelectProps {
  options: { id: string | number; label: string }[];
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
}

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = 'Pesquisar...',
  required = false
}: SearchableSelectProps) {
  const [busca, setBusca] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown se o clique for fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Encontra a label da opção selecionada
  const selectedOption = options.find(opt => opt.id.toString() === value?.toString());

  // Filtra as opções com base no termo digitado
  const opcoesFiltradas = options.filter(opt =>
    opt.label.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Campo visível / Input de busca */}
      <input
        type="text"
        className="form-control"
        value={isOpen ? busca : (selectedOption ? selectedOption.label : '')}
        onChange={e => {
          setBusca(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          setBusca('');
          setIsOpen(true);
        }}
        placeholder={selectedOption ? selectedOption.label : placeholder}
        required={required && !value}
        style={{
          width: '100%',
          cursor: 'pointer',
          paddingRight: '30px'
        }}
      />
      
      {/* Ícone de seta */}
      <span style={{
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        pointerEvents: 'none',
        color: '#94a3b8',
        fontSize: '10px'
      }}>
        ▼
      </span>

      {/* Lista Flutuante */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          marginTop: '4px',
          maxHeight: '220px',
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
        }}>
          {opcoesFiltradas.length === 0 ? (
            <div style={{ padding: '10px', fontSize: '12px', color: '#64748b', textAlign: 'center' }}>
              Nenhuma opção encontrada
            </div>
          ) : (
            opcoesFiltradas.map(opt => {
              const isSelected = opt.id.toString() === value?.toString();
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setBusca('');
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: isSelected ? '#1e3a8a' : '#334155',
                    backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'background-color 0.15s'
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {opt.label}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
