"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Users, MessageCircle, Send } from "lucide-react";

export default function Contato() {
  const teamMembers = [
    {
      name: "Giovanna",
      email: "gifernandessilva1234097@gmail.com",
      role: "Desenvolvedora"
    },
    {
      name: "Mariana",
      email: "mariana4ads@gmail.com",
      role: "Desenvolvedora"
    },
    {
      name: "Rai",
      email: "raiffson@gmail.com",
      role: "Desenvolvedor"
    },
    {
      name: "Fernando",
      email: "fernandonunes198326@gmail.com",
      role: "Desenvolvedor"
    },
    {
      name: "Henrique",
      email: "henryk33658@gmail.com",
      role: "Desenvolvedor"
    },
    {
      name: "Viviane",
      email: "",
      role: "Desenvolvedora"
    },
    {
      name: "Rayssa",
      email: "",
      role: "Desenvolvedora"
    }
  ];

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
            Fale Conosco
          </h1>
          <p className="text-xl text-[var(--secondary-text)] max-w-2xl mx-auto">
            Entre em contato com nossa equipe. Estamos aqui para ajudar!
          </p>
        </div>

        {/* Informações gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageCircle className="h-8 w-8 text-[var(--primary)]" />
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Como podemos ajudar?</h2>
            </div>
            <div className="text-[var(--secondary-text)] space-y-3">
              <p>Estamos sempre dispostos a ajudar com:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Dúvidas sobre o uso da plataforma</li>
                <li>Sugestões de melhorias</li>
                <li>Relatório de problemas técnicos</li>
                <li>Feedback sobre recursos</li>
                <li>Parcerias e colaborações</li>
              </ul>
            </div>
          </div>

          <div className="bg-[var(--card-bg)] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Send className="h-8 w-8 text-[var(--primary)]" />
              <h2 className="text-2xl font-semibold text-[var(--foreground)]">Tempo de Resposta</h2>
            </div>
            <div className="text-[var(--secondary-text)] space-y-3">
              <p>Nossos tempos médios de resposta:</p>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span>Dúvidas gerais:</span>
                  <span className="font-semibold">24-48h</span>
                </li>
                <li className="flex justify-between">
                  <span>Problemas técnicos:</span>
                  <span className="font-semibold">12-24h</span>
                </li>
                <li className="flex justify-between">
                  <span>Parcerias:</span>
                  <span className="font-semibold">3-5 dias</span>
                </li>
              </ul>
              <p className="text-sm italic mt-4">
                * Tempos podem variar em feriados e fins de semana
              </p>
            </div>
          </div>
        </div>

        {/* Equipe */}
        <div className="bg-[var(--card-bg)] rounded-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Users className="h-8 w-8 text-[var(--primary)]" />
            <h2 className="text-3xl font-bold text-[var(--foreground)]">Nossa Equipe</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-[var(--background)] rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">
                    {member.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-[var(--foreground)] mb-2">
                  {member.name}
                </h3>
                <p className="text-[var(--secondary-text)] mb-4">{member.role}</p>
                {member.email ? (
                  <>
                    <a 
                      href={`mailto:${member.email}`}
                      className="flex items-center justify-center gap-2 text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      Enviar email
                    </a>
                    <p className="text-xs text-[var(--secondary-text)] mt-2 break-all">
                      {member.email}
                    </p>
                  </>
                ) : (
                  <p className="text-xs text-[var(--secondary-text)] italic">
                    Contato disponível em breve
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Formulário de contato rápido */}
        <div className="bg-[var(--card-bg)] rounded-lg p-8">
          <h2 className="text-2xl font-bold text-[var(--foreground)] text-center mb-6">
            Envie uma Mensagem Rápida
          </h2>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="Digite seu nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                    Seu Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Assunto
                </label>
                <select className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent">
                  <option value="">Selecione um assunto</option>
                  <option value="duvida">Dúvida sobre o uso</option>
                  <option value="problema">Problema técnico</option>
                  <option value="sugestao">Sugestão de melhoria</option>
                  <option value="parceria">Parceria/Colaboração</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  Mensagem
                </label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg text-[var(--foreground)] placeholder-[var(--secondary-text)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent resize-none"
                  placeholder="Descreva sua mensagem aqui..."
                ></textarea>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--foreground)] font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                >
                  <Send className="h-4 w-4" />
                  Enviar Mensagem
                </button>
                <p className="text-xs text-[var(--secondary-text)] mt-2">
                  Ao enviar, você será redirecionado para seu cliente de email padrão
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}