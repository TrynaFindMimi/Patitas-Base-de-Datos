import mongoose from 'mongoose';
import { Ropa, Electronica, Muebles, Adornos, Utensilios } from './schema.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../server/.env' });

await mongoose.connect(process.env.MONGO_URI);

// Productos de electrónica con precio mayor a 500 y stock mayor a 20
const electronicos_filtrados = await Electronica.find({
  $and: [
    { precio: { $gt: 500 } },
    { stock: { $gt: 20 } }
  ]
}).select('nombre precio stock marca');

// Productos de ropa talla M o L con precio menor a 500
const ropa_filtrada = await Ropa.find({
  $and: [
    { tallas: { $in: ['M', 'L'] } },
    { precio: { $lt: 500 } }
  ]
}).select('nombre precio tallas colores');

// Muebles de madera o con precio menor a 1000
const muebles_filtrados = await Muebles.find({
  $or: [
    { material: { $regex: /madera/i } },
    { precio: { $lt: 1000 } }
  ]
}).select('nombre precio material estilo');

// Productos con etiqueta "premium" o "ergonómico" en cualquier categoría
const [r, e, m, a, u] = await Promise.all([
  Ropa.find({ etiquetas: { $in: ['premium', 'ergonómico', 'wireless'] } }),
  Electronica.find({ etiquetas: { $in: ['premium', 'ergonómico', 'wireless'] } }),
  Muebles.find({ etiquetas: { $in: ['premium', 'ergonómico', 'wireless'] } }),
  Adornos.find({ etiquetas: { $in: ['premium', 'ergonómico', 'wireless'] } }),
  Utensilios.find({ etiquetas: { $in: ['premium', 'ergonómico', 'wireless'] } }),
]);
const por_etiqueta = [...r, ...e, ...m, ...a, ...u];

// Utensilios aptos para lavavajillas con precio entre 800 y 1500
const utensilios_filtrados = await Utensilios.find({
  $and: [
    { apto_lavavajillas: true },
    { precio: { $gte: 800, $lte: 1500 } }
  ]
}).select('nombre precio material variantes');

// Productos por industria usando arreglo
const por_industria = await Electronica.find({
  industria: { $all: ['tecnología', 'entretenimiento'] }
}).select('nombre industria precio');

console.log({ electronicos_filtrados, ropa_filtrada, muebles_filtrados, por_etiqueta, utensilios_filtrados, por_industria });

await mongoose.disconnect();