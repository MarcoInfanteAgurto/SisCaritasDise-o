import { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, LockKeyhole } from 'lucide-react';
import caritasBg from '../assets/caritas_backgorund.png';
import logoCaritas from '../assets/logo_caritas.jpeg';

export function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('admin@siscaritas.org');
  const [password, setPassword] = useState('admin123');
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
    <div className="login-layout">
      {/* Panel Izquierdo: Branding y Fondo */}
      <div className="login-hero" style={{ backgroundImage: `url(${caritasBg})` }}>
        <div className="login-hero-overlay">
          <div className="login-hero-content">
            <div className="login-hero-logo">
              <img src={logoCaritas} alt="Cáritas" />
            </div>
            <h1>SisCaritas</h1>
            <p>Uniendo fuerzas para el desarrollo social y la salud integral.</p>
          </div>
        </div>
      </div>

      {/* Panel Derecho: Formulario */}
      <div className="login-form-panel">
        <div className="login-form-wrapper slide-in">
          
          <div className="login-form-header">
            <h2>Bienvenido de <span>vuelta</span></h2>
            <p>Ingresa tus credenciales para continuar</p>
          </div>

          <div className="login-form-card">
            <form className="login-form" onSubmit={handleSubmit}>
              {error && (
                <div className="login-error-msg">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">CORREO ELECTRÓNICO</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@siscaritas.org"
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">CONTRASEÑA</label>
                  <button type="button" className="login-link">
                    ¿Olvidaste tu acceso?
                  </button>
                </div>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <input
                    id="password"
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPw(!showPw)}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Ingresando...' : 'Iniciar sesión'}
                <ArrowRight size={16} className="btn-icon-right" />
              </button>
            </form>
          </div>

          <div className="login-footer">
            <span className="footer-item"><LockKeyhole size={12} /> SSL 256-bit</span>
            <span className="footer-divider">|</span>
            <span className="footer-item"><ShieldCheck size={12} /> Datos protegidos</span>
            <span className="footer-divider">|</span>
            <span className="footer-item">© 2026 SisCaritas</span>
          </div>

        </div>
      </div>
    </div>
  );
}
