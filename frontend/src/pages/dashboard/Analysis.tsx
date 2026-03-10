import { useState } from 'react';
import { Info } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MagicCard from '@/components/magicui/MagicCard';
import BlurFade from '@/components/magicui/BlurFade';
import BorderBeam from '@/components/magicui/BorderBeam';

const tabs = ['Overview', 'Distribution', 'Correlation', 'Time Series'];

const miniStats = [
  { label: 'Mean Revenue', value: '$45,230' },
  { label: 'Std Deviation', value: '$12,450' },
  { label: 'Median', value: '$42,100' },
  { label: 'Skewness', value: '0.34' },
  { label: 'Missing Values', value: '2.1%' },
  { label: 'Outliers', value: '47' },
];

const barData = [
  { range: '0-20k', count: 15 }, { range: '20-40k', count: 35 }, { range: '40-60k', count: 45 },
  { range: '60-80k', count: 30 }, { range: '80-100k', count: 20 }, { range: '100k+', count: 10 },
];

const pieData = [
  { name: 'Electronics', value: 35 }, { name: 'Clothing', value: 25 },
  { name: 'Food', value: 20 }, { name: 'Other', value: 20 },
];
const pieColors = ['#8B5CF6', '#A855F7', '#6366F1', '#4F46E5'];

const scatterData = Array.from({ length: 30 }, (_, i) => ({ x: Math.random() * 100, y: Math.random() * 80 + i }));

const timeData = [
  { month: 'Jul', revenue: 35000 }, { month: 'Aug', revenue: 42000 }, { month: 'Sep', revenue: 38000 },
  { month: 'Oct', revenue: 51000 }, { month: 'Nov', revenue: 48000 }, { month: 'Dec', revenue: 55000 }, { month: 'Jan', revenue: 62000 },
];

const insights = [
  'Revenue shows a strong upward trend with 15% month-over-month growth in the last quarter.',
  'Electronics category dominates with 35% of total sales, suggesting a strong market position.',
  'The distribution is slightly right-skewed indicating a few high-value transactions pulling the mean above median.',
  '47 outliers detected primarily in the luxury goods segment - recommend further investigation.',
];

const tooltipStyle = { backgroundColor: 'rgba(26,24,56,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(20px)' };

const Analysis = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="space-y-6">
      <BlurFade>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Analysis</h1>
          <p className="text-sm text-primary">sales_2024.csv</p>
        </div>
      </BlurFade>

      {/* Glassmorphism pill tabs */}
      <BlurFade delay={0.1}>
        <div className="flex gap-2 overflow-x-auto pb-1 bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] rounded-xl p-1.5 w-fit">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'}`}>
              {tab}
            </button>
          ))}
        </div>
      </BlurFade>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {miniStats.map((s, i) => (
          <BlurFade key={s.label} delay={0.1 + i * 0.05}>
            <MagicCard className="p-4">
              <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
              <div className="text-lg font-heading font-bold text-foreground">{s.value}</div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <BlurFade delay={0.2}>
          <MagicCard className="p-6 relative">
            <BorderBeam duration={10} />
            <h3 className="font-heading font-semibold mb-4 text-foreground">Revenue Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="range" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.25}>
          <MagicCard className="p-6">
            <h3 className="font-heading font-semibold mb-4 text-foreground">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.3}>
          <MagicCard className="p-6">
            <h3 className="font-heading font-semibold mb-4 text-foreground">Correlation Plot</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="x" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis dataKey="y" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Scatter data={scatterData} fill="#A855F7" />
              </ScatterChart>
            </ResponsiveContainer>
          </MagicCard>
        </BlurFade>

        <BlurFade delay={0.35}>
          <MagicCard className="p-6 relative">
            <BorderBeam duration={12} />
            <h3 className="font-heading font-semibold mb-4 text-foreground">Revenue Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timeData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" fill="url(#areaGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </MagicCard>
        </BlurFade>
      </div>

      {/* Insight Cards - Neon Gradient style */}
      <BlurFade delay={0.4}>
        <MagicCard className="p-6">
          <h3 className="font-heading font-semibold mb-4 text-foreground">AI Generated Insights</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {insights.map((insight, i) => (
              <div key={i} className="relative rounded-xl p-[1px] overflow-hidden" style={{
                background: `linear-gradient(135deg, rgba(139,92,246,0.3), rgba(99,102,241,0.1), rgba(139,92,246,0.2))`,
              }}>
                <div className="flex gap-3 p-4 bg-background/90 rounded-xl backdrop-blur-xl">
                  <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-secondary-foreground">{insight}</p>
                </div>
              </div>
            ))}
          </div>
        </MagicCard>
      </BlurFade>
    </div>
  );
};

export default Analysis;
