import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { IconSidebar } from './components/IconSidebar';
import { PanelSidebar, FIRST_PAGE } from './components/PanelSidebar';
import { TopHeader } from './components/TopHeader';
import { Dashboard } from './components/Dashboard';
import { ModulePage } from './components/ModulePage';
import { ConfigPage } from './components/ConfigPage';

const CONFIG_PAGES = new Set([
  'config-apariencia',
  'config-notificaciones',
  'config-seguridad',
  'config-perfil',
  'config-sistema',
  'config-general',
]);

export default function App() {
  const [user, setUser] = useState(null);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [activePage, setActivePage] = useState('dashboard');
  const [panelOpen, setPanelOpen] = useState(false);

  function handleLogin(userData) {
    setUser(userData);
  }

  function handleSelectModule(moduleId) {
    setActiveModule(moduleId);
    if (moduleId === 'dashboard') {
      setActivePage('dashboard');
      setPanelOpen(false);
    } else {
      setPanelOpen(true);
      /* Auto-select first subsection */
      const firstPage = FIRST_PAGE[moduleId];
      setActivePage(firstPage || '');
    }
  }

  function handleSelectPage(pageId) {
    setActivePage(pageId);
  }

  function handleNavigate(moduleId, pageId) {
    setActiveModule(moduleId);
    setActivePage(pageId);
    setPanelOpen(true);
  }

  function handleClosePanel() {
    setPanelOpen(false);
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  function handleLogout() {
    setUser(null);
    setActiveModule('dashboard');
    setActivePage('dashboard');
    setPanelOpen(false);
  }

  const showPanel = panelOpen && activeModule !== 'dashboard';
  const isConfigPage = activeModule === 'configuracion' && CONFIG_PAGES.has(activePage);

  return (
    <div className="app-shell">
      <IconSidebar activeModule={activeModule} onSelectModule={handleSelectModule} user={user} onLogout={handleLogout} />

      {showPanel && (
        <PanelSidebar
          activeModule={activeModule}
          activePage={activePage}
          onSelectPage={handleSelectPage}
          onClose={handleClosePanel}
        />
      )}

      <div className="main-area">
        <TopHeader activeModule={activeModule} activePage={activePage} />
        <main className="page-content">
          {activeModule === 'dashboard' ? (
            <Dashboard onNavigate={handleNavigate} />
          ) : isConfigPage ? (
            <ConfigPage activePage={activePage} />
          ) : activePage ? (
            <ModulePage pageId={activePage} />
          ) : (
            <div className="empty-state" style={{ paddingTop: 80 }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                Selecciona una opción del menú lateral.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

