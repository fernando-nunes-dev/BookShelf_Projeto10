// app/biblioteca/page.tsx
"use client"; // MANTÉM COMO CLIENT COMPONENT

import { useState, useEffect } from "react";
import EnhancedSearchBar from "../../components/shared/EnhancedSearchBar";
import CardBook from "../../components/shared/CardBook"; // MUDA O NOME DO COMPONENTE
import { Prisma } from '@prisma/client';

type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;

export default function Biblioteca() {
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<BookWithGenre[]>([]); // Estado para os livros do banco

  useEffect(() => {
    // Busca os dados da API quando a página carrega
    async function loadBooks() {
      const res = await fetch('/api/books');
      const data = await res.json();
      setBooks(data);
    }
    loadBooks();
  }, []);

  return (
    <section className="w-full px-6">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-white sm:text-4xl mb-4">
          Minha Biblioteca
        </h1>
        <p className="text-lg text-gray-400 mb-6">
          Gerencie sua coleção de livros com busca avançada, filtros e ordenação.
        </p>
        
        <EnhancedSearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          placeholder="Buscar por título, autor..."
        />
        
        {/* Seus componentes de filtro e sort podem vir aqui */}
      </div>

      {/* Passa os livros do banco e o termo de busca para o componente */}
      <CardBook 
        initialBooks={books}
        searchTerm={searchTerm}
      />
    </section>
  );
}