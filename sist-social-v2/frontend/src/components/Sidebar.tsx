import { useState, useEffect } from 'react';
import * as Lucide from 'lucide-react';

interface SubmenuItem {
  id: number;
  nome: string;
  url: string;
  icone: string;
  ordem: number;
}

interface MenuItem {
  id: number;
  nome: string;
  url: string;
  icone: string;
  ordem: number;
  submenus: SubmenuItem[];
}

interface SidebarProps {
  onLogout: () => void;
  activeTab?: string;
  onChangeTab?: (tab: string) => void;
}

export default function Sidebar({ onLogout, activeTab, onChangeTab }: SidebarProps) {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  // Estado para controlar submenus abertos/expandidos no menu lateral
  const [submenusAbertos, setSubmenusAbertos] = useState<Record<number, boolean>>({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/menus/`, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Erro ao buscar menus');
        return res.json();
      })
      .then((data: MenuItem[]) => {
        setMenus(data);
        setSubmenusAbertos({}); // Inicia tudo recolhido por padrão
      })
      .catch((err) => {
        console.error('Erro ao carregar menu dinâmico:', err);
      })
      .finally(() => {
        setCarregando(false);
      });
  }, [API_URL]);

  const toggleSubmenu = (menuId: number) => {
    setSubmenusAbertos(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Função auxiliar para renderizar ícones dinamicamente pelo nome
  const renderIcon = (iconName: string, size = 18) => {
    const IconComponent = (Lucide as any)[iconName];
    if (IconComponent) {
      return <IconComponent size={size} />;
    }
    // Ícone padrão caso o nome esteja incorreto ou vazio
    return <Lucide.Menu size={size} />;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Lucide.TrendingUp size={24} className="logo-icon" />
          <span className="logo-text">SistSocial</span>
        </div>
      </div>

      <nav className="sidebar-nav" style={{ overflowY: 'auto' }}>
        {carregando ? (
          <div style={{ color: '#94a3b8', padding: '16px', fontSize: '13px', textAlign: 'center' }}>
            Carregando menu...
          </div>
        ) : menus.length === 0 ? (
          <div style={{ color: '#64748b', padding: '24px 16px', fontSize: '13px', textAlign: 'center', fontStyle: 'italic' }}>
            Nenhum menu configurado
          </div>
        ) : (
          menus.map((item) => {
            const temSubmenus = item.submenus && item.submenus.length > 0;
            const isAberto = !!submenusAbertos[item.id];
            
            // Um item é ativo se ele mesmo for a aba ativa ou se algum de seus submenus for a aba ativa
            const isPaiAtivo = activeTab === item.url || 
              (temSubmenus && item.submenus.some(sub => activeTab === sub.url));

            return (
              <div key={item.id} className="menu-group">
                {/* Item Principal */}
                {temSubmenus ? (
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`nav-item ${isPaiAtivo ? 'active-parent' : ''}`}
                    style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {renderIcon(item.icone)}
                      <span>{item.nome}</span>
                    </div>
                    {isAberto ? <Lucide.ChevronDown size={14} /> : <Lucide.ChevronRight size={14} />}
                  </button>
                ) : (
                  <a
                    href={`#${item.url}`}
                    onClick={() => {
                      if (onChangeTab && item.url) onChangeTab(item.url);
                    }}
                    className={`nav-item ${activeTab === item.url ? 'active' : ''}`}
                  >
                    {renderIcon(item.icone)}
                    <span>{item.nome}</span>
                  </a>
                )}

                {/* Submenus Aninhados */}
                {temSubmenus && isAberto && (
                  <div className="submenu-list" style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    {item.submenus.map((sub) => (
                      <a
                        key={sub.id}
                        href={`#${sub.url}`}
                        onClick={() => {
                          if (onChangeTab && sub.url) onChangeTab(sub.url);
                        }}
                        className={`nav-item submenu-item ${activeTab === sub.url ? 'active' : ''}`}
                        style={{ fontSize: '0.875rem', padding: '8px 12px' }}
                      >
                        {renderIcon(sub.icone, 16)}
                        <span>{sub.nome}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="btn-logout">
          <Lucide.LogOut size={18} />
          <span>Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
}
