import { query, getClient } from '../config/postgres.js';
import { Carrito } from '../config/schema.js';

export const listarDepartamentos = async (_req, res, next) => {
  try {
    const { rows } = await query(
      'SELECT departamento_id, nombre, costo_envio, tipo_envio_oferta, envio_gratis_desde FROM departamentos ORDER BY departamento_id'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const crearPedido = async (req, res, next) => {
  let client;
  try {
    client = await getClient();
    await client.query('BEGIN');
    const { items, departamento, tipo_envio, calle, ciudad, estado, codigo_postal } = req.body;

    const dept = departamento || 'La Paz';
    const envio = tipo_envio || 'domicilio';

    let direccion_id = req.body.direccion_id;

    if (!direccion_id) {
      const { rows } = await client.query(
        `INSERT INTO direcciones (cliente_id, calle, ciudad, estado, codigo_postal, es_principal)
         VALUES ($1, $2, $3, $4, $5, true) RETURNING direccion_id`,
        [req.usuario.cliente_id, calle || 'Sin direccion', ciudad || dept, estado || dept, codigo_postal || '0000']
      );
      direccion_id = rows[0].direccion_id;
    }

    const { rows: deptRow } = await client.query(
      'SELECT costo_envio, envio_gratis_desde FROM departamentos WHERE nombre = $1',
      [dept]
    );
    if (!deptRow.length) {
      throw new Error(`Departamento "${dept}" no encontrado en la base de datos`);
    }
    const costoEnvio = parseFloat(deptRow[0].costo_envio) || 0;
    const gratisDesde = parseFloat(deptRow[0].envio_gratis_desde) || 0;

    const { rows: [{ pedido_id }] } = await client.query(
      `INSERT INTO pedidos (cliente_id, direccion_id, departamento, tipo_envio)
       VALUES ($1, $2, $3, $4) RETURNING pedido_id`,
      [req.usuario.cliente_id, direccion_id, dept, envio]
    );

    let subtotal = 0;
    for (const item of items) {
      const pId = item.producto_mongo_id || 'PROD-000';
      const pNombre = item.nombre_producto || 'Producto';
      const pCant = Math.max(1, parseInt(item.cantidad, 10) || 1);
      const pPrecio = parseFloat(item.precio_unitario) || 0;

      await client.query(
        `INSERT INTO detalle_pedido (pedido_id, producto_mongo_id, nombre_producto, cantidad, precio_unitario)
         VALUES ($1, $2, $3, $4, $5)`,
        [pedido_id, pId, pNombre, pCant, pPrecio]
      );
      subtotal += pCant * pPrecio;
    }

    const costoEnvioFinal = subtotal >= gratisDesde ? 0 : costoEnvio;
    const total = subtotal + costoEnvioFinal;

    await client.query(
      `UPDATE pedidos SET subtotal = $1, costo_envio = $2, total = $3 WHERE pedido_id = $4`,
      [subtotal, costoEnvioFinal, total, pedido_id]
    );

    try {
      await Carrito.findOneAndUpdate(
        { cliente_uuid: req.usuario.cliente_id },
        { items: [], actualizado_en: new Date() }
      );
    } catch {
      console.warn('No se pudo limpiar el carrito en MongoDB');
    }

    await client.query('COMMIT');
    res.status(201).json({ pedido_id, subtotal, costo_envio: costoEnvioFinal, total, departamento: dept, tipo_envio: envio });
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch {}
    }
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const procesarPago = async (req, res, next) => {
  let client;
  try {
    client = await getClient();
    await client.query('BEGIN');
    const { pedido_id, metodo_id } = req.body;

    const { rows } = await client.query(
      'SELECT fn_procesar_pago($1, $2) AS factura_id',
      [pedido_id, metodo_id || null]
    );

    const { rows: factura } = await client.query(
      'SELECT f.factura_id, f.estado, f.total FROM facturas f WHERE f.factura_id = $1',
      [rows[0].factura_id]
    );

    await client.query('COMMIT');
    res.json(factura[0]);
  } catch (err) {
    if (client) {
      try { await client.query('ROLLBACK'); } catch {}
    }
    next(err);
  } finally {
    if (client) client.release();
  }
};

export const obtenerPedidos = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT pedido_id, estado, total, costo_envio, subtotal, departamento, tipo_envio, creado_en
       FROM pedidos WHERE cliente_id = $1 ORDER BY creado_en DESC`,
      [req.usuario.cliente_id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

export const obtenerPedido = async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.*, json_agg(dp.*) AS items
       FROM pedidos p
       JOIN detalle_pedido dp ON dp.pedido_id = p.pedido_id
       WHERE p.pedido_id = $1 AND p.cliente_id = $2
       GROUP BY p.pedido_id`,
      [req.params.id, req.usuario.cliente_id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};
