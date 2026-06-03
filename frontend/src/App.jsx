import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout } from 'lucide-react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import ChatbotPage from './pages/ChatbotPage';

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="app-shell relative min-h-screen bg-dark text-text-primary">
      {/* ── Background effects ── */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-12%] left-[-6%]  h-[700px] w-[700px] rounded-full bg-primary/10   blur-[140px]" />
        <div className="absolute top-[20%]  right-[-8%]  h-[560px] w-[560px] rounded-full bg-warning/8   blur-[150px]" />
        <div className="absolute bottom-[-15%] left-[22%] h-[580px] w-[580px] rounded-full bg-accent/8    blur-[140px]" />
        <div className="mesh-grid" />
        <div className="grain-overlay" />
      </div>

      <Navbar
        theme={theme}
        setTheme={setTheme}
      />

      <main className="relative z-10 pb-8 pt-6 md:pb-10 md:pt-8">
        <div className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detect" element={<DetectionPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 pb-10 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="panel-card page-container flex flex-col items-start justify-between gap-6 rounded-[28px] px-5 py-6 sm:flex-row sm:items-center sm:px-8 sm:py-7"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-primary shadow-lg shadow-primary/25">
              <Sprout className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-heading text-base font-bold text-text-primary">PlantDoc AI</p>
              <p className="text-xs text-text-muted">Intelligent crop disease diagnosis</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-dark-border/60 bg-dark-surface/70 px-3 py-1.5 text-xs text-text-muted">
              Powered by PyTorch
            </span>
            <span className="rounded-full border border-dark-border/60 bg-dark-surface/70 px-3 py-1.5 text-xs text-text-muted">
              Gemini AI
            </span>
            <span className="rounded-full border border-dark-border/60 bg-dark-surface/70 px-3 py-1.5 text-xs text-text-muted">
              PlantVillage Dataset
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link to="/" className="hover:text-text-primary transition-colors">Home</Link>
            <span>•</span>
            <Link to="/detect" className="hover:text-text-primary transition-colors">Detection</Link>
            <span>•</span>
            <Link to="/chatbot" className="hover:text-text-primary transition-colors">Chatbot</Link>
          </div>
        </motion.div>
      </footer>
    </div>
  );
}

export default App;