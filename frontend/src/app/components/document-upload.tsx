import { useState, useRef } from "react";
import { Upload, FileText, X, Check, Loader2, Download, Trash2, Eye } from "lucide-react";

interface DocumentUploadProps {
  type: "resume" | "cover-letter";
  onUpload: (file: File) => Promise<void>;
  currentFile?: { name: string; uploadDate: string; url?: string };
  onDelete?: () => Promise<void>;
}

export function DocumentUpload({ type, onUpload, currentFile, onDelete }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files[0]);
  };

  const handleFileUpload = async (file: File) => {
    const validTypes = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(ext)) { setUploadError('Please upload a PDF or Word document (.pdf, .doc, .docx)'); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadError('File size must be less than 10MB'); return; }
    setIsUploading(true);
    setUploadError("");
    try {
      await onUpload(file);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Upload failed. Please try again.';
      setUploadError(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) handleFileUpload(e.target.files[0]);
    e.target.value = '';
  };

  const handleDownload = () => {
    if (currentFile?.url) {
      const a = document.createElement('a');
      a.href = currentFile.url;
      a.download = currentFile.name;
      a.click();
    }
  };

  const handlePreview = () => {
    if (currentFile?.url) window.open(currentFile.url, '_blank');
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try { await onDelete(); } finally { setIsDeleting(false); }
  };

  const displayName = type === "resume" ? "Resume" : "Cover Letter";
  const ext = currentFile ? currentFile.name.split('.').pop()?.toUpperCase() || 'FILE' : '';

  return (
    <div className="space-y-4">
      {isUploading ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Uploading {displayName}...</p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      ) : currentFile ? (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-16 h-20 bg-white rounded-lg shadow-sm border border-green-200 flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-green-600 mb-1" />
                <span className="text-[10px] font-semibold text-green-700">{ext}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-green-500 p-1 rounded-full">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-medium text-green-700">Saved to Server</span>
              </div>
              <h4 className="font-semibold text-foreground truncate mb-1">{currentFile.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">Uploaded {currentFile.uploadDate}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary border border-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all"
                >
                  <Upload className="w-3.5 h-3.5" /> Replace
                </button>
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> Preview
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-all ml-auto disabled:opacity-50"
                  >
                    {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
        {uploadError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg mb-2">
            {uploadError}
          </div>
        )}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging ? "border-primary bg-accent" : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="bg-accent p-4 rounded-full">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                Drop your {displayName} here or{" "}
                <button onClick={() => fileInputRef.current?.click()} className="text-primary hover:text-blue-700 transition-colors">
                  browse
                </button>
              </p>
              <p className="text-sm text-muted-foreground">Supports PDF, DOC, DOCX (Max 10MB)</p>
            </div>
          </div>
        </div>
        </>
      )}
      <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
    </div>
  );
}
