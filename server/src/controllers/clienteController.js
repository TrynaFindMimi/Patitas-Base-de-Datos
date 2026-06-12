import { query, getClient } from '../config/postgres.js';
import { Carrito, Preferencias } from '../../../database/mongodb/schema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const registrar = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const cliente_id = uuidv4();

  const { rows } = await query(
    `INSERT INTO clientes (cliente_id, nombre, apellido, email, password_hash)
     VALUES ($1, $2, $3, $4, $5) RETURNING cliente_id, nombre, email`,
    [cliente_id, nombre, apellido, email, hash]
  );

  await Promise.all([
    Carrito.create({ cliente_uuid: cliente_id, items: [] }),
    Preferencias.create({ cliente_uuid: cliente_id }),
  ]);

  const token = jwt.sign({ cliente_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ cliente: rows[0], token });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query(
    'SELECT cliente_id, nombre, email, password_hash FROM clientes WHERE email = $1 AND activo = TRUE',
    [email]
  );
  if (!rows.length) return res.status(401).json({ error: 'Credenciales inválidas' });

  const valido = await bcrypt.compare(password, rows[0].password_hash);
  if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ cliente_id: rows[0].cliente_id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  const { password_hash, ...cliente } = rows[0];
  res.json({ cliente, token });
};

export const obtenerPerfil = async (req, res) => {
  const { rows } = await query(
    `SELECT c.cliente_id, c.nombre, c.apellido, c.email, c.fecha_registro,
            COUNT(p.pedido_id) AS total_pedidos,
            COALESCE(SUM(p.total), 0) AS total_gastado
     FROM clientes c
     LEFT JOIN pedidos p ON p.cliente_id = c.cliente_id AND p.estado != 'cancelado'
     WHERE c.cliente_id = $1
     GROUP BY c.cliente_id`,
    [req.usuario.cliente_id]
  );
  const preferencias = await Preferencias.findOne({ cliente_uuid: req.usuario.cliente_id });
  res.json({ ...rows[0], preferencias });
};

export const agregarDireccion = async (req, res) => {
  const { calle, ciudad, estado, codigo_postal, es_principal } = req.body;
  const { rows } = await query(
    `INSERT INTO direcciones (cliente_id, calle, ciudad, estado, codigo_postal, es_principal)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [req.usuario.cliente_id, calle, ciudad, estado, codigo_postal, es_principal ?? false]
  );
  res.status(201).json(rows[0]);
};

export const agregarMetodoPago = async (req, res) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    await client.query(`SET app.encryption_key = '${process.env.JWT_SECRET}'`);
    const { tipo, numero_tarjeta, fecha_expiracion } = req.body;
    const ultimos_4 = numero_tarjeta.slice(-4);
    const { rows } = await client.query(
      `INSERT INTO metodos_pago (cliente_id, tipo, ultimos_4_digitos, numero_encriptado, fecha_expiracion)
       VALUES ($1, $2, $3, fn_cifrar_tarjeta($4), $5) RETURNING metodo_id, tipo, ultimos_4_digitos, fecha_expiracion`,
      [req.usuario.cliente_id, tipo, ultimos_4, numero_tarjeta, fecha_expiracion]
    );
    await client.query('COMMIT');
    res.status(201).json(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};