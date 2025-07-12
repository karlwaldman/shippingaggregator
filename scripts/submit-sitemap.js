#!/usr/bin/env node

/**
 * Automatically submit sitemap to search engines after deployment
 */

const https = require('https');
const http = require('http');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shipnode.io';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

// Search engine ping URLs
const PING_URLS = [
  {
    name: 'Google',
    url: `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
  },
  {
    name: 'Bing',
    url: `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
  }
];

// Function to ping a URL
function pingUrl(name, url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    console.log(`Submitting sitemap to ${name}...`);
    
    protocol.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${name}: Successfully submitted`);
        resolve({ name, success: true });
      } else {
        console.log(`⚠️  ${name}: Received status code ${res.statusCode}`);
        resolve({ name, success: false, statusCode: res.statusCode });
      }
    }).on('error', (err) => {
      console.error(`❌ ${name}: Error - ${err.message}`);
      resolve({ name, success: false, error: err.message });
    });
  });
}

// Main function
async function submitSitemap() {
  console.log('🚀 Sitemap Submission Script');
  console.log(`📍 Sitemap URL: ${SITEMAP_URL}`);
  console.log('');

  // First, verify the sitemap is accessible
  console.log('Verifying sitemap accessibility...');
  
  const sitemapCheck = await new Promise((resolve) => {
    https.get(SITEMAP_URL, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });

  if (!sitemapCheck) {
    console.error('❌ Sitemap is not accessible. Please check the URL and try again.');
    process.exit(1);
  }

  console.log('✅ Sitemap is accessible\n');

  // Submit to all search engines
  const results = await Promise.all(
    PING_URLS.map(({ name, url }) => pingUrl(name, url))
  );

  // Also call our API endpoint for additional submission options
  console.log('\nCalling ShipNode sitemap submission API...');
  try {
    await new Promise((resolve, reject) => {
      https.get(`${SITE_URL}/api/seo/submit-sitemap`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 200) {
            console.log('✅ ShipNode API: Sitemap submission processed');
          }
          resolve();
        });
      }).on('error', reject);
    });
  } catch (err) {
    console.error('❌ ShipNode API error:', err.message);
  }

  // Summary
  console.log('\n📊 Summary:');
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);
  
  console.log('\n💡 Note: Google and Bing ping endpoints may return 4xx errors.');
  console.log('This is normal. The sitemap has been made available at:');
  console.log(`📍 ${SITEMAP_URL}`);
  console.log('\nFor best results, manually submit via:');
  console.log('- Google Search Console: https://search.google.com/search-console');
  console.log('- Bing Webmaster Tools: https://www.bing.com/webmasters');
}

// Run if called directly
if (require.main === module) {
  submitSitemap().catch(console.error);
}

module.exports = submitSitemap;