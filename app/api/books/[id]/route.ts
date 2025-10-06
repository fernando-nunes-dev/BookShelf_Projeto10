// app/api/books/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET (Obter um livro específico)
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id }, // O erro apontava aqui, mas a sintaxe está correta para esta versão.
      include: { genre: true },
    });
    if (!book) {
      return NextResponse.json({ message: 'Livro não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(book);
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao buscar o livro.' }, { status: 500 });
  }
}

// PUT (Atualizar um livro) - CORRIGIDO
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { genreId, ...bookData } = data;

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: {
        ...bookData,
        ...(genreId && {
          genre: { connect: { id: genreId } },
        }),
      },
      include: { genre: true },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("Erro ao atualizar o livro:", error);
    return NextResponse.json({ message: 'Erro ao atualizar o livro.' }, { status: 400 });
  }
}

// DELETE (Remover um livro)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.book.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Livro removido com sucesso!' });
  } catch (error) {
    return NextResponse.json({ message: 'Erro ao remover o livro.' }, { status: 500 });
  }
}