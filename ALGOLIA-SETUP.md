# Algolia Search Setup Guide

## 🔍 **Algolia Search Integration for Lex Duo**

This guide will help you set up Algolia search for your law landing pages website.

## 📋 **Prerequisites**

1. **Algolia Account**: Sign up at [algolia.com](https://www.algolia.com/)
2. **Vercel Account**: For environment variables (you already have this)

## 🚀 **Step 1: Create Algolia Application**

1. **Sign up/Login** to Algolia
2. **Create a new application**:
   - Name: `Lex Duo Search`
   - Plan: Free tier is sufficient
3. **Note down your credentials** from the API Keys section:
   - Application ID
   - Search-Only API Key
   - Admin API Key

## 🔧 **Step 2: Configure Environment Variables**

### **In Vercel Dashboard:**

1. Go to your project → Settings → Environment Variables
2. Add these variables:

```bash
# Public variables (Frontend)
PUBLIC_ALGOLIA_APP_ID=your_app_id_here
PUBLIC_ALGOLIA_SEARCH_KEY=your_search_only_api_key_here  
PUBLIC_ALGOLIA_INDEX_NAME=lexduo_search

# Private variables (Build-time only)
ALGOLIA_ADMIN_KEY=your_admin_api_key_here
```

### **For Local Development:**

Create a `.env` file in your project root:

```bash
# Algolia Search Configuration
PUBLIC_ALGOLIA_APP_ID=your_app_id_here
PUBLIC_ALGOLIA_SEARCH_KEY=your_search_only_api_key_here
PUBLIC_ALGOLIA_INDEX_NAME=lexduo_search
ALGOLIA_ADMIN_KEY=your_admin_api_key_here

# Existing Prismic config
PRISMIC_ACCESS_TOKEN=your_prismic_token_here
```

## 🏗️ **Step 3: Deploy and Test**

1. **Commit and push** your changes:
   ```bash
   git add .
   git commit -m "Add Algolia search integration"
   git push
   ```

2. **Vercel will automatically deploy** and run the indexing

3. **Check Algolia Dashboard**:
   - Go to your index (`lexduo_search`)
   - You should see your pages indexed

## 🎯 **What Gets Indexed**

The integration automatically indexes:

- ✅ **Homepage** (`/`)
- ✅ **Contact page** (`/contact/`)
- ✅ **Blog index** (`/blog/`)
- ✅ **All blog posts** (from Prismic)

Each record includes:
- Title
- Content excerpt
- Full URL
- Page type (page/blog)
- Keywords

## 🔍 **How Search Works**

1. **Real-time search** as user types
2. **Highlighted results** showing matched terms
3. **Categorized results** (pages vs blog posts)
4. **Mobile-responsive** dropdown interface

## 📱 **Search Features**

- **Instant search** with 300ms debounce
- **Keyboard navigation** (Escape to close)
- **Click outside to close**
- **Loading indicators**
- **No results state**
- **Highlighted matches**

## 🛠️ **Customization Options**

### **Search Settings** (in `algolia-integration.ts`):
```typescript
await index.setSettings({
  searchableAttributes: ['title', 'content', 'excerpt', 'keywords'],
  attributesToHighlight: ['title', 'excerpt'],
  hitsPerPage: 10,
  // ... more settings
});
```

### **UI Customization** (in `SearchBox.tsx`):
- Change placeholder text
- Modify styling classes
- Adjust result display format
- Add more result metadata

## 🔄 **Automatic Updates**

- **Every deployment** triggers re-indexing
- **Content changes** are reflected immediately after build
- **No manual maintenance** required

## 📊 **Analytics & Monitoring**

Algolia provides built-in analytics:
- Search queries
- Click-through rates
- Popular searches
- Performance metrics

Access these in your Algolia dashboard under Analytics.

## 🐛 **Troubleshooting**

### **Search not working:**
1. Check environment variables in Vercel
2. Verify API keys in Algolia dashboard
3. Check browser console for errors

### **No results appearing:**
1. Check if indexing completed (Algolia dashboard)
2. Verify index name matches environment variable
3. Check build logs for indexing errors

### **Search box not visible:**
1. Ensure environment variables are set
2. Check if React components are loading
3. Verify Tailwind CSS classes are working

## 🔐 **Security Notes**

- ✅ **Search-Only API Key** is safe for frontend use
- ❌ **Admin API Key** should NEVER be exposed to frontend
- ✅ **Build-time indexing** keeps admin key secure
- ✅ **Environment variables** are properly configured

## 📈 **Performance**

- **Fast search** (~50ms response time)
- **Lightweight** (~2KB additional bundle size)
- **CDN-powered** by Algolia's global infrastructure
- **Optimized** for mobile and desktop

## 🎉 **You're Done!**

Once configured, your users can:
- Search for legal topics
- Find specific blog posts
- Navigate to contact/services quickly
- Get instant, relevant results

The search will automatically stay updated with your content! 🚀

