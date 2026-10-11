import { TopicHub, Article, MediaItem, Redirect301 } from '../types';

export const INITIAL_TOPICS: TopicHub[] = [
  {
    id: 'topic-1',
    title: 'Conversion Tracking',
    slug: 'conversion-tracking',
    shortIntro: 'Deterministic and probabilistic event signaling across Meta Pixel, Google Ads Enhanced Conversions, TikTok Events API, and GA4 to recover conversion visibility.',
    description: 'Modern ad platforms rely heavily on algorithm bidding and value-based optimization. Without accurate conversion signals, smart bidding models degrade, ad spend is misallocated, and acquisition costs rise. This hub covers first-party tag architectures, event deduplication, and browser-to-server coordination.',
    relatedTopics: ['server-side-tracking', 'offline-conversion-tracking', 'shopify-tracking'],
    relatedExpertise: ['Conversion Tracking', 'Server-Side Tracking', 'Offline Conversions'],
    relatedCaseStudyIds: ['meta-capi-server-side']
  },
  {
    id: 'topic-2',
    title: 'Attribution',
    slug: 'attribution',
    shortIntro: 'Cross-device, cross-platform, cross-domain, campaign, and CRM attribution frameworks designed for privacy-first multi-touch customer journeys.',
    description: 'Platform self-reporting inevitably double-counts revenue. We establish independent attribution models, clean UTM parameter hierarchies, and deterministic identity linkage across touchpoints to reveal true acquisition economics.',
    relatedTopics: ['google-analytics-4', 'crm-conversion-tracking', 'conversion-tracking'],
    relatedExpertise: ['Attribution', 'Analytics'],
    relatedCaseStudyIds: ['cross-platform-attribution']
  },
  {
    id: 'topic-3',
    title: 'Offline Conversion Tracking',
    slug: 'offline-conversion-tracking',
    shortIntro: 'Connecting CRM deal progressions, demo completions, and qualified backend revenue back into advertising bidding algorithms.',
    description: 'Closing the loop between front-end lead generation and back-end closed revenue. By uploading hashed offline conversion milestones with captured Google Click IDs (GCLID) and Meta click IDs (fbclid), advertising algorithms optimize for sales instead of cheap leads.',
    relatedTopics: ['crm-conversion-tracking', 'conversion-tracking', 'server-side-tracking'],
    relatedExpertise: ['Offline Conversions', 'CRM & Marketing Data'],
    relatedCaseStudyIds: ['crm-offline-conversions']
  },
  {
    id: 'topic-4',
    title: 'Server-Side Tracking',
    slug: 'server-side-tracking',
    shortIntro: 'Server-Side Google Tag Manager (sGTM), Stape, cloud proxy containers, first-party cookie extension, and browser/server coordination.',
    description: 'Moving tagging logic from the client browser to a secure server environment. Extends cookie lifetimes beyond Safari ITP constraints, bypasses ad-blockers, cleans sensitive PII before transmission, and accelerates page load performance.',
    relatedTopics: ['conversion-tracking', 'consent-management', 'shopify-tracking'],
    relatedExpertise: ['Server-Side Tracking', 'Conversion Tracking'],
    relatedCaseStudyIds: ['meta-capi-server-side']
  },
  {
    id: 'topic-5',
    title: 'Google Analytics 4',
    slug: 'google-analytics-4',
    shortIntro: 'GA4 ecommerce schemas, event data streams, BigQuery exports, custom dimension architectures, and data validation protocols.',
    description: 'Full data layer implementation and measurement protocol validation. Designing event structures that provide transparent visibility across discovery, engagement, checkout, and post-purchase behavior.',
    relatedTopics: ['attribution', 'shopify-tracking', 'woocommerce-tracking'],
    relatedExpertise: ['Analytics', 'Attribution'],
    relatedCaseStudyIds: ['cross-platform-attribution']
  },
  {
    id: 'topic-6',
    title: 'CRM Conversion Tracking',
    slug: 'crm-conversion-tracking',
    shortIntro: 'Native and webhook integration architectures for HubSpot, GoHighLevel, Zoho, Odoo, Salesforce, and custom CRM systems.',
    description: 'Synchronizing deal stages, customer lifecycle milestones, and actual payments from CRM databases back to marketing dashboards and ad network APIs.',
    relatedTopics: ['offline-conversion-tracking', 'attribution', 'conversion-tracking'],
    relatedExpertise: ['CRM & Marketing Data', 'Offline Conversions'],
    relatedCaseStudyIds: ['crm-offline-conversions']
  },
  {
    id: 'topic-7',
    title: 'Shopify Tracking',
    slug: 'shopify-tracking',
    shortIntro: 'First-party data collection on Shopify checkout, Customer Events (web pixels), custom app endpoints, and server-side relay.',
    description: 'Overcoming the limitations of Shopify sandboxed checkout scripts. Establishing bulletproof purchase tracking, customer identification parameters, and checkout abandonment measurement.',
    relatedTopics: ['conversion-tracking', 'server-side-tracking', 'google-analytics-4'],
    relatedExpertise: ['Conversion Tracking', 'Server-Side Tracking'],
    relatedCaseStudyIds: ['meta-capi-server-side']
  },
  {
    id: 'topic-8',
    title: 'WooCommerce Tracking',
    slug: 'woocommerce-tracking',
    shortIntro: 'WordPress and WooCommerce measurement setups, server-to-server order hooks, and privacy-first checkout tracking.',
    description: 'Eliminating missing WooCommerce transactions caused by external payment gateways (PayPal, Stripe) through server-side fallback hooks and verified session attribution.',
    relatedTopics: ['server-side-tracking', 'google-analytics-4', 'conversion-tracking'],
    relatedExpertise: ['Conversion Tracking', 'Analytics'],
    relatedCaseStudyIds: []
  },
  {
    id: 'topic-9',
    title: 'Consent Management',
    slug: 'consent-management',
    shortIntro: 'Google Consent Mode v2, Cookiebot, OneTrust, banner integration, and compliant server-side tag gating.',
    description: 'Implementing Consent Mode v2 (ad_storage, analytics_storage, ad_user_data, ad_personalization) without sacrificing baseline behavioral modeling or violating privacy standards.',
    relatedTopics: ['google-analytics-4', 'server-side-tracking', 'conversion-tracking'],
    relatedExpertise: ['Conversion Tracking', 'Analytics'],
    relatedCaseStudyIds: []
  },
  {
    id: 'topic-10',
    title: 'Tracking Audit',
    slug: 'tracking-audit',
    shortIntro: 'Comprehensive diagnostic frameworks to identify signal discrepancies, duplicate events, missing parameters, and attribution degradation.',
    description: 'A systematic audit process inspecting tag firing triggers, network payloads, data layer schemas, duplicate event IDs, and match rate health scores across advertising platforms.',
    relatedTopics: ['conversion-tracking', 'server-side-tracking', 'google-analytics-4'],
    relatedExpertise: ['Conversion Tracking', 'Attribution', 'Analytics'],
    relatedCaseStudyIds: ['meta-capi-server-side', 'cross-platform-attribution']
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Meta CAPI Event Deduplication: Browser & Server-Side Coordination Architecture',
    slug: 'meta-capi-event-deduplication',
    primaryTopicSlug: 'conversion-tracking',
    secondaryTopicSlugs: ['server-side-tracking', 'shopify-tracking'],
    tags: ['Meta CAPI', 'Deduplication', 'Event ID', 'sGTM', 'Shopify'],
    excerpt: 'A technical deep dive into establishing deterministic event_id hashing and timestamp alignment between Meta Pixel and Conversions API to achieve near-100% deduplication without double counting.',
    featuredImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Abstract data pipelines and event streaming nodes',
    author: {
      name: 'Bayezid Mir',
      title: 'Marketing Measurement & Attribution Specialist'
    },
    publicationDate: '2026-08-14T09:00:00.000Z',
    updatedDate: '2026-09-02T14:30:00.000Z',
    readingTime: 6,
    status: 'published',
    isFeatured: true,
    seoTitle: 'Meta CAPI Event Deduplication Guide – Bayezid Mir',
    metaDescription: 'Step-by-step engineering blueprint for combining Meta Pixel and Conversions API with deterministic event_id deduplication and zero double-counting.',
    canonicalUrl: 'https://bayezidmir.com/conversion-tracking/meta-capi-event-deduplication',
    ogTitle: 'Meta CAPI Event Deduplication: Browser & Server-Side Coordination Architecture',
    ogDescription: 'Deterministic event_id hashing and timestamp coordination to achieve near-100% deduplication between browser pixel and Conversions API.',
    relatedArticleIds: ['art-7', 'art-2'],
    contentHtml: `
      <h2>The Problem of Dual-Tracking Double-Counting</h2>
      <p>Running Meta Pixel in the browser alongside Meta Conversions API (CAPI) on the server is now the industry gold standard. However, without a mathematically deterministic event deduplication mechanism, Meta’s attribution algorithm will either double-count purchases or reject incoming conversion signals.</p>
      
      <blockquote>
        <p><strong>Rule of Thumb:</strong> Meta requires both <code>event_name</code> and <code>event_id</code> to match exactly across browser and server payloads within a 48-hour deduplication window.</p>
      </blockquote>

      <h2>Core Architecture of Deduplication</h2>
      <p>The solution involves generating a unique, persistent event identifier at the moment the user initiates the transaction, passing it identically to the front-end DataLayer, and forwarding it to the server-side tagging container:</p>
      
      <pre><code>// Browser DataLayer push
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'purchase',
  event_id: 'order_' + orderId + '_' + Date.now(),
  ecommerce: {
    transaction_id: orderId,
    value: 149.50,
    currency: 'USD'
  }
});</code></pre>

      <h3>1. Browser Pixel Firing</h3>
      <p>The standard browser tag reads <code>event_id</code> from the DataLayer variable and attaches it directly to the <code>fbq('track', 'Purchase', payload, { eventID: event_id })</code> call.</p>

      <h3>2. Server-Side Relay via sGTM</h3>
      <p>Server-side Google Tag Manager receives the identical client event containing the <code>event_id</code>. The Meta CAPI tag in sGTM constructs the server payload, mapping <code>event_id</code> alongside hashed user data (<code>em</code>, <code>ph</code>, <code>fn</code>) and client hints.</p>

      <h3>3. Verification in Meta Events Manager</h3>
      <p>When configured correctly, Meta Events Manager displays a "Deduplicated" status in the Event Quality dashboard, with match rate scores reaching 8.5 to 9.5 out of 10.</p>
    `
  },
  {
    id: 'art-2',
    title: 'Google Ads Enhanced Conversions: First-Party Hashing & Match Rate Calibration',
    slug: 'google-ads-conversion-tracking',
    primaryTopicSlug: 'conversion-tracking',
    secondaryTopicSlugs: ['offline-conversion-tracking', 'crm-conversion-tracking'],
    tags: ['Google Ads', 'Enhanced Conversions', 'SHA-256', 'Match Rate'],
    excerpt: 'How to configure first-party customer data hashing (email, phone, address) to recover lost conversion attribution in Google Ads amidst browser storage restrictions.',
    featuredImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Google Ads conversion metrics and reporting dashboard',
    author: {
      name: 'Bayezid Mir',
      title: 'Marketing Measurement & Attribution Specialist'
    },
    publicationDate: '2026-08-20T10:15:00.000Z',
    updatedDate: '2026-09-05T11:00:00.000Z',
    readingTime: 5,
    status: 'published',
    isFeatured: false,
    seoTitle: 'Google Ads Enhanced Conversions Setup & Hashing – Bayezid Mir',
    metaDescription: 'Learn how to capture, normalize, and SHA-256 hash first-party data to maximize Google Ads Enhanced Conversions match rates.',
    canonicalUrl: 'https://bayezidmir.com/conversion-tracking/google-ads-conversion-tracking',
    relatedArticleIds: ['art-1', 'art-5'],
    contentHtml: `
      <h2>Why Enhanced Conversions Are Essential</h2>
      <p>With third-party cookies deprecated across modern browsers and Safari ITP capping cookie lifetimes at 1 to 7 days, Google Click Identifiers (GCLID) are frequently lost before a conversion occurs.</p>
      
      <p>Enhanced Conversions solve this by sending privacy-safe, SHA-256 hashed first-party customer data (email address, phone number, physical address) alongside standard conversion tags. Google then securely matches these hashes against signed-in Google accounts.</p>

      <h2>Data Normalization Protocols</h2>
      <p>Hashing unformatted user inputs results in match failures. Strings must be cleaned according to Google specifications prior to SHA-256 calculation:</p>
      
      <ul>
        <li><strong>Email:</strong> Trim whitespace, convert all characters to lowercase, remove periods from Gmail addresses preceding the @ symbol.</li>
        <li><strong>Phone:</strong> Convert to E.164 international format (e.g., <code>+14155552671</code>), removing all dashes, parentheses, and spaces.</li>
        <li><strong>Postal Code:</strong> Trim outer spaces and uppercase.</li>
      </ul>

      <pre><code>// SHA-256 Normalization Example in JS
function normalizeEmail(email) {
  if (!email) return '';
  let clean = email.trim().toLowerCase();
  if (clean.includes('@gmail.com')) {
    const parts = clean.split('@');
    parts[0] = parts[0].replace(/\\./g, '');
    clean = parts.join('@');
  }
  return clean;
}</code></pre>
    `
  },
  {
    id: 'art-3',
    title: 'Cross-Platform Attribution: Resolving Multi-Touch Blind Spots Across Paid Channels',
    slug: 'cross-platform-attribution',
    primaryTopicSlug: 'attribution',
    secondaryTopicSlugs: ['google-analytics-4', 'crm-conversion-tracking'],
    tags: ['Multi-Touch', 'Attribution Modeling', 'Cross-Platform', 'Blended ROAS'],
    excerpt: 'Designing attribution frameworks that reconcile self-attributing networks (Meta, Google) with independent analytics and verified revenue pipelines.',
    featuredImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Multi-touch customer journey graph visualization',
    author: {
      name: 'Bayezid Mir',
      title: 'Marketing Measurement & Attribution Specialist'
    },
    publicationDate: '2026-08-28T14:00:00.000Z',
    updatedDate: '2026-09-10T16:20:00.000Z',
    readingTime: 8,
    status: 'published',
    isFeatured: true,
    seoTitle: 'Cross-Platform Attribution Architecture – Bayezid Mir',
    metaDescription: 'Eliminate duplicate reporting from Meta and Google Ads by establishing an independent multi-touch attribution model in GA4 and BigQuery.',
    canonicalUrl: 'https://bayezidmir.com/attribution/cross-platform-attribution',
    relatedArticleIds: ['art-4', 'art-8'],
    contentHtml: `
      <h2>The Self-Attribution Illusion</h2>
      <p>If you add up the reported conversions across Meta Ads Manager, Google Ads, and TikTok Ads, the total often exceeds your bank account deposits by 30% to 70%. Each network operates as a Self-Attributing Network (SAN), claiming full credit for any purchase touched within its click-through or view-through window.</p>

      <h2>Establishing a Single Source of Truth</h2>
      <p>To evaluate true channel incrementality, marketing leaders must separate platform reporting from independent attribution. We build architectures that combine:</p>

      <ol>
        <li><strong>Strict UTM Taxonomy:</strong> Standardized naming rules for source, medium, campaign, content, and term enforced across all channels.</li>
        <li><strong>Cross-Domain Session Linkage:</strong> Ensuring traffic moving from landing pages to sub-domains or payment gateways preserves session context.</li>
        <li><strong>Data-Driven Attribution in GA4:</strong> Algorithmic attribution that assigns fractional credit across discovery, consideration, and closing touchpoints.</li>
      </ol>
    `
  },
  {
    id: 'art-4',
    title: 'Cross-Device Journey Attribution: Deterministic vs. Probabilistic Identity Stitching',
    slug: 'cross-device-attribution',
    primaryTopicSlug: 'attribution',
    secondaryTopicSlugs: ['conversion-tracking'],
    tags: ['Cross-Device', 'Identity Resolution', 'User ID', 'GA4'],
    excerpt: 'Technical strategies for stitching user sessions across mobile discovery and desktop checkout using first-party identifiers and User-ID measurement protocols.',
    featuredImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Cross device connectivity schematic',
    author: {
      name: 'Bayezid Mir',
      title: 'Marketing Measurement & Attribution Specialist'
    },
    publicationDate: '2026-09-01T08:30:00.000Z',
    updatedDate: '2026-09-12T09:00:00.000Z',
    readingTime: 6,
    status: 'published',
    isFeatured: false,
    seoTitle: 'Cross-Device Attribution & User-ID Stitching – Bayezid Mir',
    metaDescription: 'Solve cross-device attribution gaps by deploying first-party User-ID tracking and deterministic session stitching across platforms.',
    canonicalUrl: 'https://bayezidmir.com/attribution/cross-device-attribution',
    relatedArticleIds: ['art-3', 'art-1'],
    contentHtml: `
      <h2>The Mobile Discovery, Desktop Conversion Dilemma</h2>
      <p>Over 65% of ecommerce and B2B journeys begin on a mobile phone during social or search browsing, but conclude on desktop or via telephone. Standard cookie-based tracking treats this as two distinct people, attributing the conversion entirely to direct or organic traffic and discounting top-of-funnel mobile spend.</p>

      <h2>Deterministic User-ID Protocol</h2>
      <p>By capturing first-party login tokens, email capture popups, or unique CRM contact IDs, we can assign a consistent <code>user_id</code> parameter to the GA4 measurement payload. GA4 then retrospectively stitches historical touchpoints across all verified devices.</p>
    `
  },
  {
    id: 'art-5',
    title: 'HubSpot to Google Ads Offline Conversion Pipeline Architecture',
    slug: 'hubspot-google-ads',
    primaryTopicSlug: 'offline-conversion-tracking',
    secondaryTopicSlugs: ['crm-conversion-tracking', 'conversion-tracking'],
    tags: ['HubSpot', 'Google Ads', 'gclid', 'Offline Conversions'],
    excerpt: 'Automated webhook routing to push closed-won deals and qualified pipeline values back into Google Ads Smart Bidding using captured GCLID and enhanced identifiers.',
    featuredImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'CRM pipeline and automated workflows',
    author: {
      name: 'Bayezid Mir',
      title: 'Marketing Measurement & Attribution Specialist'
    },
    publicationDate: '2026-09-04T11:00:00.000Z',
    updatedDate: '2026-09-15T12:00:00.000Z',
    readingTime: 7,
    status: 'published',
    isFeatured: true,
    seoTitle: 'HubSpot to Google Ads Offline Conversion Guide – Bayezid Mir',
    metaDescription: 'Step-by-step setup to capture GCLID in HubSpot forms and push closed-won deal values to Google Ads conversion tracking.',
    canonicalUrl: 'https://bayezidmir.com/offline-conversion-tracking/hubspot-google-ads',
    relatedArticleIds: ['art-6', 'art-2'],
    contentHtml: `
      <h2>The Need for Value-Based B2B Optimization</h2>
      <p>When Google Ads only optimizes for form fills, the bidding algorithm frequently finds individuals who submit forms easily but have zero buying intent. Offline Conversion Tracking (OCT) bridges this gap by feeding back actual revenue when leads transition to "Sales Qualified Lead" or "Closed Won" in HubSpot.</p>

      <h2>Step 1: Capturing the GCLID in HubSpot</h2>
      <p>Create a hidden property in HubSpot named <code>gclid</code>. Embed an automated script on all web pages to parse the query parameter from the landing URL and store it in a first-party cookie:</p>

      <pre><code>// Store GCLID in 90-day first-party cookie
const urlParams = new URLSearchParams(window.location.search);
const gclid = urlParams.get('gclid');
if (gclid) {
  document.cookie = "gclid=" + gclid + "; path=/; max-age=" + (90 * 24 * 60 * 60) + "; SameSite=Lax";
}</code></pre>
    `
  },
  {
    id: 'art-6',
    title: 'GoHighLevel to Meta CAPI: Passing Downstream Lead Milestones Back to Meta Ads',
    slug: 'gohighlevel-meta',
    primaryTopicSlug: 'offline-conversion-tracking',
    secondaryTopicSlugs: ['crm-conversion-tracking', 'conversion-tracking'],
    tags: ['GoHighLevel', 'Meta CAPI', 'fbp', 'fbc', 'Lead Quality'],
    excerpt: 'How to map booking confirmations, show rates, and sales appointments in GoHighLevel to custom Meta offline events to train algorithm bidding on revenue rather than cheap leads.',
    featuredImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Business meeting and conversion milestone',
    author: {
      name: 'Bayezid Mir',
      title: 'Marketing Measurement & Attribution Specialist'
    },
    publicationDate: '2026-09-08T09:30:00.000Z',
    updatedDate: '2026-09-16T10:00:00.000Z',
    readingTime: 5,
    status: 'published',
    isFeatured: false,
    seoTitle: 'GoHighLevel to Meta CAPI Offline Tracking – Bayezid Mir',
    metaDescription: 'Send GoHighLevel opportunity stage updates and appointment shows back to Meta CAPI for improved ad targeting and CPA reduction.',
    canonicalUrl: 'https://bayezidmir.com/offline-conversion-tracking/gohighlevel-meta',
    relatedArticleIds: ['art-5', 'art-1'],
    contentHtml: `
      <h2>Upgrading from Lead Quantity to Lead Quality</h2>
      <p>For service businesses and agencies utilizing GoHighLevel (GHL), optimizing for initial opt-in submissions often floods the sales team with no-shows. By capturing Meta click cookies (<code>_fbc</code> and <code>_fbp</code>) and dispatching webhook signals upon appointment confirmation, Meta's AI optimizes targeting specifically for high-intent prospects.</p>
    `
  },
  {
    id: 'art-7',
    title: 'Deploying Meta Conversions API via Server-Side GTM on Stape',
    slug: 'meta-capi-with-stape',
    primaryTopicSlug: 'server-side-tracking',
    secondaryTopicSlugs: ['conversion-tracking'],
    tags: ['Stape', 'sGTM', 'Meta CAPI', 'Custom Domain'],
    excerpt: 'Step-by-step technical architecture for routing server events through a custom tagging sub-domain on Stape to bypass ad blockers and extend first-party cookie lifetimes.',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Server cloud infrastructure and network routing',
    author: {
      name: 'Bayezid Mir',
      title: 'Marketing Measurement & Attribution Specialist'
    },
    publicationDate: '2026-09-12T13:45:00.000Z',
    updatedDate: '2026-09-18T15:10:00.000Z',
    readingTime: 7,
    status: 'published',
    isFeatured: true,
    seoTitle: 'Deploy Meta CAPI with sGTM & Stape – Bayezid Mir',
    metaDescription: 'Complete deployment guide for hosting server-side GTM containers on Stape with custom tagging domains and Meta CAPI integration.',
    canonicalUrl: 'https://bayezidmir.com/server-side-tracking/meta-capi-with-stape',
    relatedArticleIds: ['art-1', 'art-8'],
    contentHtml: `
      <h2>Why Stape for Server-Side GTM?</h2>
      <p>While Google Cloud Platform (GCP) provides direct App Engine deployment, managing cloud load balancers and domain mappings introduces maintenance overhead. Stape provides an optimized hosting environment for sGTM containers, incorporating native features such as automatic custom loader scripts, Anonymizer plugins, and cookie keeper extensions.</p>

      <h2>Configuring the Custom Tagging Sub-Domain</h2>
      <p>To ensure first-party cookie context, the tagging server URL must be mapped to your main brand domain (e.g., <code>ss.yourdomain.com</code>). This prevents browsers from classifying tracking cookies as cross-site third-party artifacts.</p>
    `
  },
  {
    id: 'art-8',
    title: 'GA4 Ecommerce Tracking: Complete DataLayer Specification & Validation',
    slug: 'ga4-ecommerce-tracking',
    primaryTopicSlug: 'google-analytics-4',
    secondaryTopicSlugs: ['shopify-tracking', 'woocommerce-tracking'],
    tags: ['GA4', 'DataLayer', 'Ecommerce', 'DebugView'],
    excerpt: 'A bulletproof DataLayer event schema for view_item, add_to_cart, begin_checkout, and purchase, with automated QA scripts for event validation.',
    featuredImage: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=1200&q=80',
    featuredImageAlt: 'Ecommerce analytics checkout and purchase metrics',
    author: {
      name: 'Bayezid Mir',
      title: 'Marketing Measurement & Attribution Specialist'
    },
    publicationDate: '2026-09-16T15:00:00.000Z',
    updatedDate: '2026-09-19T17:00:00.000Z',
    readingTime: 6,
    status: 'published',
    isFeatured: false,
    seoTitle: 'GA4 Ecommerce DataLayer Specification – Bayezid Mir',
    metaDescription: 'Standardized DataLayer event specs for GA4 ecommerce, covering view_item, add_to_cart, checkout steps, and purchase validation.',
    canonicalUrl: 'https://bayezidmir.com/google-analytics-4/ga4-ecommerce-tracking',
    relatedArticleIds: ['art-3', 'art-7'],
    contentHtml: `
      <h2>The Standardized GA4 Ecommerce Schema</h2>
      <p>GA4 requires strict adherence to item-array structures. Any deviations in property naming (such as using <code>id</code> instead of <code>item_id</code> or missing <code>currency</code>) cause events to be discarded in Monetization reports.</p>

      <pre><code>// Standard purchase payload
window.dataLayer.push({ ecommerce: null }); // Clear previous ecommerce object
window.dataLayer.push({
  event: "purchase",
  ecommerce: {
    transaction_id: "T_12345",
    value: 125.00,
    tax: 10.00,
    shipping: 5.00,
    currency: "USD",
    items: [
      {
        item_id: "SKU_987",
        item_name: "Attribution Audit Consultation",
        price: 125.00,
        quantity: 1
      }
    ]
  }
});</code></pre>
    `
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'media-1',
    title: 'Data Pipelines & Event Streaming',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    altText: 'Abstract representation of streaming data pipelines and attribution coordinates',
    filename: 'data-pipelines.jpg',
    size: 245000,
    mimeType: 'image/jpeg',
    width: 1200,
    height: 800,
    createdAt: '2026-08-10T10:00:00.000Z'
  },
  {
    id: 'media-2',
    title: 'Analytics Dashboard',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    altText: 'Clean digital dashboard showing marketing analytics and conversion trends',
    filename: 'analytics-dashboard.jpg',
    size: 310000,
    mimeType: 'image/jpeg',
    width: 1200,
    height: 800,
    createdAt: '2026-08-15T12:00:00.000Z'
  },
  {
    id: 'media-3',
    title: 'Customer Journey Graph',
    url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    altText: 'Visual chart illustrating multi-touch attribution pathways',
    filename: 'journey-graph.jpg',
    size: 198000,
    mimeType: 'image/jpeg',
    width: 1200,
    height: 800,
    createdAt: '2026-08-20T14:00:00.000Z'
  },
  {
    id: 'media-4',
    title: 'Server Cloud Infrastructure',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    altText: 'Server network nodes and cloud proxy architecture',
    filename: 'server-cloud.jpg',
    size: 280000,
    mimeType: 'image/jpeg',
    width: 1200,
    height: 800,
    createdAt: '2026-09-01T09:00:00.000Z'
  }
];

export const INITIAL_REDIRECTS: Redirect301[] = [];
