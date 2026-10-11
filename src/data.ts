import { ExpertiseItem, CaseStudyItem, ContactMethod } from './types';

export const EXPERTISE_ITEMS: ExpertiseItem[] = [
  {
    id: 'conversion-tracking',
    icon: 'Activity',
    title: 'Conversion Tracking',
    description: 'Accurate conversion signals across Meta, Google Ads, TikTok, GA4, and other platforms.',
    futureSlug: '/google-ads-conversion-tracking',
    tags: ['Meta Pixel', 'Google Ads', 'TikTok', 'GA4']
  },
  {
    id: 'attribution',
    icon: 'Users',
    title: 'Attribution',
    description: 'Cross-device, cross-platform, cross-domain, campaign, and CRM attribution.',
    futureSlug: '/marketing-attribution',
    tags: ['Multi-Touch', 'Cross-Device', 'Cross-Domain', 'UTM Architecture']
  },
  {
    id: 'offline-conversions',
    icon: 'Mail',
    title: 'Offline Conversions',
    description: 'Connecting CRM and backend outcomes back to advertising platforms.',
    futureSlug: '/offline-conversion-tracking',
    tags: ['CRM Sync', 'Enhanced Conversions', 'Deal Milestones', 'Server Feeds']
  },
  {
    id: 'server-side-tracking',
    icon: 'Server',
    title: 'Server-Side Tracking',
    description: 'GTM Server-Side, Stape, server-side event forwarding, and browser/server coordination.',
    futureSlug: '/server-side-tracking',
    tags: ['sGTM', 'Stape', 'Meta CAPI', 'Deduplication']
  },
  {
    id: 'analytics',
    icon: 'BarChart3',
    title: 'Analytics',
    description: 'GA4, ecommerce measurement, event tracking, and data validation.',
    futureSlug: '/google-analytics-4',
    tags: ['GA4', 'Ecommerce Events', 'Data Layer', 'Validation']
  },
  {
    id: 'crm-marketing-data',
    icon: 'Database',
    title: 'CRM & Marketing Data',
    description: 'Connecting platforms such as HubSpot, GoHighLevel, Zoho, Odoo, and custom systems with marketing measurement.',
    futureSlug: '/crm-conversion-tracking',
    tags: ['HubSpot', 'GoHighLevel', 'Zoho', 'Odoo']
  }
];

export const TECH_STRIP_ITEMS = [
  'Meta Pixel',
  'Meta CAPI',
  'Google Ads',
  'GA4',
  'GTM',
  'Stape',
  'TikTok',
  'Shopify',
  'HubSpot',
  'GoHighLevel',
  'Zoho',
  'Odoo'
];

export const SELECTED_WORK: CaseStudyItem[] = [
  {
    id: 'meta-capi-server-side',
    icon: 'BarChart3',
    featured: true,
    title: 'Meta CAPI & Server-Side Tracking',
    description: 'Dual-tagging and server-side deduplication pipeline restoring data accuracy across ad networks while respecting modern browser cookie constraints.',
    tags: ['Meta CAPI', 'GTM Server-Side', 'Stape', 'Shopify'],
    scope: 'Server-side deployment, event deduplication, and cookie preservation',
    futureSlug: '/meta-conversions-api'
  },
  {
    id: 'crm-offline-conversions',
    icon: 'Globe2',
    featured: true,
    title: 'CRM & Offline Conversion Tracking',
    description: 'Closed-loop data connection mapping qualified pipeline milestones and actual closed deals from CRM back into advertising attribution algorithms.',
    tags: ['HubSpot', 'Google Ads', 'Webhooks', 'Zoho'],
    scope: 'CRM webhook routing, offline conversion upload, and match rate optimization',
    futureSlug: '/crm-conversion-tracking'
  },
  {
    id: 'cross-platform-attribution',
    icon: 'Layers',
    featured: true,
    title: 'Cross-Platform Attribution',
    description: 'Unified tracking framework resolving cross-domain journeys, multi-device sessions, and blended marketing touchpoints into transparent measurement.',
    tags: ['GA4', 'Cross-Domain', 'Attribution Modeling', 'BigQuery'],
    scope: 'Cross-domain linkage, clean UTM parameters, and journey reconciliation',
    futureSlug: '/marketing-attribution'
  }
];

export const ABOUT_PARAGRAPH = 
  "Bayezid Mir specializes in technical marketing measurement and attribution infrastructure. Working directly across advertising platforms, analytics implementations, websites, ecommerce environments, server-side tracking pipelines, and CRM systems, he builds clean tracking foundations that eliminate data blind spots. Rather than relying on fragile client-side scripts alone, Bayezid establishes verified event pipelines and closed-loop data flows that give marketing teams and founders reliable signals they can act on with confidence.";

export const CONTACT_METHODS: ContactMethod[] = [
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    value: '+801742286919',
    href: 'https://wa.me/801742286919',
    actionText: 'Message on WhatsApp',
    isExternal: true
  },
  {
    id: 'email',
    label: 'Email',
    value: 'Bayezid.iqbal@gmail.com',
    href: 'mailto:Bayezid.iqbal@gmail.com',
    actionText: 'Send email',
    isExternal: false
  },
  {
    id: 'upwork',
    label: 'Upwork',
    value: 'View profile',
    href: 'https://www.upwork.com/freelancers/bayezidmir',
    actionText: 'View profile',
    isExternal: true
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'View profile',
    href: 'https://www.linkedin.com/in/bayezid-mir-54197224b/',
    actionText: 'View profile',
    isExternal: true
  }
];