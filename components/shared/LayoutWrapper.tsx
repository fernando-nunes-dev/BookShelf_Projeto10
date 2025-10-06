'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Não mostrar navbar/footer durante loading ou quando não autenticado
  if (loading || !isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>
      <Footer />
    </>
  );
};