import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@siscaritas.org');
  const [password, setPassword] = useState('admin123');
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Por favor ingrese sus credenciales.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin({ email, role: 'ADMIN' });
    }, 900);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">SC</div>
          <h1>SisCaritas</h1>
          <p>Sistema de Gestión Social y Clínica</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', marginBottom: 14, fontSize: 12.5, color: '#c0392b' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <div style={{ position: 'relative' }}>
              <Mail size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@siscaritas.org"
                style={{ paddingLeft: 32 }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                style={{ paddingLeft: 32, paddingRight: 36 }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div className="login-extras">
            <label className="checkbox-label">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Recordarme
            </label>
            <button type="button" className="login-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12.5 }}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="login-roles">
          <strong>Roles disponibles</strong>
          <div className="roles-chips">
            {['ADMIN', 'COORDINADOR', 'CONTADOR', 'VOLUNTARIO'].map((r) => (
              <span key={r} className="role-chip">{r}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
