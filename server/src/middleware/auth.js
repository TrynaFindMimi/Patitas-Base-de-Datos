import jwt from 'jsonwebtoken';
import { query } from '../config/postgres.js';

export const verificarToken = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await query(
      'SELECT cliente_id, email FROM clientes WHERE cliente_id = $1 AND activo = TRUE',
      [payload.cliente_id]
    );
    if (!rows.length) return res.status(401).json({ error: 'Usuario no válido' });
    req.usuario = rows[0];
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export const requiereRol = (...roles) => (req, res, next) => {
  if (!roles.includes(req.usuario?.rol)) {
    return res.status(403).json({ error: 'Sin permisos para esta acción' });
  }
  next();
};