import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Plus,
  Download,
  Edit2,
  Trash2,
  Eye,
  Filter,
  X,
  SlidersHorizontal,
  Sparkles,
  BarChart3,
  CircleDollarSign,
  Rows3,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  WalletCards,
  ReceiptText,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from 'lucide-react';
import {
  applyPresetFilters,
  formatDate,
  formatMoney,
  getRowsForPage,
  moduleMetricOverrides,
  moduleDefinitions,
  statusLabels,
  statusTone,
} from '../data/siscaritasMock';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CustomSelect } from './CustomSelect';

const DEFAULT_FIELDS = [
  { key: 'nombre', label: 'Nombre', type: 'text' },
  { key: 'descripcion', label: 'Descripcion', type: 'text' },
  { key: 'status', label: 'Estado', type: 'select', options: ['ACTIVE', 'INACTIVE', 'PENDING'] },
];

const PEOPLE_TABLE_PAGES = new Set([
  'usuarios',
  'beneficiarios',
  'voluntarios',
  'medicos',
  'personal-medico',
  'pacientes',
  'rep-pacientes',
  'rep-beneficiarios',
  'roles',
  'seguridad',
]);

const FORM_FIELDS = {
  usuarios: [
    { key: 'firstName', label: 'Nombres', type: 'text' },
    { key: 'lastName', label: 'Apellidos', type: 'text' },
    { key: 'email', label: 'Email', type: 'email' },
    { key: 'role', label: 'Rol', type: 'select', options: ['ADMIN', 'COORDINADOR', 'CONTADOR', 'VOLUNTARIO'] },
    { key: 'status', label: 'Estado', type: 'select', options: ['ACTIVE', 'INACTIVE'] },
  ],
  beneficiarios: [
    { key: 'firstName', label: 'Nombres', type: 'text' },
    { key: 'lastName', label: 'Apellidos', type: 'text' },
    { key: 'dni', label: 'DNI', type: 'text' },
    { key: 'district', label: 'Distrito', type: 'text' },
    { key: 'vulnerabilityLevel', label: 'Vulnerabilidad', type: 'select', options: ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'] },
    { key: 'status', label: 'Estado', type: 'select', options: ['ACTIVE', 'INACTIVE'] },
  ],
  campanas: [
    { key: 'campaignName', label: 'Nombre de campana', type: 'text' },
    { key: 'domain', label: 'Dominio', type: 'select', options: ['SOCIAL', 'SALUD'] },
    { key: 'location', label: 'Ubicacion', type: 'text' },
    { key: 'budget', label: 'Presupuesto', type: 'number' },
    { key: 'status', label: 'Estado', type: 'select', options: ['DRAFT', 'ACTIVE', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] },
  ],
  medicamentos: [
    { key: 'denominacionComercial', label: 'Medicamento', type: 'text' },
    { key: 'categoria', label: 'Categoria', type: 'text' },
    { key: 'laboratorio', label: 'Laboratorio', type: 'text' },
    { key: 'stock', label: 'Stock', type: 'number' },
    { key: 'precioVenta', label: 'Precio venta', type: 'number' },
    { key: 'status', label: 'Estado', type: 'select', options: ['ACTIVE', 'INACTIVE'] },
  ],
  productos: [
    { key: 'productName', label: 'Producto', type: 'text' },
    { key: 'category', label: 'Categoria', type: 'select', options: ['ALIMENTOS', 'ROPA_ABRIGO', 'HIGIENE', 'UTILES_ESCOLARES', 'MEDICAMENTOS', 'OTROS'] },
    { key: 'stock', label: 'Stock', type: 'number' },
    { key: 'estimatedValue', label: 'Valor estimado', type: 'number' },
    { key: 'status', label: 'Estado', type: 'select', options: ['ACTIVE', 'INACTIVE'] },
  ],
  ventas: [
    { key: 'domain', label: 'Dominio', type: 'select', options: ['FARMACIA', 'CLINICA', 'COMPRA'] },
    { key: 'pacienteNombre', label: 'Paciente / referencia', type: 'text' },
    { key: 'tipo', label: 'Tipo', type: 'select', options: ['VENDIDO', 'DONADO', 'TERAPIA', 'TRATAMIENTO', 'CONSULTA', 'LABORATORIO', 'COMPRADO'] },
    { key: 'total', label: 'Total', type: 'number' },
    { key: 'estado', label: 'Estado', type: 'select', options: ['CONSIGNADO', 'DONADO', 'REVOCADO'] },
  ],
};

function getValue(row, key) {
  return row[key] ?? '-';
}

function isStatusKey(key) {
  return ['status', 'estado', 'deliveryStatus', 'vulnerabilityLevel'].includes(key);
}

function isMoneyKey(key) {
  return ['amount', 'total', 'estimatedValue', 'totalAmount', 'totalValue', 'budget', 'spent', 'precio', 'precioVenta', 'precioKit', 'monthlyIncome'].includes(key);
}

function displayValue(row, key) {
  const value = getValue(row, key);
  if (value === true) return 'Si';
  if (value === false) return 'No';
  if (value === null || value === undefined || value === '') return '-';
  if (isMoneyKey(key)) return formatMoney(value);
  if (key.toLowerCase().includes('date') || ['fecha', 'vencimiento', 'lastLogin', 'lastVisit'].includes(key)) {
    return formatDate(value);
  }
  return value;
}

function uniqueOptions(rows, keys) {
  const set = new Set();
  rows.forEach((row) => {
    keys.forEach((key) => {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') set.add(row[key]);
    });
  });
  return Array.from(set);
}

function numericTotal(rows, keys) {
  return rows.reduce((sum, row) => {
    const found = keys.find((key) => typeof row[key] === 'number');
    return sum + (found ? row[found] : 0);
  }, 0);
}

function formatCount(value) {
  if (value === null || value === undefined || value === '') return '-';
  return new Intl.NumberFormat('es-PE').format(Number(value));
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => (
        <span key={entry.dataKey || entry.name} style={{ color: entry.color }}>
          {entry.name || entry.dataKey}: {typeof entry.value === 'number' ? formatCount(entry.value) : entry.value}
        </span>
      ))}
    </div>
  );
}

