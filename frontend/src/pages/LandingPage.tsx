import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import {
    Brain, Sparkles, ArrowRight, Play, Database, Zap, BarChart3,
    FileText, Activity, CheckCircle2, Star, ChevronDown, ChevronUp,
    Users, Rocket, Shield, Clock
} from 'lucide-react';
import { useState } from 'react';

const features = [
    { icon: Database, title: 'Smart Data Ingestion', desc: 'Upload CSV, Excel, or JSON files. Connect to databases and APIs seamlessly.' },
    { icon: Zap, title: 'Automated Data Cleaning', desc: 'AI agents detect and fix missing values, outliers, and inconsistencies automatically.' },
    { icon: BarChart3, title: 'Exploratory Data Analysis', desc: 'Get comprehensive statistical summaries, distributions, and correlation analysis.' },
    { icon: Brain, title: 'Predictive Modeling', desc: 'Auto-train and compare ML models like XGBoost, Random Forest, and LightGBM.' },
    { icon: FileText, title: 'Automated Reporting', desc: 'Generate professional PDF reports with charts, insights, and recommendations.' },
    { icon: Activity, title: 'Agent Pipeline Monitor', desc: 'Track each AI agent\'s progress in real-time with detailed logs and status updates.' },
];

const benefits = [
    'No coding or ML experience required',
    'Results in minutes, not days',
    'Enterprise-grade data security',
    'Export to PDF, CSV, or dashboard',
    'Real-time agent monitoring',
    'Customizable analysis pipelines',
];

const pipeline = [
    { num: '01', title: 'Data Collection', status: 'done' as const },
    { num: '02', title: 'Data Cleaning', status: 'done' as const },
    { num: '03', title: 'EDA Analysis', status: 'running' as const },
    { num: '04', title: 'ML Prediction', status: 'queued' as const },
    { num: '05', title: 'Report Generation', status: 'queued' as const },
];

const testimonials = [
    { initials: 'SC', name: 'Sarah Chen', role: 'Data Scientist at TechCorp', quote: 'AutoInsight cut our analysis time by 10x. What used to take days now takes minutes with the AI agents handling everything automatically.' },
    { initials: 'MW', name: 'Marcus Williams', role: 'Founder at DataFlow', quote: 'The automated pipeline is a game-changer. We can now offer analytics as a service to our clients without hiring a full data team.' },
    { initials: 'PS', name: 'Priya Sharma', role: 'Business Analyst at GlobalFin', quote: 'I have zero ML experience but AutoInsight lets me build predictive models and generate reports that impress our C-suite every time.' },
];

const pricingPlans = [
    {
        name: 'Starter', price: '$0', period: '/month', highlight: false,
        features: ['5 datasets per month', '100MB file size limit', 'Basic EDA analysis', 'CSV export', 'Email support'],
        cta: 'Get Started Free',
    },
    {
        name: 'Pro', price: '$49', period: '/month', highlight: true,
        features: ['Unlimited datasets', '500MB file size limit', 'Advanced ML models', 'PDF report generation', '5 AI agents', 'Priority support', 'API access'],
        cta: 'Start Pro Trial',
    },
    {
        name: 'Enterprise', price: '$199', period: '/month', highlight: false,
        features: ['Everything in Pro', '2GB file size limit', 'Custom ML pipelines', 'SSO & SAML auth', 'Dedicated support', 'On-premise deployment', 'SLA guarantee'],
        cta: 'Contact Sales',
    },
];

const faqs = [
    { q: 'What file formats does AutoInsight support?', a: 'AutoInsight supports CSV, Excel (.xlsx, .xls), and JSON file formats. You can also connect directly to PostgreSQL databases, Google Sheets, and REST APIs for live data ingestion.' },
    { q: 'Do I need machine learning experience to use AutoInsight?', a: 'Not at all! AutoInsight is designed for users of all skill levels. Our AI agents handle the entire data science workflow automatically, from data cleaning to model training and report generation.' },
    { q: 'How long does a typical analysis pipeline take?', a: 'Most pipelines complete in 2-5 minutes depending on dataset size and complexity. You can monitor each agent\'s progress in real-time through the Agent Monitor dashboard.' },
    { q: 'Can I export results and reports?', a: 'Yes! You can export analysis results as CSV files, download comprehensive PDF reports, and access all visualizations as high-resolution images. Pro users also get API access for programmatic exports.' },
    { q: 'How is my data secured?', a: 'We use AES-256 encryption at rest and TLS 1.3 in transit. Your data is processed in isolated environments and automatically deleted after 30 days unless you choose to retain it. We are SOC 2 Type II compliant.' },
    { q: 'What does the Agent Monitor show?', a: 'The Agent Monitor provides real-time visibility into each AI agent\'s status, including progress percentage, execution logs, timestamps, and any errors or warnings. You can expand each agent to see detailed log messages.' },
];

