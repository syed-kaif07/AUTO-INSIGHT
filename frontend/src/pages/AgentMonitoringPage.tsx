import { useState } from 'react';
import { CheckCircle2, Loader2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface AgentLog {
    time: string;
    message: string;
}

interface Agent {
    id: number;
    name: string;
    status: 'completed' | 'running' | 'queued';
    progress: number;
    logs: AgentLog[];
}

const agents: Agent[] = [
    {
        id: 1, name: 'Data Collection Agent', status: 'completed', progress: 100,
        logs: [
            { time: '10:23:01', message: 'Starting data collection from sales_q4_2024.csv' },
            { time: '10:23:03', message: 'File validated: 50,000 rows × 18 columns' },
            { time: '10:23:05', message: 'Schema detection complete. 12 numeric, 6 categorical columns.' },
            { time: '10:23:07', message: 'Data collection completed successfully.' },
        ],
    },
    {
        id: 2, name: 'Data Cleaning Agent', status: 'completed', progress: 100,
        logs: [
            { time: '10:23:08', message: 'Starting data cleaning pipeline.' },
            { time: '10:23:12', message: 'Found 142 missing values (1.2%). Applying imputation.' },
            { time: '10:23:15', message: 'Detected 456 outliers (3.8%). Applying IQR filtering.' },
            { time: '10:23:18', message: 'Data types corrected. 3 columns converted.' },
            { time: '10:23:20', message: 'Data cleaning completed. Dataset is now clean.' },
        ],
    },
    {
        id: 3, name: 'EDA Agent', status: 'running', progress: 67,
        logs: [
            { time: '10:23:21', message: 'Starting exploratory data analysis.' },
            { time: '10:23:25', message: 'Computing descriptive statistics...' },
            { time: '10:23:30', message: 'Generating distribution plots...' },
            { time: '10:23:38', message: 'Computing correlation matrix... (in progress)' },
        ],
    },
    {
        id: 4, name: 'Prediction Agent', status: 'queued', progress: 0,
        logs: [{ time: '--:--:--', message: 'Waiting for EDA Agent to complete.' }],
    },
    {
        id: 5, name: 'Reporting Agent', status: 'queued', progress: 0,
        logs: [{ time: '--:--:--', message: 'Waiting for Prediction Agent to complete.' }],
    },
];

const overallProgress = 40;

export default function AgentMonitoringPage() {
    const [expandedId, setExpandedId] = useState<number | null>(3);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-success" />;
            case 'running': return <Loader2 className="w-5 h-5 text-accent-purple animate-spin" />;
            default: return <Clock className="w-5 h-5 text-text-muted" />;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[24px] font-semibold font-[family-name:var(--font-heading)]">Agent Monitor</h1>
                <p className="text-text-muted text-sm mt-1">Track AI agent pipeline progress in real-time.</p>
            </div>

            {/* Overall Progress */}
            <div className="bg-bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Overall Pipeline Progress</h3>
                    <span className="text-accent-purple font-bold text-lg">{overallProgress}%</span>
                </div>
                <div className="w-full h-3 bg-bg-section rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-accent-purple to-accent-indigo rounded-full transition-all duration-1000"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-text-muted">
                    <span>2 of 5 agents completed</span>
                    <span>ETA: ~3 minutes</span>
                </div>
            </div>

            {/* Agent Cards */}
            <div className="space-y-3">
                {agents.map((agent) => (
                    <div key={agent.id} className="bg-bg-card border border-border rounded-2xl overflow-hidden">
                        <button
                            onClick={() => setExpandedId(expandedId === agent.id ? null : agent.id)}
                            className="w-full p-5 flex items-center gap-4 text-left"
                        >
                            {getStatusIcon(agent.status)}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="font-medium">{agent.id}. {agent.name}</span>
                                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${agent.status === 'completed' ? 'bg-success/15 text-success'
                                            : agent.status === 'running' ? 'bg-accent-purple/15 text-accent-purple'
                                                : 'bg-white/5 text-text-muted'
                                        }`}>
                                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                                    </span>
                                </div>
                                {agent.status === 'running' && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex-1 h-1.5 bg-bg-section rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent-purple rounded-full animate-pulse"
                                                style={{ width: `${agent.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-accent-purple">{agent.progress}%</span>
                                    </div>
                                )}
                            </div>
                            {expandedId === agent.id ? (
                                <ChevronUp className="w-5 h-5 text-text-muted shrink-0" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-text-muted shrink-0" />
                            )}
                        </button>

                        {expandedId === agent.id && (
                            <div className="border-t border-border px-5 pb-5">
                                <div className="mt-4 space-y-2">
                                    {agent.logs.map((log, i) => (
                                        <div key={i} className="flex gap-3 py-2 px-3 bg-bg-section rounded-lg text-sm">
                                            <span className="text-text-muted font-mono text-xs shrink-0 mt-0.5">{log.time}</span>
                                            <span className="text-text-secondary">{log.message}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
