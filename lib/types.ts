// lib/types.ts
export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  genre: string;
  year: number;
  pages: number;
  rating: number;
  synopsis: string;
  status?: string;
}