const companies = ['TechCorp', 'DataFlow', 'GlobalFin', 'NeuralStack', 'CloudBase', 'InnovateLabs'];

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-purple/10 blur-[120px] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 relative z-10 flex flex-col items-center text-center">
                    <div className="max-w-3xl animate-fade-in-up flex flex-col items-center">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-8">
                            <Sparkles className="w-4 h-4 text-accent-purple" />
                            <span className="text-sm text-accent-purple font-medium">AI-Powered Analytics Platform</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold leading-[1.15] mb-6 font-[family-name:var(--font-heading)]">
                            Turn Raw Data Into{' '}
                            <span className="bg-gradient-to-r from-accent-purple to-accent-indigo bg-clip-text text-transparent">
                                Actionable Insights
                            </span>{' '}
                            Automatically
                        </h1>

                        {/* Subtext */}
                        <p className="text-base md:text-lg text-text-secondary mb-10 max-w-2xl leading-relaxed">
                            AutoInsight deploys AI agents that automate your entire data science workflow — from data
                            cleaning to predictive modeling and report generation — all without writing a single line of code.
                        </p>

                        {/* Buttons */}
                        <div className="flex items-center justify-center gap-4 mb-14 flex-wrap">
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold bg-gradient-to-r from-accent-purple to-accent-indigo rounded-[10px] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300"
                            >
                                Start Analyzing Free <ArrowRight className="w-4 h-4" />
                            </Link>
                            <button className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold border border-border rounded-[10px] hover:border-accent-purple text-text-secondary hover:text-white transition-all duration-300">
                                <Play className="w-4 h-4" /> See How It Works
                            </button>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-center gap-10 md:gap-16 flex-wrap">
                            {[
                                { value: '10x', label: 'Faster Analysis' },
                                { value: '500MB', label: 'Max Dataset' },
                                { value: '5', label: 'AI Agents' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl font-bold bg-gradient-to-r from-accent-purple to-accent-indigo bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-text-muted mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Mockup Preview */}
                    <div className="w-full max-w-5xl mt-[60px] bg-bg-card border border-border rounded-2xl p-1 shadow-2xl shadow-accent-purple/5">
                        <div className="bg-bg-secondary rounded-xl overflow-hidden">
                            {/* Fake Title Bar */}
                            <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                                <div className="w-3 h-3 rounded-full bg-error/60" />
                                <div className="w-3 h-3 rounded-full bg-warning/60" />
                                <div className="w-3 h-3 rounded-full bg-success/60" />
                                <span className="ml-3 text-xs text-text-muted">AutoInsight Dashboard</span>
                            </div>
                            <div className="flex">
                                {/* Mini Sidebar */}
                                <div className="w-40 border-r border-border p-3 hidden sm:block shrink-0">
                                    {['Dashboard', 'Data Sources', 'Analysis', 'Predictions', 'Reports'].map((item, i) => (
                                        <div
                                            key={item}
                                            className={`px-3 py-2 rounded-lg text-xs mb-1 ${i === 0 ? 'bg-accent-purple/15 text-accent-purple' : 'text-text-muted'
                                                }`}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                {/* Content Area */}
                                <div className="flex-1 p-4">
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {[
                                            { label: 'Datasets', val: '24', color: 'text-accent-purple' },
                                            { label: 'Accuracy', val: '94.2%', color: 'text-success' },
                                            { label: 'Reports', val: '156', color: 'text-info' },
                                        ].map((s) => (
                                            <div key={s.label} className="bg-bg-section rounded-lg p-3">
                                                <span className={`text-lg font-bold ${s.color}`}>{s.val}</span>
                                                <p className="text-xs text-text-muted mt-0.5">{s.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Fake Chart */}
                                    <div className="bg-bg-section rounded-lg p-3 h-32 flex items-end gap-1">
                                        {[40, 55, 35, 70, 60, 85, 75, 90, 65, 80, 95, 70].map((h, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-gradient-to-t from-accent-purple to-accent-indigo rounded-t-sm opacity-70"
                                                style={{ height: `${h}%` }}
                                            />
                                        ))}
                                    </div>
                                    {/* Agent Status */}
                                    <div className="mt-3 flex gap-2 flex-wrap">
                                        {[
                                            { name: 'Data Agent', status: 'Done', color: 'bg-success' },
                                            { name: 'EDA Agent', status: 'Running', color: 'bg-accent-purple' },
                                            { name: 'ML Agent', status: 'Queued', color: 'bg-text-muted' },
                                        ].map((a) => (
                                            <div key={a.name} className="flex items-center gap-1.5 bg-bg-section px-2.5 py-1.5 rounded-lg">
                                                <span className={`w-2 h-2 rounded-full ${a.color}`} />
                                                <span className="text-xs text-text-muted">{a.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted Companies */}
            <section className="py-24 border-y border-border/50">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                    <p className="text-center text-sm text-text-muted mb-8">Trusted by teams at leading companies</p>
                    <div className="flex items-center justify-center gap-12 flex-wrap opacity-40">
                        {companies.map((c) => (
                            <span key={c} className="text-lg font-semibold font-[family-name:var(--font-heading)] text-text-secondary">{c}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-4">
                            <Sparkles className="w-4 h-4 text-accent-purple" />
                            <span className="text-sm text-accent-purple font-medium">Features</span>
                        </div>
                        <h2 className="text-3xl md:text-[40px] font-semibold font-[family-name:var(--font-heading)] mb-4">
                            Everything You Need to Automate Analytics
                        </h2>
                        <p className="text-text-secondary max-w-2xl mx-auto">
                            Our AI agents work together in a pipeline to handle every step of your data analysis workflow.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-hidden">
                        {features.map(({ icon: Icon, title, desc }) => (
                            <div
                                key={title}
                                className="bg-bg-card border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300 group min-w-0 overflow-hidden"
                            >
                                <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center mb-4 group-hover:bg-accent-purple/20 transition-colors">
                                    <Icon className="w-6 h-6 text-accent-purple" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-24 bg-bg-secondary">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-4">
                                <Sparkles className="w-4 h-4 text-accent-purple" />
                                <span className="text-sm text-accent-purple font-medium">Benefits</span>
                            </div>
                            <h2 className="text-3xl md:text-[40px] font-semibold font-[family-name:var(--font-heading)] mb-4 leading-tight">
                                Why Teams Choose AutoInsight
                            </h2>
                            <p className="text-text-secondary mb-8 leading-relaxed">
                                AutoInsight eliminates the complexity of data analysis. Stop spending weeks on manual workflows and let our AI agents deliver production-ready insights in minutes.
                            </p>
                            <div className="space-y-3 mb-8">
                                {benefits.map((b) => (
                                    <div key={b} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                                        <span className="text-text-secondary">{b}</span>
                                    </div>
                                ))}
                            </div>
                            <Link
                                to="/signup"
                                className="inline-flex items-center gap-2 px-7 py-3.5 text-[15px] font-semibold bg-gradient-to-r from-accent-purple to-accent-indigo rounded-[10px] hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all duration-300"
                            >
                                Get Started Free <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Pipeline Visualization */}
                        <div className="space-y-4">
                            {pipeline.map(({ num, title, status }) => (
                                <div
                                    key={num}
                                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${status === 'done'
                                        ? 'bg-success/5 border-success/20'
                                        : status === 'running'
                                            ? 'bg-accent-purple/5 border-accent-purple/20 animate-pulse-glow'
                                            : 'bg-bg-card border-border'
                                        }`}
                                >
                                    <span className={`text-lg font-bold font-[family-name:var(--font-heading)] ${status === 'done' ? 'text-success' : status === 'running' ? 'text-accent-purple' : 'text-text-muted'
                                        }`}>
                                        {num}
                                    </span>
                                    <span className="flex-1 font-medium">{title}</span>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status === 'done' ? 'bg-success/15 text-success' : status === 'running' ? 'bg-accent-purple/15 text-accent-purple' : 'bg-white/5 text-text-muted'
                                        }`}>
                                        {status === 'done' ? '✓ Done' : status === 'running' ? '● Running' : '○ Queued'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Metrics Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Database, value: '10,000+', label: 'Datasets Processed', color: 'text-accent-purple' },
                            { icon: Rocket, value: '98.7%', label: 'Success Rate', color: 'text-success' },
                            { icon: Clock, value: '10x', label: 'Faster Analysis', color: 'text-info' },
                            { icon: Star, value: '4.9/5', label: 'User Rating', color: 'text-warning' },
                        ].map(({ icon: Icon, value, label, color }) => (
                            <div key={label} className="bg-bg-card border border-border rounded-2xl p-6 text-center hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-14 h-14 rounded-xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-4">
                                    <Icon className={`w-7 h-7 ${color}`} />
                                </div>
                                <div className="text-3xl font-bold font-[family-name:var(--font-heading)] mb-1">{value}</div>
                                <div className="text-text-muted text-sm">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-24 bg-bg-secondary">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-[40px] font-semibold font-[family-name:var(--font-heading)] mb-4">
                            Loved by Data Teams
                        </h2>
                        <p className="text-text-secondary">See what our users have to say about AutoInsight</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map(({ initials, name, role, quote }) => (
                            <div
                                key={name}
                                className="bg-bg-card border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center text-sm font-bold">
                                        {initials}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">{name}</div>
                                        <div className="text-xs text-text-muted">{role}</div>
                                    </div>
                                </div>
                                <div className="flex gap-0.5 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-text-secondary text-sm leading-relaxed">"{quote}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-[40px] font-semibold font-[family-name:var(--font-heading)] mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-text-secondary">Start free and scale as you grow</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {pricingPlans.map((plan) => (
                            <div
                                key={plan.name}
                                className={`rounded-2xl p-6 border transition-transform duration-300 hover:-translate-y-1 relative ${plan.highlight
                                    ? 'bg-bg-card border-accent-purple/40 shadow-[0_0_40px_rgba(139,92,246,0.15)]'
                                    : 'bg-bg-card border-border'
                                    }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full text-xs font-semibold">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-text-muted">{plan.period}</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((f) => (
                                        <li key={f} className="flex items-center gap-2 text-sm text-text-secondary">
                                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                                <Link
                                    to="/signup"
                                    className={`block text-center py-3 rounded-[10px] text-[15px] font-semibold transition-all duration-300 ${plan.highlight
                                        ? 'bg-gradient-to-r from-accent-purple to-accent-indigo hover:shadow-[0_0_25px_rgba(139,92,246,0.4)]'
                                        : 'border border-border hover:border-accent-purple text-text-secondary hover:text-white'
                                        }`}
                                >
                                    {plan.cta}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-24 bg-bg-secondary">
                <div className="max-w-3xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-[40px] font-semibold font-[family-name:var(--font-heading)] mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-text-secondary">Everything you need to know about AutoInsight</p>
                    </div>
                    <div className="space-y-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-bg-card border border-border rounded-xl overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 text-left"
                                >
                                    <span className="font-medium pr-4">{faq.q}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="w-5 h-5 text-text-muted shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                                    )}
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-5 text-text-secondary text-sm leading-relaxed border-t border-border pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 border-t border-border">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center">
                                    <Brain className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-xl font-bold font-[family-name:var(--font-heading)]">AutoInsight</span>
                            </div>
                            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
                                AI-powered analytics platform that automates your entire data science workflow using intelligent agents.
                            </p>
                        </div>
                        {[
                            { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
                            { title: 'Resources', links: ['Documentation', 'API Reference', 'Blog', 'Status'] },
                            { title: 'Company', links: ['About', 'Careers', 'Contact', 'Privacy'] },
                        ].map((col) => (
                            <div key={col.title}>
                                <h4 className="font-semibold text-sm mb-4">{col.title}</h4>
                                <ul className="space-y-2.5">
                                    {col.links.map((link) => (
                                        <li key={link}>
                                            <a href="#" className="text-text-muted text-sm hover:text-white transition-colors">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-border pt-8 text-center text-text-muted text-sm">
                        © {new Date().getFullYear()} AutoInsight. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}
