import React, { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import { Article, TopicHub, MediaItem, Redirect301 } from '../../types';
import {
  FileText,
  FolderTree,
  Image as ImageIcon,
  ArrowUpRight,
  Plus,
  Compass,
  CheckCircle2,
  Clock,
  ExternalLink,
  Repeat2,
  Eye
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { navigate } = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<TopicHub[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [redirects, setRedirects] = useState<Redirect301[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getArticles({ limit: 100 }),
      api.getTopics(),
      api.getMedia(),
      api.getRedirects()
    ]).then(([artRes, topRes, medRes, redRes]) => {
      setArticles(artRes.articles);
      setTopics(topRes);
      setMedia(medRes);
      setRedirects(redRes);
      setLoading(false);
    });
  }, []);

  const publishedCount = articles.filter((a) => a.status === 'published').length;
  const draftCount = articles.filter((a) => a.status === 'draft').length;

  return (
    <AdminLayout activeNav="dashboard">
      <div className="space-y-8">
        {/* Header Greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0f2d3a]">Content Overview</h1>
            <p className="text-xs text-slate-500 mt-1">
              Manage your technical insights, topic hubs, structured redirects, and media assets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/admin/articles/new')}
              className="px-3.5 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm shadow-teal-700/20"
            >
              <Plus className="w-4 h-4" />
              <span>Write Article</span>
            </button>
            <button
              onClick={() => navigate('/insights')}
              className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-teal-700 hover:border-teal-300 text-xs transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-teal-600" />
              <span>Browse Public Library</span>
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => navigate('/admin/articles')}
            className="cursor-pointer p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Published</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-[#0f2d3a] tracking-tight">{publishedCount}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Articles online</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/articles')}
            className="cursor-pointer p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Drafts</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-[#0f2d3a] tracking-tight">{draftCount}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>In preparation</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/categories')}
            className="cursor-pointer p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Topic Hubs</span>
              <FolderTree className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-bold text-[#0f2d3a] tracking-tight">{topics.length}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Direct top-level hubs</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
          </div>

          <div
            onClick={() => navigate('/admin/media')}
            className="cursor-pointer p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-teal-300 transition-all group"
          >
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Media Assets</span>
              <ImageIcon className="w-4 h-4 text-violet-500" />
            </div>
            <div className="text-2xl font-bold text-[#0f2d3a] tracking-tight">{media.length}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
              <span>Images & schematics</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </div>
          </div>
        </div>

        {/* Technical SEO & Sitemap Bar */}
        <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-[#0f2d3a]">Live XML Sitemap & Technical Directives</div>
              <div className="text-slate-500 text-[11px]">
                Search engines automatically crawl published guides at <code className="text-teal-700">/sitemap.xml</code>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-100 text-teal-800 text-xs font-mono transition-colors flex items-center gap-1"
            >
              <span>/sitemap.xml</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-100 text-teal-800 text-xs font-mono transition-colors flex items-center gap-1"
            >
              <span>/robots.txt</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Recent Articles Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0f2d3a]">Recent Articles</h2>
            <button
              onClick={() => navigate('/admin/articles')}
              className="text-xs text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>View all ({articles.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-mono uppercase text-[10px]">
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Topic</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Reading Time</th>
                    <th className="px-4 py-3">Updated</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.slice(0, 5).map((art) => (
                    <tr key={art.id} className="hover:bg-teal-50/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#0f2d3a] max-w-md line-clamp-1">{art.title}</div>
                        <div className="font-mono text-[10px] text-slate-400">
                          /{art.primaryTopicSlug}/{art.slug}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100 font-mono text-[10px]">
                          {art.primaryTopicSlug}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                            art.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {art.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-500">{art.readingTime} min read</td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(art.updatedDate || art.publicationDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/${art.primaryTopicSlug}/${art.slug}`)}
                            className="p-1 text-slate-400 hover:text-teal-700"
                            title="View article"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/articles/${art.id}/edit`)}
                            className="px-2.5 py-1 rounded bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 301 Redirects Card if any exist */}
        {redirects.length > 0 && (
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-medium mb-2">
              <Repeat2 className="w-4 h-4 text-teal-600" />
              <span>Active 301 Redirect Mappings ({redirects.length})</span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-500">
              {redirects.slice(0, 3).map((r) => (
                <div key={r.id} className="flex items-center gap-2">
                  <span className="text-rose-500">{r.oldUrl}</span>
                  <span>→</span>
                  <span className="text-emerald-600">{r.newUrl}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};