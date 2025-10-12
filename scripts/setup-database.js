const { createClient } = require('@supabase/supabase-js')

// Configuração do Supabase
const supabaseUrl = 'https://yxlxreavyojyczqxekjj.supabase.co/'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bHhyZWF2eW9qeWN6cXhla2pqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTIzMjI4MiwiZXhwIjoyMDcwODA4MjgyfQ.lBhqRYqqBWCX3IAkT1hGEae89N1gFvvW9Zt-CqPC47E'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🚀 Iniciando setup do banco de dados...')
  
  try {
    // 1. Criar tabela categories
    console.log('📝 Criando tabela categories...')
    const { error: categoriesError } = await supabase.rpc('sql', {
      query: `
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
    })

    if (categoriesError) {
      console.error('❌ Erro ao criar categories:', categoriesError)
    } else {
      console.log('✅ Tabela categories criada')
    }

    // 2. Criar tabela services
    console.log('📝 Criando tabela services...')
    const { error: servicesError } = await supabase.rpc('sql', {
      query: `
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
    })

    if (servicesError) {
      console.error('❌ Erro ao criar services:', servicesError)
    } else {
      console.log('✅ Tabela services criada')
    }

    // 3. Inserir categorias
    console.log('📝 Inserindo categorias...')
    const { error: insertError } = await supabase
      .from('categories')
      .upsert([
        { name: 'Limpeza', description: 'Serviços de limpeza residencial e comercial' },
        { name: 'Eletricista', description: 'Instalações e reparos elétricos' },
        { name: 'Encanador', description: 'Reparos hidráulicos e instalações' },
        { name: 'Pintor', description: 'Pintura residencial e comercial' },
        { name: 'Jardinagem', description: 'Cuidados com jardins e plantas' },
        { name: 'Montagem de Móveis', description: 'Montagem e instalação de móveis' },
        { name: 'Reforma', description: 'Reformas e construção civil' },
        { name: 'Técnico em Informática', description: 'Suporte técnico em informática' }
      ], { onConflict: 'name' })

    if (insertError) {
      console.error('❌ Erro ao inserir categorias:', insertError)
    } else {
      console.log('✅ Categorias inseridas')
    }

    console.log('🎉 Setup do banco concluído com sucesso!')

  } catch (error) {
    console.error('💥 Erro geral:', error)
  }
}

setupDatabase()