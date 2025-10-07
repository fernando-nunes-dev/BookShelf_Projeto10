"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2, Share2, Bookmark, BookOpen, Calendar, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Book } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import InteractiveRating from "./InteractiveRating";
import ReadingTimeline from "./ReadingTimeline";
import BookRecommendations from "./BookRecommendations";

interface EnhancedBookDetailsProps {
  book: Book;
}

export default function EnhancedBookDetails({ book }: EnhancedBookDetailsProps) {
  const { user, updateUserBooks } = useAuth();

  const [currentRating, setCurrentRating] = useState(book.rating || 0);
  const [readingStatus, setReadingStatus] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [editedBook, setEditedBook] = useState({
    title: book.title,
    author: book.author,
    genre: book.genre || '',
    year: book.year || new Date().getFullYear(),
    pages: book.pages || 0,
    synopsis: book.synopsis || ''
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    // Carregar status de leitura do localStorage
    try {
      const savedStatus = localStorage.getItem("bookStatus");
      if (savedStatus) {
        const statusData = JSON.parse(savedStatus);
        setReadingStatus(statusData[book.id] || "");
      }
    } catch (e) {
      console.error("Erro ao carregar status:", e);
    }
  }, [book.id]);

  const handleRatingChange = (newRating: number) => {
    setCurrentRating(newRating);
    
    console.log(`Nova avaliação para ${book.title}: ${newRating} estrelas`);
  };

  const handleStatusChange = (newStatus: string) => {
    setReadingStatus(newStatus);
    
    // Salvar no localStorage
    try {
      const savedStatus = localStorage.getItem("bookStatus");
      const statusData = savedStatus ? JSON.parse(savedStatus) : {};
      statusData[book.id] = newStatus;
      localStorage.setItem("bookStatus", JSON.stringify(statusData));
    } catch (e) {
      console.error("Erro ao salvar status:", e);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Confira este livro: ${book.title} por ${book.author}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Erro ao compartilhar:", err);
      }
    } else {
      // Fallback: copiar URL para clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  const handleSaveEdit = async () => {
    if (!user) return;
    
    setSaveLoading(true);
    
    try {
      // Chamar API para atualizar o livro
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          title: editedBook.title,
          author: editedBook.author,
          genre: editedBook.genre,
          year: editedBook.year,
          pages: editedBook.pages,
          synopsis: editedBook.synopsis,
        }),
      });

      if (response.ok) {
        // Atualizar o livro no contexto local também
        const updatedBooks = user.books.map(b => 
          b.id === book.id 
            ? { ...b, ...editedBook }
            : b
        );
        
        const updatedUser = { ...user, books: updatedBooks };
        localStorage.setItem('bookshelf-user-v2', JSON.stringify(updatedUser));
        
        setIsEditing(false);
        // Recarregar a página para mostrar as alterações
        window.location.reload();
      } else {
        throw new Error('Erro na API');
      }
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      alert('Erro ao atualizar livro. Tente novamente.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedBook({
      title: book.title,
      author: book.author,
      genre: book.genre || '',
      year: book.year || new Date().getFullYear(),
      pages: book.pages || 0,
      synopsis: book.synopsis || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEditedBook(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteBook = async () => {
    if (!user) return;
    
    setDeleteLoading(true);
    
    try {
      // Chamar API para deletar o livro
      const response = await fetch(`/api/books/${book.id}?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Sucesso na API - atualizar estado
        const updatedBooks = user.books.filter(b => b.id !== book.id);
        const updatedUser = { ...user, books: updatedBooks };
        
        // Atualizar localStorage
        localStorage.setItem('bookshelf-user-v2', JSON.stringify(updatedUser));
        
        // Atualizar o contexto de autenticação
        if (updateUserBooks) {
          updateUserBooks(updatedBooks);
        }
        
        setShowDeleteConfirm(false);
        
        // Aguardar um momento para o contexto ser atualizado e usar navegação forçada
        setTimeout(() => {
          window.location.href = '/biblioteca';
        }, 100);
      } else if (response.status === 404) {
        // Livro não encontrado na API, mas existe no localStorage
        // Isto pode acontecer com livros adicionados recentemente
        // Vamos fazer a exclusão apenas no localStorage
        console.warn('Livro não encontrado na API, removendo apenas do localStorage');
        
        const updatedBooks = user.books.filter(b => b.id !== book.id);
        const updatedUser = { ...user, books: updatedBooks };
        
        // Atualizar localStorage
        localStorage.setItem('bookshelf-user-v2', JSON.stringify(updatedUser));
        
        // Atualizar o contexto de autenticação
        if (updateUserBooks) {
          updateUserBooks(updatedBooks);
        }
        
        setShowDeleteConfirm(false);
        
        // Aguardar um momento para o contexto ser atualizado e usar navegação forçada
        setTimeout(() => {
          window.location.href = '/biblioteca';
        }, 100);
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
        console.error('Erro da API:', errorData);
        throw new Error(errorData.message || 'Erro na API');
      }
      
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      alert('Erro ao excluir livro. Tente novamente.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
  case "lido": return "bg-[var(--primary)] hover:bg-blue-700";
  case "lendo": return "bg-green-600 hover:bg-green-700";
  case "quero ler": return "bg-yellow-600 hover:bg-yellow-700";
  case "pausado": return "bg-orange-600 hover:bg-orange-700";
  case "abandonado": return "bg-red-600 hover:bg-red-700";
  default: return "bg-[var(--card-bg)] hover:bg-[var(--border)]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "lido": return "✅";
      case "lendo": return "📖";
      case "quero ler": return "📚";
      case "pausado": return "⏸️";
      case "abandonado": return "❌";
      default: return "📖";
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Formulário de edição */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-[var(--card-bg)] rounded-lg p-8 shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Editar Livro</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const payload = {
                  title: formData.get('title'),
                  author: formData.get('author'),
                  coverUrl: formData.get('coverUrl'),
                  genre: formData.get('genre'),
                  year: Number(formData.get('year')),
                  pages: Number(formData.get('pages')),
                  rating: Number(formData.get('rating')),
                  synopsis: formData.get('synopsis'),
                };
                // Chama API PUT
                const res = await fetch(`/api/books/${book.id}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload),
                });
                if (res.ok) {
                  setIsEditing(false);
                  window.location.reload();
                } else {
                  alert('Erro ao salvar alterações.');
                }
              }}
              className="space-y-4"
            >
              <input name="title" defaultValue={book.title} className="w-full px-3 py-2 border rounded" placeholder="Título" />
              <input name="author" defaultValue={book.author} className="w-full px-3 py-2 border rounded" placeholder="Autor" />
              <input name="coverUrl" defaultValue={book.coverUrl} className="w-full px-3 py-2 border rounded" placeholder="URL da capa" />
              <input name="genre" defaultValue={typeof book.genre === 'object' && book.genre !== null ? book.genre.name : book.genre} className="w-full px-3 py-2 border rounded" placeholder="Gênero" />
              <input name="year" type="number" defaultValue={book.year} className="w-full px-3 py-2 border rounded" placeholder="Ano" />
              <input name="pages" type="number" defaultValue={book.pages} className="w-full px-3 py-2 border rounded" placeholder="Páginas" />
              <input name="rating" type="number" min={1} max={5} defaultValue={book.rating} className="w-full px-3 py-2 border rounded" placeholder="Avaliação (1-5)" />
              <textarea name="synopsis" defaultValue={book.synopsis} className="w-full px-3 py-2 border rounded" placeholder="Sinopse" />
              <div className="flex gap-4 pt-2">
                <button type="submit" className="bg-[var(--primary)] text-white px-4 py-2 rounded">Salvar</button>
                <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-300 dark:bg-gray-700 text-black dark:text-white px-4 py-2 rounded">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Header com navegação */}
  <div className="bg-[var(--card-bg)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              href="/biblioteca"
              className="flex items-center gap-2 text-[var(--secondary-text)] hover:text-[var(--foreground)] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar à biblioteca
            </Link>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2 text-[var(--secondary-text)] hover:text-[var(--foreground)] transition-colors"
                title="Compartilhar"
              >
                <Share2 className="h-4 w-4" />
              </button>
              
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
              
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
                title="Excluir livro"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna da Esquerda - Capa e Ações */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="sticky top-8"
            >
              {/* Capa do Livro */}
              <div className="relative mb-6">
                <div className="relative w-full aspect-[2/3] max-w-sm mx-auto">
                  <Image
                    src={book.coverUrl}
                    alt={`Capa de ${book.title}`}
                    fill
                    className="object-cover rounded-lg shadow-2xl"
                  />
                  {readingStatus && (
                    <div className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(readingStatus)}`}>
                      {getStatusIcon(readingStatus)} {readingStatus}
                    </div>
                  )}
                </div>
              </div>

              {/* Status de Leitura */}
              <div className="bg-[var(--card-bg)] rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Status de Leitura</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "quero ler", label: "Quero Ler" },
                    { key: "lendo", label: "Lendo" },
                    { key: "lido", label: "Lido" },
                    { key: "pausado", label: "Pausado" },
                  ].map((status) => (
                    <button
                      key={status.key}
                      onClick={() => handleStatusChange(status.key)}
                      className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                        readingStatus === status.key
                          ? getStatusColor(status.key)
                          : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      {getStatusIcon(status.key)} {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Avaliação */}
              <div className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Sua Avaliação</h3>
                <InteractiveRating
                  initialRating={currentRating}
                  onRatingChange={handleRatingChange}
                  size={28}
                />
              </div>
            </motion.div>
          </div>

          {/* Coluna da Direita - Informações e Conteúdo */}
          <div className="lg:col-span-2 space-y-8">
            {/* Informações Principais */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-gray-800 rounded-lg p-6"
            >
              <h1 className="text-3xl font-bold text-white mb-2">{book.title}</h1>
              <h2 className="text-xl text-gray-300 mb-4">{book.author}</h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {book.year && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{book.year}</span>
                  </div>
                )}
                
                {book.genre && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Bookmark className="h-4 w-4" />
                    <span className="text-sm">{typeof book.genre === 'object' && book.genre !== null ? book.genre.name : book.genre}</span>
                  </div>
                )}
                
                {book.pages && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm">{book.pages} páginas</span>
                  </div>
                )}
                
                {book.rating && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="text-sm">Avaliação: {book.rating}/5</span>
                  </div>
                )}
              </div>

              {/* Sinopse */}
              {book.synopsis && (
                <div>
                  <h3 className="text-lg font-semibold text-[var(--foreground)] mb-3 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Sinopse
                  </h3>
                  <p className="text-[var(--secondary-text)] leading-relaxed">{book.synopsis}</p>
                </div>
              )}
            </motion.div>

            {/* Timeline de Leitura */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <ReadingTimeline 
                bookId={book.id} 
                bookTitle={book.title}
              />
            </motion.div>

            {/* Recomendações */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <BookRecommendations currentBook={book} />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={handleCancelEdit}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[var(--background)] rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[var(--border)]">
              <h3 className="text-2xl font-bold text-[var(--foreground)]">
                Editar Livro
              </h3>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={editedBook.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                {/* Autor */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Autor *
                  </label>
                  <input
                    type="text"
                    value={editedBook.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                    required
                  />
                </div>

                {/* Gênero */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Gênero
                  </label>
                  <input
                    type="text"
                    value={editedBook.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                    placeholder="Ex: Romance, Ficção Científica..."
                  />
                </div>

                {/* Ano */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Ano de Publicação
                  </label>
                  <input
                    type="number"
                    value={editedBook.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                    className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                    min="1000"
                    max={new Date().getFullYear() + 10}
                  />
                </div>

                {/* Páginas */}
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Número de Páginas
                  </label>
                  <input
                    type="number"
                    value={editedBook.pages}
                    onChange={(e) => handleInputChange('pages', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                    min="1"
                  />
                </div>
              </div>

              {/* Sinopse */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Sinopse
                </label>
                <textarea
                  value={editedBook.synopsis}
                  onChange={(e) => handleInputChange('synopsis', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors resize-none"
                  placeholder="Descrição do livro..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-[var(--border)] flex gap-3 justify-end">
              <button
                onClick={handleCancelEdit}
                className="px-6 py-3 bg-[var(--card-bg)] text-[var(--foreground)] rounded-lg hover:bg-[var(--border)] transition-colors font-medium border border-[var(--border)]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={saveLoading || !editedBook.title.trim() || !editedBook.author.trim()}
                className="px-6 py-3 bg-[var(--primary)] text-[var(--foreground)] rounded-lg hover:bg-[var(--primary-hover)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => !deleteLoading && setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[var(--card-bg)] rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">
              Confirmar Exclusão
            </h3>
            <p className="text-[var(--secondary-text)] mb-6">
              Tem certeza que deseja excluir &quot;{book.title}&quot; da sua biblioteca? 
              Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => !deleteLoading && setShowDeleteConfirm(false)}
                disabled={deleteLoading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteBook}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteLoading ? 'Excluindo...' : 'Excluir'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

