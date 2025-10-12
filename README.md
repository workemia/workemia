# 🏗️ Workemia

**Plataforma de marketplace de serviços que conecta clientes a prestadores locais**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/vitorpaulalucas-8688s-projects/v0-teste1)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Powered by Supabase](https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![wakatime](https://wakatime.com/badge/user/5b16e0ec-6419-487c-9792-82c9468dd942/project/a232da2f-1ac2-4028-84f0-b249e2ffab14.svg)](https://wakatime.com/badge/user/5b16e0ec-6419-487c-9792-82c9468dd942/project/a232da2f-1ac2-4028-84f0-b249e2ffab14)

---

## 📋 **Visão Geral**

Workemia é uma aplicação completa de marketplace que permite a **clientes solicitarem serviços** e **prestadores oferecerem seus trabalhos** de forma organizada, segura e eficiente. A plataforma oferece um ecossistema completo para gestão de serviços locais.

### ✨ **Funcionalidades Principais**
- 🔐 **Sistema de Autenticação Completo** (Supabase Auth)
- 👥 **Dois tipos de usuário**: Cliente e Prestador
- 🌙 **Dark/Light Mode** com persistência
- 📱 **Interface Responsiva** (Desktop + Mobile)
- 💬 **Sistema de Notificações** e Chat
- 👤 **Perfil Dinâmico** baseado no tipo de usuário
- 🎨 **Design System** moderno com Radix UI + Tailwind

---

## 🚀 **Getting Started**

### **Pré-requisitos**
- Node.js 18+ 
- NPM ou Yarn
- Conta no Supabase

### **Instalação**
```bash
# Clone o repositório
git clone https://github.com/your-repo/servicehub.git
cd servicehub

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Adicione suas chaves do Supabase

# Execute o projeto
npm run dev
```

### **Comandos Disponíveis**
```bash
npm run dev      # Desenvolvimento local
npm run build    # Build para produção
npm run start    # Inicia produção
npm run lint     # Executa ESLint
```

---

## 🏗️ **Arquitetura Técnica**

### **Stack Tecnológica**
- ⚡ **Framework**: Next.js 15 (App Router)
- ⚛️ **React**: 19 (Server Components + Client Components)
- 🗄️ **Database**: Supabase (PostgreSQL)
- 🔐 **Auth**: Supabase Authentication
- 💅 **Styling**: Tailwind CSS + Radix UI
- 🎨 **Icons**: Lucide React
- 🌙 **Theme**: next-themes
- 📝 **Forms**: React Hook Form + Zod
- 🚀 **Deploy**: Vercel

### **Estrutura de Pastas**
```
app/                    # Next.js App Router
├── cadastro/          # Página de cadastro
├── dashboard/         # Dashboards dinâmicos
│   ├── cliente/       # Dashboard do cliente
│   └── prestador/     # Dashboard do prestador
├── perfil/            # Perfil unificado
├── chat/              # Sistema de mensagens
└── globals.css        # Estilos globais

components/             # Componentes React
├── ui/                # Componentes base (Radix UI)
├── header.tsx         # Header com menu de usuário
├── theme-provider.tsx # Provider de tema
└── theme-toggle.tsx   # Toggle de tema

hooks/                  # Custom Hooks
└── use-auth.ts        # Hook de autenticação centralizado

lib/                    # Utilitários
├── supabase/          # Cliente Supabase
└── utils.ts           # Funções utilitárias

types/                  # Definições TypeScript
└── auth.ts            # Tipos de autenticação
```

---

## 🔐 **Sistema de Autenticação**

### **Fluxo de Autenticação**
1. **Cadastro**: Cliente ou Prestador se cadastra via Supabase Auth
2. **Login**: Autenticação com email/senha
3. **Hook Centralizado**: `useAuth` gerencia estado global
4. **Tipos de Usuário**: Diferenciação automática no sistema
5. **Interface Adaptativa**: Menu e funcionalidades baseadas no tipo

### **Hook `useAuth`**
```typescript
const { user, loading, logout } = useAuth()

// user.type: 'cliente' | 'prestador' | 'client' | 'provider'
// user.name, user.email, user.avatar
```

### **Proteção de Rotas**
- Middleware automático para rotas protegidas
- Redirecionamento baseado no tipo de usuário
- Loading states durante autenticação

---

## 🎨 **Design System**

### **Componentes Base**
- **Header**: Menu completo com avatar e dropdown
- **ThemeToggle**: Switch entre dark/light mode  
- **Avatar**: Dinâmico com iniciais do usuário
- **Buttons**: Variantes consistentes (primary, ghost, outline)
- **Forms**: Integração com React Hook Form + validação

### **Temas**
- 🌞 **Light Mode**: Interface clara e limpa
- 🌙 **Dark Mode**: Interface escura e elegante
- 🔄 **Toggle Persistente**: Preferência salva no localStorage

---

## 👥 **Tipos de Usuário**

### **👤 Cliente**
- **Dashboard**: 5 abas (Visão Geral, Serviços Ativos, Histórico, Favoritos, Mensagens)
- **Funcionalidades**:
  - Solicitar serviços
  - Visualizar propostas
  - Gerenciar agendamentos
  - Avaliar prestadores
  - Chat com prestadores

### **🔧 Prestador**
- **Dashboard**: 5 abas (Visão Geral, Solicitações, Agenda, Histórico, Estatísticas)
- **Perfil Completo**: Portfolio, avaliações, serviços
- **Funcionalidades**:
  - Receber solicitações
  - Enviar propostas
  - Gerenciar agenda
  - Chat com clientes

---

## 📊 **Status do Projeto**

### ✅ **Implementado (40%)**
- [x] Sistema de Autenticação Completo
- [x] Interface Base (Header, Footer, Navegação)
- [x] Dashboard Cliente e Prestador
- [x] Perfil Unificado Dinâmico
- [x] Sistema de Temas (Dark/Light)
- [x] Estrutura de Chat/Mensagens (UI)
- [x] Sistema de Notificações Básico

### 🚧 **Em Desenvolvimento**
- [ ] Sistema de Solicitação de Serviços
- [ ] Sistema de Pagamentos
- [ ] Backend de Mensagens Real-time
- [ ] Sistema de Avaliações
- [ ] Upload de Arquivos

### 🔮 **Roadmap**
- [ ] Agendamento/Calendário
- [ ] Sistema de Busca Avançada
- [ ] App Mobile (React Native)
- [ ] Painel Administrativo

---

## 🐛 **Bugs Resolvidos Recentemente**

### ✅ **Correções Críticas Implementadas**
- **Erro de Hidratação**: Corrigido com `suppressHydrationWarning`
- **Timeout 504 no Cadastro**: Reformulado fluxo de autenticação
- **Avatar Component**: Estrutura corrigida no dashboard
- **Placeholder.svg 404**: Removidas todas as referências
- **Redundância de Perfil**: Arquitetura unificada implementada

---

## 🤝 **Contribuindo**

### **Development Workflow**
1. Crie uma branch para sua feature
2. Implemente seguindo os padrões do projeto
3. Execute testes e lint
4. Faça commit seguindo conventional commits
5. Abra um Pull Request

### **Padrões de Código**
- TypeScript obrigatório
- Componentes funcionais com hooks
- Tailwind para styling
- ESLint + Prettier para formatação

---

## 📚 **Documentação Adicional**

- 📋 **[TODO.md](./TODO.md)**: Roadmap completo e tarefas pendentes
- 📄 **[Summary.md](./Summary.md)**: Resumo de implementações realizadas
- 🔧 **[CLAUDE.md](./CLAUDE.md)**: Documentação técnica para IA assistants

---

## 🚀 **Deploy**

### **Produção**
- **URL**: [https://vercel.com/vitorpaulalucas-8688s-projects/v0-teste1](https://vercel.com/vitorpaulalucas-8688s-projects/v0-teste1)
- **CI/CD**: Automático via Vercel
- **Environment**: Configurado com Supabase

### **Ambientes**
- **Development**: `npm run dev` (local)
- **Production**: Deploy automático no Vercel
- **Staging**: *A ser implementado*

---

## 🆘 **Suporte**

### **Contato**
- **Developer**: Zeneilton Granja de Paulo
- **Email**: [cto@workemia.com](mailto:cto@workemia.com)
- **Wakatime**: [Acompanhe o progresso](https://wakatime.com/badge/user/5b16e0ec-6419-487c-9792-82c9468dd942/project/a232da2f-1ac2-4028-84f0-b249e2ffab14)

---

**🌟 Workemia - Conectando pessoas através de serviços de qualidade**
