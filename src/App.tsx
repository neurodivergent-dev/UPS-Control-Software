import { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Diagnostics from './pages/Diagnostics';
import SystemInfo from './pages/SystemInfo';
import Events from './pages/Events';
import Settings from './pages/Settings';
import Footer from './components/Footer';
import BackgroundEffects from './components/BackgroundEffects';

const queryClient = new QueryClient();

function AppContent() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ups-theme') || 'tokyo');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ups-theme', theme);

    const themeColors: Record<string, string> = {
      cyan: '#00F0FF',
      tokyo: '#BC00FF',
      solar: '#FF4E00',
      neon: '#00FF00',
      crimson: '#FF003C',
      gold: '#FFD700',
      rose: '#FF66B2',
      lime: '#BFFF00',
      sapphire: '#BC00FF',
      emerald: '#10B981',
      midnight: '#60A5FA',
      amber: '#F59E0B',
      cyberpunk: '#FFE600',
      vulcan: '#FF4D00',
      ocean: '#2DD4BF',
      ghost: '#94A3B8',
    };

    const color = themeColors[theme] || '#030303';

    // Tarayıcı Status Bar (theme-color) Dinamik Güncelleme
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      (meta as HTMLMetaElement).name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', color);
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-500 overflow-x-hidden">
      <BackgroundEffects />

      <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />


      <div className="flex min-h-[calc(100vh-5rem)]">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

        <main className="flex-1 md:ml-64 p-4 xs:p-6 sm:p-8 lg:p-12 relative z-10 w-full overflow-x-hidden transition-all duration-300">
          <div className="max-w-[1800px] mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/events" element={<Events />} />
              <Route path="/info" element={<SystemInfo />} />
              <Route path="/settings" element={<Settings setTheme={setTheme} currentTheme={theme || 'tokyo'} />} />
            </Routes>
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppContent />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
