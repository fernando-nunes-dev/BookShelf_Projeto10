import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { LayoutWrapper } from '@/components/shared/LayoutWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BookShelf - Sua Biblioteca Pessoal',
  description: 'Organize e acompanhe seus livros com BookShelf.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} flex flex-col min-h-screen transition-colors duration-300`}>
        {/* Script para aplicar tema antes da hidratação do React (previne FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('bookshelf-theme');
                  var sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var cls = 'light';
                  if(theme === 'dark') cls = 'dark';
                  else if(theme === 'system') cls = sysDark ? 'dark' : 'light';
                  else if(theme === 'light') cls = 'light';
                  else cls = sysDark ? 'dark' : 'light';
                  document.documentElement.classList.remove('light','dark');
                  document.documentElement.classList.add(cls);
                } catch(e) {}
              })();
            `
          }}
        />
        <ThemeProvider>
          <AuthProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
