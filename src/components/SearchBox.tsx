import React, { useState, useEffect, useRef } from 'react';
import { algoliasearch } from 'algoliasearch';

interface SearchResult {
  objectID: string;
  title: string;
  content: string;
  url: string;
  type: 'page' | 'blog';
  excerpt?: string;
  _highlightResult?: {
    title?: { value: string };
    excerpt?: { value: string };
  };
}

interface SearchBoxProps {
  appId: string;
  searchKey: string;
  indexName: string;
}

export default function SearchBox({ appId, searchKey, indexName }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Only initialize Algolia client on the client-side (v5 API)
  const client = typeof window !== 'undefined' ? algoliasearch(appId, searchKey) : null;

  // Debug: Component mount
  React.useEffect(() => {
    console.log('🔍 SearchBox mounted:', {
      hasAppId: !!appId,
      hasSearchKey: !!searchKey,
      indexName,
      hasClient: !!client,
      clientType: typeof client
    });
  }, []);

  // Debug: State changes
  React.useEffect(() => {
    console.log('🔍 State changed:', {
      query,
      resultsLength: results.length,
      isOpen,
      isLoading,
      firstResult: results[0] || null
    });
  }, [query, results, isOpen, isLoading]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      console.log('🔍 Search triggered:', { query, queryLength: query.trim().length, hasClient: !!client });

      if (query.trim().length < 2 || !client) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      console.log('🔍 Starting search for:', query);
      setIsLoading(true);
      try {
        console.log('🔍 Client methods:', client ? Object.getOwnPropertyNames(client).filter(name => typeof client[name] === 'function') : []);

        // Use Algolia v5 API
        const response = await client.searchSingleIndex({
          indexName: indexName,
          searchParams: {
            query: query,
            hitsPerPage: 8,
            attributesToHighlight: ['title', 'excerpt'],
            highlightPreTag: '<mark class="bg-yellow-200 text-gray-900">',
            highlightPostTag: '</mark>'
          }
        });

        console.log('🔍 Search response:', {
          responseType: typeof response,
          responseKeys: response ? Object.keys(response) : [],
          hasHits: !!(response && response.hits),
          hitsLength: response?.hits?.length || 0,
          firstHit: response?.hits?.[0] || null,
          allHits: response?.hits || []
        });
        
        const { hits } = response;
        setResults(hits as SearchResult[]);
        setIsOpen(true);

        console.log('🔍 Results set:', {
          resultsLength: hits?.length || 0,
          isOpenSet: true,
          firstResult: hits?.[0] || null,
          allResults: hits || []
        });

      } catch (error) {
        console.error('🔍 Search error:', {
          error: error.message,
          errorType: error.constructor.name,
          fullError: error
        });
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, client, indexName]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const getResultIcon = (type: string) => {
    return type === 'blog' ? '📄' : '🏠';
  };

  const getResultTypeLabel = (type: string) => {
    return type === 'blog' ? 'Стаття' : 'Сторінка';
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md" style={{position: 'relative', zIndex: 1000}}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const newQuery = e.target.value;
            console.log('🔍 Input changed:', newQuery);
            setQuery(newQuery);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Пошук по сайту..."
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto" style={{zIndex: 9999, backgroundColor: 'white', border: '2px solid red'}}>
          {console.log('🔍 Rendering results:', { isOpen, resultsLength: results.length, results, firstResultKeys: results[0] ? Object.keys(results[0]) : [] })}
          <div style={{padding: '10px', backgroundColor: 'yellow', color: 'black'}}>
            DEBUG: {results.length} results found
          </div>
          {results.map((result, index) => (
            <a
              key={result.objectID || index}
              href={result.url}
              className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              style={{display: 'block', padding: '10px', backgroundColor: index % 2 ? '#f0f0f0' : 'white'}}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg mt-0.5">{getResultIcon(result.type || 'page')}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {result._highlightResult?.title?.value || result.title || 'No title'}
                    </h3>
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                      {getResultTypeLabel(result.type || 'page')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {result._highlightResult?.excerpt?.value || result.excerpt || result.content?.substring(0, 100) || 'No description'}
                  </p>
                  <div style={{fontSize: '10px', color: 'blue', marginTop: '5px'}}>
                    DEBUG: {JSON.stringify(Object.keys(result))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {isOpen && query.trim().length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0 0L3.515 9.829A1 1 0 012.1 8.414L5.757 4.757A1 1 0 017.172 4.343L10 7.172" />
            </svg>
            <p className="text-sm">Нічого не знайдено для "{query}"</p>
            <p className="text-xs text-gray-400 mt-1">Спробуйте інші ключові слова</p>
          </div>
        </div>
      )}
    </div>
  );
}
