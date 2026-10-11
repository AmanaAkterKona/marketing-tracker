import React, { useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { useRouter } from '../../context/RouterContext';
import { api } from '../../lib/api';
import { TipTapEditor } from './TipTapEditor';
import { Article, TopicHub, MediaItem } from '../../types';
import {
  Save,
  Globe,
  ArrowLeft,
  Eye,
  Trash2,
  Sparkles,
  Link as LinkIcon,
  HelpCircle,
  FileCode,
  AlertCircle,
  Image as ImageIcon,
  Check
} from 'lucide-react';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export const AdminArticleEditor: React.FC<{ articleId?: string }> = ({ articleId }) => {
  const { navigate } = useRouter();
  const [topics, setTopics] = useState<TopicHub[]>([]);
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaCallback, setMediaCallback] = useState<((url: string, alt?: string) => void) | null>(null);

  const [loading, setLoading] = useState(Boolean(articleId));
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [originalSlug, setOriginalSlug] = useState('');
  const [primaryTopicSlug, setPrimaryTopicSlug] = useState('conversion-tracking');
  const [originalPrimaryTopic, setOriginalPrimaryTopic] = useState('conversion-tracking');
  const [secondaryTopicSlugs, setSecondaryTopicSlugs] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState(
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
  );
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [contentHtml, setContentHtml] = useState('<p>Start writing your technical guide here...</p>');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [readingTime, setReadingTime] = useState(5);
  const [authorName, setAuthorName] = useState('Bayezid Mir');
  const [authorTitle, setAuthorTitle] = useState('Marketing Measurement & Attribution Specialist');
  
  // SEO fields
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');

  // Internal Link Assistant state
  const [showLinkHelper, setShowLinkHelper] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getTopics(),
      api.getArticles({ limit: 100 }),
      api.getMedia()
    ]).then(([topRes, artRes, medRes]) => {
      setTopics(topRes);
      setAllArticles(artRes.articles);
      setMediaList(medRes);
    });

    if (articleId) {
      api.getArticleById(articleId).then((art) => {
        if (art) {
          setTitle(art.title);
          setSlug(art.slug);
          setOriginalSlug(art.slug);
          setPrimaryTopicSlug(art.primaryTopicSlug);
          setOriginalPrimaryTopic(art.primaryTopicSlug);
          setSecondaryTopicSlugs(art.secondaryTopicSlugs || []);
          setTags(art.tags || []);
          setExcerpt(art.excerpt || '');
          setFeaturedImage(art.featuredImage || '');
          setFeaturedImageAlt(art.featuredImageAlt || '');
          setContentHtml(art.contentHtml || '');
          setStatus(art.status);
          setIsFeatured(Boolean(art.isFeatured));
          setReadingTime(art.readingTime || 5);
          setAuthorName(art.author?.name || 'Bayezid Mir');
          setAuthorTitle(art.author?.title || 'Marketing Measurement & Attribution Specialist');
          setSeoTitle(art.seoTitle || '');
          setMetaDescription(art.metaDescription || '');
          setCanonicalUrl(art.canonicalUrl || '');
          setOgTitle(art.ogTitle || '');
          setOgDescription(art.ogDescription || '');
          setOgImage(art.ogImage || '');
        }
        setLoading(false);
      });
    }
  }, [articleId]);

  // Auto-generate slug if new article
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!articleId && (!slug || slug === slugify(title))) {
      setSlug(slugify(val));
    }
  };

  // Recalculate reading time when content changes
  const handleContentChange = (html: string) => {
    setContentHtml(html);
    const clean = html.replace(/<[^>]*>/g, ' ');
    const words = clean.trim().split(/\s+/).filter(Boolean).length;
    const calc = Math.max(1, Math.ceil(words / 200));
    setReadingTime(calc);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const toggleSecondaryTopic = (topicSlug: string) => {
    if (secondaryTopicSlugs.includes(topicSlug)) {
      setSecondaryTopicSlugs(secondaryTopicSlugs.filter((s) => s !== topicSlug));
    } else {
      setSecondaryTopicSlugs([...secondaryTopicSlugs, topicSlug]);
    }
  };

  const handleSave = async (forceStatus?: 'draft' | 'published') => {
    setError('');
    setSaving(true);
    setSaveSuccess(false);

    try {
      const finalStatus = forceStatus || status;
      const cleanSlug = slug ? slugify(slug) : slugify(title);

      const payload: Partial<Article> = {
        title,
        slug: cleanSlug,
        primaryTopicSlug,
        secondaryTopicSlugs,
        tags,
        excerpt,
        featuredImage,
        featuredImageAlt,
        contentHtml,
        status: finalStatus,
        isFeatured,
        readingTime,
        author: {
          name: authorName,
          title: authorTitle
        },
        seoTitle: seoTitle || `${title} – Bayezid Mir`,
        metaDescription: metaDescription || excerpt,
        canonicalUrl: canonicalUrl || `https://bayezidmir.com/${primaryTopicSlug}/${cleanSlug}`,
        ogTitle: ogTitle || title,
        ogDescription: ogDescription || excerpt,
        ogImage: ogImage || featuredImage
      };

      const saved = await api.saveArticle(payload, articleId);
      setSaving(false);
      setSaveSuccess(true);
      setStatus(finalStatus);
      setTimeout(() => setSaveSuccess(false), 3000);

      if (!articleId) {
        // Navigate to edit URL
        navigate(`/admin/articles/${saved.id}/edit`);
      }
    } catch (err: any) {
      setSaving(false);
      setError(err.message || 'Failed to save article');
    }
  };

  const handleDelete = async () => {
    if (!articleId) return;
    if (!confirm('Are you sure you want to delete this article?')) return;
    const ok = await api.deleteArticle(articleId);
    if (ok) {
      navigate('/admin/articles');
    }
  };

  const isSlugChanged =
    articleId &&
    status === 'published' &&
    (slug !== originalSlug || primaryTopicSlug !== originalPrimaryTopic);

  if (loading) {
    return (
      <AdminLayout activeNav="articles">
        <div className="p-12 text-center text-[#42636A] font-mono text-xs">
          Loading article editor...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeNav="articles">
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin/articles')}
              className="p-2 rounded-lg bg-white border border-[#0B8F95]/15 text-[#42636A] hover:text-[#087E82] hover:bg-[#E9FAF9] transition-colors"
              title="Back to Articles"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#092D36]">
                {articleId ? 'Edit Article' : 'Create Technical Guide'}
              </h1>
              <p className="text-xs text-[#42636A] font-mono mt-0.5">
                Canonical: /{primaryTopicSlug}/{slug || 'your-slug'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {articleId && (
              <>
                <button
                  type="button"
                  onClick={() => navigate(`/${primaryTopicSlug}/${slug}`)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-[#0B8F95]/15 text-[#365A61] hover:text-[#087E82] hover:bg-[#E9FAF9] text-xs transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1.5 rounded-lg bg-white border border-[#0B8F95]/15 text-[#6E8E93] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Delete article"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="px-3.5 py-1.5 rounded-lg bg-[#E9FAF9] hover:bg-[#D8F4F2] border border-[#0B8F95]/10 text-[#087E82] text-xs font-medium transition-colors"
            >
              Save Draft
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('published')}
              className="px-4 py-1.5 rounded-lg bg-[#087C82] hover:bg-[#076A70] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-[0_8px_22px_rgba(8,124,130,0.22)]"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{status === 'published' ? 'Update & Publish' : 'Publish'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        {isSlugChanged && (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-900">
                Automatic 301 Redirect Notice
              </div>
              <div className="text-[11px] text-amber-800/90 mt-0.5">
                Modifying the published URL from <code className="text-amber-900 font-semibold">/{originalPrimaryTopic}/{originalSlug}</code> to{' '}
                <code className="text-amber-900 font-semibold">/{primaryTopicSlug}/{slug}</code> will automatically register an internal 301 redirect to prevent broken links and preserve SEO authority.
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Form Left, Metadata & SEO Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Column (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title & Slug */}
            <div className="bg-white border border-[#0B8F95]/10 shadow-[0_8px_30px_rgba(5,83,88,0.06)] rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#42636A] mb-1.5">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g., Meta CAPI Event Deduplication: Browser & Server Architecture"
                  className="w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-3.5 py-2 text-base font-semibold text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#42636A]">
                    URL Slug *
                  </label>
                  <button
                    type="button"
                    onClick={() => setSlug(slugify(title))}
                    className="text-[10px] font-mono text-[#087E82] hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-generate from title</span>
                  </button>
                </div>
                <div className="flex items-center bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-3 py-2 text-xs font-mono">
                  <span className="text-[#6E8E93]">/{primaryTopicSlug}/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="article-slug"
                    className="flex-1 bg-transparent text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none pl-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#42636A] mb-1.5">
                  Short Excerpt / Summary *
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise, technical summary displayed on article cards, search results, and meta descriptions..."
                  className="w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-3 py-2 text-xs text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10 leading-relaxed"
                />
              </div>
            </div>

            {/* TipTap Rich Text Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-[#42636A]">
                  Article Body (TipTap Rich Text)
                </label>
                <button
                  type="button"
                  onClick={() => setShowLinkHelper(!showLinkHelper)}
                  className="text-xs text-[#087E82] hover:underline flex items-center gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  <span>{showLinkHelper ? 'Hide Internal Links' : 'Internal Linking Assistant'}</span>
                </button>
              </div>

              {/* Internal Linking Assistant drawer */}
              {showLinkHelper && (
                <div className="p-3 bg-[#E9FAF9] border border-[#0B8F95]/10 rounded-xl text-xs space-y-2">
                  <div className="font-semibold text-[#092D36]">
                    Quick Copy Internal Links for Topic Authority:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <div className="text-[#6E8E93] mb-1">Topic Hubs:</div>
                      {topics.slice(0, 5).map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            navigator.clipboard.writeText(`/${t.slug}`);
                            alert(`Copied: /${t.slug}`);
                          }}
                          className="cursor-pointer text-[#087E82] hover:underline py-0.5 truncate"
                        >
                          /{t.slug}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="text-[#6E8E93] mb-1">Related Articles:</div>
                      {allArticles.slice(0, 5).map((a) => (
                        <div
                          key={a.id}
                          onClick={() => {
                            navigator.clipboard.writeText(`/${a.primaryTopicSlug}/${a.slug}`);
                            alert(`Copied: /${a.primaryTopicSlug}/${a.slug}`);
                          }}
                          className="cursor-pointer text-[#365A61] hover:text-[#087E82] py-0.5 truncate"
                        >
                          /{a.slug}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <TipTapEditor
                content={contentHtml}
                onChange={handleContentChange}
                onOpenMediaPicker={(cb) => {
                  setMediaCallback(() => cb);
                  setShowMediaModal(true);
                }}
              />
            </div>
          </div>

          {/* Settings & SEO Sidebar (1 col) */}
          <div className="space-y-5 text-xs">
            {/* Topic Relationships */}
            <div className="bg-white border border-[#0B8F95]/10 shadow-[0_8px_30px_rgba(5,83,88,0.06)] rounded-xl p-4 space-y-3.5">
              <h2 className="text-sm font-semibold text-[#092D36]">Topic Relationships</h2>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#42636A] mb-1">
                  Primary Topic * (Canonical URL)
                </label>
                <select
                  value={primaryTopicSlug}
                  onChange={(e) => setPrimaryTopicSlug(e.target.value)}
                  className="w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-2.5 py-2 text-xs text-[#092D36] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10"
                >
                  {topics.map((t) => (
                    <option key={t.id} value={t.slug}>
                      {t.title} (/{t.slug})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#6E8E93] mt-1">
                  Determines the permanent canonical path: <code>/{primaryTopicSlug}/{slug || '...'}</code>
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#42636A] mb-1.5">
                  Secondary Topics (Cross-Hub Inclusion)
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {topics
                    .filter((t) => t.slug !== primaryTopicSlug)
                    .map((t) => (
                      <label
                        key={t.id}
                        className="flex items-center gap-2 cursor-pointer text-[#365A61] hover:text-[#087E82]"
                      >
                        <input
                          type="checkbox"
                          checked={secondaryTopicSlugs.includes(t.slug)}
                          onChange={() => toggleSecondaryTopic(t.slug)}
                          className="rounded border-[#0B8F95]/30 bg-white text-[#087C82] focus:ring-0"
                        />
                        <span>{t.title}</span>
                      </label>
                    ))}
                </div>
                <p className="text-[10px] text-[#6E8E93] mt-1">
                  Allows this article to appear on secondary topic hubs without duplicating URLs.
                </p>
              </div>

              {/* Tags */}
              <div className="pt-2 border-t border-[#0B8F95]/10">
                <label className="block text-xs font-mono uppercase tracking-wider text-[#42636A] mb-1.5">
                  Tags & Taxonomy
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="e.g. Meta CAPI, Event ID..."
                    className="flex-1 bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-2.5 py-1.5 rounded-lg bg-[#E9FAF9] hover:bg-[#D8F4F2] border border-[#0B8F95]/10 text-[#087E82] font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-[#E4F7F6] text-[#087E82] text-[11px] font-mono flex items-center gap-1"
                    >
                      <span>#{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-[#6E8E93] hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Publishing & Metrics */}
            <div className="bg-white border border-[#0B8F95]/10 shadow-[0_8px_30px_rgba(5,83,88,0.06)] rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-semibold text-[#092D36]">Publishing Status</h2>

              <div className="flex items-center justify-between">
                <span className="text-[#42636A]">Current Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full font-mono text-[10px] uppercase font-medium ${
                    status === 'published'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#42636A]">Reading Time:</span>
                <span className="font-mono text-[#092D36]">{readingTime} min (auto-calculated)</span>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2 border-t border-[#0B8F95]/10 text-[#365A61]">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded border-[#0B8F95]/30 bg-white text-[#087C82] focus:ring-0"
                />
                <span>Feature in Insights hero spotlight</span>
              </label>
            </div>

            {/* Featured Image */}
            <div className="bg-white border border-[#0B8F95]/10 shadow-[0_8px_30px_rgba(5,83,88,0.06)] rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-[#092D36]">Featured Image</h2>
                <button
                  type="button"
                  onClick={() => {
                    setMediaCallback(() => (url: string, alt?: string) => {
                      setFeaturedImage(url);
                      if (alt) setFeaturedImageAlt(alt);
                    });
                    setShowMediaModal(true);
                  }}
                  className="text-[#087E82] hover:underline text-[11px]"
                >
                  Choose Media
                </button>
              </div>

              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10"
              />

              <input
                type="text"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
                placeholder="Descriptive image alt text for accessibility..."
                className="w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10"
              />

              {featuredImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden border border-[#0B8F95]/15 bg-[#F4FBFB]">
                  <img
                    src={featuredImage}
                    alt={featuredImageAlt || title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Technical SEO Controls */}
            <div className="bg-white border border-[#0B8F95]/10 shadow-[0_8px_30px_rgba(5,83,88,0.06)] rounded-xl p-4 space-y-3">
              <h2 className="text-sm font-semibold text-[#092D36]">SEO & Social Meta</h2>

              <div>
                <label className="block text-[10px] font-mono text-[#42636A] mb-1">
                  SEO Title (max 60 chars)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder={`${title || 'Article Title'} – Bayezid Mir`}
                  className="w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#42636A] mb-1">
                  Meta Description (max 160 chars)
                </label>
                <textarea
                  rows={2}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder={excerpt || 'Meta description for Google search snippet...'}
                  className="w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#42636A] mb-1">
                  Canonical URL Override
                </label>
                <input
                  type="url"
                  value={canonicalUrl}
                  onChange={(e) => setCanonicalUrl(e.target.value)}
                  placeholder={`https://bayezidmir.com/${primaryTopicSlug}/${slug || '...'}`}
                  className="w-full bg-[#F4FBFB] border border-[#0B8F95]/15 rounded-lg px-2.5 py-1.5 text-xs text-[#092D36] placeholder:text-[#91AEB1] focus:outline-none focus:border-[#087C82] focus:ring-2 focus:ring-[#087C82]/10 font-mono text-[11px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 bg-[#092D36]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#0B8F95]/10 shadow-[0_20px_55px_rgba(5,83,88,0.14)] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[#0B8F95]/10 flex items-center justify-between">
              <h3 className="font-semibold text-[#092D36] text-sm">Select Image from Media Library</h3>
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="text-[#42636A] hover:text-[#087E82]"
              >
                ×
              </button>
            </div>

            <div className="p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-3">
              {mediaList.map((m) => (
                <div
                  key={m.id}
                  onClick={() => {
                    if (mediaCallback) mediaCallback(m.url, m.altText);
                    setShowMediaModal(false);
                  }}
                  className="group cursor-pointer rounded-xl border border-[#0B8F95]/15 overflow-hidden bg-[#F4FBFB] hover:border-[#087C82] transition-colors"
                >
                  <div className="aspect-video relative overflow-hidden bg-[#E9FAF9]">
                    <img src={m.url} alt={m.altText} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 text-[11px] truncate text-[#365A61] group-hover:text-[#087E82]">
                    {m.title}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-[#0B8F95]/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowMediaModal(false)}
                className="px-3 py-1.5 rounded-lg bg-[#E9FAF9] hover:bg-[#D8F4F2] text-[#087E82] text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};