import fs from 'fs';
import path from 'path';
import { Article, TopicHub, MediaItem, Redirect301, ExpertiseItem, CaseStudyItem } from '../types';
import { INITIAL_TOPICS, INITIAL_ARTICLES, INITIAL_MEDIA, INITIAL_REDIRECTS } from '../data/initialData';
import { EXPERTISE_ITEMS, SELECTED_WORK } from '../data';

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export interface DataStore {
  topics: TopicHub[];
  articles: Article[];
  media: MediaItem[];
  redirects: Redirect301[];
  expertise: ExpertiseItem[];
  projects: CaseStudyItem[];
  adminTokens: string[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'content_store.json');

function ensureDataFile(): DataStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      const initial: DataStore = {
        topics: INITIAL_TOPICS,
        articles: INITIAL_ARTICLES,
        media: INITIAL_MEDIA,
        redirects: INITIAL_REDIRECTS,
        expertise: clone(EXPERTISE_ITEMS),
        projects: clone(SELECTED_WORK),
        adminTokens: ['token_demo_admin_session_key']
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Ensure all collections exist
    if (!parsed.topics || parsed.topics.length === 0) parsed.topics = INITIAL_TOPICS;
    if (!parsed.articles) parsed.articles = INITIAL_ARTICLES;
    if (!parsed.media) parsed.media = INITIAL_MEDIA;
    if (!parsed.redirects) parsed.redirects = INITIAL_REDIRECTS;
    if (!parsed.expertise) parsed.expertise = clone(EXPERTISE_ITEMS);
    if (!parsed.projects) parsed.projects = clone(SELECTED_WORK);
    if (!parsed.adminTokens) parsed.adminTokens = ['token_demo_admin_session_key'];

    return parsed;
  } catch (err) {
    console.error('Error reading data file, using defaults:', err);
    return {
      topics: INITIAL_TOPICS,
      articles: INITIAL_ARTICLES,
      media: INITIAL_MEDIA,
      redirects: INITIAL_REDIRECTS,
      expertise: clone(EXPERTISE_ITEMS),
      projects: clone(SELECTED_WORK),
      adminTokens: ['token_demo_admin_session_key']
    };
  }
}

function saveData(data: DataStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save data file:', err);
  }
}

function slugifyText(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+|-+$/g, '') || 'item';
}

// Reorder a list by an array of ids; ids not in the list are ignored, missing ones keep their place at the end.
function reorderByIds<T extends { id: string }>(list: T[], ids: string[]): T[] {
  const map = new Map(list.map((i) => [i.id, i] as const));
  const ordered = ids.map((id) => map.get(id)).filter((i): i is T => Boolean(i));
  const rest = list.filter((i) => !ids.includes(i.id));
  return [...ordered, ...rest];
}

export function calculateReadingTime(text: string): number {
  if (!text) return 1;
  // Strip HTML tags for clean word count
  const clean = text.replace(/<[^>]*>/g, ' ');
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 200); // 200 wpm standard
  return Math.max(1, minutes);
}

