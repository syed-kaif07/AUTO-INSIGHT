import { Link } from 'react-router-dom';
import {
    Database, TrendingUp, Brain, FileText, Activity, Search, Upload,
    BarChart3, Zap, Settings, Eye, Play
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const performanceData = [
    { month: 'Jan', accuracy: 88 },
    { month: 'Feb', accuracy: 89 },
    { month: 'Mar', accuracy: 91 },
    { month: 'Apr', accuracy: 90 },
    { month: 'May', accuracy: 93 },
    { month: 'Jun', accuracy: 94 },
    { month: 'Jul', accuracy: 94.2 },
];

const agents = [
    { name: 'Data Collection Agent', status: 'completed', color: 'bg-success' },
    { name: 'Data Cleaning Agent', status: 'completed', color: 'bg-success' },
    { name: 'EDA Agent', status: 'running', color: 'bg-accent-purple' },
    { name: 'Prediction Agent', status: 'queued', color: 'bg-text-muted' },
    { name: 'Reporting Agent', status: 'queued', color: 'bg-text-muted' },
];

const datasets = [
    { name: 'sales_q4_2024.csv', size: '24.5 MB', date: '2024-12-15', status: 'Ready' },
    { name: 'customer_churn.xlsx', size: '18.3 MB', date: '2024-12-14', status: 'Processing' },
    { name: 'inventory_data.json', size: '45.1 MB', date: '2024-12-13', status: 'Ready' },
    { name: 'marketing_spend.csv', size: '12.8 MB', date: '2024-12-12', status: 'Ready' },
];

const quickActions = [
    { icon: Upload, label: 'Upload Dataset', color: 'text-accent-purple' },
    { icon: Play, label: 'Run Pipeline', color: 'text-success' },
    { icon: BarChart3, label: 'View Analysis', color: 'text-info' },
    { icon: Brain, label: 'Train Model', color: 'text-accent-secondary' },
    { icon: FileText, label: 'Generate Report', color: 'text-warning' },
    { icon: Settings, label: 'Configure Agent', color: 'text-text-secondary' },
];

export default function DashboardHome() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-[24px] font-semibold font-[family-name:var(--font-heading)]">Dashboard</h1>
                    <p className="text-text-muted text-sm mt-1">Welcome back! Here's your analytics overview.</p>
                </div>
                <Link
                    to="/dashboard/data-sources"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent-purple to-accent-indigo rounded-[10px] text-[15px] font-semibold hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300"
                >
                    <Zap className="w-4 h-4" /> New Analysis
                </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Database, label: 'Total Datasets', value: '24', change: '+3 this week', color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
                    { icon: TrendingUp, label: 'Analyses Run', value: '1,247', change: '+12 today', color: 'text-success', bg: 'bg-success/10' },
                    { icon: Brain, label: 'Model Accuracy', value: '94.2%', change: '+1.3% from last', color: 'text-info', bg: 'bg-info/10' },
                    { icon: FileText, label: 'Reports Generated', value: '156', change: '+8 this month', color: 'text-warning', bg: 'bg-warning/10' },
                ].map(({ icon: Icon, label, value, change, color, bg }) => (
                    <div key={label} className="bg-bg-card border border-border rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-text-muted text-sm">{label}</span>
                            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold font-[family-name:var(--font-heading)]">{value}</div>
                        <p className="text-xs text-text-muted mt-1">{change}</p>
                    </div>
                ))}
            </div>

            {/* Chart + Agent Status */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Area Chart */}
                <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold mb-4">Model Performance</h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={performanceData}>
                            <defs>
                                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#2B2956" />
                            <XAxis dataKey="month" stroke="#8A88B5" fontSize={12} />
                            <YAxis stroke="#8A88B5" fontSize={12} domain={[85, 96]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1A1838', border: '1px solid #2B2956', borderRadius: '8px', color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="accuracy" stroke="#8B5CF6" strokeWidth={2} fill="url(#purpleGrad)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Agent Status */}
                <div className="bg-bg-card border border-border rounded-2xl p-5">
                    <h3 className="font-semibold mb-4">Agent Status</h3>
                    <div className="space-y-3">
                        {agents.map((agent) => (
                            <div key={agent.name} className="flex items-center gap-3 p-3 bg-bg-section rounded-xl">
                                <span className={`w-2.5 h-2.5 rounded-full ${agent.color} ${agent.status === 'running' ? 'animate-pulse' : ''}`} />
                                <span className="text-sm flex-1">{agent.name}</span>
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${agent.status === 'completed' ? 'bg-success/15 text-success'
                                        : agent.status === 'running' ? 'bg-accent-purple/15 text-accent-purple'
                                            : 'bg-white/5 text-text-muted'
                                    }`}>
                                    {agent.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Datasets Table */}
            <div className="bg-bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Recent Datasets</h3>
                    <Link to="/dashboard/data-sources" className="text-accent-purple text-sm hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-text-muted text-left border-b border-border">
                                <th className="pb-3 font-medium">Name</th>
                                <th className="pb-3 font-medium">Size</th>
                                <th className="pb-3 font-medium">Date</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datasets.map((ds) => (
                                <tr key={ds.name} className="border-b border-border/50 last:border-0">
                                    <td className="py-3 font-medium">{ds.name}</td>
                                    <td className="py-3 text-text-muted">{ds.size}</td>
                                    <td className="py-3 text-text-muted">{ds.date}</td>
                                    <td className="py-3">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ds.status === 'Ready' ? 'bg-success/15 text-success' : 'bg-accent-purple/15 text-accent-purple'
                                            }`}>
                                            {ds.status}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex gap-2">
                                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors">
                                                <Play className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-bg-card border border-border rounded-2xl p-5">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {quickActions.map(({ icon: Icon, label, color }) => (
                        <button
                            key={label}
                            className="flex flex-col items-center gap-2 p-4 bg-bg-section rounded-xl hover:bg-white/5 transition-colors group"
                        >
                            <Icon className={`w-6 h-6 ${color} group-hover:scale-110 transition-transform`} />
                            <span className="text-xs text-text-muted group-hover:text-white transition-colors">{label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
