INSERT INTO clientes (cliente_id, nombre, apellido, email, password_hash, rol, activo)
VALUES (
  uuid_generate_v4(),
  'Dueño',
  'Patitas',
  'owner@patitas.bo',
  '$2a$12$UaMnAwfNgTtUncum82Gs8OIeNThU2PMYrGz3YudBKXBprhjmyd/zO',
  'owner',
  TRUE
)
ON CONFLICT (email) DO NOTHING;
