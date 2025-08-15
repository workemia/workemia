-- Insert categories
INSERT INTO categories (name, description, icon) VALUES
('limpeza', 'Serviços de limpeza residencial e comercial', 'cleaning'),
('reparos', 'Reparos gerais, elétrica, hidráulica', 'tools'),
('beleza', 'Serviços de beleza e estética', 'beauty'),
('educacao', 'Aulas particulares e cursos', 'education'),
('pintura', 'Pintura residencial e comercial', 'paint'),
('jardinagem', 'Cuidados com jardins e plantas', 'garden'),
('tecnologia', 'Suporte técnico e informática', 'computer'),
('transporte', 'Serviços de transporte e mudanças', 'truck');

-- Insert sample users (clients)
INSERT INTO users (email, password_hash, user_type, name, phone, location, cpf) VALUES
('joao.santos@email.com', '$2b$10$example_hash_1', 'client', 'João Santos', '(11) 99999-1111', 'Vila Madalena, São Paulo', '123.456.789-01'),
('ana.costa@email.com', '$2b$10$example_hash_2', 'client', 'Ana Costa', '(11) 99999-2222', 'Jardins, São Paulo', '123.456.789-02'),
('carlos.mendes@email.com', '$2b$10$example_hash_3', 'client', 'Carlos Mendes', '(11) 99999-3333', 'Pinheiros, São Paulo', '123.456.789-03'),
('lucia.fernandes@email.com', '$2b$10$example_hash_4', 'client', 'Lucia Fernandes', '(11) 99999-4444', 'Vila Olímpia, São Paulo', '123.456.789-04');

-- Insert sample users (providers)
INSERT INTO users (email, password_hash, user_type, name, phone, location, cpf, verified) VALUES
('maria.silva@email.com', '$2b$10$example_hash_5', 'provider', 'Maria Silva', '(11) 99999-5555', 'Vila Madalena, São Paulo', '987.654.321-01', true),
('pedro.oliveira@email.com', '$2b$10$example_hash_6', 'provider', 'Pedro Oliveira', '(11) 99999-6666', 'Centro, São Paulo', '987.654.321-02', false),
('carlos.pintor@email.com', '$2b$10$example_hash_7', 'provider', 'Carlos Mendes', '(11) 99999-7777', 'Moema, São Paulo', '987.654.321-03', true),
('ana.manicure@email.com', '$2b$10$example_hash_8', 'provider', 'Ana Costa', '(11) 99999-8888', 'Jardins, São Paulo', '987.654.321-04', true);

-- Insert provider details
INSERT INTO providers (id, bio, profession, experience, hourly_rate, rating, total_reviews, completed_jobs, specialties, availability, preferences) VALUES
(
    (SELECT id FROM users WHERE email = 'maria.silva@email.com'),
    'Profissional experiente em limpeza residencial com mais de 8 anos no mercado. Especializada em limpeza pesada e organização.',
    'Profissional de Limpeza',
    '8 anos',
    80.00,
    4.9,
    127,
    156,
    ARRAY['Limpeza Pesada', 'Organização', 'Limpeza Pós-Obra'],
    '{"monday": {"available": true, "start": "08:00", "end": "18:00"}, "tuesday": {"available": true, "start": "08:00", "end": "18:00"}, "wednesday": {"available": true, "start": "08:00", "end": "18:00"}, "thursday": {"available": true, "start": "08:00", "end": "18:00"}, "friday": {"available": true, "start": "08:00", "end": "18:00"}, "saturday": {"available": true, "start": "09:00", "end": "15:00"}, "sunday": {"available": false, "start": "", "end": ""}}',
    '{"emailNotifications": true, "smsNotifications": true, "pushNotifications": true, "marketingEmails": false, "autoAcceptFavorites": true}'
),
(
    (SELECT id FROM users WHERE email = 'pedro.oliveira@email.com'),
    'Professor de matemática e ciências com 10 anos de experiência. Aulas presenciais e online.',
    'Professor Particular',
    '10 anos',
    50.00,
    4.9,
    78,
    203,
    ARRAY['Matemática', 'Física', 'Química'],
    '{"monday": {"available": true, "start": "18:00", "end": "22:00"}, "tuesday": {"available": true, "start": "18:00", "end": "22:00"}, "wednesday": {"available": true, "start": "18:00", "end": "22:00"}, "thursday": {"available": true, "start": "18:00", "end": "22:00"}, "friday": {"available": true, "start": "18:00", "end": "22:00"}, "saturday": {"available": true, "start": "09:00", "end": "17:00"}, "sunday": {"available": true, "start": "09:00", "end": "17:00"}}',
    '{"emailNotifications": true, "smsNotifications": false, "pushNotifications": true, "marketingEmails": false, "autoAcceptFavorites": false}'
),
(
    (SELECT id FROM users WHERE email = 'carlos.pintor@email.com'),
    'Pintor profissional com especialização em acabamentos. Trabalho limpo e pontual.',
    'Pintor',
    '6 anos',
    150.00,
    5.0,
    45,
    67,
    ARRAY['Pintura Interna', 'Pintura Externa', 'Textura'],
    '{"monday": {"available": true, "start": "08:00", "end": "17:00"}, "tuesday": {"available": true, "start": "08:00", "end": "17:00"}, "wednesday": {"available": true, "start": "08:00", "end": "17:00"}, "thursday": {"available": true, "start": "08:00", "end": "17:00"}, "friday": {"available": true, "start": "08:00", "end": "17:00"}, "saturday": {"available": false, "start": "", "end": ""}, "sunday": {"available": false, "start": "", "end": ""}}',
    '{"emailNotifications": true, "smsNotifications": true, "pushNotifications": true, "marketingEmails": true, "autoAcceptFavorites": true}'
),
(
    (SELECT id FROM users WHERE email = 'ana.manicure@email.com'),
    'Manicure profissional com certificação. Atendimento domiciliar com todos os equipamentos necessários.',
    'Manicure',
    '5 anos',
    60.00,
    4.8,
    203,
    312,
    ARRAY['Manicure', 'Pedicure', 'Nail Art'],
    '{"monday": {"available": true, "start": "09:00", "end": "18:00"}, "tuesday": {"available": true, "start": "09:00", "end": "18:00"}, "wednesday": {"available": true, "start": "09:00", "end": "18:00"}, "thursday": {"available": true, "start": "09:00", "end": "18:00"}, "friday": {"available": true, "start": "09:00", "end": "18:00"}, "saturday": {"available": true, "start": "09:00", "end": "15:00"}, "sunday": {"available": false, "start": "", "end": ""}}',
    '{"emailNotifications": true, "smsNotifications": false, "pushNotifications": true, "marketingEmails": false, "autoAcceptFavorites": true}'
);

