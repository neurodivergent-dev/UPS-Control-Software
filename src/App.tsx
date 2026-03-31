import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Diagnostics from './pages/Diagnostics';
import SystemInfo from './pages/SystemInfo';
import Events from './pages/Events';
import Settings from './pages/Settings';

const queryClient = new QueryClient();

function AppContent() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ups-theme') || 'cyan');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ups-theme', theme);
  }, [theme]);

  return (
    <div className="min-h-screen transition-colors duration-500">
      {/* Dynamic Background Glow Orbs */}
      <div className="vibe-glow -top-24 -left-20 animate-float" />
      <div className="vibe-glow -bottom-32 -right-32 animate-pulse-glow" style={{ animationDelay: '2s' }} />

      <Navbar />

      <div className="flex min-h-[calc(100vh-5rem)]">
        <Sidebar />

        <main className="flex-1 ml-64 p-12 relative z-10 w-full overflow-x-hidden">
          <div className="max-w-[1800px] mx-auto w-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/diagnostics" element={<Diagnostics />} />
              <Route path="/events" element={<Events />} />
              <Route path="/info" element={<SystemInfo />} />
              <Route path="/settings" element={<Settings setTheme={setTheme} currentTheme={theme} />} />
            </Routes>
          </div>
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
