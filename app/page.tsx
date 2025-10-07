'use client';

import { BookCarousel } from "@/components/shared/BookCarousel";
import { Dashboard } from "@/components/shared/Dashboard";
import { LoginPage } from "@/components/shared/LoginPage";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <section className="w-full space-y-12">
      {/* Dashboard com Estatísticas */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl mb-2">
          Dashboard da Biblioteca
        </h1>
        <p className="text-lg leading-8 text-[--secondary-text] mb-8">
          Acompanhe suas estatísticas de leitura e descubra insights sobre sua coleção.
        </p>
        <Dashboard />
      </div>

      {/* Livros em Destaque */}
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Livros em Destaque
        </h2>
        <p className="mt-4 text-lg leading-8 text-[--secondary-text]">
          Explore os títulos mais recentes e populares da sua coleção.
        </p>
      </div>

      <BookCarousel />
    </section>
  );
}
