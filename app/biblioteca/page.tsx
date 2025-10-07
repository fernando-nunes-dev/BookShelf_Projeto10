"use client";

import { useState, useEffect, useMemo } from "react";
import EnhancedSearchBar from "../../components/shared/EnhancedSearchBar";
import CardBook from "../../components/shared/CardBook";
import { useAuth } from "@/contexts/AuthContext";
import { Prisma } from '@prisma/client';

type BookWithGenre = Prisma.BookGetPayload<{ include: { genre: true } }>;

export default function Biblioteca() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [books, setBooks] = useState<BookWithGenre[]>([]);

  const userBooks = useMemo(() => user?.books || [], [user?.books]);

  useEffect(() => {
    // Busca os dados da API quando a página carrega
    async function loadBooks() {
      try {
        // Tenta buscar do Prisma primeiro
        const res = await fetch('/api/books');
        if (res.ok) {
          const data = await res.json();
          setBooks(data);
        } else if (user?.id) {
          // Fallback para mock data se API falhar
          const userRes = await fetch(`/api/books?userId=${user.id}`);
          if (userRes.ok) {
            const userData = await userRes.json();
            setBooks(userData);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
        // Se ambas as abordagens falharem, usa os livros do user context
        setBooks(userBooks as BookWithGenre[]);
      }
    }
    
    loadBooks();
  }, [user?.id, userBooks]);

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
      </div>
      {/* Passa os livros carregados e o termo de busca para o componente */}
      <CardBook 
        initialBooks={books.length > 0 ? books : userBooks as BookWithGenre[]}
        searchTerm={searchTerm}
      />
    </section>
  );
}