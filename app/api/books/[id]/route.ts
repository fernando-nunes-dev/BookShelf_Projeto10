// app/api/books/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockUsers } from '@/data/mockUsers';

// Função para tentar Prisma primeiro, com fallback para mockUsers
async function findBookById(id: string, userId?: string) {
  try {
    // Tentar buscar no Prisma primeiro
    const book = await prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    
    if (book) return book;
  } catch (error) {
    console.log('Prisma não disponível, usando mock data');
  }

  // Fallback para mockUsers se Prisma não funcionar
  if (userId) {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      let book = user.books.find((b) => b.id === id);
      
      // Se não encontrar, tenta encontrar pelo ID original (sem prefixo)
      if (!book) {
        const originalId = id.includes('_') ? id.split('_')[1] : id;
        book = user.books.find((b) => b.id.endsWith(`_${originalId}`) || b.id === originalId);
      }
      
      return book;
    }
  }
  
  return null;
}

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

    const book = await findBookById(bookId, userId || undefined);

    if (!book) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
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
    const data = await request.json();
    const { userId, genreId, ...updatedData } = data;

    // Tentar atualizar no Prisma primeiro
    try {
      // Remove o campo 'genre' se ele foi enviado por engano
      const bookData = { ...updatedData };
      if ('genre' in bookData) {
        delete (bookData as any).genre;
      }

      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: {
          ...bookData,
          ...(genreId && {
            genre: { connect: { id: genreId } },
          }),
        },
        include: { genre: true },
      });

      return NextResponse.json({
        message: 'Livro atualizado com sucesso!',
        book: updatedBook
      });
    } catch (prismaError) {
      console.log('Prisma não disponível, usando mock data');
      
      // Fallback para mockUsers
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
    }
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
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

    // Tentar deletar no Prisma primeiro
    try {
      await prisma.book.delete({
        where: { id: bookId },
      });
      return NextResponse.json({ message: 'Livro removido com sucesso!' });
    } catch (prismaError) {
      console.log('Prisma não disponível, usando mock data');
      
      // Fallback para mockUsers
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
    }
  } catch (error) {
    console.error('Erro ao remover livro:', error);
    return NextResponse.json(
      { message: 'Ocorreu um erro ao remover o livro.' },
      { status: 500 }
    );
  }
}