import { Home, Users, Heart, Hospital, Pill, Package, DollarSign, ShoppingCart, BarChart2, Settings, LogOut, User } from 'lucide-react';

const modules = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'personas', icon: Users, label: 'Personas' },
  { id: 'social', icon: Heart, label: 'Social' },
  { id: 'donaciones', icon: Heart, label: 'Donaciones' },
  { id: 'clinica', icon: Hospital, label: 'Clínica' },
  { id: 'farmacia', icon: Pill, label: 'Farmacia' },
  { id: 'inventario', icon: Package, label: 'Inventario' },
  { id: 'finanzas', icon: DollarSign, label: 'Finanzas' },
  { id: 'ventas', icon: ShoppingCart, label: 'Ventas' },
  { id: 'reportes', icon: BarChart2, label: 'Reportes' },
  { id: 'administracion', icon: Settings, label: 'Administración' },
];

export function IconSidebar({ activeModule, onSelectModule }) {
  return (
    <aside className="icon-sidebar">
      <div className="brand">
        <div className="brand-logo">SC</div>
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
      <div className="bottom">
        <button className="icon-nav-btn" title="Perfil">
          <User size={17} />
        </button>
        <button className="icon-nav-btn" title="Cerrar Sesión">
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
}
