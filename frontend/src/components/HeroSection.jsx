import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Scan, MessageCircle, ChevronDown, Leaf,
  ShieldCheck, Zap, TrendingUp, FlaskConical, TreePine,
} from 'lucide-react';
import heroImage from '../assets/hero.png';

/* ── Animated counter ── */
function CountUp({ end, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0);
  const ref           = useRef(false);
  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start  = Date.now();
    const tick   = () => {
      const t = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(ease * end));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration]);
  return <>{val}{suffix}</>;
}

const STATS = [
  { icon: TreePine,     end: 14,   suffix: '+',  label: 'Plant species' },
  { icon: ShieldCheck,  end: 38,   suffix: '+',  label: 'Disease classes' },
  { icon: TrendingUp,   end: 95,   suffix: '%',  label: 'Model accuracy' },
  { icon: FlaskConical, end: 1.4,  suffix: 's',  label: 'Avg. inference' },
];

export default function HeroSection() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="relative flex min-h-[92svh] items-center justify-center overflow-hidden pt-24 pb-16 sm:min-h-screen sm:pt-28 sm:pb-20">

      {/* ── Floating decoration ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-[12%] left-[6%] text-primary/20"
          animate={{ y: [-12, 12, -12], rotate: [0, 12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Leaf className="h-16 w-16" />
        </motion.div>
        <motion.div
          className="absolute top-[22%] right-[7%] text-warning/18"
          animate={{ y: [6, -14, 6], rotate: [0, -10, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        >
          <Leaf className="h-12 w-12" />
        </motion.div>
        <motion.div
          className="absolute bottom-[18%] left-[14%] text-accent/15"
          animate={{ y: [0, -8, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          <Leaf className="h-10 w-10" />
        </motion.div>

        {/* glow blobs */}
        <div className="absolute top-[8%] right-[18%]  h-96 w-96  rounded-full bg-primary/9  blur-[100px]" />
        <div className="absolute bottom-[8%] left-[8%]  h-80 w-80  rounded-full bg-warning/9  blur-[100px]" />
        <div className="absolute top-[40%] left-[40%]  h-60 w-60  rounded-full bg-accent/7   blur-[80px]" />
      </div>

      {/* ── Content grid ── */}
      <div className="relative z-10 mx-auto grid w-full items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">

        {/* LEFT — copy */}
        <div>
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="tag-badge mb-6"
          >
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Plant Health Intelligence
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12 }}
            className="mb-6 font-heading text-[2.25rem] font-extrabold leading-[1.04] tracking-tight sm:text-5xl lg:text-7xl"
          >
            Detect plant
            <span className="mt-1 block animate-gradient bg-gradient-to-r from-primary-light via-accent to-warning bg-clip-text text-transparent">
              diseases instantly
            </span>
            <span className="text-text-primary/80">with AI precision</span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="mb-9 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg md:text-xl"
          >
            Upload a leaf photo and get instant disease identification, confidence scoring, and AI-generated treatment guidance — all in one seamless workflow.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.38 }}
            className="mb-10 flex flex-col items-stretch gap-3 sm:mb-12 sm:flex-row sm:items-center"
          >
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 0 36px rgba(22,163,74,0.38)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate('/detect')}
              className="cta-button flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/25 transition-all duration-300 sm:w-auto"
            >
              <Scan className="h-5 w-5" />
              Start Detection
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigate('/chatbot')}
              className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-primary/35 px-8 py-4 text-base font-bold text-primary-light transition-all duration-300 hover:border-primary/65 hover:bg-primary/10 sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" />
              Chat with AI Expert
            </motion.button>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3"
          >
            {STATS.map(({ icon: Icon, end, suffix, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                className="panel-card rounded-2xl p-3 text-center sm:p-4"
              >
                <div className="mb-2 flex justify-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/15 text-primary-light">
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="stat-number text-2xl">
                  <CountUp end={end} suffix={suffix} />
                </p>
                <p className="mt-1 text-xs font-medium text-text-muted">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — mock dashboard */}
        <motion.div
          initial={{ opacity: 0, x: 42 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.72, delay: 0.22 }}
          className="relative"
        >
          {/* Outer glow ring */}
          <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-br from-primary/18 via-accent/10 to-transparent blur-2xl" />

          <div className="hero-stage relative rounded-[2rem] p-5">
            {/* Header bar */}
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-dark-border/60 bg-dark-card/70 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-text-muted">Live analysis</p>
                <p className="mt-0.5 font-heading text-base font-bold text-text-primary">Leaf Health Monitor</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                </span>
                <span className="text-xs font-semibold text-success">Active</span>
              </div>
            </div>

            {/* Image with scan overlay */}
            <div className="relative overflow-hidden rounded-2xl border border-dark-border/60 bg-dark-surface/60">
              <img
                src={heroImage}
                alt="Plant leaf analysis"
                className="h-48 w-full object-contain sm:h-56 md:h-64"
              />
              {/* scanning line */}
              <div className="scan-overlay">
                <div className="scan-line" />
              </div>
              {/* corner brackets */}
              <div className="absolute top-2 left-2 h-5 w-5 border-l-2 border-t-2 border-primary-light/60 rounded-tl-sm" />
              <div className="absolute top-2 right-2 h-5 w-5 border-r-2 border-t-2 border-primary-light/60 rounded-tr-sm" />
              <div className="absolute bottom-2 left-2 h-5 w-5 border-l-2 border-b-2 border-primary-light/60 rounded-bl-sm" />
              <div className="absolute bottom-2 right-2 h-5 w-5 border-r-2 border-b-2 border-primary-light/60 rounded-br-sm" />
            </div>

            {/* Mini stats row */}
            <div className="mt-4 grid grid-cols-3 gap-2.5">
              {[
                { label: 'Confidence', value: '94%',  color: 'text-success' },
                { label: 'Inference',  value: '1.4s', color: 'text-primary-light' },
                { label: 'Class',      value: 'Blight', color: 'text-warning' },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-xl border border-dark-border/60 bg-dark-surface/70 p-3 text-center">
                  <p className="text-[10px] text-text-muted">{label}</p>
                  <p className={`mt-0.5 font-heading text-sm font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* AI recommendation chip */}
            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary-light">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <p className="text-xs leading-5 text-text-secondary">
                <span className="font-semibold text-text-primary">AI Recommendation: </span>
                Apply copper-based fungicide and prune affected leaves immediately.
              </p>
            </div>

            {/* Confidence bar */}
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs text-text-muted">Model confidence</span>
                <span className="text-xs font-bold text-primary-light">94%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-dark-surface">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '94%' }}
                  transition={{ duration: 1.6, delay: 0.9, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Scroll chevron ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-text-muted"
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.div>
    </div>
  );
}
