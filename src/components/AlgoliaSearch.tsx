import React, { useState, useEffect, useRef } from 'react';
import { algoliasearch } from 'algoliasearch';

interface AlgoliaSearchProps {
  appId: string;
  searchKey: string;
  indexName: string;
}

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

export default function AlgoliaSearch({ appId, searchKey, indexName }: AlgoliaSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const clientRef = useRef<any>(null);

  // Initialize Algolia client only on client-side
  useEffect(() => {
    if (typeof window !== 'undefined' && !clientRef.current) {
      clientRef.current = algoliasearch(appId, searchKey);
    }
  }, [appId, searchKey]);

  // Handle search
  useEffect(() => {
    if (!clientRef.current) return;

    const searchTimeout = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setIsLoading(true);
      try {
        const { hits } = await clientRef.current.searchSingleIndex({
          indexName: indexName,
          searchParams: {
            query: query,
            hitsPerPage: 8,
            attributesToHighlight: ['title', 'excerpt'],
            highlightPreTag: '<mark class="bg-yellow-200 text-gray-900">',
            highlightPostTag: '</mark>'
          }
        });

        setResults(hits as SearchResult[]);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query, indexName]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getResultIcon = (type: string) => {
    return type === 'blog' ? '📄' : '🏠';
  };

  const getResultTypeLabel = (type: string) => {
    return type === 'blog' ? 'Стаття' : 'Сторінка';
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md" style={{ position: 'relative', zIndex: 1000 }}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto" style={{ top: '100%', left: 0 }}>
          <div className="py-2">
            {results.map((result) => (
              <a
                key={result.objectID}
                href={result.url}
                className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                style={{ textDecoration: 'none', color: 'inherit' }}
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg mt-0.5">{getResultIcon(result.type || 'page')}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 
                        className="text-sm font-medium text-gray-900 truncate"
                        dangerouslySetInnerHTML={{ 
                          __html: result._highlightResult?.title?.value || result.title || 'No title'
                        }}
                      />
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {getResultTypeLabel(result.type || 'page')}
                      </span>
                    </div>
                    {(result.excerpt || result.content) && (
                      <p 
                        className="text-xs text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ 
                          __html: result._highlightResult?.excerpt?.value || result.excerpt || result.content?.substring(0, 100) + '...' || 'No description'
                        }}
                      />
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-gray-100 flex justify-end">
            <a 
              href="https://www.algolia.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Search by Algolia
            </a>
          </div>
        </div>
      )}

      {isOpen && query.trim().length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4" style={{ top: '100%', left: 0 }}>
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343m0 0L3.515 9.829A1 1 0 012.1 8.414L5.757 4.757A1 1 0 017.172 4.343L10 7.172" />
            </svg>
            <p className="text-sm">Нічого не знайдено</p>
            <p className="text-xs text-gray-400 mt-1">Спробуйте інші ключові слова</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
            <a 
              href="https://www.algolia.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Search by Algolia
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
