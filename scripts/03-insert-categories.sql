-- Insert default categories for the platform
INSERT INTO categories (id, name, description, icon, active) VALUES
  (gen_random_uuid(), 'Limpeza', 'Serviços de limpeza residencial e comercial', '🧹', true),
  (gen_random_uuid(), 'Pintura', 'Pintura interna e externa', '🎨', true),
  (gen_random_uuid(), 'Elétrica', 'Instalações e reparos elétricos', '⚡', true),
  (gen_random_uuid(), 'Encanamento', 'Serviços hidráulicos e encanamento', '🔧', true),
  (gen_random_uuid(), 'Jardinagem', 'Cuidados com jardim e paisagismo', '🌱', true),
  (gen_random_uuid(), 'Marcenaria', 'Móveis sob medida e reparos', '🪚', true),
  (gen_random_uuid(), 'Informática', 'Suporte técnico e reparos', '💻', true),
  (gen_random_uuid(), 'Beleza', 'Serviços de beleza e estética', '💄', true),
  (gen_random_uuid(), 'Educação', 'Aulas particulares e cursos', '📚', true),
  (gen_random_uuid(), 'Transporte', 'Mudanças e fretes', '🚚', true)
ON CONFLICT (id) DO NOTHING;