function AvatarCell({ row, value }) {
  const label = value || row.name || row.fullName || row.patientName || row.providerName || 'Registro';
  const initials = String(label)
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
  return (
    <span className="person-cell">
      <i>{initials || 'SC'}</i>
      <span>{label}</span>
    </span>
  );
}

function StockBadge({ row }) {
  const stock = Number(row.stock ?? row.quantity ?? 0);
  const min = Number(row.stockMinimo ?? row.minStock ?? 0);
  let tone = 'ok';
  if (stock <= 0) tone = 'danger';
  else if (min > 0 && stock <= min) tone = 'danger';
  else if (min > 0 && stock <= min * 1.5) tone = 'warning';

  return (
    <span className={`stock-badge ${tone}`} title={`Stock minimo: ${min}`}>
      {formatCount(stock)}
    </span>
  );
}

function getRecordStatus(row) {
  return row.status || row.estado || row.deliveryStatus || row.vulnerabilityLevel;
}

function buildSummaryChips(rows, pageId, definition) {
  const override = moduleMetricOverrides[pageId];
  if (override) {
    const format = override.money ? formatMoney : formatCount;
    const chips = [
      { label: override.totalLabel || definition.title, value: format(override.total), tone: 'info' },
      { label: override.okLabel || 'Activos', value: format(override.ok), tone: 'success' },
      { label: override.inactiveLabel || 'Inactivos', value: format(override.inactive), tone: override.money ? 'warning' : 'danger' },
      ...(override.alert || override.money
        ? [{ label: override.alertLabel || 'Alertas', value: format(override.alert), tone: override.money ? 'danger' : 'warning' }]
        : []),
    ];
    if (!override.money) return [chips[0], chips[2], chips[1], ...chips.slice(3)];
    return chips;
  }

  const activeStatuses = new Set(['ACTIVE', 'COMPLETED', 'APPROVED', 'PAID', 'CONSIGNADO', 'AVAILABLE', 'ENTREGADO', 'RECEIVED']);
  const inactiveStatuses = new Set(['INACTIVE', 'CANCELLED', 'REJECTED', 'REVOCADO', 'SUSPENDED', 'OUT_OF_STOCK', 'EXPIRED']);
  const active = rows.filter((row) => activeStatuses.has(getRecordStatus(row))).length;
  const inactive = rows.filter((row) => inactiveStatuses.has(getRecordStatus(row))).length;
  return [
    { label: definition.title, value: formatCount(rows.length), tone: 'info' },
    { label: 'Inactivos', value: formatCount(inactive), tone: 'danger' },
    { label: 'Activos', value: formatCount(active), tone: 'success' },
  ];
}

