import mongoose from 'mongoose';

const comidaSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'comida' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  image: { type: String },
  descripcion: { type: String },
  tipo_animal: [String],
  peso_kg: { type: Number },
  sabores: [String],
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const ropaSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'ropa' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  image: { type: String },
  descripcion: { type: String },
  tipo_animal: [String],
  tallas: [String],
  colores: [String],
  material: { type: String },
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const juguetesSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'juguetes' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  image: { type: String },
  descripcion: { type: String },
  tipo_animal: [String],
  material: { type: String },
  edad_minima_meses: { type: Number },
  interactivo: { type: Boolean },
  variantes: [String],
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const accesoriosSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'accesorios' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  image: { type: String },
  descripcion: { type: String },
  tipo_animal: [String],
  material: { type: String },
  colores: [String],
  variantes: [String],
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const saludSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'salud' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  image: { type: String },
  descripcion: { type: String },
  tipo_animal: [String],
  tipo_producto: { type: String },
  requiere_receta: { type: Boolean, default: false },
  presentacion: [String],
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const carritoSchema = new mongoose.Schema({
  cliente_uuid: { type: String, required: true, unique: true },
  items: [{
    producto_id: String, nombre: String, precio: Number, cantidad: Number, categoria: String
  }],
  actualizado_en: { type: Date, default: Date.now }
});

const preferenciasSchema = new mongoose.Schema({
  cliente_uuid: { type: String, required: true, unique: true },
  categorias_favoritas: [String],
  marcas_favoritas: [String],
  rango_precio: { min: { type: Number, default: 0 }, max: { type: Number, default: 99999 } },
  historial_vistos: [String],
  actualizado_en: { type: Date, default: Date.now }
});

export const Comida = mongoose.model('Comida', comidaSchema, 'productos_comida');
export const Ropa = mongoose.model('Ropa', ropaSchema, 'productos_ropa');
export const Juguetes = mongoose.model('Juguetes', juguetesSchema, 'productos_juguetes');
export const Accesorios = mongoose.model('Accesorios', accesoriosSchema, 'productos_accesorios');
export const Salud = mongoose.model('Salud', saludSchema, 'productos_salud');
export const Carrito = mongoose.model('Carrito', carritoSchema, 'carritos');
export const Preferencias = mongoose.model('Preferencias', preferenciasSchema, 'preferencias');