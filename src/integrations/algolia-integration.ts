import type { AstroIntegration } from "astro";
import { algoliasearch } from "algoliasearch";
import { loadEnv } from "vite";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import fs from "fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";
import stopword from "stopword";

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
            PUBLIC_ALGOLIA_APP_ID ?? "",
            ALGOLIA_WRITE_API_KEY ?? "",
          );

          const pathToRead = fileURLToPath(dir);
          const globResult = await glob("**/*.html", {
            cwd: pathToRead,
            ignore: ["page-views/**", "search/**"],
          });

          for (const file of globResult) {
            const filePath = path.join(pathToRead, file);
            const fileContent = await fs.readFile(filePath, "utf-8");

            // Parse HTML
            const $ = cheerio.load(fileContent);
            const title = $("h1").first().text().replace(/\s+/g, " ").trim() || 
                         $("title").text().replace(/\s+/g, " ").trim() ||
                         "Untitled";

            // Remove <script>, <footer> and <style> content
            $("script, style, footer, pre, [data-pagefind-ignore]").remove();

            // Extract text and clean up whitespace
            let text = $("body").text();
            // Normalize whitespace: replace multiple spaces, newlines, and tabs with a single space
            text = text.replace(/\s+/g, " ").trim();
            let words = text.split(/\s+/);

            // Remove stopwords to avoid hitting record size limits
            words = stopword.removeStopwords(words);

            // Convert back to a string
            const content = words.join(" ");

            // Determine URL and type
            const objectID = file === "index.html"
              ? "home"
              : file.replace("/index.html", "").replace("index.html", "");
            
            const url = objectID === "home" ? "/" : `/${objectID}/`;
            const type = file.includes("/blog/") ? "blog" : "page";

            // Extract excerpt from meta description or first part of content
            const metaDescription = $('meta[name="description"]').attr("content") || "";
            const excerpt = metaDescription || content.substring(0, 200) + "...";

            try {
              await search.partialUpdateObject({
                createIfNotExists: true,
                objectID,
                attributesToUpdate: {
                  content,
                  title: objectID === "home" ? "Homepage" : title,
                  url,
                  type,
                  excerpt,
                },
                indexName: PUBLIC_ALGOLIA_INDEX_NAME ?? "",
              });
            } catch (e) {
              logger.error("Error updating Algolia index for file: " + file);
            }
          }

          logger.info(`✅ Successfully indexed ${globResult.length} pages to Algolia`);
        } catch (error) {
          logger.error("❌ Error indexing to Algolia:", error);
        }
      },
    },
  };
}
