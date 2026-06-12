CREATE OR REPLACE FUNCTION fn_registrar_pedido(
    p_cliente_id    UUID,
    p_direccion_id  INT,
    p_items         JSONB
) RETURNS UUID AS $$
DECLARE
    v_pedido_id     UUID;
    v_item          JSONB;
    v_subtotal      NUMERIC(10,2) := 0;
    v_envio         NUMERIC(10,2) := 0;
BEGIN
    INSERT INTO pedidos (cliente_id, direccion_id)
    VALUES (p_cliente_id, p_direccion_id)
    RETURNING pedido_id INTO v_pedido_id;

    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
        INSERT INTO detalle_pedido (pedido_id, producto_mongo_id, nombre_producto, cantidad, precio_unitario)
        VALUES (
            v_pedido_id,
            v_item->>'producto_mongo_id',
            v_item->>'nombre_producto',
            (v_item->>'cantidad')::INT,
            (v_item->>'precio_unitario')::NUMERIC
        );
        v_subtotal := v_subtotal + ((v_item->>'cantidad')::INT * (v_item->>'precio_unitario')::NUMERIC);
    END LOOP;

    v_envio := CASE WHEN v_subtotal >= 999 THEN 0 ELSE 99 END;

    UPDATE pedidos
    SET subtotal = v_subtotal,
        costo_envio = v_envio,
        total = v_subtotal + v_envio
    WHERE pedido_id = v_pedido_id;

    RETURN v_pedido_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_procesar_pago(
    p_pedido_id     UUID,
    p_metodo_id     INT
) RETURNS UUID AS $$
DECLARE
    v_factura_id    UUID;
    v_total         NUMERIC(10,2);
    v_num_factura   VARCHAR(20);
BEGIN
    SELECT total INTO v_total FROM pedidos WHERE pedido_id = p_pedido_id;

    IF v_total IS NULL THEN
        RAISE EXCEPTION 'Pedido % no encontrado', p_pedido_id;
    END IF;

    v_num_factura := 'FAC-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(p_pedido_id::TEXT, 1, 8);

    INSERT INTO facturas (pedido_id, cliente_id, numero_factura, total)
    SELECT p_pedido_id, cliente_id, v_num_factura, v_total
    FROM pedidos WHERE pedido_id = p_pedido_id
    RETURNING factura_id INTO v_factura_id;

    INSERT INTO pagos (factura_id, metodo_id, monto)
    VALUES (v_factura_id, p_metodo_id, v_total);

    UPDATE pedidos SET estado = 'procesando', actualizado_en = NOW()
    WHERE pedido_id = p_pedido_id;

    UPDATE facturas SET estado = 'pagada' WHERE factura_id = v_factura_id;

    RETURN v_factura_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION fn_cifrar_tarjeta(p_numero VARCHAR)
RETURNS BYTEA AS $$
BEGIN
    RETURN pgp_sym_encrypt(p_numero, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION fn_descifrar_tarjeta(p_encriptado BYTEA)
RETURNS VARCHAR AS $$
BEGIN
    RETURN pgp_sym_decrypt(p_encriptado, current_setting('app.encryption_key'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


CREATE OR REPLACE VIEW v_clientes_frecuentes AS
SELECT cliente_id, nombre, apellido, email
FROM clientes
WHERE cliente_id IN (
    SELECT cliente_id
    FROM pedidos
    WHERE estado != 'cancelado'
    GROUP BY cliente_id
    HAVING COUNT(pedido_id) > 2
       AND SUM(total) > (
           SELECT AVG(total_cliente)
           FROM (
               SELECT SUM(total) AS total_cliente
               FROM pedidos
               WHERE estado != 'cancelado'
               GROUP BY cliente_id
           ) sub
       )
);