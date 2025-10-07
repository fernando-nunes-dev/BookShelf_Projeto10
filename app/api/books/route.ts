import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/data/mockUsers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { message: 'ID do usuário é obrigatório.' },
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
  } catch {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao buscar os livros.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, ...bookData } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: 'ID do usuário é obrigatório.' },
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
  } catch {
    return NextResponse.json(
      { message: 'Erro ao adicionar o livro. Verifique os dados enviados.' },
      { status: 400 }
    );
  }
}