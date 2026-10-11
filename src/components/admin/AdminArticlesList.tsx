import React, { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import { Article, TopicHub } from '../../types';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Check,
  Calendar,
  Clock,
  Tag
} from 'lucide-react';

export const AdminArticlesList: React.FC = () => {
  const { navigate } = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<TopicHub[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchArticles = () => {
    setLoading(true);
    api
      .getArticles({
        topic: selectedTopic || undefined,
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        search: search || undefined,
        limit: 100
      })
      .then((res) => {
        setArticles(res.articles);
        setLoading(false);
      });
  };

  useEffect(() => {
    api.getTopics().then(setTopics);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedTopic, selectedStatus, search]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      return;
    }
    const ok = await api.deleteArticle(id);
    if (ok) {
      setArticles((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const handleCopyLink = (article: Article) => {
    const url = `${window.location.origin}/${article.primaryTopicSlug}/${article.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout activeNav="articles">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#092D36]">Articles Management</h1>
            <p className="text-xs text-[#42636A] mt-1">
              Create, edit, organize topics, and publish technical attribution and measurement guides.
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/articles/new')}
            className="px-3.5 py-2 rounded-xl bg-[#087C82] hover:bg-[#076A70] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_8px_22px_rgba(8,124,130,0.22)]"
          >
            <Plus className="w-4 h-4" />
            <span>Create Article</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-[#0B8F95]/10 shadow-[0_8px_30px_rgba(5,83,88,0.06)] rounded-xl p-3 flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-[#6E8E93] absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, excerpt, or tags..."
              className="w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#365A61] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10 flex-1 md:flex-initial"
            >
              <option value="">All Topics ({topics.length})</option>
              {topics.map((t) => (
                <option key={t.id} value={t.slug}>
                  {t.title}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#365A61] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10"
            >
              <option value="all">All Status</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white border border-[#0B8F95]/10 shadow-[0_8px_30px_rgba(5,83,88,0.06)] rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-[#42636A] font-mono text-xs">
              Loading articles...
            </div>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center text-[#42636A]">
              <p className="text-sm">No articles match your current filter.</p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedTopic('');
                  setSelectedStatus('all');
                }}
                className="mt-2 text-xs text-[#087E82] hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#0B8F95]/10 bg-[#E9FAF9] text-[#42636A] font-mono uppercase text-[10px]">
                    <th className="px-4 py-3">Article</th>
                    <th className="px-4 py-3">Topic & Hierarchy</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Reading Time</th>
                    <th className="px-4 py-3">Published</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B8F95]/10">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-[#F4FBFB] transition-colors">
                      <td className="px-4 py-3 max-w-sm">
                        <div className="font-semibold text-[#092D36] line-clamp-1">{art.title}</div>
                        <div className="text-[11px] text-[#42636A] line-clamp-1 mt-0.5">
                          {art.excerpt}
                        </div>
                        {art.tags && art.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {art.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-1.5 py-0.2 rounded bg-[#E4F7F6] text-[9px] font-mono text-[#087E82]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className="font-mono text-[#087E82] text-[11px] font-medium">
                            /{art.primaryTopicSlug}
                          </span>
                          <span className="font-mono text-[10px] text-[#6E8E93]">
                            /{art.slug}
                          </span>
                          {art.secondaryTopicSlugs && art.secondaryTopicSlugs.length > 0 && (
                            <div className="text-[9px] text-[#42636A]">
                              + {art.secondaryTopicSlugs.join(', ')}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase tracking-wider ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-mono text-[#42636A]">
                        {art.readingTime} min read
                      </td>

                      <td className="px-4 py-3 text-[#42636A]">
                        {new Date(art.publicationDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopyLink(art)}
                            className="p-1.5 rounded hover:bg-[#E9FAF9] text-[#42636A] hover:text-[#087E82] transition-colors"
                            title="Copy canonical link"
                          >
                            {copiedId === art.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          <button
                            onClick={() => navigate(`/${art.primaryTopicSlug}/${art.slug}`)}
                            className="p-1.5 rounded hover:bg-[#E9FAF9] text-[#42636A] hover:text-[#087E82] transition-colors"
                            title="Preview article"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => navigate(`/admin/articles/${art.id}/edit`)}
                            className="p-1.5 rounded hover:bg-[#E9FAF9] text-[#087E82] hover:text-[#076A70] transition-colors"
                            title="Edit article"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(art.id, art.title)}
                            className="p-1.5 rounded hover:bg-rose-50 text-[#6E8E93] hover:text-rose-600 transition-colors"
                            title="Delete article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};