function countBy(rows, key, fallback = 'Sin dato') {
  return Object.entries(
    rows.reduce((acc, row) => {
      const value = row[key] || fallback;
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
}

function topRows(rows, valueKey, limit = 6) {
  return [...rows]
    .sort((a, b) => Number(b[valueKey] || 0) - Number(a[valueKey] || 0))
    .slice(0, limit);
}

function average(rows, key) {
  if (!rows.length) return 0;
  return rows.reduce((sum, row) => sum + Number(row[key] || 0), 0) / rows.length;
}

function sumBy(rows, key, valueKey) {
  return Object.entries(
    rows.reduce((acc, row) => {
      const bucket = row[key] || 'Sin dato';
      acc[bucket] = (acc[bucket] || 0) + Number(row[valueKey] || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
}

function buildSeries(rows, options = {}) {
  const {
    dateKey = 'fecha',
    incomeWhen = (row) => row.transactionType === 'INGRESO' || row.domain === 'FARMACIA' || row.domain === 'CLINICA',
    amountKeys = ['amount', 'total', 'estimatedValue', 'totalValue'],
  } = options;

  const grouped = rows.reduce((acc, row) => {
    const rawDate = row[dateKey] || row.transactionDate || row.donationDate || row.attentionDate;
    if (!rawDate) return acc;
    const label = String(rawDate).slice(5, 10);
    if (!acc[label]) acc[label] = { label, ingresos: 0, egresos: 0 };
    const amountKey = amountKeys.find((key) => Number.isFinite(Number(row[key])));
    const amount = Number(row[amountKey] || 0);
    if (incomeWhen(row)) acc[label].ingresos += amount;
    else acc[label].egresos += amount;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => a.label.localeCompare(b.label));
}

const FINANCIAL_PAGES = new Set([
  'ingresos',
  'egresos',
  'gastos',
  'compras',
  'balance',
  'flujo-caja',
  'rep-financiero',
  'rep-ventas',
  'rep-venta-medicamentos',
  'rep-venta-terapias',
  'rep-venta-tratamientos',
  'ventas-clinicas',
  'ventas-farmacia',
  'ventas-farmacia2',
  'terapias',
  'terapias-v',
  'consultas',
  'consultas-v',
  'laboratorio',
  'laboratorio-v',
  'comprobantes',
]);

function ModuleInsights({ rows, pageId, definition }) {
  if (!rows.length) return null;

  const sharedColors = ['#c0392b', '#0f766e', '#2196F3', '#FF9800', '#9C27B0', '#64748b'];
  const presets = {
    usuarios: {
      segmentTitle: 'Distribución de roles',
      segmentData: countBy(rows, 'role'),
      barTitle: 'Accesos por estado',
      barData: countBy(rows, 'status'),
      summaryTitle: 'Gobierno de acceso',
      summaryItems: [
        { label: 'Administradores', value: rows.filter((row) => row.role === 'ADMIN').length },
        { label: 'Voluntariado con cuenta', value: rows.filter((row) => row.role === 'VOLUNTARIO').length },
        { label: 'Últimos accesos', value: rows.filter((row) => row.lastLogin).length },
      ],
    },
    beneficiarios: {
      segmentTitle: 'Nivel de vulnerabilidad',
      segmentData: countBy(rows, 'vulnerabilityLevel'),
      barTitle: 'Distritos con mayor demanda',
      barData: countBy(rows, 'district').slice(0, 6),
      summaryTitle: 'Perfil social',
      summaryItems: [
        { label: 'Ingreso promedio', value: formatMoney(average(rows, 'monthlyIncome')) },
        { label: 'Familia promedio', value: `${average(rows, 'familyMembers').toFixed(1)} miembros` },
        { label: 'Casos críticos', value: rows.filter((row) => row.vulnerabilityLevel === 'CRITICA').length },
      ],
    },
    voluntarios: {
      segmentTitle: 'Estado del voluntariado',
      segmentData: countBy(rows, 'status'),
      barTitle: 'Ranking de horas trabajadas',
      barData: topRows(rows, 'hoursWorked', 6).map((row) => ({ name: row.fullName, value: Number(row.hoursWorked || 0) })),
      summaryTitle: 'Capacidad operativa',
      summaryItems: [
        { label: 'Horas acumuladas', value: `${numericTotal(rows, ['hoursWorked'])} h` },
        { label: 'Rating promedio', value: average(rows, 'rating').toFixed(1) },
        { label: 'Campañas cubiertas', value: numericTotal(rows, ['campaigns']) },
      ],
    },
    proyectos: {
      segmentTitle: 'Estado del portafolio',
      segmentData: countBy(rows, 'status'),
      barTitle: 'Ejecución presupuestal',
      barData: topRows(rows, 'spent', 6).map((row) => ({ name: row.projectName, value: Number(row.spent || 0) })),
      summaryTitle: 'Gestión de proyectos',
      summaryItems: [
        { label: 'Presupuesto total', value: formatMoney(numericTotal(rows, ['budget'])) },
        { label: 'Gasto ejecutado', value: formatMoney(numericTotal(rows, ['spent'])) },
        { label: 'Fondos por cerrar', value: formatMoney(numericTotal(rows, ['budget']) - numericTotal(rows, ['spent'])) },
      ],
    },
    campanas: {
      segmentTitle: 'Campañas por dominio',
      segmentData: countBy(rows, 'domain'),
      barTitle: 'Cobertura o meta lograda',
      barData: rows.slice(0, 6).map((row) => ({
        name: row.campaignName,
        value: Number((row.currentBeneficiaries || row.actualBeneficiaries || row.currentAmount || 0)),
      })),
      summaryTitle: 'Impacto de campaña',
      summaryItems: [
        { label: 'Sociales activas', value: rows.filter((row) => row.domain === 'SOCIAL' && row.status === 'ACTIVE').length },
        { label: 'Salud en ejecución', value: rows.filter((row) => row.domain === 'SALUD' && ['ACTIVE', 'IN_PROGRESS', 'COMPLETED'].includes(row.status)).length },
        { label: 'Ejecución total', value: formatMoney(numericTotal(rows, ['spent'])) },
      ],
    },
    donantes: {
      segmentTitle: 'Base de donantes',
      segmentData: countBy(rows, 'donorType'),
      barTitle: 'Top aportantes',
      barData: topRows(rows, 'totalAmount', 6).map((row) => ({ name: row.name, value: Number(row.totalAmount || 0) })),
      summaryTitle: 'Relación con aportantes',
      summaryItems: [
        { label: 'Total donado', value: formatMoney(numericTotal(rows, ['totalAmount'])) },
        { label: 'Frecuencia media', value: average(rows, 'totalDonations').toFixed(1) },
        { label: 'Empresas activas', value: rows.filter((row) => row.donorType === 'EMPRESA' && row.status === 'ACTIVE').length },
      ],
    },
    donaciones: {
      segmentTitle: 'Tipo de donación',
      segmentData: countBy(rows, 'donationType'),
      barTitle: 'Campañas financiadas',
      barData: sumBy(rows, 'campaign', 'estimatedValue').slice(0, 6),
      summaryTitle: 'Trazabilidad de entrega',
      summaryItems: [
        { label: 'Valor recibido', value: formatMoney(numericTotal(rows, ['estimatedValue'])) },
        { label: 'Con recibo', value: rows.filter((row) => row.receiptIssued).length },
        { label: 'Pendientes', value: rows.filter((row) => row.status === 'PENDING').length },
      ],
    },
    medicamentos: {
      segmentTitle: 'Farmacia por categoría',
      segmentData: countBy(rows, 'categoria'),
      barTitle: 'Stock por medicamento',
      barData: topRows(rows, 'stock', 6).map((row) => ({ name: row.denominacionComercial, value: Number(row.stock || 0) })),
      summaryTitle: 'Riesgo farmacéutico',
      summaryItems: [
        { label: 'Stock crítico', value: rows.filter((row) => Number(row.stock) <= Number(row.stockMinimo)).length },
        { label: 'Valor venta visible', value: formatMoney(numericTotal(rows, ['precioVenta'])) },
        { label: 'Laboratorios activos', value: new Set(rows.map((row) => row.laboratorio)).size },
      ],
    },
    productos: {
      segmentTitle: 'Productos por categoría',
      segmentData: countBy(rows, 'category'),
      barTitle: 'Stock social por producto',
      barData: topRows(rows, 'stock', 6).map((row) => ({ name: row.productName, value: Number(row.stock || 0) })),
      summaryTitle: 'Cobertura de almacén',
      summaryItems: [
        { label: 'Valor estimado', value: formatMoney(numericTotal(rows, ['estimatedValue'])) },
        { label: 'Bajo mínimo', value: rows.filter((row) => Number(row.stock) <= Number(row.minStock)).length },
        { label: 'Unidades visibles', value: formatCount(numericTotal(rows, ['stock'])) },
      ],
    },
    'inventario-general': {
      segmentTitle: 'Estado de inventario',
      segmentData: countBy(rows, 'status'),
      barTitle: 'Valor por producto',
      barData: topRows(rows, 'totalValue', 6).map((row) => ({ name: row.productName, value: Number(row.totalValue || 0) })),
      summaryTitle: 'Lectura de almacenes',
      summaryItems: [
        { label: 'Valor total', value: formatMoney(numericTotal(rows, ['totalValue'])) },
        { label: 'Ubicaciones activas', value: new Set(rows.map((row) => row.warehouseLocation)).size },
        { label: 'Items críticos', value: rows.filter((row) => ['LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRED'].includes(row.status)).length },
      ],
    },
    distribuciones: {
      segmentTitle: 'Entrega por estado',
      segmentData: countBy(rows, 'deliveryStatus'),
      barTitle: 'Distribuciones de mayor valor',
      barData: topRows(rows, 'totalValue', 6).map((row) => ({ name: row.beneficiaryName, value: Number(row.totalValue || 0) })),
      summaryTitle: 'Cobertura logística',
      summaryItems: [
        { label: 'Items entregados', value: numericTotal(rows, ['totalItems']) },
        { label: 'Valor movilizado', value: formatMoney(numericTotal(rows, ['totalValue'])) },
        { label: 'Completadas', value: rows.filter((row) => row.status === 'COMPLETED').length },
      ],
    },
    pacientes: {
      segmentTitle: 'Pacientes por sexo',
      segmentData: countBy(rows, 'sexo'),
      barTitle: 'Actividad de historias',
      barData: countBy(rows, 'status'),
      summaryTitle: 'Carga clínica',
      summaryItems: [
        { label: 'Historias activas', value: rows.filter((row) => row.historia).length },
        { label: 'Últimas visitas', value: rows.filter((row) => row.lastVisit).length },
        { label: 'Pacientes activos', value: rows.filter((row) => row.status === 'ACTIVE').length },
      ],
    },
    medicos: {
      segmentTitle: 'Especialidades médicas',
      segmentData: countBy(rows, 'especialidad'),
      barTitle: 'Cuerpo médico por especialidad',
      barData: countBy(rows, 'especialidad').slice(0, 6),
      summaryTitle: 'Talento clínico',
      summaryItems: [
        { label: 'Licencias registradas', value: rows.filter((row) => row.licencia).length },
        { label: 'Especialidades', value: new Set(rows.map((row) => row.especialidad)).size },
        { label: 'Activos', value: rows.filter((row) => row.status === 'ACTIVE').length },
      ],
    },
    'personal-medico': {
      segmentTitle: 'Especialidades médicas',
      segmentData: countBy(rows, 'especialidad'),
      barTitle: 'Cuerpo médico por especialidad',
      barData: countBy(rows, 'especialidad').slice(0, 6),
      summaryTitle: 'Talento clínico',
      summaryItems: [
        { label: 'Licencias registradas', value: rows.filter((row) => row.licencia).length },
        { label: 'Especialidades', value: new Set(rows.map((row) => row.especialidad)).size },
        { label: 'Activos', value: rows.filter((row) => row.status === 'ACTIVE').length },
      ],
    },
    'atencion-medica': {
      segmentTitle: 'Tipo de atención',
      segmentData: countBy(rows, 'attentionType'),
      barTitle: 'Estado asistencial',
      barData: countBy(rows, 'status'),
      summaryTitle: 'Seguimiento clínico',
      summaryItems: [
        { label: 'Seguimientos requeridos', value: rows.filter((row) => row.followUpRequired).length },
        { label: 'Completadas', value: rows.filter((row) => row.status === 'COMPLETED').length },
        { label: 'Profesionales activos', value: new Set(rows.map((row) => row.personalNombre)).size },
      ],
    },
  };

  const preset = presets[pageId] || {
    segmentTitle: `Estado de ${definition.title}`,
    segmentData: countBy(rows, 'status'),
    barTitle: 'Registros destacados',
    barData: countBy(rows, 'status'),
    summaryTitle: 'Resumen operativo',
    summaryItems: [
      { label: 'Registros', value: rows.length },
      { label: 'Activos', value: rows.filter((row) => ['ACTIVE', 'COMPLETED', 'APPROVED', 'PAID', 'CONSIGNADO'].includes(row.status || row.estado)).length },
      { label: 'Visibles', value: formatMoney(numericTotal(rows, ['total', 'amount', 'estimatedValue', 'totalValue', 'budget'])) },
    ],
  };

  const pieData = preset.segmentData.slice(0, 6);
  const barData = preset.barData.slice(0, 7);

  return (
    <section className="module-insights">
      <div className="module-insight-card">
        <div className="module-insight-head">
          <div>
            <span>Segmentación</span>
            <h3>{preset.segmentTitle}</h3>
          </div>
        </div>
        <div className="rechart-shell module-pie">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <RechartsTooltip content={<ChartTooltip />} />
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={44} outerRadius={76} paddingAngle={3}>
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={sharedColors[index % sharedColors.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="module-insight-card wide">
        <div className="module-insight-head">
          <div>
            <span>Comparativo</span>
            <h3>{preset.barTitle}</h3>
          </div>
        </div>
        <div className="rechart-shell module-bars">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 12, left: -24, bottom: 0 }}>
              <CartesianGrid stroke="#edf2f7" strokeDasharray="4 8" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8da0bf', fontSize: 10, fontWeight: 700 }} interval={0} tickFormatter={(value) => String(value).slice(0, 12)} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8da0bf', fontSize: 11, fontWeight: 700 }} />
              <RechartsTooltip content={<ChartTooltip />} />
              <Bar dataKey="value" name="Valor" fill="#0f766e" radius={[8, 8, 3, 3]} maxBarSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="module-insight-card">
        <div className="module-insight-head">
          <div>
            <span>Lectura</span>
            <h3>{preset.summaryTitle}</h3>
          </div>
        </div>
        <div className="insight-summary-list">
          {preset.summaryItems.map((item) => (
            <div key={item.label} className="insight-summary-row">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinancialAnalytics({ rows, pageId }) {
  const visibleMoney = numericTotal(rows, ['total', 'amount', 'estimatedValue', 'totalValue', 'totalAmount', 'budget']);
  const incomeRows = rows.filter((row) => row.transactionType === 'INGRESO' || row.domain === 'FARMACIA' || row.domain === 'CLINICA');
  const expenseRows = rows.filter((row) => row.transactionType === 'EGRESO' || row.domain === 'COMPRA');
  const income = numericTotal(incomeRows, ['total', 'amount', 'estimatedValue']);
  const expenses = numericTotal(expenseRows, ['total', 'amount', 'estimatedValue']);
  const net = income - expenses || visibleMoney;
  const chartRows = buildSeries(rows, {
    dateKey: pageId === 'rep-donaciones' ? 'donationDate' : pageId.startsWith('rep-financ') || pageId === 'ingresos' || pageId === 'egresos' || pageId === 'gastos' || pageId === 'balance' || pageId === 'flujo-caja'
      ? 'transactionDate'
      : 'fecha',
  });
  const categoryData =
    rows.some((row) => row.category)
      ? sumBy(rows, 'category', 'amount').slice(0, 6)
      : rows.some((row) => row.domain)
        ? sumBy(rows, 'domain', 'total').slice(0, 6)
        : sumBy(rows, 'tipo', 'total').slice(0, 6);
  const statusData = countBy(rows, rows.some((row) => row.estado) ? 'estado' : 'status').slice(0, 6);
  const title =
    pageId === 'ingresos'
      ? 'Control de ingresos'
      : pageId === 'egresos' || pageId === 'gastos'
        ? 'Control de egresos'
        : pageId === 'compras'
          ? 'Gestión de compras'
          : pageId.includes('venta') || pageId.includes('terapia') || pageId.includes('consulta') || pageId.includes('laboratorio')
            ? 'Monitoreo comercial'
            : 'Control financiero moderno';
  const approved = rows.filter((row) => ['PAID', 'APPROVED', 'CONSIGNADO'].includes(row.status || row.estado)).length;
  const collectionRate = rows.length ? Math.round((approved / rows.length) * 100) : 0;

  return (
    <section className="finance-analytics">
      <div className="finance-compact-head">
        <div>
          <span className="pro-kicker small">
            <CircleDollarSign size={13} />
            Analítica financiera
          </span>
          <h2>{title}</h2>
        </div>
        <div className="finance-quick-metrics">
          <div className="finance-kpi income">
          <span><TrendingUp size={17} /></span>
          <div>
            <strong>{formatMoney(income || visibleMoney)}</strong>
            <em>Ingresos</em>
          </div>
          </div>
          <div className="finance-kpi expense">
          <span><TrendingDown size={17} /></span>
          <div>
            <strong>{formatMoney(expenses)}</strong>
            <em>Egresos</em>
          </div>
          </div>
          <div className="finance-kpi balance">
          <span><WalletCards size={17} /></span>
          <div>
            <strong>{formatMoney(net)}</strong>
            <em>Balance neto</em>
          </div>
          </div>
        </div>
      </div>

      <div className="finance-insight-grid">
        <div className="finance-panel large">
          <div className="finance-panel-head">
            <div>
              <h3>Tendencia de movimiento</h3>
              <p>Lectura temporal calculada desde los registros de esta vista.</p>
            </div>
            <div className="pro-legend">
              <span><i className="income" />Ingreso</span>
              <span><i className="expense" />Egreso</span>
            </div>
          </div>
          <div className="rechart-shell module-finance-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows} margin={{ top: 10, right: 12, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#e8eef7" strokeDasharray="4 8" vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#8da0bf', fontSize: 11, fontWeight: 700 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8da0bf', fontSize: 11, fontWeight: 700 }} />
                <RechartsTooltip content={<ChartTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                <Bar dataKey="ingresos" name="Ingresos" fill="#c0392b" radius={[8, 8, 2, 2]} maxBarSize={34} />
                <Bar dataKey="egresos" name="Egresos" fill="#0f766e" radius={[8, 8, 2, 2]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="finance-panel">
          <div className="finance-panel-head">
            <div>
              <h3>Composición</h3>
              <p>Categoría, dominio o tipo según la vista.</p>
            </div>
          </div>
          <div className="finance-category-list">
            {categoryData.map((item) => {
              const percent = Math.round((Number(item.value || 0) / Math.max(visibleMoney || 1, 1)) * 100);
              return (
                <div key={item.name}>
                  <span>{item.name}</span>
                  <b><i style={{ width: `${Math.min(percent, 100)}%` }} /></b>
                  <em>{formatMoney(item.value)}</em>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="finance-bottom-grid">
        <div className="module-insight-card finance-status-card">
          <div className="module-insight-head">
            <div>
              <span>Negocio</span>
              <h3>Lectura ejecutiva</h3>
            </div>
          </div>
          <div className="insight-summary-list">
            <div className="insight-summary-row">
              <span>Tasa de aprobación</span>
              <strong>{collectionRate}%</strong>
            </div>
            <div className="insight-summary-row">
              <span>Movimiento neto</span>
              <strong>{formatMoney(net)}</strong>
            </div>
            <div className="insight-summary-row">
              <span>Volumen visible</span>
              <strong>{formatMoney(visibleMoney)}</strong>
            </div>
          </div>
        </div>

        <div className="module-insight-card finance-status-card finance-status-list">
          <div className="module-insight-head">
            <div>
              <span>Estado</span>
              <h3>Detalle por estado</h3>
            </div>
          </div>
          <div className="insight-summary-list">
            {statusData.slice(0, 4).map((item) => (
              <div key={item.name} className="insight-summary-row">
                <span>{statusLabels[item.name] || item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ModulePage({ pageId }) {
  const definition = moduleDefinitions[pageId] || moduleDefinitions.usuarios;
  const fields = FORM_FIELDS[pageId] || FORM_FIELDS[definition.collection] || DEFAULT_FIELDS;
  const initialRows = useMemo(() => applyPresetFilters(getRowsForPage(pageId), definition.presetFilters), [pageId, definition]);
  const isFinancialPage = FINANCIAL_PAGES.has(pageId) || definition.collection === 'finanzas';
  const isPeopleTable = PEOPLE_TABLE_PAGES.has(pageId);

  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState(() => new Set());
  const [openMenu, setOpenMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setRows(initialRows);
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
    setPage(1);
    setSelectedRows(new Set());
    setOpenMenu(null);
  }, [initialRows]);

  const statusOptions = useMemo(() => uniqueOptions(rows, ['status', 'estado', 'deliveryStatus', 'vulnerabilityLevel']), [rows]);
  const typeOptions = useMemo(
    () =>
      uniqueOptions(rows, [
        'domain',
        'type',
        'tipo',
        'category',
        'donationType',
        'transactionType',
        'movementType',
        'tipoMuestra',
        'role',
        'especialidad',
        'specialty',
        'unit',
        'donorType',
        'distributionType',
        'paymentMethod',
      ]),
    [rows],
  );
  const secondaryFilterLabel = useMemo(() => {
    if (['laboratorio', 'pruebas-lab', 'kits-lab'].includes(pageId)) return 'Tipo / muestra';
    if (['usuarios', 'roles', 'seguridad'].includes(pageId)) return 'Rol / grupo';
    if (['medicamentos', 'productos', 'inventario-general', 'inventario-farmacia', 'movimientos-inv', 'entradas', 'salidas', 'ajustes'].includes(pageId)) return 'Categoria / movimiento';
    if (isFinancialPage) return 'Tipo / categoria';
    return 'Tipo / grupo';
  }, [isFinancialPage, pageId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchesSearch = !q || Object.values(row).some((value) => String(value).toLowerCase().includes(q));
      const matchesStatus =
        statusFilter === 'all' ||
        row.status === statusFilter ||
        row.estado === statusFilter ||
        row.deliveryStatus === statusFilter ||
        row.vulnerabilityLevel === statusFilter;
      const matchesType =
        typeFilter === 'all' ||
        row.domain === typeFilter ||
        row.type === typeFilter ||
        row.tipo === typeFilter ||
        row.category === typeFilter ||
        row.donationType === typeFilter ||
        row.transactionType === typeFilter ||
        row.movementType === typeFilter ||
        row.tipoMuestra === typeFilter ||
        row.role === typeFilter ||
        row.especialidad === typeFilter ||
        row.specialty === typeFilter ||
        row.unit === typeFilter ||
        row.donorType === typeFilter ||
        row.distributionType === typeFilter ||
        row.paymentMethod === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rows, search, statusFilter, typeFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, typeFilter, pageId]);

  const pageSize = 10;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const paginatedRows = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);
  const summaryChips = useMemo(() => buildSummaryChips(rows, pageId, definition), [rows, pageId, definition]);
  const visibleKeys = paginatedRows.map((row) => row.id || row.ticket || row.campaignNumber || row.numeroCompra || row.attentionNumber);
  const allVisibleSelected = visibleKeys.length > 0 && visibleKeys.every((key) => selectedRows.has(key));

  function toggleRowSelection(key) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleVisibleSelection() {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) visibleKeys.forEach((key) => next.delete(key));
      else visibleKeys.forEach((key) => next.add(key));
      return next;
    });
  }

  const stats = useMemo(() => {
    const active = filtered.filter((row) => ['ACTIVE', 'COMPLETED', 'APPROVED', 'PAID', 'CONSIGNADO', 'AVAILABLE'].includes(row.status || row.estado)).length;
    const totalMoney = numericTotal(filtered, ['total', 'amount', 'estimatedValue', 'totalValue', 'totalAmount', 'budget']);
    const alerts = filtered.filter((row) => {
      const stock = Number(row.stock ?? row.quantity ?? 999999);
      const min = Number(row.stockMinimo ?? row.minStock ?? -1);
      return stock <= min || ['CRITICA', 'LOW_STOCK', 'OUT_OF_STOCK', 'EXPIRED', 'PENDING'].includes(row.status || row.vulnerabilityLevel);
    }).length;
    return [
      { label: 'Registros', value: filtered.length, icon: Rows3, tone: 'info' },
      { label: 'Activos/ok', value: active, icon: CheckCircle2, tone: 'success' },
      { label: 'Monto visible', value: totalMoney ? formatMoney(totalMoney) : '-', icon: CircleDollarSign, tone: 'money' },
      { label: 'Alertas', value: alerts, icon: BarChart3, tone: 'warning' },
    ];
  }, [filtered, pageId]);

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2400);
  }

  function openAdd() {
    setEditRow(null);
    setForm({});
    setShowModal(true);
  }

  function openEdit(row) {
    setEditRow(row);
    setForm({ ...row });
    setShowModal(true);
  }

  function handleDelete(id) {
    setRows((prev) => prev.filter((row) => row.id !== id && row.ticket !== id && row.campaignNumber !== id));
    showToast('Registro eliminado', 'error');
  }

  function handleSave() {
    if (editRow) {
      setRows((prev) => prev.map((row) => (row.id === editRow.id ? { ...row, ...form } : row)));
      showToast('Registro actualizado');
    } else {
      const prefix = (definition.collection || pageId).slice(0, 3).toUpperCase();
      const newRow = {
        id: `${prefix}${String(rows.length + 1).padStart(3, '0')}`,
        status: 'ACTIVE',
        fecha: new Date().toISOString().slice(0, 10),
        ...form,
      };
      setRows((prev) => [newRow, ...prev]);
      showToast('Registro creado');
    }
    setShowModal(false);
  }

  function clearFilters() {
    setSearch('');
    setStatusFilter('all');
    setTypeFilter('all');
    setPage(1);
    setSelectedRows(new Set());
  }

  function exportCsv() {
    const headers = definition.columns.map(([, label]) => label);
    const lines = filtered.map((row) =>
      definition.columns.map(([key]) => `"${String(displayValue(row, key)).replaceAll('"', '""')}"`).join(',')
    );
    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${pageId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV exportado');
  }

  return (
    <div className="module-page">
      {toast && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.msg}</div>
        </div>
      )}

      {/* ── Stats Cards ── */}
      <div className="module-stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className={`module-stat ${stat.tone}`}>
            <div className="module-stat-icon">
              <stat.icon size={18} />
            </div>
            <div>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      {isFinancialPage && <FinancialAnalytics rows={filtered} pageId={pageId} />}

      {/* ── Filters Bar ── */}
      <div className="module-filters-bar">
        <div className="module-filters-left">
          <div className="table-search">
            <Search size={14} color="var(--text-light)" />
            <input
              type="text"
              placeholder={`Buscar ${definition.title.toLowerCase()}...`}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="table-filter-select">
            <span>Estado</span>
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              options={[{ value: 'all', label: 'Todos' }, ...statusOptions.map((o) => ({ value: o, label: statusLabels[o] || o }))]}
            />
          </div>
          <div className="table-filter-select">
            <span>{secondaryFilterLabel}</span>
            <CustomSelect
              value={typeFilter}
              onChange={(val) => setTypeFilter(val)}
              options={[{ value: 'all', label: 'Todos' }, ...typeOptions.map((o) => ({ value: o, label: o }))]}
            />
          </div>
          {(search || statusFilter !== 'all' || typeFilter !== 'all') && (
            <button className="btn btn-ghost" onClick={clearFilters} title="Limpiar filtros">
              <X size={14} />
              Limpiar
            </button>
          )}
        </div>
        <div className="module-filters-right">
          <button className="btn btn-outline" onClick={exportCsv}>
            <Download size={13} />
            Exportar
          </button>
          <button className="btn btn-primary table-primary-action" onClick={openAdd}>
            <Plus size={14} />
            {pageId === 'compras' || pageId === 'compras-farmacia' ? 'Agregar compra' : `Nuevo ${definition.title.split(' ').pop()}`}
          </button>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="data-table-wrap modern-table">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {definition.columns.map(([, label]) => (
                  <th key={label}>{label}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={definition.columns.length + 1}>
                    <div className="empty-state">
                      <p>No hay registros que coincidan con los filtros.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedRows.map((row) => {
                  const key = row.id || row.ticket || row.campaignNumber || row.numeroCompra || row.attentionNumber;
                  return (
                    <tr key={key}>
                      {definition.columns.map(([columnKey]) => (
                        <td key={columnKey}>
                          {isStatusKey(columnKey) ? (
                            <span className={`status-chip ${statusTone[row[columnKey]] || 'neutral'}`}>
                              {statusLabels[row[columnKey]] || row[columnKey] || '-'}
                            </span>
                          ) : isPeopleTable && ['fullName', 'firstName', 'name', 'patientName'].includes(columnKey) ? (
                            <AvatarCell row={row} value={displayValue(row, columnKey)} />
                          ) : columnKey === 'stockStatus' ? (
                            <StockBadge row={row} />
                          ) : columnKey === 'color' ? (
                            <span className="color-swatch">
                              <i style={{ background: row[columnKey] }} />
                              {row[columnKey]}
                            </span>
                          ) : columnKey === 'progress' || columnKey === 'budgetUse' ? (
                            <span className="progress-cell">
                              <b style={{ width: displayValue(row, columnKey) }} />
                              {displayValue(row, columnKey)}
                            </span>
                          ) : (
                            displayValue(row, columnKey)
                          )}
                        </td>
                      ))}
                      <td className="actions-cell">
                        <div className="row-menu-wrap">
                          <button
                            className="row-menu-trigger"
                            onClick={() => setOpenMenu((value) => (value === key ? null : key))}
                            title="Opciones"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenu === key && (
                            <div className="row-menu">
                              <button onClick={() => { openEdit(row); setOpenMenu(null); }}>
                                <Edit2 size={13} />
                                Editar
                              </button>
                              <button onClick={() => setOpenMenu(null)}>
                                <Eye size={13} />
                                Ver detalle
                              </button>
                              <button className="danger" onClick={() => { handleDelete(key); setOpenMenu(null); }}>
                                <Trash2 size={13} />
                                Eliminar
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <div className="table-footer-info">
            <span className="table-footer-label">
              Página {safePage} de {pageCount}
            </span>
            <div className="table-footer-progress">
              <div className="table-footer-progress-bar" style={{ width: `${Math.round((safePage / Math.max(pageCount, 1)) * 100)}%` }} />
            </div>
          </div>
          <div className="table-pagination">
            <button className="pagination-btn" disabled={safePage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} title="Anterior">
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`pagination-btn pagination-num${pageNum === safePage ? ' active' : ''}`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            ))}
            <button className="pagination-btn" disabled={safePage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} title="Siguiente">
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{editRow ? `Editar ${definition.title}` : `Nuevo en ${definition.title}`}</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="modal-body form-grid">
              {fields.map((field) => (
                <div key={field.key} className="form-group">
                  <label>{field.label}</label>
                  {field.type === 'select' ? (
                    <CustomSelect
                      className="full"
                      value={form[field.key] || ''}
                      onChange={(val) => setForm((prev) => ({ ...prev, [field.key]: val }))}
                      options={[{ value: '', label: 'Seleccionar...' }, ...field.options.map((o) => ({ value: o, label: statusLabels[o] || o }))]}
                      placeholder="Seleccionar..."
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={form[field.key] || ''}
                      onChange={(event) => setForm((prev) => ({ ...prev, [field.key]: event.target.value }))}
                      placeholder={field.label}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editRow ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
