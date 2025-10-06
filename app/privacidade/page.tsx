"use client";

import Link from "next/link";
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck } from "lucide-react";

export default function Privacidade() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao início
          </Link>
        </div>

        {/* Título principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--foreground)] mb-4">
            Política de Privacidade
          </h1>
          <p className="text-xl text-[var(--secondary-text)] max-w-2xl mx-auto">
            Sua privacidade é importante para nós. Saiba como protegemos seus dados.
          </p>
        </div>

        {/* Conteúdo */}
        <div className="space-y-8">
          {/* Coleta de dados */}
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-8 w-8 text-[var(--primary)]" />
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Coleta de Dados</h2>
            </div>
            <div className="text-[var(--secondary-text)] space-y-4">
              <p>
                O BookShelf coleta apenas as informações necessárias para oferecer uma experiência personalizada:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Nome e email para criação de conta</li>
                <li>Informações dos livros que você adiciona à sua biblioteca</li>
                <li>Progresso de leitura e avaliações</li>
                <li>Preferências de interface (tema claro/escuro)</li>
              </ul>
              <p>
                <strong>Não coletamos:</strong> dados de navegação detalhados, informações financeiras ou 
                dados pessoais desnecessários para o funcionamento da aplicação.
              </p>
            </div>
          </div>

          {/* Uso dos dados */}
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-8 w-8 text-[var(--primary)]" />
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Como Usamos seus Dados</h2>
            </div>
            <div className="text-[var(--secondary-text)] space-y-4">
              <p>Seus dados são utilizados exclusivamente para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Manter sua biblioteca pessoal organizada</li>
                <li>Fornecer recomendações de livros baseadas em suas preferências</li>
                <li>Sincronizar seus dados entre dispositivos</li>
                <li>Melhorar a experiência do usuário na plataforma</li>
              </ul>
              <div className="bg-[var(--background)] p-4 rounded-lg mt-4">
                <p className="font-semibold text-[var(--foreground)]">Compromisso:</p>
                <p>Nunca vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.</p>
              </div>
            </div>
          </div>

          {/* Segurança */}
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="h-8 w-8 text-[var(--primary)]" />
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Segurança</h2>
            </div>
            <div className="text-[var(--secondary-text)] space-y-4">
              <p>Implementamos medidas de segurança para proteger suas informações:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Armazenamento local seguro no seu dispositivo</li>
                <li>Criptografia de dados sensíveis</li>
                <li>Acesso restrito às informações pessoais</li>
                <li>Monitoramento regular de segurança</li>
              </ul>
            </div>
          </div>

          {/* Seus direitos */}
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <UserCheck className="h-8 w-8 text-[var(--primary)]" />
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Seus Direitos</h2>
            </div>
            <div className="text-[var(--secondary-text)] space-y-4">
              <p>Você tem o direito de:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Acessar suas informações pessoais a qualquer momento</li>
                <li>Corrigir dados incorretos ou desatualizados</li>
                <li>Excluir sua conta e todos os dados associados</li>
                <li>Exportar seus dados em formato legível</li>
                <li>Optar por não receber comunicações promocionais</li>
              </ul>
            </div>
          </div>

          {/* Cookies e tecnologias */}
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-[var(--primary)]" />
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Cookies e Tecnologias</h2>
            </div>
            <div className="text-[var(--secondary-text)] space-y-4">
              <p>
                Utilizamos tecnologias de armazenamento local (localStorage) para manter suas preferências 
                e dados da biblioteca. Estes dados ficam armazenados apenas no seu dispositivo.
              </p>
              <p>
                <strong>Não utilizamos cookies de rastreamento</strong> ou ferramentas de análise de terceiros 
                que comprometam sua privacidade.
              </p>
            </div>
          </div>

          {/* Alterações na política */}
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-[var(--foreground)] mb-4">
              Alterações nesta Política
            </h2>
            <div className="text-[var(--secondary-text)] space-y-4">
              <p>
                Esta política de privacidade pode ser atualizada ocasionalmente. Quando isso acontecer, 
                notificaremos os usuários sobre mudanças significativas através da própria plataforma.
              </p>
              <p>
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-[var(--primary)] text-white rounded-lg p-6 text-center">
            <h2 className="text-2xl font-semibold mb-4">Dúvidas sobre Privacidade?</h2>
            <p className="mb-4">
              Se você tiver dúvidas sobre esta política de privacidade ou sobre como tratamos seus dados, 
              entre em contato conosco.
            </p>
            <Link 
              href="/contato"
              className="bg-white text-[var(--primary)] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Fale Conosco
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}