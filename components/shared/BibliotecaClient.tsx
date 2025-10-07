"use client";

import { useState, useMemo } from "react";
import { Prisma, Genre } from "@prisma/client";
import  CardBook  from "./CardBook";
import EnhancedSearchBar from "./EnhancedSearchBar";
import FilterSortControls from "./FilterSortControls";
import BookCounter from "./BookCounter";

// Tipo para um livro com seu gênero, vindo do Prisma
type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;

// Props que o componente recebe da página (Server Component)
interface BibliotecaClientProps {
  initialBooks: BookWithGenre[];
  availableGenres: Genre[];
}

export function BibliotecaClient({ initialBooks, availableGenres }: BibliotecaClientProps) {
  // Estados para controlar a interatividade da página
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ genre: "", status: "", rating: "" });
  const [sort, setSort] = useState<{ field: "title" | "author" | "year" | "pages" | "rating"; direction: "asc" | "desc" }>({ field: "title", direction: "asc" });

  // Lógica para filtrar e ordenar os livros que são exibidos na tela
  const filteredAndSortedBooks = useMemo(() => {
    let books = [...initialBooks];

    // Aplica o filtro de busca
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      books = books.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term)
      );
    }

    // Aplica o filtro de gênero
    if (filters.genre) {
      books = books.filter(book => book.genre.name === filters.genre);
    }
    // Aplica a ordenação
    books.sort((a, b) => {
      const aValue = a[sort.field as keyof BookWithGenre] ?? '';
      const bValue = b[sort.field as keyof BookWithGenre] ?? '';
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return books;
  }, [initialBooks, searchTerm, filters, sort]);
  
  const resetFilters = () => setFilters({ genre: "", status: "", rating: "" });

  const counts = {
    total: initialBooks.length,
    lido: initialBooks.filter(b => b.status === "LIDO").length,
    lendo: initialBooks.filter(b => b.status === "LENDO").length,
    queroLer: initialBooks.filter(b => b.status === "QUERO_LER").length,
  };

  return (
    <section className="w-full px-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight text-white">
          Minha Biblioteca
        </h1>
        <p className="text-lg text-gray-400">
          Gerencie sua coleção de livros.
        </p>
      </div>

      <EnhancedSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterSortControls
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        availableGenres={availableGenres}
        onReset={resetFilters}
      />
      <BookCounter counts={counts} />
      
      <div className="mt-8">
        {filteredAndSortedBooks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredAndSortedBooks.map((book) => (
              <CardBook initialBooks={[]} searchTerm={""} key={book.id} {...book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-white">
            <p className="text-xl font-semibold">Nenhum livro encontrado</p>
            <p className="text-gray-400">Tente buscar por outro termo ou ajustar os filtros.</p>
          </div>
        )}
      </div>
    </section>
  );
}