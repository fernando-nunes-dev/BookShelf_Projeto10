"use client";

import { useAuth } from "@/contexts/AuthContext";
import { mockBooks } from "@/data/mockBooks";
import { notFound } from "next/navigation";
import EnhancedBookDetails from "@/components/shared/EnhancedBookDetails";
import { useEffect, useState, use } from "react";
import { Book } from "@/lib/types";

export default function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const resolvedParams = use(params);

  useEffect(() => {
    async function loadBook() {
      try {
        // Primeiro, tenta buscar via API (Prisma)
        const userId = user?.id;
        const apiUrl = userId 
          ? `/api/books/${resolvedParams.id}?userId=${userId}`
          : `/api/books/${resolvedParams.id}`;
        
        const res = await fetch(apiUrl);
        if (res.ok) {
          const apiBook = await res.json();
          setBook(apiBook);
          setLoading(false);
          return;
        }
      } catch {
        console.log('API indisponível, tentando fallback para mock data');
      }

      // Fallback para busca local
      if (user) {
        // Primeiro, tenta encontrar o livro nos livros do usuário (IDs prefixados)
        let foundBook = user.books?.find((b) => b.id === resolvedParams.id);
        
        // Se não encontrar, tenta encontrar pelo ID original (sem prefixo)
        if (!foundBook) {
          // Extrai o ID original removendo o prefixo do usuário
          const originalId = resolvedParams.id.includes('_') ? resolvedParams.id.split('_')[1] : resolvedParams.id;
          foundBook = user.books?.find((b) => b.id.endsWith(`_${originalId}`));
        }
        
        // Se ainda não encontrar, usa o mockBooks como fallback
        if (!foundBook) {
          const originalId = resolvedParams.id.includes('_') ? resolvedParams.id.split('_')[1] : resolvedParams.id;
          foundBook = mockBooks.find((b) => b.id === originalId);
        }

        setBook(foundBook || null);
      } else {
        // Se não há usuário logado, usa mockBooks
        const originalId = resolvedParams.id.includes('_') ? resolvedParams.id.split('_')[1] : resolvedParams.id;
        const foundBook = mockBooks.find((b) => b.id === originalId);
        setBook(foundBook || null);
      }
      
      setLoading(false);
    }

    loadBook();
  }, [user, resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-[var(--foreground)]">Carregando livro...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    notFound();
  }
  
  return <EnhancedBookDetails book={book} />;
}