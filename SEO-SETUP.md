# SEO Analytics Setup for Lex Duo Law Firm

This document outlines the comprehensive SEO analytics setup implemented for the Lex Duo law firm website, providing Yoast-like functionality for Astro.js projects.

## 🎯 Overview

The SEO setup includes multiple analytics tools, performance monitoring, and SEO optimization features specifically designed for legal services in Ukraine.

## 📊 Analytics Tools Implemented

### 1. **Google Analytics 4 (GA4)**
- **Purpose**: Primary web analytics
- **Features**: 
  - Enhanced e-commerce tracking for legal services
  - Custom events for legal consultations
  - Service-specific tracking
  - Geographic targeting for Ukraine
- **Setup**: Replace `G-XXXXXXXXXX` in `src/components/analytics/SEOAnalytics.astro`

### 2. **Google Tag Manager (GTM)**
- **Purpose**: Centralized tag management
- **Features**:
  - Easy tag deployment
  - A/B testing capabilities
  - Enhanced conversion tracking
- **Setup**: Replace `GTM-XXXXXXXX` in analytics component

### 3. **Yandex Metrika**
- **Purpose**: Primary analytics for Ukrainian market
- **Features**:
  - Click tracking
  - Heatmaps
  - E-commerce tracking
  - Webvisor for session recording
- **Setup**: Replace `XXXXXXXX` with your Yandex Metrika ID

### 4. **Facebook Pixel**
- **Purpose**: Social media advertising and retargeting
- **Features**:
  - Custom events for legal services
  - Lookalike audience creation
  - Conversion optimization
- **Setup**: Replace `XXXXXXXXXX` with your Facebook Pixel ID

### 5. **LinkedIn Insight Tag**
- **Purpose**: B2B advertising and lead generation
- **Features**:
  - Professional audience targeting
  - Lead generation tracking
  - Company page analytics
- **Setup**: Replace `XXXXXXXX` with your LinkedIn Partner ID

### 6. **Hotjar**
- **Purpose**: User behavior analysis
- **Features**:
  - Heatmaps
  - Session recordings
  - Conversion funnels
  - User feedback tools
- **Setup**: Replace `XXXXXXXX` with your Hotjar ID

## 🚀 Performance Monitoring

### Core Web Vitals Tracking
- **LCP (Largest Contentful Paint)**: Tracks loading performance
- **FID (First Input Delay)**: Measures interactivity
- **CLS (Cumulative Layout Shift)**: Monitors visual stability

### Page Performance Metrics
- Page load time
- DOM content loaded time
- Resource loading optimization

## 📈 SEO Features

### 1. **Real-time SEO Monitor**
- **Location**: Development mode only (bottom-right corner)
- **Features**:
  - SEO score calculation (0-100)
  - Performance monitoring
  - Issue detection and recommendations
  - Target keyword tracking

### 2. **Comprehensive Keyword Strategy**
- **Primary Keywords**: Core legal service terms
- **Secondary Keywords**: Supporting legal areas
- **Long-tail Keywords**: Specific legal queries
- **Local Keywords**: Kyiv and Ukrainian market targeting
- **Service-specific Keywords**: Individual practice areas

### 3. **Structured Data (JSON-LD)**
- **LegalService Schema**: Main business entity
- **Service-specific Schemas**: Individual practice areas
- **Organization Schema**: Company information
- **ContactPage Schema**: Contact information
- **Article Schema**: Blog posts

### 4. **Enhanced Meta Tags**
- Ukrainian language targeting
- Geographic targeting for Kyiv
- Social media optimization
- Business information tags

## 🛠️ Installation & Setup

### 1. **Install Dependencies**
```bash
npm install @astrojs/sitemap @astrojs/partytown
npm install --save-dev @astrojs/check lighthouse
```

### 2. **Configure Analytics IDs**
Edit `src/components/analytics/SEOAnalytics.astro`:
```typescript
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Your GA4 ID
const GTM_ID = 'GTM-XXXXXXXX'; // Your GTM ID
// ... other IDs
```

### 3. **Update SEO Configuration**
Edit `src/config/seo.ts`:
```typescript
analytics: {
  ga4: 'G-XXXXXXXXXX',
  gtm: 'GTM-XXXXXXXX',
  yandex: 'XXXXXXXX',
  facebook: 'XXXXXXXXXX',
  linkedin: 'XXXXXXXX',
  hotjar: 'XXXXXXXX'
}
```

