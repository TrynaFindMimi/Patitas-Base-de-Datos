import { Comida, Ropa, Juguetes, Accesorios, Salud } from '../config/schema.js';

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

export const actualizarStock = async (req, res) => {
  try {
    const { categoria, id } = req.params;
    const { stock } = req.body;

    const Modelo = modelos[categoria];
    if (!Modelo) return res.status(400).json({ error: 'Categoria invalida' });

    if (stock === undefined || stock === null || typeof stock !== 'number' || stock < 0) {
      return res.status(422).json({ error: 'Stock debe ser un numero mayor o igual a 0' });
    }

    const producto = await Modelo.findOneAndUpdate(
      { producto_id: id },
      { stock: Math.floor(stock) },
      { new: true }
    ).lean();

    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
