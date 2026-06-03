import { motion } from 'framer-motion';
import {
  BrainCircuit,
  ScanSearch,
  ShieldCheck,
  ImageUp,
  Cpu,
  Stethoscope,
} from 'lucide-react';
import HeroSection from '../components/HeroSection';

const featureCards = [
  {
    icon: ScanSearch,
    title: 'Instant Visual Triage',
    description:
      'Upload or capture a leaf photo and receive disease identification with real-time confidence scoring in under 2 seconds.',
    color: 'from-emerald-500/20 to-emerald-600/10',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    icon: BrainCircuit,
    title: 'Actionable AI Guidance',
    description:
      'Our AI generates detailed treatment plans, prevention strategies, and follow-up care advice tailored to each diagnosis.',
    color: 'from-cyan-500/18 to-cyan-600/8',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
  },
  {
    icon: ShieldCheck,
    title: 'Field-Friendly Workflow',
    description:
      'Designed for students, agronomists, and growers who need clarity and precision at a glance on any device.',
    color: 'from-violet-500/18 to-violet-600/8',
    iconBg: 'bg-violet-500/15 text-violet-400',
  },
];

const steps = [
  {
    num: '01',
    icon: ImageUp,
    title: 'Upload a Leaf Photo',
    description: 'Drag-and-drop an image or capture one directly with your camera.',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'AI Analyzes the Image',
    description: 'Our deep-learning model classifies the disease with confidence scoring.',
  },
  {
    num: '03',
    icon: Stethoscope,
    title: 'Get Treatment Guidance',
    description: 'Receive detailed AI-powered remedies and prevention recommendations.',
  },
];

export default function HomePage() {
  return (
    <>
      <section>
        <HeroSection />
      </section>

      <section className="pb-20 md:pb-24">
        <div className="mx-auto w-full">
          <div className="grid gap-6 md:grid-cols-3 md:gap-8">
            {featureCards.map(({ icon: Icon, title, description, color, iconBg }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="panel-card group rounded-[28px] p-7 text-center md:min-h-[220px] md:p-8"
              >
                <div
                  className={`mb-2 h-full w-full absolute inset-0 rounded-[28px] bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />
                <div className="relative mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-primary text-white shadow-lg shadow-primary/25 ring-1 ring-primary-light/30">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="relative font-heading text-lg font-bold text-text-primary">{title}</h3>
                <p className="relative mt-2 text-sm leading-6 text-text-secondary">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 pt-10 md:pb-28 md:pt-12">
        <div className="mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 flex flex-col items-center text-center md:mb-20"
          >
            <div className="tag-badge mx-auto mb-4">How It Works</div>
            <h2 className="section-heading">Three steps to diagnosis</h2>
            <p className="section-sub mx-auto mt-5 max-w-2xl text-center !text-center">
              A streamlined workflow from image capture to actionable treatment guidance.
            </p>
          </motion.div>

          <div className="relative grid gap-7 md:grid-cols-3 md:gap-8">
            <div className="absolute top-[52px] left-[calc(16.66%+20px)] right-[calc(16.66%+20px)] hidden md:flex items-center justify-between pointer-events-none">
              {[0, 1].map((i) => (
                <div key={i} className="flex-1 mx-8">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
                    className="h-px origin-left bg-gradient-to-r from-primary/50 to-primary/15"
                  />
                </div>
              ))}
            </div>

            {steps.map(({ num, icon: Icon, title, description }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="panel-card rounded-[26px] p-7 text-center md:min-h-[260px] md:p-8"
              >
                <div className="relative mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-spin-slow" />
                  <div className="flex h-[56px] w-[56px] items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light to-primary text-white shadow-lg shadow-primary/25 ring-1 ring-primary-light/30">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <span className="mb-3 block font-heading text-[0.7rem] font-bold uppercase tracking-[0.22em] text-primary-light/70">
                  Step {num}
                </span>
                <h3 className="mb-2 font-heading text-lg font-bold text-text-primary">{title}</h3>
                <p className="text-sm leading-6 text-text-secondary">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
