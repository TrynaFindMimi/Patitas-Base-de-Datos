CREATE OR REPLACE VIEW v_pedidos_detalle AS
SELECT
    p.pedido_id,
    p.creado_en,
    p.estado,
    p.total,
    c.cliente_id,
    c.nombre || ' ' || c.apellido AS cliente_nombre,
    c.email,
    d.calle || ', ' || d.ciudad || ', ' || d.estado AS direccion_envio,
    COUNT(dp.detalle_id) AS total_items
FROM pedidos p
JOIN clientes c ON c.cliente_id = p.cliente_id
JOIN direcciones d ON d.direccion_id = p.direccion_id
JOIN detalle_pedido dp ON dp.pedido_id = p.pedido_id
GROUP BY p.pedido_id, c.cliente_id, d.direccion_id;

CREATE OR REPLACE VIEW v_resumen_ventas AS
SELECT
    DATE_TRUNC('month', p.creado_en) AS mes,
    COUNT(DISTINCT p.pedido_id)      AS total_pedidos,
    COUNT(DISTINCT p.cliente_id)     AS clientes_unicos,
    SUM(p.total)                     AS ingresos_totales,
    AVG(p.total)                     AS ticket_promedio
FROM pedidos p
WHERE p.estado != 'cancelado'
GROUP BY DATE_TRUNC('month', p.creado_en)
ORDER BY mes DESC;

CREATE OR REPLACE VIEW v_clientes_activos AS
SELECT
    c.cliente_id,
    c.nombre || ' ' || c.apellido AS nombre_completo,
    c.email,
    COUNT(p.pedido_id)            AS total_pedidos,
    COALESCE(SUM(p.total), 0)     AS total_gastado,
    MAX(p.creado_en)              AS ultimo_pedido
FROM clientes c
LEFT JOIN pedidos p ON p.cliente_id = c.cliente_id AND p.estado != 'cancelado'
WHERE c.activo = TRUE
GROUP BY c.cliente_id
ORDER BY total_gastado DESC;

CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
SELECT
    dp.producto_mongo_id,
    dp.nombre_producto,
    SUM(dp.cantidad)              AS unidades_vendidas,
    SUM(dp.subtotal)              AS ingresos_generados,
    COUNT(DISTINCT p.pedido_id)   AS aparece_en_pedidos
FROM detalle_pedido dp
JOIN pedidos p ON p.pedido_id = dp.pedido_id
WHERE p.estado != 'cancelado'
GROUP BY dp.producto_mongo_id, dp.nombre_producto
ORDER BY unidades_vendidas DESC;