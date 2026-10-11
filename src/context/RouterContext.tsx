import React, { createContext, useContext, useState, useEffect } from 'react';

export interface RouteMatch {
  name:
    | 'home'
    | 'insights'
    | 'projects'
    | 'topic-hub'
    | 'article-detail'
    | 'admin-login'
    | 'admin-dashboard'
    | 'admin-articles'
    | 'admin-article-new'
    | 'admin-article-edit'
    | 'admin-categories'
    | 'admin-media'
    | 'admin-expertise'
    | 'admin-projects'
    | 'not-found';
  params: Record<string, string>;
  pathname: string;
}

interface RouterContextValue {
  currentPath: string;
  route: RouteMatch;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue | null>(null);

// ---------------------------------------------------------------------------
// Secret admin URL
// The admin panel is only reachable at ADMIN_BASE (e.g. /studio-8rf8riqrmb/dashboard).
// Change it by setting VITE_ADMIN_PATH in .env (e.g. VITE_ADMIN_PATH=/my-secret-path).
// Admin components keep using their internal '/admin/...' paths; this router
// translates them to the secret URL, and the real '/admin' URL shows nothing.
// ---------------------------------------------------------------------------
const INTERNAL_ADMIN = '/admin';
const ADMIN_PREFIX_RE = /^\/admin(?=\/|$)/;
const rawAdminPath: string =
  ((import.meta as any).env?.VITE_ADMIN_PATH as string | undefined) || '/studio-8rf8riqrmb';
export const ADMIN_BASE = '/' + rawAdminPath.replace(/^\/+|\/+$/g, '');

// Internal '/admin/...' -> secret URL used in the browser address bar
function toPublicUrl(to: string): string {
  return ADMIN_PREFIX_RE.test(to) ? ADMIN_BASE + to.slice(INTERNAL_ADMIN.length) : to;
}

const KNOWN_TOPICS = [
  'conversion-tracking',
  'attribution',
  'offline-conversion-tracking',
  'server-side-tracking',
  'google-analytics-4',
  'crm-conversion-tracking',
  'shopify-tracking',
  'woocommerce-tracking',
  'consent-management',
  'tracking-audit'
];

export function parseRoute(pathname: string): RouteMatch {
  // Normalize path
  const rawPath = pathname.replace(/\/+$/, '') || '/';

  // Secret admin URL -> internal '/admin/...' path
  const isSecretAdmin = rawPath === ADMIN_BASE || rawPath.startsWith(ADMIN_BASE + '/');

  // The plain '/admin...' URL must not open the admin panel
  if (!isSecretAdmin && ADMIN_BASE !== INTERNAL_ADMIN && ADMIN_PREFIX_RE.test(rawPath)) {
    return { name: 'not-found', params: {}, pathname: rawPath };
  }

  const path = isSecretAdmin ? INTERNAL_ADMIN + rawPath.slice(ADMIN_BASE.length) : rawPath;

  if (path === '/') {
    return { name: 'home', params: {}, pathname: path };
  }

  if (path === '/insights') {
    return { name: 'insights', params: {}, pathname: path };
  }

  if (path === '/projects') {
    return { name: 'projects', params: {}, pathname: path };
  }

  // Admin routes
  if (path === '/admin/login') {
    return { name: 'admin-login', params: {}, pathname: path };
  }
  if (path === '/admin' || path === '/admin/dashboard') {
    return { name: 'admin-dashboard', params: {}, pathname: path };
  }
  if (path === '/admin/articles') {
    return { name: 'admin-articles', params: {}, pathname: path };
  }
  if (path === '/admin/articles/new') {
    return { name: 'admin-article-new', params: {}, pathname: path };
  }
  const editMatch = path.match(/^\/admin\/articles\/([^/]+)\/edit$/);
  if (editMatch) {
    return { name: 'admin-article-edit', params: { id: editMatch[1] }, pathname: path };
  }
  if (path === '/admin/categories' || path === '/admin/topics') {
    return { name: 'admin-categories', params: {}, pathname: path };
  }
  if (path === '/admin/media') {
    return { name: 'admin-media', params: {}, pathname: path };
  }
  if (path === '/admin/expertise') {
    return { name: 'admin-expertise', params: {}, pathname: path };
  }
  if (path === '/admin/projects') {
    return { name: 'admin-projects', params: {}, pathname: path };
  }

  // Article route: /<topic-slug>/<article-slug>
  const articleMatch = path.match(/^\/([^/]+)\/([^/]+)$/);
  if (articleMatch) {
    const topicSlug = articleMatch[1];
    const articleSlug = articleMatch[2];
    return {
      name: 'article-detail',
      params: { topicSlug, articleSlug },
      pathname: path
    };
  }

  // Topic hub route: /<topic-slug>
  const topicMatch = path.match(/^\/([^/]+)$/);
  if (topicMatch) {
    const slug = topicMatch[1];
    return {
      name: 'topic-hub',
      params: { topicSlug: slug },
      pathname: path
    };
  }

  return { name: 'not-found', params: {}, pathname: path };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  );

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (target: string) => {
    if (typeof window === 'undefined') return;
    const to = toPublicUrl(target);
    if (to === currentPath) return;

    // Handle hash scrolls on home page
    if (to.startsWith('/#')) {
      if (currentPath !== '/') {
        window.history.pushState({}, '', to);
        setCurrentPath('/');
        setTimeout(() => {
          const id = to.replace('/#', '');
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const id = to.replace('/#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    window.history.pushState({}, '', to);
    setCurrentPath(to);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const route = parseRoute(currentPath);

  return (
    <RouterContext.Provider value={{ currentPath, route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return ctx;
}