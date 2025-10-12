import { 
  DocsH1, DocsH2, DocsH3, DocsP, DocsUL, DocsOL, DocsLI, 
  DocsCode, DocsPreCode, DocsStrong, DocsHR, DocsBadge
} from '@/components/docs/docs-styles'

function TaskSection({
  title,
  status,
  priority,
  tasks,
  files
}: {
  title: string
  status: 'completed' | 'partial' | 'pending'
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  tasks: Array<{
    name: string
    completed: boolean
    subtasks: Array<{ name: string; completed: boolean }>
  }>
  files?: string[]
}) {
  const statusBadges = {
    completed: <DocsBadge type="ok">✅ Funcional e robusto</DocsBadge>,
    partial: <DocsBadge type="warn">⚠️ Parcialmente implementado</DocsBadge>,
    pending: <DocsBadge type="error">❌ Não implementado</DocsBadge>
  }

  const priorityBadges = {
    P0: <DocsBadge type="error">P0 - Crítica</DocsBadge>,
    P1: <DocsBadge type="warn">P1 - Alta</DocsBadge>,
    P2: <DocsBadge type="info">P2 - Média</DocsBadge>,
    P3: <DocsBadge type="info">P3 - Baixa</DocsBadge>
  }

  return (
    <div className="mb-8">
      <DocsH3>{title}</DocsH3>
      <DocsP>
        <DocsStrong>Status</DocsStrong>: {statusBadges[status]}<br />
        <DocsStrong>Prioridade</DocsStrong>: {priorityBadges[priority]}
      </DocsP>

      <DocsUL>
        {tasks.map((task, index) => (
          <DocsLI key={index}>
            <DocsP>
              [{task.completed ? 'x' : ' '}] <DocsStrong>{task.name}</DocsStrong>
            </DocsP>
            {task.subtasks.length > 0 && (
              <DocsUL>
                {task.subtasks.map((subtask, subIndex) => (
                  <DocsLI key={subIndex}>
                    {subtask.completed ? '✅' : '[ ]'} {subtask.name}
                  </DocsLI>
                ))}
              </DocsUL>
            )}
          </DocsLI>
        ))}
      </DocsUL>

      {files && (
        <>
          <DocsP><DocsStrong>Arquivos para criar/modificar</DocsStrong>:</DocsP>
          <DocsUL>
            {files.map((file, index) => (
              <DocsLI key={index}><DocsCode>{file}</DocsCode></DocsLI>
            ))}
          </DocsUL>
        </>
      )}
    </div>
  )
}

