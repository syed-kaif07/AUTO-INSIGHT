import { Link } from 'react-router-dom';
import { Brain, Sparkles, Database, Zap, BarChart3, FileText, Activity, Check, ChevronDown, Star, ArrowRight, Shield, Clock, Users, Award } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import BlurFade from '@/components/magicui/BlurFade';
import NumberTicker from '@/components/magicui/NumberTicker';
import MagicCard from '@/components/magicui/MagicCard';
import ShimmerButton from '@/components/magicui/ShimmerButton';
import Particles from '@/components/magicui/Particles';
import Marquee from '@/components/magicui/Marquee';
import AuroraText from '@/components/magicui/AuroraText';
import BorderBeam from '@/components/magicui/BorderBeam';
import AnimatedGridPattern from '@/components/magicui/AnimatedGridPattern';

const LandingNavbar = () => (
  <nav className="fixed top-0 w-full z-50 nav-blur h-[72px] flex items-center">
    <div className="container mx-auto flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <span className="text-lg font-heading font-bold text-foreground">AutoInsight</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
        <a href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</a>
        <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
        <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block">Login</Link>
        <Link to="/signup">
          <ShimmerButton className="text-sm px-5 py-2.5">Get Started</ShimmerButton>
        </Link>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    <Particles className="z-0" quantity={30} />
    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] glow-orb pointer-events-none" />
    <div className="absolute inset-0 grid-pattern pointer-events-none" />
    <div className="container mx-auto text-center relative z-10">
      <BlurFade delay={0.1}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 mb-8"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium bg-clip-text text-transparent bg-[length:200%_200%] animate-[aurora_3s_ease-in-out_infinite]" style={{ backgroundImage: 'linear-gradient(90deg, #8B5CF6, #A855F7, #D946EF, #8B5CF6)' }}>
            AI-Powered Analytics Platform
          </span>
        </motion.div>
      </BlurFade>
      
      <BlurFade delay={0.2}>
        <h1 className="text-4xl md:text-hero font-heading font-bold mb-6 max-w-4xl mx-auto">
          Turn Raw Data Into <AuroraText>Actionable Insights</AuroraText> Automatically
        </h1>
      </BlurFade>
      
      <BlurFade delay={0.3}>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          AutoInsight uses AI agents to automate your entire data science workflow — from data cleaning to predictive modeling and report generation.
        </p>
      </BlurFade>
      
      <BlurFade delay={0.4}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/signup">
            <ShimmerButton>Start Analyzing Free <ArrowRight className="w-4 h-4" /></ShimmerButton>
          </Link>
          <a href="#features" className="secondary-btn">See How It Works</a>
        </div>
      </BlurFade>

      <BlurFade delay={0.5}>
        <div className="flex flex-wrap items-center justify-center gap-12 mb-16">
          {[
            { val: 10, suffix: 'x', label: 'Faster Analysis' },
            { val: 500, suffix: 'MB', label: 'Max Dataset' },
            { val: 5, suffix: '', label: 'AI Agents' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-heading font-bold gradient-text">
                <NumberTicker value={s.val} suffix={s.suffix} />
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </BlurFade>

      <BlurFade delay={0.6}>
        <div className="max-w-4xl mx-auto glass-strong rounded-2xl p-4 overflow-hidden relative">
          <BorderBeam duration={8} />
          <div className="flex gap-3 h-[300px]">
            <div className="hidden md:flex w-48 bg-white/[0.03] rounded-xl p-3 flex-col gap-2">
              {['Dashboard', 'Data Sources', 'Analysis', 'Predictions', 'Reports'].map(item => (
                <div key={item} className={`text-xs px-3 py-2 rounded-lg ${item === 'Dashboard' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>{item}</div>
              ))}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="bg-white/[0.03] rounded-xl p-4 flex flex-col justify-between">
                <div className="text-xs text-muted-foreground">Total Datasets</div>
                <div className="text-2xl font-heading font-bold">24</div>
                <div className="h-12 bg-primary/10 rounded-lg mt-2" />
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 flex flex-col justify-between">
                <div className="text-xs text-muted-foreground">Accuracy</div>
                <div className="text-2xl font-heading font-bold">94.2%</div>
                <div className="h-12 bg-success/10 rounded-lg mt-2" />
              </div>
              <div className="col-span-2 bg-white/[0.03] rounded-xl p-4">
                <div className="text-xs text-muted-foreground mb-2">Agent Status</div>
                <div className="space-y-2">
                  {[['Data Collection', 'Completed'], ['EDA Agent', 'Running'], ['Prediction', 'Queued']].map(([name, status]) => (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <span className="text-secondary-foreground">{name}</span>
                      <span className={status === 'Completed' ? 'text-success' : status === 'Running' ? 'text-primary' : 'text-muted-foreground'}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  </section>
);

const companies = ['TechCorp', 'DataFlow', 'AnalyticsPro', 'CloudBase', 'InsightAI', 'MetricsHub', 'NeuralNet', 'DataVault'];

const TrustedSection = () => (
  <section className="py-12 border-y border-white/[0.05]">
    <div className="container mx-auto">
      <p className="text-sm text-muted-foreground text-center mb-8">Trusted by data teams at leading companies</p>
      <Marquee speed={30}>
        {companies.map(name => (
          <span key={name} className="text-lg font-heading font-semibold text-foreground/30 hover:text-foreground/60 transition-colors px-6">{name}</span>
        ))}
      </Marquee>
    </div>
  </section>
);

const features = [
  { icon: Database, title: 'Smart Data Ingestion', desc: 'Upload CSV, Excel, or JSON files up to 500MB. Connect databases and APIs seamlessly.' },
  { icon: Zap, title: 'Automated Data Cleaning', desc: 'AI agents automatically handle missing values, duplicates, and outliers.' },
  { icon: BarChart3, title: 'Exploratory Data Analysis', desc: 'Generate comprehensive visualizations and statistical summaries automatically.' },
  { icon: Brain, title: 'Predictive Modeling', desc: 'Train and compare ML models with automated feature engineering and selection.' },
  { icon: FileText, title: 'Automated Reporting', desc: 'Generate professional reports with insights, charts, and recommendations.' },
  { icon: Activity, title: 'Agent Pipeline Monitor', desc: "Track each AI agent's progress in real-time with detailed logs." },
];

const FeaturesSection = () => (
  <section id="features" className="section-spacing relative overflow-hidden">
    <AnimatedGridPattern />
    <div className="container mx-auto relative z-10">
      <BlurFade>
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Features</span>
          </div>
          <h2 className="text-3xl md:text-section font-heading font-bold mb-4">Everything You Need to Automate Analytics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">Our AI agents handle every step of the data science workflow so you can focus on decisions.</p>
        </div>
      </BlurFade>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <BlurFade key={f.title} delay={i * 0.1}>
            <MagicCard className="p-6 h-full">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </div>
  </section>
);

const pipelineSteps = [
  { num: '01', title: 'Data Collection', status: 'done' },
  { num: '02', title: 'Data Cleaning', status: 'done' },
  { num: '03', title: 'EDA Analysis', status: 'running' },
  { num: '04', title: 'ML Prediction', status: 'queued' },
  { num: '05', title: 'Report Generation', status: 'queued' },
];

const BenefitsSection = () => (
  <section id="benefits" className="section-spacing bg-section">
    <div className="container mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <BlurFade>
          <div>
            <h2 className="text-3xl md:text-section font-heading font-bold mb-6">Automate Your Entire Data Pipeline</h2>
            <p className="text-muted-foreground mb-8">Stop spending weeks on manual analysis. AutoInsight's AI agents work together to deliver insights in minutes.</p>
            <div className="space-y-4 mb-8">
              {['No coding required', 'Automated feature engineering', 'Multiple ML model comparison', 'Professional report generation', 'Real-time agent monitoring', 'Enterprise-grade security'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                  style={{ willChange: 'transform, opacity' }}
                >
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-secondary-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
            <Link to="/signup">
              <ShimmerButton>Get Started <ArrowRight className="w-4 h-4" /></ShimmerButton>
            </Link>
          </div>
        </BlurFade>
        <BlurFade delay={0.2}>
          <div className="space-y-3">
            {pipelineSteps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                viewport={{ once: true }}
                className={`glass-card p-4 flex items-center gap-4 ${step.status === 'running' ? 'border-primary/30 animate-pulse-glow' : ''}`}
                style={{ willChange: 'transform, opacity' }}
              >
                <span className="text-sm font-heading font-bold text-muted-foreground">{step.num}</span>
                <span className="flex-1 font-medium text-foreground">{step.title}</span>
                {step.status === 'done' && <span className="text-xs bg-success/20 text-success px-3 py-1 rounded-full">Done</span>}
                {step.status === 'running' && <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">Running</span>}
                {step.status === 'queued' && <span className="text-xs bg-white/[0.05] text-muted-foreground px-3 py-1 rounded-full">Queued</span>}
              </motion.div>
            ))}
          </div>
        </BlurFade>
      </div>
    </div>
  </section>
);

const metrics = [
  { icon: Users, value: 10000, label: 'Datasets Processed', suffix: '+' },
  { icon: Award, value: 98.7, label: 'Success Rate', suffix: '%', decimal: 1 },
  { icon: Clock, value: 10, label: 'Faster Analysis', suffix: 'x' },
  { icon: Star, value: 4.9, label: 'User Rating', suffix: '/5', decimal: 1 },
];

const MetricsSection = () => (
  <section className="section-spacing">
    <div className="container mx-auto">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <BlurFade key={m.label} delay={i * 0.1}>
            <MagicCard className="p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <m.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl font-heading font-bold mb-1">
                <NumberTicker value={m.value} suffix={m.suffix} decimalPlaces={m.decimal || 0} />
              </div>
              <div className="text-sm text-muted-foreground">{m.label}</div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </div>
  </section>
);

const testimonials = [
  { initials: 'SC', name: 'Sarah Chen', role: 'Data Scientist', quote: 'AutoInsight cut our analysis time from weeks to hours. The AI agents are incredibly accurate and the reports are professional quality.' },
  { initials: 'MW', name: 'Marcus Williams', role: 'Startup Founder', quote: 'As a non-technical founder, AutoInsight lets me understand my data without hiring a data team. Game changer.' },
  { initials: 'PS', name: 'Priya Sharma', role: 'Business Analyst', quote: 'The predictive modeling feature helped us forecast revenue with 94% accuracy. The automated pipeline is seamless.' },
];

const TestimonialsSection = () => (
  <section className="section-spacing bg-section">
    <div className="container mx-auto">
      <BlurFade>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-section font-heading font-bold mb-4">What Our Users Say</h2>
          <p className="text-muted-foreground">Join thousands of data professionals using AutoInsight</p>
        </div>
      </BlurFade>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <BlurFade key={t.name} delay={i * 0.15}>
            <div className="relative rounded-2xl p-[1px] overflow-hidden h-full" style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.1), rgba(139,92,246,0.3))',
            }}>
              <div className="glass-strong rounded-2xl p-6 h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-secondary-foreground mb-6 text-sm leading-relaxed">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">{t.initials}</div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  </section>
);

const pricingPlans = [
  { name: 'Starter', price: 0, period: '/month', desc: 'Perfect for exploring', features: ['5 datasets/month', 'Basic EDA', '1 ML model', 'PDF reports', 'Community support'], cta: 'Get Started Free', highlight: false },
  { name: 'Pro', price: 49, period: '/month', desc: 'For serious analysts', features: ['Unlimited datasets', 'Advanced EDA', 'All ML models', 'Custom reports', 'Priority support', 'API access'], cta: 'Start Pro Trial', highlight: true },
  { name: 'Enterprise', price: 199, period: '/month', desc: 'For large teams', features: ['Everything in Pro', 'Team collaboration', 'Custom agents', 'SSO & SAML', 'Dedicated support', 'On-premise option'], cta: 'Contact Sales', highlight: false },
];

{/* Replaced Meteors with static gradient background for performance */}
const PricingSection = () => (
  <section id="pricing" className="section-spacing relative overflow-hidden">
    {/* Static gradient instead of Meteors */}
    <div className="absolute inset-0 pointer-events-none" style={{
      background: 'radial-gradient(ellipse at 30% 20%, rgba(139,92,246,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(99,102,241,0.04) 0%, transparent 50%)',
    }} />
    <div className="container mx-auto relative z-10">
      <BlurFade>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-section font-heading font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground">Start free, scale as you grow</p>
        </div>
      </BlurFade>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {pricingPlans.map((plan, i) => (
          <BlurFade key={plan.name} delay={i * 0.15}>
            <MagicCard className={`p-8 relative ${plan.highlight ? 'border-primary/30' : ''}`}>
              {plan.highlight && <BorderBeam duration={6} />}
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-accent text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">Most Popular</div>
              )}
              <h3 className="text-xl font-heading font-bold mb-1 text-foreground">{plan.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-heading font-bold text-foreground">$<NumberTicker value={plan.price} /></span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-secondary-foreground">
                    <Check className="w-4 h-4 text-success flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="block w-full">
                {plan.highlight ? (
                  <ShimmerButton className="w-full">{plan.cta}</ShimmerButton>
                ) : (
                  <button className="secondary-btn w-full text-center">{plan.cta}</button>
                )}
              </Link>
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </div>
  </section>
);

const faqItems = [
  { q: 'What file formats does AutoInsight support?', a: 'AutoInsight supports CSV, Excel (.xlsx, .xls), and JSON files up to 500MB.' },
  { q: 'Do I need ML experience to use AutoInsight?', a: 'No! AutoInsight is designed to automate the entire workflow. Our AI agents handle everything from data cleaning to model selection.' },
  { q: 'How long does the pipeline take?', a: 'Most datasets are processed in under 5 minutes. Larger datasets with complex models may take 10-15 minutes.' },
  { q: 'Can I export my results?', a: 'Yes! You can download reports as PDF, export charts as images, and access raw data through our API.' },
  { q: 'How secure is my data?', a: 'We use enterprise-grade encryption for data at rest and in transit. Your datasets are never shared or used for training.' },
  { q: 'Can I monitor the agent pipeline?', a: 'Yes! The Agent Monitor page shows real-time progress of each agent with detailed logs and status updates.' },
];

const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="section-spacing bg-section">
      <div className="container mx-auto max-w-3xl">
        <BlurFade>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-section font-heading font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about AutoInsight</p>
          </div>
        </BlurFade>
        <div className="space-y-3">
          {faqItems.map((faq, i) => (
            <BlurFade key={i} delay={i * 0.05}>
              <div className="glass-card rounded-xl overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left">
                  <span className="font-medium pr-4 text-foreground">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="px-5 pb-5 text-sm text-muted-foreground"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="border-t border-white/[0.05] py-16">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-5 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-heading font-bold">AutoInsight</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">AI-powered analytics platform that automates your entire data science workflow.</p>
        </div>
        {[
          { title: 'Product', links: ['Features', 'Pricing', 'Dashboard', 'API'] },
          { title: 'Resources', links: ['Documentation', 'Blog', 'Tutorials', 'Changelog'] },
          { title: 'Company', links: ['About', 'Careers', 'Contact', 'Privacy'] },
        ].map(col => (
          <div key={col.title}>
            <h4 className="font-heading font-semibold mb-4 text-sm text-foreground">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map(link => <li key={link}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/[0.05] pt-8 text-center text-sm text-muted-foreground">
        © 2025 AutoInsight. All rights reserved.
      </div>
    </div>
  </footer>
);

const Landing = () => (
  <div className="min-h-screen bg-background">
    <LandingNavbar />
    <HeroSection />
    <TrustedSection />
    <FeaturesSection />
    <BenefitsSection />
    <MetricsSection />
    <TestimonialsSection />
    <PricingSection />
    <FAQSection />
    <Footer />
  </div>
);

export default Landing;
