// Configuração dos usuários administradores
// Este arquivo centraliza a configuração de admins para facilitar manutenção

export const ADMIN_CONFIG = {
  // Lista de emails com acesso administrativo
  emails: [
    'admin@servicehub.com',           // Conta administrativa principal
    'vitor.paula.lucas@gmail.com',    // Product Owner / Developer
    'zeneiltongranja@gmail.com'       // CTO / Tech Lead
  ],
  
  // Configurações de permissões
  permissions: {
    docs: true,           // Acesso à documentação
    analytics: true,      // Acesso a relatórios (futuro)
    userManagement: true, // Gestão de usuários (futuro)
    systemConfig: true    // Configurações do sistema (futuro)
  }
} as const

/**
 * Verifica se um email tem privilégios de administrador
 * @param email Email do usuário
 * @returns true se for admin, false caso contrário
 */
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false
  return ADMIN_CONFIG.emails.includes(email.toLowerCase())
}

/**
 * Verifica se um admin tem uma permissão específica
 * @param permission Nome da permissão
 * @returns true se a permissão estiver habilitada
 */
export function hasAdminPermission(permission: keyof typeof ADMIN_CONFIG.permissions): boolean {
  return ADMIN_CONFIG.permissions[permission]
}

// Tipo para as permissões de admin
export type AdminPermission = keyof typeof ADMIN_CONFIG.permissions