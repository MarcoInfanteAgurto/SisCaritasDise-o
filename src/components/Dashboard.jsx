import {
  Activity,
  ArrowUpRight,
  Banknote,
  ClipboardList,
  HeartHandshake,
  PackageSearch,
  ShieldAlert,
  Stethoscope,
  TrendingUp,
  UserRoundPlus,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  formatMoney,
  getRecentActivity,
  mockDb,
} from '../data/siscaritasMock';

const domainColors = {
  SOCIAL: '#4CAF50',
  SALUD: '#2196F3',
  FARMACIA: '#c0392b',
  CLINICA: '#9C27B0',
  COMPRA: '#f59e0b',
};

const specialtyFallback = {
  Educacion: '#4CAF50',
  Alimentacion: '#FF9800',
  'Terapia Fisica': '#2196F3',
  Odontologia: '#9C27B0',
};

const activityIcons = {
  Salud: { icon: Stethoscope, bg: '#dbeafe', color: '#2563eb' },
  Inventario: { icon: PackageSearch, bg: '#fff7ed', color: '#ea580c' },
  Donaciones: { icon: HeartHandshake, bg: '#fee2e2', color: '#c0392b' },
  Farmacia: { icon: Banknote, bg: '#fef2f2', color: '#c0392b' },
  Social: { icon: Users, bg: '#dcfce7', color: '#16a34a' },
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((entry) => (
        <span key={entry.dataKey || entry.name} style={{ color: entry.color }}>
          {entry.name || entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toLocaleString('es-PE') : entry.value}
        </span>
      ))}
    </div>
  );
}

