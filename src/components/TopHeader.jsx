import {
  Bell,
  Calendar,
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
} from 'lucide-react';
import { moduleDefinitions } from '../data/siscaritasMock';

const MODULE_ICONS = {
  dashboard: Home,
  personas: Users,
  social: Leaf,
  clinica: Building2,
  farmacia: Pill,
  productos: Package,
  finanzas: DollarSign,
  reportes: BarChart2,
  administracion: Settings,
  configuracion: Sliders,
};

const MODULE_SUBTITLES = {
  personas: 'Gestión de personas y roles',
  social: 'Campañas, proyectos y donaciones',
  clinica: 'Atención médica y pacientes',
  farmacia: 'Farmacia y medicamentos',
  productos: 'Catálogo de servicios y productos',
  finanzas: 'Control financiero',
  reportes: 'Reportes y analítica',
  administracion: 'Gestión administrativa',
  configuracion: 'Apariencia, seguridad, perfil y sistema',
};

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  usuarios: 'Usuarios Sistema',
  beneficiarios: 'Beneficiarios',
  voluntarios: 'Voluntarios',
  pacientes: 'Pacientes',
  'personal-medico': 'Personal Médico',
  'cli-personal-medico': 'Personal Médico',
  proveedores: 'Proveedores',
  proyectos: 'Proyectos',
  campanas: 'Campañas',
  distribuciones: 'Distribuciones',
  'beneficiarios-atendidos': 'Beneficiarios Atendidos',
  donaciones: 'Donaciones',
  'atencion-medica': 'Atención Médica',
  consultas: 'Consultas',
  terapias: 'Terapias',
  tratamientos: 'Tratamientos',
  laboratorio: 'Laboratorio',
  'pruebas-lab': 'Pruebas Laboratorio',
  'kits-lab': 'Kits Laboratorio',
  especialidades: 'Especialidades',
  medicamentos: 'Medicamentos',
  'ventas-farmacia': 'Ventas Farmacia',
  'compras-farmacia': 'Compras Farmacia',
  'inventario-farmacia': 'Inventario Farmacia',
  'movimientos-farm': 'Movimientos',
  'alertas-stock': 'Alertas de Stock',
  'prod-tratamientos': 'Tratamientos',
  'prod-consultas': 'Consultas',
  'prod-terapias': 'Terapias',
  'prod-medicamentos': 'Medicamentos',
  'prod-kits-lab': 'Kits Laboratorio',
  ingresos: 'Ingresos',
  egresos: 'Egresos',
  gastos: 'Gastos',
  compras: 'Compras',
  balance: 'Balance General',
  'flujo-caja': 'Flujo de Caja',
  'rep-ventas': 'Ventas Médicas',
  'rep-compras': 'Compras Médicas',
  'rep-laboratorio': 'Laboratorio',
  'rep-productos': 'Productos',
  'rep-tratamientos': 'Tratamientos',
  'rep-consultas': 'Consultas',
  'rep-terapias': 'Terapias',
  'rep-pacientes': 'Pacientes',
  ranking: 'Ranking',
  'adm-especialidades': 'Especialidades',
  'tipo-cliente': 'Tipo de Cliente',
  'precios-terapias': 'Precios de Terapias',
  'precios-consultas': 'Precios de Consultas',
  'adm-pruebas-lab': 'Pruebas Laboratorio',
  'adm-kits-lab': 'Kits Laboratorio',
  'precios-productos': 'Precios de Productos',
  'adm-compras': 'Compras',
  'config-apariencia': 'Temas y Apariencia',
  'config-notificaciones': 'Notificaciones',
  'config-seguridad': 'Privacidad y Seguridad',
  'config-perfil': 'Perfil de Usuario',
  'config-sistema': 'Sistema e Integraciones',
  'config-general': 'Configuración General',
};

function formatDate() {
  const d = new Date();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
}

export function TopHeader({ activeModule, activePage }) {
  const pageLabel = moduleDefinitions[activePage]?.title || PAGE_LABELS[activePage] || PAGE_LABELS[activeModule] || 'Panel';
  const ModuleIcon = MODULE_ICONS[activeModule] || Home;
  const subtitle = MODULE_SUBTITLES[activeModule] || '';

  return (
    <header className="top-header">
      <div className="header-title-block">
        <div className="header-title-icon">
          <ModuleIcon size={18} />
        </div>
        <div>
          <h2 className="header-title">{pageLabel}</h2>
          {subtitle && <span className="header-subtitle">{subtitle}</span>}
        </div>
      </div>
      <div className="header-spacer" />
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
