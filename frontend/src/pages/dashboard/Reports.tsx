import { FileText, Download, Eye, X, RefreshCw, Loader2, AlertCircle, FileX, Zap } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import MagicCard from '@/components/magicui/MagicCard';
import BlurFade from '@/components/magicui/BlurFade';
import NumberTicker from '@/components/magicui/NumberTicker';
import ShimmerButton from '@/components/magicui/ShimmerButton';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Report {
  id: string;
  pipeline_id: string;
  dataset_id: string;
  title: string;
  storage_path: string;
  file_size: number;
  status: 'ready' | 'generating' | 'error';
  created_at: string;
  dataset_name?: string;
  dataset_file_type?: string;
}

// ─── API Config ──────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('autoinsight_token');
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (!bytes || bytes === 0) return 'N/A';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ─── Generate Modal ──────────────────────────────────────────────────────────

function GenerateModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [pipelineId, setPipelineId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!pipelineId.trim()) {
      setError('Please enter a Pipeline ID.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/reports/${pipelineId.trim()}/generate`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail ?? `Error ${res.status}`);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-2xl w-full max-w-md p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" /> Generate Report
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          Enter a completed Pipeline ID to trigger the Reporting Agent. The agent will compile
          all EDA and ML results into a downloadable PDF.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">
              Pipeline ID
            </label>
            <input
              type="text"
              value={pipelineId}
              onChange={(e) => setPipelineId(e.target.value)}
              placeholder="e.g. 3f9a1c2b-..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <ShimmerButton
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" /> Run Reporting Agent
              </>
            )}
          </ShimmerButton>
        </div>
      </div>
    </div>
  );
}

// ─── Preview Modal ────────────────────────────────────────────────────────────

