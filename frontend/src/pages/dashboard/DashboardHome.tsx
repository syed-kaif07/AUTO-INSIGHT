import { Database, TrendingUp, FileText, Plus, Eye, Play, Trash2, Upload, Brain, ArrowUp, FileSpreadsheet, FileJson, File } from 'lucide-react';
import React, { Suspense, memo } from 'react';
import { motion } from 'framer-motion';
import MagicCard from '@/components/magicui/MagicCard';
import NumberTicker from '@/components/magicui/NumberTicker';
import ShimmerButton from '@/components/magicui/ShimmerButton';
import BorderBeam from '@/components/magicui/BorderBeam';
import BlurFade from '@/components/magicui/BlurFade';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { month: 'Jul', accuracy: 82 }, { month: 'Aug', accuracy: 86 }, { month: 'Sep', accuracy: 83 },
  { month: 'Oct', accuracy: 88 }, { month: 'Nov', accuracy: 85 }, { month: 'Dec', accuracy: 91 },
  { month: 'Jan', accuracy: 87 }, { month: 'Feb', accuracy: 94.2 },
];

const agents = [
  { name: 'Data Collection', status: 'completed', color: 'text-success', progress: 100, time: '2 mins ago' },
  { name: 'Data Cleaning', status: 'completed', color: 'text-success', progress: 100, time: '5 mins ago' },
  { name: 'EDA Agent', status: 'running', color: 'text-primary', progress: 62, time: '' },
  { name: 'Prediction Agent', status: 'queued', color: 'text-muted-foreground', progress: 0, time: '' },
  { name: 'Reporting Agent', status: 'queued', color: 'text-muted-foreground', progress: 0, time: '' },
];

const datasets = [
  { name: 'sales_2024.csv', size: '24.5 MB', date: 'Jan 15, 2025', status: 'Ready', type: 'csv' },
  { name: 'customers.xlsx', size: '12.1 MB', date: 'Jan 14, 2025', status: 'Ready', type: 'xlsx' },
  { name: 'inventory.json', size: '8.3 MB', date: 'Jan 13, 2025', status: 'Processing', type: 'json' },
];

const fileIcons: Record<string, typeof File> = { csv: FileSpreadsheet, xlsx: FileSpreadsheet, json: FileJson };

const quickActions = [
  { label: 'Upload Data', icon: Upload },
  { label: 'New Analysis', icon: Plus },
  { label: 'Train Model', icon: Brain },
  { label: 'Generate Report', icon: FileText },
];

const stats = [
  { label: 'Total Datasets', value: 24, change: '+12%', icon: Database, borderColor: 'border-l-primary', iconColor: 'text-primary bg-primary/10' },
  { label: 'Analyses Run', value: 1247, change: '+8.2%', icon: TrendingUp, borderColor: 'border-l-success', iconColor: 'text-success bg-success/10' },
  { label: 'Model Accuracy', value: 94.2, change: '+2.1%', icon: Brain, borderColor: 'border-l-blue-400', iconColor: 'text-blue-400 bg-blue-400/10', decimal: 1, suffix: '%' },
  { label: 'Reports Generated', value: 156, change: '+5.7%', icon: FileText, borderColor: 'border-l-yellow-400', iconColor: 'text-yellow-400 bg-yellow-400/10' },
];

const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const CircularProgress = memo(({ value, size = 28, stroke = 3 }: { value: number; size?: number; stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={value === 100 ? 'hsl(var(--success))' : 'hsl(var(--primary))'} strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
    </svg>
  );
});

const ChartLoading = () => (
  <div className="w-full h-[250px] flex items-center justify-center">
    <div className="text-sm text-muted-foreground animate-pulse">Loading chart...</div>
  </div>
);

// Memoized chart component
const PerformanceChart = memo(() => (
  <ResponsiveContainer width="100%" height={250}>
    <AreaChart data={performanceData}>
      <defs>
        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
      <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
      <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} domain={[75, 100]} />
      <Tooltip contentStyle={{ backgroundColor: 'rgba(26,24,56,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }} />
      <Area type="monotone" dataKey="accuracy" stroke="#8B5CF6" fill="url(#purpleGrad)" strokeWidth={2.5} dot={{ r: 3, fill: '#8B5CF6', strokeWidth: 0 }} activeDot={{ r: 5, fill: '#8B5CF6' }} />
    </AreaChart>
  </ResponsiveContainer>
));

const DashboardHome = () => (
  <div className="space-y-6">
    <BlurFade>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
        <ShimmerButton className="text-sm"><Plus className="w-4 h-4" /> New Analysis</ShimmerButton>
      </div>
    </BlurFade>

    {/* Stat Cards */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <BlurFade key={s.label} delay={i * 0.1}>
          <MagicCard className={`p-6 border-l-4 ${s.borderColor}`}>
            {i === 0 && <BorderBeam duration={8} />}
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconColor}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                <ArrowUp className="w-3 h-3" />{s.change}
              </span>
            </div>
            <div className="text-3xl font-heading font-extrabold tracking-tight text-foreground">
              <NumberTicker value={s.value} decimalPlaces={s.decimal || 0} suffix={s.suffix || ''} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </MagicCard>
        </BlurFade>
      ))}
    </div>

    <div className="grid lg:grid-cols-3 gap-6">
      {/* Chart */}
      <BlurFade delay={0.2} className="lg:col-span-2">
        <MagicCard className="p-6">
          <h3 className="font-heading font-semibold mb-4 text-foreground">Model Performance</h3>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.3 }}>
            <PerformanceChart />
          </motion.div>
        </MagicCard>
      </BlurFade>

      {/* Agent Status */}
      <BlurFade delay={0.3}>
        <MagicCard className="p-6 h-full">
          <h3 className="font-heading font-semibold mb-4 text-foreground">Agent Status</h3>
          <div className="space-y-3">
            {agents.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]"
                style={{ willChange: 'transform, opacity' }}
              >
                <div className="flex items-center gap-3">
                  <CircularProgress value={a.progress} />
                  <div>
                    <span className="text-sm font-medium text-foreground">{a.name}</span>
                    {a.time && <p className="text-[11px] text-muted-foreground">{a.time}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {a.status === 'running' && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                    </span>
                  )}
                  <span className={`text-xs font-medium capitalize ${a.color}`}>{a.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </MagicCard>
      </BlurFade>
    </div>

    {/* Datasets Table */}
    <BlurFade delay={0.4}>
      <MagicCard className="p-6">
        <h3 className="font-heading font-semibold mb-4 text-foreground">Recent Datasets</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 text-muted-foreground font-medium">Name</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Size</th>
                <th className="text-left py-3 text-muted-foreground font-medium hidden sm:table-cell">Date</th>
                <th className="text-left py-3 text-muted-foreground font-medium">Status</th>
                <th className="text-right py-3 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {datasets.map(d => {
                const Icon = fileIcons[d.type] || File;
                return (
                  <tr key={d.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-medium text-foreground">
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-primary shrink-0" />
                        {d.name}
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{d.size}</td>
                    <td className="py-3 text-muted-foreground hidden sm:table-cell">{d.date}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${d.status === 'Ready' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>{d.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Play className="w-4 h-4" /></button>
                        <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </MagicCard>
    </BlurFade>

    {/* Quick Actions */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {quickActions.map((action, i) => (
        <BlurFade key={action.label} delay={0.5 + i * 0.05}>
          <MagicCard className="p-4 text-center flex flex-col items-center gap-2.5 cursor-pointer">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <action.icon className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{action.label}</span>
          </MagicCard>
        </BlurFade>
      ))}
    </div>
  </div>
);

export default DashboardHome;
