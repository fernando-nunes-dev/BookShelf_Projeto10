"use client"

import React from 'react';
import { Book, BookOpen, Clock, CheckCircle } from 'lucide-react';

export interface BookCounterData {
  total: number;
  reading: number;
  completed: number;
  wantToRead: number;
}

export interface BookCounterProps {
  data?: BookCounterData;
  loading?: boolean;
  className?: string;
}

const BookCounter: React.FC<BookCounterProps> = ({
  data = { total: 0, reading: 0, completed: 0, wantToRead: 0 },
  loading = false,
  className = ""
}) => {

  if (loading) {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
              <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
              <div className="w-16 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const counters = [
    {
      label: 'Total de Livros',
      value: data.total,
      icon: Book,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      label: 'Lendo',
      value: data.reading,
      icon: BookOpen,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      label: 'Concluídos',
      value: data.completed,
      icon: CheckCircle,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      label: 'Quero Ler',
      value: data.wantToRead,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    }
  ];

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {counters.map((counter, index) => {
        const Icon = counter.icon;
        return (
          <div
            key={counter.label}
            className={`${counter.bgColor} p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 
                        transition-all duration-300 hover:shadow-md hover:scale-105`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={`h-6 w-6 ${counter.color}`} />
            </div>
            <div className="space-y-1">
              <div className={`text-2xl font-bold ${counter.color}`}>
                {counter.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {counter.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BookCounter;