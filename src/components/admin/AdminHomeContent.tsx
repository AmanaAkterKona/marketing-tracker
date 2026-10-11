import React, { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import { ExpertiseItem, CaseStudyItem } from '../../types';
import { ICON_OPTIONS, ICON_KEYS, resolveIcon } from '../../lib/icons';
import { Activity, Users, Mail, Server, BarChart3, Database, Globe2, Layers } from 'lucide-react';
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  X,
  ExternalLink,
  Check
} from 'lucide-react';

type Kind = 'expertise' | 'project';
type Item = ExpertiseItem | CaseStudyItem;

const DEFAULT_ICONS: Record<Kind, any[]> = {
  expertise: [Activity, Users, Mail, Server, BarChart3, Database],
  project: [BarChart3, Globe2, Layers]
};

const TEXT: Record<Kind, { title: string; subtitle: string; add: string; empty: string; noun: string }> = {
  expertise: {
    title: 'Expertise',
    subtitle: 'Cards shown in the "What I specialize in" section of the home page.',
    add: 'Add Expertise',
    empty: 'No expertise added yet.',
    noun: 'expertise'
  },
  project: {
    title: 'Projects',
    subtitle:
      'Projects for the "Selected work" section. Featured projects show on the home page; every project appears on the "View all projects" page.',
    add: 'Add Project',
    empty: 'No projects added yet.',
    noun: 'project'
  }
};

interface FormState {
  title: string;
  description: string;
  icon: string;
  tags: string[];
  scope: string;
  futureSlug: string;
  featured: boolean;
}

const emptyForm: FormState = {
  title: '',
  description: '',
  icon: '',
  tags: [],
  scope: '',
  futureSlug: '',
  featured: true
};

const inputCls =
  'w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-3 py-2 text-xs text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10';
const labelCls = 'block text-xs font-mono uppercase tracking-wider text-[#42636A] mb-1.5';

