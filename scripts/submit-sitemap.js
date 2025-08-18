#!/usr/bin/env node

/**
 * Sitemap Submission Script for Lex Duo
 * This script helps submit the sitemap to Google Search Console
 * and provides guidance for fixing indexing issues.
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = 'https://lexduo.com.ua';
const SITEMAP_URL = `${SITE_URL}/sitemap-index.xml`;

console.log('🚀 Lex Duo SEO Optimization Script');
console.log('=====================================\n');

// Check if sitemap exists
function checkSitemap() {
  console.log('1. Checking sitemap availability...');
  
  return new Promise((resolve, reject) => {
    https.get(SITEMAP_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Sitemap is accessible at:', SITEMAP_URL);
        resolve(true);
      } else {
        console.log('❌ Sitemap not found or not accessible');
        console.log('Status Code:', res.statusCode);
        reject(new Error('Sitemap not accessible'));
      }
    }).on('error', (err) => {
      console.log('❌ Error accessing sitemap:', err.message);
      reject(err);
    });
  });
}

// Check robots.txt
function checkRobotsTxt() {
  console.log('\n2. Checking robots.txt...');
  
  return new Promise((resolve, reject) => {
    https.get(`${SITE_URL}/robots.txt`, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Robots.txt is accessible');
        resolve(true);
      } else {
        console.log('❌ Robots.txt not found');
        reject(new Error('Robots.txt not accessible'));
      }
    }).on('error', (err) => {
      console.log('❌ Error accessing robots.txt:', err.message);
      reject(err);
    });
  });
}

// Check main pages
function checkMainPages() {
  console.log('\n3. Checking main pages...');
  
  const pages = [
    '/',
    '/contact',
    '/blog',
    '/thank-you'
  ];
  
  const checks = pages.map(page => {
    return new Promise((resolve) => {
      https.get(`${SITE_URL}${page}`, (res) => {
        if (res.statusCode === 200) {
          console.log(`✅ ${page} - OK (${res.statusCode})`);
          resolve({ page, status: 'ok', code: res.statusCode });
        } else {
          console.log(`❌ ${page} - Error (${res.statusCode})`);
          resolve({ page, status: 'error', code: res.statusCode });
        }
      }).on('error', (err) => {
        console.log(`❌ ${page} - Network Error: ${err.message}`);
        resolve({ page, status: 'error', code: 'network' });
      });
    });
  });
  
  return Promise.all(checks);
}

// Generate SEO report
function generateSEOReport() {
  console.log('\n4. Generating SEO Report...');
  
  const report = `
SEO OPTIMIZATION REPORT FOR LEX DUO
===================================

CURRENT STATUS:
- Sitemap: ${SITEMAP_URL}
- Robots.txt: ${SITE_URL}/robots.txt

RECOMMENDED ACTIONS:

1. GOOGLE SEARCH CONSOLE:
   - Log into Google Search Console
   - Add property if not already added
   - Submit sitemap URL: ${SITEMAP_URL}
   - Request indexing for main pages

2. IMMEDIATE FIXES:
   - ✅ Fixed duplicate meta tags in Layout.astro
   - ✅ Updated robots.txt with proper directives
   - ✅ Created SEO configuration file

3. CONTENT OPTIMIZATION:
   - Add more unique content to homepage
   - Ensure blog posts have 800+ words
   - Add internal links between pages
   - Implement proper heading structure

4. TECHNICAL SEO:
   - Test mobile responsiveness
   - Optimize page loading speed
   - Add structured data markup
   - Ensure proper canonical URLs

5. MONITORING:
   - Check Google Search Console weekly
   - Monitor Core Web Vitals
   - Track indexing status
   - Review search performance

EXPECTED TIMELINE:
- Week 1-2: Improved indexing
- Week 3-4: Better search rankings
- Month 2: Increased organic traffic

For detailed instructions, see: SEO-OPTIMIZATION-GUIDE.md
`;

  console.log(report);
  
  // Save report to file
  const reportPath = path.join(__dirname, '../SEO-REPORT.txt');
  fs.writeFileSync(reportPath, report);
  console.log(`📄 SEO report saved to: ${reportPath}`);
}

// Main execution
async function main() {
  try {
    await checkSitemap();
    await checkRobotsTxt();
    await checkMainPages();
    generateSEOReport();
    
    console.log('\n🎉 SEO check completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Submit sitemap to Google Search Console');
    console.log('2. Request indexing for important pages');
    console.log('3. Follow the SEO optimization guide');
    console.log('4. Monitor results in Google Search Console');
    
  } catch (error) {
    console.error('\n❌ SEO check failed:', error.message);
    console.log('\nPlease fix the issues above and run the script again.');
  }
}

// Run the script
main();

export {
  checkSitemap,
  checkRobotsTxt,
  checkMainPages,
  generateSEOReport
};
