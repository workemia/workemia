const https = require('https')

const supabaseUrl = 'https://yxlxreavyojyczqxekjj.supabase.co'
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bHhyZWF2eW9qeWN6cXhla2pqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTIzMjI4MiwiZXhwIjoyMDcwODA4MjgyfQ.lBhqRYqqBWCX3IAkT1hGEae89N1gFvvW9Zt-CqPC47E'

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql })
    
    const options = {
      hostname: 'yxlxreavyojyczqxekjj.supabase.co',
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
        'apikey': serviceKey
      }
    }

    const req = https.request(options, (res) => {
      let responseData = ''
      res.on('data', (chunk) => responseData += chunk)
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseData)
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${responseData}`))
        }
      })
    })

    req.on('error', reject)
    req.write(data)
    req.end()
  })
}

async function createTables() {
  console.log('🚀 Criando tabelas no Supabase...')

  // 1. Criar tabela categories
  try {
    console.log('📝 Criando tabela categories...')
    const categoriesSQL = `
      CREATE TABLE IF NOT EXISTS public.categories (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        name character varying NOT NULL UNIQUE,
        description text,
        icon character varying,
        active boolean DEFAULT true,
        created_at timestamp with time zone DEFAULT now(),
        CONSTRAINT categories_pkey PRIMARY KEY (id)
      );
    `
    await executeSQL(categoriesSQL)
    console.log('✅ Tabela categories criada')
  } catch (error) {
    console.log('ℹ️ Tabela categories já existe ou erro:', error.message)
  }

  // 2. Criar tabela services
  try {
    console.log('📝 Criando tabela services...')
    const servicesSQL = `
      CREATE TABLE IF NOT EXISTS public.services (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        title character varying NOT NULL,
        description text NOT NULL,
        category_id uuid,
        client_id uuid,
        provider_id uuid,
        status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
        urgency text DEFAULT 'normal' CHECK (urgency IN ('low', 'normal', 'high', 'urgent')),
        budget_min numeric,
        budget_max numeric,
        final_price numeric,
        location character varying,
        latitude numeric,
        longitude numeric,
        preferred_date date,
        start_date timestamp with time zone,
        end_date timestamp with time zone,
        estimated_duration integer,
        progress integer DEFAULT 0,
        notes text,
        created_at timestamp with time zone DEFAULT now(),
        updated_at timestamp with time zone DEFAULT now(),
        CONSTRAINT services_pkey PRIMARY KEY (id),
        CONSTRAINT services_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
        CONSTRAINT services_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.users(id)
      );
    `
    await executeSQL(servicesSQL)
    console.log('✅ Tabela services criada')
  } catch (error) {
    console.log('ℹ️ Tabela services já existe ou erro:', error.message)
  }

  // 3. Criar tabela notifications
  try {
    console.log('📝 Criando tabela notifications...')
    const notificationsSQL = `
      CREATE TABLE IF NOT EXISTS public.notifications (
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        user_id uuid,
        type text NOT NULL CHECK (type IN ('service_request', 'message', 'payment', 'review', 'system', 'reminder')),
        title character varying NOT NULL,
        message text NOT NULL,
        data jsonb DEFAULT '{}'::jsonb,
        read boolean DEFAULT false,
        urgent boolean DEFAULT false,
        action_url text,
        created_at timestamp with time zone DEFAULT now(),
        CONSTRAINT notifications_pkey PRIMARY KEY (id),
        CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
      );
    `
    await executeSQL(notificationsSQL)
    console.log('✅ Tabela notifications criada')
  } catch (error) {
    console.log('ℹ️ Tabela notifications já existe ou erro:', error.message)
  }

  console.log('🎉 Criação de tabelas concluída!')
}

createTables().catch(console.error)