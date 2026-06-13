import mongoose from 'mongoose';
import { Ropa, Electronica, Muebles, Adornos, Utensilios } from './schema.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../server/.env' });

const ropa = [
  { producto_id: 'ROPA-001', nombre: 'Camiseta Algodón Premium', precio: 299, marca: 'Zara', tallas: ['S','M','L','XL'], colores: ['blanco','negro','gris'], material: 'algodón 100%', genero: 'unisex', etiquetas: ['casual','verano','básico'], industria: ['moda','retail'], stock: 150 },
  { producto_id: 'ROPA-002', nombre: 'Jeans Slim Fit', precio: 650, marca: 'Levi\'s', tallas: ['S','M','L','XL','XXL'], colores: ['azul','negro'], material: 'denim', genero: 'masculino', etiquetas: ['casual','denim','clásico'], industria: ['moda','retail'], stock: 80 },
  { producto_id: 'ROPA-003', nombre: 'Vestido Floral Verano', precio: 480, marca: 'H&M', tallas: ['XS','S','M','L'], colores: ['rosa','amarillo','verde'], material: 'viscosa', genero: 'femenino', etiquetas: ['verano','floral','casual'], industria: ['moda','retail'], stock: 60 },
];

const electronica = [
  { producto_id: 'ELEC-001', nombre: 'Audífonos Bluetooth Pro', precio: 1200, marca: 'Sony', voltaje: '5V DC', potencia_watts: 20, garantia_meses: 12, conectividad: ['bluetooth 5.0','cable 3.5mm'], compatible_con: ['iOS','Android','Windows'], etiquetas: ['audio','wireless','premium'], industria: ['tecnología','entretenimiento'], stock: 45 },
  { producto_id: 'ELEC-002', nombre: 'Cargador Inalámbrico 15W', precio: 350, marca: 'Belkin', voltaje: '110-220V', potencia_watts: 15, garantia_meses: 6, conectividad: ['Qi wireless'], compatible_con: ['iPhone 12+','Samsung S20+'], etiquetas: ['cargador','wireless','accesorios'], industria: ['tecnología','accesorios'], stock: 120 },
  { producto_id: 'ELEC-003', nombre: 'Bocina Portátil Waterproof', precio: 899, marca: 'JBL', voltaje: '5V DC', potencia_watts: 30, garantia_meses: 12, conectividad: ['bluetooth 5.1','aux'], compatible_con: ['iOS','Android'], etiquetas: ['audio','portátil','outdoor'], industria: ['tecnología','entretenimiento'], stock: 30 },
];

const muebles = [
  { producto_id: 'MUEB-001', nombre: 'Silla Ergonómica de Oficina', precio: 3500, marca: 'Herman Miller', material: 'malla + aluminio', dimensiones: { alto_cm: 120, ancho_cm: 65, profundidad_cm: 65, peso_kg: 18 }, colores: ['negro','gris'], estilo: 'moderno', etiquetas: ['oficina','ergonómico','trabajo'], industria: ['hogar','oficina'], stock: 15 },
  { producto_id: 'MUEB-002', nombre: 'Mesa de Comedor 6 Personas', precio: 5800, marca: 'IKEA', material: 'madera de pino', dimensiones: { alto_cm: 75, ancho_cm: 180, profundidad_cm: 90, peso_kg: 35 }, colores: ['natural','blanco'], estilo: 'escandinavo', etiquetas: ['comedor','madera','familia'], industria: ['hogar','decoración'], stock: 8 },
  { producto_id: 'MUEB-003', nombre: 'Estantería Flotante 3 Niveles', precio: 890, marca: 'Sodimac', material: 'MDF', dimensiones: { alto_cm: 90, ancho_cm: 80, profundidad_cm: 25, peso_kg: 5 }, colores: ['blanco','negro','roble'], estilo: 'minimalista', etiquetas: ['almacenamiento','sala','moderno'], industria: ['hogar','decoración'], stock: 40 },
];

const adornos = [
  { producto_id: 'ADOR-001', nombre: 'Jarrón Cerámico Minimalista', precio: 420, marca: 'Pottery Barn', material: 'cerámica', colores: ['blanco','beige','terracota'], ocasion: ['decoración','regalo','hogar'], estilo: 'minimalista', etiquetas: ['decoración','cerámica','sala'], industria: ['hogar','decoración'], stock: 55 },
  { producto_id: 'ADOR-002', nombre: 'Set Cuadros Abstractos x3', precio: 780, marca: 'ArteHogar', material: 'lienzo+madera', colores: ['multicolor'], ocasion: ['decoración','regalo'], estilo: 'moderno', etiquetas: ['arte','pared','sala'], industria: ['hogar','decoración'], stock: 25 },
  { producto_id: 'ADOR-003', nombre: 'Planta Artificial Tropical', precio: 310, marca: 'GreenLife', material: 'plástico+tela', colores: ['verde'], ocasion: ['decoración','hogar','oficina'], estilo: 'natural', etiquetas: ['planta','verde','decoración'], industria: ['hogar','decoración'], stock: 90 },
];

const utensilios = [
  { producto_id: 'UTEN-001', nombre: 'Set Sartenes Antiadherentes x5', precio: 1100, marca: 'Tefal', material: 'aluminio antiadherente', apto_lavavajillas: false, apto_microondas: false, capacidad_litros: null, variantes: ['16cm','20cm','24cm','26cm','28cm'], etiquetas: ['cocina','antiadherente','conjunto'], industria: ['hogar','cocina'], stock: 35 },
  { producto_id: 'UTEN-002', nombre: 'Olla a Presión 6L', precio: 850, marca: 'Presto', material: 'acero inoxidable', apto_lavavajillas: true, apto_microondas: false, capacidad_litros: 6, variantes: ['4L','6L','8L'], etiquetas: ['olla','presión','cocina rápida'], industria: ['hogar','cocina'], stock: 20 },
  { producto_id: 'UTEN-003', nombre: 'Licuadora de Alta Potencia', precio: 1350, marca: 'Vitamix', material: 'plástico BPA free+acero', apto_lavavajillas: true, apto_microondas: false, capacidad_litros: 2, variantes: ['negro','rojo','plateado'], etiquetas: ['licuadora','batidos','cocina'], industria: ['hogar','cocina'], stock: 18 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  
  await Promise.all([
    Ropa.deleteMany({}),
    Electronica.deleteMany({}),
    Muebles.deleteMany({}),
    Adornos.deleteMany({}),
    Utensilios.deleteMany({})
  ]);

  await Promise.all([
    Ropa.insertMany(ropa),
    Electronica.insertMany(electronica),
    Muebles.insertMany(muebles),
    Adornos.insertMany(adornos),
    Utensilios.insertMany(utensilios)
  ]);

  console.log('Seed completado: 15 productos en 5 categorías');
  await mongoose.disconnect();
}

seed().catch(console.error);