'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginFormData, RegisterFormData } from '@/lib/types';
import { BookShelfLogo } from './BookShelfLogo';

export const LoginPage: React.FC = () => {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState<LoginFormData & RegisterFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError('Por favor, preencha todos os campos.');
        return;
      }

      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Email ou senha inválidos.');
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Por favor, preencha todos os campos.');
        return;
      }

      if (formData.password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      const success = await register(formData.name, formData.email, formData.password);
      if (!success) {
        setError('Erro ao criar conta. Verifique os dados e tente novamente.');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
    });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');

    if (!resetEmail) {
      setResetMessage('Por favor, digite seu email.');
      setResetLoading(false);
      return;
    }

    // Simular envio de email de reset
    setTimeout(() => {
      setResetMessage('Email de recuperação enviado! Verifique sua caixa de entrada.');
      setResetLoading(false);
    }, 2000);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setError('');
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat flex"
      style={{
        backgroundImage: `url('/background-library.jpg')`
      }}
    >
      {/* Blue gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-blue-900/90"
        style={{
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.9) 0%, rgba(39, 66, 103, 0.85) 50%, rgba(30, 58, 138, 0.9) 100%)'
        }}
      ></div>
      
      {/* Left Side - Brand */}
      <div className="w-3/5 relative z-10 flex flex-col justify-center items-center px-20">
        <div className="text-white text-center">
          <div className="mb-8 flex justify-center">
            <BookShelfLogo width={480} height={140} color="white" className="mx-auto" />
          </div>
          <p className="text-3xl leading-relaxed opacity-90 max-w-lg font-light">
            Sua estante de livros digitais.
          </p>
        </div>
      </div>

      {/* Right Side - Login Panel */}
      <div className="w-2/5 relative z-10 flex items-center justify-center px-8 py-8">
        <div className="w-full max-w-sm mx-auto">
        {/* Glass morphism panel */}
        <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl w-full"
             style={{ 
               backdropFilter: 'blur(20px)',
               background: 'rgba(255, 255, 255, 0.15)',
               boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)'
             }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold text-white mb-2 drop-shadow-lg">
              Bem-vindo
            </h1>
            <p className="text-white/80 text-sm">
              Entre com suas credenciais para continuar
            </p>
          </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/25 transition-all shadow-lg text-sm"
                placeholder="Digite seu nome"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/25 transition-all shadow-lg text-sm"
              placeholder="Digite seu email"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/25 transition-all shadow-lg text-sm"
              placeholder="••••••"
              disabled={loading}
            />
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-400 focus:ring-blue-300 border-white/30 rounded bg-white/20"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/90">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <button 
                  type="button"
                  onClick={handleForgotPasswordClick}
                  className="font-medium text-blue-300 hover:text-blue-200 underline transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl backdrop-blur-sm shadow-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-3 px-6 rounded-lg hover:from-cyan-500 hover:to-blue-600 focus:ring-2 focus:ring-blue-300/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-xl backdrop-blur-sm border border-white/20"
          >
            {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

          <div className="mt-6 text-center">
            <p className="text-white/90 text-sm">
              {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
              <button
                onClick={toggleMode}
                className="font-semibold text-blue-300 hover:text-blue-200 underline transition-colors"
              >
                {isLogin ? 'Cadastre-se gratuitamente' : 'Faça login'}
              </button>
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-white/60">
              Ao continuar, você concorda com nossos{' '}
              <button 
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-blue-300 hover:text-blue-200 underline transition-colors"
              >
                Termos de Serviço
              </button>{' '}
              e{' '}
              <button 
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="text-blue-300 hover:text-blue-200 underline transition-colors"
              >
              Política de Privacidade
            </button>
          </p>
        </div>
        </div>
        </div>
      </div>

      {/* Modal de Reset de Senha */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Recuperar Senha
            </h3>
            <p className="text-white/80 mb-6">
              Digite seu email para receber as instruções de recuperação.
            </p>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label htmlFor="resetEmail" className="block text-sm font-medium text-white mb-2">
                  Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/70 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all shadow-lg"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {resetMessage && (
                <div className={`mb-4 p-3 rounded-xl ${
                  resetMessage.includes('enviado') 
                    ? 'bg-green-500/20 border border-green-400/50 text-green-100' 
                    : 'bg-red-500/20 border border-red-400/50 text-red-100'
                } backdrop-blur-sm`}>
                  {resetMessage}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setResetMessage('');
                  }}
                  className="flex-1 bg-white/10 text-white py-3 px-4 rounded-xl hover:bg-white/20 transition-colors font-medium border border-white/20"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-300/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-xl backdrop-blur-sm border border-white/20"
                >
                  {resetLoading ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Termos de Serviço */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">
                Termos de Serviço
              </h3>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="text-white/80 space-y-4">
                <p>Bem-vindo ao BookShelf. Estes Termos de Serviço regem o uso da nossa plataforma.</p>
                <h4 className="text-white font-semibold">1. Uso da Plataforma</h4>
                <p>Você pode usar nossa plataforma para gerenciar sua biblioteca pessoal de livros digitais.</p>
                <h4 className="text-white font-semibold">2. Responsabilidades do Usuário</h4>
                <p>Você é responsável por manter a confidencialidade de sua conta e senha.</p>
                <h4 className="text-white font-semibold">3. Propriedade Intelectual</h4>
                <p>Todo o conteúdo da plataforma é protegido por direitos autorais.</p>
              </div>
            </div>
            <div className="p-6 border-t border-white/20">
              <button
                onClick={() => setShowTerms(false)}
                className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 transition-all font-medium shadow-xl backdrop-blur-sm border border-white/20"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Política de Privacidade */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">
                Política de Privacidade
              </h3>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="text-white/80 space-y-4">
                <p>Sua privacidade é importante para nós. Esta política explica como coletamos e usamos suas informações.</p>
                <h4 className="text-white font-semibold">1. Informações Coletadas</h4>
                <p>Coletamos apenas as informações necessárias para o funcionamento da plataforma.</p>
                <h4 className="text-white font-semibold">2. Uso das Informações</h4>
                <p>Usamos suas informações para personalizar sua experiência e melhorar nossos serviços.</p>
                <h4 className="text-white font-semibold">3. Compartilhamento</h4>
                <p>Não compartilhamos suas informações pessoais com terceiros.</p>
              </div>
            </div>
            <div className="p-6 border-t border-white/20">
              <button
                onClick={() => setShowPrivacy(false)}
                className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 transition-all font-medium shadow-xl backdrop-blur-sm border border-white/20"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-sm text-white/50">
          © 2025 BookShelf. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};