import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockUsers } from '@/data/mockUsers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Tentar buscar do Prisma primeiro
    try {
      const books = await prisma.book.findMany({
        include: {
          genre: true, // Inclui os dados do gênero relacionado
        },
      });
      return NextResponse.json(books);
    } catch {
      console.log('Prisma não disponível, usando mock data');
      
      // Fallback para mockUsers
      if (!userId) {
        return NextResponse.json(
          { message: 'ID do usuário é obrigatório para modo mock.' },
          { status: 400 }
        );
      }

      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return NextResponse.json(
          { message: 'Usuário não encontrado.' },
          { status: 404 }
        );
      }

      return NextResponse.json(user.books);
    }
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro ao buscar os livros.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, genreId, ...bookData } = data;

    // Tentar adicionar no Prisma primeiro
    try {
      const newBook = await prisma.book.create({
        data: {
          title: bookData.title,
          author: bookData.author,
          coverUrl: bookData.coverUrl,
          year: bookData.year,
          pages: bookData.pages,
          rating: bookData.rating,
          synopsis: bookData.synopsis,
          genreId: genreId,
        },
        include: { genre: true },
      });
      return NextResponse.json({
        message: 'Livro adicionado com sucesso!',
        book: newBook
      }, { status: 201 });
    } catch {
      console.log('Prisma não disponível, usando mock data');
      
      // Fallback para mockUsers
      if (!userId) {
        return NextResponse.json(
          { message: 'ID do usuário é obrigatório para modo mock.' },
          { status: 400 }
        );
      }

      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        return NextResponse.json(
          { message: 'Usuário não encontrado.' },
          { status: 404 }
        );
      }

      const newBook = {
        ...bookData,
        id: `${userId}_${Date.now()}`,
        userId: userId,
      };

      user.books.push(newBook);
      
      return NextResponse.json(
        { message: 'Livro adicionado com sucesso!', book: newBook },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('Erro ao adicionar livro:', error);
    return NextResponse.json(
      { message: 'Erro ao adicionar o livro. Verifique os dados enviados.' },
      { status: 400 }
    );
  }
}