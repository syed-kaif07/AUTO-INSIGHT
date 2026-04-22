import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Database, FileSpreadsheet, Globe, Eye, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MagicCard from '@/components/magicui/MagicCard';
import BorderBeam from '@/components/magicui/BorderBeam';
import BlurFade from '@/components/magicui/BlurFade';
import ShimmerButton from '@/components/magicui/ShimmerButton';
import { Progress } from '@/components/ui/progress';

const connectors = [
  { name: 'PostgreSQL', desc: 'Connect to your PostgreSQL database', icon: Database },
  { name: 'Google Sheets', desc: 'Import from Google Sheets', icon: FileSpreadsheet },
  { name: 'REST API', desc: 'Connect to any REST endpoint', icon: Globe },
];

const initialDatasets: any[] = [];

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

function randomShape() {
  const rows = Math.floor(Math.random() * 20000) + 500;
  const cols = Math.floor(Math.random() * 20) + 3;
  return `${rows.toLocaleString()} × ${cols}`;
}

const DataSources = () => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [datasets, setDatasets] = useState(initialDatasets);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/datasets")
      .then(res => res.json())
      .then(data => {
        if (data && data.datasets) {
          setDatasets(data.datasets.map((d: any) => ({
            id: d.id,
            name: d.original_filename,
            size: formatSize(d.file_size),
            shape: d.rows_count ? `${d.rows_count.toLocaleString()} × ${d.columns_count}` : 'Unknown',
            status: d.status === 'ready' ? 'Processing' : 'Ready' // ingested status turns it ready
          })));
        }
      })
      .catch(console.error);
  }, []);

  const handleFile = useCallback((file: File) => {
    setSelectedFile(file);
    setUploading(false);
    setProgress(0);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }, [handleFile]);

  const cancelFile = useCallback(() => {
    setSelectedFile(null);
    setUploading(false);
    setProgress(0);
  }, []);

  const startUpload = useCallback(async () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(0);
    
    // Fake progress interval while real upload happens
    const int = setInterval(() => setProgress(p => Math.min(p + 15, 90)), 300);

    try {
      const fd = new FormData();
      fd.append("file", selectedFile);
      
      const res = await fetch("http://localhost:8000/api/v1/datasets", {
        method: "POST",
        body: fd
      });
      const data = await res.json();
      
      clearInterval(int);
      if (res.ok) {
        setProgress(100);
        setTimeout(() => {
          setDatasets(d => [{
            id: data.dataset_id,
            name: selectedFile.name,
            size: formatSize(selectedFile.size),
            shape: 'Extracting...',
            status: 'Processing'
          }, ...d]);
          setUploading(false);
          setSelectedFile(null);
        }, 500);
      } else {
        setUploading(false);
        alert("Failed: " + data.detail);
      }
    } catch(err) {
      clearInterval(int);
      setUploading(false);
      console.error(err);
    }
  }, [selectedFile]);

  const handleRunPipeline = async (datasetId: string) => {
    try {
      const res = await fetch("http://localhost:8000/api/v1/jobs", {
        method: "POST",
        headers:{ "Content-Type": "application/json" },
        body: JSON.stringify({ dataset_id: datasetId, task_type: "regression" })
      });
      const data = await res.json();
      if(res.ok) {
         navigate(`/dashboard/agent-monitoring?job=${data.pipeline_id}`);
      } else {
         alert("Job failed to start: " + data.detail);
      }
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <BlurFade>
        <h1 className="text-2xl font-heading font-bold text-foreground">Data Sources</h1>
      </BlurFade>

      {/* Upload Zone */}
      <BlurFade delay={0.1}>
        <div
          onClick={() => !selectedFile && !uploading && fileInputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`relative rounded-2xl p-12 text-center transition-all duration-300 bg-white/[0.02] backdrop-blur-xl border-2 border-dashed cursor-pointer ${dragOver ? 'border-primary bg-primary/5 shadow-[0_0_30px_hsl(var(--primary)/0.2)]' : 'border-white/[0.1]'}`}
        >
          <BorderBeam duration={10} />
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            className="hidden"
            onChange={handleInputChange}
          />

          <AnimatePresence mode="wait">
            {selectedFile && !uploading ? (
              <motion.div key="preview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center gap-3">
                <FileSpreadsheet className="w-12 h-12 text-primary" />
                <p className="font-heading font-semibold text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">{formatSize(selectedFile.size)}</p>
                <div className="flex items-center gap-3 mt-2" onClick={e => e.stopPropagation()}>
                  <ShimmerButton onClick={startUpload} className="px-6 py-2">Start Upload</ShimmerButton>
                  <button onClick={cancelFile} className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-white/[0.05] transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ) : uploading ? (
              <motion.div key="uploading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex flex-col items-center gap-3 w-full max-w-md mx-auto">
                <FileSpreadsheet className="w-12 h-12 text-primary" />
                <p className="font-heading font-semibold text-foreground">Uploading {selectedFile?.name}...</p>
                <Progress value={progress} className="h-2 bg-white/[0.06]" />
                <p className="text-sm text-muted-foreground">{progress}%</p>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <motion.div animate={dragOver ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <Upload className={`w-12 h-12 mx-auto mb-4 ${dragOver ? 'text-primary' : 'text-muted-foreground'}`} />
                </motion.div>
                <h3 className="font-heading font-semibold mb-2 text-foreground">
                  {dragOver ? 'Drop to upload' : 'Drag and drop dataset here'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {['CSV', 'Excel', 'JSON'].map(type => (
                    <span key={type} className="text-xs bg-white/[0.05] px-3 py-1 rounded-full text-muted-foreground">{type}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Maximum file size: 500MB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </BlurFade>

      {/* Connectors */}
      <BlurFade delay={0.2}>
        <div>
          <h2 className="text-lg font-heading font-semibold mb-4 text-foreground">Data Connectors</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {connectors.map(c => (
              <MagicCard key={c.name} className="p-6 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 text-foreground">{c.name}</h3>
                <p className="text-sm text-muted-foreground">{c.desc}</p>
              </MagicCard>
            ))}
          </div>
        </div>
      </BlurFade>

      {/* Datasets Table */}
      <BlurFade delay={0.3}>
        <MagicCard className="p-6">
          <h2 className="font-heading font-semibold mb-4 text-foreground">Your Datasets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Size</th>
                  <th className="text-left py-3 text-muted-foreground font-medium hidden md:table-cell">Shape</th>
                  <th className="text-left py-3 text-muted-foreground font-medium">Status</th>
                  <th className="text-right py-3 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map(d => (
                  <tr key={d.name} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-medium text-foreground flex items-center gap-2"><FileSpreadsheet className="w-4 h-4 text-primary" />{d.name}</td>
                    <td className="py-3 text-muted-foreground">{d.size}</td>
                    <td className="py-3 text-muted-foreground hidden md:table-cell">{d.shape}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full ${d.status === 'Ready' ? 'bg-success/20 text-success' : d.status === 'Uploading' ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>{d.status}</span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                        <ShimmerButton onClick={() => handleRunPipeline(d.id)} className="text-xs px-3 py-1.5">Run Pipeline</ShimmerButton>
                        <button className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
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
  );
};

export default DataSources;
