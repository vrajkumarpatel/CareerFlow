import { useState, useRef } from "react";
import { Upload, FileText, X, Check, Loader2, Download, Trash2, Eye } from "lucide-react";
import { downloadDocument, previewDocument } from "../utils/file-storage";

interface DocumentUploadProps {
  type: "resume" | "cover-letter";
  onUpload: (file: File) => void;
  currentFile?: { name: string; uploadDate: string };
  onDelete?: () => void;
}

export function DocumentUpload({ type, onUpload, currentFile, onDelete }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    const validTypes = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      alert('Please upload a PDF or Word document');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay for better UX
    setTimeout(() => {
      onUpload(file);
      setIsUploading(false);
    }, 1500);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadDocument(type);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document');
    }
  };

  const handlePreview = async () => {
    try {
      await previewDocument(type);
    } catch (error) {
      console.error('Error previewing document:', error);
      alert('Failed to preview document');
    }
  };

  const displayName = type === "resume" ? "Resume" : "Cover Letter";

  // Get file extension
  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toUpperCase() || 'FILE';
  };

  // Get file size in readable format
  const getFileSize = (filename: string) => {
    // This is approximate based on filename, in real app would be from actual file
    return "~500 KB";
  };

  return (
    <div className="space-y-4">
      {isUploading ? (
        <div className="border-2 border-dashed border-border rounded-xl p-8 bg-muted">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground">Uploading {displayName}...</p>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        </div>
      ) : currentFile ? (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            {/* File Icon */}
            <div className="flex-shrink-0">
              <div className="w-16 h-20 bg-white rounded-lg shadow-sm border border-green-200 flex flex-col items-center justify-center">
                <FileText className="w-8 h-8 text-green-600 mb-1" />
                <span className="text-[10px] font-semibold text-green-700">
                  {getFileExtension(currentFile.name)}
                </span>
              </div>
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-green-500 p-1 rounded-full">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-medium text-green-700">Saved to Documents</span>
                  </div>
                  <h4 className="font-semibold text-foreground truncate mb-1">
                    {currentFile.name}
                  </h4>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>Uploaded on {currentFile.uploadDate}</span>
                    <span>•</span>
                    <span>{getFileSize(currentFile.name)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-primary border border-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-all"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Replace
                </button>
                <button
                  onClick={handlePreview}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Preview
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-foreground border border-border rounded-lg text-sm font-medium hover:bg-accent transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                {onDelete && (
                  <button
                    onClick={onDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-red-600 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-50 transition-all ml-auto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? "border-primary bg-accent"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="bg-accent p-4 rounded-full">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">
                Drop your {displayName} here or{" "}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary hover:text-blue-700 transition-colors"
                >
                  browse
                </button>
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}