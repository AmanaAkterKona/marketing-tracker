import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import { Article, TopicHub } from '../../types';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  Filter,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

// Logo Image Import (same as Footer)
import logo from '../../assets/logo (2).png';

export const InsightsPage: React.FC = () => {
  const { navigate } = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [topics, setTopics] = useState<TopicHub[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const pageSize = 9;

  useEffect(() => {
    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Inject SEO meta
    document.title = 'Technical Insights & Measurement Library – Bayezid Mir';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'In-depth technical guides, architecture blueprints, and implementation standards for Conversion Tracking, Attribution, Server-Side GTM, and GA4 by Bayezid Mir.'
      );
    }

    Promise.all([
      api.getTopics(),
      api.getArticles({ status: 'published', limit: 100 })
    ]).then(([topRes, artRes]) => {
      setTopics(topRes);
      setArticles(artRes.articles);
      setLoading(false);
    });
  }, []);

  // Filtered articles
  const filteredArticles = articles.filter((art) => {
    const matchesTopic =
      selectedTopic === 'all' ||
      art.primaryTopicSlug === selectedTopic ||
      art.secondaryTopicSlugs?.includes(selectedTopic);

    const matchesSearch =
      !search ||
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      art.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    return matchesTopic && matchesSearch;
  });

  const featuredArticles = articles.filter((a) => a.isFeatured).slice(0, 2);
  const paginatedArticles = filteredArticles.slice(0, page * pageSize);
  const hasMore = paginatedArticles.length < filteredArticles.length;

  return (
    <div className="min-h-screen bg-[#f7fafa] text-[#0f2d3a] selection:bg-teal-200/60">
      {/* Top Header / Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div
            onClick={() => navigate('/')}
            className="group cursor-pointer flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#0f2d3a] transition-transform duration-300 active:scale-95"
          >
            {/* Same logo as Footer */}
            <div className="w-9 h-9 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
              <img
                src={logo}
                alt="BayezidMir Logo"
                className="w-full h-full object-contain brightness-110 contrast-105 filter drop-shadow-[0_2px_10px_rgba(38,199,196,0.25)]"
              />
            </div>

            <span className="group-hover:text-teal-700 transition-colors duration-300 ml-0.5">
              Bayezid<span className="text-teal-600">Mir</span>
            </span>
          </div>

          <nav className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <button
              onClick={() => navigate('/')}
              className="hover:text-teal-700 transition-colors hidden sm:block"
            >
              Overview
            </button>
            <button
              onClick={() => navigate('/insights')}
              className="text-teal-700 font-semibold transition-colors"
            >
              Insights
            </button>
            <button
              onClick={() => navigate('/#contact')}
              className="hover:text-teal-700 transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
        {/* Hero Section */}
        <div className="max-w-3xl space-y-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <button onClick={() => navigate('/')} className="hover:text-teal-700 transition-colors">
              Home
            </button>
            <span>/</span>
            <span className="text-teal-700 font-medium">Insights</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f2d3a]">
            Insights & Technical Documentation
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            The central engineering library for marketing measurement, attribution modeling, server-side tracking, and enterprise analytics architectures.
          </p>
        </div>

        {/* Featured Guides Spotlight (when no search active) */}
        {!search && selectedTopic === 'all' && featuredArticles.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Featured Architecture Guides</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => navigate(`/${art.primaryTopicSlug}/${art.slug}`)}
                  className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-6 shadow-[0_2px_12px_-2px_rgba(15,118,110,0.06)] hover:shadow-lg hover:shadow-teal-900/5 hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 relative">
                      <img
                        src={art.featuredImage}
                        alt={art.featuredImageAlt || art.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-mono font-medium text-teal-700 border border-teal-100 shadow-xs">
                          {art.primaryTopicSlug.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-lg sm:text-xl font-bold text-[#0f2d3a] group-hover:text-teal-700 transition-colors line-clamp-2">
                        {art.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <div className="flex items-center gap-3">
                      <span>{new Date(art.publicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span>{art.readingTime} min read</span>
                    </div>
                    <span className="text-teal-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-semibold">
                      Read Guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filter and Search Bar */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search articles by keyword, protocol, or tag..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-[#0f2d3a] placeholder:text-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 shadow-2xs"
              />
            </div>

            <div className="text-xs font-mono text-slate-500 self-center">
              Showing {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
            </div>
          </div>

          {/* Topic Filters Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              onClick={() => {
                setSelectedTopic('all');
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedTopic === 'all'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50'
              }`}
            >
              All Topics
            </button>

            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTopic(t.slug);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedTopic === t.slug
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="py-24 text-center text-slate-400 font-mono text-xs">
            Loading technical guides...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 p-8 space-y-3">
            <BookOpen className="w-8 h-8 text-teal-600/60 mx-auto" />
            <h3 className="text-sm font-semibold text-[#0f2d3a]">No matching articles found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or clearing the topic filter.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedTopic('all');
              }}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((art) => (
              <article
                key={art.id}
                onClick={() => navigate(`/${art.primaryTopicSlug}/${art.slug}`)}
                className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_2px_10px_-2px_rgba(15,118,110,0.06)] hover:shadow-md hover:shadow-teal-900/5 hover:border-teal-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={art.featuredImage}
                      alt={art.featuredImageAlt || art.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[10px] font-mono font-medium text-teal-800 border border-teal-100">
                        {art.primaryTopicSlug.replace(/-/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-[#0f2d3a] group-hover:text-teal-700 transition-colors line-clamp-2">
                      {art.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  {art.tags && art.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {art.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.2 rounded bg-teal-50 text-[10px] font-mono text-teal-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-teal-600/70" />
                    <span>{new Date(art.publicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>{art.readingTime}m read</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center pt-6">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="px-6 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-700 text-xs font-semibold shadow-xs transition-colors"
            >
              Load More Articles
            </button>
          </div>
        )}

        {/* Topic Hubs Direct Links Directory */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="max-w-2xl mb-6">
            <h2 className="text-xl font-bold tracking-tight text-[#0f2d3a]">
              Browse Dedicated Topic Hubs
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Top-level knowledge hubs consolidating specialized tracking methodologies, case studies, and engineering blueprints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {topics.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/${t.slug}`)}
                className="cursor-pointer p-4 rounded-xl bg-white border border-slate-200/80 hover:border-teal-300 hover:shadow-xs transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-bold text-[#0f2d3a] group-hover:text-teal-700 transition-colors">
                    {t.title}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">/{t.slug}</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-transform" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Bayezid Mir. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="hover:text-teal-700">
              Home
            </button>
            <button onClick={() => navigate('/insights')} className="hover:text-teal-700">
              Insights
            </button>
            <a href="/sitemap.xml" target="_blank" className="hover:text-teal-700">
              Sitemap
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};