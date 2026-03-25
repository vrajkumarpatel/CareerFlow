import { Info, Database, HardDrive } from "lucide-react";

export function DocumentStorageInfo() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="bg-blue-500 p-2 rounded-lg flex-shrink-0">
          <Info className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            Document Storage
          </h4>
          <p className="text-sm text-muted-foreground mb-2">
            Your documents are securely stored in your browser's IndexedDB. They persist across sessions and page refreshes.
          </p>
          <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-100 px-3 py-1.5 rounded-lg inline-flex">
            <HardDrive className="w-3.5 h-3.5" />
            <span>Stored locally in browser • Private & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
