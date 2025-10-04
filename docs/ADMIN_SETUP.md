# 🔐 Configuração de Administradores - ServiceHub

## 📋 **Resumo**

Este documento explica como configurar e gerenciar os usuários administradores do ServiceHub.

---

## 👥 **Administradores Autorizados**

### **Emails com Acesso Admin:**
- `admin@servicehub.com` - **Conta administrativa principal**
- `vitor.paula.lucas@gmail.com` - **Product Owner / Developer**  
- `zeneiltongranja@gmail.com` - **CTO / Tech Lead**

---

## 🚀 **Configuração da Conta Admin Principal**

### **1. Criar Usuário no Supabase Dashboard**

1. **Acesse o Supabase Dashboard**: https://supabase.com/dashboard
2. **Selecione seu projeto** ServiceHub
3. **Navegue para**: `Authentication` → `Users`
4. **Clique em**: `Add user` (ou `Invite user`)

### **2. Dados do Usuário Admin**

```
📧 Email: admin@servicehub.com
🔐 Password: Admin@ServiceHub2025! (ou senha mais segura)
✅ Auto Confirm User: Marcado
👤 User Type: admin
```

### **3. Configurar User Metadata**

Após criar o usuário, **edite** e adicione na seção **User Metadata**:

```json
{
  "full_name": "Administrador ServiceHub",
  "user_type": "admin",
  "display_name": "Admin ServiceHub"
}
```

---

## 🔧 **Configuração Técnica**

### **Arquivo de Configuração**
Os emails admin são gerenciados em:
```
lib/admin-config.ts
```

### **Como Funciona**
1. **Hook `useAuth`** verifica se o email está na lista de admins
2. **Função `isAdminEmail()`** centraliza a verificação
3. **Permissões** controladas via configuração centralizada

### **Permissões Atuais**
- ✅ **docs**: Acesso à documentação `/docs`
- ✅ **analytics**: Relatórios (futuro)
- ✅ **userManagement**: Gestão de usuários (futuro)
- ✅ **systemConfig**: Configurações (futuro)

---

## 🛡️ **Segurança**

### **Proteção de Rotas**
- **Layout `/docs`** verifica `isAdmin` antes de renderizar
- **Redirecionamento automático** para não-admins
- **Loading states** durante verificação de permissões

### **Interface Visual**
- **Badge "Admin"** no header para identificação
- **Área Administrativa** marcada nas páginas docs
- **Link docs** só aparece para administradores

---

## 🧪 **Testando o Acesso Admin**

### **1. Login como Admin**
```
URL: http://localhost:3000/login
Email: admin@servicehub.com
Senha: [senha definida no Supabase]
```

### **2. Verificar Permissões**
- ✅ Link "📚 Docs Admin" aparece no header
- ✅ Acesso a `/docs`, `/docs/todo`, `/docs/summary`
- ✅ Badge "Área Administrativa" visível
- ✅ Email admin exibido na interface

### **3. Testar Segurança**
- ❌ Usuários comuns não veem o link docs
- ❌ Acesso direto a `/docs` redireciona não-admins
- ❌ Não-logados são redirecionados para login

---

## 🔄 **Adicionar Novos Admins**

### **Opção 1: Via Código**
Edite `lib/admin-config.ts`:
```typescript
emails: [
  'admin@servicehub.com',
  'vitor.paula.lucas@gmail.com',
  'zeneiltongranja@gmail.com',
  'novo.admin@exemplo.com'  // ← Adicionar aqui
]
```

### **Opção 2: Via Variáveis de Ambiente (Futuro)**
```env
ADMIN_EMAILS=admin@servicehub.com,vitor.paula.lucas@gmail.com,zeneiltongranja@gmail.com
```

---

## 📝 **Comandos Úteis**

### **SQL para Verificar Admins**
```sql
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at,
  email_confirmed_at
FROM auth.users 
WHERE email IN (
  'admin@servicehub.com',
  'vitor.paula.lucas@gmail.com', 
  'zeneiltongranja@gmail.com'
);
```

### **SQL para Atualizar Metadata**
```sql
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'), 
  '{user_type}', 
  '"admin"'
)
WHERE email = 'admin@servicehub.com';
```

---

## ⚠️ **Importante**

- **Senhas seguras**: Use senhas fortes para contas admin
- **2FA recomendado**: Configure autenticação de 2 fatores quando disponível
- **Audit trail**: Monitore acessos à área administrativa
- **Backup**: Mantenha backup das configurações de admin

---

## 🆘 **Troubleshooting**

### **Problema**: Link docs não aparece
- ✅ Verificar se email está em `admin-config.ts`
- ✅ Conferir user metadata no Supabase
- ✅ Limpar cache do navegador

### **Problema**: Acesso negado mesmo sendo admin
- ✅ Verificar se `isAdmin` retorna `true` no console
- ✅ Conferir se hook `useAuth` está funcionando
- ✅ Verificar se não há erro de maiúsculas/minúsculas no email

### **Problema**: Usuário não consegue fazer login
- ✅ Verificar se email está confirmado no Supabase
- ✅ Conferir se senha está correta
- ✅ Verificar se usuário não está bloqueado

---

✅ **Sistema admin configurado e funcionando!**