function PreviewModal({
  report,
  onClose,
  onDownload,
  downloading,
}: {
  report: Report;
  onClose: () => void;
  onDownload: (r: Report) => void;
  downloading: string | null;
}) {
  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="glass-strong rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-bold text-foreground">{report.title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Meta grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              ['Dataset', report.dataset_name ?? 'N/A'],
              ['File Size', formatBytes(report.file_size)],
              ['Generated', formatDate(report.created_at)],
            ].map(([label, val]) => (
              <div key={label} className="bg-white/[0.03] rounded-xl p-4 text-center">
                <div className="text-base font-heading font-bold text-foreground truncate">{val}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Table of contents */}
          <div>
            <h3 className="font-heading font-semibold mb-2 text-foreground">Report Sections</h3>
            <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
              {[
                'Executive Summary',
                'Data Overview',
                'Statistical Analysis',
                'Missing Values Analysis',
                'Correlation Analysis',
                'Machine Learning Results',
                'Recommendations',
              ].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </div>

          <ShimmerButton
            className="w-full flex items-center justify-center gap-2"
            onClick={() => onDownload(report)}
            disabled={downloading === report.pipeline_id}
          >
            {downloading === report.pipeline_id ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Downloading…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Download Full Report
              </>
            )}
          </ShimmerButton>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const Reports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [preview, setPreview] = useState<Report | null>(null);
  const [showGenerate, setShowGenerate] = useState(false);
  const [downloading, setDownloading] = useState<string | null>(null);

  // ── Fetch reports ─────────────────────────────────────────────────────────

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`${API_BASE}/api/v1/reports`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setReports(data.reports ?? []);
    } catch (err: unknown) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // ── Download PDF ──────────────────────────────────────────────────────────

  const handleDownload = async (report: Report) => {
    setDownloading(report.pipeline_id);
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/reports/${report.pipeline_id}/download`,
        { headers: getAuthHeaders() },
      );
      if (!res.ok) throw new Error(`Download error: ${res.status}`);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${report.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setDownloading(null);
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────

  const totalSize = reports.reduce((acc, r) => acc + (r.file_size ?? 0), 0);
  const readyCount = reports.filter((r) => r.status === 'ready').length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-heading font-bold text-foreground">Reports</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchReports}
              className="secondary-btn text-sm px-3 py-2 flex items-center gap-1.5"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <ShimmerButton
              className="text-sm px-4 py-2 flex items-center gap-1.5"
              onClick={() => setShowGenerate(true)}
            >
              <Zap className="w-4 h-4" /> Generate Report
            </ShimmerButton>
          </div>
        </div>
      </BlurFade>

      {/* Stats row */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Reports', value: reports.length },
          { label: 'Ready Reports', value: readyCount },
          { label: 'Total Storage (MB)', value: Math.round(totalSize / (1024 * 1024)) },
        ].map((s, i) => (
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

      {/* Error banner */}
      {fetchError && (
        <BlurFade>
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-5 py-4 text-sm text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{fetchError}</span>
            <button
              onClick={fetchReports}
              className="ml-auto underline underline-offset-2 hover:text-red-300 transition-colors"
            >
              Retry
            </button>
          </div>
        </BlurFade>
      )}

      {/* Loading skeleton */}
      {loading && !fetchError && (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="glass rounded-2xl p-6 animate-pulse"
              style={{ animationDelay: `${n * 0.1}s` }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/5 rounded w-1/3" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !fetchError && reports.length === 0 && (
        <BlurFade delay={0.2}>
          <MagicCard className="p-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileX className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-1">No reports yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Run the Reporting Agent on a completed pipeline to generate your first PDF report.
              </p>
            </div>
            <ShimmerButton
              className="text-sm px-6 py-2 flex items-center gap-1.5 mt-2"
              onClick={() => setShowGenerate(true)}
            >
              <Zap className="w-4 h-4" /> Generate First Report
            </ShimmerButton>
          </MagicCard>
        </BlurFade>
      )}

      {/* Reports list */}
      {!loading && reports.length > 0 && (
        <div className="space-y-4">
          {reports.map((report, i) => (
            <BlurFade key={report.id} delay={0.2 + i * 0.08}>
              <MagicCard className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      report.status === 'ready'
                        ? 'bg-primary/10'
                        : report.status === 'generating'
                        ? 'bg-amber-500/10'
                        : 'bg-red-500/10'
                    }`}
                  >
                    {report.status === 'generating' ? (
                      <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                    ) : report.status === 'error' ? (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    ) : (
                      <FileText className="w-6 h-6 text-primary" />
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold mb-1 text-foreground truncate">
                      {report.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>{report.dataset_name ?? 'Unknown dataset'}</span>
                      <span>•</span>
                      <span>{formatDate(report.created_at)}</span>
                      <span>•</span>
                      <span>{formatBytes(report.file_size)}</span>
                    </div>
                    {/* Status badge */}
                    <span
                      className={`inline-flex items-center mt-2 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                        report.status === 'ready'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : report.status === 'generating'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}
                    >
                      {report.status === 'generating' && (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      )}
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {report.status === 'ready' && (
                      <>
                        <button
                          onClick={() => setPreview(report)}
                          className="secondary-btn text-sm px-4 py-2 flex items-center gap-1.5"
                        >
                          <Eye className="w-4 h-4" /> Preview
                        </button>
                        <ShimmerButton
                          className="text-sm px-4 py-2 flex items-center gap-1.5"
                          onClick={() => handleDownload(report)}
                          disabled={downloading === report.pipeline_id}
                        >
                          {downloading === report.pipeline_id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          Download
                        </ShimmerButton>
                      </>
                    )}
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <PreviewModal
          report={preview}
          onClose={() => setPreview(null)}
          onDownload={handleDownload}
          downloading={downloading}
        />
      )}

      {/* Generate Modal */}
      {showGenerate && (
        <GenerateModal
          onClose={() => setShowGenerate(false)}
          onSuccess={fetchReports}
        />
      )}
    </div>
  );
};

export default Reports;
