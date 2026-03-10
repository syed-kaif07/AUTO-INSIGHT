import { useState } from 'react';
import { CheckCircle, Loader2, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import MagicCard from '@/components/magicui/MagicCard';
import BorderBeam from '@/components/magicui/BorderBeam';
import BlurFade from '@/components/magicui/BlurFade';

const agents = [
  {
    id: 1, name: 'Data Collection Agent', status: 'completed', progress: 100,
    logs: [
      { time: '10:00:01', msg: 'Started data collection process' },
      { time: '10:00:03', msg: 'Validated file format: CSV' },
      { time: '10:00:05', msg: 'Dataset loaded: 15,420 rows × 12 columns' },
      { time: '10:00:06', msg: 'Data collection completed successfully' },
    ],
  },
  {
    id: 2, name: 'Data Cleaning Agent', status: 'completed', progress: 100,
    logs: [
      { time: '10:00:07', msg: 'Starting data cleaning pipeline' },
      { time: '10:00:12', msg: 'Handled 342 missing values using mean imputation' },
      { time: '10:00:15', msg: 'Removed 23 duplicate rows' },
      { time: '10:00:18', msg: 'Fixed 5 column data types' },
      { time: '10:00:20', msg: 'Data cleaning completed' },
    ],
  },
  {
    id: 3, name: 'EDA Agent', status: 'running', progress: 67,
    logs: [
      { time: '10:00:21', msg: 'Starting exploratory data analysis' },
      { time: '10:00:30', msg: 'Computing statistical summaries' },
      { time: '10:00:45', msg: 'Generating distribution charts...' },
    ],
  },
  { id: 4, name: 'Prediction Agent', status: 'queued', progress: 0, logs: [] },
  { id: 5, name: 'Reporting Agent', status: 'queued', progress: 0, logs: [] },
];

const overallProgress = 40;

// Large circular progress
const LargeCircularProgress = ({ value }: { value: number }) => {
  const size = 160;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="url(#progressGrad)" strokeWidth={stroke}
          strokeDasharray={circumference} strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <div className="text-3xl font-heading font-bold text-foreground">{value}%</div>
        <div className="text-xs text-muted-foreground">Complete</div>
      </div>
    </div>
  );
};

const AgentMonitoring = () => {
  const [expanded, setExpanded] = useState<number | null>(3);

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-success" />;
    if (status === 'running') return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
    return <Clock className="w-5 h-5 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      <BlurFade>
        <h1 className="text-2xl font-heading font-bold text-foreground">Agent Monitor</h1>
      </BlurFade>

      {/* Overall Progress - Large Circular */}
      <BlurFade delay={0.1}>
        <MagicCard className="p-8 flex flex-col items-center gap-4">
          <LargeCircularProgress value={overallProgress} />
          <p className="text-sm text-muted-foreground">Pipeline Progress — 2 of 5 agents completed</p>
          {/* Animated beam connecting agents */}
          <div className="flex items-center gap-1 w-full max-w-md mt-2">
            {agents.map((agent, i) => (
              <div key={agent.id} className="flex items-center flex-1">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  agent.status === 'completed' ? 'bg-success' : 
                  agent.status === 'running' ? 'bg-primary animate-pulse' : 'bg-white/10'
                }`} />
                {i < agents.length - 1 && (
                  <div className={`h-0.5 flex-1 ${
                    agent.status === 'completed' ? 'bg-gradient-to-r from-success to-success' :
                    agent.status === 'running' ? 'bg-gradient-to-r from-primary to-white/10 animate-pulse' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between w-full max-w-md text-[10px] text-muted-foreground">
            {agents.map(a => <span key={a.id} className="truncate text-center flex-1">{a.name.split(' ')[0]}</span>)}
          </div>
        </MagicCard>
      </BlurFade>

      <div className="space-y-3">
        {agents.map((agent, i) => (
          <BlurFade key={agent.id} delay={0.2 + i * 0.1}>
            <MagicCard className={`overflow-hidden ${agent.status === 'running' ? 'border-primary/30' : ''}`}>
              {agent.status === 'running' && <BorderBeam duration={6} />}
              <button onClick={() => setExpanded(expanded === agent.id ? null : agent.id)}
                className="w-full flex items-center gap-4 p-5">
                {statusIcon(agent.status)}
                <div className="flex-1 text-left">
                  <div className="font-heading font-semibold text-foreground">{agent.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{agent.status}</div>
                </div>
                {agent.status === 'running' && (
                  <div className="hidden sm:flex items-center gap-3 mr-4">
                    <div className="w-24 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${agent.progress}%` }} transition={{ duration: 1 }} />
                    </div>
                    <span className="text-xs text-primary">{agent.progress}%</span>
                  </div>
                )}
                {agent.status === 'running' && (
                  <span className="relative flex h-2.5 w-2.5 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                  </span>
                )}
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expanded === agent.id ? 'rotate-180' : ''}`} />
              </button>
              {expanded === agent.id && agent.logs.length > 0 && (
                <div className="px-5 pb-5 border-t border-white/[0.06] pt-4">
                  {/* Terminal style logs */}
                  <div className="bg-black/30 rounded-xl p-4 font-mono text-xs space-y-1.5">
                    {agent.logs.map((log, li) => (
                      <motion.div
                        key={li}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: li * 0.05 }}
                        className="flex gap-3"
                      >
                        <span className="text-primary/60">{log.time}</span>
                        <span className="text-green-400/80">$</span>
                        <span className="text-secondary-foreground/80">{log.msg}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </MagicCard>
          </BlurFade>
        ))}
      </div>
    </div>
  );
};

export default AgentMonitoring;
