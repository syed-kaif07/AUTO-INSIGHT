import {
    Brain, Database, Sparkles, BarChart3, FileText, Activity,
    Code2, Server, Cpu, Cloud
} from 'lucide-react';

const agentsPipeline = [
    { icon: Database, name: 'Data Collection Agent', desc: 'Ingests data from uploaded files, databases, or APIs. Validates schema and detects data types.' },
    { icon: Sparkles, name: 'Data Cleaning Agent', desc: 'Detects and handles missing values, outliers, and inconsistencies using statistical methods.' },
    { icon: BarChart3, name: 'EDA Agent', desc: 'Generates comprehensive exploratory data analysis with statistics, distributions, and correlations.' },
    { icon: Brain, name: 'Prediction Agent', desc: 'Auto-selects, trains, and evaluates multiple ML models including XGBoost, Random Forest, and LightGBM.' },
    { icon: FileText, name: 'Reporting Agent', desc: 'Compiles insights, charts, and predictions into a professional PDF report with recommendations.' },
];

const techStacks = [
    {
        title: 'Frontend',
        icon: Code2,
        items: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS'],
    },
    {
        title: 'Backend',
        icon: Server,
        items: ['FastAPI', 'Python 3.12', 'LangGraph', 'Pandas / NumPy'],
    },
    {
        title: 'ML / AI',
        icon: Cpu,
        items: ['Scikit-learn', 'XGBoost', 'LightGBM', 'Plotly'],
    },
    {
        title: 'Infrastructure',
        icon: Cloud,
        items: ['Supabase', 'PostgreSQL 16', 'Vercel', 'Docker'],
    },
];

export default function AboutPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[24px] font-semibold font-[family-name:var(--font-heading)]">About AutoInsight</h1>
                <p className="text-text-muted text-sm mt-1">Learn about the platform, agents, and technology behind AutoInsight.</p>
            </div>

            {/* What is AutoInsight */}
            <div className="bg-bg-card border border-border rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-purple to-accent-indigo flex items-center justify-center shrink-0">
                        <Brain className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-2">What is AutoInsight?</h2>
                        <p className="text-text-secondary leading-relaxed">
                            AutoInsight is an AI-powered analytics platform that automates the entire data science workflow using a pipeline of
                            specialized AI agents. From data ingestion and cleaning to exploratory analysis, predictive modeling, and report
                            generation — our agents handle everything so you can focus on decisions, not data wrangling.
                        </p>
                        <p className="text-text-secondary leading-relaxed mt-3">
                            Simply upload your dataset (CSV, Excel, or JSON), and AutoInsight will automatically deploy a team of 5 AI agents
                            that work together to clean your data, analyze patterns, train ML models, and deliver a comprehensive report with
                            actionable insights — all in minutes, not days.
                        </p>
                    </div>
                </div>
            </div>

            {/* Agent Pipeline */}
            <div className="bg-bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-6">The 5-Agent Pipeline</h2>
                <div className="space-y-4">
                    {agentsPipeline.map(({ icon: Icon, name, desc }, i) => (
                        <div key={name} className="flex items-start gap-4 p-4 bg-bg-section rounded-xl">
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-lg font-bold font-[family-name:var(--font-heading)] text-accent-purple w-6 text-right">
                                    {i + 1}
                                </span>
                                <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-accent-purple" />
                                </div>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">{name}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-semibold font-[family-name:var(--font-heading)] mb-6">Tech Stack</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {techStacks.map(({ title, icon: Icon, items }) => (
                        <div key={title} className="bg-bg-section rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <Icon className="w-5 h-5 text-accent-purple" />
                                <h3 className="font-semibold text-sm">{title}</h3>
                            </div>
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li key={item} className="text-sm text-text-secondary flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/50" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
