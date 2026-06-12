import { Carrito, Preferencias } from '../config/schema.js';

export const obtenerCarrito = async (req, res) => {
  const carrito = await Carrito.findOne({ cliente_uuid: req.usuario.cliente_id });
  res.json(carrito ?? { items: [] });
};

export const actualizarCarrito = async (req, res) => {
  const carrito = await Carrito.findOneAndUpdate(
    { cliente_uuid: req.usuario.cliente_id },
    { items: req.body.items, actualizado_en: new Date() },
    { new: true, upsert: true }
  );
  res.json(carrito);
};

export const actualizarPreferencias = async (req, res) => {
  const prefs = await Preferencias.findOneAndUpdate(
    { cliente_uuid: req.usuario.cliente_id },
    { ...req.body, actualizado_en: new Date() },
    { new: true, upsert: true }
  );
  res.json(prefs);
};