import * as prismic from '@prismicio/client';
import * as prismicH from '@prismicio/helpers';

// Fill in your repository name
export const repositoryName = 'bureau-kush';

if (!import.meta.env.PRISMIC_ACCESS_TOKEN) {
  console.error('PRISMIC_ACCESS_TOKEN is not defined in environment variables');
}

export const client = prismic.createClient(repositoryName, {
  accessToken: import.meta.env.PRISMIC_ACCESS_TOKEN,
});

// The route is built from custom_url.uid when set, so every internal link must
// resolve the same way or it points at a URL that was never generated.
export const postSlug = (doc: any) => doc?.data?.custom_url?.uid || doc?.uid;

export const linkResolver = (doc: any) => {
  if (doc.type === 'blog-post') {
    // First try to use custom URL if it exists
    if (doc.data?.custom_url?.uid) {
      return `/blog/${doc.data.custom_url.uid}/`;
    }
    // Fallback to default URL structure
    return `/blog/${doc.uid}/`;
  }
  return '/';
};

const escapeHtml = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Only http(s), mailto and tel links are emitted; anything else (javascript:, data:)
// is dropped rather than rendered.
const safeUrl = (value: unknown) => {
  const url = String(value ?? '').trim();
  return /^(https?:|mailto:|tel:|\/|#)/i.test(url) ? escapeHtml(url) : '';
};

// Custom HTML serializer
export const htmlSerializer = (type: any, element: any, content: any, children: any) => {
  // Helper function to safely join children
  const joinChildren = (children: any) => {
    if (Array.isArray(children)) {
      return children.join('');
    }
    return children || '';
  };

  // Handle images
  if (type === 'image') {
    return `<img src="${safeUrl(element.url)}" alt="${escapeHtml(element.alt)}" loading="lazy" decoding="async" class="w-full h-auto rounded-lg my-8" />`;
  }

  // Handle paragraphs
  if (type === 'paragraph') {
    return `<p class="mb-4">${joinChildren(children)}</p>`;
  }

  // Handle headings
  if (type === 'heading1') {
    return `<h1 class="text-3xl font-bold mb-4">${joinChildren(children)}</h1>`;
  }
  if (type === 'heading2') {
    return `<h2 class="text-2xl font-bold mb-3">${joinChildren(children)}</h2>`;
  }
  if (type === 'heading3') {
    return `<h3 class="text-xl font-bold mb-2">${joinChildren(children)}</h3>`;
  }

  // Handle lists
  if (type === 'list-item') {
    return `<li class="mb-2">${joinChildren(children)}</li>`;
  }
  if (type === 'o-list-item') {
    return `<li class="mb-2">${joinChildren(children)}</li>`;
  }
  if (type === 'list') {
    return `<ul class="list-disc pl-6 mb-4">${joinChildren(children)}</ul>`;
  }
  if (type === 'o-list') {
    return `<ol class="list-decimal pl-6 mb-4">${joinChildren(children)}</ol>`;
  }

  // Handle links
  if (type === 'hyperlink') {
    const href = safeUrl(element.data?.url);
    if (!href) return joinChildren(children);
    // External links open in a new tab without handing the opener window over.
    const external = /^https?:/i.test(href) && !href.includes('lexduo.com.ua');
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<a href="${href}"${attrs} class="text-primary hover:underline">${joinChildren(children)}</a>`;
  }

  // Handle strong and em
  if (type === 'strong') {
    return `<strong class="font-bold">${joinChildren(children)}</strong>`;
  }
  if (type === 'em') {
    return `<em class="italic">${joinChildren(children)}</em>`;
  }

  // Default case
  return null;
}; 
/**
 * First image found in a post's rich-text slices.
 * Both blog templates carried their own identical copy of this walk.
 */
export const resolvePostImage = (
  doc: any
): { url: string; alt: string } | null => {
  for (const slice of doc?.data?.body || []) {
    if (slice.slice_type !== 'rich_text') continue;
    for (const item of slice.items || []) {
      for (const node of item.richtext || []) {
        if (node.type === 'image' && node.url) {
          return {
            url: node.url,
            alt: node.alt || doc?.data?.title?.[0]?.text || 'Зображення статті',
          };
        }
      }
    }
  }
  return null;
};

/** Prismic's imgix endpoint: one source, several widths. */
export const prismicSrcSet = (url: string, widths = [400, 800, 1200]) => {
  const sep = url.includes('?') ? '&' : '?';
  return {
    src: `${url}${sep}auto=compress,format&w=${widths[1] ?? widths[0]}`,
    srcset: widths
      .map((w) => `${url}${sep}auto=compress,format&w=${w} ${w}w`)
      .join(', '),
  };
};
