import { useState } from 'react';
import { Info } from 'lucide-react';
import {
    BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';

const tabs = ['Overview', 'Distribution', 'Correlation', 'Time Series'];

const stats = [
    { label: 'Mean Revenue', value: '$48,271', change: '+5.2%' },
    { label: 'Std Deviation', value: '$12,834', change: '' },
    { label: 'Median', value: '$45,100', change: '' },
    { label: 'Skewness', value: '0.34', change: 'Right-skewed' },
    { label: 'Missing Values', value: '1.2%', change: '142 cells' },
    { label: 'Outliers', value: '3.8%', change: '456 rows' },
];

const barData = [
    { range: '0-20K', count: 120 }, { range: '20-40K', count: 340 },
    { range: '40-60K', count: 520 }, { range: '60-80K', count: 280 },
    { range: '80-100K', count: 140 }, { range: '100K+', count: 60 },
];

const pieData = [
    { name: 'Electronics', value: 35 }, { name: 'Clothing', value: 25 },
    { name: 'Food', value: 20 }, { name: 'Home', value: 15 },
    { name: 'Other', value: 5 },
];
const PIE_COLORS = ['#8B5CF6', '#A855F7', '#6366F1', '#10B981', '#3B82F6'];

const scatterData = Array.from({ length: 30 }, (_, i) => ({
    orders: Math.floor(Math.random() * 500) + 100,
    revenue: Math.floor(Math.random() * 80000) + 10000,
}));

const timeData = [
    { month: 'Jul', revenue: 38000 }, { month: 'Aug', revenue: 42000 },
    { month: 'Sep', revenue: 39000 }, { month: 'Oct', revenue: 48000 },
    { month: 'Nov', revenue: 52000 }, { month: 'Dec', revenue: 58000 },
    { month: 'Jan', revenue: 54000 },
];

const insights = [
    'Revenue shows a strong upward trend with 12.3% month-over-month growth in the last quarter.',
    'Electronics category dominates with 35% of total revenue, followed by Clothing at 25%.',
    'Strong positive correlation (r=0.87) detected between order volume and revenue.',
    'Seasonal pattern detected: revenue peaks in November-December, suggesting holiday effect.',
];

export default function AnalysisPage() {
    const [activeTab, setActiveTab] = useState('Overview');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[24px] font-semibold font-[family-name:var(--font-heading)]">Analysis</h1>
                <p className="text-text-muted text-sm mt-1">
                    Dataset: <span className="text-accent-purple">sales_q4_2024.csv</span>
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-bg-card border border-border rounded-xl p-1 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab
                                ? 'bg-accent-purple/15 text-accent-purple'
                                : 'text-text-muted hover:text-white'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Mini Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {stats.map(({ label, value, change }) => (
                    <div key={label} className="bg-bg-card border border-border rounded-xl p-4">
                        <p className="text-xs text-text-muted mb-1">{label}</p>
                        <p className="text-lg font-bold font-[family-name:var(--font-heading)]">{value}</p>
                        {change && <p className="text-xs text-text-muted mt-0.5">{change}</p>}
                    </div>
                ))}
            </div>

            {/* Charts 2x2 Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <div className="bg-bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold mb-4 text-sm">Revenue Distribution</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2B2956" />
                            <XAxis dataKey="range" stroke="#8A88B5" fontSize={11} />
                            <YAxis stroke="#8A88B5" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A1838', border: '1px solid #2B2956', borderRadius: '8px', color: '#fff' }} />
                            <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Chart */}
                <div className="bg-bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold mb-4 text-sm">Category Breakdown</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                                {pieData.map((_, index) => (
                                    <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1A1838', border: '1px solid #2B2956', borderRadius: '8px', color: '#fff' }} />
                            <Legend wrapperStyle={{ fontSize: '12px', color: '#8A88B5' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Scatter Chart */}
                <div className="bg-bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold mb-4 text-sm">Correlation Plot</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2B2956" />
                            <XAxis dataKey="orders" name="Orders" stroke="#8A88B5" fontSize={11} />
                            <YAxis dataKey="revenue" name="Revenue" stroke="#8A88B5" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A1838', border: '1px solid #2B2956', borderRadius: '8px', color: '#fff' }} />
                            <Scatter data={scatterData} fill="#A855F7" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>

                {/* Area Chart */}
                <div className="bg-bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold mb-4 text-sm">Revenue Over Time</h3>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={timeData}>
                            <defs>
                                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2B2956" />
                            <XAxis dataKey="month" stroke="#8A88B5" fontSize={11} />
                            <YAxis stroke="#8A88B5" fontSize={11} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A1838', border: '1px solid #2B2956', borderRadius: '8px', color: '#fff' }} />
                            <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2} fill="url(#areaGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Insights */}
            <div className="bg-bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">AI Generated Insights</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                    {insights.map((insight, i) => (
                        <div key={i} className="flex gap-3 p-4 bg-bg-section rounded-xl">
                            <Info className="w-5 h-5 text-accent-purple shrink-0 mt-0.5" />
                            <p className="text-sm text-text-secondary leading-relaxed">{insight}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
