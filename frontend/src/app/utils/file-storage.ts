// IndexedDB utility for storing uploaded documents

const DB_NAME = 'CareerFlowDocuments';
const DB_VERSION = 1;
const STORE_NAME = 'documents';

interface StoredDocument {
  id: string;
  file: File;
  name: string;
  uploadDate: string;
  type: 'resume' | 'cover-letter';
}

// Initialize IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
}

// Save document to IndexedDB
export async function saveDocument(
  file: File,
  type: 'resume' | 'cover-letter'
): Promise<{ name: string; uploadDate: string }> {
  const db = await openDB();
  const uploadDate = new Date().toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });

  const document: StoredDocument = {
    id: type,
    file: file,
    name: file.name,
    uploadDate: uploadDate,
    type: type,
  };

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(document);

    request.onsuccess = () => {
      console.log(`✅ Document saved to IndexedDB: ${file.name}`);
      resolve({ name: file.name, uploadDate });
    };
    request.onerror = () => reject(request.error);
  });
}

// Get document from IndexedDB
export async function getDocument(
  type: 'resume' | 'cover-letter'
): Promise<StoredDocument | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(type);

    request.onsuccess = () => {
      const result = request.result;
      if (result) {
        console.log(`✅ Document retrieved from IndexedDB: ${result.name}`);
      }
      resolve(result || null);
    };
    request.onerror = () => reject(request.error);
  });
}

// Delete document from IndexedDB
export async function deleteDocument(type: 'resume' | 'cover-letter'): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(type);

    request.onsuccess = () => {
      console.log(`✅ Document deleted from IndexedDB: ${type}`);
      resolve();
    };
    request.onerror = () => reject(request.error);
  });
}

// Download document
export async function downloadDocument(type: 'resume' | 'cover-letter'): Promise<void> {
  const document = await getDocument(type);
  
  if (!document) {
    console.error('No document found to download');
    return;
  }

  // Create a download link
  const url = URL.createObjectURL(document.file);
  const a = document.createElement('a');
  a.href = url;
  a.download = document.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  console.log(`✅ Document downloaded: ${document.name}`);
}

// Preview document (opens in new tab)
export async function previewDocument(type: 'resume' | 'cover-letter'): Promise<void> {
  const document = await getDocument(type);
  
  if (!document) {
    console.error('No document found to preview');
    return;
  }

  // Create a URL for the file and open in new tab
  const url = URL.createObjectURL(document.file);
  window.open(url, '_blank');
  
  console.log(`✅ Document opened for preview: ${document.name}`);
}

// Get all documents
export async function getAllDocuments(): Promise<StoredDocument[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
