import 'dotenv/config';
import express from 'express';
import nodemailer from 'nodemailer';
import path from 'path';
import crypto from 'crypto';
import { Storage } from './src/server/storage';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body Parser with limit for rich text and base64 media uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Helper auth middleware
  const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    
    if (token && Storage.verifyAdminToken(token)) {
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized. Admin credentials required.' });
  };

  // --- API Routes ---

  // Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Contact form: sends the visitor's message by email (SMTP settings come from .env)
  const contactHits = new Map<string, number[]>();
  const CONTACT_LIMIT = 5; // messages per IP ...
  const CONTACT_WINDOW_MS = 60 * 60 * 1000; // ... per hour
  const escapeHtml = (v: string) =>
    v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  app.post('/api/contact', async (req, res) => {
    const body = req.body || {};
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';

    // Hidden spam-trap field is only filled by bots: pretend success and drop it
    if (typeof body.hp_company === 'string' && body.hp_company.trim() !== '') {
      console.warn('Contact form ignored: hidden spam-trap field was filled in.');
      return res.json({ success: true });
    }

    if (message.length < 5 || message.length > 3000) {
      return res.status(400).json({ error: 'Please write a message (5 to 3000 characters).' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Simple per-IP rate limit
    const ip = req.ip || 'unknown';
    const now = Date.now();
    const recent = (contactHits.get(ip) || []).filter((t) => now - t < CONTACT_WINDOW_MS);
    if (recent.length >= CONTACT_LIMIT) {
      return res.status(429).json({ error: 'Too many messages. Please try again later.' });
    }

    const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return res.status(503).json({ error: 'Email service is not configured on the server.' });
    }

    const port = Number(SMTP_PORT) || 465;
    const secure = SMTP_SECURE ? SMTP_SECURE === 'true' : port === 465;
    const to = process.env.CONTACT_TO_EMAIL || 'warner.roman@gmail.com';

    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure,
        auth: { user: SMTP_USER, pass: SMTP_PASS }
      });

      const info = await transporter.sendMail({
        from: `"Portfolio Contact" <${SMTP_USER}>`,
        to,
        replyTo: email,
        subject: `New project inquiry from ${email}`,
        text: `New message from your website contact form\n\nFrom: ${email}\n\n${message}\n`,
        html: `<p><strong>New message from your website contact form</strong></p>
<p><strong>From:</strong> ${escapeHtml(email)}</p>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`
      });

      console.log(
        `Contact email sent -> to: ${to} | from account: ${SMTP_USER} | accepted: ${JSON.stringify(info.accepted)} | rejected: ${JSON.stringify(info.rejected)} | ${info.response}`
      );

      recent.push(now);
      contactHits.set(ip, recent);
      res.json({ success: true });
    } catch (err) {
      console.error('Contact email failed:', err);
      res.status(502).json({ error: 'Could not send the message right now. Please try again later.' });
    }
  });

  // Auth routes: admin email + password come from environment variables (never from source code)
  const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
  const sha = (v: string) => crypto.createHash('sha256').update(v).digest();
  const safeEqual = (a: string, b: string) => crypto.timingSafeEqual(sha(a), sha(b));

  const loginFails = new Map<string, number[]>();
  const LOGIN_LIMIT = 8; // failed attempts per IP ...
  const LOGIN_WINDOW_MS = 15 * 60 * 1000; // ... per 15 minutes

  app.post('/api/auth/login', (req, res) => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
      return res.status(503).json({ error: 'Admin login is not configured on the server.' });
    }

    const ip = req.ip || 'unknown';
    const now = Date.now();
    const fails = (loginFails.get(ip) || []).filter((t) => now - t < LOGIN_WINDOW_MS);
    if (fails.length >= LOGIN_LIMIT) {
      return res.status(429).json({ error: 'Too many failed attempts. Please try again later.' });
    }

    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (safeEqual(email, ADMIN_EMAIL) && safeEqual(password, ADMIN_PASSWORD)) {
      loginFails.delete(ip);
      const token = Storage.createAdminSession();
      return res.json({
        success: true,
        token,
        user: {
          id: 'admin-1',
          email: ADMIN_EMAIL,
          name: 'Bayezid Mir',
          role: 'admin'
        }
      });
    }

    fails.push(now);
    loginFails.set(ip, fails);
    return res.status(401).json({ error: 'Invalid email or password' });
  });

  app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    if (token && Storage.verifyAdminToken(token)) {
      return res.json({
        user: {
          id: 'admin-1',
          email: ADMIN_EMAIL,
          name: 'Bayezid Mir',
          role: 'admin'
        }
      });
    }
    return res.status(401).json({ error: 'Session invalid or expired' });
  });

  // Topics
  app.get('/api/topics', (req, res) => {
    const topics = Storage.getTopics();
    res.json({ topics });
  });

  app.get('/api/topics/:slug', (req, res) => {
    const topic = Storage.getTopicBySlug(req.params.slug);
    if (!topic) {
      return res.status(404).json({ error: 'Topic hub not found' });
    }
    // Fetch published articles belonging to this topic (either primary or secondary)
    const articles = Storage.getArticles({
      topic: topic.slug,
      status: 'published'
    });
    res.json({ topic, articles });
  });

  // Articles list
  app.get('/api/articles', (req, res) => {
    const { topic, status, search, featured, page = '1', limit = '12' } = req.query;
    
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;

    const allArticles = Storage.getArticles({
      topic: topic as string | undefined,
      status: status as ('draft' | 'published') | undefined,
      search: search as string | undefined,
      featured: featured !== undefined ? featured === 'true' : undefined
    });

    const total = allArticles.length;
    const startIndex = (pageNum - 1) * limitNum;
    const articles = allArticles.slice(startIndex, startIndex + limitNum);

    res.json({
      articles,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  });

  // Article by ID (admin)
  app.get('/api/articles/id/:id', (req, res) => {
    const article = Storage.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ article });
  });

  // Article by Topic & Slug (public reading)
  app.get('/api/articles/:topicSlug/:articleSlug', (req, res) => {
    const { topicSlug, articleSlug } = req.params;
    const result = Storage.getArticleBySlug(topicSlug, articleSlug);

    if (result.redirect) {
      return res.json({ redirect: result.redirect });
    }

    if (!result.article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Only allow drafts if requested with admin token or status preview
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);
    const isAdmin = token && Storage.verifyAdminToken(token);

    if (result.article.status === 'draft' && !isAdmin) {
      return res.status(404).json({ error: 'Article not published yet' });
    }

    // Get related articles
    const related = Storage.getArticles({
      topic: result.article.primaryTopicSlug,
      status: 'published'
    })
      .filter((a) => a.id !== result.article!.id)
      .slice(0, 3);

    res.json({
      article: result.article,
      related
    });
  });

  // Create article (admin)
  app.post('/api/articles', requireAdmin, (req, res) => {
    try {
      const created = Storage.createArticle(req.body);
      res.status(201).json({ article: created });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to create article' });
    }
  });

  // Update article (admin)
  app.put('/api/articles/:id', requireAdmin, (req, res) => {
    try {
      const updated = Storage.updateArticle(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: 'Article not found' });
      }
      res.json({ article: updated });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to update article' });
    }
  });

  // Delete article (admin)
  app.delete('/api/articles/:id', requireAdmin, (req, res) => {
    const success = Storage.deleteArticle(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ success: true });
  });

  // Media API
  app.get('/api/media', (req, res) => {
    res.json({ media: Storage.getMedia() });
  });

  app.post('/api/media', requireAdmin, (req, res) => {
    try {
      const { title, url, altText, filename, size, mimeType, width, height } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'Image URL or payload required' });
      }
      const item = Storage.createMedia({
        title: title || filename || 'Uploaded Media',
        url,
        altText: altText || title || '',
        filename: filename || 'image.webp',
        size: size || 1024,
        mimeType: mimeType || 'image/webp',
        width,
        height
      });
      res.status(201).json({ media: item });
    } catch (err: any) {
      res.status(400).json({ error: err.message || 'Failed to save media' });
    }
  });

  app.delete('/api/media/:id', requireAdmin, (req, res) => {
    const ok = Storage.deleteMedia(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Media not found' });
    res.json({ success: true });
  });

  // --- Home page content: Expertise & Projects (public read, admin write) ---
  app.get('/api/expertise', (req, res) => {
    res.json({ expertise: Storage.getExpertise() });
  });

  app.put('/api/expertise-order', requireAdmin, (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? (req.body.ids as string[]) : [];
    res.json({ expertise: Storage.reorderExpertise(ids) });
  });

  app.post('/api/expertise', requireAdmin, (req, res) => {
    if (!req.body?.title?.trim() || !req.body?.description?.trim()) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    res.status(201).json({ item: Storage.createExpertise(req.body) });
  });

  app.put('/api/expertise/:id', requireAdmin, (req, res) => {
    const item = Storage.updateExpertise(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Expertise not found' });
    res.json({ item });
  });

  app.delete('/api/expertise/:id', requireAdmin, (req, res) => {
    if (!Storage.deleteExpertise(req.params.id)) return res.status(404).json({ error: 'Expertise not found' });
    res.json({ success: true });
  });

  app.get('/api/projects', (req, res) => {
    res.json({ projects: Storage.getProjects() });
  });

  app.put('/api/projects-order', requireAdmin, (req, res) => {
    const ids = Array.isArray(req.body?.ids) ? (req.body.ids as string[]) : [];
    res.json({ projects: Storage.reorderProjects(ids) });
  });

  app.post('/api/projects', requireAdmin, (req, res) => {
    if (!req.body?.title?.trim() || !req.body?.description?.trim()) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    res.status(201).json({ item: Storage.createProject(req.body) });
  });

  app.put('/api/projects/:id', requireAdmin, (req, res) => {
    const item = Storage.updateProject(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Project not found' });
    res.json({ item });
  });

  app.delete('/api/projects/:id', requireAdmin, (req, res) => {
    if (!Storage.deleteProject(req.params.id)) return res.status(404).json({ error: 'Project not found' });
    res.json({ success: true });
  });

  // 301 Redirects table
  app.get('/api/redirects', (req, res) => {
    res.json({ redirects: Storage.getRedirects() });
  });

  // XML Sitemap Generator
  app.get('/sitemap.xml', (req, res) => {
    const topics = Storage.getTopics();
    const publishedArticles = Storage.getArticles({ status: 'published' });
    const baseUrl = 'https://bayezidmir.com';

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static primary pages
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/insights</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    xml += `  <url>\n    <loc>${baseUrl}/projects</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

    // Topic Hubs
    topics.forEach((topic) => {
      xml += `  <url>\n    <loc>${baseUrl}/${topic.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
    });

    // Published Articles
    publishedArticles.forEach((article) => {
      const lastMod = article.updatedDate ? article.updatedDate.split('T')[0] : article.publicationDate.split('T')[0];
      xml += `  <url>\n    <loc>${baseUrl}/${article.primaryTopicSlug}/${article.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  });

  // Robots.txt
  app.get('/robots.txt', (req, res) => {
    const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://bayezidmir.com/sitemap.xml
`;
    res.header('Content-Type', 'text/plain');
    res.send(robots);
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });

  // Stop with a clear message if an old server is still using the port
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Close the old server first.`);
    } else {
      console.error(err);
    }
    process.exit(1);
  });
}

startServer();