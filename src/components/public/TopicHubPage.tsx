import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import logo from '../../assets/logo (2).png';
import { TopicHub, Article } from '../../types';
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  BookOpen,
  MessageSquareCode,
  FolderGit2
} from 'lucide-react';

// Fallback shown when an article image fails to load (dead/blocked URL)
const FALLBACK_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#e6f4f3"/><stop offset="1" stop-color="#cfe9e7"/>' +
      '</linearGradient></defs>' +
      '<rect width="640" height="400" fill="url(#g)"/>' +
      '<g fill="none" stroke="#0f766e" stroke-width="3" stroke-linecap="round" opacity="0.55">' +
      '<rect x="270" y="150" width="100" height="80" rx="10"/>' +
      '<circle cx="300" cy="180" r="9"/>' +
      '<path d="M276 222l30-26 22 18 16-12 20 20"/></g></svg>'
  );

const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  if (img.dataset.fallback) return;
  img.dataset.fallback = '1';
  img.src = FALLBACK_IMG;
};


interface TopicHubPageProps {
  topicSlug: string;
}

export const TopicHubPage: React.FC<TopicHubPageProps> = ({ topicSlug }) => {
  const { navigate } = useRouter();
  const [topic, setTopic] = useState<TopicHub | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [allTopics, setAllTopics] = useState<TopicHub[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    Promise.all([
      api.getTopic(topicSlug),
      api.getTopics()
    ]).then(([res, tops]) => {
      setTopic(res.topic || null);
      setArticles(res.articles || []);
      setAllTopics(tops);
      setLoading(false);

      if (res.topic) {
        document.title = `${res.topic.title} – Technical Topic Hub | Bayezid Mir`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute(
            'content',
            res.topic.description || res.topic.shortIntro
          );
        }

        // Add canonical link
        let canonical = document.querySelector("link[rel='canonical']");
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', `https://bayezidmir.com/${res.topic.slug}`);

        // Breadcrumb JSON-LD Structured Data
        const breadcrumbSchema = {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://bayezidmir.com/'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: res.topic.title,
              item: `https://bayezidmir.com/${res.topic.slug}`
            }
          ]
        };

        const existingScript = document.getElementById('breadcrumb-ld');
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.id = 'breadcrumb-ld';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(script);
      }
    });
  }, [topicSlug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7fafa] flex items-center justify-center font-mono text-xs text-slate-400">
        Loading topic hub...
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-[#f7fafa] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-[#0f2d3a]">Topic Hub Not Found</h1>
        <p className="text-xs text-slate-500 mt-2">
          The requested topic <code>/{topicSlug}</code> does not exist or has moved.
        </p>
        <button
          onClick={() => navigate('/insights')}
          className="mt-4 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
        >
          View All Insights
        </button>
      </div>
    );
  }

  const featured = articles.filter((a) => a.isFeatured);
  const regular = articles.filter((a) => !a.isFeatured);

  // Cross-linked topics
  const crossLinkedTopics = allTopics.filter(
    (t) => topic.relatedTopics?.includes(t.slug)
  );

  return (
    <div className="min-h-screen bg-[#f7fafa] text-[#0f2d3a] selection:bg-teal-200/60">
      {/* Header Nav */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="group flex items-center gap-1.5 cursor-pointer py-2.5 shrink-0"
          >
            <div className="relative w-9 h-9 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <img
                src={logo}
                alt="BayezidMir Logo"
                className="w-full h-full object-contain drop-shadow-[0_3px_8px_rgba(0,175,185,0.25)]"
              />
              <span className="absolute inset-0 rounded-full bg-[#18C6C7]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </div>
            <span className="ml-0.5 text-xl font-bold tracking-tight text-[#092D36] group-hover:text-[#087E82] transition-colors duration-300">
              Bayezid<span className="text-teal-500">Mir</span>
            </span>
          </button>

          <nav className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <button onClick={() => navigate('/')} className="hover:text-teal-700 transition-colors">
              Overview
            </button>
            <button onClick={() => navigate('/insights')} className="hover:text-teal-700 transition-colors">
              All Insights
            </button>
            <button onClick={() => navigate('/#contact')} className="hover:text-teal-700 transition-colors">
              Contact
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <button onClick={() => navigate('/')} className="hover:text-teal-700 transition-colors">
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button onClick={() => navigate('/insights')} className="hover:text-teal-700 transition-colors">
            Insights
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-[#0f2d3a] font-semibold">{topic.title}</span>
        </nav>

        {/* Topic Hero Block */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-700 text-xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dedicated Topic Hub • /{topic.slug}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#0f2d3a]">
            {topic.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {topic.shortIntro}
          </p>

          {topic.description && (
            <p className="text-sm text-slate-500 leading-relaxed pt-2">
              {topic.description}
            </p>
          )}
        </div>

        {/* Featured Guides in this Topic */}
        {featured.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Core Guides & Architectures</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((art) => (
                <div
                  key={art.id}
                  onClick={() => navigate(`/${art.primaryTopicSlug}/${art.slug}`)}
                  className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm hover:shadow-md hover:shadow-teal-900/5 hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-100 relative">
                      <img
                        src={art.featuredImage}
                        onError={handleImgError}
                        alt={art.featuredImageAlt || art.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-lg font-bold text-[#0f2d3a] group-hover:text-teal-700 transition-colors line-clamp-2">
                        {art.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3 text-teal-600/70" />
                      <span>{new Date(art.publicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <span className="text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Read Blueprint <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Articles Under this Topic Hub */}
        <div className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#0f2d3a]">
                All Articles & Guides in {topic.title}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive technical walkthroughs, deduplication schemas, and integration tutorials.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-400">
              {articles.length} {articles.length === 1 ? 'guide' : 'guides'}
            </span>
          </div>

          {articles.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 text-slate-400 text-xs">
              No published articles under this topic yet. Check back soon or visit our other topic hubs.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((art) => (
                <article
                  key={art.id}
                  onClick={() => navigate(`/${art.primaryTopicSlug}/${art.slug}`)}
                  className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-md hover:shadow-teal-900/5 hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-100 relative">
                      <img
                        src={art.featuredImage}
                        onError={handleImgError}
                        alt={art.featuredImageAlt || art.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
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

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{art.readingTime} min read</span>
                    <span className="text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Related Topics Cross-Linking */}
        {crossLinkedTopics.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <h2 className="text-sm font-mono uppercase tracking-wider text-slate-500">
              Related Topic Hubs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {crossLinkedTopics.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/${rel.slug}`)}
                  className="cursor-pointer p-4 rounded-xl bg-white border border-slate-200/80 hover:border-teal-300 hover:shadow-xs transition-all group"
                >
                  <div className="text-xs font-bold text-[#0f2d3a] group-hover:text-teal-700 transition-colors">
                    {rel.title}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {rel.shortIntro}
                  </p>
                  <div className="mt-3 text-[11px] font-mono text-teal-700 flex items-center gap-1">
                    <span>/{rel.slug}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="rounded-2xl border border-teal-200/70 bg-gradient-to-br from-teal-50/70 via-white to-teal-50/30 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl font-bold tracking-tight text-[#0f2d3a]">
              Need technical assistance with {topic.title.toLowerCase()}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              I audit, architect, and deploy reliable server-side tagging, offline conversions, and attribution pipelines for performance agencies and enterprise brands.
            </p>
          </div>

          <button
            onClick={() => navigate('/#contact')}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors shadow-sm shadow-teal-700/20 flex items-center gap-2"
          >
            <MessageSquareCode className="w-4 h-4 text-teal-100" />
            <span>Consult on {topic.title}</span>
          </button>
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
              All Insights
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