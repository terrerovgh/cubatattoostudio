import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Images, Upload, Trash2, Copy, Check, Loader2, AlertCircle,
  CheckCircle2, Search, X, FolderOpen, ChevronRight, ImageOff,
  RefreshCw, HardDrive,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface R2Object {
  key: string;
  size: number;
  uploaded: string;
  etag: string;
  httpEtag: string;
}

interface GalleryData {
  objects: R2Object[];
  truncated: boolean;
  cursor?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const FOLDER_PREFIXES = [
  { label: 'All Files', value: '' },
  { label: 'Portfolio', value: 'portfolio/' },
  { label: 'Flash', value: 'flash/' },
  { label: 'Gallery', value: 'gallery/' },
  { label: 'Promotions', value: 'promotions/' },
];

const ACCEPT_TYPES = 'image/jpeg,image/png,image/webp,image/gif,image/avif';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function fileNameFromKey(key: string): string {
  return key.split('/').pop() ?? key;
}

function imageUrl(key: string): string {
  return `/api/images/${encodeURIComponent(key)}`;
}

// ---------------------------------------------------------------------------
// Delete Confirm Dialog
// ---------------------------------------------------------------------------

interface DeleteDialogProps {
  objectKey: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

function DeleteDialog({ objectKey, onConfirm, onCancel }: DeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-4">
          <Trash2 size={18} className="text-red-500" />
        </div>
        <h3 className="text-base font-semibold text-[#1a1a2e] mb-1">Delete Image?</h3>
        <p className="text-sm text-gray-500 mb-1">
          This will permanently delete:
        </p>
        <p className="text-xs font-mono text-gray-600 bg-gray-50 rounded-lg px-3 py-2 mb-5 break-all">
          {objectKey}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Image Preview Modal
// ---------------------------------------------------------------------------

interface PreviewModalProps {
  object: R2Object;
  onClose: () => void;
  onDelete: (obj: R2Object) => void;
}

function PreviewModal({ object, onClose, onDelete }: PreviewModalProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const url = imageUrl(object.key);

  const handleCopy = () => {
    void navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-[#1a1a2e] truncate max-w-xs">
            {fileNameFromKey(object.key)}
          </p>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Image */}
        <div className="bg-gray-50 flex items-center justify-center" style={{ minHeight: 300, maxHeight: 500 }}>
          {imgError ? (
            <div className="flex flex-col items-center gap-2 py-16 text-gray-300">
              <ImageOff size={32} />
              <p className="text-xs text-gray-400">Preview unavailable</p>
            </div>
          ) : (
            <img
              src={url}
              alt={fileNameFromKey(object.key)}
              className="max-w-full max-h-[500px] object-contain"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Meta + Actions */}
        <div className="px-5 py-4 flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Size</p>
              <p className="text-sm font-medium text-[#1a1a2e]">{formatBytes(object.size)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Uploaded</p>
              <p className="text-sm font-medium text-[#1a1a2e]">{formatDate(object.uploaded)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Path</p>
              <p className="text-sm font-medium text-[#1a1a2e] truncate font-mono text-xs">
                {object.key.includes('/') ? object.key.split('/').slice(0, -1).join('/') + '/' : '/'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy URL'}
            </button>
            <button
              onClick={() => onDelete(object)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-sm text-red-600 font-medium hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Drop Zone / Upload Area
// ---------------------------------------------------------------------------

interface UploadAreaProps {
  prefix: string;
  onUploaded: () => void;
  onError: (msg: string) => void;
}

function UploadArea({ prefix, onUploaded, onError }: UploadAreaProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    setProgress([]);
    const errors: string[] = [];

    for (const file of fileArray) {
      setProgress((p) => [...p, `Uploading ${file.name}...`]);
      try {
        const fd = new FormData();
        fd.append('file', file);
        if (prefix) fd.append('path', prefix);

        const res = await fetch('/api/admin/gallery', { method: 'POST', body: fd });
        const data = (await res.json()) as ApiResponse<unknown>;
        if (!data.success) {
          errors.push(`${file.name}: ${data.error ?? 'Upload failed'}`);
        }
      } catch {
        errors.push(`${file.name}: Network error`);
      }
    }

    setUploading(false);
    setProgress([]);

    if (errors.length > 0) {
      onError(errors.join('\n'));
    } else {
      onUploaded();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      void uploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      void uploadFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center gap-3 px-6 py-10 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
        dragging
          ? 'border-[#C8956C] bg-[#C8956C]/5'
          : 'border-gray-200 hover:border-[#C8956C]/50 hover:bg-gray-50'
      } ${uploading ? 'pointer-events-none opacity-70' : ''}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_TYPES}
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading ? (
        <>
          <Loader2 size={24} className="text-[#C8956C] animate-spin" />
          <div className="text-center">
            <p className="text-sm font-medium text-[#1a1a2e]">Uploading...</p>
            {progress.length > 0 && (
              <p className="text-xs text-gray-400 mt-1">{progress[progress.length - 1]}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-xl bg-[#C8956C]/10 flex items-center justify-center">
            <Upload size={18} className="text-[#C8956C]" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-[#1a1a2e]">
              Drop images here or <span className="text-[#C8956C]">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              JPEG, PNG, WebP, GIF, AVIF
              {prefix ? ` — uploads to "${prefix}"` : ''}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gallery Card
// ---------------------------------------------------------------------------

interface GalleryCardProps {
  object: R2Object;
  onPreview: (obj: R2Object) => void;
  onDelete: (obj: R2Object) => void;
}

function GalleryCard({ object, onPreview, onDelete }: GalleryCardProps) {
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);
  const url = imageUrl(object.key);
  const name = fileNameFromKey(object.key);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    void navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow flex flex-col">
      {/* Thumbnail */}
      <button
        className="relative aspect-square bg-gray-50 overflow-hidden w-full"
        onClick={() => onPreview(object)}
      >
        {imgError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <ImageOff size={20} className="text-gray-300" />
            <span className="text-[10px] text-gray-300">No preview</span>
          </div>
        ) : (
          <img
            src={url}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
      </button>

      {/* Footer */}
      <div className="p-3 flex flex-col gap-2">
        <p className="text-xs font-medium text-[#1a1a2e] truncate" title={name}>
          {name}
        </p>
        <div className="flex items-center justify-between text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <HardDrive size={10} />
            {formatBytes(object.size)}
          </span>
          <span>{formatDate(object.uploaded)}</span>
        </div>
        <div className="flex gap-1.5 pt-1 border-t border-gray-100">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[11px] font-medium text-gray-500 hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} />}
            {copied ? 'Copied' : 'Copy URL'}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(object); }}
            className="flex items-center justify-center p-1.5 rounded-lg text-red-400 hover:bg-red-50 border border-gray-200 hover:border-red-200 transition-colors"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function GalleryTab() {
  const [objects, setObjects] = useState<R2Object[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [truncated, setTruncated] = useState(false);
  const [cursor, setCursor] = useState<string | undefined>();

  const [prefix, setPrefix] = useState('');
  const [search, setSearch] = useState('');

  const [previewObject, setPreviewObject] = useState<R2Object | null>(null);
  const [deletingObject, setDeletingObject] = useState<R2Object | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchObjects = useCallback(async (nextCursor?: string) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ limit: '100' });
      if (prefix) params.set('prefix', prefix);
      if (nextCursor) params.set('cursor', nextCursor);

      const res = await fetch(`/api/admin/gallery?${params}`);
      const data = (await res.json()) as ApiResponse<GalleryData>;

      if (data.success && data.data) {
        const { objects: newObjects, truncated: trunc, cursor: nextCur } = data.data;
        setObjects((prev) => (nextCursor ? [...prev, ...newObjects] : newObjects));
        setTruncated(trunc);
        setCursor(nextCur);
      } else {
        setError(data.error ?? 'Failed to load gallery.');
      }
    } catch {
      setError('Network error. Could not load gallery.');
    } finally {
      setLoading(false);
    }
  }, [prefix]);

  useEffect(() => {
    setObjects([]);
    setCursor(undefined);
    void fetchObjects();
  }, [fetchObjects]);

  const handleDelete = async () => {
    if (!deletingObject) return;
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: deletingObject.key }),
      });
      const data = (await res.json()) as ApiResponse<unknown>;
      if (data.success) {
        setObjects((prev) => prev.filter((o) => o.key !== deletingObject.key));
        showToast('Image deleted.');
        if (previewObject?.key === deletingObject.key) setPreviewObject(null);
      } else {
        showToast(data.error ?? 'Delete failed.', 'error');
      }
    } catch {
      showToast('Network error.', 'error');
    } finally {
      setDeletingObject(null);
    }
  };

  const handleUploadError = (msg: string) => {
    showToast(msg, 'error');
  };

  const handleUploaded = () => {
    showToast('Images uploaded successfully.');
    setShowUpload(false);
    setObjects([]);
    setCursor(undefined);
    void fetchObjects();
  };

  const filteredObjects = objects.filter((o) => {
    if (!search) return true;
    return fileNameFromKey(o.key).toLowerCase().includes(search.toLowerCase());
  });

  const selectClass =
    'pl-3 pr-8 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] appearance-none focus:outline-none focus:border-[#C8956C] transition-colors';

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a2e]">Media Gallery</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {loading ? 'Loading...' : `${filteredObjects.length} file${filteredObjects.length !== 1 ? 's' : ''}${search ? ' (filtered)' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setObjects([]); setCursor(undefined); void fetchObjects(); }}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={() => setShowUpload((v) => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C8956C] text-white text-sm font-semibold hover:bg-[#b8825c] transition-colors shadow-sm shadow-[#C8956C]/20"
          >
            <Upload size={16} />
            Upload
          </button>
        </div>
      </div>

      {/* Upload Area */}
      {showUpload && (
        <UploadArea
          prefix={prefix}
          onUploaded={handleUploaded}
          onError={handleUploadError}
        />
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Folder picker */}
        <div className="relative">
          <select
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className={selectClass}
          >
            {FOLDER_PREFIXES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
          <ChevronRight size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none rotate-90" />
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-48 max-w-xs">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-[#1a1a2e] placeholder-gray-400 focus:outline-none focus:border-[#C8956C] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Active folder breadcrumb */}
        {prefix && (
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <FolderOpen size={13} className="text-[#C8956C]" />
            <span className="font-mono">{prefix}</span>
            <button
              onClick={() => setPrefix('')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={11} />
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && objects.length === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="aspect-square bg-gray-100" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filteredObjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Images size={24} className="text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            {search ? 'No files match your search' : 'No files in this folder'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? 'Try a different search term.' : 'Upload images using the button above.'}
          </p>
        </div>
      )}

      {/* Grid */}
      {filteredObjects.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredObjects.map((obj) => (
            <GalleryCard
              key={obj.key}
              object={obj}
              onPreview={setPreviewObject}
              onDelete={setDeletingObject}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {truncated && !loading && (
        <div className="flex justify-center">
          <button
            onClick={() => void fetchObjects(cursor)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={14} />
            Load more
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {previewObject && (
        <PreviewModal
          object={previewObject}
          onClose={() => setPreviewObject(null)}
          onDelete={(obj) => {
            setPreviewObject(null);
            setDeletingObject(obj);
          }}
        />
      )}

      {/* Delete Dialog */}
      {deletingObject && (
        <DeleteDialog
          objectKey={deletingObject.key}
          onConfirm={handleDelete}
          onCancel={() => setDeletingObject(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
            toast.type === 'success' ? 'bg-[#1a1a2e] text-white' : 'bg-red-600 text-white'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 size={15} className="text-[#C8956C]" />
          ) : (
            <AlertCircle size={15} />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
