import { X, Users, Heart, Hospital, Pill, Package, DollarSign, ShoppingCart, BarChart2, Settings, User, Layers, Gift } from 'lucide-react';

const MENUS = {
  dashboard: { title: 'Dashboard', items: [] },
  personas: {
    title: 'Personas',
    items: [
      { id: 'usuarios', label: 'Usuarios Sistema', icon: User },
      { id: 'beneficiarios', label: 'Beneficiarios', icon: Users },
      { id: 'voluntarios', label: 'Voluntarios', icon: Heart },
      { id: 'pacientes', label: 'Pacientes', icon: User },
      { id: 'medicos', label: 'Personal Médico', icon: Hospital },
      { id: 'proveedores', label: 'Proveedores', icon: Package },
    ],
  },
  social: {
    title: 'Social',
    items: [
      { id: 'proyectos', label: 'Proyectos', icon: Layers },
      { id: 'campanas', label: 'Campañas', icon: Heart },
      { id: 'campanas-salud', label: 'Campañas Salud', icon: Hospital },
      { id: 'distribuciones', label: 'Distribuciones', icon: Package },
      { id: 'beneficiarios-atendidos', label: 'Beneficiarios Atendidos', icon: Users },
    ],
  },
  donaciones: {
    title: 'Donaciones',
    items: [
      { id: 'donantes', label: 'Donantes', icon: User },
      { id: 'donaciones', label: 'Donaciones', icon: Gift },
      { id: 'campanas-solidarias', label: 'Campañas Solidarias', icon: Heart },
    ],
  },
  clinica: {
    title: 'Clínica',
    items: [
      { id: 'atencion-medica', label: 'Atención Médica', icon: Hospital },
      { id: 'consultas', label: 'Consultas', icon: Hospital },
      { id: 'terapias', label: 'Terapias', icon: Hospital },
      { id: 'tratamientos', label: 'Tratamientos', icon: Hospital },
      { id: 'laboratorio', label: 'Laboratorio', icon: Hospital },
      { id: 'pruebas-lab', label: 'Pruebas Laboratorio', icon: Hospital },
      { id: 'kits-lab', label: 'Kits Laboratorio', icon: Package },
      { id: 'especialidades', label: 'Especialidades', icon: Hospital },
      { id: 'personal-medico', label: 'Personal Médico', icon: User },
    ],
  },
  farmacia: {
    title: 'Farmacia',
    items: [
      { id: 'medicamentos', label: 'Medicamentos', icon: Pill },
      { id: 'ventas-farmacia', label: 'Ventas Farmacia', icon: ShoppingCart },
      { id: 'compras-farmacia', label: 'Compras Farmacia', icon: Package },
      { id: 'inventario-farmacia', label: 'Inventario Farmacia', icon: Package },
      { id: 'movimientos-farm', label: 'Movimientos', icon: Layers },
      { id: 'alertas-stock', label: 'Alertas Stock', icon: Heart },
    ],
  },
  inventario: {
    title: 'Inventario',
    items: [
      { id: 'productos', label: 'Productos', icon: Package },
      { id: 'inventario-general', label: 'Inventario General', icon: Layers },
      { id: 'entradas', label: 'Entradas', icon: Package },
      { id: 'salidas', label: 'Salidas', icon: Package },
      { id: 'ajustes', label: 'Ajustes', icon: Settings },
      { id: 'movimientos-inv', label: 'Movimientos', icon: Layers },
    ],
  },
  finanzas: {
    title: 'Finanzas',
    items: [
      { id: 'ingresos', label: 'Ingresos', icon: DollarSign },
      { id: 'egresos', label: 'Egresos', icon: DollarSign },
      { id: 'gastos', label: 'Gastos', icon: DollarSign },
      { id: 'compras', label: 'Compras', icon: ShoppingCart },
      { id: 'balance', label: 'Balance General', icon: BarChart2 },
      { id: 'flujo-caja', label: 'Flujo Caja', icon: DollarSign },
    ],
  },
  ventas: {
    title: 'Ventas',
    items: [
      { id: 'ventas-clinicas', label: 'Ventas Clínicas', icon: ShoppingCart },
      { id: 'ventas-farmacia2', label: 'Ventas Farmacia', icon: Pill },
      { id: 'terapias-v', label: 'Terapias', icon: Hospital },
      { id: 'consultas-v', label: 'Consultas', icon: Hospital },
      { id: 'laboratorio-v', label: 'Laboratorio', icon: Hospital },
      { id: 'comprobantes', label: 'Comprobantes', icon: Layers },
    ],
  },
  reportes: {
    title: 'Reportes',
    items: [
      { id: 'rep-ventas', label: 'Reporte Ventas', icon: BarChart2 },
      { id: 'rep-venta-medicamentos', label: 'Venta Medicamentos', icon: Pill },
      { id: 'rep-venta-terapias', label: 'Venta Terapias', icon: Hospital },
      { id: 'rep-venta-tratamientos', label: 'Venta Tratamientos', icon: Hospital },
      { id: 'rep-financiero', label: 'Reporte Financiero', icon: DollarSign },
      { id: 'rep-pacientes', label: 'Reporte Pacientes', icon: User },
      { id: 'rep-beneficiarios', label: 'Reporte Beneficiarios', icon: Users },
      { id: 'rep-inventario', label: 'Reporte Inventario', icon: Package },
      { id: 'rep-donaciones', label: 'Reporte Donaciones', icon: Gift },
      { id: 'rep-campanas', label: 'Reporte Campañas', icon: Heart },
      { id: 'ranking', label: 'Ranking', icon: BarChart2 },
    ],
  },
  administracion: {
    title: 'Administración',
    items: [
      { id: 'adm-especialidades', label: 'Especialidades', icon: Hospital },
      { id: 'tipo-cliente', label: 'Tipo Cliente', icon: User },
      { id: 'precios-terapias', label: 'Precios Terapias', icon: DollarSign },
      { id: 'precios-consultas', label: 'Precios Consultas', icon: DollarSign },
      { id: 'precios-productos', label: 'Precios Productos', icon: Package },
      { id: 'roles', label: 'Roles y Permisos', icon: Settings },
      { id: 'seguridad', label: 'Seguridad', icon: Settings },
      { id: 'auditoria', label: 'Auditoría', icon: Layers },
      { id: 'configuracion', label: 'Configuración', icon: Settings },
    ],
  },
};

export function PanelSidebar({ activeModule, activePage, onSelectPage, onClose }) {
  const menu = MENUS[activeModule];
  if (!menu || menu.items.length === 0) return null;

  return (
    <aside className="panel-sidebar">
      <div className="panel-header">
        <span className="panel-title">{menu.title}</span>
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
            <Icon size={13} />
            {label}
          </button>
        ))}
      </nav>
      {activeModule === 'personas' && (
        <div style={{ padding: '8px 14px 10px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-light)', background: 'var(--bg)', borderRadius: '6px', padding: '6px 10px', textAlign: 'center' }}>
            Módulo: Personas
          </div>
        </div>
      )}
    </aside>
  );
}
