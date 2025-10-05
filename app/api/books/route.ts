import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: {
        genre: true, // Inclui os dados do gênero relacionado
      },
    });
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao buscar os livros.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newBook = await prisma.book.create({
      data: {
        // Mapeie os campos recebidos para o schema do Prisma
        title: data.title,
        author: data.author,
        coverUrl: data.coverUrl,
        year: data.year,
        pages: data.pages,
        rating: data.rating,
        synopsis: data.synopsis,
        genreId: data.genreId,
      },
    });
    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro ao adicionar o livro.' },
      { status: 400 }
    );
  }
}