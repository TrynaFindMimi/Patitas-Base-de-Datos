import mongoose from 'mongoose';

const ropaSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'ropa' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  descripcion: { type: String },
  tallas: [{ type: String, enum: ['XS','S','M','L','XL','XXL'] }],
  colores: [String],
  material: { type: String },
  genero: { type: String, enum: ['masculino','femenino','unisex'] },
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const electronicaSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'electronica' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  descripcion: { type: String },
  voltaje: { type: String },
  potencia_watts: { type: Number },
  garantia_meses: { type: Number },
  conectividad: [String],
  compatible_con: [String],
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const mueblesSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'muebles' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  descripcion: { type: String },
  material: { type: String },
  dimensiones: {
    alto_cm: Number,
    ancho_cm: Number,
    profundidad_cm: Number,
    peso_kg: Number
  },
  colores: [String],
  estilo: { type: String },
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const adornosSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'adornos' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  descripcion: { type: String },
  material: { type: String },
  colores: [String],
  ocasion: [String],
  estilo: { type: String },
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const utensiliosSchema = new mongoose.Schema({
  producto_id: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  categoria: { type: String, default: 'utensilios_cocina' },
  precio: { type: Number, required: true, min: 0 },
  marca: { type: String, required: true },
  descripcion: { type: String },
  material: { type: String },
  apto_lavavajillas: { type: Boolean },
  apto_microondas: { type: Boolean },
  capacidad_litros: { type: Number },
  variantes: [String],
  etiquetas: [String],
  industria: [String],
  stock: { type: Number, default: 0 },
  activo: { type: Boolean, default: true },
  creado_en: { type: Date, default: Date.now }
});

const carritoSchema = new mongoose.Schema({
  cliente_uuid: { type: String, required: true, unique: true },
  items: [{
    producto_id: String,
    nombre: String,
    precio: Number,
    cantidad: Number,
    categoria: String
  }],
  actualizado_en: { type: Date, default: Date.now }
});

const preferenciasSchema = new mongoose.Schema({
  cliente_uuid: { type: String, required: true, unique: true },
  categorias_favoritas: [String],
  marcas_favoritas: [String],
  rango_precio: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 99999 }
  },
  historial_vistos: [String],
  actualizado_en: { type: Date, default: Date.now }
});

export const Ropa = mongoose.model('Ropa', ropaSchema, 'productos_ropa');
export const Electronica = mongoose.model('Electronica', electronicaSchema, 'productos_electronica');
export const Muebles = mongoose.model('Muebles', mueblesSchema, 'productos_muebles');
export const Adornos = mongoose.model('Adornos', adornosSchema, 'productos_adornos');
export const Utensilios = mongoose.model('Utensilios', utensiliosSchema, 'productos_utensilios');
export const Carrito = mongoose.model('Carrito', carritoSchema, 'carritos');
export const Preferencias = mongoose.model('Preferencias', preferenciasSchema, 'preferencias');