import { Comida, Ropa, Juguetes, Accesorios, Salud } from '../config/schema.js';
import { query } from '../config/postgres.js';

const modelos = { comida: Comida, ropa: Ropa, juguetes: Juguetes, accesorios: Accesorios, salud: Salud };
const CATEGORIAS = ['comida', 'ropa', 'juguetes', 'accesorios', 'salud'];

export const listarProductos = async (_req, res) => {
  try {
    const resultados = await Promise.all(
      CATEGORIAS.map(async (cat) => {
        const productos = await modelos[cat].find().sort({ nombre: 1 }).lean();
        return { categoria: cat, productos };
      })
    );
    res.json(resultados);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const crearProducto = async (req, res) => {
  try {
    const { categoria } = req.params;
    const Modelo = modelos[categoria];
    if (!Modelo) return res.status(400).json({ error: 'Categoria invalida' });

    const { producto_id, nombre, precio, marca, image, descripcion, tipo_animal, stock, activo, ...resto } = req.body;

    if (!producto_id || !nombre || precio === undefined) {
      return res.status(422).json({ error: 'producto_id, nombre y precio son requeridos' });
    }

    const existe = await Modelo.findOne({ producto_id }).lean();
    if (existe) return res.status(409).json({ error: `Ya existe un producto con ID ${producto_id}` });

    const producto = await Modelo.create({
      producto_id,
      nombre,
      precio,
      marca: marca || 'Generica',
      image: image || '',
      descripcion: descripcion || nombre,
      tipo_animal: tipo_animal || [],
      stock: stock ?? 0,
      activo: activo ?? true,
      categoria,
      ...resto,
    });

    res.status(201).json(producto.toObject());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const actualizarProducto = async (req, res) => {
  try {
    const { categoria, id } = req.params;
    const Modelo = modelos[categoria];
    if (!Modelo) return res.status(400).json({ error: 'Categoria invalida' });

    const permitidos = ['nombre', 'precio', 'marca', 'image', 'descripcion', 'tipo_animal', 'stock', 'activo', 'etiquetas'];
    const cambios = {};
    for (const key of permitidos) {
      if (req.body[key] !== undefined) cambios[key] = req.body[key];
    }

    if (cambios.stock !== undefined) cambios.stock = Math.max(0, Math.floor(cambios.stock));

    const producto = await Modelo.findOneAndUpdate(
      { producto_id: id },
      { $set: cambios },
      { new: true }
    ).lean();

    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const listarPedidosAdmin = async (_req, res) => {
  try {
    const { rows } = await query(
      `SELECT p.pedido_id, p.estado, p.total, p.subtotal, p.costo_envio,
              p.departamento, p.tipo_envio, p.creado_en,
              c.nombre || ' ' || c.apellido AS cliente_nombre, c.email AS cliente_email,
              COALESCE(json_agg(dp.*) FILTER (WHERE dp.detalle_id IS NOT NULL), '[]') AS items
       FROM pedidos p
       JOIN clientes c ON c.cliente_id = p.cliente_id
       LEFT JOIN detalle_pedido dp ON dp.pedido_id = p.pedido_id
       GROUP BY p.pedido_id, c.nombre, c.apellido, c.email
       ORDER BY p.creado_en DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const validos = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];
    if (!validos.includes(estado)) {
      return res.status(422).json({ error: `Estado invalido. Validos: ${validos.join(', ')}` });
    }

    const { rows } = await query(
      `UPDATE pedidos SET estado = $1, actualizado_en = NOW() WHERE pedido_id = $2 RETURNING pedido_id, estado, actualizado_en`,
      [estado, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
