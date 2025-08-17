# Google Tag Manager Setup Guide for Lex Duo

This guide will help you set up Google Tag Manager (GTM) for your law firm website.

## 🎯 What is Google Tag Manager?

Google Tag Manager is a tag management system that allows you to quickly and easily update measurement codes and related code fragments (collectively called "tags") on your website or mobile app. It's particularly useful for managing multiple analytics and marketing tools from one central location.

## 📋 Prerequisites

1. A Google account
2. Access to your website's code
3. Basic understanding of web analytics

## 🚀 Step-by-Step Setup

### 1. Create a Google Tag Manager Account

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Click "Create Account"
3. Fill in the account details:
   - **Account Name**: `Lex Duo Law Firm`
   - **Country**: `Ukraine`
4. Click "Next"

### 2. Create a Container

1. **Container Name**: `Lex Duo Website`
2. **Target Platform**: `Web`
3. Click "Create"

### 3. Accept the Terms of Service

Read and accept the Google Tag Manager Terms of Service.

### 4. Get Your GTM Container ID

After creating the container, you'll see a container ID in the format `GTM-XXXXXXX`. Copy this ID.

### 5. Update Your Website Code

#### Option A: Use the GTMConfig Component (Recommended)

1. Update the GTM ID in your layout file:

```astro
---
import GTMConfig from '../components/analytics/GTMConfig.astro';
---

<GTMConfig gtmId="GTM-XXXXXXX" />
```

#### Option B: Manual Implementation

Replace `GTM-XXXXXXXX` in the following files with your actual GTM ID:

1. **src/layouts/Layout.astro** (lines 26 and 35)
2. **src/components/analytics/SEOAnalytics.astro** (line 25)

### 6. Verify Installation

1. Open your website
2. Open browser developer tools (F12)
3. Go to the Console tab
4. Type `dataLayer` and press Enter
5. You should see an array with GTM data

## 🔧 GTM Container Setup

### 1. Add Google Analytics 4

1. In GTM, go to **Tags** → **New**
2. Click **Tag Configuration** → **Google Analytics: GA4 Configuration**
3. Enter your GA4 Measurement ID (G-XXXXXXXX)
4. Set trigger to **All Pages**
5. Save and publish

### 2. Add Custom Events

Create tags for important user interactions:

#### Contact Form Submission
- **Tag Type**: Google Analytics: GA4 Event
- **Event Name**: `contact_form_submit`
- **Trigger**: Custom Event → `contact_form_submit`

#### Phone Call Tracking
- **Tag Type**: Google Analytics: GA4 Event
- **Event Name**: `phone_call`
- **Trigger**: Click → All Elements → Click Text contains "phone"

#### Service Page Views
- **Tag Type**: Google Analytics: GA4 Event
- **Event Name**: `service_view`
- **Trigger**: Page View → Page Path contains "/services"

### 3. Add Enhanced E-commerce

For tracking legal service consultations:

1. **Tag Type**: Google Analytics: GA4 Event
2. **Event Name**: `begin_checkout`
3. **Parameters**:
   - `currency`: `UAH`
   - `value`: `{{Event Value}}`
   - `items`: `{{Ecommerce Items}}`

## 📊 Recommended Tags for Law Firms

### 1. Analytics Tags
- Google Analytics 4
- Yandex Metrika
- Facebook Pixel
- LinkedIn Insight Tag

### 2. Marketing Tags
- Google Ads Conversion Tracking
- Facebook Ads Conversion Tracking
- LinkedIn Ads Conversion Tracking

### 3. User Experience Tags
- Hotjar
- Microsoft Clarity
- Google Optimize

### 4. Legal-Specific Tags
- Consultation Request Tracking
- Document Download Tracking
- Case Status Inquiry Tracking

## 🎯 Custom Events for Legal Services

### 1. Consultation Events
```javascript
// Track consultation requests
dataLayer.push({
  'event': 'consultation_request',
  'service_type': 'criminal_law',
  'consultation_type': 'initial',
  'value': 1000
});
```

### 2. Service View Events
```javascript
// Track service page views
dataLayer.push({
  'event': 'service_view',
  'service_category': 'civil_law',
  'service_name': 'family_law',
  'page_title': 'Сімейне право'
});
```

