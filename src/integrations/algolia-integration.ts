import type { AstroIntegration } from "astro";
import { algoliasearch } from "algoliasearch";
import { loadEnv } from "vite";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import fs from "fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import stopword from "stopword";

interface SearchRecord {
  objectID: string;
  title: string;
  content: string;
  url: string;
  type: 'page' | 'blog';
  excerpt?: string;
}

export default function algoliaIntegration(): AstroIntegration {
  return {
    name: "algolia-indexer",
    hooks: {
      "astro:build:done": async ({ logger, dir }) => {
        const {
          PUBLIC_ALGOLIA_APP_ID,
          ALGOLIA_WRITE_API_KEY,
          PUBLIC_ALGOLIA_INDEX_NAME,
        } = loadEnv(process.env.NODE_ENV ?? "", process.cwd(), "");

        // Skip if no Algolia credentials
        if (!PUBLIC_ALGOLIA_APP_ID || !ALGOLIA_WRITE_API_KEY || !PUBLIC_ALGOLIA_INDEX_NAME) {
          logger.warn("⚠️ Algolia credentials not found. Skipping search indexing.");
          logger.info("Required: PUBLIC_ALGOLIA_APP_ID, ALGOLIA_WRITE_API_KEY, and PUBLIC_ALGOLIA_INDEX_NAME environment variables.");
          return;
        }

        try {
          const search = algoliasearch(
            PUBLIC_ALGOLIA_APP_ID,
            ALGOLIA_WRITE_API_KEY,
          );

          const pathToRead = fileURLToPath(dir);
          logger.info(`📂 Reading HTML files from: ${pathToRead}`);
          
          const globResult = await glob("**/*.html", {
            cwd: pathToRead,
            ignore: ["page-views/**", "search/**", "404.html"],
          });

          logger.info(`📄 Found ${globResult.length} HTML files to index`);

          const records: SearchRecord[] = [];

          for (const file of globResult) {
            try {
              const filePath = path.join(pathToRead, file);
              const fileContent = await fs.readFile(filePath, "utf-8");

              // Parse HTML
              const $ = cheerio.load(fileContent);
              
              // Extract title - prefer h1, fallback to title tag
              const title = $("h1").first().text().replace(/\s+/g, " ").trim() || 
                           $("title").text().replace(/\s+/g, " ").trim().replace(/\s*-\s*Lex Duo\s*$/, "") ||
                           "Untitled";

              // Remove unwanted elements
              $("script, style, footer, pre, nav, [data-pagefind-ignore]").remove();

              // Extract text content
              let text = $("body").text();
              text = text.replace(/\s+/g, " ").trim();
              
              // Remove stopwords to reduce size
              let words = text.split(/\s+/).filter(word => word.length > 0);
              words = stopword.removeStopwords(words);
              
              // Limit content to stay under 10KB record limit
              const content = words.join(" ").substring(0, 8000);

              // Determine objectID and URL
              let objectID: string;
              let url: string;
              
              if (file === "index.html") {
                objectID = "home";
                url = "/";
              } else {
                // Remove index.html and leading/trailing slashes
                objectID = file.replace(/\/index\.html$/, "").replace(/^\/|\/$/g, "") || "home";
                url = `/${objectID}/`;
              }
              
              // Determine type
              const type: 'page' | 'blog' = file.includes("/blog/") ? "blog" : "page";

              // Extract excerpt
              const metaDescription = $('meta[name="description"]').attr("content") || "";
              const excerpt = metaDescription || content.substring(0, 200).trim();

              records.push({
                objectID,
                title,
                content,
                url,
                type,
                excerpt: excerpt || undefined,
              });

              logger.info(`✅ Prepared record: ${objectID} - ${title}`);
            } catch (error) {
              logger.error(`❌ Error processing file ${file}:`, error);
            }
          }

          if (records.length === 0) {
            logger.warn("⚠️ No records to index");
            return;
          }

          // Index all records using replaceAllObjects (more efficient than partialUpdateObject for full reindex)
          logger.info(`📤 Uploading ${records.length} records to Algolia...`);
          
          await search.replaceAllObjects({
            indexName: PUBLIC_ALGOLIA_INDEX_NAME,
            objects: records,
          });

          logger.info(`✅ Successfully indexed ${records.length} pages to Algolia`);

          // Configure search settings
          await search.setSettings({
            indexName: PUBLIC_ALGOLIA_INDEX_NAME,
            indexSettings: {
              searchableAttributes: [
                'title',
                'excerpt',
                'content',
              ],
              attributesToHighlight: [
                'title',
                'excerpt',
              ],
              attributesToSnippet: [
                'excerpt:20',
                'content:20',
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
            }
          });

          logger.info("✅ Algolia search settings configured");
        } catch (error) {
          logger.error("❌ Error indexing to Algolia:", error);
          if (error instanceof Error) {
            logger.error("Error details:", error.message);
            logger.error("Stack:", error.stack);
          }
        }
      },
    },
  };
}
