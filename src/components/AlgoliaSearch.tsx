import React from 'react';
import 'instantsearch.css/themes/satellite.css';
import { liteClient as algoliasearch, type Hit as AlgoliaHit } from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, Snippet, Configure, PoweredBy, useSearchBox } from 'react-instantsearch';

interface AlgoliaSearchProps {
  appId: string;
  searchKey: string;
  indexName: string;
}

interface Hit extends AlgoliaHit {
  objectID: string;
  title: string;
  content: string;
  url: string;
  type: 'page' | 'blog';
  excerpt?: string;
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
      className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="flex items-start space-x-3">
        <span className="text-lg mt-0.5">{getResultIcon(hit.type || 'page')}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {hit.title || 'No title'}
            </h3>
            <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
              {getResultTypeLabel(hit.type || 'page')}
            </span>
          </div>
          {(hit.excerpt || hit.content) && (
            <p className="text-xs text-gray-600 line-clamp-2">
              {hit.excerpt ? (
                /* @ts-expect-error Algolia types seem incorrect */
                <Snippet attribute="excerpt" hit={hit} />
              ) : (
                /* @ts-expect-error Algolia types seem incorrect */
                <Snippet attribute="content" hit={hit} />
              )}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}

const ConditionalHits = () => {
  const { query } = useSearchBox();

  // Only show hits if there's a query
  if (!query || query.trim().length < 2) {
    return null;
  }

  return (
    <div className="absolute z-[9999] w-full mt-1">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
        <Hits
          hitComponent={HitComponent}
          classNames={{
            root: '',
            list: 'py-2',
            item: ''
          }}
        />
        <div className="px-4 py-2 border-t border-gray-100">
          <PoweredBy />
        </div>
      </div>
    </div>
  );
};

export default function AlgoliaSearch({ appId, searchKey, indexName }: AlgoliaSearchProps) {
  const searchClient = algoliasearch(appId, searchKey);

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
          <ConditionalHits />
        </div>
      </InstantSearch>
    </div>
  );
}
