import Link from 'next/link'
import Image from 'next/image'
import { 
  DocsH1, DocsH2, DocsH3, DocsP, DocsUL, DocsOL, DocsLI, 
  DocsCode, DocsPreCode, DocsStrong, DocsHR 
} from '@/components/docs/docs-styles'

export default function DocsPage() {
  return (
    <>
      <DocsH1>🏗️ ServiceHub - Documentação Oficial</DocsH1>
      
      <DocsP>
        <DocsStrong>
          Plataforma de marketplace de serviços que conecta clientes a prestadores locais
        </DocsStrong>
      </DocsP>

      <div className="flex flex-wrap gap-2 justify-center my-6">
        <Image 
          src="https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel" 
          alt="Deployed on Vercel" 
          width={150} 
          height={35}
        />
        <Image 
          src="https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js" 
          alt="Built with Next.js" 
          width={180} 
          height={35}
        />
        <Image 
          src="https://img.shields.io/badge/Powered%20by-Supabase-green?style=for-the-badge&logo=supabase" 
          alt="Powered by Supabase" 
          width={160} 
          height={35}
        />
      </div>

      <DocsHR />

      <DocsH2>📋 <DocsStrong>Visão Geral</DocsStrong></DocsH2>
      
      <DocsP>
        ServiceHub é uma aplicação completa de marketplace que permite a <DocsStrong>clientes solicitarem serviços</DocsStrong> e <DocsStrong>prestadores oferecerem seus trabalhos</DocsStrong> de forma organizada, segura e eficiente. A plataforma oferece um ecossistema completo para gestão de serviços locais.
      </DocsP>

      <DocsH3>✨ <DocsStrong>Funcionalidades Principais</DocsStrong></DocsH3>
      <DocsUL>
        <DocsLI>🔐 <DocsStrong>Sistema de Autenticação Completo</DocsStrong> (Supabase Auth)</DocsLI>
        <DocsLI>👥 <DocsStrong>Dois tipos de usuário</DocsStrong>: Cliente e Prestador</DocsLI>
        <DocsLI>🌙 <DocsStrong>Dark/Light Mode</DocsStrong> com persistência</DocsLI>
        <DocsLI>📱 <DocsStrong>Interface Responsiva</DocsStrong> (Desktop + Mobile)</DocsLI>
        <DocsLI>💬 <DocsStrong>Sistema de Notificações</DocsStrong> e Chat</DocsLI>
        <DocsLI>👤 <DocsStrong>Perfil Dinâmico</DocsStrong> baseado no tipo de usuário</DocsLI>
        <DocsLI>🎨 <DocsStrong>Design System</DocsStrong> moderno com Radix UI + Tailwind</DocsLI>
      </DocsUL>

      <DocsHR />

      <DocsH2>🚀 <DocsStrong>Comece por aqui</DocsStrong></DocsH2>
      
      <DocsH3><DocsStrong>Pré-requisitos</DocsStrong></DocsH3>
      <DocsUL>
        <DocsLI>Node.js 18+</DocsLI>
        <DocsLI>NPM ou Yarn</DocsLI>
        <DocsLI>Supabase</DocsLI>
      </DocsUL>

      <DocsH3><DocsStrong>Instalação</DocsStrong></DocsH3>
      <DocsPreCode>{`# Clone o repositório
git clone https://github.com/your-repo/servicehub.git
cd servicehub

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Adicione suas chaves do Supabase

# Execute o projeto
npm run dev`}</DocsPreCode>

      <DocsH3><DocsStrong>Comandos Disponíveis</DocsStrong></DocsH3>
      <DocsPreCode>{`npm run dev      # Desenvolvimento local
npm run build    # Build para produção
npm run start    # Inicia produção
npm run lint     # Executa ESLint`}</DocsPreCode>

      <DocsHR />

      <DocsH2>🏗️ <DocsStrong>Arquitetura Técnica</DocsStrong></DocsH2>
      
      <DocsH3><DocsStrong>Stack Tecnológica</DocsStrong></DocsH3>
      <DocsUL>
        <DocsLI>⚡ <DocsStrong>Framework</DocsStrong>: Next.js 15 (App Router)</DocsLI>
        <DocsLI>⚛️ <DocsStrong>React</DocsStrong>: 19 (Server Components + Client Components)</DocsLI>
        <DocsLI>🗄️ <DocsStrong>Database</DocsStrong>: Supabase (PostgreSQL)</DocsLI>
        <DocsLI>🔐 <DocsStrong>Auth</DocsStrong>: Supabase Authentication</DocsLI>
        <DocsLI>💅 <DocsStrong>Styling</DocsStrong>: Tailwind CSS + Radix UI</DocsLI>
        <DocsLI>🎨 <DocsStrong>Icons</DocsStrong>: Lucide React</DocsLI>
        <DocsLI>🌙 <DocsStrong>Theme</DocsStrong>: next-themes</DocsLI>
        <DocsLI>📝 <DocsStrong>Forms</DocsStrong>: React Hook Form + Zod</DocsLI>
        <DocsLI>🚀 <DocsStrong>Deploy</DocsStrong>: Vercel</DocsLI>
      </DocsUL>

      <DocsH3><DocsStrong>Estrutura de Pastas</DocsStrong></DocsH3>
      <DocsPreCode>{`app/                    # Next.js App Router
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
└── auth.ts            # Tipos de autenticação`}</DocsPreCode>

      <DocsHR />

      <DocsH2>🔐 <DocsStrong>Sistema de Autenticação</DocsStrong></DocsH2>
      
      <DocsH3><DocsStrong>Fluxo de Autenticação</DocsStrong></DocsH3>
      <DocsOL>
        <DocsLI><DocsStrong>Cadastro</DocsStrong>: Cliente ou Prestador se cadastra via Supabase Auth</DocsLI>
        <DocsLI><DocsStrong>Login</DocsStrong>: Autenticação com email/senha</DocsLI>
        <DocsLI><DocsStrong>Hook Centralizado</DocsStrong>: <DocsCode>useAuth</DocsCode> gerencia estado global</DocsLI>
        <DocsLI><DocsStrong>Tipos de Usuário</DocsStrong>: Diferenciação automática no sistema</DocsLI>
        <DocsLI><DocsStrong>Interface Adaptativa</DocsStrong>: Menu e funcionalidades baseadas no tipo</DocsLI>
      </DocsOL>

      <DocsH3><DocsStrong>Hook <DocsCode>useAuth</DocsCode></DocsStrong></DocsH3>
      <DocsPreCode>{`const { user, loading, logout } = useAuth()

// user.type: 'cliente' | 'prestador' | 'client' | 'provider'
// user.name, user.email, user.avatar`}</DocsPreCode>

      <DocsH3><DocsStrong>Proteção de Rotas</DocsStrong></DocsH3>
      <DocsUL>
        <DocsLI>Middleware automático para rotas protegidas</DocsLI>
        <DocsLI>Redirecionamento baseado no tipo de usuário</DocsLI>
        <DocsLI>Loading states durante autenticação</DocsLI>
      </DocsUL>

      <DocsHR />

      <DocsH2>📚 <DocsStrong>Documentação Adicional</DocsStrong></DocsH2>
      
      <DocsUL>
        <DocsLI>📋 <DocsStrong><Link href="/docs/todo" className="text-blue-600 hover:text-blue-800 underline">TODO - Lista de Tarefas</Link></DocsStrong>: Roadmap completo e tarefas pendentes</DocsLI>
        <DocsLI>📄 <DocsStrong><Link href="/docs/summary" className="text-blue-600 hover:text-blue-800 underline">Resumo de Implementações</Link></DocsStrong>: Resumo de implementações realizadas</DocsLI>
      </DocsUL>

      <DocsHR />

      <DocsH2>🚀 <DocsStrong>Deploy</DocsStrong></DocsH2>
      
      <DocsH3><DocsStrong>Teste</DocsStrong></DocsH3>
      <DocsUL>
        <DocsLI><DocsStrong>URL</DocsStrong>: <Link href="https://servicehubtest.vercel.app/" className="text-blue-600 hover:text-blue-800 underline">https://servicehubtest.vercel.app/</Link></DocsLI>
        <DocsLI><DocsStrong>CI/CD</DocsStrong>: Automático via Vercel</DocsLI>
        <DocsLI><DocsStrong>Environment</DocsStrong>: Configurado com Supabase</DocsLI>
      </DocsUL>

      <DocsH3><DocsStrong>Ambientes</DocsStrong></DocsH3>
      <DocsUL>
        <DocsLI><DocsStrong>Development</DocsStrong>: <DocsCode>npm run dev</DocsCode> (local)</DocsLI>
        <DocsLI><DocsStrong>Production</DocsStrong>: Deploy automatizado</DocsLI>
        <DocsLI><DocsStrong>Staging</DocsStrong>: <em>A ser implementado</em></DocsLI>
      </DocsUL>

      <DocsHR />

      <div className="text-center">
        <DocsP>
          <DocsStrong>
            🌟 ServiceHub - Conectando pessoas através de serviços de qualidade
          </DocsStrong>
        </DocsP>
      </div>
    </>
  )
}