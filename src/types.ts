export interface ExpertiseItem {
  id: string;
  title: string;
  description: string;
  futureSlug: string;
  tags: string[];
  icon?: string; // key from src/lib/icons.ts
}

export interface CaseStudyItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  scope: string;
  futureSlug: string;
  icon?: string; // key from src/lib/icons.ts
  featured?: boolean; // shown in the home "Selected work" section (default true)
}

export interface ContactMethod {
  id: string;
  label: string;
  value: string;
  href: string;
  actionText: string;
  isExternal: boolean;
}

export type ArticleStatus = 'draft' | 'published';

export interface Article {
  id: string;
  title: string;
  slug: string;
  primaryTopicSlug: string;
  secondaryTopicSlugs: string[];
  tags: string[];
  excerpt: string;
  featuredImage: string;
  featuredImageAlt?: string;
  author: {
    name: string;
    title: string;
    avatar?: string;
  };
  publicationDate: string; // ISO String
  updatedDate: string; // ISO String
  readingTime: number; // in minutes
  status: ArticleStatus;
  isFeatured?: boolean;
  contentHtml: string;
  contentJson?: any;
  
  // SEO fields
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;

  // Custom Relations
  relatedArticleIds?: string[];
  relatedTopicSlugs?: string[];
}

export interface TopicHub {
  id: string;
  title: string;
  slug: string;
  shortIntro: string;
  description?: string;
  relatedTopics: string[]; // slugs
  relatedExpertise: string[];
  relatedCaseStudyIds: string[];
}

export interface MediaItem {
  id: string;
  title: string;
  url: string;
  altText: string;
  filename: string;
  size: number; // bytes
  mimeType: string;
  width?: number;
  height?: number;
  createdAt: string;
}

export interface Redirect301 {
  id: string;
  oldUrl: string;
  newUrl: string;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin';
}