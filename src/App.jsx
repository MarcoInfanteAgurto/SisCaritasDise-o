import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { IconSidebar } from './components/IconSidebar';
import { PanelSidebar } from './components/PanelSidebar';
import { TopHeader } from './components/TopHeader';
import { Dashboard } from './components/Dashboard';
import { ModulePage } from './components/ModulePage';

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
      setActivePage('');
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

  const showPanel = panelOpen && activeModule !== 'dashboard';

  return (
    <div className="app-shell">
      <IconSidebar activeModule={activeModule} onSelectModule={handleSelectModule} />

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
