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
import Footer from './components/Footer';
import BackgroundEffects from './components/BackgroundEffects';

const queryClient = new QueryClient();

function AppContent() {
  const [theme, setTheme] = useState(() => localStorage.getItem('ups-theme') || 'cyan');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ups-theme', theme);
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
              <Route path="/settings" element={<Settings setTheme={setTheme} currentTheme={theme} />} />
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