-- Insert sample services
INSERT INTO services (title, description, category_id, client_id, provider_id, status, urgency, budget_min, budget_max, location, preferred_date) VALUES
(
    'Limpeza Residencial Completa',
    'Preciso de limpeza completa em apartamento 3 quartos, incluindo banheiros, cozinha e área de serviço. Apartamento bem conservado.',
    (SELECT id FROM categories WHERE name = 'limpeza'),
    (SELECT id FROM users WHERE email = 'joao.santos@email.com'),
    (SELECT id FROM users WHERE email = 'maria.silva@email.com'),
    'in_progress',
    'normal',
    150.00,
    200.00,
    'Vila Madalena, São Paulo',
    '2024-01-20'
),
(
    'Aulas de Matemática',
    'Preciso de aulas particulares de matemática para ensino médio. Preferência para aulas online.',
    (SELECT id FROM categories WHERE name = 'educacao'),
    (SELECT id FROM users WHERE email = 'ana.costa@email.com'),
    (SELECT id FROM users WHERE email = 'pedro.oliveira@email.com'),
    'completed',
    'low',
    40.00,
    60.00,
    'Online',
    '2024-01-15'
);

-- Insert sample reviews
INSERT INTO reviews (service_id, client_id, provider_id, rating, comment, response) VALUES
(
    (SELECT id FROM services WHERE title = 'Aulas de Matemática'),
    (SELECT id FROM users WHERE email = 'ana.costa@email.com'),
    (SELECT id FROM users WHERE email = 'pedro.oliveira@email.com'),
    5,
    'Excelente professor! Muito didático e paciente. Minha filha melhorou muito as notas.',
    'Muito obrigado pelo feedback! Foi um prazer ajudar. Fico à disposição sempre que precisar!'
);

-- Insert sample notifications
INSERT INTO notifications (user_id, type, title, message, urgent) VALUES
(
    (SELECT id FROM users WHERE email = 'maria.silva@email.com'),
    'service_request',
    'Nova Solicitação de Serviço',
    'João Santos solicitou um serviço de limpeza',
    true
),
(
    (SELECT id FROM users WHERE email = 'maria.silva@email.com'),
    'message',
    'Nova Mensagem',
    'Ana Costa enviou uma mensagem',
    false
),
(
    (SELECT id FROM users WHERE email = 'pedro.oliveira@email.com'),
    'payment',
    'Pagamento Recebido',
    'Você recebeu R$ 150,00 pelo serviço de matemática',
    false
);

-- Insert sample calendar events
INSERT INTO calendar_events (provider_id, service_id, title, start_time, end_time, background_color, border_color) VALUES
(
    (SELECT id FROM users WHERE email = 'maria.silva@email.com'),
    (SELECT id FROM services WHERE title = 'Limpeza Residencial Completa'),
    'Limpeza - João Santos',
    '2024-01-20 09:00:00',
    '2024-01-20 13:00:00',
    '#3b82f6',
    '#2563eb'
),
(
    (SELECT id FROM users WHERE email = 'pedro.oliveira@email.com'),
    NULL,
    'Aula de Matemática - Ana Costa',
    '2024-01-21 19:00:00',
    '2024-01-21 20:00:00',
    '#10b981',
    '#059669'
);
