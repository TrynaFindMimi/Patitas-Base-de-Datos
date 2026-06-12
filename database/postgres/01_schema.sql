CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE clientes (
    cliente_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre          VARCHAR(100) NOT NULL,
    apellido        VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    telefono        VARCHAR(20),
    fecha_registro  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activo          BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE direcciones (
    direccion_id    SERIAL PRIMARY KEY,
    cliente_id      UUID NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    calle           VARCHAR(200) NOT NULL,
    ciudad          VARCHAR(100) NOT NULL,
    estado          VARCHAR(100) NOT NULL,
    codigo_postal   VARCHAR(20) NOT NULL,
    es_principal    BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE metodos_pago (
    metodo_id           SERIAL PRIMARY KEY,
    cliente_id          UUID NOT NULL REFERENCES clientes(cliente_id) ON DELETE CASCADE,
    tipo                VARCHAR(20) NOT NULL CHECK (tipo IN ('credito','debito')),
    ultimos_4_digitos   VARCHAR(4) NOT NULL,
    numero_encriptado   BYTEA NOT NULL,
    fecha_expiracion    VARCHAR(7) NOT NULL,
    es_principal        BOOLEAN NOT NULL DEFAULT FALSE,
    creado_en           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE categorias (
    categoria_id    SERIAL PRIMARY KEY,
    nombre          VARCHAR(80) NOT NULL UNIQUE,
    descripcion     TEXT
);

CREATE TABLE pedidos (
    pedido_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cliente_id      UUID NOT NULL REFERENCES clientes(cliente_id),
    direccion_id    INT NOT NULL REFERENCES direcciones(direccion_id),
    estado          VARCHAR(20) NOT NULL DEFAULT 'pendiente'
                    CHECK (estado IN ('pendiente','procesando','enviado','entregado','cancelado')),
    subtotal        NUMERIC(10,2) NOT NULL DEFAULT 0,
    costo_envio     NUMERIC(10,2) NOT NULL DEFAULT 0,
    total           NUMERIC(10,2) NOT NULL DEFAULT 0,
    creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE detalle_pedido (
    detalle_id      SERIAL PRIMARY KEY,
    pedido_id       UUID NOT NULL REFERENCES pedidos(pedido_id) ON DELETE CASCADE,
    producto_mongo_id VARCHAR(24) NOT NULL,
    nombre_producto VARCHAR(200) NOT NULL,
    cantidad        INT NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(10,2) NOT NULL CHECK (precio_unitario >= 0),
    subtotal        NUMERIC(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);

CREATE TABLE facturas (
    factura_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pedido_id       UUID NOT NULL UNIQUE REFERENCES pedidos(pedido_id),
    cliente_id      UUID NOT NULL REFERENCES clientes(cliente_id),
    numero_factura  VARCHAR(20) NOT NULL UNIQUE,
    total           NUMERIC(10,2) NOT NULL,
    emitida_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estado          VARCHAR(20) NOT NULL DEFAULT 'emitida'
                    CHECK (estado IN ('emitida','pagada','anulada'))
);

CREATE TABLE pagos (
    pago_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factura_id      UUID NOT NULL REFERENCES facturas(factura_id),
    metodo_id       INT NOT NULL REFERENCES metodos_pago(metodo_id),
    monto           NUMERIC(10,2) NOT NULL CHECK (monto > 0),
    estado          VARCHAR(20) NOT NULL DEFAULT 'completado'
                    CHECK (estado IN ('completado','fallido','reembolsado')),
    procesado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_estado ON pedidos(estado);
CREATE INDEX idx_detalle_pedido ON detalle_pedido(pedido_id);
CREATE INDEX idx_pagos_factura ON pagos(factura_id);
CREATE INDEX idx_facturas_pedido ON facturas(pedido_id);