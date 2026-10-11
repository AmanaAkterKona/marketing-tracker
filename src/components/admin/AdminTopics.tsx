import React, { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import { TopicHub, Article } from '../../types';
import { FolderTree, ExternalLink, FileText, ArrowUpRight, Compass } from 'lucide-react';

export const AdminTopics: React.FC = () => {
  const { navigate } = useRouter();
  const [topics, setTopics] = useState<TopicHub[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTopics(), api.getArticles({ limit: 100 })]).then(([topRes, artRes]) => {
      setTopics(topRes);
      setArticles(artRes.articles);
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout activeNav="categories">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[#0f2d3a]">Topic Hubs</h1>
            <p className="text-xs text-slate-500 mt-1">
              Top-level direct URL landing hubs. Each topic aggregates published articles, case studies, and specialized services.
            </p>
          </div>

          <div className="text-xs font-mono text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-lg">
            {topics.length} Configured Topic Hubs
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-mono text-xs">
            Loading topic hubs...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic) => {
              const count = articles.filter(
                (a) =>
                  a.status === 'published' &&
                  (a.primaryTopicSlug === topic.slug || a.secondaryTopicSlugs?.includes(topic.slug))
              ).length;

              return (
                <div
                  key={topic.id}
                  className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 flex flex-col justify-between hover:border-teal-300 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-base font-semibold text-[#0f2d3a] tracking-tight">
                          {topic.title}
                        </h2>
                        <div className="font-mono text-xs text-teal-700 mt-0.5">
                          /{topic.slug}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100 font-mono text-[10px]">
                        {count} {count === 1 ? 'article' : 'articles'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {topic.shortIntro}
                    </p>

                    {topic.relatedTopics && topic.relatedTopics.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400 font-mono self-center mr-1">
                          Cross-links:
                        </span>
                        {topic.relatedTopics.map((rel) => (
                          <span
                            key={rel}
                            className="px-1.5 py-0.2 rounded bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-500"
                          >
                            /{rel}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => navigate(`/${topic.slug}`)}
                      className="text-xs text-teal-700 hover:text-teal-600 font-medium flex items-center gap-1"
                    >
                      <span>View Public Hub Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => navigate(`/admin/articles/new`)}
                      className="text-[11px] text-slate-500 hover:text-teal-700"
                    >
                      + Add guide to this topic
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};