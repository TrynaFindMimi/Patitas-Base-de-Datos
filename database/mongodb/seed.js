import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../../server/.env' });

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patitas_catalog');

const comidaSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'comida' }, precio: Number, marca: String, tipo_animal: [String], peso_kg: Number, sabores: [String], etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });
const ropaSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'ropa' }, precio: Number, marca: String, tipo_animal: [String], tallas: [String], colores: [String], material: String, etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });
const juguetesSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'juguetes' }, precio: Number, marca: String, tipo_animal: [String], material: String, edad_minima_meses: Number, interactivo: Boolean, variantes: [String], etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });
const accesoriosSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'accesorios' }, precio: Number, marca: String, tipo_animal: [String], material: String, colores: [String], variantes: [String], etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });
const saludSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'salud' }, precio: Number, marca: String, tipo_animal: [String], tipo_producto: String, requiere_receta: Boolean, presentacion: [String], etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });

const Comida = mongoose.model('Comida', comidaSchema, 'productos_comida');
const Ropa = mongoose.model('Ropa', ropaSchema, 'productos_ropa');
const Juguetes = mongoose.model('Juguetes', juguetesSchema, 'productos_juguetes');
const Accesorios = mongoose.model('Accesorios', accesoriosSchema, 'productos_accesorios');
const Salud = mongoose.model('Salud', saludSchema, 'productos_salud');

const comida = [
  { producto_id: 'COM-001', nombre: 'Croquetas Premium Pollo', precio: 180, marca: 'Purina Pro Plan', tipo_animal: ['perro'], peso_kg: 3, sabores: ['pollo','arroz'], etiquetas: ['premium','adulto','seco'], industria: ['mascotas','nutricion'], stock: 80 },
  { producto_id: 'COM-002', nombre: 'Alimento Humedo Atun Gato', precio: 45, marca: 'Whiskas', tipo_animal: ['gato'], peso_kg: 0.4, sabores: ['atun','salmon'], etiquetas: ['humedo','natural'], industria: ['mascotas','nutricion'], stock: 150 },
  { producto_id: 'COM-003', nombre: 'Snacks Dentales Perro', precio: 95, marca: 'Pedigree', tipo_animal: ['perro'], peso_kg: 0.5, sabores: ['menta','pollo'], etiquetas: ['dental','premio','snack'], industria: ['mascotas','salud'], stock: 120 },
  { producto_id: 'COM-004', nombre: 'Alimento Senior Perro 7+', precio: 210, marca: 'Royal Canin', tipo_animal: ['perro'], peso_kg: 2, sabores: ['pollo','arroz integral'], etiquetas: ['senior','premium','digestivo'], industria: ['mascotas','nutricion'], stock: 45 },
  { producto_id: 'COM-005', nombre: 'Alimento Natural Sin Granos Perro', precio: 250, marca: 'Acana', tipo_animal: ['perro'], peso_kg: 2.5, sabores: ['salmon','batata'], etiquetas: ['natural','sin granos','premium'], industria: ['mascotas','nutricion'], stock: 35 },
  { producto_id: 'COM-006', nombre: 'Comida Humeda Gato Salmon', precio: 55, marca: 'Purina Gourmet', tipo_animal: ['gato'], peso_kg: 0.4, sabores: ['salmon','camaron'], etiquetas: ['humedo','premium','gato'], industria: ['mascotas','nutricion'], stock: 120 },
  { producto_id: 'COM-007', nombre: 'Alimento Cachorro Raza Pequena', precio: 195, marca: 'Royal Canin', tipo_animal: ['perro'], peso_kg: 1.5, sabores: ['pollo'], etiquetas: ['cachorro','premium','raza pequena'], industria: ['mascotas','nutricion'], stock: 60 },
  { producto_id: 'COM-008', nombre: 'Snack Natural Pollo Deshidratado', precio: 65, marca: 'Purina Pro Plan', tipo_animal: ['perro','gato'], peso_kg: 0.2, sabores: ['pollo'], etiquetas: ['natural','premio','snack'], industria: ['mascotas','salud'], stock: 200 },
];

const ropa = [
  { producto_id: 'ROP-001', nombre: 'Abrigo Polar Perro', precio: 220, marca: 'PetStyle', tipo_animal: ['perro'], tallas: ['XS','S','M','L','XL'], colores: ['rojo','azul','negro'], material: 'polar', etiquetas: ['invierno','abrigo','moda'], industria: ['mascotas','moda'], stock: 45 },
  { producto_id: 'ROP-002', nombre: 'Camiseta Verano Gato', precio: 85, marca: 'CatFashion', tipo_animal: ['gato'], tallas: ['XS','S','M'], colores: ['blanco','rosa','celeste'], material: 'algodon', etiquetas: ['verano','casual','gato'], industria: ['mascotas','moda'], stock: 30 },
  { producto_id: 'ROP-003', nombre: 'Impermeable Lluvia Perro', precio: 310, marca: 'RainPet', tipo_animal: ['perro'], tallas: ['S','M','L','XL'], colores: ['amarillo','naranja'], material: 'nylon', etiquetas: ['lluvia','impermeable','funcional'], industria: ['mascotas','moda'], stock: 25 },
  { producto_id: 'ROP-004', nombre: 'Pijama Navidad Mascotas', precio: 175, marca: 'PetStyle', tipo_animal: ['perro','gato'], tallas: ['XS','S','M','L'], colores: ['rojo','verde'], material: 'algodon', etiquetas: ['navidad','invierno','moda'], industria: ['mascotas','moda'], stock: 60 },
  { producto_id: 'ROP-005', nombre: 'Arnes Reflectante Perro', precio: 195, marca: 'PetStyle', tipo_animal: ['perro'], tallas: ['S','M','L','XL'], colores: ['neon','azul','rojo'], material: 'neopreno', etiquetas: ['arnes','reflectante','seguridad'], industria: ['mascotas','moda'], stock: 40 },
  { producto_id: 'ROP-006', nombre: 'Sueter Tejido Mascotas Pequenas', precio: 135, marca: 'CatFashion', tipo_animal: ['perro','gato'], tallas: ['XS','S','M'], colores: ['gris','beige','verde'], material: 'lanilla', etiquetas: ['invierno','tejido','calido'], industria: ['mascotas','moda'], stock: 55 },
];

