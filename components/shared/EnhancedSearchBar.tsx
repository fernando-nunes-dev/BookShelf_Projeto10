"use client"

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export function highlightSearchTerm(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm.trim()) {
    return text;
  }

  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <mark key={index} className="bg-yellow-300 dark:bg-yellow-600 px-1 rounded">
          {part}
        </mark>
      );
    }
    return part;
  });
}

const EnhancedSearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = "Buscar livros...",
  initialValue = ""
}) => {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (typeof onSearch === 'function') {
        onSearch(query);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, onSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const clearSearch = () => {
    setQuery("");
    if (typeof onSearch === 'function') {
      onSearch("");
    }
  };

  const handleFocus = () => {
    // Funcionalidade para foco se necessário
  };

  const handleBlur = () => {
    // Funcionalidade para blur se necessário
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     placeholder-gray-500 dark:placeholder-gray-400
                     transition-all duration-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 
                       text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                       transition-colors duration-200"
            aria-label="Limpar busca"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      {/* Indicador de busca ativa */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 
                        bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 
                        rounded-md text-sm text-blue-700 dark:text-blue-300">
          Buscando por: <strong>&quot;{query}&quot;</strong>
        </div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;