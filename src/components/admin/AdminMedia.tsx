import React, { useEffect, useState, useRef } from 'react';
import { AdminLayout } from './AdminLayout';
import { api } from '../../lib/api';
import { MediaItem } from '../../types';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Plus,
  FileText
} from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // New image modal or inputs
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newAlt, setNewAlt] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = () => {
    setLoading(true);
    api.getMedia().then((items) => {
      setMedia(items);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete media asset "${title}"?`)) return;
    const ok = await api.deleteMedia(id);
    if (ok) {
      setMedia((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const dataUrl = event.target?.result as string;
        const newItem = await api.uploadMedia({
          title: file.name.replace(/\.[^/.]+$/, ''),
          url: dataUrl,
          altText: file.name.replace(/\.[^/.]+$/, ''),
          filename: file.name,
          size: file.size,
          mimeType: file.type || 'image/webp'
        });
        setMedia((prev) => [newItem, ...prev]);
        setIsUploading(false);
      } catch (err) {
        alert('Upload failed');
        setIsUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    try {
      const item = await api.uploadMedia({
        title: newTitle || 'Diagram / Image',
        url: newUrl,
        altText: newAlt || newTitle || '',
        filename: 'external-image.webp',
        size: 10240,
        mimeType: 'image/webp'
      });
      setMedia((prev) => [item, ...prev]);
      setShowAddModal(false);
      setNewTitle('');
      setNewUrl('');
      setNewAlt('');
    } catch {
      alert('Failed to add image');
    }
  };

  const filtered = media.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.altText.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout activeNav="media">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0f2d3a]">Media Library</h1>
            <p className="text-xs text-slate-500 mt-1">
              Architecture schematics, vector diagrams, and responsive featured images for technical guides.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-700/20 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 text-xs transition-colors"
            >
              Add by URL
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-3">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search images by title or alt text..."
              className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#0f2d3a] placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
            />
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            Loading media...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-white border border-slate-200 shadow-sm rounded-xl">
            <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs">No media assets found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden group flex flex-col justify-between hover:border-teal-300 transition-all"
              >
                <div className="aspect-video relative bg-slate-100 overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.altText}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[#0f2d3a]/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => handleCopy(item.url, item.id)}
                      className="p-2 rounded-lg bg-white text-slate-700 hover:bg-teal-600 hover:text-white transition-colors"
                      title="Copy URL"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                      title="Open full size"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      className="p-2 rounded-lg bg-white text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-xs font-semibold text-[#0f2d3a] truncate" title={item.title}>
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5" title={item.altText}>
                    Alt: {item.altText || 'None'}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>{Math.round(item.size / 1024)} KB</span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add URL Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-[#0f2d3a]/50 backdrop-blur-sm flex items-center justify-center p-4">
            <form
              onSubmit={handleAddCustomUrl}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-xl shadow-teal-900/10"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-[#0f2d3a] text-sm">Add Image by URL</h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-teal-700"
                >
                  ×
                </button>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 mb-1">
                  Image Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. CAPI Pipeline Flowchart"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#0f2d3a] placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#0f2d3a] placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-500 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={newAlt}
                  onChange={(e) => setNewAlt(e.target.value)}
                  placeholder="Descriptive explanation for screen readers and SEO"
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-[#0f2d3a] placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors"
                >
                  Save Image
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};