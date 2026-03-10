import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import MagicCard from '@/components/magicui/MagicCard';
import BorderBeam from '@/components/magicui/BorderBeam';
import BlurFade from '@/components/magicui/BlurFade';
import NumberTicker from '@/components/magicui/NumberTicker';
import { motion } from 'framer-motion';

const models = [
  { name: 'XGBoost', accuracy: 94.2, selected: true },
  { name: 'Random Forest', accuracy: 91.7, selected: false },
  { name: 'LightGBM', accuracy: 93.1, selected: false },
  { name: 'Linear Regression', accuracy: 82.4, selected: false },
];

const metrics = [
  { label: 'R² Score', value: '0.942' },
  { label: 'MAE', value: '$2,847' },
  { label: 'RMSE', value: '$3,241' },
  { label: 'Cross-Val', value: '91.8%' },
];

const predictionData = [
  { month: 'Jul', actual: 35000, predicted: 34500 }, { month: 'Aug', actual: 42000, predicted: 41000 },
  { month: 'Sep', actual: 38000, predicted: 39500 }, { month: 'Oct', actual: 51000, predicted: 49000 },
  { month: 'Nov', actual: 48000, predicted: 50000 }, { month: 'Dec', actual: 55000, predicted: 53500 },
  { month: 'Jan', actual: 62000, predicted: 60000 }, { month: 'Feb', actual: null, predicted: 65000 },
  { month: 'Mar', actual: null, predicted: 68000 },
];

const featureImportance = [
  { name: 'Month', value: 92 }, { name: 'Category', value: 78 }, { name: 'Region', value: 65 },
  { name: 'Orders', value: 58 }, { name: 'Avg Price', value: 45 }, { name: 'Weekday', value: 32 },
];

const futurePredictions = [
  { month: 'Feb 2025', predicted: '$65,000', lower: '$58,500', upper: '$71,500', confidence: 89 },
  { month: 'Mar 2025', predicted: '$68,000', lower: '$59,800', upper: '$76,200', confidence: 84 },
  { month: 'Apr 2025', predicted: '$72,000', lower: '$61,200', upper: '$82,800', confidence: 78 },
];

const tooltipStyle = { backgroundColor: 'rgba(26,24,56,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' };

const Predictions = () => (
  <div className="space-y-6">
    <BlurFade>
      <h1 className="text-2xl font-heading font-bold text-foreground">Predictions</h1>
    </BlurFade>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {models.map((m, i) => (
        <BlurFade key={m.name} delay={i * 0.1}>
          <MagicCard className={`p-5 cursor-pointer ${m.selected ? 'border-primary/30' : ''}`}>
            {m.selected && <BorderBeam duration={6} />}
            <h3 className="font-heading font-semibold mb-1 text-foreground">{m.name}</h3>
            <div className="text-2xl font-heading font-bold gradient-text">
              <NumberTicker value={m.accuracy} decimalPlaces={1} suffix="%" />
            </div>
            {m.selected && <span className="text-xs text-primary mt-2 block">Selected Model</span>}
          </MagicCard>
        </BlurFade>
      ))}
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <BlurFade key={m.label} delay={0.1 + i * 0.05}>
          <MagicCard className="p-5">
            <div className="text-sm text-muted-foreground mb-1">{m.label}</div>
            <div className="text-xl font-heading font-bold text-foreground">{m.value}</div>
          </MagicCard>
        </BlurFade>
      ))}
    </div>

    <BlurFade delay={0.2}>
      <MagicCard className="p-6">
        <h3 className="font-heading font-semibold mb-4 text-foreground">Actual vs Predicted</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={predictionData}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="actual" stroke="#10B981" fill="url(#greenGrad)" strokeWidth={2} name="Actual" />
            <Area type="monotone" dataKey="predicted" stroke="#8B5CF6" fill="none" strokeWidth={2} strokeDasharray="5 5" name="Predicted" />
          </AreaChart>
        </ResponsiveContainer>
      </MagicCard>
    </BlurFade>

    <div className="grid lg:grid-cols-2 gap-6">
      <BlurFade delay={0.3}>
        <MagicCard className="p-6">
          <h3 className="font-heading font-semibold mb-4 text-foreground">Feature Importance</h3>
          <div className="space-y-4">
            {featureImportance.map((f, i) => (
              <div key={f.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{f.name}</span>
                  <span className="text-muted-foreground">{f.value}%</span>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${f.value}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>
            ))}
          </div>
        </MagicCard>
      </BlurFade>

      <BlurFade delay={0.35}>
        <MagicCard className="p-6">
          <h3 className="font-heading font-semibold mb-4 text-foreground">Future Predictions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 text-muted-foreground font-medium">Month</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Predicted</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Range</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {futurePredictions.map(p => (
                  <tr key={p.month} className="border-b border-white/[0.04]">
                    <td className="py-3 text-foreground">{p.month}</td>
                    <td className="py-3 font-semibold text-foreground">{p.predicted}</td>
                    <td className="py-3 text-muted-foreground text-xs">{p.lower} – {p.upper}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${p.confidence}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground">{p.confidence}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MagicCard>
      </BlurFade>
    </div>
  </div>
);

export default Predictions;
