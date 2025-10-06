// components/shared/BibliotecaClient.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import BookCounter from "./BookCounter";
import { highlightSearchTerm } from "./EnhancedSearchBar"; // Verifique se esta função existe e está correta
import { FilterOptions, SortOptions } from "./FilterSortControls";
import { Prisma, Genre } from '@prisma/client';

// TIPOS VINDOS DO PRISMA
type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;
type BookStatusState = { [key: string]: 'lido' | 'lendo' | 'quero ler' | null };

// PROPRIEDADES DO COMPONENTE
interface BibliotecaClientProps {
  initialBooks: BookWithGenre[];
  searchTerm: string;
  filters: FilterOptions;
  sort: SortOptions;
}

// COMPONENTE DO CARD (interno e simplificado)
function Card({ book, status, onStatusChange }: { book: BookWithGenre; status: 'lido' | 'lendo' | 'quero ler' | null; onStatusChange: (bookId: string, newStatus: any) => void; }) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`rounded-2xl border flex flex-col transition-all duration-300 hover:shadow-lg hover:scale-105 ${status === "lendo" ? "border-green-500 bg-[#8adf3b18]" : "border-slate-800"} ${status === "lido" ? "bg-[#ffffff25]" : ""} ${status === "quero ler" ? "border-orange-500 bg-[#f1dc1c1f]" : ""}`}>
      <Link href={`/livro/${book.id}`}>
        <div className={`relative w-full h-72 flex items-center justify-center hover:opacity-50 transition-opacity ${status === "lido" ? "opacity-50" : ""}`}>
          <Image src={imgError || !book.coverUrl ? "/fallback-book.jpg" : book.coverUrl} alt={`Capa do livro ${book.title}`} fill className="object-contain p-2" onError={() => setImgError(true)} />
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h2 className="font-bold text-lg text-white">{book.title}</h2>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-300">{book.author}</p>
          <p className="text-xs text-gray-400">Ano: {book.year}</p>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (<Star key={i} size={18} className={i < book.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} />))}
          </div>
          <p className="text-xs text-gray-400">Págs.: {book.pages}</p>
        </div>
        <span className="inline-block w-fit px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">{book.genre.name}</span>
      </div>
      <section className="flex justify-around border-t border-gray-700 p-2">
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            <button onClick={() => onStatusChange(book.id, status === "lido" ? null : "lido")} className={`text-xs px-3 py-1 rounded-md transition-colors ${status === "lido" ? "bg-blue-700" : "bg-blue-600 hover:bg-blue-800"} text-white`}>Lido</button>
            <button onClick={() => onStatusChange(book.id, status === "lendo" ? null : "lendo")} className={`text-xs px-3 py-1 rounded-md transition-colors ${status === "lendo" ? "bg-green-700" : "bg-green-600 hover:bg-green-800"} text-white`}>Lendo</button>
            <button onClick={() => onStatusChange(book.id, status === "quero ler" ? null : "quero ler")} className={`text-xs px-3 py-1 rounded-md transition-colors ${status === "quero ler" ? "bg-yellow-700" : "bg-yellow-600 hover:bg-yellow-800"} text-white`}>Quero ler</button>
          </div>
          <div className="flex gap-2">
            <Link href={`/livro/${book.id}`} className="text-xs px-3 py-1 rounded-md bg-gray-600 text-white hover:bg-gray-700" title="Visualizar">Ver</Link>
            <button className="text-xs px-3 py-1 rounded-md bg-purple-600 text-white hover:bg-purple-800">Editar</button>
            <button className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700">Excluir</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// COMPONENTE PRINCIPAL QUE GERENCIA A LÓGICA
export default function BibliotecaClient({ initialBooks, searchTerm, filters, sort }: BibliotecaClientProps) {
  const [bookStatus, setBookStatus] = useState<BookStatusState>({});

  // Lógica de status (localStorage) - podemos manter por enquanto
  useEffect(() => {
    const savedStatus = localStorage.getItem("bookStatus");
    if (savedStatus) setBookStatus(JSON.parse(savedStatus));
  }, []);

  useEffect(() => {
    localStorage.setItem("bookStatus", JSON.stringify(bookStatus));
  }, [bookStatus]);

  const handleStatusChange = (bookId: string, newStatus: 'lido' | 'lendo' | 'quero ler' | null) => {
    setBookStatus(prev => ({ ...prev, [bookId]: newStatus }));
  };

  // Lógica de filtro e ordenação
  const processedBooks = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let books = [...initialBooks]
      .filter(book => {
        const bookStatusValue = bookStatus[book.id];
        const matchesSearch = !term || book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term);
        const matchesGenre = !filters.genre || book.genre.name === filters.genre;
        const matchesStatus = !filters.status || (filters.status === "sem status" && !bookStatusValue) || bookStatusValue === filters.status;
        const matchesRating = !filters.rating || book.rating >= parseInt(filters.rating);
        return matchesSearch && matchesGenre && matchesStatus && matchesRating;
      });

    books.sort((a, b) => {
      const aValue = a[sort.field as keyof BookWithGenre] ?? '';
      const bValue = b[sort.field as keyof BookWithGenre] ?? '';
      if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return books;
  }, [initialBooks, searchTerm, filters, sort, bookStatus]);
  
  const counts = {
    total: initialBooks.length,
    lido: Object.values(bookStatus).filter(s => s === 'lido').length,
    lendo: Object.values(bookStatus).filter(s => s === 'lendo').length,
    queroLer: Object.values(bookStatus).filter(s => s === 'quero ler').length,
  };

  return (
    <div>
      <BookCounter counts={counts} />
      {searchTerm && <div className="mb-4 text-sm text-gray-400">{processedBooks.length} resultado(s) para &quot;{searchTerm}&quot;</div>}
      {processedBooks.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {processedBooks.map((book) => (
            <Card key={book.id} book={book} status={bookStatus[book.id] || null} onStatusChange={handleStatusChange} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-white">
          <p className="text-xl font-semibold">Nenhum livro encontrado.</p>
        </div>
      )}
    </div>
  );
}