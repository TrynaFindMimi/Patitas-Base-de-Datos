import { Ropa, Electronica, Muebles, Adornos, Utensilios } from '../../../database/mongodb/schema.js';

const modeloPorCategoria = {
  ropa: Ropa,
  electronica: Electronica,
  muebles: Muebles,
  adornos: Adornos,
  utensilios_cocina: Utensilios,
};

export const listarProductos = async (req, res) => {
  const { categoria, marca, precio_min, precio_max, etiqueta, page = 1, limit = 12 } = req.query;
  const filtro = { activo: true };

  if (marca) filtro.marca = marca;
  if (etiqueta) filtro.etiquetas = { $in: [etiqueta] };
  if (precio_min || precio_max) {
    filtro.precio = {};
    if (precio_min) filtro.precio.$gte = Number(precio_min);
    if (precio_max) filtro.precio.$lte = Number(precio_max);
  }

  const skip = (Number(page) - 1) * Number(limit);

  if (categoria && modeloPorCategoria[categoria]) {
    const Modelo = modeloPorCategoria[categoria];
    const [productos, total] = await Promise.all([
      Modelo.find(filtro).skip(skip).limit(Number(limit)),
      Modelo.countDocuments(filtro),
    ]);
    return res.json({ productos, total, page: Number(page), pages: Math.ceil(total / limit) });
  }

  const resultados = await Promise.all(
    Object.values(modeloPorCategoria).map(M => M.find(filtro).limit(6))
  );
  res.json({ productos: resultados.flat() });
};

export const obtenerProducto = async (req, res) => {
  const { categoria, id } = req.params;
  const Modelo = modeloPorCategoria[categoria];
  if (!Modelo) return res.status(400).json({ error: 'Categoría inválida' });

  const producto = await Modelo.findOne({ producto_id: id, activo: true });
  if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(producto);
};

export const buscarProductos = async (req, res) => {
  const { q, precio_min, precio_max } = req.query;
  if (!q) return res.status(422).json({ error: 'Parámetro q requerido' });

  const filtro = {
    activo: true,
    $and: [
      { nombre: { $regex: q, $options: 'i' } },
    ],
  };
  if (precio_min || precio_max) {
    const rango = {};
    if (precio_min) rango.$gte = Number(precio_min);
    if (precio_max) rango.$lte = Number(precio_max);
    filtro.$and.push({ precio: rango });
  }

  const resultados = await Promise.all(
    Object.values(modeloPorCategoria).map(M => M.find(filtro))
  );
  res.json({ productos: resultados.flat(), query: q });
};