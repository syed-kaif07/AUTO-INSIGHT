import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts';

const models = [
    { name: 'XGBoost', accuracy: '94.2%', selected: true },
    { name: 'Random Forest', accuracy: '91.7%', selected: false },
    { name: 'LightGBM', accuracy: '93.1%', selected: false },
    { name: 'Linear Regression', accuracy: '82.4%', selected: false },
];

const metrics = [
    { label: 'R² Score', value: '0.942', desc: 'Variance explained' },
    { label: 'MAE', value: '$2,847', desc: 'Mean Absolute Error' },
    { label: 'RMSE', value: '$3,241', desc: 'Root Mean Squared Error' },
    { label: 'Cross-Val', value: '91.8%', desc: '5-Fold CV Score' },
];

const chartData = [
    { month: 'Jul', actual: 38000, predicted: 37500 },
    { month: 'Aug', actual: 42000, predicted: 41800 },
    { month: 'Sep', actual: 39000, predicted: 40200 },
    { month: 'Oct', actual: 48000, predicted: 47500 },
    { month: 'Nov', actual: 52000, predicted: 51300 },
    { month: 'Dec', actual: 58000, predicted: 57200 },
    { month: 'Jan', actual: 54000, predicted: 55100 },
    { month: 'Feb', actual: null, predicted: 59000 },
    { month: 'Mar', actual: null, predicted: 62000 },
];

const featureImportance = [
    { name: 'Month', value: 92 },
    { name: 'Category', value: 78 },
    { name: 'Region', value: 65 },
    { name: 'Orders', value: 58 },
    { name: 'Avg Price', value: 45 },
    { name: 'Weekday', value: 32 },
];

const predictions = [
    { month: 'February 2025', predicted: '$59,000', lower: '$54,200', upper: '$63,800', confidence: 89 },
    { month: 'March 2025', predicted: '$62,000', lower: '$56,100', upper: '$67,900', confidence: 85 },
    { month: 'April 2025', predicted: '$58,500', lower: '$51,800', upper: '$65,200', confidence: 81 },
];

export default function PredictionsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[24px] font-semibold font-[family-name:var(--font-heading)]">Predictions</h1>
                <p className="text-text-muted text-sm mt-1">ML model comparison and future predictions.</p>
            </div>

            {/* Model Comparison */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {models.map((m) => (
                    <div
                        key={m.name}
                        className={`bg-bg-card border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${m.selected
                                ? 'border-accent-purple/40 shadow-[0_0_30px_rgba(139,92,246,0.15)]'
                                : 'border-border'
                            }`}
                    >
                        <h3 className="font-semibold mb-1">{m.name}</h3>
                        <p className={`text-2xl font-bold font-[family-name:var(--font-heading)] ${m.selected ? 'text-accent-purple' : 'text-text-secondary'}`}>
                            {m.accuracy}
                        </p>
                        <p className="text-xs text-text-muted mt-1">Accuracy</p>
                        {m.selected && (
                            <span className="inline-block mt-3 text-xs font-medium px-3 py-1 rounded-full bg-accent-purple/15 text-accent-purple">
                                Selected
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Metric Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map(({ label, value, desc }) => (
                    <div key={label} className="bg-bg-card border border-border rounded-2xl p-5">
                        <p className="text-xs text-text-muted mb-1">{label}</p>
                        <p className="text-xl font-bold font-[family-name:var(--font-heading)]">{value}</p>
                        <p className="text-xs text-text-muted mt-0.5">{desc}</p>
                    </div>
                ))}
            </div>

            {/* Actual vs Predicted Chart */}
            <div className="bg-bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Actual vs Predicted Revenue</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="purpleGrad2" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2B2956" />
                        <XAxis dataKey="month" stroke="#8A88B5" fontSize={12} />
                        <YAxis stroke="#8A88B5" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1A1838', border: '1px solid #2B2956', borderRadius: '8px', color: '#fff' }} />
                        <Area type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2} fill="url(#greenGrad)" name="Actual" connectNulls={false} />
                        <Area type="monotone" dataKey="predicted" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" fill="url(#purpleGrad2)" name="Predicted" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Feature Importance */}
                <div className="bg-bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold mb-4">Feature Importance</h3>
                    <div className="space-y-4">
                        {featureImportance.map(({ name, value }) => (
                            <div key={name}>
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm text-text-secondary">{name}</span>
                                    <span className="text-sm font-medium text-accent-purple">{value}%</span>
                                </div>
                                <div className="w-full h-2 bg-bg-section rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full transition-all duration-500"
                                        style={{ width: `${value}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Future Predictions Table */}
                <div className="bg-bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold mb-4">Future Predictions</h3>
                    <div className="space-y-3">
                        {predictions.map(({ month, predicted, lower, upper, confidence }) => (
                            <div key={month} className="bg-bg-section rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">{month}</span>
                                    <span className="text-accent-purple font-bold">{predicted}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-text-muted mb-2">
                                    <span>Lower: {lower}</span>
                                    <span>Upper: {upper}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-bg-card rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full"
                                            style={{ width: `${confidence}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-text-muted">{confidence}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
