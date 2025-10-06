import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '@/data/mockUsers';

// --- GET (Obter um livro específico) ---
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const bookId = resolvedParams.id;
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

    let book = user.books.find((b) => b.id === bookId);

    // Se não encontrar, tenta encontrar pelo ID original (sem prefixo)
    if (!book) {
      const originalId = bookId.includes('_') ? bookId.split('_')[1] : bookId;
      book = user.books.find((b) => b.id.endsWith(`_${originalId}`) || b.id === originalId);
    }

    if (!book) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao buscar o livro.' },
      { status: 500 }
    );
  }
}

// --- PUT (Atualizar um livro existente) ---
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const bookId = resolvedParams.id;
    const { userId, ...updatedData } = await request.json();

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

    let bookIndex = user.books.findIndex((b) => b.id === bookId);

    // Se não encontrar, tenta encontrar pelo ID original (sem prefixo)
    if (bookIndex === -1) {
      const originalId = bookId.includes('_') ? bookId.split('_')[1] : bookId;
      bookIndex = user.books.findIndex((b) => b.id.endsWith(`_${originalId}`) || b.id === originalId);
    }

    if (bookIndex === -1) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }

    user.books[bookIndex] = { ...user.books[bookIndex], ...updatedData };

    return NextResponse.json({ 
      message: 'Livro atualizado com sucesso!', 
      book: user.books[bookIndex] 
    });
  } catch {
    return NextResponse.json(
      { message: 'Erro ao atualizar o livro. Verifique os dados enviados.' },
      { status: 400 }
    );
  }
}

// --- DELETE (Remover um livro) ---
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const bookId = resolvedParams.id;
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

    let bookIndex = user.books.findIndex((b) => b.id === bookId);

    // Se não encontrar, tenta encontrar pelo ID original (sem prefixo)
    if (bookIndex === -1) {
      const originalId = bookId.includes('_') ? bookId.split('_')[1] : bookId;
      bookIndex = user.books.findIndex((b) => b.id.endsWith(`_${originalId}`) || b.id === originalId);
    }

    if (bookIndex === -1) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }

    // Remove o livro da lista do usuário
    const [deletedBook] = user.books.splice(bookIndex, 1);

    return NextResponse.json({ 
      message: 'Livro removido com sucesso!',
      book: deletedBook
    });
  } catch {
    return NextResponse.json(
      { message: 'Ocorreu um erro ao remover o livro.' },
      { status: 500 }
    );
  }
}