export const Storage = {
  getStore(): DataStore {
    return ensureDataFile();
  },

  getTopics(): TopicHub[] {
    return this.getStore().topics;
  },

  getTopicBySlug(slug: string): TopicHub | undefined {
    return this.getTopics().find((t) => t.slug === slug);
  },

  getArticles(filter?: {
    topic?: string;
    status?: 'draft' | 'published';
    search?: string;
    featured?: boolean;
  }): Article[] {
    let list = this.getStore().articles;

    if (filter?.status) {
      list = list.filter((a) => a.status === filter.status);
    }

    if (filter?.topic) {
      list = list.filter(
        (a) =>
          a.primaryTopicSlug === filter.topic ||
          a.secondaryTopicSlugs?.includes(filter.topic!)
      );
    }

    if (filter?.featured !== undefined) {
      list = list.filter((a) => Boolean(a.isFeatured) === filter.featured);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort newest first
    return list.sort(
      (a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()
    );
  },

  getArticleById(id: string): Article | undefined {
    return this.getStore().articles.find((a) => a.id === id);
  },

  getArticleBySlug(topicSlug: string, articleSlug: string): { article?: Article; redirect?: string } {
    const store = this.getStore();
    
    // Check direct match
    const found = store.articles.find(
      (a) => a.slug === articleSlug && (a.primaryTopicSlug === topicSlug || a.secondaryTopicSlugs?.includes(topicSlug))
    );
    if (found) {
      // If found on secondary topic, user can view or canonical is primary
      return { article: found };
    }

    // Check 301 redirects
    const checkPath = `/${topicSlug}/${articleSlug}`;
    const redirect = store.redirects.find((r) => r.oldUrl === checkPath);
    if (redirect) {
      return { redirect: redirect.newUrl };
    }

    return {};
  },

  createArticle(data: Partial<Article>): Article {
    const store = this.getStore();
    const id = 'art-' + Date.now();
    const readingTime = calculateReadingTime(data.contentHtml || '');
    
    const newArticle: Article = {
      id,
      title: data.title || 'Untitled Article',
      slug: data.slug || 'untitled-article',
      primaryTopicSlug: data.primaryTopicSlug || 'conversion-tracking',
      secondaryTopicSlugs: data.secondaryTopicSlugs || [],
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      featuredImage: data.featuredImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      featuredImageAlt: data.featuredImageAlt || data.title,
      author: data.author || {
        name: 'Bayezid Mir',
        title: 'Marketing Measurement & Attribution Specialist'
      },
      publicationDate: data.publicationDate || new Date().toISOString(),
      updatedDate: new Date().toISOString(),
      readingTime: readingTime,
      status: data.status || 'draft',
      isFeatured: Boolean(data.isFeatured),
      contentHtml: data.contentHtml || '<p>Start writing article content...</p>',
      contentJson: data.contentJson,
      seoTitle: data.seoTitle || `${data.title} – Bayezid Mir`,
      metaDescription: data.metaDescription || data.excerpt,
      canonicalUrl: data.canonicalUrl || `https://bayezidmir.com/${data.primaryTopicSlug || 'conversion-tracking'}/${data.slug}`,
      ogTitle: data.ogTitle || data.title,
      ogDescription: data.ogDescription || data.excerpt,
      ogImage: data.ogImage || data.featuredImage,
      relatedArticleIds: data.relatedArticleIds || []
    };

    store.articles.unshift(newArticle);
    saveData(store);
    return newArticle;
  },

  updateArticle(id: string, data: Partial<Article>): Article | null {
    const store = this.getStore();
    const index = store.articles.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const existing = store.articles[index];
    const oldPrimarySlug = existing.primaryTopicSlug;
    const oldSlug = existing.slug;
    const oldStatus = existing.status;

    // Recalculate reading time if content changed
    const content = data.contentHtml !== undefined ? data.contentHtml : existing.contentHtml;
    const readingTime = calculateReadingTime(content);

    const updated: Article = {
      ...existing,
      ...data,
      readingTime,
      updatedDate: new Date().toISOString()
    };

    // If published article slug or primary topic changes, record 301 redirect
    if (oldStatus === 'published') {
      const oldUrl = `/${oldPrimarySlug}/${oldSlug}`;
      const newUrl = `/${updated.primaryTopicSlug}/${updated.slug}`;
      if (oldUrl !== newUrl) {
        store.redirects.push({
          id: 'red-' + Date.now(),
          oldUrl,
          newUrl,
          createdAt: new Date().toISOString()
        });
      }
    }

    store.articles[index] = updated;
    saveData(store);
    return updated;
  },

  deleteArticle(id: string): boolean {
    const store = this.getStore();
    const prevLen = store.articles.length;
    store.articles = store.articles.filter((a) => a.id !== id);
    if (store.articles.length !== prevLen) {
      saveData(store);
      return true;
    }
    return false;
  },

  getMedia(): MediaItem[] {
    return this.getStore().media;
  },

  createMedia(item: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem {
    const store = this.getStore();
    const newMedia: MediaItem = {
      id: 'media-' + Date.now(),
      ...item,
      createdAt: new Date().toISOString()
    };
    store.media.unshift(newMedia);
    saveData(store);
    return newMedia;
  },

  deleteMedia(id: string): boolean {
    const store = this.getStore();
    const prev = store.media.length;
    store.media = store.media.filter((m) => m.id !== id);
    if (store.media.length !== prev) {
      saveData(store);
      return true;
    }
    return false;
  },

  getRedirects(): Redirect301[] {
    return this.getStore().redirects;
  },

  // ---- Home page content: Expertise ----
  getExpertise(): ExpertiseItem[] {
    return this.getStore().expertise;
  },

  createExpertise(data: Partial<ExpertiseItem>): ExpertiseItem {
    const store = this.getStore();
    const title = (data.title || '').trim() || 'Untitled expertise';
    const item: ExpertiseItem = {
      id: 'exp-' + Date.now(),
      title,
      description: (data.description || '').trim(),
      futureSlug: (data.futureSlug || '').trim() || '/' + slugifyText(title),
      tags: data.tags || [],
      icon: data.icon
    };
    store.expertise.push(item);
    saveData(store);
    return item;
  },

  updateExpertise(id: string, data: Partial<ExpertiseItem>): ExpertiseItem | null {
    const store = this.getStore();
    const index = store.expertise.findIndex((e) => e.id === id);
    if (index === -1) return null;
    const updated: ExpertiseItem = { ...store.expertise[index], ...data, id };
    store.expertise[index] = updated;
    saveData(store);
    return updated;
  },

  deleteExpertise(id: string): boolean {
    const store = this.getStore();
    const prev = store.expertise.length;
    store.expertise = store.expertise.filter((e) => e.id !== id);
    if (store.expertise.length === prev) return false;
    saveData(store);
    return true;
  },

  reorderExpertise(ids: string[]): ExpertiseItem[] {
    const store = this.getStore();
    store.expertise = reorderByIds(store.expertise, ids);
    saveData(store);
    return store.expertise;
  },

  // ---- Home page content: Selected work / Projects ----
  getProjects(): CaseStudyItem[] {
    return this.getStore().projects;
  },

  createProject(data: Partial<CaseStudyItem>): CaseStudyItem {
    const store = this.getStore();
    const title = (data.title || '').trim() || 'Untitled project';
    const item: CaseStudyItem = {
      id: 'proj-' + Date.now(),
      title,
      description: (data.description || '').trim(),
      tags: data.tags || [],
      scope: (data.scope || '').trim(),
      futureSlug: (data.futureSlug || '').trim() || '/' + slugifyText(title),
      icon: data.icon,
      featured: data.featured !== false
    };
    store.projects.push(item);
    saveData(store);
    return item;
  },

  updateProject(id: string, data: Partial<CaseStudyItem>): CaseStudyItem | null {
    const store = this.getStore();
    const index = store.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const updated: CaseStudyItem = { ...store.projects[index], ...data, id };
    store.projects[index] = updated;
    saveData(store);
    return updated;
  },

  deleteProject(id: string): boolean {
    const store = this.getStore();
    const prev = store.projects.length;
    store.projects = store.projects.filter((p) => p.id !== id);
    if (store.projects.length === prev) return false;
    saveData(store);
    return true;
  },

  reorderProjects(ids: string[]): CaseStudyItem[] {
    const store = this.getStore();
    store.projects = reorderByIds(store.projects, ids);
    saveData(store);
    return store.projects;
  },

  verifyAdminToken(token?: string): boolean {
    if (!token) return false;
    const store = this.getStore();
    return store.adminTokens.includes(token);
  },

  createAdminSession(): string {
    const store = this.getStore();
    const token = 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    store.adminTokens.push(token);
    saveData(store);
    return token;
  }
};