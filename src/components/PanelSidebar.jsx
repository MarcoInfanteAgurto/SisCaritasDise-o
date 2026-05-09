import {
  X, Users, User, Heart, Hospital, Package, Layers, Gift,
  Building2, Pill, ShoppingCart, DollarSign, BarChart2, Settings,
  Sliders, Palette, Lock, Bell, Shield, Globe, FileText,
  Database, Eye, Monitor, Clock, Key, UserCheck, Leaf,
  Stethoscope, TestTube, FlaskConical, Clipboard, AlertTriangle,
  ArrowRightLeft, TrendingUp, TrendingDown, Receipt, Wallet,
  CreditCard, PieChart, Activity, Star, Tag, BadgeDollarSign,
} from 'lucide-react';

const MENUS = {
  dashboard: { title: 'Dashboard', icon: null, desc: '', items: [] },
  personas: {
    title: 'Personas',
    icon: Users,
    desc: 'Gestión de usuarios y contactos',
    items: [
      { id: 'usuarios', label: 'Usuarios Sistema', icon: Key },
      { id: 'beneficiarios', label: 'Beneficiarios', icon: Users },
      { id: 'voluntarios', label: 'Voluntarios', icon: Heart },
      { id: 'pacientes', label: 'Pacientes', icon: User },
      { id: 'personal-medico', label: 'Personal Médico', icon: Stethoscope },
      { id: 'proveedores', label: 'Proveedores', icon: Package },
    ],
  },
  social: {
    title: 'Social',
    icon: Leaf,
    desc: 'Proyectos y asistencia social',
    items: [
      { id: 'proyectos', label: 'Proyectos', icon: Layers },
      { id: 'campanas', label: 'Campañas', icon: Heart },
      { id: 'distribuciones', label: 'Distribuciones', icon: Package },
      { id: 'beneficiarios-atendidos', label: 'Beneficiarios Atendidos', icon: Users },
      { id: 'donaciones', label: 'Donaciones', icon: Gift },
    ],
  },
  clinica: {
    title: 'Clínica',
    icon: Building2,
    desc: 'Atención médica y pacientes',
    items: [
      { id: 'atencion-medica', label: 'Atención Médica', icon: Stethoscope },
      { id: 'consultas', label: 'Consultas', icon: Clipboard },
      { id: 'terapias', label: 'Terapias', icon: Activity },
      { id: 'tratamientos', label: 'Tratamientos', icon: Hospital },
      { id: 'laboratorio', label: 'Laboratorio', icon: FlaskConical },
      { id: 'pruebas-lab', label: 'Pruebas Laboratorio', icon: TestTube },
      { id: 'kits-lab', label: 'Kits Laboratorio', icon: Package },
      { id: 'especialidades', label: 'Especialidades', icon: Star },
      { id: 'cli-personal-medico', label: 'Personal Médico', icon: Stethoscope },
    ],
  },
  farmacia: {
    title: 'Farmacia',
    icon: Pill,
    desc: 'Medicamentos e inventario',
    items: [
      { id: 'medicamentos', label: 'Medicamentos', icon: Pill },
      { id: 'ventas-farmacia', label: 'Ventas Farmacia', icon: ShoppingCart },
      { id: 'compras-farmacia', label: 'Compras Farmacia', icon: Receipt },
      { id: 'inventario-farmacia', label: 'Inventario Farmacia', icon: Database },
      { id: 'movimientos-farm', label: 'Movimientos', icon: ArrowRightLeft },
      { id: 'alertas-stock', label: 'Alertas de Stock', icon: AlertTriangle },
    ],
  },
  productos: {
    title: 'Productos',
    icon: Package,
    desc: 'Catálogo de servicios',
    items: [
      { id: 'prod-tratamientos', label: 'Tratamientos', icon: Hospital },
      { id: 'prod-consultas', label: 'Consultas', icon: Clipboard },
      { id: 'prod-terapias', label: 'Terapias', icon: Activity },
      { id: 'prod-medicamentos', label: 'Medicamentos', icon: Pill },
      { id: 'prod-kits-lab', label: 'Kits Laboratorio', icon: Package },
    ],
  },
  finanzas: {
    title: 'Finanzas',
    icon: DollarSign,
    desc: 'Ingresos, egresos y balance',
    items: [
      { id: 'ingresos', label: 'Ingresos', icon: TrendingUp },
      { id: 'egresos', label: 'Egresos', icon: TrendingDown },
      { id: 'gastos', label: 'Gastos', icon: Wallet },
      { id: 'compras', label: 'Compras', icon: ShoppingCart },
      { id: 'balance', label: 'Balance General', icon: PieChart },
      { id: 'flujo-caja', label: 'Flujo de Caja', icon: CreditCard },
    ],
  },
  reportes: {
    title: 'Reportes',
    icon: BarChart2,
    desc: 'Análisis y estadísticas',
    items: [
      { id: 'rep-ventas', label: 'Ventas Médicas', icon: BarChart2 },
      { id: 'rep-compras', label: 'Compras Médicas', icon: Receipt },
      { id: 'rep-laboratorio', label: 'Laboratorio', icon: FlaskConical },
      { id: 'rep-productos', label: 'Productos', icon: Package },
      { id: 'rep-tratamientos', label: 'Tratamientos', icon: Hospital },
      { id: 'rep-consultas', label: 'Consultas', icon: Clipboard },
      { id: 'rep-terapias', label: 'Terapias', icon: Activity },
      { id: 'rep-pacientes', label: 'Pacientes', icon: User },
      { id: 'ranking', label: 'Ranking', icon: Star },
    ],
  },
  administracion: {
    title: 'Administración',
    icon: Settings,
    desc: 'Parámetros y catálogos',
    items: [
      { id: 'adm-especialidades', label: 'Especialidades', icon: Star },
      { id: 'tipo-cliente', label: 'Tipo de Cliente', icon: Tag },
      { id: 'precios-terapias', label: 'Precios de Terapias', icon: DollarSign },
      { id: 'precios-consultas', label: 'Precios de Consultas', icon: DollarSign },
      { id: 'adm-pruebas-lab', label: 'Pruebas Laboratorio', icon: TestTube },
      { id: 'adm-kits-lab', label: 'Kits Laboratorio', icon: Package },
      { id: 'precios-productos', label: 'Precios de Productos', icon: DollarSign },
      { id: 'adm-compras', label: 'Compras', icon: ShoppingCart },
    ],
  },
  configuracion: {
    title: 'Configuración',
    icon: Sliders,
    desc: 'Apariencia, seguridad y sistema',
    items: [
      { id: 'config-apariencia', label: 'Apariencia', icon: Palette },
      { id: 'config-notificaciones', label: 'Notificaciones', icon: Bell },
      { id: 'config-seguridad', label: 'Privacidad y Seguridad', icon: Shield },
      { id: 'config-perfil', label: 'Perfil', icon: User },
      { id: 'config-sistema', label: 'Sistema', icon: Globe },
    ],
  },
};

/* Export first page IDs for auto-selection */
export const FIRST_PAGE = Object.fromEntries(
  Object.entries(MENUS)
    .filter(([, m]) => m.items.length > 0)
    .map(([key, m]) => [key, m.items[0].id])
);

export function PanelSidebar({ activeModule, activePage, onSelectPage, onClose }) {
  const menu = MENUS[activeModule];
  if (!menu || menu.items.length === 0) return null;

  const SectionIcon = menu.icon;

  return (
    <aside className="panel-sidebar">
      <div className="panel-header">
        <div className="panel-header-info">
          {SectionIcon && (
            <span className="panel-header-icon">
              <SectionIcon size={16} />
            </span>
          )}
          <div>
            <span className="panel-title">{menu.title}</span>
            {menu.desc && <span className="panel-desc">{menu.desc}</span>}
          </div>
        </div>
        <button className="panel-close" onClick={onClose}>
          <X size={14} />
        </button>
      </div>
      <nav className="panel-nav">
        {menu.items.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`panel-nav-item${activePage === id ? ' active' : ''}`}
            onClick={() => onSelectPage(id)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