function groupSum(rows, key, valueKey) {
  return Object.entries(
    rows.reduce((acc, row) => {
      const bucket = row[key] || 'Sin dato';
      acc[bucket] = (acc[bucket] || 0) + Number(row[valueKey] || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
}

function buildPeriodSeries(rows) {
  const grouped = rows.reduce((acc, row) => {
    const date = row.transactionDate || row.fecha || row.donationDate || row.attentionDate;
    if (!date) return acc;
    const rawLabel = String(date).slice(5, 10);
    if (!acc[rawLabel]) {
      acc[rawLabel] = { label: rawLabel, ingresos: 0, egresos: 0 };
    }
    const amount = Number(row.amount || row.total || row.estimatedValue || 0);
    const isIncome = row.transactionType === 'INGRESO' || row.domain === 'FARMACIA' || row.domain === 'CLINICA';
    if (isIncome) acc[rawLabel].ingresos += amount;
    else acc[rawLabel].egresos += amount;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => a.label.localeCompare(b.label));
}

function DashboardFlowChart({ data }) {
  return (
    <div className="rechart-shell tall">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -24, bottom: 0 }} barGap={10}>
          <CartesianGrid stroke="#e8eef7" strokeDasharray="4 8" vertical={false} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: '#8da0bf', fontSize: 11, fontWeight: 700 }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8da0bf', fontSize: 11, fontWeight: 700 }} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
          <Bar dataKey="ingresos" name="Ingresos" fill="#c0392b" radius={[8, 8, 2, 2]} maxBarSize={34} />
          <Bar dataKey="egresos" name="Egresos" fill="#0f766e" radius={[8, 8, 2, 2]} maxBarSize={34} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function SpecialtyBudgetChart({ data }) {
  return (
    <div className="rechart-shell medium">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 10, left: -24, bottom: 0 }}>
          <CartesianGrid stroke="#edf2f7" strokeDasharray="4 8" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#8da0bf', fontSize: 10, fontWeight: 700 }} interval={0} tickFormatter={(value) => String(value).slice(0, 12)} />
          <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8da0bf', fontSize: 11, fontWeight: 700 }} />
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
          <Bar dataKey="budget" name="Presupuesto" fill="#e2e8f0" radius={[8, 8, 2, 2]} maxBarSize={38} />
          <Bar dataKey="spent" name="Ejecutado" radius={[8, 8, 2, 2]} maxBarSize={38}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function DonationMixChart({ data }) {
  const pieData = data.map((item) => ({
    ...item,
    color:
      item.name === 'MONETARIA'
        ? '#c0392b'
        : item.name === 'EN_ESPECIE'
          ? '#4CAF50'
          : '#2196F3',
  }));

  return (
    <div className="rechart-shell medium">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
          <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={42} outerRadius={76} paddingAngle={4}>
            {pieData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function SalesMixChart({ data }) {
  return (
    <div className="rechart-shell medium">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 18, left: 12, bottom: 0 }}>
          <CartesianGrid stroke="#edf2f7" strokeDasharray="4 8" horizontal={false} />
          <XAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#8da0bf', fontSize: 11, fontWeight: 700 }} />
          <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} width={84} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" name="Monto" radius={[0, 8, 8, 0]} maxBarSize={24}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Dashboard({ onNavigate }) {
  const activeBeneficiaries = mockDb.beneficiarios.filter((item) => item.status === 'ACTIVE');
  const criticalBeneficiaries = activeBeneficiaries.filter((item) => ['ALTA', 'CRITICA'].includes(item.vulnerabilityLevel));
  const socialCampaigns = mockDb.campanas.filter((item) => item.domain === 'SOCIAL');
  const healthCampaigns = mockDb.campanas.filter((item) => item.domain === 'SALUD');
  const activeCampaigns = mockDb.campanas.filter((item) => ['ACTIVE', 'IN_PROGRESS', 'PLANNED'].includes(item.status));
  const totalCollected = socialCampaigns.reduce((sum, item) => sum + Number(item.currentAmount || 0), 0);
  const totalSocialGoal = socialCampaigns.reduce((sum, item) => sum + Number(item.goalAmount || 0), 0);
  const healthCoverage = healthCampaigns.reduce((sum, item) => sum + Number(item.actualBeneficiaries || 0), 0);
  const healthTarget = healthCampaigns.reduce((sum, item) => sum + Number(item.targetBeneficiaries || 0), 0);
  const financeRows = mockDb.finanzas;
  const income = financeRows.filter((item) => item.transactionType === 'INGRESO').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const expenses = financeRows.filter((item) => item.transactionType === 'EGRESO').reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const flowSeries = buildPeriodSeries([...mockDb.finanzas, ...mockDb.ventas]);
  const specialtyData = mockDb.especialidades.map((item) => ({
    name: item.specialtyName,
    budget: Number(item.budget || 0),
    spent: Number(item.spent || 0),
    color: item.color || specialtyFallback[item.specialtyName] || '#64748b',
  }));
  const donationMix = groupSum(mockDb.donaciones, 'donationType', 'estimatedValue');
  const salesMix = groupSum(mockDb.ventas, 'domain', 'total').map((item) => ({
    ...item,
    color: domainColors[item.name] || '#64748b',
  }));
  const lowStockCount = mockDb.medicamentos.filter((item) => Number(item.stock) <= Number(item.stockMinimo)).length;
  const inventoryAlertCount = mockDb.inventario.filter((item) => Number(item.quantity) <= Number(item.minStock)).length;
  const followUpCount = mockDb.atencion_salud.filter((item) => item.followUpRequired).length;
  const completedDistributions = mockDb.distribuciones.filter((item) => item.deliveryStatus === 'ENTREGADO').length;
  const volunteerRanking = [...mockDb.voluntarios]
    .sort((a, b) => Number(b.hoursWorked || 0) - Number(a.hoursWorked || 0))
    .slice(0, 5);
  const recentActivity = getRecentActivity();

  const overview = [
    {
      icon: ShieldAlert,
      value: criticalBeneficiaries.length.toLocaleString('es-PE'),
      label: 'Casos vulnerables',
      detail: `${activeBeneficiaries.length.toLocaleString('es-PE')} beneficiarios activos`,
      accent: '#c0392b',
      page: ['personas', 'beneficiarios'],
    },
    {
      icon: HeartHandshake,
      value: `${Math.round((totalCollected / Math.max(totalSocialGoal, 1)) * 100)}%`,
      label: 'Meta social cubierta',
      detail: `${formatMoney(totalCollected)} de ${formatMoney(totalSocialGoal)}`,
      accent: '#4CAF50',
      page: ['social', 'campanas'],
    },
    {
      icon: Stethoscope,
      value: `${Math.round((healthCoverage / Math.max(healthTarget, 1)) * 100)}%`,
      label: 'Cobertura salud',
      detail: `${healthCoverage.toLocaleString('es-PE')} atenciones sobre ${healthTarget.toLocaleString('es-PE')}`,
      accent: '#2196F3',
      page: ['social', 'campanas'],
    },
    {
      icon: TrendingUp,
      value: formatMoney(income - expenses),
      label: 'Balance operativo',
      detail: `${formatMoney(income)} ingresos frente a ${formatMoney(expenses)} egresos`,
      accent: '#0f766e',
      page: ['finanzas', 'balance'],
    },
  ];

  return (
    <div className="pro-dashboard">
      <section className="pro-hero business-hero">
        <div>
          <span className="pro-kicker">
            <Activity size={14} />
            Sis Cáritas unificado
          </span>
          <h1>Control integral social, clínico y financiero</h1>
          <p>
            Lectura rápida de operación social, clínica y financiera desde el schema unificado.
          </p>
        </div>
        <div className="pro-hero-actions">
          <button onClick={() => onNavigate && onNavigate('social', 'campanas')}>Campañas</button>
          <button onClick={() => onNavigate && onNavigate('finanzas', 'balance')}>Balance</button>
        </div>
      </section>

      <div className="pro-dashboard-layout">
        <main className="pro-main">
          <div className="pro-overview-grid">
            {overview.map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} className="pro-overview-card accent-card" onClick={() => onNavigate && onNavigate(item.page[0], item.page[1])}>
                  <div style={{ background: `${item.accent}16`, color: item.accent }}>
                    <Icon size={18} />
                  </div>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <em>{item.detail}</em>
                  <ArrowUpRight size={14} />
                </button>
              );
            })}
          </div>

          <section className="pro-card">
            <div className="pro-card-head">
              <div>
                <span className="pro-kicker small">Flujo consolidado</span>
                <h2>Ingresos vs egresos reales del sistema</h2>
                <p>Se calcula desde `finanzas` y `ventas`, separando movimiento operativo y compras.</p>
              </div>
              <div className="pro-legend">
                <span><i className="income" />Ingresos</span>
                <span><i className="expense" />Egresos</span>
              </div>
            </div>
            <DashboardFlowChart data={flowSeries} />
          </section>

          <div className="pro-two-col">
            <section className="pro-card">
              <div className="pro-card-head tight">
                <div>
                  <h2>Ejecución por especialidad</h2>
                  <p>Presupuesto vs gasto usando colores representativos del área.</p>
                </div>
              </div>
              <SpecialtyBudgetChart data={specialtyData} />
            </section>

            <section className="pro-card">
              <div className="pro-card-head tight">
                <div>
                  <h2>Donación por tipo</h2>
                  <p>Monetaria, especie y mixta según la colección `donaciones`.</p>
                </div>
              </div>
              <DonationMixChart data={donationMix} />
            </section>
          </div>

          <div className="pro-two-col">
            <section className="pro-card">
              <div className="pro-card-head tight">
                <div>
                  <h2>Ventas unificadas por dominio</h2>
                  <p>Farmacia, clínica y compras desde la colección única `ventas`.</p>
                </div>
              </div>
              <SalesMixChart data={salesMix} />
            </section>

            <section className="pro-card">
              <div className="pro-card-head tight">
                <div>
                  <h2>Campañas en operación</h2>
                  <p>Meta social, cobertura salud y ejecución por campaña.</p>
                </div>
              </div>
              <div className="campaign-impact-list">
                {mockDb.campanas.slice(0, 5).map((campaign) => {
                  const goal = Number(campaign.goalAmount || campaign.targetBeneficiaries || campaign.budget || 0);
                  const current = Number(
                    campaign.currentAmount ||
                    campaign.actualBeneficiaries ||
                    campaign.spent ||
                    0
                  );
                  const percent = Math.min(100, Math.round((current / Math.max(goal, 1)) * 100));
                  const tone = domainColors[campaign.domain] || '#64748b';
                  return (
                    <button
                      key={campaign.id}
                      className="campaign-impact-row"
                      onClick={() => onNavigate && onNavigate('social', campaign.domain === 'SALUD' ? 'campanas' : 'campanas')}
                    >
                      <div>
                        <strong>{campaign.campaignName}</strong>
                        <span>{campaign.domain} · {campaign.location}</span>
                      </div>
                      <b>
                        <i style={{ width: `${percent}%`, background: tone }} />
                      </b>
                      <em>{percent}%</em>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>
        </main>

        <aside className="pro-side">
          <section className="pro-card side-card">
            <div className="pro-card-head tight">
              <h2>Voluntariado</h2>
              <UserRoundPlus size={18} />
            </div>
            <div className="ranking-list volunteer-ranking">
              {volunteerRanking.map((item, index) => (
                <button key={item.id} className="ranking-row" onClick={() => onNavigate && onNavigate('personas', 'voluntarios')}>
                  <span>#{index + 1}</span>
                  <strong>{item.firstName} {item.lastName}</strong>
                  <em>{item.skills}</em>
                  <b>{item.hoursWorked} h</b>
                </button>
              ))}
            </div>
          </section>

          <section className="pro-card side-card">
            <div className="pro-card-head tight">
              <h2>Alertas operativas</h2>
              <ClipboardList size={18} />
            </div>
            <div className="money-report-list compact">
              <button onClick={() => onNavigate && onNavigate('farmacia', 'alertas-stock')}>
                <span>Medicamentos bajo mínimo</span>
                <strong>{lowStockCount}</strong>
                <em>Se compara `stock` vs `stockMinimo`</em>
              </button>
              <button onClick={() => onNavigate && onNavigate('inventario', 'inventario-general')}>
                <span>Inventario social crítico</span>
                <strong>{inventoryAlertCount}</strong>
                <em>Se compara `quantity` vs `minStock`</em>
              </button>
              <button onClick={() => onNavigate && onNavigate('clinica', 'atencion-medica')}>
                <span>Seguimientos requeridos</span>
                <strong>{followUpCount}</strong>
                <em>Desde `atencion_salud.followUpRequired`</em>
              </button>
            </div>
          </section>

          <section className="pro-card side-card">
            <div className="pro-card-head tight">
              <h2>Actividad reciente</h2>
              <Users size={18} />
            </div>
            <div className="pro-activity-list">
              {recentActivity.map((item) => {
                const meta = activityIcons[item.type] || activityIcons.Social;
                const Icon = meta.icon;
                return (
                  <div key={`${item.title}-${item.time}`}>
                    <span style={{ background: meta.bg, color: meta.color }}>
                      <Icon size={14} />
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <em>{item.subtitle}</em>
                    </div>
                    <small>{item.time}</small>
                  </div>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
