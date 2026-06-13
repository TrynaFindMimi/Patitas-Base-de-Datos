import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../../server/.env' });

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patitas_catalog');

const comidaSchema = new mongoose.Schema({
  producto_id: String, nombre: String, categoria: { type: String, default: 'comida' },
  precio: Number, marca: String, descripcion: String,
  tipo_animal: [String], peso_kg: Number, sabores: [String],
  etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true }
});

const ropaSchema = new mongoose.Schema({
  producto_id: String, nombre: String, categoria: { type: String, default: 'ropa' },
  precio: Number, marca: String, descripcion: String,
  tipo_animal: [String], tallas: [String], colores: [String], material: String,
  etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true }
});

const juguetesSchema = new mongoose.Schema({
  producto_id: String, nombre: String, categoria: { type: String, default: 'juguetes' },
  precio: Number, marca: String, descripcion: String,
  tipo_animal: [String], material: String, edad_minima_meses: Number,
  interactivo: Boolean, variantes: [String],
  etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true }
});

const Comida = mongoose.model('Comida', comidaSchema, 'productos_comida');
const Ropa = mongoose.model('Ropa', ropaSchema, 'productos_ropa');
const Juguetes = mongoose.model('Juguetes', juguetesSchema, 'productos_juguetes');

const comida = [
  { producto_id: 'COM-001', nombre: 'Croquetas Premium Pollo', precio: 180, marca: 'Purina Pro Plan', tipo_animal: ['perro'], peso_kg: 3, sabores: ['pollo','arroz'], etiquetas: ['premium','adulto','seco'], industria: ['mascotas','nutricion'], stock: 80 },
  { producto_id: 'COM-002', nombre: 'Alimento Húmedo Atún Gato', precio: 45, marca: 'Whiskas', tipo_animal: ['gato'], peso_kg: 0.4, sabores: ['atun','salmon'], etiquetas: ['humedo','natural'], industria: ['mascotas','nutricion'], stock: 150 },
  { producto_id: 'COM-003', nombre: 'Snacks Dentales Perro', precio: 95, marca: 'Pedigree', tipo_animal: ['perro'], peso_kg: 0.5, sabores: ['menta','pollo'], etiquetas: ['dental','premio','snack'], industria: ['mascotas','salud'], stock: 120 },
  { producto_id: 'COM-004', nombre: 'Mezcla Semillas Loro', precio: 65, marca: 'Versele-Laga', tipo_animal: ['ave'], peso_kg: 1, sabores: ['natural'], etiquetas: ['semillas','natural','aves'], industria: ['mascotas','nutricion'], stock: 60 },
  { producto_id: 'COM-005', nombre: 'Pellets Premium Conejo', precio: 55, marca: 'Oxbow', tipo_animal: ['conejo','roedor'], peso_kg: 1.5, sabores: ['hierba','zanahoria'], etiquetas: ['fibra','natural','roedor'], industria: ['mascotas','nutricion'], stock: 40 },
];

const ropa = [
  { producto_id: 'ROP-001', nombre: 'Abrigo Polar Perro', precio: 220, marca: 'PetStyle', tipo_animal: ['perro'], tallas: ['XS','S','M','L','XL'], colores: ['rojo','azul','negro'], material: 'polar', etiquetas: ['invierno','abrigo','moda'], industria: ['mascotas','moda'], stock: 45 },
  { producto_id: 'ROP-002', nombre: 'Camiseta Verano Gato', precio: 85, marca: 'CatFashion', tipo_animal: ['gato'], tallas: ['XS','S','M'], colores: ['blanco','rosa','celeste'], material: 'algodon', etiquetas: ['verano','casual','gato'], industria: ['mascotas','moda'], stock: 30 },
  { producto_id: 'ROP-003', nombre: 'Impermeable Lluvia Perro', precio: 310, marca: 'RainPet', tipo_animal: ['perro'], tallas: ['S','M','L','XL'], colores: ['amarillo','naranja'], material: 'nylon', etiquetas: ['lluvia','impermeable','funcional'], industria: ['mascotas','moda'], stock: 25 },
  { producto_id: 'ROP-004', nombre: 'Disfraz Halloween Perro', precio: 150, marca: 'PetFun', tipo_animal: ['perro','gato'], tallas: ['XS','S','M','L'], colores: ['negro','naranja'], material: 'poliester', etiquetas: ['halloween','disfraz','fiesta'], industria: ['mascotas','moda'], stock: 50 },
  { producto_id: 'ROP-005', nombre: 'Suéter Navideño Mascotas', precio: 195, marca: 'PetStyle', tipo_animal: ['perro','gato'], tallas: ['XS','S','M','L','XL'], colores: ['rojo','verde'], material: 'lana', etiquetas: ['navidad','invierno','moda'], industria: ['mascotas','moda'], stock: 35 },
];

const juguetes = [
  { producto_id: 'JUG-001', nombre: 'Pelota Interactiva LED Gato', precio: 130, marca: 'CatToy', tipo_animal: ['gato'], material: 'plastico ABS', edad_minima_meses: 3, interactivo: true, variantes: ['azul','verde','rojo'], etiquetas: ['interactivo','led','gato'], industria: ['mascotas','entretenimiento'], stock: 60 },
  { producto_id: 'JUG-002', nombre: 'Cuerda Juego Perro Grande', precio: 75, marca: 'DogPlay', tipo_animal: ['perro'], material: 'algodon trenzado', edad_minima_meses: 6, interactivo: false, variantes: ['multicolor','azul'], etiquetas: ['cuerda','morder','resistente'], industria: ['mascotas','entretenimiento'], stock: 90 },
  { producto_id: 'JUG-003', nombre: 'Rascador Torre Gato', precio: 450, marca: 'CatTree', tipo_animal: ['gato'], material: 'sisal+peluche', edad_minima_meses: 2, interactivo: false, variantes: ['beige','gris'], etiquetas: ['rascador','torre','premium'], industria: ['mascotas','hogar'], stock: 15 },
  { producto_id: 'JUG-004', nombre: 'Kong Rellenable Perro', precio: 165, marca: 'Kong', tipo_animal: ['perro'], material: 'caucho natural', edad_minima_meses: 3, interactivo: true, variantes: ['S','M','L','XL'], etiquetas: ['kong','premio','inteligencia'], industria: ['mascotas','entretenimiento'], stock: 55 },
  { producto_id: 'JUG-005', nombre: 'Tunel Explorador Conejo', precio: 95, marca: 'SmallPet', tipo_animal: ['conejo','roedor'], material: 'tela oxford', edad_minima_meses: 1, interactivo: false, variantes: ['verde','gris','azul'], etiquetas: ['tunel','explorar','roedor'], industria: ['mascotas','entretenimiento'], stock: 40 },
];

await Promise.all([Comida.deleteMany({}), Ropa.deleteMany({}), Juguetes.deleteMany({})]);
await Promise.all([Comida.insertMany(comida), Ropa.insertMany(ropa), Juguetes.insertMany(juguetes)]);
console.log('Seed completado: 15 productos en 3 categorias de mascotas');
await mongoose.disconnect();