import { useState, useRef, useEffect } from 'react';
import {
  Home,
  Users,
  Leaf,
  Building2,
  Pill,
  Package,
  DollarSign,
  BarChart2,
  Settings,
  Sliders,
  User,
  LogOut,
  ArrowLeftRight,
  ChevronUp,
} from 'lucide-react';
import logoCaritas from '../assets/logo_caritas.jpeg';

const modules = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'personas', icon: Users, label: 'Personas' },
  { id: 'social', icon: Leaf, label: 'Social' },
  { id: 'clinica', icon: Building2, label: 'Clínica' },
  { id: 'farmacia', icon: Pill, label: 'Farmacia' },
  { id: 'productos', icon: Package, label: 'Productos' },
  { id: 'finanzas', icon: DollarSign, label: 'Finanzas' },
  { id: 'reportes', icon: BarChart2, label: 'Reportes' },
  { id: 'administracion', icon: Settings, label: 'Administración' },
  { id: 'configuracion', icon: Sliders, label: 'Configuración' },
];

export function IconSidebar({ activeModule, onSelectModule, user, onLogout }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileOpen]);

  const userName = user?.email?.split('@')[0] || 'Usuario';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);
  const initials = displayName.slice(0, 2).toUpperCase();
  const userRole = user?.role || 'USUARIO';

  return (
    <aside className="icon-sidebar">
      {/* Brand area with Cáritas logo image */}
      <div className="brand">
        <div className="brand-logo-container">
          <div className="brand-logo-circle">
            <img src={logoCaritas} alt="Cáritas" className="brand-logo-img" />
          </div>
          <span className="brand-name">SisCaritas</span>
          <span className="brand-version">v2.0</span>
        </div>
      </div>

      <nav>
        {modules.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            title={label}
            className={`icon-nav-btn${activeModule === id ? ' active' : ''}`}
            onClick={() => onSelectModule(id)}
          >
            <Icon size={18} />
          </button>
        ))}
      </nav>

      <div className="bottom" ref={popoverRef}>
        <button
          className={`icon-nav-btn profile-trigger${profileOpen ? ' active' : ''}`}
          title="Perfil"
          onClick={() => setProfileOpen((v) => !v)}
        >
          <div className="sidebar-avatar">{initials}</div>
          <ChevronUp size={10} className={`profile-chevron${profileOpen ? ' open' : ''}`} />
        </button>

        {/* Profile popover — appears next to the avatar icon */}
        {profileOpen && (
          <div className="profile-popover">
            <div className="profile-popover-header">
              <div className="profile-popover-avatar">
                {initials}
              </div>
              <div className="profile-popover-info">
                <strong>{displayName}</strong>
                <span className="profile-popover-role">{userRole}</span>
              </div>
            </div>
            <div className="profile-popover-divider" />
            <div className="profile-popover-actions">
              <button className="profile-popover-btn" onClick={() => setProfileOpen(false)}>
                <User size={15} />
                Ver Perfil
              </button>
              <button className="profile-popover-btn" onClick={() => setProfileOpen(false)}>
                <ArrowLeftRight size={15} />
                Iniciar con otra cuenta
              </button>
              <div className="profile-popover-divider" />
              <button className="profile-popover-btn danger" onClick={() => { setProfileOpen(false); onLogout?.(); }}>
                <LogOut size={15} />
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
