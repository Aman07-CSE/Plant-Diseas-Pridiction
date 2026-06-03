import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, X, Loader2, Leaf, AlertTriangle, CheckCircle2,
  ImagePlus, ScanSearch, ShieldPlus, UploadCloud, RotateCcw,
  FlaskConical, TreePine,
} from 'lucide-react';
import Webcam from 'react-webcam';
import ReactMarkdown from 'react-markdown';
import { predictDisease } from '../services/api';

/* ── Circular confidence ring ── */
function ConfidenceRing({ value }) {
  const radius      = 70;
  const circ        = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circ);
  const size = 168;
  const center = size / 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(circ - (value / 100) * circ);
    }, 200);
    return () => clearTimeout(timer);
  }, [value, circ]);

  const color = value >= 80 ? '#4ade80' : value >= 55 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative flex items-center justify-center scale-90 sm:scale-100" style={{ width: size, height: size }}>
      {/* track */}
      <svg width={size} height={size} className="absolute">
        <circle
          cx={center} cy={center} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={12}
        />
      </svg>
      {/* progress */}
      <svg width={size} height={size} className="absolute -rotate-90">
        <circle
          cx={center} cy={center} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1), stroke 0.5s' }}
        />
      </svg>
      {/* label */}
      <div className="flex flex-col items-center">
        <span className="font-heading text-4xl font-extrabold" style={{ color }}>{value}%</span>
        <span className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-text-muted">confidence</span>
      </div>
    </div>
  );
}

