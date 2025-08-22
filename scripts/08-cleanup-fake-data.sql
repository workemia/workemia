-- Script para limpar dados fake/bot do banco de dados
-- Este script remove todos os dados de teste e usuários fake

-- Corrigindo para usar colunas reais do schema (firebase_uid, email, display_name)
-- Primeiro, remover dados relacionados aos usuários fake
DELETE FROM calendar_events WHERE provider_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
);

DELETE FROM notifications WHERE user_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
);

DELETE FROM messages WHERE sender_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
) OR receiver_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
);

DELETE FROM payments WHERE service_id IN (
  SELECT id FROM services WHERE client_id IN (
    SELECT id FROM users WHERE 
      firebase_uid LIKE 'test_%' OR 
      firebase_uid LIKE 'fake_%' OR 
      firebase_uid LIKE 'bot_%' OR
      email LIKE '%@example.com' OR 
      email LIKE '%@test.com' OR
      display_name LIKE '%Bot%' OR
      display_name LIKE '%Test%' OR
      display_name LIKE '%Fake%'
  ) OR provider_id IN (
    SELECT id FROM users WHERE 
      firebase_uid LIKE 'test_%' OR 
      firebase_uid LIKE 'fake_%' OR 
      firebase_uid LIKE 'bot_%' OR
      email LIKE '%@example.com' OR 
      email LIKE '%@test.com' OR
      display_name LIKE '%Bot%' OR
      display_name LIKE '%Test%' OR
      display_name LIKE '%Fake%'
  )
);

DELETE FROM favorites WHERE client_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
) OR provider_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
);

DELETE FROM reviews WHERE client_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
) OR provider_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
);

DELETE FROM service_requests WHERE service_id IN (
  SELECT id FROM services WHERE client_id IN (
    SELECT id FROM users WHERE 
      firebase_uid LIKE 'test_%' OR 
      firebase_uid LIKE 'fake_%' OR 
      firebase_uid LIKE 'bot_%' OR
      email LIKE '%@example.com' OR 
      email LIKE '%@test.com' OR
      display_name LIKE '%Bot%' OR
      display_name LIKE '%Test%' OR
      display_name LIKE '%Fake%'
  )
) OR provider_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
);

DELETE FROM services WHERE client_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
) OR provider_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
);

DELETE FROM providers WHERE user_id IN (
  SELECT id FROM users WHERE 
    firebase_uid LIKE 'test_%' OR 
    firebase_uid LIKE 'fake_%' OR 
    firebase_uid LIKE 'bot_%' OR
    email LIKE '%@example.com' OR 
    email LIKE '%@test.com' OR
    display_name LIKE '%Bot%' OR
    display_name LIKE '%Test%' OR
    display_name LIKE '%Fake%'
);

-- Por último, remover os usuários fake
DELETE FROM users WHERE 
  firebase_uid LIKE 'test_%' OR 
  firebase_uid LIKE 'fake_%' OR 
  firebase_uid LIKE 'bot_%' OR
  email LIKE '%@example.com' OR 
  email LIKE '%@test.com' OR
  display_name LIKE '%Bot%' OR
  display_name LIKE '%Test%' OR
  display_name LIKE '%Fake%';

-- Limpar dados órfãos (caso existam)
DELETE FROM calendar_events WHERE provider_id NOT IN (SELECT id FROM users);
DELETE FROM notifications WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM messages WHERE sender_id NOT IN (SELECT id FROM users) OR receiver_id NOT IN (SELECT id FROM users);
DELETE FROM favorites WHERE client_id NOT IN (SELECT id FROM users) OR provider_id NOT IN (SELECT id FROM users);
DELETE FROM reviews WHERE client_id NOT IN (SELECT id FROM users) OR provider_id NOT IN (SELECT id FROM users);
DELETE FROM providers WHERE user_id NOT IN (SELECT id FROM users);
DELETE FROM services WHERE client_id NOT IN (SELECT id FROM users);

-- Verificar limpeza
SELECT 'Usuários restantes:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Serviços restantes:', COUNT(*) FROM services
UNION ALL
SELECT 'Avaliações restantes:', COUNT(*) FROM reviews
UNION ALL
SELECT 'Prestadores restantes:', COUNT(*) FROM providers;
