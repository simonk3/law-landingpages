import * as prismic from '@prismicio/client';
import * as prismicH from '@prismicio/helpers';

// Fill in your repository name
export const repositoryName = 'bureau-kush';

if (!import.meta.env.PRISMIC_ACCESS_TOKEN) {
  console.error('PRISMIC_ACCESS_TOKEN is not defined in environment variables');
}

console.log('Prismic Configuration:', {
  repositoryName,
  hasAccessToken: !!import.meta.env.PRISMIC_ACCESS_TOKEN,
  accessTokenLength: import.meta.env.PRISMIC_ACCESS_TOKEN?.length
});

export const client = prismic.createClient(repositoryName, {
  accessToken: import.meta.env.PRISMIC_ACCESS_TOKEN,
  fetch: async (url, options) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: response.headers
      });
    } catch (error) {
      console.error('Prismic fetch error:', error);
      throw error;
    }
  }
});

export const linkResolver = (doc: any) => {
  if (doc.type === 'blog-post') {
    // First try to use custom URL if it exists
    if (doc.data?.custom_url?.uid) {
      return `/blog/${doc.data.custom_url.uid}`;
    }
    // Fallback to default URL structure
    return `/blog/${doc.uid}`;
  }
  return '/';
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
    return `<img src="${element.url}" alt="${element.alt || ''}" class="w-full h-auto rounded-lg my-8" />`;
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
    return `<a href="${element.data.url}" class="text-primary hover:underline">${joinChildren(children)}</a>`;
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