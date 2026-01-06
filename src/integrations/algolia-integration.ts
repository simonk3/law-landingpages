import type { AstroIntegration } from "astro";
import { algoliasearch } from "algoliasearch";

// #region agent log
fetch('http://127.0.0.1:7242/ingest/80c5de76-467e-41af-a3e9-2efd7726adea',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'algolia-integration.ts:5',message:'Module imports',data:{algoliaImportType:typeof algoliasearch,isFunction:typeof algoliasearch==='function'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'IMPORT_ISSUE'})}).catch(()=>{});
// #endregion

// Try alternative import if the named import doesn't work
let algoliaClient: any;
try {
  algoliaClient = algoliasearch;
} catch (e) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/80c5de76-467e-41af-a3e9-2efd7726adea',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'algolia-integration.ts:13',message:'Named import failed, trying default',data:{error:e.message},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'IMPORT_FALLBACK'})}).catch(()=>{});
  // #endregion
}
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";
import matter from "gray-matter";

interface SearchRecord {
  objectID: string;
  title: string;
  content: string;
  url: string;
  type: 'page' | 'blog';
  excerpt?: string;
  keywords?: string;
}

export default function algoliaIntegration(): AstroIntegration {
  return {
    name: "algolia-indexer",
    hooks: {
      "astro:build:done": async ({ dir, pages }) => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/80c5de76-467e-41af-a3e9-2efd7726adea',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'algolia-integration.ts:20',message:'Environment variables check',data:{ALGOLIA_APP_ID:!!process.env.ALGOLIA_APP_ID,ALGOLIA_ADMIN_KEY:!!process.env.ALGOLIA_ADMIN_KEY,ALGOLIA_INDEX_NAME:!!process.env.ALGOLIA_INDEX_NAME,PUBLIC_ALGOLIA_APP_ID:!!process.env.PUBLIC_ALGOLIA_APP_ID,PUBLIC_ALGOLIA_INDEX_NAME:!!process.env.PUBLIC_ALGOLIA_INDEX_NAME,allEnvKeys:Object.keys(process.env).filter(k=>k.includes('ALGOLIA'))},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'ENV_VARS'})}).catch(()=>{});
        // #endregion

        // Use PUBLIC_ prefixed variables for consistency with frontend
        const ALGOLIA_APP_ID = process.env.PUBLIC_ALGOLIA_APP_ID || process.env.ALGOLIA_APP_ID;
        const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
        const ALGOLIA_INDEX_NAME = process.env.PUBLIC_ALGOLIA_INDEX_NAME || process.env.ALGOLIA_INDEX_NAME;

        // Skip if no Algolia credentials
        if (!ALGOLIA_APP_ID || !ALGOLIA_ADMIN_KEY || !ALGOLIA_INDEX_NAME) {
          console.log("⚠️ Algolia credentials not found. Skipping search indexing.");
          console.log("Required: PUBLIC_ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, and PUBLIC_ALGOLIA_INDEX_NAME environment variables.");
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/80c5de76-467e-41af-a3e9-2efd7726adea',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'algolia-integration.ts:32',message:'Missing credentials after fix attempt',data:{hasAppId:!!ALGOLIA_APP_ID,hasAdminKey:!!ALGOLIA_ADMIN_KEY,hasIndexName:!!ALGOLIA_INDEX_NAME,appIdSource:ALGOLIA_APP_ID?'found':'missing',indexNameSource:ALGOLIA_INDEX_NAME?'found':'missing'},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'ENV_VARS'})}).catch(()=>{});
          // #endregion
          
          return;
        }

        try {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/80c5de76-467e-41af-a3e9-2efd7726adea',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'algolia-integration.ts:43',message:'About to create Algolia client',data:{appId:ALGOLIA_APP_ID?.substring(0,8)+'...',adminKey:ALGOLIA_ADMIN_KEY?.substring(0,8)+'...',indexName:ALGOLIA_INDEX_NAME,algoliaFunctionType:typeof algoliasearch},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'CLIENT_CREATION'})}).catch(()=>{});
          // #endregion

          const client = (algoliaClient || algoliasearch)(
            ALGOLIA_APP_ID,
            ALGOLIA_ADMIN_KEY
          );
          
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/80c5de76-467e-41af-a3e9-2efd7726adea',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'algolia-integration.ts:53',message:'Client created, checking methods',data:{clientType:typeof client,clientConstructor:client?.constructor?.name,hasInitIndex:!!(client&&client.initIndex),hasSearchSingleIndex:!!(client&&client.searchSingleIndex),clientMethods:client?Object.getOwnPropertyNames(client).filter(name=>typeof client[name]==='function'):null,clientKeys:client?Object.keys(client):null},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'CLIENT_METHODS'})}).catch(()=>{});
          // #endregion
          
          // For Algolia v5, we don't need to initialize an index object
          // We'll use the client directly with searchSingleIndex and replaceAllObjects
          
          const records: SearchRecord[] = [];
          
          // Index static pages
          const staticPages = [
            {
              path: 'src/pages/index.astro',
              url: '/',
              title: 'Lex Duo - Професійні адвокати в Києві',
              type: 'page' as const
            },
            {
              path: 'src/pages/contact.astro',
              url: '/contact/',
              title: 'Контакти - Lex Duo',
              type: 'page' as const
            },
            {
              path: 'src/pages/blog/index.astro',
              url: '/blog/',
              title: 'Блог - Юридичні статті та поради',
              type: 'page' as const
            }
          ];

          // Add static pages to records
          for (const page of staticPages) {
            try {
              const content = readFileSync(page.path, 'utf-8');
              const cleanContent = content
                .replace(/---[\s\S]*?---/, '') // Remove frontmatter
                .replace(/<[^>]*>/g, ' ') // Remove HTML tags
                .replace(/\s+/g, ' ') // Normalize whitespace
                .trim();

              records.push({
                objectID: page.url,
                title: page.title,
                content: cleanContent.substring(0, 8000), // Limit content length
                url: page.url,
                type: page.type,
                excerpt: cleanContent.substring(0, 200) + '...'
              });
            } catch (error) {
              console.warn(`Could not read ${page.path}:`, error);
            }
          }

          // Index blog posts from Prismic (if available)
          try {
            // Check if we have blog posts in the built site
            const blogDir = join(process.cwd(), 'dist', 'blog');
            if (statSync(blogDir).isDirectory()) {
              const blogPosts = readdirSync(blogDir).filter(file => 
                statSync(join(blogDir, file)).isDirectory()
              );

              for (const postDir of blogPosts) {
                const indexPath = join(blogDir, postDir, 'index.html');
                try {
                  const htmlContent = readFileSync(indexPath, 'utf-8');
                  
                  // Extract title from HTML
                  const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
                  const title = titleMatch ? titleMatch[1] : postDir;
                  
                  // Extract meta description
                  const descMatch = htmlContent.match(/<meta name="description" content="(.*?)"/i);
                  const description = descMatch ? descMatch[1] : '';
                  
                  // Clean content
                  const cleanContent = htmlContent
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                  records.push({
                    objectID: `/blog/${postDir}/`,
                    title: title.replace(' - Lex Duo', ''),
                    content: cleanContent.substring(0, 8000),
                    url: `/blog/${postDir}/`,
                    type: 'blog',
                    excerpt: description || cleanContent.substring(0, 200) + '...',
                    keywords: 'адвокат, юридична допомога, право, Київ'
                  });
                } catch (error) {
                  console.warn(`Could not index blog post ${postDir}:`, error);
                }
              }
            }
          } catch (error) {
            console.log("No blog posts found or error reading blog directory");
          }

          // Upload to Algolia using v5 API
          if (records.length > 0) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/80c5de76-467e-41af-a3e9-2efd7726adea',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'algolia-integration.ts:140',message:'About to upload records',data:{recordCount:records.length,hasReplaceAllObjects:!!(client&&client.replaceAllObjects),hasSetSettings:!!(client&&client.setSettings)},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'V5_API'})}).catch(()=>{});
            // #endregion

            await client.replaceAllObjects({
              indexName: ALGOLIA_INDEX_NAME,
              objects: records
            });
            console.log(`✅ Successfully indexed ${records.length} pages to Algolia`);
            
            // Configure search settings using v5 API
            await client.setSettings({
              indexName: ALGOLIA_INDEX_NAME,
              indexSettings: {
                searchableAttributes: [
                  'title',
                  'content',
                  'excerpt',
                  'keywords'
                ],
                attributesToHighlight: [
                  'title',
                  'excerpt'
                ],
                attributesToSnippet: [
                  'content:20'
                ],
                hitsPerPage: 10,
                ranking: [
                  'typo',
                  'geo',
                  'words',
                  'filters',
                  'proximity',
                  'attribute',
                  'exact',
                  'custom'
                ],
                customRanking: [
                  'desc(type)' // Prioritize pages over blog posts
                ]
              }
            });
            
            console.log("✅ Algolia search settings configured");
          } else {
            console.log("⚠️ No content found to index");
          }
          
        } catch (error) {
          console.error("❌ Error indexing to Algolia:", error);
        }
      }
    }
  };
}
