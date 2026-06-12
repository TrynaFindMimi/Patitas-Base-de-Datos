import { query, getClient } from '../config/postgres.js';
import { Carrito } from '../../../database/mongodb/schema.js';

export const crearPedido = async (req, res) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const { direccion_id, items } = req.body;

    const { rows } = await client.query(
      'SELECT fn_registrar_pedido($1, $2, $3) AS pedido_id',
      [req.usuario.cliente_id, direccion_id, JSON.stringify(items)]
    );
    const pedido_id = rows[0].pedido_id;

    await Carrito.findOneAndUpdate(
      { cliente_uuid: req.usuario.cliente_id },
      { items: [], actualizado_en: new Date() }
    );

    await client.query('COMMIT');
    res.status(201).json({ pedido_id });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const procesarPago = async (req, res) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    const { pedido_id, metodo_id } = req.body;

    const { rows } = await client.query(
      'SELECT fn_procesar_pago($1, $2) AS factura_id',
      [pedido_id, metodo_id]
    );

    await client.query('COMMIT');
    res.json({ factura_id: rows[0].factura_id, estado: 'pagado' });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

export const obtenerPedidos = async (req, res) => {
  const { rows } = await query(
    `SELECT pedido_id, estado, total, creado_en FROM pedidos
     WHERE cliente_id = $1 ORDER BY creado_en DESC`,
    [req.usuario.cliente_id]
  );
  res.json(rows);
};

export const obtenerPedido = async (req, res) => {
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
};