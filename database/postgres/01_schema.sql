CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS clientes (
    cliente_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL DEFAULT '',
    rol             VARCHAR(20) NOT NULL DEFAULT 'cliente',
    telefono        VARCHAR(20),
    fecha_registro  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activo          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS direcciones (
    direccion_id    SERIAL PRIMARY KEY,
    cliente_id      UUID NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    calle           VARCHAR(200) NOT NULL,
    ciudad          VARCHAR(100) NOT NULL,
    estado          VARCHAR(100) NOT NULL,
    codigo_postal   VARCHAR(20) NOT NULL,
    es_principal    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS metodos_pago (
    metodo_id           SERIAL PRIMARY KEY,
    cliente_id          UUID NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    tipo                VARCHAR(20) NOT NULL CHECK (tipo IN ('credito','debito','qr')),
    ultimos_4_digitos   VARCHAR(4) NOT NULL DEFAULT '',
    numero_encriptado   BYTEA,
    fecha_expiracion    VARCHAR(7) NOT NULL DEFAULT '',
    es_principal        BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categorias (
    categoria_id    SERIAL PRIMARY KEY,
    nombre          VARCHAR(80) NOT NULL UNIQUE,
    descripcion     TEXT
);

CREATE TABLE IF NOT EXISTS departamentos (
    departamento_id     SERIAL PRIMARY KEY,
    nombre              VARCHAR(50) NOT NULL UNIQUE,
    costo_envio         NUMERIC(10,2) NOT NULL DEFAULT 0,
    tipo_envio_oferta   VARCHAR(20) NOT NULL DEFAULT 'paqueteria'
                        CHECK (tipo_envio_oferta IN ('domicilio','paqueteria')),
    envio_gratis_desde  NUMERIC(10,2) NOT NULL DEFAULT 99999
);

INSERT INTO departamentos (nombre, costo_envio, tipo_envio_oferta, envio_gratis_desde) VALUES
  ('La Paz',      15,  'domicilio',  500),
  ('Oruro',       20,  'domicilio',  500),
  ('Santa Cruz',  25,  'domicilio',  500),
  ('Cochabamba',  30,  'paqueteria', 500),
  ('Chuquisaca',  35,  'paqueteria', 500),
  ('Tarija',      35,  'paqueteria', 500),
  ('Potosí',      40,  'paqueteria', 500),
  ('Beni',        45,  'paqueteria', 500),
  ('Pando',       50,  'paqueteria', 500)
ON CONFLICT (nombre) DO NOTHING;

CREATE TABLE IF NOT EXISTS pedidos (
    pedido_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id      UUID NOT NULL REFERENCES clientes(cliente_id),
    direccion_id    INT NOT NULL REFERENCES direcciones(direccion_id),
    departamento    VARCHAR(50) NOT NULL DEFAULT 'La Paz',
    tipo_envio      VARCHAR(20) NOT NULL DEFAULT 'domicilio'
                    CHECK (tipo_envio IN ('domicilio','paqueteria')),
    estado          VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente','procesando','enviado','entregado','cancelado')),
    subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
    costo_envio     NUMERIC(10,2) NOT NULL DEFAULT 0,
    total           NUMERIC(10,2) NOT NULL DEFAULT 0,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS detalle_pedido (
    detalle_id      SERIAL PRIMARY KEY,
    pedido_id       UUID NOT NULL REFERENCES pedidos(pedido_id) ON DELETE CASCADE,
    producto_mongo_id VARCHAR(24) NOT NULL,
    nombre_producto VARCHAR(200) NOT NULL,
    cantidad        INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal        NUMERIC(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

CREATE TABLE IF NOT EXISTS facturas (
    factura_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id       UUID NOT NULL UNIQUE REFERENCES pedidos(pedido_id),
    cliente_id      UUID NOT NULL REFERENCES clientes(cliente_id),
    numero_factura  VARCHAR(30) NOT NULL UNIQUE,
    total           NUMERIC(10,2) NOT NULL,
    emitida_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estado          VARCHAR(20) NOT NULL DEFAULT 'emitida'
                    CHECK (estado IN ('emitida','pagada','anulada'))
);

CREATE TABLE IF NOT EXISTS pagos (
    pago_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factura_id      UUID NOT NULL REFERENCES facturas(factura_id),
    metodo_id       INT REFERENCES metodos_pago(metodo_id),
    monto           NUMERIC(10,2) NOT NULL CHECK (monto > 0),
    estado          VARCHAR(20) NOT NULL DEFAULT 'completado'
                    CHECK (estado IN ('pendiente','completado','fallido','reembolsado')),
    procesado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado ON pedidos(estado);
CREATE INDEX IF NOT EXISTS idx_detalle_pedido ON detalle_pedido(pedido_id);
CREATE INDEX IF NOT EXISTS idx_pagos_factura ON pagos(factura_id);
CREATE INDEX IF NOT EXISTS idx_facturas_pedido ON facturas(pedido_id);
