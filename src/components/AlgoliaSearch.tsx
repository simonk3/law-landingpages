import React, { useState, useEffect } from 'react';
import 'instantsearch.css/themes/satellite.css';
import { liteClient as algoliasearch } from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Highlight, Snippet, Configure, PoweredBy, useSearchBox, useHits } from 'react-instantsearch';

interface AlgoliaSearchProps {
  appId: string;
  searchKey: string;
  indexName: string;
}

interface Hit {
  objectID: string;
  title: string;
  content: string;
  url: string;
  type: 'page' | 'blog';
  excerpt?: string;
  _highlightResult?: {
    title?: { value: string };
    excerpt?: { value: string };
    content?: { value: string };
  };
}

function HitComponent({ hit }: { hit: Hit }) {
  const getResultIcon = (type: string) => {
    return type === 'blog' ? '📄' : '🏠';
  };

  const getResultTypeLabel = (type: string) => {
    return type === 'blog' ? 'Стаття' : 'Сторінка';
  };

  return (
    <a
      href={hit.url}
      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg mt-0.5 flex-shrink-0">{getResultIcon(hit.type || 'page')}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              <Highlight attribute="title" hit={hit} />
            </h3>
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded flex-shrink-0">
              {getResultTypeLabel(hit.type || 'page')}
            </span>
          </div>
          {(hit.excerpt || hit.content) && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {hit.excerpt ? (
                <Snippet attribute="excerpt" hit={hit} />
              ) : (
                <Snippet attribute="content" hit={hit} />
              )}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}

function SearchResults() {
  const { query } = useSearchBox();
  const { hits } = useHits<Hit>();

  // Don't show if no query or query too short
  if (!query || query.trim().length < 2) {
    return null;
  }

  // Show "no results" message
  if (hits.length === 0) {
    return (
      <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
        <div className="p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0 0L3.515 9.829A1 1 0 012.1 8.414L5.757 4.757A1 1 0 017.172 4.343L10 7.172" />
          </svg>
          <p className="text-sm font-medium text-gray-900 mb-1">Нічого не знайдено</p>
          <p className="text-xs text-gray-500">Спробуйте інші ключові слова</p>
        </div>
        <div className="px-4 py-2 border-t border-gray-100">
          <PoweredBy />
        </div>
      </div>
    );
  }

  // Show results
  return (
    <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
      <div className="py-2">
        {hits.map((hit) => (
          <HitComponent key={hit.objectID} hit={hit} />
        ))}
      </div>
      <div className="px-4 py-2 border-t border-gray-100">
        <PoweredBy />
      </div>
    </div>
  );
}

export default function AlgoliaSearch({ appId, searchKey, indexName }: AlgoliaSearchProps) {
  // Only create client on client side
  const [searchClient, setSearchClient] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const client = algoliasearch(appId, searchKey);
      setSearchClient(client);
    }
  }, [appId, searchKey]);

  if (!searchClient) {
    return (
      <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Пошук по сайту..."
          disabled
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-400 bg-gray-100 border border-gray-200 rounded-lg cursor-not-allowed"
        />
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md" style={{ position: 'relative', zIndex: 1000 }}>
      <InstantSearch searchClient={searchClient} indexName={indexName}>
        <Configure hitsPerPage={8} />
        <div className="relative">
          <SearchBox
            placeholder="Пошук по сайту..."
            classNames={{
              root: 'relative',
              form: 'relative',
              input: 'w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              submit: 'absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none',
              submitIcon: 'w-4 h-4 text-gray-500',
              reset: 'hidden',
              loadingIcon: 'w-4 h-4 text-gray-500'
            }}
          />
          <SearchResults />
        </div>
      </InstantSearch>
    </div>
  );
}
