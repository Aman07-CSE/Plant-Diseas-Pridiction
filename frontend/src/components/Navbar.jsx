import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Menu, X, Sun, Moon } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/',        label: 'Home' },
  { to: '/detect',  label: 'Detect Disease' },
  { to: '/chatbot', label: 'AI Chatbot' },
];

export default function Navbar({ theme, setTheme }) {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = () => {
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-strong border-b border-dark-border/50 shadow-[0_8px_32px_rgba(0,0,0,0.28)]'
          : 'bg-dark/30'
      }`}
    >
      <div className="page-container">
        <div className="flex h-16 items-center justify-between md:h-[72px]">

          {/* ── Logo ── */}
          <Link to="/" className="shrink-0">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex cursor-pointer items-center gap-3"
              onClick={handleNavClick}
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-primary-light to-primary shadow-lg shadow-primary/30 ring-1 ring-primary-light/30">
                <Leaf className="h-5 w-5 text-white" />
                {/* tiny pulse ring */}
                <span className="absolute -inset-0.5 rounded-[14px] border border-primary-light/40 animate-pulse" />
              </div>
              <div className="hidden sm:block">
                <span className="block font-heading text-[1.1rem] font-bold tracking-tight text-text-primary">
                  PlantDoc <span className="text-primary-light">AI</span>
                </span>
                <span className="block text-[10px] uppercase tracking-[0.22em] text-text-muted">
                  Smart crop diagnosis
                </span>
              </div>
            </motion.div>
          </Link>

          {/* ── Desktop nav pill ── */}
          <div className="hidden items-center gap-3.5 rounded-full border border-dark-border/60 bg-dark-surface/60 p-1.5 md:flex backdrop-blur-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleNavClick}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `relative cursor-pointer rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'text-primary-light' : 'text-text-secondary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-primary/15 ring-1 ring-primary/35 shadow-inner shadow-primary/10"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="glass rounded-xl p-3.5 text-text-secondary transition-colors hover:text-primary-light focus:outline-none"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -30, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 30, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.22 }}
                >
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              className="glass rounded-xl p-2.5 text-text-secondary transition-colors hover:text-primary-light md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={menuOpen ? 'x' : 'menu'}
                  initial={{ rotate: -20, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 20, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                >
                  {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            className="overflow-hidden glass-strong border-t border-dark-border/60 md:hidden"
          >
            <div className="page-container space-y-1.5 py-4">
              {navLinks.map((link) => (
                <motion.div key={link.to} whileTap={{ scale: 0.98 }}>
                  <NavLink
                    to={link.to}
                    end={link.to === '/'}
                    onClick={handleNavClick}
                    className={({ isActive }) =>
                      `block w-full cursor-pointer rounded-2xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                        isActive
                          ? 'border border-primary/30 bg-primary/15 text-primary-light shadow-inner shadow-primary/10'
                          : 'text-text-secondary hover:bg-dark-surface/60 hover:text-text-primary'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
