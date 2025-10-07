"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Book, Star, Heart, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export interface BookRecommendation {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  rating: number;
  genre: string;
  similarity: number;
}

export interface BookRecommendationsProps {
  currentBookId: string;
  currentBookGenre?: string;
  limit?: number;
  className?: string;
}

const BookRecommendations: React.FC<BookRecommendationsProps> = ({
  currentBookId,
  limit = 6,
  className = ""
}) => {
  const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const fetchRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Simulação de dados - em um app real, seria uma API call
      const mockRecommendations: BookRecommendation[] = [
        {
          id: '1',
          title: 'O Código Da Vinci',
          author: 'Dan Brown',
          coverUrl: '/images/codigo-da-vinci.jpg',
          rating: 4.2,
          genre: 'Mistério',
          similarity: 85
        },
        {
          id: '2',
          title: 'Duna',
          author: 'Frank Herbert',
          coverUrl: '/images/duna.jpg',
          rating: 4.8,
          genre: 'Ficção Científica',
          similarity: 78
        },
        {
          id: '3',
          title: 'O Pequeno Príncipe',
          author: 'Antoine de Saint-Exupéry',
          coverUrl: '/images/pequeno-principe.jpg',
          rating: 4.6,
          genre: 'Filosofia',
          similarity: 72
        }
      ];

      // Filtrar livros similares e limitar a quantidade
      const filtered = mockRecommendations
        .filter(book => book.id !== currentBookId)
        .slice(0, limit);

      setRecommendations(filtered);
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
    } finally {
      setLoading(false);
    }
  }, [currentBookId, limit]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const toggleFavorite = (bookId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Recomendações para você
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border">
              <div className="animate-pulse space-y-3">
                <div className="w-full h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-3/4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-1/2 h-3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Book className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma recomendação disponível no momento.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Recomendações para você
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((book) => (
          <div
            key={book.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 group"
          >
            <Link href={`/livro/${book.id}`} className="block">
              <div className="relative mb-3">
                {book.coverUrl ? (
                  <Image
                    src={book.coverUrl}
                    alt={book.title}
                    width={120}
                    height={160}
                    className="w-full h-32 object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                    <Book className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                {/* Similarity Badge */}
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {book.similarity}% similar
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {book.title}
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {book.author}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {renderStars(book.rating)}
                    <span className="text-sm text-gray-500 ml-1">
                      {book.rating.toFixed(1)}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(book.id);
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      favorites.has(book.id)
                        ? 'text-red-500 hover:text-red-600'
                        : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${favorites.has(book.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full inline-block">
                  {book.genre}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookRecommendations;