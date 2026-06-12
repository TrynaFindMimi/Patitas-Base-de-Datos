DO $$ BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'patitas_admin') THEN
        CREATE ROLE patitas_admin;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'patitas_cajero') THEN
        CREATE ROLE patitas_cajero;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'patitas_cliente') THEN
        CREATE ROLE patitas_cliente;
    END IF;
END $$;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO patitas_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO patitas_admin;

GRANT SELECT, INSERT, UPDATE ON pedidos, detalle_pedido, facturas, pagos TO patitas_cajero;
GRANT SELECT ON clientes, direcciones, metodos_pago TO patitas_cajero;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO patitas_cajero;

GRANT SELECT ON clientes, direcciones, pedidos, detalle_pedido, facturas TO patitas_cliente;
GRANT INSERT, UPDATE ON direcciones, metodos_pago TO patitas_cliente;
GRANT INSERT ON pedidos, detalle_pedido TO patitas_cliente;