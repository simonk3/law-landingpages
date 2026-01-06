import React, { useEffect, useRef, useState } from 'react';
import instantsearch from 'instantsearch.js';
import { algoliasearch } from 'algoliasearch';

interface AlgoliaSearchProps {
  appId: string;
  searchKey: string;
  indexName: string;
}

export default function AlgoliaSearch({ appId, searchKey, indexName }: AlgoliaSearchProps) {
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInstanceRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchRef.current || searchInstanceRef.current) return;

    try {
      const searchClient = algoliasearch(appId, searchKey);

      // Create InstantSearch instance
      const search = instantsearch({
        indexName: indexName,
        searchClient: searchClient,
      });

      // Create search box container
      const searchBoxContainer = document.createElement('div');
      searchBoxContainer.id = `searchbox-${indexName}`;
      searchBoxContainer.className = 'relative';
      
      // Create hits container
      const hitsContainer = document.createElement('div');
      hitsContainer.id = `hits-${indexName}`;
      hitsContainer.className = 'absolute z-[9999] w-full mt-1';
      hitsContainer.style.display = 'none';

      // Create poweredBy container
      const poweredByContainer = document.createElement('div');
      poweredByContainer.id = `hits-poweredby-${indexName}`;

      searchRef.current.appendChild(searchBoxContainer);
      searchRef.current.appendChild(hitsContainer);
      hitsContainer.appendChild(poweredByContainer);

      // Add widgets
      const searchBoxWidget = instantsearch.widgets.searchBox({
        container: `#searchbox-${indexName}`,
        placeholder: 'Пошук по сайту...',
        cssClasses: {
          root: 'relative',
          form: 'relative',
          input: 'w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          submit: 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none',
          submitIcon: 'w-4 h-4 text-gray-500',
          reset: 'hidden',
          loadingIcon: 'w-4 h-4 text-gray-500'
        }
      });

      const hitsWidget = instantsearch.widgets.hits({
        container: `#hits-${indexName}`,
        templates: {
          item: (hit: any, { html, components }: any) => html`
            <a href="${hit.url}" class="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0" style="text-decoration: none; color: inherit;">
              <div class="flex items-start space-x-3">
                <span class="text-lg mt-0.5">${hit.type === 'blog' ? '📄' : '🏠'}</span>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <h3 class="text-sm font-medium text-gray-900 truncate">
                      ${components.Highlight({ hit, attribute: 'title' })}
                    </h3>
                    <span class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      ${hit.type === 'blog' ? 'Стаття' : 'Сторінка'}
                    </span>
                  </div>
                  ${hit.excerpt ? html`
                    <p class="text-xs text-gray-600 line-clamp-2">
                      ${components.Highlight({ hit, attribute: 'excerpt' })}
                    </p>
                  ` : ''}
                </div>
              </div>
            </a>
          `,
          empty: (results: any) => {
            if (!results.query || results.query.trim().length < 2) {
              return '';
            }
            return html`
              <div class="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                <div class="text-center text-gray-500">
                  <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0 0L3.515 9.829A1 1 0 012.1 8.414L5.757 4.757A1 1 0 017.172 4.343L10 7.172" />
                  </svg>
                  <p class="text-sm">Нічого не знайдено</p>
                  <p class="text-xs text-gray-400 mt-1">Спробуйте інші ключові слова</p>
                </div>
                <div class="mt-4 pt-4 border-t border-gray-100" id="hits-poweredby-empty-${indexName}"></div>
              </div>
            `;
          }
        },
        cssClasses: {
          root: 'absolute z-[9999] w-full mt-1',
          list: 'bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto py-2',
          item: ''
        }
      });

      const configureWidget = instantsearch.widgets.configure({
        hitsPerPage: 8,
      });

      const poweredByWidget = instantsearch.widgets.poweredBy({
        container: `#hits-poweredby-${indexName}`,
      });

      search.addWidgets([searchBoxWidget, hitsWidget, configureWidget, poweredByWidget]);

      // Show/hide hits container based on query
      search.on('render', () => {
        const renderState = search.renderState[indexName];
        const query = renderState?.searchBox?.query || '';
        
        if (query && query.trim().length >= 2) {
          hitsContainer.style.display = 'block';
        } else {
          hitsContainer.style.display = 'none';
        }
      });

      // Start the search
      search.start();
      searchInstanceRef.current = search;
      setIsInitialized(true);
    } catch (err: any) {
      console.error('Algolia search initialization error:', err);
      setError(err.message);
    }

    // Cleanup
    return () => {
      if (searchInstanceRef.current) {
        try {
          searchInstanceRef.current.dispose();
        } catch (e) {
          console.error('Error disposing search:', e);
        }
        searchInstanceRef.current = null;
      }
    };
  }, [appId, searchKey, indexName]);

  // Show fallback input if not initialized or error
  if (error || !isInitialized) {
    return (
      <div className="relative w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Пошук по сайту..."
            disabled
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {error && (
          <div className="mt-2 text-xs text-red-500">
            Search initialization error: {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md" style={{ position: 'relative', zIndex: 1000 }}>
      <div ref={searchRef} className="relative"></div>
    </div>
  );
}