### 4. **Add Analytics to Layout**
In `src/layouts/Layout.astro`:
```astro
---
import SEOAnalytics from '../components/analytics/SEOAnalytics.astro';
---

<SEOAnalytics 
  pageTitle={title}
  pageDescription={description}
  pageType="homepage"
/>
```

## 📋 Available Scripts

### SEO Analysis
```bash
# Run SEO checks
npm run seo:check

# Build and analyze with Lighthouse
npm run seo:build

# Full SEO test (build + preview + analyze)
npm run seo:test
```

### Performance Testing
```bash
# Run Lighthouse analysis
npx lighthouse --output=json --output-path=./lighthouse-report.json http://localhost:4321
```

## 🎯 Custom Event Tracking

### Legal Service Events
```javascript
// Track service view
window.trackServiceView('criminal');

// Track consultation request
window.trackConsultationRequest('civil');

// Track contact form submission
window.trackContactSubmit();

// Track phone call
window.trackCall();

// Track Telegram contact
window.trackTelegram();
```

### Blog Engagement Events
```javascript
// Track blog engagement
window.trackBlogEngagement('read', 'Blog Post Title');
window.trackBlogEngagement('share', 'Blog Post Title');
```

## 📊 SEO Score Calculation

The SEO monitor calculates scores based on:

### Technical SEO (40 points)
- Page title optimization
- Meta description quality
- H1 tag presence
- Image alt text
- Structured data implementation

### Content SEO (30 points)
- Keyword optimization
- Content length
- Internal linking
- External linking

### Performance SEO (20 points)
- Page load speed
- Core Web Vitals
- Mobile optimization

### User Experience (10 points)
- Navigation structure
- Call-to-action placement
- Contact information accessibility

## 🌍 Local SEO Optimization

### Ukrainian Market Targeting
- **Language**: Ukrainian (uk)
- **Locale**: uk_UA
- **Geographic Region**: UA-30 (Kyiv)
- **Coordinates**: 50.4501;30.5234
- **Primary Search Engine**: Yandex

### Local Keywords
- адвокат Київ
- юридична допомога Київ
- адвокатська компанія Київ
- адвокат Київська область

## 📱 Mobile SEO

### Performance Optimization
- Responsive design
- Mobile-first indexing
- Accelerated Mobile Pages (AMP) ready
- Touch-friendly navigation

### Mobile Analytics
- Mobile-specific event tracking
- Mobile performance monitoring
- Mobile user behavior analysis

## 🔍 Search Console Integration

### Recommended Setup
1. **Google Search Console**
   - Submit sitemap
   - Monitor Core Web Vitals
   - Track search performance

2. **Yandex Webmaster**
   - Submit sitemap
   - Monitor indexing
   - Track search queries

3. **Bing Webmaster Tools**
   - Submit sitemap
   - Monitor backlinks
   - Track search performance

## 📈 Conversion Tracking

### Legal Service Conversions
- Contact form submissions
- Phone call tracking
- Telegram consultations
- Service-specific inquiries
- Blog engagement

### E-commerce Setup
- Service consultation requests
- Legal document downloads
- Appointment bookings
- Newsletter subscriptions

## 🚀 Performance Optimization

### Partytown Integration
- Moves analytics scripts to web workers
- Improves page load performance
- Reduces main thread blocking

### Image Optimization
- WebP format support
- Responsive images
- Lazy loading
- Compression optimization

## 📊 Reporting & Analytics

### Monthly SEO Reports
- Search engine rankings
- Organic traffic growth
- Conversion rate analysis
- Performance metrics
- User behavior insights

### Competitor Analysis
- Keyword gap analysis
- Backlink monitoring
- Content performance comparison
- Market share tracking

## 🔧 Maintenance

### Regular Tasks
- Update analytics IDs
- Monitor Core Web Vitals
- Review and update keywords
- Check structured data validity
- Update content for new legal services

### Quarterly Reviews
- SEO performance analysis
- Keyword strategy updates
- Content optimization
- Technical SEO audits
- Competitor analysis

## 📞 Support

For technical support or questions about the SEO setup:
- Check the Astro.js documentation
- Review Google Analytics documentation
- Consult Yandex Metrika guides
- Contact the development team

---

**Note**: Replace all placeholder IDs (XXXXXXXX) with your actual analytics account IDs before deploying to production.
