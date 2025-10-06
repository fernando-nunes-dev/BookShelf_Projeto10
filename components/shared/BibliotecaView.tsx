// components/shared/BibliotecaView.tsx
"use client";

import { useState } from 'react';
import EnhancedSearchBar from "./EnhancedSearchBar";
import FilterSortControls, { SortOptions } from "./FilterSortControls";
import { BibliotecaClient } from './BibliotecaClient';

export function BibliotecaView({ books, genres }: { books: any[]; genres: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ genre: "", status: "", rating: "" });
  const [sort, setSort] = useState<SortOptions>({ field: "title", direction: "asc" });
  
  const resetFilters = () => setFilters({ genre: "", status: "", rating: "" });

  return (
    <section className="w-full px-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl mb-4">
          Minha Biblioteca
        </h1>
        <p className="text-lg text-gray-400 mb-6">
          Gerencie sua coleção de livros com busca avançada, filtros e ordenação.
        </p>
        <div className="mb-6">
          <EnhancedSearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm}
            placeholder="Buscar por título, autor, gênero..."
          />
        </div>
        <FilterSortControls
          filters={filters}
          setFilters={setFilters}
          sort={sort}
          setSort={setSort}
          availableGenres={genres.map(g => g.name)}
          onReset={resetFilters}
        />
      </div>
      <BibliotecaClient 
        initialBooks={books}
        availableGenres={genres}
      />
    </section>
  );
}