export default function TodoPage() {
  return (
    <>
      <DocsH1>Workemia - Lista de Tarefas Completa</DocsH1>
      
      <DocsH2>🎯 Visão Geral</DocsH2>
      <DocsP>
        Workemia é uma plataforma de marketplace de serviços que conecta clientes a prestadores. Esta lista organiza as tarefas necessárias para tornar a plataforma completamente funcional.
      </DocsP>

      <DocsHR />

      <DocsH2>🔴 <DocsStrong>CRÍTICO - Funcionalidades Essenciais</DocsStrong></DocsH2>

      <TaskSection
        title="1. Sistema de Solicitação de Serviços"
        status="pending"
        priority="P0"
        tasks={[
          {
            name: "Criar formulário de solicitação de serviço",
            completed: false,
            subtasks: [
              { name: "Seleção de categoria", completed: false },
              { name: "Descrição detalhada", completed: false },
              { name: "Localização e endereço", completed: false },
              { name: "Data/hora preferencial", completed: false },
              { name: "Budget estimado", completed: false },
              { name: "Upload de imagens/documentos", completed: false }
            ]
          },
          {
            name: "Sistema de propostas dos prestadores",
            completed: false,
            subtasks: [
              { name: "Recebimento de solicitações por localização", completed: false },
              { name: "Formulário de proposta com preço", completed: false },
              { name: "Tempo estimado de execução", completed: false },
              { name: "Disponibilidade de horários", completed: false }
            ]
          },
          {
            name: "Fluxo de aceitação/rejeição",
            completed: false,
            subtasks: [
              { name: "Cliente visualiza propostas recebidas", completed: false },
              { name: "Sistema de comparação de propostas", completed: false },
              { name: "Notificações em tempo real", completed: false },
              { name: "Aceitar/rejeitar propostas", completed: false }
            ]
          }
        ]}
        files={[
          "app/solicitar-servico/page.tsx",
          "app/propostas/page.tsx",
          "components/service-request-form.tsx",
          "components/proposal-card.tsx"
        ]}
      />

      <TaskSection
        title="2. Sistema de Pagamentos"
        status="pending"
        priority="P0"
        tasks={[
          {
            name: "Integração com gateway de pagamento",
            completed: false,
            subtasks: [
              { name: "Configurar Stripe/PagSeguro/Mercado Pago", completed: false },
              { name: "Processar pagamentos via PIX/Cartão", completed: false },
              { name: "Validação de transações", completed: false }
            ]
          },
          {
            name: "Sistema de escrow (pagamento seguro)",
            completed: false,
            subtasks: [
              { name: "Reter pagamento até conclusão do serviço", completed: false },
              { name: "Sistema de liberação por aprovação", completed: false },
              { name: "Proteção contra fraudes", completed: false }
            ]
          },
          {
            name: "Gestão financeira",
            completed: false,
            subtasks: [
              { name: "Histórico de transações", completed: false },
              { name: "Relatórios financeiros", completed: false },
              { name: "Sistema de reembolsos", completed: false },
              { name: "Taxa da plataforma", completed: false }
            ]
          }
        ]}
        files={[
          "app/pagamento/page.tsx",
          "lib/payments/stripe.ts",
          "components/payment-form.tsx",
          "app/api/payments/route.ts"
        ]}
      />

      <TaskSection
        title="3. Sistema de Autenticação ✅ CONCLUÍDO"
        status="completed"
        priority="P0"
        tasks={[
          {
            name: "Limpeza de código legacy",
            completed: true,
            subtasks: [
              { name: "Remover referências ao Firebase", completed: true },
              { name: "Consolidar apenas Supabase Auth", completed: true },
              { name: "Limpar imports e dependências não utilizadas", completed: true },
              { name: "Criado hook useAuth centralizado", completed: true }
            ]
          },
          {
            name: "Core de autenticação implementado",
            completed: true,
            subtasks: [
              { name: "Cadastro funcional (cliente/prestador)", completed: true },
              { name: "Login com Supabase Auth", completed: true },
              { name: "Menu de usuário no header completo", completed: true },
              { name: "Logout funcional em toda aplicação", completed: true },
              { name: "Sistema de tipos de usuário (client/provider)", completed: true }
            ]
          },
          {
            name: "Interface de autenticação",
            completed: true,
            subtasks: [
              { name: "Header com dropdown de usuário", completed: true },
              { name: "Avatar dinâmico com iniciais", completed: true },
              { name: "Toggle de tema integrado", completed: true },
              { name: "Menu responsivo (desktop + mobile)", completed: true },
              { name: "Redirecionamento baseado no tipo de usuário", completed: true }
            ]
          }
        ]}
        files={[
          "hooks/use-auth.ts (criado)",
          "components/theme-toggle.tsx (criado)",
          "components/header.tsx (refatorado)",
          "app/cadastro/page.tsx (corrigido)",
          "app/layout.tsx (corrigido hidratação)"
        ]}
      />

      <DocsHR />

      <DocsH2>🟡 <DocsStrong>ALTA PRIORIDADE - Funcionalidades Principais</DocsStrong></DocsH2>

      <TaskSection
        title="4. Sistema de Avaliações e Reviews"
        status="pending"
        priority="P1"
        tasks={[
          {
            name: "Interface de avaliação",
            completed: false,
            subtasks: [
              { name: "Sistema de estrelas (1-5)", completed: false },
              { name: "Comentários detalhados", completed: false },
              { name: "Upload de fotos do resultado", completed: false },
              { name: "Avaliação mútua (cliente ↔ prestador)", completed: false }
            ]
          },
          {
            name: "Gestão de reviews",
            completed: false,
            subtasks: [
              { name: "Histórico de avaliações", completed: false },
              { name: "Cálculo de rating médio", completed: false },
              { name: "Sistema anti-spam", completed: false },
              { name: "Relatório de reviews inadequados", completed: false }
            ]
          }
        ]}
        files={[
          "components/rating-system.tsx (expandir)",
          "app/avaliacoes/page.tsx",
          "components/review-form.tsx"
        ]}
      />

      <TaskSection
        title="6. Sistema de Mensagens Real-time"
        status="partial"
        priority="P1"
        tasks={[
          {
            name: "Interface base implementada",
            completed: true,
            subtasks: [
              { name: "Interface de chat criada e integrada no header", completed: true },
              { name: "Componente NotificationCenter funcional", completed: true },
              { name: "Links de redirecionamento para /chat", completed: true }
            ]
          },
          {
            name: "Backend de mensagens",
            completed: false,
            subtasks: [
              { name: "Armazenamento no Supabase", completed: false },
              { name: "WebSocket/Real-time subscriptions", completed: false },
              { name: "Notificações push", completed: false }
            ]
          }
        ]}
        files={[
          "app/chat/page.tsx (conectar ao backend)",
          "app/api/messages/route.ts (criar)",
          "lib/realtime.ts (criar)"
        ]}
      />

      <DocsHR />

      <DocsH2>📊 <DocsStrong>RESUMO DE PRIORIDADES</DocsStrong></DocsH2>

      <DocsH3>Sprint 1 (2-3 semanas) - MVP Funcional</DocsH3>
      <DocsOL>
        <DocsLI>Sistema de solicitação de serviços</DocsLI>
        <DocsLI>Sistema de propostas</DocsLI>
        <DocsLI>✅ <del>Correções de autenticação</del> <DocsStrong>CONCLUÍDO</DocsStrong></DocsLI>
      </DocsOL>

      <DocsH3>Sprint 2 (2-3 semanas) - Plataforma Operacional</DocsH3>
      <DocsOL>
        <DocsLI>Sistema de pagamentos</DocsLI>
        <DocsLI>Reviews/avaliações</DocsLI>
        <DocsLI>Mensagens real-time</DocsLI>
      </DocsOL>

      <DocsH3>Sprint 3 (2-3 semanas) - Experiência Completa</DocsH3>
      <DocsOL>
        <DocsLI>Agendamento/calendário</DocsLI>
        <DocsLI>Upload de arquivos</DocsLI>
        <DocsLI>Performance optimization</DocsLI>
      </DocsOL>

      <DocsHR />

      <DocsH3>✅ <DocsStrong>PRINCIPAIS CONQUISTAS DESTA SESSÃO</DocsStrong>:</DocsH3>
      <DocsOL>
        <DocsLI><DocsStrong>Sistema de Autenticação Completo</DocsStrong> - 100% funcional</DocsLI>
        <DocsLI><DocsStrong>Correção de Bugs Críticos</DocsStrong> - Hidratação, cadastro, avatar</DocsLI>
        <DocsLI><DocsStrong>Arquitetura de Perfil Unificada</DocsStrong> - Eliminação de redundância</DocsLI>
        <DocsLI><DocsStrong>Interface Moderna</DocsStrong> - Header com menu completo + dark mode</DocsLI>
        <DocsLI><DocsStrong>Base Técnica Sólida</DocsStrong> - Hook <DocsCode>useAuth</DocsCode>, componentes organizados</DocsLI>
      </DocsOL>

      <DocsP>
        <DocsStrong>Última atualização</DocsStrong>: 2025-01-06<br />
        <DocsStrong>Status do projeto</DocsStrong>: 🟢 Base sólida estabelecida<br />
        <DocsStrong>Cobertura de funcionalidades</DocsStrong>: ~40% implementado
      </DocsP>

      <DocsP>
        Este roadmap deve ser revisado quinzenalmente conforme o progresso do desenvolvimento.
      </DocsP>
    </>
  )
}