import { Search, Bell, Calendar } from 'lucide-react';
import { moduleDefinitions } from '../data/siscaritasMock';

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  usuarios: 'Usuarios Sistema',
  beneficiarios: 'Beneficiarios',
  voluntarios: 'Voluntarios',
  pacientes: 'Pacientes',
  medicos: 'Personal Médico',
  proveedores: 'Proveedores',
  proyectos: 'Proyectos',
  campanas: 'Campañas',
  distribuciones: 'Distribuciones',
  donantes: 'Donantes',
  donaciones: 'Donaciones',
  medicamentos: 'Medicamentos',
  productos: 'Productos',
  ingresos: 'Ingresos',
  egresos: 'Egresos',
  balance: 'Balance General',
};

function formatDate() {
  const d = new Date();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

export function TopHeader({ activeModule, activePage }) {
  const pageLabel = moduleDefinitions[activePage]?.title || PAGE_LABELS[activePage] || PAGE_LABELS[activeModule] || 'Panel';
  const moduleLabel = activeModule.charAt(0).toUpperCase() + activeModule.slice(1);

  return (
    <header className="top-header">
      <nav className="breadcrumb">
        <span>Inicio</span>
        <span className="sep">/</span>
        <span className="current">{pageLabel || moduleLabel}</span>
      </nav>
      <div className="header-spacer" />
      <div className="search-box">
        <Search size={13} color="var(--text-light)" />
        <input type="text" placeholder="Buscar..." />
      </div>
      <div className="header-actions">
        <button className="header-btn" title="Notificaciones">
          <Bell size={16} />
          <span className="badge" />
        </button>
        <div className="date-chip">
          <Calendar size={13} />
          {formatDate()}
        </div>
      </div>
    </header>
  );
}
