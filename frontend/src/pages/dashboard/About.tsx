import { Brain, Database, Zap, BarChart3, FileText, Code, Server, Cpu, Cloud } from 'lucide-react';
import MagicCard from '@/components/magicui/MagicCard';
import BlurFade from '@/components/magicui/BlurFade';

const agentsPipeline = [
  { icon: Database, name: 'Data Collection Agent', desc: 'Ingests and validates datasets from various sources including CSV, Excel, JSON, and database connections.' },
  { icon: Zap, name: 'Data Cleaning Agent', desc: 'Automatically handles missing values, removes duplicates, fixes data types, and detects outliers.' },
  { icon: BarChart3, name: 'EDA Agent', desc: 'Generates statistical summaries, distribution charts, correlation analysis, and automated insights.' },
  { icon: Brain, name: 'Prediction Agent', desc: 'Trains and compares multiple ML models including XGBoost, Random Forest, and LightGBM.' },
  { icon: FileText, name: 'Reporting Agent', desc: 'Compiles analysis results into professional PDF reports with visualizations and recommendations.' },
];

const techStack = [
  { category: 'Frontend', icon: Code, items: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS'] },
  { category: 'Backend', icon: Server, items: ['FastAPI', 'Python 3.12', 'LangGraph', 'Pandas / NumPy'] },
  { category: 'ML / AI', icon: Cpu, items: ['Scikit-learn', 'XGBoost', 'LightGBM', 'Plotly'] },
  { category: 'Infrastructure', icon: Cloud, items: ['Supabase', 'PostgreSQL 16', 'Vercel', 'Docker'] },
];

const About = () => (
  <div className="space-y-6">
    <BlurFade>
      <h1 className="text-2xl font-heading font-bold text-foreground">About</h1>
    </BlurFade>

    <BlurFade delay={0.1}>
      <MagicCard className="p-8">
        <h2 className="text-xl font-heading font-bold mb-4 text-foreground">What is AutoInsight?</h2>
        <p className="text-muted-foreground leading-relaxed">
          AutoInsight is an AI-powered multi-agent analytics platform that automates the complete data science workflow.
          Upload your dataset and our intelligent agents will clean, analyze, predict, and generate reports — all automatically.
          No coding required. From raw data to actionable insights in minutes.
        </p>
      </MagicCard>
    </BlurFade>

    <BlurFade delay={0.2}>
      <MagicCard className="p-8">
        <h2 className="text-xl font-heading font-bold mb-6 text-foreground">AI Agent Pipeline</h2>
        <div className="space-y-4">
          {agentsPipeline.map((agent, i) => (
            <div key={agent.name} className="flex gap-4 items-start p-4 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <agent.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-foreground">{agent.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{agent.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </MagicCard>
    </BlurFade>

    <BlurFade delay={0.3}>
      <MagicCard className="p-8">
        <h2 className="text-xl font-heading font-bold mb-6 text-foreground">Tech Stack</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techStack.map(stack => (
            <div key={stack.category} className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.05]">
              <div className="flex items-center gap-2 mb-4">
                <stack.icon className="w-5 h-5 text-primary" />
                <h3 className="font-heading font-semibold text-sm text-foreground">{stack.category}</h3>
              </div>
              <ul className="space-y-2">
                {stack.items.map(item => (
                  <li key={item} className="text-sm text-muted-foreground">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MagicCard>
    </BlurFade>
  </div>
);

export default About;
