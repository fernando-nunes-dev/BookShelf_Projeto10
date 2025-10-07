"use client"

import React, { useState, useEffect } from 'react';
import { Star, Heart, ThumbsUp, MessageCircle } from 'lucide-react';

export interface InteractiveRatingProps {
  bookId: string;
  initialRating?: number;
  totalRatings?: number;
  userRating?: number;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showStats?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export interface RatingStats {
  average: number;
  total: number;
  distribution: { [key: number]: number };
  userRating?: number;
}

const InteractiveRating: React.FC<InteractiveRatingProps> = ({
  initialRating = 0,
  totalRatings = 0,
  userRating,
  readonly = false,
  size = 'md',
  showStats = false,
  onRatingChange,
  className = ""
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [userCurrentRating, setUserCurrentRating] = useState(userRating || 0);
  const [stats, setStats] = useState<RatingStats>({
    average: initialRating,
    total: totalRatings,
    distribution: { 5: 45, 4: 30, 3: 15, 2: 7, 1: 3 },
    userRating: userRating
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(!!userRating);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  useEffect(() => {
    // Simular carregamento de estatísticas
    setStats({
      average: initialRating,
      total: totalRatings,
      distribution: { 5: 45, 4: 30, 3: 15, 2: 7, 1: 3 },
      userRating: userRating
    });
  }, [initialRating, totalRatings, userRating]);

  const handleStarClick = async (selectedRating: number) => {
    if (readonly || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUserCurrentRating(selectedRating);
      setHasRated(true);
      
      // Atualizar estatísticas localmente
      const newTotal = hasRated ? stats.total : stats.total + 1;
      const newAverage = hasRated 
        ? ((stats.average * stats.total) - (stats.userRating || 0) + selectedRating) / stats.total
        : ((stats.average * stats.total) + selectedRating) / newTotal;
      
      setStats(prev => ({
        ...prev,
        average: newAverage,
        total: newTotal,
        userRating: selectedRating
      }));

      onRatingChange?.(selectedRating);
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarHover = (starIndex: number) => {
    if (!readonly) {
      setHoverRating(starIndex);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const getRatingText = (rating: number) => {
    const texts = {
      1: 'Muito ruim',
      2: 'Ruim',
      3: 'Regular',
      4: 'Bom',
      5: 'Excelente'
    };
    return texts[rating as keyof typeof texts] || '';
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isActive = readonly 
        ? starValue <= stats.average
        : starValue <= (hoverRating || userCurrentRating);
      
      return (
        <button
          key={index}
          onClick={() => handleStarClick(starValue)}
          onMouseEnter={() => handleStarHover(starValue)}
          disabled={readonly || isSubmitting}
          className={`
            transition-all duration-200 transform hover:scale-110
            ${readonly ? 'cursor-default' : 'cursor-pointer'}
            ${isSubmitting ? 'opacity-50' : ''}
          `}
        >
          <Star
            className={`
              ${sizeClasses[size]}
              ${isActive 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300 hover:text-yellow-400'
              }
              transition-colors duration-200
            `}
          />
        </button>
      );
    });
  };

  const renderDistribution = () => {
    if (!showStats) return null;

    return (
      <div className="mt-4 space-y-2">
        <h4 className="font-medium text-gray-800 dark:text-gray-200">
          Distribuição das avaliações
        </h4>
        {[5, 4, 3, 2, 1].map(starCount => (
          <div key={starCount} className="flex items-center gap-2">
            <span className="text-sm w-8">{starCount}</span>
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <div className="flex-1 bg-gray-200 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-yellow-400 h-full transition-all duration-300"
                style={{ width: `${stats.distribution[starCount] || 0}%` }}
              />
            </div>
            <span className="text-sm text-gray-500 w-8">
              {stats.distribution[starCount] || 0}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`${className}`} onMouseLeave={handleMouseLeave}>
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          {renderStars()}
        </div>
        
        <div className={`flex items-center gap-2 ${textSizeClasses[size]}`}>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            {stats.average.toFixed(1)}
          </span>
          {stats.total > 0 && (
            <span className="text-gray-500 dark:text-gray-400">
              ({stats.total.toLocaleString()} {stats.total === 1 ? 'avaliação' : 'avaliações'})
            </span>
          )}
        </div>
      </div>

      {!readonly && hoverRating > 0 && (
        <div className="mt-2">
          <span className={`text-gray-600 dark:text-gray-400 ${textSizeClasses[size]}`}>
            {getRatingText(hoverRating)}
          </span>
        </div>
      )}

      {hasRated && !readonly && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-400">
          ✓ Você avaliou este livro com {userCurrentRating} {userCurrentRating === 1 ? 'estrela' : 'estrelas'}
        </div>
      )}

      {isSubmitting && (
        <div className="mt-2 text-sm text-blue-600 dark:text-blue-400">
          Salvando avaliação...
        </div>
      )}

      {renderDistribution()}
      
      {showStats && (
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>1.2k curtidas</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>234 comentários</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>567 recomendações</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveRating;