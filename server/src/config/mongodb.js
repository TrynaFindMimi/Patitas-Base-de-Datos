import mongoose from 'mongoose';
import { Comida, Ropa, Juguetes, Accesorios, Salud } from './schema.js';

const img = (id) => `https://picsum.photos/seed/${id}/400/400`;

const productosComida = [
  { producto_id: 'COM-001', nombre: 'Croquetas Premium Pollo', precio: 180, marca: 'Purina Pro Plan', image: img('COM-001'), tipo_animal: ['perro'], peso_kg: 3, sabores: ['pollo','arroz'], etiquetas: ['premium','adulto','seco'], industria: ['mascotas','nutricion'], stock: 80 },
  { producto_id: 'COM-002', nombre: 'Alimento Humedo Atun Gato', precio: 45, marca: 'Whiskas', image: img('COM-002'), tipo_animal: ['gato'], peso_kg: 0.4, sabores: ['atun','salmon'], etiquetas: ['humedo','natural'], industria: ['mascotas','nutricion'], stock: 150 },
  { producto_id: 'COM-003', nombre: 'Snacks Dentales Perro', precio: 95, marca: 'Pedigree', image: img('COM-003'), tipo_animal: ['perro'], peso_kg: 0.5, sabores: ['menta','pollo'], etiquetas: ['dental','premio','snack'], industria: ['mascotas','salud'], stock: 120 },
  { producto_id: 'COM-004', nombre: 'Alimento Senior Perro 7+', precio: 210, marca: 'Royal Canin', image: img('COM-004'), tipo_animal: ['perro'], peso_kg: 2, sabores: ['pollo','arroz integral'], etiquetas: ['senior','premium','digestivo'], industria: ['mascotas','nutricion'], stock: 45 },
  { producto_id: 'COM-005', nombre: 'Alimento Natural Sin Granos', precio: 250, marca: 'Acana', image: img('COM-005'), tipo_animal: ['perro'], peso_kg: 2.5, sabores: ['salmon','batata'], etiquetas: ['natural','sin granos','premium'], industria: ['mascotas','nutricion'], stock: 35 },
  { producto_id: 'COM-006', nombre: 'Comida Humeda Gato Salmon', precio: 55, marca: 'Purina Gourmet', image: img('COM-006'), tipo_animal: ['gato'], peso_kg: 0.4, sabores: ['salmon','camaron'], etiquetas: ['humedo','premium','gato'], industria: ['mascotas','nutricion'], stock: 120 },
  { producto_id: 'COM-007', nombre: 'Alimento Cachorro Raza Pequena', precio: 195, marca: 'Royal Canin', image: img('COM-007'), tipo_animal: ['perro'], peso_kg: 1.5, sabores: ['pollo'], etiquetas: ['cachorro','premium'], industria: ['mascotas','nutricion'], stock: 60 },
  { producto_id: 'COM-008', nombre: 'Snack Natural Pollo Deshidratado', precio: 65, marca: 'Purina Pro Plan', image: img('COM-008'), tipo_animal: ['perro','gato'], peso_kg: 0.2, sabores: ['pollo'], etiquetas: ['natural','premio','snack'], industria: ['mascotas','salud'], stock: 200 },
  { producto_id: 'COM-009', nombre: 'Croquetas Gato Esterilizado', precio: 170, marca: 'Hill\'s Science', image: img('COM-009'), tipo_animal: ['gato'], peso_kg: 1.5, sabores: ['pollo','arroz'], etiquetas: ['esterilizado','adulto','premium'], industria: ['mascotas','nutricion'], stock: 70 },
  { producto_id: 'COM-010', nombre: 'Alimento Perro Raza Grande', precio: 230, marca: 'Eukanuba', image: img('COM-010'), tipo_animal: ['perro'], peso_kg: 4, sabores: ['pollo','cebada'], etiquetas: ['raza grande','adulto','premium'], industria: ['mascotas','nutricion'], stock: 40 },
  { producto_id: 'COM-011', nombre: 'Galletas Entrenamiento Perro', precio: 35, marca: 'Pedigree', image: img('COM-011'), tipo_animal: ['perro'], peso_kg: 0.3, sabores: ['higado','pollo'], etiquetas: ['premio','entrenamiento','snack'], industria: ['mascotas','nutricion'], stock: 300 },
  { producto_id: 'COM-012', nombre: 'Alimento Humedo Gato Pato', precio: 60, marca: 'Purina Gourmet', image: img('COM-012'), tipo_animal: ['gato'], peso_kg: 0.4, sabores: ['pato','pavo'], etiquetas: ['humedo','premium','gato'], industria: ['mascotas','nutricion'], stock: 100 },
  { producto_id: 'COM-013', nombre: 'Comida Perro Cachorro 0-12m', precio: 200, marca: 'Royal Canin', image: img('COM-013'), tipo_animal: ['perro'], peso_kg: 2, sabores: ['pollo'], etiquetas: ['cachorro','starter','premium'], industria: ['mascotas','nutricion'], stock: 55 },
  { producto_id: 'COM-014', nombre: 'Snack Suave Gato Adulto', precio: 40, marca: 'Whiskas', image: img('COM-014'), tipo_animal: ['gato'], peso_kg: 0.1, sabores: ['atun','queso'], etiquetas: ['snack','suave','premio'], industria: ['mascotas','nutricion'], stock: 250 },
  { producto_id: 'COM-015', nombre: 'Alimento Perro Light Bajo Calorias', precio: 215, marca: 'Hill\'s Science', image: img('COM-015'), tipo_animal: ['perro'], peso_kg: 2, sabores: ['pollo','arroz'], etiquetas: ['light','bajo calorias','control peso'], industria: ['mascotas','nutricion'], stock: 30 },
];
const productosRopa = [
  { producto_id: 'ROP-001', nombre: 'Abrigo Polar Perro', precio: 220, marca: 'PetStyle', image: img('ROP-001'), tipo_animal: ['perro'], tallas: ['XS','S','M','L','XL'], colores: ['rojo','azul','negro'], material: 'polar', etiquetas: ['invierno','abrigo','moda'], industria: ['mascotas','moda'], stock: 45 },
  { producto_id: 'ROP-002', nombre: 'Camiseta Verano Gato', precio: 85, marca: 'CatFashion', image: img('ROP-002'), tipo_animal: ['gato'], tallas: ['XS','S','M'], colores: ['blanco','rosa','celeste'], material: 'algodon', etiquetas: ['verano','casual','gato'], industria: ['mascotas','moda'], stock: 30 },
  { producto_id: 'ROP-003', nombre: 'Impermeable Lluvia Perro', precio: 310, marca: 'RainPet', image: img('ROP-003'), tipo_animal: ['perro'], tallas: ['S','M','L','XL'], colores: ['amarillo','naranja'], material: 'nylon', etiquetas: ['lluvia','impermeable','funcional'], industria: ['mascotas','moda'], stock: 25 },
  { producto_id: 'ROP-004', nombre: 'Pijama Navidad Mascotas', precio: 175, marca: 'PetStyle', image: img('ROP-004'), tipo_animal: ['perro','gato'], tallas: ['XS','S','M','L'], colores: ['rojo','verde'], material: 'algodon', etiquetas: ['navidad','invierno','moda'], industria: ['mascotas','moda'], stock: 60 },
  { producto_id: 'ROP-005', nombre: 'Arnes Reflectante Perro', precio: 195, marca: 'PetStyle', image: img('ROP-005'), tipo_animal: ['perro'], tallas: ['S','M','L','XL'], colores: ['neon','azul','rojo'], material: 'neopreno', etiquetas: ['arnes','reflectante','seguridad'], industria: ['mascotas','moda'], stock: 40 },
  { producto_id: 'ROP-006', nombre: 'Sueter Tejido Mascotas Pequenas', precio: 135, marca: 'CatFashion', image: img('ROP-006'), tipo_animal: ['perro','gato'], tallas: ['XS','S','M'], colores: ['gris','beige','verde'], material: 'lanilla', etiquetas: ['invierno','tejido','calido'], industria: ['mascotas','moda'], stock: 55 },
  { producto_id: 'ROP-007', nombre: 'Chaleco Salvavidas Perro', precio: 280, marca: 'SafePet', image: img('ROP-007'), tipo_animal: ['perro'], tallas: ['S','M','L','XL'], colores: ['naranja','rojo','azul'], material: 'neopreno', etiquetas: ['salvavidas','playa','piscina'], industria: ['mascotas','moda'], stock: 20 },
  { producto_id: 'ROP-008', nombre: 'Corbata Mascota Formal', precio: 95, marca: 'CatFashion', image: img('ROP-008'), tipo_animal: ['perro','gato'], tallas: ['S','M','L'], colores: ['negra','azul','roja'], material: 'seda', etiquetas: ['formal','elegante','accesorio'], industria: ['mascotas','moda'], stock: 80 },
  { producto_id: 'ROP-009', nombre: 'Vestido Princesa Perro', precio: 155, marca: 'PetStyle', image: img('ROP-009'), tipo_animal: ['perro'], tallas: ['XS','S','M'], colores: ['rosa','blanco','lavanda'], material: 'tul', etiquetas: ['vestido','princesa','elegante'], industria: ['mascotas','moda'], stock: 35 },
  { producto_id: 'ROP-010', nombre: 'Chaqueta Cuero Mascota', precio: 350, marca: 'PetStyle', image: img('ROP-010'), tipo_animal: ['perro'], tallas: ['M','L','XL'], colores: ['negro','cafe'], material: 'cuero sintetico', etiquetas: ['chaqueta','rock','estilo'], industria: ['mascotas','moda'], stock: 15 },
  { producto_id: 'ROP-011', nombre: 'Pantalon Impermeable Perro', precio: 195, marca: 'RainPet', image: img('ROP-011'), tipo_animal: ['perro'], tallas: ['S','M','L','XL'], colores: ['azul','verde'], material: 'nylon impermeable', etiquetas: ['lluvia','impermeable','pantalon'], industria: ['mascotas','moda'], stock: 28 },
  { producto_id: 'ROP-012', nombre: 'Bufanda Invierno Gato', precio: 75, marca: 'CatFashion', image: img('ROP-012'), tipo_animal: ['gato'], tallas: ['XS','S','M'], colores: ['rojo','gris','azul marino'], material: 'lanilla', etiquetas: ['invierno','bufanda','calido'], industria: ['mascotas','moda'], stock: 65 },
];
const productosJuguetes = [
  { producto_id: 'JUG-001', nombre: 'Pelota Interactiva LED Gato', precio: 130, marca: 'CatToy', image: img('JUG-001'), tipo_animal: ['gato'], material: 'plastico ABS', edad_minima_meses: 3, interactivo: true, variantes: ['azul','verde','rojo'], etiquetas: ['interactivo','led','gato'], industria: ['mascotas','entretenimiento'], stock: 60 },
  { producto_id: 'JUG-002', nombre: 'Cuerda Juego Perro Grande', precio: 75, marca: 'DogPlay', image: img('JUG-002'), tipo_animal: ['perro'], material: 'algodon trenzado', edad_minima_meses: 6, interactivo: false, variantes: ['multicolor','azul'], etiquetas: ['cuerda','morder','resistente'], industria: ['mascotas','entretenimiento'], stock: 90 },
  { producto_id: 'JUG-003', nombre: 'Kong Rellenable Perro', precio: 165, marca: 'Kong', image: img('JUG-003'), tipo_animal: ['perro'], material: 'caucho natural', edad_minima_meses: 3, interactivo: true, variantes: ['S','M','L','XL'], etiquetas: ['kong','premio','inteligencia'], industria: ['mascotas','entretenimiento'], stock: 55 },
  { producto_id: 'JUG-004', nombre: 'Rascador Torre Gato Premium', precio: 450, marca: 'CatTree', image: img('JUG-004'), tipo_animal: ['gato'], material: 'sisal+peluche', edad_minima_meses: 2, interactivo: false, variantes: ['beige','gris'], etiquetas: ['premium','rascador','gato'], industria: ['mascotas','entretenimiento'], stock: 15 },
  { producto_id: 'JUG-005', nombre: 'Laser Interactivo Gato', precio: 110, marca: 'CatToy', image: img('JUG-005'), tipo_animal: ['gato'], material: 'metal+plastico', edad_minima_meses: 3, interactivo: true, variantes: ['rojo','verde'], etiquetas: ['laser','interactivo','caza'], industria: ['mascotas','entretenimiento'], stock: 100 },
  { producto_id: 'JUG-006', nombre: 'Frisbee Volador Perro', precio: 60, marca: 'DogPlay', image: img('JUG-006'), tipo_animal: ['perro'], material: 'silicona', edad_minima_meses: 6, interactivo: true, variantes: ['naranja','verde','azul'], etiquetas: ['frisbee','lanzar','juego'], industria: ['mascotas','entretenimiento'], stock: 80 },
  { producto_id: 'JUG-007', nombre: 'Juguete Cuerda Nudos', precio: 50, marca: 'DogPlay', image: img('JUG-007'), tipo_animal: ['perro'], material: 'algodon', edad_minima_meses: 4, interactivo: false, variantes: ['multicolor'], etiquetas: ['cuerda','tirar','morder'], industria: ['mascotas','entretenimiento'], stock: 120 },
  { producto_id: 'JUG-008', nombre: 'Tunel Plegable Gato', precio: 200, marca: 'CatTree', image: img('JUG-008'), tipo_animal: ['gato'], material: 'poliester+espiral', edad_minima_meses: 2, interactivo: true, variantes: ['azul','rojo','coral'], etiquetas: ['tunel','escondite','juego'], industria: ['mascotas','entretenimiento'], stock: 25 },
  { producto_id: 'JUG-009', nombre: 'Pelota Rebound Automatica', precio: 140, marca: 'CatToy', image: img('JUG-009'), tipo_animal: ['perro','gato'], material: 'goma', edad_minima_meses: 4, interactivo: true, variantes: ['naranja','azul'], etiquetas: ['rebound','automatico','interactivo'], industria: ['mascotas','entretenimiento'], stock: 45 },
  { producto_id: 'JUG-010', nombre: 'Hueso Nailon Sabor Pollo', precio: 85, marca: 'Kong', image: img('JUG-010'), tipo_animal: ['perro'], material: 'nailon', edad_minima_meses: 4, interactivo: false, variantes: ['S','M','L'], etiquetas: ['hueso','morder','dental'], industria: ['mascotas','entretenimiento'], stock: 70 },
  { producto_id: 'JUG-011', nombre: 'Plumas Varias Gato', precio: 35, marca: 'CatToy', image: img('JUG-011'), tipo_animal: ['gato'], material: 'plumas naturales', edad_minima_meses: 2, interactivo: true, variantes: ['multicolor'], etiquetas: ['pluma','caza','vario'], industria: ['mascotas','entretenimiento'], stock: 200 },
  { producto_id: 'JUG-012', nombre: 'Set Pelotas Deportivas Perro', precio: 95, marca: 'DogPlay', image: img('JUG-012'), tipo_animal: ['perro'], material: 'goma resistente', edad_minima_meses: 4, interactivo: false, variantes: ['3 piezas','5 piezas'], etiquetas: ['pelota','deporte','juego'], industria: ['mascotas','entretenimiento'], stock: 60 },
];
const productosAccesorios = [
  { producto_id: 'ACC-001', nombre: 'Collar LED Seguridad Perro', precio: 145, marca: 'SafePet', image: img('ACC-001'), tipo_animal: ['perro'], material: 'nylon+LED', colores: ['rojo','azul','verde'], variantes: ['S','M','L'], etiquetas: ['seguridad','noche','collar'], industria: ['mascotas','accesorios'], stock: 70 },
  { producto_id: 'ACC-002', nombre: 'Correa Retractil 5m', precio: 195, marca: 'Flexi', image: img('ACC-002'), tipo_animal: ['perro'], material: 'nylon', colores: ['negro','rojo'], variantes: ['S','M','L'], etiquetas: ['correa','paseo','retractil'], industria: ['mascotas','accesorios'], stock: 40 },
  { producto_id: 'ACC-003', nombre: 'Cama Ortopedica Mascotas', precio: 380, marca: 'PetComfort', image: img('ACC-003'), tipo_animal: ['perro','gato'], material: 'memory foam', colores: ['gris','beige'], variantes: ['S','M','L'], etiquetas: ['cama','ortopedica','descanso'], industria: ['mascotas','hogar'], stock: 25 },
  { producto_id: 'ACC-004', nombre: 'Mochila Transporte Gato', precio: 320, marca: 'PetBag', image: img('ACC-004'), tipo_animal: ['gato','perro'], material: 'oxford+malla', colores: ['gris','negro','azul'], variantes: ['S','M'], etiquetas: ['transporte','viaje','seguridad'], industria: ['mascotas','accesorios'], stock: 30 },
  { producto_id: 'ACC-005', nombre: 'Placa Identificacion Grabada', precio: 60, marca: 'SafePet', image: img('ACC-005'), tipo_animal: ['perro','gato'], material: 'acero inoxidable', colores: ['plata','dorado','negro'], variantes: ['circular','hueso'], etiquetas: ['identificacion','seguridad','placa'], industria: ['mascotas','accesorios'], stock: 150 },
  { producto_id: 'ACC-006', nombre: 'Comedero Automatico Programable', precio: 520, marca: 'PetComfort', image: img('ACC-006'), tipo_animal: ['perro','gato'], material: 'plastico ABS+acero', colores: ['blanco','negro'], variantes: ['3L','5L'], etiquetas: ['automatico','comedero','programable'], industria: ['mascotas','hogar'], stock: 10 },
  { producto_id: 'ACC-007', nombre: 'Bebedero Fuente Gato', precio: 250, marca: 'PetComfort', image: img('ACC-007'), tipo_animal: ['gato'], material: 'ceramica', colores: ['blanco','gris','verde'], variantes: ['2L'], etiquetas: ['fuente','bebedero','agua fresca'], industria: ['mascotas','hogar'], stock: 35 },
  { producto_id: 'ACC-008', nombre: 'Arnes Pechera Perro Anti-tirones', precio: 210, marca: 'Flexi', image: img('ACC-008'), tipo_animal: ['perro'], material: 'nylon acolchonado', colores: ['negro','azul','rojo'], variantes: ['S','M','L','XL'], etiquetas: ['arnes','pechera','anti-tirones'], industria: ['mascotas','accesorios'], stock: 50 },
  { producto_id: 'ACC-009', nombre: 'Caseta Plegable Perro Viaje', precio: 410, marca: 'PetBag', image: img('ACC-009'), tipo_animal: ['perro'], material: 'poliester+metal', colores: ['gris','verde'], variantes: ['M','L','XL'], etiquetas: ['caseta','viaje','plegable'], industria: ['mascotas','hogar'], stock: 20 },
  { producto_id: 'ACC-010', nombre: 'Cepillo Cuidado Personal', precio: 45, marca: 'PetStyle', image: img('ACC-010'), tipo_animal: ['perro','gato'], material: 'plastico+cerdas metal', colores: ['negro','azul','rosa'], variantes: ['estandar','profesional'], etiquetas: ['cepillo','cuidado','higiene'], industria: ['mascotas','higiene'], stock: 90 },
  { producto_id: 'ACC-011', nombre: 'Cortauñas Mascotas Profesional', precio: 70, marca: 'SafePet', image: img('ACC-011'), tipo_animal: ['perro','gato'], material: 'acero inoxidable', colores: ['plata','negro'], variantes: ['S','M'], etiquetas: ['cortauñas','higiene','profesional'], industria: ['mascotas','higiene'], stock: 75 },
  { producto_id: 'ACC-012', nombre: 'Camara PetCam HD WiFi', precio: 480, marca: 'SafePet', image: img('ACC-012'), tipo_animal: ['perro','gato'], material: 'plastico ABS', colores: ['blanco','negro'], variantes: ['estandar','con golosina'], etiquetas: ['camara','petcam','wifi'], industria: ['mascotas','tecnologia'], stock: 12 },
];
const productosSalud = [
  { producto_id: 'SAL-001', nombre: 'Antiparasitario Pipeta Perro', precio: 85, marca: 'Frontline', image: img('SAL-001'), tipo_animal: ['perro'], tipo_producto: 'antiparasitario', requiere_receta: false, presentacion: ['pipeta 1ml','pipeta 2.5ml','pipeta 4ml'], etiquetas: ['antiparasitario','pulgas','garrapatas'], industria: ['mascotas','salud'], stock: 100 },
  { producto_id: 'SAL-002', nombre: 'Suplemento Articulaciones Perro', precio: 220, marca: 'Cosequin', image: img('SAL-002'), tipo_animal: ['perro'], tipo_producto: 'suplemento', requiere_receta: false, presentacion: ['60 tabletas','120 tabletas'], etiquetas: ['articulaciones','senior','suplemento'], industria: ['mascotas','salud'], stock: 35 },
  { producto_id: 'SAL-003', nombre: 'Shampoo Medicado Piel Sensible', precio: 120, marca: 'Virbac', image: img('SAL-003'), tipo_animal: ['perro','gato'], tipo_producto: 'higiene', requiere_receta: false, presentacion: ['200ml','500ml'], etiquetas: ['shampoo','piel','medicado'], industria: ['mascotas','higiene'], stock: 55 },
  { producto_id: 'SAL-004', nombre: 'Vitaminas Cachorro Multivitaminico', precio: 155, marca: 'Nutri-Vet', image: img('SAL-004'), tipo_animal: ['perro','gato'], tipo_producto: 'suplemento', requiere_receta: false, presentacion: ['30 tabletas','60 tabletas'], etiquetas: ['cachorro','vitaminas','natural'], industria: ['mascotas','salud'], stock: 80 },
  { producto_id: 'SAL-005', nombre: 'Antiparasitario Oral Gato', precio: 95, marca: 'Frontline', image: img('SAL-005'), tipo_animal: ['gato'], tipo_producto: 'antiparasitario', requiere_receta: false, presentacion: ['3 tabletas','6 tabletas'], etiquetas: ['antiparasitario','oral','gato'], industria: ['mascotas','salud'], stock: 90 },
  { producto_id: 'SAL-006', nombre: 'Shampoo Antipulgas Natural', precio: 90, marca: 'Virbac', image: img('SAL-006'), tipo_animal: ['perro','gato'], tipo_producto: 'higiene', requiere_receta: false, presentacion: ['250ml','500ml'], etiquetas: ['antipulgas','natural','shampoo'], industria: ['mascotas','higiene'], stock: 70 },
  { producto_id: 'SAL-007', nombre: 'Spray Cicatrizante Mascotas', precio: 65, marca: 'Virbac', image: img('SAL-007'), tipo_animal: ['perro','gato'], tipo_producto: 'primeros auxilios', requiere_receta: false, presentacion: ['100ml','200ml'], etiquetas: ['cicatrizante','heridas','primeros auxilios'], industria: ['mascotas','salud'], stock: 45 },
  { producto_id: 'SAL-008', nombre: 'Collar Antipulgas Perro', precio: 110, marca: 'Frontline', image: img('SAL-008'), tipo_animal: ['perro'], tipo_producto: 'antiparasitario', requiere_receta: false, presentacion: ['collar 8 meses'], etiquetas: ['antipulgas','collar','larga duracion'], industria: ['mascotas','salud'], stock: 65 },
  { producto_id: 'SAL-009', nombre: 'Pasta Dental Perro Sabor Pollo', precio: 55, marca: 'Nutri-Vet', image: img('SAL-009'), tipo_animal: ['perro'], tipo_producto: 'higiene dental', requiere_receta: false, presentacion: ['100g','200g'], etiquetas: ['dental','pasta','higiene'], industria: ['mascotas','higiene'], stock: 85 },
  { producto_id: 'SAL-010', nombre: 'Gotas Oculares Mascotas', precio: 80, marca: 'Virbac', image: img('SAL-010'), tipo_animal: ['perro','gato'], tipo_producto: 'cuidado ocular', requiere_receta: false, presentacion: ['10ml','20ml'], etiquetas: ['ojos','gotas','cuidado'], industria: ['mascotas','salud'], stock: 40 },
  { producto_id: 'SAL-011', nombre: 'Relajante Natural Gato Viaje', precio: 70, marca: 'Nutri-Vet', image: img('SAL-011'), tipo_animal: ['gato'], tipo_producto: 'suplemento', requiere_receta: false, presentacion: ['30 dosis','60 dosis'], etiquetas: ['relajante','viaje','natural'], industria: ['mascotas','salud'], stock: 55 },
  { producto_id: 'SAL-012', nombre: 'Protector Solar Mascotas SPF50', precio: 100, marca: 'Nutri-Vet', image: img('SAL-012'), tipo_animal: ['perro','gato'], tipo_producto: 'proteccion solar', requiere_receta: false, presentacion: ['150ml','250ml'], etiquetas: ['solar','proteccion','playa'], industria: ['mascotas','salud'], stock: 35 },
];

const seed = async () => {
  const count = await Promise.all([
    Comida.countDocuments(), Ropa.countDocuments(), Juguetes.countDocuments(),
    Accesorios.countDocuments(), Salud.countDocuments()
  ]);
  if (count.some((c) => c === 0)) {
    await Promise.all([
      Comida.deleteMany({}), Ropa.deleteMany({}), Juguetes.deleteMany({}),
      Accesorios.deleteMany({}), Salud.deleteMany({})
    ]);
    await Promise.all([
      Comida.insertMany(productosComida), Ropa.insertMany(productosRopa),
      Juguetes.insertMany(productosJuguetes), Accesorios.insertMany(productosAccesorios),
      Salud.insertMany(productosSalud)
    ]);
    console.log(`Seed: ${productosComida.length + productosRopa.length + productosJuguetes.length + productosAccesorios.length + productosSalud.length} productos insertados`);
  }
};

const connectMongo = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patitas_catalog';
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  });
  console.log('MongoDB conectado');
  await seed();
};

mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

export default connectMongo;