/* ── Top-level component ── */
export default function DetectionSection() {
  const [image,        setImage]        = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [result,       setResult]       = useState(null);
  const [error,        setError]        = useState(null);
  const [showCamera,   setShowCamera]   = useState(false);
  const [dragActive,   setDragActive]   = useState(false);

  const fileInputRef = useRef(null);
  const webcamRef    = useRef(null);

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  const captureImage = useCallback(() => {
    const src = webcamRef.current?.getScreenshot();
    if (src) {
      fetch(src).then(r => r.blob()).then(blob => {
        const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        setImage(file);
        setImagePreview(src);
        setShowCamera(false);
        setResult(null);
        setError(null);
      });
    }
  }, []);

  const handlePredict = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await predictDisease(image);
      if (data.success) setResult(data);
      else setError(data.error || 'Prediction failed.');
    } catch (err) {
      setError(err.response?.data?.error || 'Cannot reach the server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null); setImagePreview(null);
    setResult(null); setError(null); setShowCamera(false);
  };

  return (
    <div className="mx-auto w-full">
      {/* ── Section header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 text-center"
      >
        <div className="tag-badge mx-auto mb-4">
          <Leaf className="h-3.5 w-3.5" />
          Disease Detection
        </div>
        <h2 className="section-heading">Upload. Analyze. Treat.</h2>
        <p className="section-sub mx-auto mt-4 max-w-xl">
          Drop a leaf photo or use your camera. Our AI model identifies the disease and serves treatment guidance instantly.
        </p>
      </motion.div>

      {/* ── Feature chips ── */}
      <div className="mb-14 grid gap-5 md:grid-cols-3 md:gap-6">
        {[
          { icon: UploadCloud, title: 'Drag & Drop Upload',     desc: 'Supports JPG, PNG and WebP. Works on mobile too.' },
          { icon: ScanSearch,  title: 'Confidence-scored Result', desc: 'See exactly how certain the model is about each prediction.' },
          { icon: ShieldPlus,  title: 'Integrated Remedies',   desc: 'Treatment and prevention guidance inside the same view.' },
        ].map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            className="panel-card rounded-[22px] p-6 text-center md:min-h-[170px]"
          >
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/14 text-primary-light ring-1 ring-primary/20">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="font-heading text-base font-bold text-text-primary">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-text-secondary">{desc}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Main two-column panel ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-7">

        {/* ── LEFT: Upload / Camera / Preview ── */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <AnimatePresence mode="wait">

            {/* Camera view */}
            {showCamera && (
              <motion.div key="camera"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                className="panel-card overflow-hidden rounded-[28px]"
              >
                <div className="p-5 md:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-primary-light" />
                      <h3 className="font-heading font-semibold text-text-primary">Live Camera</h3>
                    </div>
                    <button onClick={() => setShowCamera(false)}
                      className="rounded-xl p-2 text-text-muted transition-colors hover:bg-dark-surface hover:text-text-primary">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="relative mb-4 overflow-hidden rounded-2xl border border-dark-border/60">
                    <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg"
                      videoConstraints={{ facingMode: 'environment' }}
                      className="aspect-[4/3] w-full object-cover" />
                    <div className="scan-overlay"><div className="scan-line" /></div>
                    {/* corner brackets */}
                    {['top-2 left-2 border-l-2 border-t-2 rounded-tl-sm',
                      'top-2 right-2 border-r-2 border-t-2 rounded-tr-sm',
                      'bottom-2 left-2 border-l-2 border-b-2 rounded-bl-sm',
                      'bottom-2 right-2 border-r-2 border-b-2 rounded-br-sm',
                    ].map(cls => (
                      <div key={cls} className={`absolute h-5 w-5 border-primary-light/60 ${cls}`} />
                    ))}
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                    onClick={captureImage}
                    className="cta-button flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-white">
                    <Camera className="h-5 w-5" /> Capture Photo
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Image preview */}
            {!showCamera && imagePreview && (
              <motion.div key="preview"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                className="panel-card overflow-hidden rounded-[28px]"
              >
                <div className="p-5 md:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ScanSearch className="h-4 w-4 text-primary-light" />
                      <h3 className="font-heading font-semibold text-text-primary">Ready to Analyze</h3>
                    </div>
                    <button onClick={handleReset}
                      className="rounded-xl p-2 text-text-muted transition-colors hover:bg-dark-surface hover:text-danger">
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="relative mb-4 overflow-hidden rounded-2xl border border-dark-border/60">
                    <img src={imagePreview} alt="Plant leaf to analyse"
                      className="aspect-[4/3] w-full object-cover" />
                    {loading && (
                      <div className="scan-overlay"><div className="scan-line" /></div>
                    )}
                  </div>

                  {/* image meta */}
                  <div className="mb-4 flex items-center gap-3 rounded-xl border border-dark-border/60 bg-dark-surface/60 px-4 py-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                      <ImagePlus className="h-4 w-4 text-primary-light" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary truncate max-w-[180px]">{image?.name}</p>
                      <p className="text-[10px] text-text-muted">{image ? (image.size / 1024).toFixed(1) + ' KB' : ''}</p>
                    </div>
                    <button onClick={handleReset}
                      className="ml-auto text-[10px] text-text-muted underline underline-offset-2 hover:text-danger transition-colors">
                      Remove
                    </button>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: '0 0 32px rgba(22,163,74,0.35)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handlePredict}
                    disabled={loading}
                    className="cta-button flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl py-3.5 font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? <><Loader2 className="h-5 w-5 animate-spin" /> Analyzing…</>
                      : <><Leaf className="h-5 w-5" /> Analyze Plant</>}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Upload drop-zone */}
            {!showCamera && !imagePreview && (
              <motion.div key="upload"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                className="panel-card overflow-hidden rounded-[28px]"
              >
                <div className="p-5 sm:p-6">
                  <div
                    onDragEnter={handleDrag} onDragLeave={handleDrag}
                    onDragOver={handleDrag} onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-[24px] border-2 border-dashed p-8 text-center transition-all duration-300 sm:p-12 ${
                      dragActive
                        ? 'border-primary bg-primary/12 shadow-[0_0_0_6px_rgba(74,222,128,0.08)]'
                        : 'border-dark-border hover:border-primary/50 hover:bg-dark-surface/50'
                    }`}
                  >
                    <input ref={fileInputRef} type="file" accept="image/*"
                      onChange={e => handleFileSelect(e.target.files?.[0])} className="hidden" />

                    <motion.div animate={{ y: dragActive ? -6 : 0 }} className="flex flex-col items-center">
                      <motion.div
                        animate={{ scale: dragActive ? 1.15 : 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-primary/15 ring-2 ring-primary/20 animate-pulse-glow"
                      >
                        <UploadCloud className="h-9 w-9 text-primary-light" />
                      </motion.div>
                      <p className="mb-2 font-heading text-xl font-bold text-text-primary">
                        {dragActive ? 'Release to upload' : 'Drop your leaf image here'}
                      </p>
                      <p className="mb-4 text-sm text-text-muted">or click to browse files</p>
                      <span className="rounded-full border border-dark-border/60 bg-dark-surface/70 px-4 py-1 text-xs text-text-muted">
                        JPG · PNG · WebP
                      </span>
                    </motion.div>
                  </div>

                  <div className="my-5 flex items-center gap-4">
                    <div className="h-px flex-1 bg-dark-border/60" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-text-muted">or</span>
                    <div className="h-px flex-1 bg-dark-border/60" />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={() => setShowCamera(true)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-primary/35 py-3.5 font-bold text-primary-light transition-all hover:border-primary/60 hover:bg-primary/10"
                  >
                    <Camera className="h-5 w-5" />
                    Open Camera
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── RIGHT: Results panel ── */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <AnimatePresence mode="wait">

            {/* Loading */}
            {loading && (
              <motion.div key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="panel-card flex min-h-[360px] flex-col items-center justify-center gap-6 rounded-[28px] p-6 text-center sm:min-h-[500px] sm:p-8"
              >
                <div className="relative flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/15 border-t-primary-light animate-spin" />
                  <Leaf className="h-8 w-8 text-primary-light animate-pulse" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-text-primary">Analyzing Image…</h3>
                  <p className="mt-2 max-w-xs text-sm text-text-muted">
                    Our deep-learning model is examining your leaf. This usually takes 1–2 seconds.
                  </p>
                </div>
                <div className="w-48">
                  <div className="h-1.5 overflow-hidden rounded-full bg-dark-surface">
                    <motion.div
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="h-full w-1/3 rounded-full bg-gradient-to-r from-transparent via-primary-light to-transparent"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error */}
            {!loading && error && (
              <motion.div key="error"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="panel-card flex min-h-[360px] flex-col items-center justify-center gap-5 rounded-[28px] p-6 text-center sm:min-h-[500px] sm:p-8"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-danger/25 bg-danger/12 ring-4 ring-danger/10">
                  <AlertTriangle className="h-9 w-9 text-danger" />
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-text-primary">Something went wrong</h3>
                  <p className="mt-2 max-w-xs text-sm text-text-muted">{error}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={handleReset}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-dark-border/60 bg-dark-surface/70 px-6 py-2.5 text-sm font-semibold text-text-secondary transition-colors hover:text-text-primary"
                >
                  <RotateCcw className="h-4 w-4" /> Try Again
                </motion.button>
              </motion.div>
            )}

            {/* Result */}
            {!loading && !error && result && (
              <motion.div key="result"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="panel-card overflow-hidden rounded-[28px]"
              >
                <div className="p-6 md:p-7">
                  {/* Status banner */}
                  <div className={`mb-6 flex flex-wrap items-start gap-3 rounded-2xl p-4 sm:flex-nowrap sm:items-center sm:gap-4 ${
                    result.prediction.is_healthy
                      ? 'border border-success/30 bg-success/10'
                      : 'border border-warning/30 bg-warning/10'
                  }`}>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                      result.prediction.is_healthy ? 'bg-success/20' : 'bg-warning/20'
                    }`}>
                      {result.prediction.is_healthy
                        ? <CheckCircle2 className="h-7 w-7 text-success" />
                        : <AlertTriangle className="h-7 w-7 text-warning" />}
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-text-primary">
                        {result.prediction.is_healthy ? 'Healthy Plant ✓' : 'Disease Detected'}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        {result.prediction.plant} — {result.prediction.condition}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="ml-auto flex items-center gap-1 rounded-xl border border-dark-border/50 bg-dark-surface/60 px-3 py-2 text-[11px] font-medium text-text-muted transition-colors hover:text-text-primary shrink-0"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> New
                    </motion.button>
                  </div>

                  {/* Two-column: ring + diagnosis */}
                  <div className="mb-6 grid gap-4 sm:grid-cols-[auto_1fr]">
                    {/* Confidence ring */}
                    <div className="flex items-center justify-center rounded-2xl border border-dark-border/60 bg-dark-surface/50 p-4">
                      <ConfidenceRing value={result.prediction.confidence} />
                    </div>

                    {/* Diagnosis details */}
                    <div className="rounded-2xl border border-dark-border/60 bg-dark-surface/50 p-5">
                      <p className="mb-4 text-[10px] uppercase tracking-[0.22em] text-text-muted">Diagnosis</p>
                      <div className="space-y-4">
                        {[
                          { icon: TreePine,     label: 'Plant',      val: result.prediction.plant },
                          { icon: AlertTriangle, label: 'Condition',  val: result.prediction.condition },
                          { icon: FlaskConical, label: 'Confidence', val: `${result.prediction.confidence}%` },
                        ].map(({ icon: Icon, label, val }) => (
                          <div key={label} className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/14 text-primary-light">
                              <Icon className="h-3.5 w-3.5" />
                            </div>
                            <div>
                              <p className="text-[10px] text-text-muted">{label}</p>
                              <p className="font-heading text-sm font-bold text-text-primary">{val}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation */}
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary-light">
                        <ShieldPlus className="h-3.5 w-3.5" />
                      </div>
                      <h4 className="font-heading text-sm font-bold text-text-primary">AI Recommendation</h4>
                    </div>
                    <div className="max-h-[280px] overflow-y-auto rounded-2xl border border-dark-border/60 bg-dark-surface/70 p-5">
                      <div className="markdown-content text-sm">
                        <ReactMarkdown>{result.recommendation}</ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Empty state */}
            {!loading && !error && !result && (
              <motion.div key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="panel-card flex min-h-[360px] flex-col items-center justify-center rounded-[28px] p-6 text-center sm:min-h-[500px] sm:p-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.07, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/10 animate-pulse-glow"
                >
                  <Leaf className="h-12 w-12 text-primary-light" />
                </motion.div>
                <h3 className="mb-3 font-heading text-xl font-bold text-text-primary">Awaiting Leaf Image</h3>
                <p className="max-w-xs text-sm leading-6 text-text-muted">
                  Upload or capture a photo of a plant leaf on the left to begin AI-powered disease analysis.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 w-full max-w-xs">
                  {[
                    { label: 'Upload Image', icon: UploadCloud, action: () => fileInputRef.current?.click() },
                    { label: 'Use Camera',   icon: Camera,      action: () => setShowCamera(true) },
                  ].map(({ label, icon: Icon, action }) => (
                    <motion.button key={label} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={action}
                      className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dark-border/60 bg-dark-surface/60 px-4 py-4 text-xs font-semibold text-text-secondary transition-colors hover:border-primary/40 hover:text-primary-light"
                    >
                      <Icon className="h-5 w-5" /> {label}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
