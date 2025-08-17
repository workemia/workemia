-- Insert sample categories if they don't exist
INSERT INTO categories (id, name, description, icon, active) VALUES
  (gen_random_uuid(), 'Limpeza', 'Serviços de limpeza residencial e comercial', '🧹', true),
  (gen_random_uuid(), 'Pintura', 'Pintura interna e externa', '🎨', true),
  (gen_random_uuid(), 'Elétrica', 'Instalações e reparos elétricos', '⚡', true),
  (gen_random_uuid(), 'Encanamento', 'Serviços hidráulicos e encanamento', '🔧', true),
  (gen_random_uuid(), 'Jardinagem', 'Cuidados com jardins e plantas', '🌱', true),
  (gen_random_uuid(), 'Marcenaria', 'Móveis e trabalhos em madeira', '🪚', true),
  (gen_random_uuid(), 'Informática', 'Suporte técnico e reparos', '💻', true),
  (gen_random_uuid(), 'Aulas Particulares', 'Ensino e tutoria', '📚', true)
ON CONFLICT (name) DO NOTHING;