const juguetes = [
  { producto_id: 'JUG-001', nombre: 'Pelota Interactiva LED Gato', precio: 130, marca: 'CatToy', tipo_animal: ['gato'], material: 'plastico ABS', edad_minima_meses: 3, interactivo: true, variantes: ['azul','verde','rojo'], etiquetas: ['interactivo','led','gato'], industria: ['mascotas','entretenimiento'], stock: 60 },
  { producto_id: 'JUG-002', nombre: 'Cuerda Juego Perro Grande', precio: 75, marca: 'DogPlay', tipo_animal: ['perro'], material: 'algodon trenzado', edad_minima_meses: 6, interactivo: false, variantes: ['multicolor','azul'], etiquetas: ['cuerda','morder','resistente'], industria: ['mascotas','entretenimiento'], stock: 90 },
  { producto_id: 'JUG-003', nombre: 'Kong Rellenable Perro', precio: 165, marca: 'Kong', tipo_animal: ['perro'], material: 'caucho natural', edad_minima_meses: 3, interactivo: true, variantes: ['S','M','L','XL'], etiquetas: ['kong','premio','inteligencia'], industria: ['mascotas','entretenimiento'], stock: 55 },
  { producto_id: 'JUG-004', nombre: 'Rascador Torre Gato Premium', precio: 450, marca: 'CatTree', tipo_animal: ['gato'], material: 'sisal+peluche', edad_minima_meses: 2, interactivo: false, variantes: ['beige','gris'], etiquetas: ['premium','rascador','gato'], industria: ['mascotas','entretenimiento'], stock: 15 },
];

const accesorios = [
  { producto_id: 'ACC-001', nombre: 'Collar LED Seguridad Perro', precio: 145, marca: 'SafePet', tipo_animal: ['perro'], material: 'nylon+LED', colores: ['rojo','azul','verde'], variantes: ['S','M','L'], etiquetas: ['seguridad','noche','collar'], industria: ['mascotas','accesorios'], stock: 70 },
  { producto_id: 'ACC-002', nombre: 'Correa Retractil 5m', precio: 195, marca: 'Flexi', tipo_animal: ['perro'], material: 'nylon', colores: ['negro','rojo'], variantes: ['S','M','L'], etiquetas: ['correa','paseo','retractil'], industria: ['mascotas','accesorios'], stock: 40 },
  { producto_id: 'ACC-003', nombre: 'Cama Ortopedica Mascotas', precio: 380, marca: 'PetComfort', tipo_animal: ['perro','gato'], material: 'memory foam', colores: ['gris','beige'], variantes: ['S','M','L'], etiquetas: ['cama','ortopedica','descanso'], industria: ['mascotas','hogar'], stock: 25 },
  { producto_id: 'ACC-004', nombre: 'Mochila Transporte Gato', precio: 320, marca: 'PetBag', tipo_animal: ['gato','perro'], material: 'oxford+malla', colores: ['gris','negro','azul'], variantes: ['S','M'], etiquetas: ['transporte','viaje','seguridad'], industria: ['mascotas','accesorios'], stock: 30 },
];

const salud = [
  { producto_id: 'SAL-001', nombre: 'Antiparasitario Pipeta Perro', precio: 85, marca: 'Frontline', tipo_animal: ['perro'], tipo_producto: 'antiparasitario', requiere_receta: false, presentacion: ['pipeta 1ml','pipeta 2.5ml','pipeta 4ml'], etiquetas: ['antiparasitario','pulgas','garrapatas'], industria: ['mascotas','salud'], stock: 100 },
  { producto_id: 'SAL-002', nombre: 'Suplemento Articulaciones Perro', precio: 220, marca: 'Cosequin', tipo_animal: ['perro'], tipo_producto: 'suplemento', requiere_receta: false, presentacion: ['60 tabletas','120 tabletas'], etiquetas: ['articulaciones','senior','suplemento'], industria: ['mascotas','salud'], stock: 35 },
  { producto_id: 'SAL-003', nombre: 'Shampoo Medicado Piel Sensible', precio: 120, marca: 'Virbac', tipo_animal: ['perro','gato'], tipo_producto: 'higiene', requiere_receta: false, presentacion: ['200ml','500ml'], etiquetas: ['shampoo','piel','medicado'], industria: ['mascotas','higiene'], stock: 55 },
  { producto_id: 'SAL-004', nombre: 'Vitaminas Cachorro Multivitaminico', precio: 155, marca: 'Nutri-Vet', tipo_animal: ['perro','gato'], tipo_producto: 'suplemento', requiere_receta: false, presentacion: ['30 tabletas','60 tabletas'], etiquetas: ['cachorro','vitaminas','natural'], industria: ['mascotas','salud'], stock: 80 },
];

await Promise.all([
  Comida.deleteMany({}), Ropa.deleteMany({}), Juguetes.deleteMany({}),
  Accesorios.deleteMany({}), Salud.deleteMany({})
]);
await Promise.all([
  Comida.insertMany(comida), Ropa.insertMany(ropa), Juguetes.insertMany(juguetes),
  Accesorios.insertMany(accesorios), Salud.insertMany(salud)
]);
console.log('Seed completado: 20 productos en 5 categorias de mascotas');
await mongoose.disconnect();