### 3. Contact Events
```javascript
// Track contact form submissions
dataLayer.push({
  'event': 'contact_form_submit',
  'form_name': 'main_contact',
  'contact_method': 'form',
  'page_location': '/contact'
});
```

## 🔍 Testing and Debugging

### 1. GTM Preview Mode
1. In GTM, click **Preview**
2. Enter your website URL
3. Click **Start**
4. Navigate your website to test events

### 2. Google Tag Assistant
1. Install Google Tag Assistant Legacy browser extension
2. Enable it on your website
3. Check for any errors or warnings

### 3. Browser Developer Tools
1. Open Console (F12)
2. Type `dataLayer` to see all events
3. Check Network tab for GTM requests

## 📈 Performance Optimization

### 1. Use Partytown (Already Implemented)
Your Astro configuration already includes Partytown for better performance:

```javascript
// In astro.config.mjs
export default defineConfig({
  integrations: [
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    }),
  ],
});
```

### 2. Lazy Load Non-Critical Tags
Use triggers to load tags only when needed:
- Load marketing tags only after user interaction
- Load analytics tags immediately
- Load UX tools after page load

### 3. Optimize Data Layer
Keep dataLayer pushes minimal and efficient:
```javascript
// Good
dataLayer.push({
  'event': 'service_view',
  'service': 'criminal_law'
});

// Avoid
dataLayer.push({
  'event': 'service_view',
  'service': 'criminal_law',
  'timestamp': new Date().toISOString(),
  'user_agent': navigator.userAgent,
  // ... many more properties
});
```

## 🛡️ Privacy and Compliance

### 1. GDPR Compliance
- Implement cookie consent before loading GTM
- Use GTM's consent mode
- Respect user privacy preferences

### 2. Cookie Consent Integration
```javascript
// Example consent management
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  'event': 'consent_update',
  'consent_state': {
    'analytics_storage': 'granted',
    'ad_storage': 'denied'
  }
});
```

### 3. Data Retention
- Set appropriate data retention periods in GA4
- Regularly review and clean up old data
- Comply with Ukrainian data protection laws

## 📊 Reporting and Analysis

### 1. GTM Built-in Reports
- Tag firing reports
- Error reports
- Performance reports

### 2. Google Analytics Integration
- Real-time reports
- Conversion tracking
- User behavior analysis

### 3. Custom Dashboards
Create dashboards for:
- Legal service performance
- Contact form conversions
- Geographic distribution of clients
- Service category popularity

## 🔧 Maintenance

### 1. Regular Tasks
- Monitor tag firing
- Check for errors
- Update tag configurations
- Review performance impact

### 2. Monthly Reviews
- Analyze conversion rates
- Review user behavior
- Optimize tag configurations
- Update privacy settings

### 3. Quarterly Audits
- Full tag audit
- Performance review
- Privacy compliance check
- Strategy updates

## 🆘 Troubleshooting

### Common Issues

1. **Tags Not Firing**
   - Check trigger conditions
   - Verify GTM container ID
   - Check browser console for errors

2. **Data Not Appearing in GA4**
   - Verify GA4 configuration in GTM
   - Check measurement ID
   - Ensure proper event names

3. **Performance Issues**
   - Use Partytown integration
   - Optimize trigger conditions
   - Remove unnecessary tags

### Debug Mode
Enable debug mode in development:
```astro
<GTMConfig gtmId="GTM-XXXXXXX" enableDebug={true} />
```

## 📞 Support

For technical support:
1. Check GTM documentation
2. Review Google Analytics help center
3. Contact your web developer
4. Use GTM community forums

## 🔗 Useful Resources

- [Google Tag Manager Help](https://support.google.com/tagmanager/)
- [Google Analytics Help](https://support.google.com/analytics/)
- [GTM Community](https://www.en.advertisercommunity.com/t5/Google-Tag-Manager/ct-p/Google_Tag_Manager)
- [Astro Partytown Documentation](https://docs.astro.build/en/guides/integrations-guide/partytown/)

---

**Note**: Replace all placeholder IDs (GTM-XXXXXXXX, G-XXXXXXXXXX) with your actual Google Tag Manager and Google Analytics IDs.

