import { useState } from 'react';
import { FileText, Download, Eye, X, BarChart3, Users, Package } from 'lucide-react';

const summaryStats = [
    { label: 'Total Reports', value: '156', icon: FileText, color: 'text-accent-purple', bg: 'bg-accent-purple/10' },
    { label: 'Downloads', value: '1,234', icon: Download, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Avg Pages', value: '18', icon: FileText, color: 'text-info', bg: 'bg-info/10' },
];

const reports = [
    {
        id: 1, title: 'Sales Q4 2024 Analysis Report', dataset: 'sales_q4_2024.csv',
        date: 'Dec 15, 2024', pages: 24, tags: ['Revenue Analysis', 'Forecasting', 'EDA'],
        summary: 'Comprehensive analysis of Q4 2024 sales data showing 12.3% revenue growth. Key findings include seasonal trends, top-performing categories, and revenue forecasts for Q1 2025.',
        metrics: [
            { label: 'Total Revenue', value: '$2.4M' },
            { label: 'Growth Rate', value: '+12.3%' },
            { label: 'Top Category', value: 'Electronics' },
        ],
        toc: ['Executive Summary', 'Data Overview', 'Statistical Analysis', 'Revenue Trends', 'Category Breakdown', 'ML Predictions', 'Recommendations'],
    },
    {
        id: 2, title: 'Customer Churn Prediction Report', dataset: 'customer_churn.xlsx',
        date: 'Dec 14, 2024', pages: 18, tags: ['Churn Analysis', 'ML Models', 'Retention'],
        summary: 'Predictive analysis identifying at-risk customers with 91.7% accuracy. Report includes key churn drivers, customer segments, and retention strategies.',
        metrics: [
            { label: 'Churn Rate', value: '8.2%' },
            { label: 'At-Risk', value: '2,891' },
            { label: 'Model Accuracy', value: '91.7%' },
        ],
        toc: ['Executive Summary', 'Customer Segments', 'Churn Drivers', 'Predictive Model', 'Retention Strategy', 'Next Steps'],
    },
    {
        id: 3, title: 'Inventory Optimization Report', dataset: 'inventory_data.json',
        date: 'Dec 13, 2024', pages: 15, tags: ['Inventory', 'Optimization', 'Supply Chain'],
        summary: 'Analysis of inventory levels across 500+ SKUs with optimization recommendations. Identified $340K in potential savings through better stock management.',
        metrics: [
            { label: 'Total SKUs', value: '524' },
            { label: 'Overstock', value: '12.4%' },
            { label: 'Savings', value: '$340K' },
        ],
        toc: ['Executive Summary', 'Inventory Overview', 'SKU Analysis', 'Demand Forecasting', 'Optimization Plan', 'Cost Savings'],
    },
];

const reportIcons = [BarChart3, Users, Package];

export default function ReportsPage() {
    const [previewId, setPreviewId] = useState<number | null>(null);
    const previewReport = reports.find((r) => r.id === previewId);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[24px] font-semibold font-[family-name:var(--font-heading)]">Reports</h1>
                <p className="text-text-muted text-sm mt-1">View and download generated analysis reports.</p>
            </div>

            {/* Summary Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
                {summaryStats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="bg-bg-card border border-border rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-300">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-text-muted text-sm">{label}</span>
                            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                        </div>
                        <div className="text-2xl font-bold font-[family-name:var(--font-heading)]">{value}</div>
                    </div>
                ))}
            </div>

            {/* Report Cards */}
            <div className="space-y-4">
                {reports.map((report, idx) => {
                    const Icon = reportIcons[idx];
                    return (
                        <div key={report.id} className="bg-bg-card border border-border rounded-2xl p-6 hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-accent-purple/10 flex items-center justify-center shrink-0">
                                    <Icon className="w-6 h-6 text-accent-purple" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold mb-1">{report.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-text-muted mb-3 flex-wrap">
                                        <span>{report.dataset}</span>
                                        <span>{report.date}</span>
                                        <span>{report.pages} pages</span>
                                    </div>
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {report.tags.map((tag) => (
                                            <span key={tag} className="px-2.5 py-0.5 bg-bg-section border border-border rounded-full text-xs text-text-muted">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setPreviewId(report.id)}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent-purple/10 text-accent-purple rounded-[10px] text-sm font-medium hover:bg-accent-purple/20 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" /> Preview
                                        </button>
                                        <button className="inline-flex items-center gap-1.5 px-4 py-2 border border-border rounded-[10px] text-sm font-medium text-text-secondary hover:border-accent-purple hover:text-white transition-all duration-200">
                                            <Download className="w-4 h-4" /> Download PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Preview Modal */}
            {previewReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
                        <div className="sticky top-0 bg-bg-card border-b border-border p-5 flex items-center justify-between rounded-t-2xl">
                            <h2 className="font-semibold">{previewReport.title}</h2>
                            <button onClick={() => setPreviewId(null)} className="p-2 rounded-lg hover:bg-white/5 text-text-muted hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Executive Summary */}
                            <div>
                                <h3 className="text-sm font-semibold text-accent-purple mb-2">Executive Summary</h3>
                                <p className="text-text-secondary text-sm leading-relaxed">{previewReport.summary}</p>
                            </div>

                            {/* Metrics */}
                            <div className="grid grid-cols-3 gap-3">
                                {previewReport.metrics.map(({ label, value }) => (
                                    <div key={label} className="bg-bg-section rounded-xl p-4 text-center">
                                        <p className="text-lg font-bold font-[family-name:var(--font-heading)]">{value}</p>
                                        <p className="text-xs text-text-muted mt-0.5">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Table of Contents */}
                            <div>
                                <h3 className="text-sm font-semibold text-accent-purple mb-3">Table of Contents</h3>
                                <div className="space-y-1.5">
                                    {previewReport.toc.map((item, i) => (
                                        <div key={item} className="flex items-center gap-3 py-2 px-3 bg-bg-section rounded-lg text-sm">
                                            <span className="text-text-muted w-6">{i + 1}.</span>
                                            <span className="text-text-secondary">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="w-full py-3 bg-gradient-to-r from-accent-purple to-accent-indigo rounded-[10px] text-[15px] font-semibold hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300">
                                <Download className="w-4 h-4 inline mr-2" /> Download Full Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
