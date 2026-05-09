import '../config.css';
import { useState } from 'react';
import { CustomSelect } from './CustomSelect';
import {
  Palette, Bell, Shield, User, Globe, Sun, Moon, Monitor,
  Check, ChevronRight, Camera, Mail, Phone, Lock, Eye, EyeOff,
  Smartphone, Clock, Zap, Database, Key, AlertTriangle,
  Volume2, VolumeX, Wifi, Server, Code2, RefreshCw, Info,
  LogOut, Fingerprint, Activity, RotateCcw, Undo2,
} from 'lucide-react';

/* ─── Shared toggle component ─── */
function Toggle({ value, onChange, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`cfg-toggle${value ? ' on' : ''}`}
    >
      <span />
    </button>
  );
}

/* ─── Select chip group ─── */
function ChipGroup({ options, value, onChange }) {
  return (
    <div className="cfg-chip-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`cfg-chip${value === opt.value ? ' active' : ''}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && <opt.icon size={14} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ─── Color swatch picker ─── */
function ColorPicker({ colors, value, onChange }) {
  return (
    <div className="cfg-color-row">
      {colors.map((c) => (
        <button
          key={c.value}
          title={c.label}
          className={`cfg-swatch${value === c.value ? ' active' : ''}`}
          style={{ background: c.value }}
          onClick={() => onChange(c.value)}
        >
          {value === c.value && <Check size={11} strokeWidth={3} />}
        </button>
      ))}
    </div>
  );
}

/* ─── Card tile — a self-contained setting card ─── */
function CfgCard({ label, hint, children }) {
  return (
    <div className="cfg-card">
      <div className="cfg-card-label">
        <span>{label}</span>
        {hint && <small>{hint}</small>}
      </div>
      <div className="cfg-card-control">{children}</div>
    </div>
  );
}

/* ─── Section wrapper ─── */
function CfgSection({ icon: Icon, title, subtitle, accent = '#c0392b', showReset, children }) {
  return (
    <div className="cfg-section">
      <div className="cfg-section-head">
        <span className="cfg-section-icon" style={{ background: `${accent}18`, color: accent }}>
          <Icon size={18} />
        </span>
        <div className="cfg-section-title-block">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {showReset && (
          <button className="cfg-reset-btn">
            <RotateCcw size={13} />
            Restablecer
          </button>
        )}
      </div>
      <div className="cfg-section-body">{children}</div>
    </div>
  );
}

/* ─── Row inside a section ─── */
function CfgRow({ label, hint, children, border = true }) {
  return (
    <div className={`cfg-row${border ? '' : ' no-border'}`}>
      <div className="cfg-row-label">
        <span>{label}</span>
        {hint && <small>{hint}</small>}
      </div>
      <div className="cfg-row-control">{children}</div>
    </div>
  );
}

/* ─── Session card ─── */
function SessionCard({ device, location, time, current }) {
  return (
    <div className={`cfg-session-card${current ? ' current' : ''}`}>
      <span className="cfg-session-icon">
        <Smartphone size={16} />
      </span>
      <div className="cfg-session-info">
        <strong>{device}</strong>
        <small>{location} · {time}</small>
      </div>
      {current
        ? <span className="cfg-session-badge">Sesión actual</span>
        : <button className="cfg-session-revoke"><LogOut size={13} /> Revocar</button>
      }
    </div>
  );
}

/* ─── Main Component ─── */
export function ConfigPage({ activePage }) {
  /* --- Apariencia --- */
  const [theme, setTheme] = useState('light');
  const [accentColor, setAccentColor] = useState('#c0392b');
  const [density, setDensity] = useState('default');
  const [animations, setAnimations] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fontScale, setFontScale] = useState('md');

  /* --- Notificaciones --- */
  const [notifSystem, setNotifSystem] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifStock, setNotifStock] = useState(true);
  const [notifFinanzas, setNotifFinanzas] = useState(false);
  const [notifSocial, setNotifSocial] = useState(true);
  const [notifSounds, setNotifSounds] = useState(false);
  const [quietFrom, setQuietFrom] = useState('22:00');
  const [quietTo, setQuietTo] = useState('07:00');

  /* --- Seguridad --- */
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionAlert, setSessionAlert] = useState(true);
  const [loginHistory, setLoginHistory] = useState(true);
  const [showPass, setShowPass] = useState(false);

  /* --- Perfil --- */
  const [profileName, setProfileName] = useState('María López Gómez');
  const [profileEmail, setProfileEmail] = useState('maria.lopez@caritas.org.pe');
  const [profilePhone, setProfilePhone] = useState('+51 987 654 321');
  const [profileRole] = useState('COORDINADOR');
  const [lang, setLang] = useState('es');

  /* --- Sistema --- */
  const [timezone, setTimezone] = useState('America/Lima');
  const [cachePolicy, setCachePolicy] = useState('balanced');
  const [devMode, setDevMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  const accentColors = [
    { value: '#c0392b', label: 'Caritas Rojo' },
    { value: '#0f766e', label: 'Verde Teal' },
    { value: '#6366f1', label: 'Índigo' },
    { value: '#0ea5e9', label: 'Cyan' },
    { value: '#8b5cf6', label: 'Violeta' },
    { value: '#f59e0b', label: 'Ámbar' },
    { value: '#10b981', label: 'Esmeralda' },
    { value: '#ec4899', label: 'Rosa' },
  ];

  const themeOptions = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Auto', icon: Monitor },
  ];

  const densityOptions = [
    { value: 'compact', label: 'Compacto' },
    { value: 'default', label: 'Normal' },
    { value: 'comfortable', label: 'Amplio' },
  ];

  const fontOptions = [
    { value: 'sm', label: 'Pequeño' },
    { value: 'md', label: 'Normal' },
    { value: 'lg', label: 'Grande' },
  ];

  const sections = {
    'config-apariencia': (
      <CfgSection icon={Palette} title="Temas y Apariencia" subtitle="Personaliza la experiencia visual del sistema" accent="#6366f1" showReset>
        {/* Grid of cards — 3 across for selections, 2 across for toggles */}
        <div className="cfg-cards-grid-3">
          <CfgCard label="Tema de color" hint="Afecta a toda la interfaz">
            <ChipGroup options={themeOptions} value={theme} onChange={setTheme} />
          </CfgCard>
          <CfgCard label="Color de acento" hint="Color principal de botones">
            <ColorPicker colors={accentColors} value={accentColor} onChange={setAccentColor} />
          </CfgCard>
          <CfgCard label="Densidad de interfaz" hint="Espaciado general">
            <ChipGroup options={densityOptions} value={density} onChange={setDensity} />
          </CfgCard>
        </div>
        <div className="cfg-cards-grid-3">
          <CfgCard label="Tamaño de fuente" hint="Escala tipográfica">
            <ChipGroup options={fontOptions} value={fontScale} onChange={setFontScale} />
          </CfgCard>
          <CfgCard label="Animaciones" hint="Efectos de movimiento">
            <Toggle value={animations} onChange={setAnimations} id="toggle-anim" />
          </CfgCard>
          <CfgCard label="Panel colapsado" hint="Ocultar panel secundario">
            <Toggle value={sidebarCollapsed} onChange={setSidebarCollapsed} id="toggle-sidebar" />
          </CfgCard>
        </div>
      </CfgSection>
    ),

    'config-notificaciones': (
      <CfgSection icon={Bell} title="Notificaciones" subtitle="Controla cuándo y cómo el sistema te avisa" accent="#f59e0b" showReset>
        <div className="cfg-cards-grid-3">
          <CfgCard label="Notificaciones del sistema" hint="Alertas internas de la plataforma">
            <Toggle value={notifSystem} onChange={setNotifSystem} id="notif-sys" />
          </CfgCard>
          <CfgCard label="Notificaciones por correo" hint="Resúmenes enviados a tu email">
            <Toggle value={notifEmail} onChange={setNotifEmail} id="notif-email" />
          </CfgCard>
          <CfgCard label="Alertas de stock bajo" hint="Medicamentos bajo mínimo">
            <Toggle value={notifStock} onChange={setNotifStock} id="notif-stock" />
          </CfgCard>
        </div>
        <div className="cfg-cards-grid-3">
          <CfgCard label="Movimientos financieros" hint="Ingresos, egresos y compras">
            <Toggle value={notifFinanzas} onChange={setNotifFinanzas} id="notif-fin" />
          </CfgCard>
          <CfgCard label="Actualizaciones sociales" hint="Campañas y distribuciones">
            <Toggle value={notifSocial} onChange={setNotifSocial} id="notif-social" />
          </CfgCard>
          <CfgCard label="Sonidos de notificación" hint="Audio al recibir alertas">
            <div className="cfg-row-inline">
              {notifSounds ? <Volume2 size={15} className="cfg-inline-icon" /> : <VolumeX size={15} className="cfg-inline-icon muted" />}
              <Toggle value={notifSounds} onChange={setNotifSounds} id="notif-sound" />
            </div>
          </CfgCard>
        </div>
        <div className="cfg-cards-grid-3">
          <CfgCard label="Horario silencioso" hint="No molestar en rango de horas">
            <div className="cfg-time-range">
              <input type="time" value={quietFrom} onChange={(e) => setQuietFrom(e.target.value)} className="cfg-time-input" />
              <span>—</span>
              <input type="time" value={quietTo} onChange={(e) => setQuietTo(e.target.value)} className="cfg-time-input" />
            </div>
          </CfgCard>
        </div>
      </CfgSection>
    ),

    'config-seguridad': (
      <CfgSection icon={Shield} title="Privacidad y Seguridad" subtitle="Protege tu cuenta y controla el acceso al sistema" accent="#10b981" showReset>
        <div className="cfg-cards-grid-2">
          <CfgCard label="Verificación en dos pasos (2FA)" hint="Código adicional al iniciar sesión">
            <div className="cfg-row-inline">
              {twoFactor && <span className="cfg-badge success"><Check size={10} /> Activado</span>}
              <Toggle value={twoFactor} onChange={setTwoFactor} id="toggle-2fa" />
            </div>
          </CfgCard>
          <CfgCard label="Alertas de acceso sospechoso" hint="Inicios de sesión inusuales">
            <Toggle value={sessionAlert} onChange={setSessionAlert} id="toggle-alert" />
          </CfgCard>
        </div>
        {twoFactor && (
          <div className="cfg-2fa-prompt">
            <Fingerprint size={20} />
            <div>
              <strong>2FA activado con app autenticadora</strong>
              <small>Usando Google Authenticator o compatible</small>
            </div>
            <button className="cfg-link-btn">Reconfigurar <ChevronRight size={13} /></button>
          </div>
        )}
        <div className="cfg-cards-grid-2">
          <CfgCard label="Historial de sesiones activo" hint="Registra dispositivos de acceso">
            <Toggle value={loginHistory} onChange={setLoginHistory} id="toggle-history" />
          </CfgCard>
          <CfgCard label="Cambiar contraseña" hint="Última modificación: hace 32 días">
            <div className="cfg-password-field">
              <input type={showPass ? 'text' : 'password'} defaultValue="••••••••••" className="cfg-input" />
              <button onClick={() => setShowPass(!showPass)} className="cfg-pass-eye">
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </CfgCard>
        </div>
        <div className="cfg-sessions-block">
          <div className="cfg-sessions-head">
            <Activity size={14} />
            <strong>Sesiones activas</strong>
          </div>
          <SessionCard device="Chrome · Windows 11" location="Lima, PE" time="Ahora" current />
          <SessionCard device="Safari · iPhone 15" location="San Vicente, PE" time="Hace 2 h" />
          <SessionCard device="Firefox · macOS" location="Lima, PE" time="Hace 3 días" />
        </div>
        <CfgRow label="Cerrar todas las sesiones remotas" hint="Desconecta todos los dispositivos excepto este" border={false}>
          <button className="cfg-danger-btn"><LogOut size={13} /> Cerrar todo</button>
        </CfgRow>
      </CfgSection>
    ),

    'config-perfil': (
      <CfgSection icon={User} title="Perfil de Usuario" subtitle="Tu información personal y preferencias de cuenta" accent="#0ea5e9" showReset>
        <div className="cfg-avatar-block">
          <div className="cfg-avatar-circle">
            {profileName.slice(0, 2).toUpperCase()}
          </div>
          <div className="cfg-avatar-info">
            <strong>{profileName}</strong>
            <span className="cfg-role-badge">{profileRole}</span>
            <button className="cfg-upload-btn"><Camera size={13} /> Cambiar foto</button>
          </div>
        </div>
        <div className="cfg-cards-grid-2">
          <CfgCard label="Nombre completo" hint="Visible en todo el sistema">
            <input className="cfg-input full" value={profileName} onChange={(e) => setProfileName(e.target.value)} />
          </CfgCard>
          <CfgCard label="Correo electrónico" hint="Para notificaciones y recuperación">
            <div className="cfg-input-with-icon">
              <Mail size={14} className="cfg-input-icon" />
              <input className="cfg-input with-icon full" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
            </div>
          </CfgCard>
        </div>
        <div className="cfg-cards-grid-3">
          <CfgCard label="Teléfono de contacto" hint="Verificación 2FA por SMS">
            <div className="cfg-input-with-icon">
              <Phone size={14} className="cfg-input-icon" />
              <input className="cfg-input with-icon full" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} />
            </div>
          </CfgCard>
          <CfgCard label="Rol asignado" hint="Definido por el administrador">
            <span className="cfg-readonly-field">
              <Key size={13} />
              {profileRole}
            </span>
          </CfgCard>
          <CfgCard label="Idioma de la interfaz" hint="Fechas, números y textos">
            <ChipGroup
              options={[
                { value: 'es', label: 'Español' },
                { value: 'en', label: 'English' },
              ]}
              value={lang}
              onChange={setLang}
            />
          </CfgCard>
        </div>
      </CfgSection>
    ),

    'config-sistema': (
      <CfgSection icon={Globe} title="Sistema" subtitle="Parámetros técnicos, rendimiento e integraciones" accent="#8b5cf6" showReset>
        <div className="cfg-cards-grid-2">
          <CfgCard label="Zona horaria" hint="Afecta fechas y reportes">
            <CustomSelect
              className="full"
              value={timezone}
              onChange={(val) => setTimezone(val)}
              options={[
                { value: 'America/Lima', label: 'America/Lima (UTC-5)' },
                { value: 'America/Bogota', label: 'America/Bogota (UTC-5)' },
                { value: 'America/Santiago', label: 'America/Santiago (UTC-4)' },
                { value: 'America/Buenos_Aires', label: 'America/Buenos_Aires (UTC-3)' },
                { value: 'UTC', label: 'UTC (UTC+0)' },
              ]}
            />
          </CfgCard>
          <CfgCard label="Política de caché" hint="Velocidad vs datos frescos">
            <ChipGroup
              options={[
                { value: 'aggressive', label: 'Rápido' },
                { value: 'balanced', label: 'Balanceado' },
                { value: 'minimal', label: 'En tiempo real' },
              ]}
              value={cachePolicy}
              onChange={setCachePolicy}
            />
          </CfgCard>
        </div>
        <div className="cfg-cards-grid-3">
          <CfgCard label="Respaldo automático" hint="Exporta datos cada 24 h">
            <div className="cfg-row-inline">
              {autoBackup && <span className="cfg-badge success"><Database size={10} /> Activo</span>}
              <Toggle value={autoBackup} onChange={setAutoBackup} id="toggle-backup" />
            </div>
          </CfgCard>
          <CfgCard label="Modo desarrollador" hint="Info técnica avanzada">
            <div className="cfg-row-inline">
              {devMode && <span className="cfg-badge warning"><Code2 size={10} /> Dev</span>}
              <Toggle value={devMode} onChange={setDevMode} id="toggle-dev" />
            </div>
          </CfgCard>
          <CfgCard label="Versión del sistema" hint="SisCaritas · Build 2026.05">
            <div className="cfg-row-inline">
              <span className="cfg-version-tag">v2026.05 · LTS</span>
              <button className="cfg-link-btn"><RefreshCw size={12} /> Verificar</button>
            </div>
          </CfgCard>
        </div>
        <div className="cfg-integrations-list">
          {[
            { name: 'API REST Caritas', status: 'connected', icon: Wifi, url: 'api.caritas.org.pe/v2' },
            { name: 'SMTP Correo', status: 'connected', icon: Mail, url: 'smtp.gmail.com:587' },
            { name: 'Almacenamiento Cloud', status: 'warning', icon: Database, url: 'storage.caritas-backup.pe' },
            { name: 'Webhook eventos', status: 'disconnected', icon: Zap, url: 'No configurado' },
          ].map((item) => (
            <div key={item.name} className="cfg-integration-row">
              <span className={`cfg-integration-dot ${item.status}`} />
              <item.icon size={15} className="cfg-integration-svc-icon" />
              <div>
                <strong>{item.name}</strong>
                <small>{item.url}</small>
              </div>
              <button className="cfg-link-btn">
                {item.status === 'disconnected' ? 'Conectar' : 'Gestionar'} <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </CfgSection>
    ),
  };

  /* default para config-general */
  const defaultPage = sections['config-apariencia'];

  const pageMap = {
    'config-general': sections['config-apariencia'],
    ...sections,
  };

  const content = pageMap[activePage] || defaultPage;

  return (
    <div className="config-page">
      {/* Main content */}
      <div className="config-content">
        {content}
      </div>

      {/* Bottom action bar */}
      <div className="cfg-bottom-bar">
        <button className="cfg-undo-btn">
          <Undo2 size={14} />
          Deshacer
        </button>
        <button className="cfg-save-btn">
          <Check size={15} />
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
