import { useState } from 'react';
import {
    Upload, Database, FileSpreadsheet, File, Trash2, Eye, Play, Loader2, Cloud
} from 'lucide-react';

const connectors = [
    { name: 'PostgreSQL', desc: 'Connect to PostgreSQL databases', icon: Database, connected: false },
    { name: 'Google Sheets', desc: 'Import from Google Sheets', icon: FileSpreadsheet, connected: false },
    { name: 'REST API', desc: 'Connect to any REST API endpoint', icon: Cloud, connected: false },
];

const initialDatasets = [
    { id: 1, name: 'sales_q4_2024.csv', size: '24.5 MB', rows: '50,000', cols: '18', status: 'ready' as const },
    { id: 2, name: 'customer_churn.xlsx', size: '18.3 MB', rows: '35,200', cols: '24', status: 'ready' as const },
    { id: 3, name: 'inventory_data.json', size: '45.1 MB', rows: '120,000', cols: '12', status: 'ready' as const },
    { id: 4, name: 'marketing_spend.csv', size: '12.8 MB', rows: '8,400', cols: '15', status: 'uploading' as const },
];

export default function DataSourcesPage() {
    const [dragOver, setDragOver] = useState(false);
    const [datasets, setDatasets] = useState(initialDatasets);

    const handleDelete = (id: number) => {
        setDatasets(datasets.filter(d => d.id !== id));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[24px] font-semibold font-[family-name:var(--font-heading)]">Data Sources</h1>
                <p className="text-text-muted text-sm mt-1">Upload datasets or connect to external data sources.</p>
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => { e.preventDefault(); setDragOver(false); }}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragOver
                        ? 'border-accent-purple bg-accent-purple/5 shadow-[0_0_30px_rgba(139,92,246,0.15)]'
                        : 'border-border bg-bg-card hover:border-text-muted'
                    }`}
            >
                <div className="w-16 h-16 rounded-2xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className={`w-8 h-8 ${dragOver ? 'text-accent-purple' : 'text-text-muted'} transition-colors`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Drag and drop dataset here</h3>
                <p className="text-text-muted text-sm mb-4">or click to browse your files</p>
                <div className="flex items-center justify-center gap-2 mb-4">
                    {['CSV', 'Excel', 'JSON'].map((fmt) => (
                        <span key={fmt} className="px-3 py-1 bg-bg-section border border-border rounded-full text-xs text-text-muted">
                            {fmt}
                        </span>
                    ))}
                </div>
                <p className="text-xs text-text-muted">Maximum file size: 500MB</p>
            </div>

            {/* Connectors */}
            <div>
                <h2 className="text-lg font-semibold mb-4">External Connectors</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                    {connectors.map(({ name, desc, icon: Icon }) => (
                        <div key={name} className="bg-bg-card border border-border rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center mb-3">
                                <Icon className="w-6 h-6 text-accent-purple" />
                            </div>
                            <h3 className="font-semibold mb-1">{name}</h3>
                            <p className="text-text-muted text-sm mb-4">{desc}</p>
                            <button className="w-full py-2 border border-border rounded-[10px] text-sm font-medium text-text-secondary hover:border-accent-purple hover:text-white transition-all duration-200">
                                Connect
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Datasets Table */}
            <div className="bg-bg-card border border-border rounded-2xl p-5">
                <h2 className="font-semibold mb-4">Your Datasets</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-text-muted text-left border-b border-border">
                                <th className="pb-3 font-medium">File</th>
                                <th className="pb-3 font-medium">Size</th>
                                <th className="pb-3 font-medium">Dimensions</th>
                                <th className="pb-3 font-medium">Status</th>
                                <th className="pb-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datasets.map((ds) => (
                                <tr key={ds.id} className="border-b border-border/50 last:border-0">
                                    <td className="py-3">
                                        <div className="flex items-center gap-2">
                                            <File className="w-4 h-4 text-accent-purple" />
                                            <span className="font-medium">{ds.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-text-muted">{ds.size}</td>
                                    <td className="py-3 text-text-muted">{ds.rows} × {ds.cols}</td>
                                    <td className="py-3">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${ds.status === 'ready' ? 'bg-success/15 text-success'
                                                : ds.status === 'uploading' ? 'bg-accent-purple/15 text-accent-purple'
                                                    : 'bg-error/15 text-error'
                                            }`}>
                                            {ds.status === 'uploading' && <Loader2 className="w-3 h-3 animate-spin" />}
                                            {ds.status.charAt(0).toUpperCase() + ds.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex gap-1">
                                            <button className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-white transition-colors" title="Preview">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-1.5 rounded-lg hover:bg-accent-purple/10 text-text-muted hover:text-accent-purple transition-colors" title="Run Pipeline">
                                                <Play className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(ds.id)} className="p-1.5 rounded-lg hover:bg-error/10 text-text-muted hover:text-error transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
