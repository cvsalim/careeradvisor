export type Locale = "en" | "pt";

export const locales: Locale[] = ["en", "pt"];

export const defaultLocale: Locale = "pt";

export const dictionaries = {
  en: {
    nav: {
      overview: "Overview",
      groups: {
        clients: "Clients",
        strategy: "Strategy",
        execution: "Execution",
        intelligence: "Intelligence",
      },
      clients: "Clients",
      careerIntelligence: "Career Intelligence",
      professionalDna: "Professional DNA",
      objectives: "Objectives",
      positioning: "Positioning",
      decisions: "Decisions",
      priorities: "Priorities",
      tasks: "Tasks",
      content: "Content",
      meetings: "Meetings",
      opportunities: "Opportunities",
      market: "Market",
      reports: "Reports",
      settings: "Settings",
    },
    topbar: {
      search: "Search",
      logout: "Log out",
    },
    dashboard: {
      greeting: "Good morning",
      subtitle: "Your advisory office",
      activeClients: "Active Clients",
      priorities: "Priorities",
      decisions: "Decisions",
      today: "Today",
      todayEmpty:
        "No priorities scheduled yet. Once clients and tasks are registered, today's agenda will appear here.",
      recentIntelligence: "Recent Intelligence",
      recentIntelligenceEmpty:
        "Insights, decisions and opportunities will be summarized here as they are recorded.",
      thisWeek: "This Week",
      thisWeekEmpty:
        "Meetings, tasks, reviews and reports for the week will be listed here.",
    },
    login: {
      title: "Advisor Career Office",
      subtitle: "Private advisory workspace",
      email: "E-mail",
      password: "Password",
      submit: "Sign in",
      submitting: "Signing in...",
    },
    placeholder: {
      title: "Coming soon",
      description: "This module hasn't been built yet.",
    },
  },
  pt: {
    nav: {
      overview: "Visão Geral",
      groups: {
        clients: "Clientes",
        strategy: "Estratégia",
        execution: "Execução",
        intelligence: "Inteligência",
      },
      clients: "Clientes",
      careerIntelligence: "Inteligência de Carreira",
      professionalDna: "DNA Profissional",
      objectives: "Objetivos",
      positioning: "Posicionamento",
      decisions: "Decisões",
      priorities: "Prioridades",
      tasks: "Tarefas",
      content: "Conteúdos",
      meetings: "Reuniões",
      opportunities: "Oportunidades",
      market: "Mercado",
      reports: "Relatórios",
      settings: "Configurações",
    },
    topbar: {
      search: "Buscar",
      logout: "Sair",
    },
    dashboard: {
      greeting: "Bom dia",
      subtitle: "Seu escritório de advisory",
      activeClients: "Clientes Ativos",
      priorities: "Prioridades",
      decisions: "Decisões",
      today: "Hoje",
      todayEmpty:
        "Nenhuma prioridade agendada ainda. Quando clientes e tarefas forem cadastrados, a agenda de hoje aparecerá aqui.",
      recentIntelligence: "Inteligência Recente",
      recentIntelligenceEmpty:
        "Insights, decisões e oportunidades serão resumidos aqui conforme forem registrados.",
      thisWeek: "Esta Semana",
      thisWeekEmpty:
        "Reuniões, tarefas, revisões e relatórios da semana serão listados aqui.",
    },
    login: {
      title: "Advisor Career Office",
      subtitle: "Espaço de trabalho privado de advisory",
      email: "E-mail",
      password: "Senha",
      submit: "Entrar",
      submitting: "Entrando...",
    },
    placeholder: {
      title: "Em breve",
      description: "Este módulo ainda não foi construído.",
    },
  },
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
