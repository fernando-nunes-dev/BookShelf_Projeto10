// app/biblioteca/page.tsx
import { prisma } from '@/lib/prisma';
import { BibliotecaView } from '@/components/shared/BibliotecaView';

export default async function BibliotecaPage() {
  const books = await prisma.book.findMany({
    include: { genre: true },
    orderBy: { createdAt: 'desc' },
  });

  const genres = await prisma.genre.findMany({
    orderBy: { name: 'asc' },
  });

  // O Server Component (página) busca os dados
  // e passa para o Client Component (BibliotecaView) que cuida da interatividade.
  return <BibliotecaView books={books} genres={genres} />;
}