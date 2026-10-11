import { Article, TopicHub, MediaItem, Redirect301, AdminUser, ExpertiseItem, CaseStudyItem } from '../types';
import { EXPERTISE_ITEMS, SELECTED_WORK } from '../data';
import { INITIAL_TOPICS, INITIAL_ARTICLES, INITIAL_MEDIA } from '../data/initialData';

const TOKEN_KEY = 'bayezid_admin_token';
const USER_KEY = 'bayezid_admin_user';

const authHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`
});

async function writeItem<T>(url: string, method: 'POST' | 'PUT', body: unknown, label: string): Promise<T> {
  const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Failed to save ${label}`);
  return data.item as T;
}

async function deleteItem(url: string): Promise<boolean> {
  const res = await fetch(url, { method: 'DELETE', headers: authHeaders() });
  return res.ok;
}

async function putOrder(url: string, ids: string[]): Promise<boolean> {
  const res = await fetch(url, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ ids }) });
  return res.ok;
}

export const api = {
  // Auth state
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setAuth(token: string, user: AdminUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredUser(): AdminUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      this.setAuth(data.token, data.user);
      return { success: true, user: data.user };
    } catch {
      // In-browser fallback
      if (email && (password === 'admin' || password === 'bayezid2026!')) {
        const fallbackUser: AdminUser = {
          id: 'admin-1',
          email,
          name: 'Bayezid Mir',
          role: 'admin'
        };
        this.setAuth('token_demo_admin_session_key', fallbackUser);
        return { success: true, user: fallbackUser };
      }
      return { success: false, error: 'Network error or invalid credentials' };
    }
  },

  async checkAuth(): Promise<AdminUser | null> {
    const token = this.getToken();
    if (!token) return null;
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        this.clearAuth();
        return null;
      }
      const data = await res.json();
      return data.user;
    } catch {
      return this.getStoredUser();
    }
  },

  // Topics
  async getTopics(): Promise<TopicHub[]> {
    try {
      const res = await fetch('/api/topics');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      return data.topics || INITIAL_TOPICS;
    } catch {
      return INITIAL_TOPICS;
    }
  },

  async getTopic(slug: string): Promise<{ topic: TopicHub | undefined; articles: Article[] }> {
    try {
      const res = await fetch(`/api/topics/${slug}`);
      if (!res.ok) throw new Error('Failed to fetch topic');
      const data = await res.json();
      return { topic: data.topic, articles: data.articles || [] };
    } catch {
      const topic = INITIAL_TOPICS.find((t) => t.slug === slug);
      const articles = INITIAL_ARTICLES.filter(
        (a) =>
          a.status === 'published' &&
          (a.primaryTopicSlug === slug || a.secondaryTopicSlugs?.includes(slug))
      );
      return { topic, articles };
    }
  },

  // Articles
  async getArticles(filter?: {
    topic?: string;
    status?: 'draft' | 'published';
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ articles: Article[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
    try {
      const params = new URLSearchParams();
      if (filter?.topic) params.append('topic', filter.topic);
      if (filter?.status) params.append('status', filter.status);
      if (filter?.search) params.append('search', filter.search);
      if (filter?.featured !== undefined) params.append('featured', String(filter.featured));
      if (filter?.page) params.append('page', String(filter.page));
      if (filter?.limit) params.append('limit', String(filter.limit));

      const res = await fetch(`/api/articles?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch articles');
      return await res.json();
    } catch {
      let filtered = [...INITIAL_ARTICLES];
      if (filter?.status) filtered = filtered.filter((a) => a.status === filter.status);
      if (filter?.topic) {
        filtered = filtered.filter(
          (a) => a.primaryTopicSlug === filter.topic || a.secondaryTopicSlugs?.includes(filter.topic!)
        );
      }
      if (filter?.featured !== undefined) {
        filtered = filtered.filter((a) => Boolean(a.isFeatured) === filter.featured);
      }
      if (filter?.search) {
        const q = filter.search.toLowerCase();
        filtered = filtered.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.excerpt.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return {
        articles: filtered,
        pagination: {
          page: 1,
          limit: 12,
          total: filtered.length,
          totalPages: Math.ceil(filtered.length / 12)
        }
      };
    }
  },

  async getArticleBySlug(topicSlug: string, articleSlug: string): Promise<{ article?: Article; redirect?: string; related?: Article[] }> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/articles/${topicSlug}/${articleSlug}`, { headers });
      if (!res.ok) throw new Error('Not found');
      return await res.json();
    } catch {
      const found = INITIAL_ARTICLES.find(
        (a) => a.slug === articleSlug && (a.primaryTopicSlug === topicSlug || a.secondaryTopicSlugs?.includes(topicSlug))
      );
      const related = INITIAL_ARTICLES.filter(
        (a) => a.id !== found?.id && a.primaryTopicSlug === found?.primaryTopicSlug
      ).slice(0, 3);
      return { article: found, related };
    }
  },

  async getArticleById(id: string): Promise<Article | null> {
    try {
      const token = this.getToken();
      const res = await fetch(`/api/articles/id/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data.article;
    } catch {
      return INITIAL_ARTICLES.find((a) => a.id === id) || null;
    }
  },

  async saveArticle(article: Partial<Article>, id?: string): Promise<Article> {
    const token = this.getToken();
    const url = id ? `/api/articles/${id}` : '/api/articles';
    const method = id ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(article)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to save article');
    }

    const data = await res.json();
    return data.article;
  },

  async deleteArticle(id: string): Promise<boolean> {
    const token = this.getToken();
    const res = await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.ok;
  },

  // Media
  async getMedia(): Promise<MediaItem[]> {
    try {
      const res = await fetch('/api/media');
      if (!res.ok) return INITIAL_MEDIA;
      const data = await res.json();
      return data.media || INITIAL_MEDIA;
    } catch {
      return INITIAL_MEDIA;
    }
  },

  async uploadMedia(mediaData: Partial<MediaItem>): Promise<MediaItem> {
    const token = this.getToken();
    const res = await fetch('/api/media', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(mediaData)
    });
    if (!res.ok) {
      throw new Error('Failed to upload media');
    }
    const data = await res.json();
    return data.media;
  },

  async deleteMedia(id: string): Promise<boolean> {
    const token = this.getToken();
    const res = await fetch(`/api/media/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  },

  // Home page content: Expertise
  async getExpertise(): Promise<ExpertiseItem[]> {
    try {
      const res = await fetch('/api/expertise');
      if (!res.ok) return EXPERTISE_ITEMS;
      const data = await res.json();
      return data.expertise || EXPERTISE_ITEMS;
    } catch {
      return EXPERTISE_ITEMS;
    }
  },

  async saveExpertise(item: Partial<ExpertiseItem>, id?: string): Promise<ExpertiseItem> {
    return writeItem<ExpertiseItem>(id ? `/api/expertise/${id}` : '/api/expertise', id ? 'PUT' : 'POST', item, 'expertise');
  },

  async deleteExpertise(id: string): Promise<boolean> {
    return deleteItem(`/api/expertise/${id}`);
  },

  async reorderExpertise(ids: string[]): Promise<boolean> {
    return putOrder('/api/expertise-order', ids);
  },

  // Home page content: Selected work / Projects
  async getProjects(): Promise<CaseStudyItem[]> {
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) return SELECTED_WORK;
      const data = await res.json();
      return data.projects || SELECTED_WORK;
    } catch {
      return SELECTED_WORK;
    }
  },

  async saveProject(item: Partial<CaseStudyItem>, id?: string): Promise<CaseStudyItem> {
    return writeItem<CaseStudyItem>(id ? `/api/projects/${id}` : '/api/projects', id ? 'PUT' : 'POST', item, 'project');
  },

  async deleteProject(id: string): Promise<boolean> {
    return deleteItem(`/api/projects/${id}`);
  },

  async reorderProjects(ids: string[]): Promise<boolean> {
    return putOrder('/api/projects-order', ids);
  },

  // Redirects
  async getRedirects(): Promise<Redirect301[]> {
    try {
      const res = await fetch('/api/redirects');
      if (!res.ok) return [];
      const data = await res.json();
      return data.redirects || [];
    } catch {
      return [];
    }
  }
};