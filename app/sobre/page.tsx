"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Users, Target, Heart } from "lucide-react";

export default function Sobre() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao início
          </Link>
        </div>

        {/* Título principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Sobre o BookShelf
          </h1>
          <p className="text-xl text-[var(--secondary-text)] max-w-2xl mx-auto">
            Sua biblioteca digital pessoal para organizar, descobrir e acompanhar suas leituras
          </p>
        </div>

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Nossa Missão */}
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-8 w-8 text-[var(--primary)]" />
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Nossa Missão</h2>
            </div>
            <p className="text-[var(--secondary-text)] leading-relaxed">
              Democratizar o acesso à literatura e facilitar a organização pessoal de leituras, 
              oferecendo uma plataforma intuitiva para leitores de todos os níveis descobrirem, 
              catalogarem e acompanharem seus livros favoritos.
            </p>
          </div>

          {/* O que oferecemos */}
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-8 w-8 text-[var(--primary)]" />
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">O que oferecemos</h2>
            </div>
            <ul className="text-[var(--secondary-text)] space-y-2">
              <li>• Biblioteca pessoal digital</li>
              <li>• Busca de livros gratuitos</li>
              <li>• Acompanhamento de leituras</li>
              <li>• Recomendações personalizadas</li>
              <li>• Interface responsiva e moderna</li>
            </ul>
          </div>
        </div>

        {/* Recursos principais */}
        <div className="bg-[var(--card-bg)] rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-[var(--foreground)] text-center mb-8">
            Recursos Principais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-[var(--primary)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Biblioteca Digital
              </h3>
              <p className="text-[var(--secondary-text)] text-sm">
                Organize seus livros digitalmente com facilidade e praticidade
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[var(--primary)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Livros Gratuitos
              </h3>
              <p className="text-[var(--secondary-text)] text-sm">
                Acesse milhares de livros gratuitos do Project Gutenberg e Baixe Livros
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-[var(--primary)] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Acompanhamento
              </h3>
              <p className="text-[var(--secondary-text)] text-sm">
                Monitore seu progresso de leitura e mantenha suas metas em dia
              </p>
            </div>
          </div>
        </div>

        {/* Tecnologias */}
        <div className="bg-[var(--card-bg)] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-6">
            Tecnologias Utilizadas
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-[var(--background)] rounded-lg p-4">
              <h3 className="font-semibold text-[var(--foreground)]">Next.js</h3>
              <p className="text-[var(--secondary-text)] text-sm">Framework React</p>
            </div>
            <div className="bg-[var(--background)] rounded-lg p-4">
              <h3 className="font-semibold text-[var(--foreground)]">TypeScript</h3>
              <p className="text-[var(--secondary-text)] text-sm">Tipagem estática</p>
            </div>
            <div className="bg-[var(--background)] rounded-lg p-4">
              <h3 className="font-semibold text-[var(--foreground)]">Tailwind CSS</h3>
              <p className="text-[var(--secondary-text)] text-sm">Estilização</p>
            </div>
            <div className="bg-[var(--background)] rounded-lg p-4">
              <h3 className="font-semibold text-[var(--foreground)]">Framer Motion</h3>
              <p className="text-[var(--secondary-text)] text-sm">Animações</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}