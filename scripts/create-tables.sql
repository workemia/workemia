-- Script para criar tabelas necessárias no Supabase
-- Execute este SQL no Dashboard do Supabase > SQL Editor

-- 1. Criar tabela categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL UNIQUE,
  description text,
  icon character varying,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- 2. Criar tabela services
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

-- 3. Criar tabela notifications
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

-- 4. Inserir categorias básicas
INSERT INTO public.categories (name, description) VALUES
  ('Limpeza', 'Serviços de limpeza residencial e comercial'),
  ('Eletricista', 'Instalações e reparos elétricos'),
  ('Encanador', 'Reparos hidráulicos e instalações'),
  ('Pintor', 'Pintura residencial e comercial'),
  ('Jardinagem', 'Cuidados com jardins e plantas'),
  ('Montagem de Móveis', 'Montagem e instalação de móveis'),
  ('Reforma', 'Reformas e construção civil'),
  ('Técnico em Informática', 'Suporte técnico em informática')
ON CONFLICT (name) DO NOTHING;

-- 5. Habilitar RLS (Row Level Security) para as tabelas
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas básicas de acesso
-- Categories: todos podem ler
CREATE POLICY "Categories are viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Services: usuários podem ver todos, mas só podem inserir/editar os próprios
CREATE POLICY "Services are viewable by everyone" ON public.services
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own services" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own services" ON public.services
  FOR UPDATE USING (auth.uid() = client_id);

-- Notifications: usuários só podem ver suas próprias
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);