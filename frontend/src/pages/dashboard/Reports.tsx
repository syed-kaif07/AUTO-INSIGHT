import { FileText, Download, Eye, X } from 'lucide-react';
import { useState } from 'react';
import MagicCard from '@/components/magicui/MagicCard';
import BlurFade from '@/components/magicui/BlurFade';
import NumberTicker from '@/components/magicui/NumberTicker';
import ShimmerButton from '@/components/magicui/ShimmerButton';

const summaryStats = [
  { label: 'Total Reports', value: 156 },
  { label: 'Total Downloads', value: 1234 },
  { label: 'Avg Pages', value: 18 },
];

const reports = [
  { title: 'Sales Analysis Q4 2024', dataset: 'sales_2024.csv', date: 'Jan 15, 2025', pages: 24, tags: ['Revenue', 'Trends', 'Forecast'] },
  { title: 'Customer Churn Analysis', dataset: 'customers.xlsx', date: 'Jan 12, 2025', pages: 18, tags: ['Churn', 'Retention', 'Segments'] },
  { title: 'Inventory Optimization', dataset: 'inventory.json', date: 'Jan 10, 2025', pages: 12, tags: ['Stock', 'Demand', 'Supply Chain'] },
];

const Reports = () => {
  const [preview, setPreview] = useState<typeof reports[0] | null>(null);

  return (
    <div className="space-y-6">
      <BlurFade>
        <h1 className="text-2xl font-heading font-bold text-foreground">Reports</h1>
      </BlurFade>

      <div className="grid sm:grid-cols-3 gap-4">
        {summaryStats.map((s, i) => (
          <BlurFade key={s.label} delay={i * 0.1}>
            <MagicCard className="p-6 text-center">
              <div className="text-2xl font-heading font-bold text-foreground">
                <NumberTicker value={s.value} />
              </div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>

      <div className="space-y-4">
        {reports.map((report, i) => (
          <BlurFade key={report.title} delay={0.2 + i * 0.1}>
            <MagicCard className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-semibold mb-1 text-foreground">{report.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{report.dataset}</span>
                    <span>•</span>
                    <span>{report.date}</span>
                    <span>•</span>
                    <span>{report.pages} pages</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {report.tags.map(tag => (
                      <span key={tag} className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreview(report)} className="secondary-btn text-sm px-4 py-2 flex items-center gap-1.5">
                    <Eye className="w-4 h-4" /> Preview
                  </button>
                  <ShimmerButton className="text-sm px-4 py-2">
                    <Download className="w-4 h-4" /> Download
                  </ShimmerButton>
                </div>
              </div>
            </MagicCard>
          </BlurFade>
        ))}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="glass-strong rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-bold text-foreground">{preview.title}</h2>
              <button onClick={() => setPreview(null)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-heading font-semibold mb-2 text-foreground">Executive Summary</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">This report provides a comprehensive analysis of the dataset with key findings, statistical summaries, and actionable recommendations.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[['Key Metrics', '24'], ['Insights', '12'], ['Recommendations', '8']].map(([label, val]) => (
                  <div key={label} className="bg-white/[0.03] rounded-xl p-4 text-center">
                    <div className="text-lg font-heading font-bold text-foreground">{val}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-heading font-semibold mb-2 text-foreground">Table of Contents</h3>
                <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
                  {['Executive Summary', 'Data Overview', 'Statistical Analysis', 'Visualizations', 'ML Predictions', 'Recommendations'].map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              </div>
              <ShimmerButton className="w-full">
                <Download className="w-4 h-4" /> Download Full Report
              </ShimmerButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
