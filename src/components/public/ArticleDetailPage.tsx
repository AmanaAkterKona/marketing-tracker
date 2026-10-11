import React, { useEffect, useState } from 'react';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import logo from '../../assets/logo (2).png';
import { Article, TopicHub } from '../../types';
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Share2,
  Check,
  ShieldCheck,
  User,
  MessageSquareCode,
  Tag
} from 'lucide-react';

interface ArticleDetailPageProps {
  topicSlug: string;
  articleSlug: string;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  topicSlug,
  articleSlug
}) => {
  const { navigate } = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [topic, setTopic] = useState<TopicHub | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    api.getArticleBySlug(topicSlug, articleSlug).then((res) => {
      // Check for 301 redirect
      if (res.redirect) {
        navigate(res.redirect);
        return;
      }

      if (res.article) {
        setArticle(res.article);
        setRelatedArticles(res.related || []);

        // Fetch topic info
        api.getTopic(res.article.primaryTopicSlug).then((t) => {
          setTopic(t.topic || null);
        });

        // Set technical SEO tags
        const art = res.article;
        document.title = art.seoTitle || `${art.title} – Bayezid Mir`;

        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', art.metaDescription || art.excerpt);
        }

        // Canonical URL
        const canonicalUrl = art.canonicalUrl || `https://bayezidmir.com/${art.primaryTopicSlug}/${art.slug}`;
        let canonical = document.querySelector("link[rel='canonical']");
        if (!canonical) {
          canonical = document.createElement('link');
          canonical.setAttribute('rel', 'canonical');
          document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', canonicalUrl);

        // Open Graph Meta
        let ogTitle = document.querySelector("meta[property='og:title']");
        if (!ogTitle) {
          ogTitle = document.createElement('meta');
          ogTitle.setAttribute('property', 'og:title');
          document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', art.ogTitle || art.title);

        let ogDesc = document.querySelector("meta[property='og:description']");
        if (!ogDesc) {
          ogDesc = document.createElement('meta');
          ogDesc.setAttribute('property', 'og:description');
          document.head.appendChild(ogDesc);
        }
        ogDesc.setAttribute('content', art.ogDescription || art.excerpt);

        // Inject Article JSON-LD Structured Data
        const articleSchema = {
          '@context': 'https://schema.org',
          '@type': 'TechArticle',
          headline: art.title,
          description: art.excerpt,
          image: art.featuredImage,
          datePublished: art.publicationDate,
          dateModified: art.updatedDate || art.publicationDate,
          author: {
            '@type': 'Person',
            name: art.author.name,
            jobTitle: art.author.title,
            url: 'https://bayezidmir.com/'
          },
          publisher: {
            '@type': 'Person',
            name: 'Bayezid Mir',
            url: 'https://bayezidmir.com/'
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': canonicalUrl
          }
        };

        const existingScript = document.getElementById('article-schema-ld');
        if (existingScript) existingScript.remove();

        const script = document.createElement('script');
        script.id = 'article-schema-ld';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(articleSchema);
        document.head.appendChild(script);

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
              name: art.primaryTopicSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              item: `https://bayezidmir.com/${art.primaryTopicSlug}`
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: art.title,
              item: canonicalUrl
            }
          ]
        };

        const existingBcScript = document.getElementById('breadcrumb-ld');
        if (existingBcScript) existingBcScript.remove();

        const bcScript = document.createElement('script');
        bcScript.id = 'breadcrumb-ld';
        bcScript.type = 'application/ld+json';
        bcScript.text = JSON.stringify(breadcrumbSchema);
        document.head.appendChild(bcScript);
      }
      setLoading(false);
    });
  }, [topicSlug, articleSlug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7fafa] flex items-center justify-center font-mono text-xs text-slate-400">
        Loading technical documentation...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f7fafa] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-[#0f2d3a]">Article Not Found</h1>
        <p className="text-xs text-slate-500 mt-2">
          The requested article at <code>/{topicSlug}/{articleSlug}</code> does not exist or may have been updated.
        </p>
        <button
          onClick={() => navigate('/insights')}
          className="mt-4 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold transition-colors"
        >
          Return to Insights Library
        </button>
      </div>
    );
  }

  const topicName =
    topic?.title ||
    article.primaryTopicSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="min-h-screen bg-[#f7fafa] text-[#0f2d3a] selection:bg-teal-200/60">
      {/* Top Header / Nav */}
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
            <button onClick={() => navigate('/insights')} className="text-teal-700 font-semibold transition-colors">
              Insights
            </button>
            <button onClick={() => navigate('/#contact')} className="hover:text-teal-700 transition-colors">
              Contact
            </button>
            {/* Only visible to a logged-in admin */}
            {api.getToken() && (
              <button
                onClick={() => navigate(`/admin/articles/${article.id}/edit`)}
                className="px-2.5 py-1 rounded-md bg-teal-50 hover:bg-teal-100 text-teal-700 text-[11px] font-mono border border-teal-200 transition-colors"
              >
                Edit in CMS
              </button>
            )}
          </nav>
        </div>
      </header>

      {/* Main Reading Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 space-y-10">
        {/* Breadcrumb Hierarchy */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
          <button onClick={() => navigate('/')} className="hover:text-teal-700 transition-colors">
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <button
            onClick={() => navigate(`/${article.primaryTopicSlug}`)}
            className="hover:text-teal-700 transition-colors text-slate-600"
          >
            {topicName}
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-[#0f2d3a] font-medium truncate max-w-xs sm:max-w-md">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigate(`/${article.primaryTopicSlug}`)}
              className="px-3 py-1 rounded-full bg-teal-50 hover:bg-teal-100 text-teal-700 font-mono text-xs font-medium border border-teal-200/80 transition-colors"
            >
              {topicName}
            </button>
            {article.secondaryTopicSlugs?.map((sec) => (
              <button
                key={sec}
                onClick={() => navigate(`/${sec}`)}
                className="px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-700 font-mono text-[11px] border border-slate-200 transition-colors"
              >
                +{sec.replace(/-/g, ' ')}
              </button>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold tracking-tight text-[#0f2d3a] leading-[1.2]">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
            {article.excerpt}
          </p>

          {/* Author & Meta Bar */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-700 text-white font-mono font-bold flex items-center justify-center text-xs">
                BM
              </div>
              <div>
                <div className="font-semibold text-[#0f2d3a] font-sans text-xs">
                  {article.author.name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {article.author.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600/70" />
                <span>
                  {new Date(article.publicationDate).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>

              <span>•</span>

              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600/70" />
                <span>{article.readingTime} min read</span>
              </div>

              <span>•</span>

              <button
                onClick={handleShare}
                className="p-1.5 rounded-md hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors flex items-center gap-1"
                title="Copy share link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Share'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-100">
            <img
              src={article.featuredImage}
              alt={article.featuredImageAlt || article.title}
              className="w-full h-auto max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Rich Text Article Content */}
        <div
          className="article-prose pt-4"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-400 mr-2 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md bg-white border border-teal-100 text-xs font-mono text-teal-800"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Author Bio Box */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 flex flex-col sm:flex-row items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-700 text-white font-mono font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
            BM
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-[#0f2d3a] text-sm">{article.author.name}</div>
            <div className="text-slate-500 font-mono text-[11px]">{article.author.title}</div>
            <p className="text-slate-600 leading-relaxed pt-1">
              Specializing in full-funnel conversion signal engineering, server-side Google Tag Manager (sGTM) containers, Meta Conversions API (CAPI), and enterprise multi-touch attribution architectures.
            </p>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight text-[#0f2d3a]">
                Related Technical Guides in {topicName}
              </h2>
              <button
                onClick={() => navigate(`/${article.primaryTopicSlug}`)}
                className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
              >
                <span>View all in topic</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedArticles.slice(0, 2).map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigate(`/${rel.primaryTopicSlug}/${rel.slug}`)}
                  className="group cursor-pointer rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                      /{rel.primaryTopicSlug}
                    </span>
                    <h3 className="text-sm font-bold text-[#0f2d3a] group-hover:text-teal-700 transition-colors line-clamp-2">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {rel.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{rel.readingTime}m read</span>
                    <span className="text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact CTA */}
        <div className="rounded-2xl border border-teal-100 bg-white p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="space-y-1.5 max-w-lg">
            <h3 className="text-lg font-bold tracking-tight text-[#0f2d3a]">
              Have questions about this architecture?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Reach out directly to consult on implementing clean event deduplication, server-side proxy containers, or offline conversion pipelines for your business.
            </p>
          </div>

          <button
            onClick={() => navigate('/#contact')}
            className="shrink-0 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-semibold text-xs transition-colors shadow-sm shadow-teal-700/20 flex items-center gap-2"
          >
            <MessageSquareCode className="w-4 h-4 text-teal-100" />
            <span>Contact Bayezid</span>
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
            <button onClick={() => navigate(`/${article.primaryTopicSlug}`)} className="hover:text-teal-700">
              {topicName} Hub
            </button>
            <button onClick={() => navigate('/insights')} className="hover:text-teal-700">
              All Insights
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};