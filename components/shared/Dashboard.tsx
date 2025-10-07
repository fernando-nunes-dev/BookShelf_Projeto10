"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

import { useAuth } from "@/contexts/AuthContext";

interface DashboardStats {
  totalBooks: number;
  totalPages: number;
  averageRating: number;
  genreDistribution: { name: string; value: number; color: string }[];
  ratingDistribution: { rating: number; count: number }[];
  yearlyData: { year: number; books: number; pages: number }[];
  readingTime: number; // em horas
  mostReadGenre: string;
}

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1", 
  "#d084d0", "#ffb347", "#87ceeb", "#dda0dd", "#98fb98"
];

export function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  const calculateStats = useCallback(() => {
    const books = user?.books || [];
    
    // Estatísticas básicas
    const totalBooks = books.length;
    const totalPages = books.reduce((sum, book) => sum + (book.pages || 0), 0);
    const ratingsSum = books.reduce((sum, book) => sum + (book.rating || 0), 0);
    const averageRating = books.length > 0 ? ratingsSum / books.length : 0;
    
    // Distribuição por gênero
    const genreCount: { [key: string]: number } = {};
    books.forEach(book => {
      if (book.genre) {
        genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
      }
    });
    
    const genreDistribution = Object.entries(genreCount)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);

    // Distribuição por avaliação (1-5 estrelas)
    const ratingCount: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    books.forEach(book => {
      if (book.rating && book.rating >= 1 && book.rating <= 5) {
        ratingCount[book.rating] = (ratingCount[book.rating] || 0) + 1;
      }
    });
    
    const ratingDistribution = Object.entries(ratingCount)
      .map(([rating, count]) => ({
        rating: parseInt(rating),
        count
      }))
      .sort((a, b) => a.rating - b.rating);

    // Dados por ano
    const yearCount: { [key: number]: { books: number; pages: number } } = {};
    books.forEach(book => {
      if (book.year) {
        if (!yearCount[book.year]) {
          yearCount[book.year] = { books: 0, pages: 0 };
        }
        yearCount[book.year].books += 1;
        yearCount[book.year].pages += book.pages || 0;
      }
    });
    
    const yearlyData = Object.entries(yearCount)
      .map(([year, data]) => ({
        year: parseInt(year),
        books: data.books,
        pages: data.pages
      }))
      .sort((a, b) => a.year - b.year);

    // Tempo estimado de leitura (assumindo 250 palavras por página e 200 palavras por minuto)
    const readingTime = Math.round((totalPages * 250) / 200 / 60); // em horas
    
    // Gênero mais lido
    const mostReadGenre = genreDistribution.length > 0 ? genreDistribution[0].name : "Nenhum gênero";

    setStats({
      totalBooks,
      totalPages,
      averageRating,
      genreDistribution,
      ratingDistribution,
      yearlyData,
      readingTime,
      mostReadGenre
    });
  }, [user?.books]);

  useEffect(() => {
    if (user?.books) {
      calculateStats();
    }
  }, [user?.books, calculateStats]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Livros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
            <p className="text-xs text-blue-100">
              {stats.mostReadGenre} é o gênero favorito
            </p>
          </CardContent>
        </Card>

  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Páginas Totais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPages.toLocaleString()}</div>
            <p className="text-xs text-green-100">
              ~{stats.readingTime}h de leitura
            </p>
          </CardContent>
        </Card>

  <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <div className="flex text-yellow-100">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.round(stats.averageRating) ? "★" : "☆"}>
                  ★
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tempo de Leitura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.readingTime}h</div>
            <p className="text-xs text-purple-100">
              Tempo estimado total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuição por Gênero */}
  <Card className="bg-[var(--card-bg)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)]">Distribuição por Gênero</CardTitle>
            <CardDescription className="text-[var(--secondary-text)]">
              Quantidade de livros por categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.genreDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.genreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: { name?: string; value?: number }) => {
                    const name = props.name ?? "";
                    const value = props.value ?? 0;
                    return `${name}: ${value}`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.genreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-[var(--secondary-text)]">
                <p>Nenhum gênero encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribuição por Avaliação */}
  <Card className="bg-[var(--card-bg)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)]">Distribuição por Avaliação</CardTitle>
            <CardDescription className="text-[var(--secondary-text)]">
              Quantidade de livros por nota
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.ratingDistribution.some(item => item.count > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.ratingDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="rating" 
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `${value} ★`}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value) => [`${value} livros`, 'Quantidade']}
                  labelFormatter={(label) => `Avaliação: ${label} estrelas`}
                />
                <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-[var(--secondary-text)]">
                <p>Nenhuma avaliação encontrada</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Livros por Ano */}
  <Card className="bg-[var(--card-bg)] border-[var(--border)] lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)]">Livros por Ano de Publicação</CardTitle>
            <CardDescription className="text-[var(--secondary-text)]">
              Distribuição temporal da sua biblioteca
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.yearlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="year" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value, name) => [`${value} ${name === 'books' ? 'livros' : 'páginas'}`, name === 'books' ? 'Quantidade de Livros' : 'Total de Páginas']}
                  labelFormatter={(label) => `Ano: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="books" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                  name="books"
                />
              </LineChart>
            </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-[var(--secondary-text)]">
                <p>Nenhum dado de ano encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estatísticas Personalizadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Card className="bg-[var(--card-bg)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)] text-sm">Livro Mais Antigo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-[var(--foreground)]">
              {(user?.books || []).reduce((oldest, book) => 
                (book.year && (!oldest.year || book.year < oldest.year)) ? book : oldest, user?.books?.[0] || { title: 'N/A', year: 0 }
              ).title}
            </div>
            <p className="text-sm text-[var(--secondary-text)]">
              {(user?.books || []).reduce((oldest, book) => 
                (book.year && (!oldest.year || book.year < oldest.year)) ? book : oldest, user?.books?.[0] || { title: 'N/A', year: 0 }
              ).year}
            </p>
          </CardContent>
        </Card>

  <Card className="bg-[var(--card-bg)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)] text-sm">Livro Mais Longo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-[var(--foreground)]">
              {(user?.books || []).reduce((longest, book) => 
                (book.pages && (!longest.pages || book.pages > longest.pages)) ? book : longest, user?.books?.[0] || { title: 'N/A', pages: 0 }
              ).title}
            </div>
            <p className="text-sm text-[var(--secondary-text)]">
              {(user?.books || []).reduce((longest, book) => 
                (book.pages && (!longest.pages || book.pages > longest.pages)) ? book : longest, user?.books?.[0] || { title: 'N/A', pages: 0 }
              ).pages} páginas
            </p>
          </CardContent>
        </Card>

  <Card className="bg-[var(--card-bg)] border-[var(--border)]">
          <CardHeader>
            <CardTitle className="text-[var(--foreground)] text-sm">Média de Páginas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-[var(--foreground)]">
              {Math.round(stats.totalPages / stats.totalBooks)}
            </div>
            <p className="text-sm text-[var(--secondary-text)]">
              páginas por livro
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

