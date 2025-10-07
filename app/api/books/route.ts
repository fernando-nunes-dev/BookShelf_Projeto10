import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/data/mockUsers';
import { User } from '@/lib/types';

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
    const requestData = await request.json();
    const { userId, ...bookData } = requestData;

    console.log(" Dados recebidos:", requestData);
    console.log(" Tipo do userId:", typeof userId);
    console.log(" IDs dos usuários mock:", mockUsers.map(u => ({ id: u.id, tipo: typeof u.id })));

    if (!userId) {
      return NextResponse.json(
        { message: 'ID do usuário é obrigatório.' },
        { status: 400 }
      );
    }

    let user = mockUsers.find(u => u.id === userId);
    console.log("🔍 Usuário encontrado:", user ? `${user.name} (${user.id})` : 'NENHUM');
    
    if (!user) {
      console.log("🔧 Criando usuário temporário para ID:", userId);
      // Criar usuário temporário
      const newUser: User = {
        id: userId,
        name: `Usuário ${userId}`,
        email: `user${userId}@temp.com`,
        password: 'temp123',
        createdAt: new Date(),
        books: []
      };
      mockUsers.push(newUser);
      user = newUser;
      console.log("✅ Usuário temporário criado:", user.name);
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
  } catch (error) {
    console.error('Erro no POST /api/books:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro ao adicionar o livro.' },
      { status: 500 }
    );
  }
}
