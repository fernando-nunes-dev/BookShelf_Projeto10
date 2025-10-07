// prisma/seed.ts
import { prisma } from '../lib/prisma';
import { mockGenres } from '../data/mockGenres';
import { mockBooks } from '../data/mockBooks';

async function main() {
  console.log('Iniciando o processo de semeadura...');

  // Limpa o banco de dados
  await prisma.book.deleteMany({});
  await prisma.genre.deleteMany({});
  console.log('Tabelas limpas com sucesso.');

  // Cria um mapa para armazenar os gêneros criados (Nome -> ID)
  const createdGenres = new Map<string, string>();
  for (const name of mockGenres) {
    const genre = await prisma.genre.create({ data: { name } });
    createdGenres.set(name, genre.id);
  }
  console.log('Gêneros semeados com sucesso.');

  // Itera sobre os livros para criá-los no banco
  for (const book of mockBooks) {
    console.log(`Processando livro: "${book.title}", Gênero: "${book.genre}"`);
    const genreId = createdGenres.get(book.genre);

    // Verificação explícita para o TypeScript
    if (genreId === undefined) {
      console.error(`ERRO: Gênero "${book.genre}" do livro "${book.title}" não foi encontrado na lista de gêneros. Verifique seus arquivos de dados.`);
      // Pula este livro e continua com o próximo
      continue;
    }

    // Se a verificação passou, cria o livro
    await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        year: book.year,
        pages: book.pages,
        rating: book.rating,
        synopsis: book.synopsis,
        coverUrl: book.coverUrl,
        genreId: genreId,
      },
    });
    console.log(`-> Livro "${book.title}" criado com sucesso.`);
  }
  console.log('Todos os livros foram semeados.');
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro crítico durante a semeadura:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Processo de semeadura finalizado.');
  });