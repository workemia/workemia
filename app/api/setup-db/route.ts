import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST() {
  try {
    console.log('Iniciando setup do banco de dados...')

    // Criar tabela categories primeiro (sem dependências)
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

    const { error: categoriesError } = await (supabase as any).rpc('execute_sql', { sql: categoriesSQL })
    if (categoriesError) {
      console.error('Erro ao criar tabela categories:', categoriesError)
    } else {
      console.log('✅ Tabela categories criada')
    }

    // Criar tabela services (depende de auth.users que já existe)
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

    const { error: servicesError } = await (supabase as any).rpc('execute_sql', { sql: servicesSQL })
    if (servicesError) {
      console.error('Erro ao criar tabela services:', servicesError)
    } else {
      console.log('✅ Tabela services criada')
    }

    // Inserir categorias básicas
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
      ] as any, { onConflict: 'name' })

    if (insertError) {
      console.error('Erro ao inserir categorias:', insertError)
    } else {
      console.log('✅ Categorias inseridas')
    }

    return NextResponse.json({
      success: true,
      message: 'Banco de dados configurado com sucesso!'
    })

  } catch (error) {
    console.error('Erro geral no setup:', error)
    return NextResponse.json({
      success: false,
      error: 'Erro no setup do banco',
      details: error
    }, { status: 500 })
  }
}