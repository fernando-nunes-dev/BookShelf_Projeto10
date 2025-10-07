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
    <div 
      className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url('/background-library.jpg')`
      }}
    >
      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-purple-900/80"></div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Faça seu Login.
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-3">
                Nome
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-4 bg-gray-900/60 border-2 border-blue-500 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
                placeholder="Seu nome completo"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-3">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-900/60 border-2 border-blue-500 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all backdrop-blur-sm"
              placeholder="seu@email.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-3">
              Senha
            </label>
            <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border text-gray-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
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
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Lembrar-me
                    </label>
                  </div>

                  <div className="text-sm">
                    <button 
                      type="button"
                      onClick={handleForgotPasswordClick}
                      className="font-medium text-blue-600 hover:text-blue-800"
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
              >
                {loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar conta'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                <button
                  onClick={toggleMode}
                  className="font-medium text-blue-600 hover:text-blue-800"
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
                  className="text-blue-600 hover:underline"
                >
                  Termos de Serviço
                </button>{' '}
                e{' '}
                <button 
                  type="button"
                  onClick={() => setShowPrivacy(true)}
                  className="text-blue-600 hover:underline"
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
                  className="w-full px-4 py-3 border text-gray-700 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
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
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
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
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-lg"
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