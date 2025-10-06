"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";

// NOVO TIPO para os objetos de gênero
type GenreObject = {
  id: string;
  name: string;
};

interface GenreAutocompleteProps {
  value: string; // O valor continua sendo o nome (string)
  onChange: (value: string) => void;
  suggestions: GenreObject[]; // <-- MUDANÇA: Agora recebe objetos
  placeholder?: string;
  className?: string;
}

export default function GenreAutocomplete({
  value,
  onChange,
  suggestions,
  placeholder = "Digite ou selecione um gênero...",
  className = "",
}: GenreAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  // O estado interno agora guarda objetos de gênero
  const [filteredSuggestions, setFilteredSuggestions] = useState<GenreObject[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (value) {
      // Filtra pelo nome do gênero no objeto
      const filtered = suggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
    setHighlightedIndex(-1);
  }, [value, suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSuggestionClick = (suggestion: GenreObject) => {
    onChange(suggestion.name); // Passa apenas o nome para o formulário pai
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // ... (nenhuma mudança necessária nesta função)
    if (!isOpen) { if (e.key === 'ArrowDown' || e.key === 'Enter') { setIsOpen(true); return; } }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setHighlightedIndex(prev => prev < filteredSuggestions.length - 1 ? prev + 1 : 0); break;
      case 'ArrowUp': e.preventDefault(); setHighlightedIndex(prev => prev > 0 ? prev - 1 : filteredSuggestions.length - 1); break;
      case 'Enter': e.preventDefault(); if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) { handleSuggestionClick(filteredSuggestions[highlightedIndex]); } break;
      case 'Escape': setIsOpen(false); setHighlightedIndex(-1); break;
    }
  };

  const clearValue = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-20 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* ... botões de limpar e dropdown (nenhuma mudança necessária) ... */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {value && <button type="button" onClick={clearValue} className="p-1 text-gray-400 hover:text-gray-300"><X className="h-4 w-4" /></button>}
          <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-1 text-gray-400 hover:text-gray-300"><ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
        </div>
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={suggestion.id} // <-- MUDANÇA: Usa o ID como chave
              onClick={() => handleSuggestionClick(suggestion)}
              className={`px-3 py-2 cursor-pointer transition-colors ${index === highlightedIndex ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}
            >
              {suggestion.name} {/* Exibe o nome do gênero */}
            </li>
          ))}
        </ul>
      )}
      
      {/* ... (nenhuma mudança necessária na parte de 'nenhum gênero encontrado') ... */}
    </div>
  );
}