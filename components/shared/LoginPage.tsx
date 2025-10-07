'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginFormData, RegisterFormData } from '@/lib/types';
import { BookShelfLogo } from './BookShelfLogo';

export const LoginPage: React.FC = () => {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [formData, setFormData] = useState<LoginFormData & RegisterFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

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

      const success = await register(formData.name, formData.email, formData.password);
      if (!success) {
        setError('Erro ao criar conta. Tente novamente.');
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');
    
    if (!resetEmail) {
      setResetMessage('Por favor, insira seu email.');
      setResetLoading(false);
      return;
    }
    
    // Simulação de envio de email (em produção, isso seria uma chamada real para API)
    setTimeout(() => {
      setResetMessage('Um link para redefinir sua senha foi enviado para seu email.');
      setResetLoading(false);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetEmail('');
        setResetMessage('');
      }, 3000);
    }, 2000);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Brand */}
      <div className="flex-1 relative overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/background-library.jpg')`
          }}
        ></div>
        
        {/* Blue translucent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/80 via-[var(--primary)]/85 to-[var(--primary)]/90"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-16 w-full">
          {/* Title and description */}
          <div className="text-white text-center w-full flex flex-col items-center">
            <div className="mb-2 flex justify-center">
              <BookShelfLogo width={420} height={120} color="white" className="mx-auto" />
            </div>
            <p className="text-2xl leading-relaxed opacity-90 max-w-md">
                Sua estante de livros digitais.

            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {isLogin ? 'Bem-vindo' : 'Criar conta'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Entre com suas credenciais para continuar' 
                  : 'Crie sua conta para começar'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                      placeholder="Seu nome completo"
                      disabled={loading}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                    placeholder="seu@email.com"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                    placeholder="••••••"
                    disabled={loading}
                  />
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)] border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Lembrar-me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button 
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--primary-hover)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar conta'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                <button
                  onClick={toggleMode}
                  className="font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
                >
                  {isLogin ? 'Cadastre-se gratuitamente' : 'Faça login'}
                </button>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Ao continuar, você concorda com nossos{' '}
                <button 
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-[var(--primary)] hover:underline"
                >
                  Termos de Serviço
                </button>{' '}
                e{' '}
                <button 
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-[var(--primary)] hover:underline"
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Esqueceu sua senha?
              </h3>
              <p className="text-gray-600">
                Digite seu email e enviaremos um link para redefinir sua senha.
              </p>
            </div>

            <form onSubmit={handleForgotPassword}>
              <div className="mb-4">
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {resetMessage && (
                <div className={`mb-4 p-3 rounded-lg ${
                  resetMessage.includes('enviado') 
                    ? 'bg-green-50 border border-green-300 text-green-700' 
                    : 'bg-red-50 border border-red-300 text-red-700'
                }`}>
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
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="flex-1 bg-[var(--primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--primary-hover)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                Termos de Serviço
              </h3>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-sm text-gray-600 space-y-4">
                <h4 className="font-semibold text-gray-900">1. Aceitação dos Termos</h4>
                <p>Ao utilizar o BookShelf, você concorda em cumprir estes Termos de Serviço e todas as leis aplicáveis.</p>
                
                <h4 className="font-semibold text-gray-900">2. Uso da Plataforma</h4>
                <p>Você pode usar nossa plataforma para gerenciar sua biblioteca pessoal de livros, adicionar resenhas e descobrir novos títulos.</p>
                
                <h4 className="font-semibold text-gray-900">3. Conta do Usuário</h4>
                <p>Você é responsável por manter a confidencialidade de sua conta e senha, e por todas as atividades realizadas em sua conta.</p>
                
                <h4 className="font-semibold text-gray-900">4. Conteúdo</h4>
                <p>Todo conteúdo que você compartilha deve ser próprio ou você deve ter permissão para compartilhá-lo. Não é permitido conteúdo ofensivo ou ilegal.</p>
                
                <h4 className="font-semibold text-gray-900">5. Propriedade Intelectual</h4>
                <p>O BookShelf e seu conteúdo são protegidos por direitos autorais e outras leis de propriedade intelectual.</p>
                
                <h4 className="font-semibold text-gray-900">6. Limitação de Responsabilidade</h4>
                <p>O BookShelf é fornecido &quot;como está&quot; e não garantimos que seja livre de erros ou interrupções.</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTerms(false)}
                className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Política de Privacidade */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">
                Política de Privacidade
              </h3>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose prose-sm text-gray-600 space-y-4">
                <h4 className="font-semibold text-gray-900">1. Coleta de Informações</h4>
                <p>Coletamos informações que você nos fornece diretamente, como nome, email e informações sobre seus livros.</p>
                
                <h4 className="font-semibold text-gray-900">2. Uso das Informações</h4>
                <p>Usamos suas informações para:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Personalizar sua experiência</li>
                  <li>Comunicar sobre atualizações e recursos</li>
                  <li>Garantir a segurança da plataforma</li>
                </ul>
                
                <h4 className="font-semibold text-gray-900">3. Compartilhamento de Informações</h4>
                <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto conforme descrito nesta política.</p>
                
                <h4 className="font-semibold text-gray-900">4. Segurança</h4>
                <p>Implementamos medidas de segurança adequadas para proteger suas informações contra acesso não autorizado.</p>
                
                <h4 className="font-semibold text-gray-900">5. Cookies</h4>
                <p>Utilizamos cookies para melhorar sua experiência e analisar como você usa nossa plataforma.</p>
                
                <h4 className="font-semibold text-gray-900">6. Seus Direitos</h4>
                <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento.</p>
                
                <h4 className="font-semibold text-gray-900">7. Contato</h4>
                <p>Se você tiver dúvidas sobre esta política, entre em contato conosco através do email: privacidade@bookshelf.com</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowPrivacy(false)}
                className="w-full bg-[var(--primary)] text-white py-3 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};