const HomeContentManager: React.FC<{ kind: Kind }> = ({ kind }) => {
  const { navigate } = useRouter();
  const text = TEXT[kind];
  const isProject = kind === 'project';

  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Form modal
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () =>
    (isProject ? api.getProjects() : api.getExpertise()).then((list) => {
      setItems(list);
      setLoading(false);
    });

  useEffect(() => {
    setLoading(true);
    load();
  }, [kind]);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setTagInput('');
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (item: Item) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      icon: item.icon || '',
      tags: item.tags || [],
      scope: (item as CaseStudyItem).scope || '',
      futureSlug: item.futureSlug || '',
      featured: (item as CaseStudyItem).featured !== false
    });
    setTagInput('');
    setFormError('');
    setFormOpen(true);
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) setForm({ ...form, tags: [...form.tags, t] });
    setTagInput('');
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      setFormError('Title and description are required.');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      if (isProject) {
        await api.saveProject(
          {
            title: form.title.trim(),
            description: form.description.trim(),
            tags: form.tags,
            scope: form.scope.trim(),
            futureSlug: form.futureSlug.trim() || undefined,
            icon: form.icon || undefined,
            featured: form.featured
          },
          editingId || undefined
        );
      } else {
        await api.saveExpertise(
          {
            title: form.title.trim(),
            description: form.description.trim(),
            futureSlug: form.futureSlug.trim() || undefined,
            icon: form.icon || undefined
          },
          editingId || undefined
        );
      }
      setFormOpen(false);
      await load();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Item) => {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return;
    const ok = await (isProject ? api.deleteProject(item.id) : api.deleteExpertise(item.id));
    if (ok) setItems((prev) => prev.filter((i) => i.id !== item.id));
    else setError('Failed to delete. Please try again.');
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    const ids = next.map((i) => i.id);
    const ok = await (isProject ? api.reorderProjects(ids) : api.reorderExpertise(ids));
    if (!ok) {
      setError('Failed to save the new order.');
      load();
    }
  };

  const toggleFeatured = async (item: CaseStudyItem) => {
    const featured = item.featured === false;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, featured } : i)));
    try {
      await api.saveProject({ featured }, item.id);
    } catch {
      setError('Failed to update featured status.');
      load();
    }
  };

  const featuredCount = isProject ? (items as CaseStudyItem[]).filter((p) => p.featured !== false).length : 0;

  return (
    <AdminLayout activeNav={isProject ? 'projects' : 'expertise'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#092D36]">{text.title}</h1>
            <p className="text-xs text-[#42636A] mt-1 max-w-2xl">{text.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(isProject ? '/projects' : '/#expertise')}
              className="px-3 py-2 rounded-xl bg-white border border-[#0B8F95]/15 text-[#365A61] hover:text-[#087E82] hover:bg-[#E9FAF9] text-xs transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{isProject ? 'View all projects page' : 'View on home page'}</span>
            </button>
            <button
              onClick={openAdd}
              className="px-3.5 py-2 rounded-xl bg-[#087C82] hover:bg-[#076A70] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_8px_22px_rgba(8,124,130,0.22)]"
            >
              <Plus className="w-4 h-4" />
              <span>{text.add}</span>
            </button>
          </div>
        </div>

        {isProject && items.length > 0 && featuredCount === 0 && (
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
            No project is featured, so the home page shows the first 3 projects. Click the star on a project to feature it.
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-rose-500 hover:text-rose-700">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* List */}
        <div className="bg-white border border-[#0B8F95]/10 shadow-[0_8px_30px_rgba(5,83,88,0.06)] rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#42636A] font-mono text-xs">Loading...</div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-[#42636A]">
              <p className="text-sm">{text.empty}</p>
              <button onClick={openAdd} className="mt-2 text-xs text-[#087E82] hover:underline">
                {text.add}
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#0B8F95]/10">
              {items.map((item, index) => {
                const Icon = resolveIcon(item.icon, index, DEFAULT_ICONS[kind]);
                const featured = isProject && (item as CaseStudyItem).featured !== false;
                return (
                  <li key={item.id} className="p-4 flex items-start gap-4 hover:bg-[#F4FBFB] transition-colors">
                    <div className="w-10 h-10 shrink-0 rounded-full bg-[#E4F7F6] border border-[#0B8F95]/15 flex items-center justify-center text-[#087E82]">
                      <Icon className="w-[18px] h-[18px]" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[10px] text-[#6E8E93]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h2 className="text-sm font-semibold text-[#092D36]">{item.title}</h2>
                        {isProject && featured && (
                          <span className="px-1.5 py-0.5 rounded bg-[#E4F7F6] text-[#087E82] font-mono text-[9px] uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#42636A] mt-1 line-clamp-2">{item.description}</p>
                      {isProject && item.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((tag) => (
                            <span key={tag} className="px-1.5 py-0.5 rounded bg-[#E4F7F6] text-[10px] font-mono text-[#087E82]">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        className="p-1.5 rounded text-[#42636A] hover:text-[#087E82] hover:bg-[#E9FAF9] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Move up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        className="p-1.5 rounded text-[#42636A] hover:text-[#087E82] hover:bg-[#E9FAF9] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                        title="Move down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      {isProject && (
                        <button
                          onClick={() => toggleFeatured(item as CaseStudyItem)}
                          className={`p-1.5 rounded hover:bg-amber-50 transition-colors ${
                            featured ? 'text-amber-500' : 'text-[#91AEB1] hover:text-amber-500'
                          }`}
                          title={featured ? 'Featured on home page (click to remove)' : 'Feature on home page'}
                        >
                          <Star className="w-3.5 h-3.5" fill={featured ? 'currentColor' : 'none'} />
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(item)}
                        className="p-1.5 rounded text-[#087E82] hover:bg-[#E9FAF9] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="p-1.5 rounded text-[#6E8E93] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-[#092D36]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#0B8F95]/10 shadow-[0_20px_55px_rgba(5,83,88,0.14)] rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#0B8F95]/10 flex items-center justify-between">
              <h3 className="font-semibold text-[#092D36] text-sm">
                {editingId ? `Edit ${text.noun}` : text.add}
              </h3>
              <button onClick={() => setFormOpen(false)} className="text-[#42636A] hover:text-[#087E82]">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className={labelCls}>Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder={isProject ? 'e.g., Meta CAPI & Server-Side Tracking' : 'e.g., Conversion Tracking'}
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>Description *</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short text shown on the card..."
                  className={inputCls + ' leading-relaxed'}
                />
              </div>

              {isProject && (
                <>
                  <div>
                    <label className={labelCls}>Tags</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                        placeholder="e.g. Meta CAPI (press Enter)"
                        className={inputCls}
                      />
                      <button
                        type="button"
                        onClick={addTag}
                        className="px-3 py-2 rounded-lg bg-[#E9FAF9] hover:bg-[#D8F4F2] border border-[#0B8F95]/10 text-[#087E82] text-xs font-medium"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded bg-[#E4F7F6] text-[#087E82] text-[11px] font-mono flex items-center gap-1"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, tags: form.tags.filter((t) => t !== tag) })}
                            className="text-[#6E8E93] hover:text-rose-600"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Technical scope (shown in the case study popup)</label>
                    <textarea
                      rows={2}
                      value={form.scope}
                      onChange={(e) => setForm({ ...form, scope: e.target.value })}
                      placeholder="e.g., Server-side deployment, event deduplication, and cookie preservation"
                      className={inputCls + ' leading-relaxed'}
                    />
                  </div>
                </>
              )}

              {!isProject && (
                <div>
                  <label className={labelCls}>Planned page URL (shown in the popup, optional)</label>
                  <input
                    type="text"
                    value={form.futureSlug}
                    onChange={(e) => setForm({ ...form, futureSlug: e.target.value })}
                    placeholder="/google-ads-conversion-tracking"
                    className={inputCls + ' font-mono'}
                  />
                </div>
              )}

              <div>
                <label className={labelCls}>Icon</label>
                <div className="grid grid-cols-8 gap-1.5">
                  {ICON_KEYS.map((key) => {
                    const Icon = ICON_OPTIONS[key];
                    const active = form.icon === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        title={key}
                        onClick={() => setForm({ ...form, icon: active ? '' : key })}
                        className={`h-9 rounded-lg border flex items-center justify-center transition-colors ${
                          active
                            ? 'bg-[#087C82] border-[#087C82] text-white'
                            : 'bg-[#F4FBFB] border-[#0B8F95]/15 text-[#087E82] hover:bg-[#E9FAF9]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-[#6E8E93] mt-1">Click again to unselect (a default icon is used).</p>
              </div>

              {isProject && (
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#365A61]">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="rounded border-[#0B8F95]/30 bg-white text-[#087C82] focus:ring-0"
                  />
                  <span>Show on the home page (Selected work)</span>
                </label>
              )}
            </div>

            <div className="p-3 border-t border-[#0B8F95]/10 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-[#E9FAF9] hover:bg-[#D8F4F2] text-[#087E82] text-xs font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-[#087C82] hover:bg-[#076A70] disabled:opacity-60 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : editingId ? 'Save changes' : text.add}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export const AdminExpertise: React.FC = () => <HomeContentManager kind="expertise" />;
export const AdminProjects: React.FC = () => <HomeContentManager kind="project" />;