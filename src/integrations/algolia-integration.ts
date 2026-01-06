import type { AstroIntegration } from "astro";
import { algoliasearch } from "algoliasearch";
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
        // Skip if no Algolia credentials
        if (!process.env.ALGOLIA_APP_ID || !process.env.ALGOLIA_ADMIN_KEY || !process.env.ALGOLIA_INDEX_NAME) {
          console.log("⚠️ Algolia credentials not found. Skipping search indexing.");
          console.log("Set ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY, and ALGOLIA_INDEX_NAME environment variables.");
          return;
        }

        try {
          const client = algoliasearch(
            process.env.ALGOLIA_APP_ID,
            process.env.ALGOLIA_ADMIN_KEY
          );
          
          const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);
          
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

          // Upload to Algolia
          if (records.length > 0) {
            await index.replaceAllObjects(records);
            console.log(`✅ Successfully indexed ${records.length} pages to Algolia`);
            
            // Configure search settings
            await index.setSettings({
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
