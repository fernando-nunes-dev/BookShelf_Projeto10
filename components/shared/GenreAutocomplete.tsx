"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Genre } from "@prisma/client"; // Importa o tipo oficial do Prisma

interface GenreAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  suggestions: Genre[]; // Usa o tipo 'Genre' importado
  placeholder?: string;
}

export default function GenreAutocomplete({ value, onChange, suggestions, placeholder = "Digite..." }: GenreAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Genre[]>([]);
  
  useEffect(() => {
    const filtered = value
      ? suggestions.filter(s => s.name.toLowerCase().includes(value.toLowerCase()))
      : suggestions;
    setFilteredSuggestions(filtered);
  }, [value, suggestions]);

  const handleSuggestionClick = (suggestion: Genre) => {
    onChange(suggestion.name);
    setIsOpen(false);
  };
  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder={placeholder}
        className="w-full p-2 bg-slate-700 rounded-md"
      />
      {isOpen && (
        <ul className="absolute z-10 w-full mt-1 bg-slate-800 rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredSuggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-2 cursor-pointer hover:bg-slate-700"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}