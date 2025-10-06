import { User } from '@/lib/types';
import { mockBooks } from './mockBooks';

// Criar cópia dos livros para cada usuário
const createUserBooks = (userId: string) => {
  return mockBooks.map(book => ({
    ...book,
    id: `${userId}_${book.id}`,
    userId: userId
  }));
};

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@exemplo.com',
    password: '123456',
    createdAt: new Date('2024-01-15'),
    books: createUserBooks('1'),
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@exemplo.com',
    password: '654321',
    createdAt: new Date('2024-02-20'),
    books: createUserBooks('2'),
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro@exemplo.com',
    password: 'abcdef',
    createdAt: new Date('2024-03-10'),
    books: createUserBooks('3'),
  },
];

// Função para encontrar usuário por email
export const findUserByEmail = (email: string) => {
  return mockUsers.find(user => user.email === email);
};

// Função para verificar credenciais
export const validateCredentials = (email: string, password: string) => {
  const user = findUserByEmail(email);
  return user && user.password === password ? user : null;
};

// Função para criar novo usuário
export const createUser = (name: string, email: string, password: string): User => {
  const existingUser = findUserByEmail(email);
  if (existingUser) {
    throw new Error('Usuário já existe com este email');
  }

  const newUserId = (mockUsers.length + 1).toString();
  const newUser: User = {
    id: newUserId,
    name,
    email,
    password,
    createdAt: new Date(),
    books: createUserBooks(newUserId), // Novos usuários também recebem todos os 10 livros
  };

  mockUsers.push(newUser);
  return newUser;
};