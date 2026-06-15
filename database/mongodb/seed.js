import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '../../server/.env' });

await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patitas_catalog');

const img = (id) => ({
  'COM-001': 'https://ss345.liverpool.com.mx/xl/1056366039.jpg',
  'COM-002': 'https://cdn.eddress.co/market-products/merchants/7wg0D5ChQU-pXxzCDmVhkA/69a5fb126850433c84d3e88d--5vTg5doR3S2DpsB9SuQxQ-Ev8ikHshQ9mvlqNMZ7pE9g.png?v=1772485443439',
  'COM-003': 'https://patitasco.com/6588-large_default/milo-y-lola-snacks-dentales-para-perro.jpg',
  'COM-004': 'https://www.purina.com.bo/sites/default/files/styles/webp/public/2022-09/LONGEVIDAD%20ADULTOS%207%2B-dog-chow-frente.jpeg.webp?itok=GOjFfF68',
  'COM-005': 'https://imgs.search.brave.com/7sOl0hph38cNyCF2lbD3xAsO3YFdLa-z8EHQRoK3jLI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NDFDaXA2RklxTEwu/anBn',
  'COM-006': 'https://www.purina.es/sites/default/files/styles/product_380x380/public/2026-06/ddef3528-fed3-4d46-be9c-e97c7ecbdd51.jpeg.webp?itok=4dnvFQqf',
  'COM-007': 'https://www.casaluna.com.mx/cdn/shop/files/1200ftw-104875.jpg?v=1764804660&width=990',
  'COM-008': 'https://cdn.shopify.com/s/files/1/0409/1196/2266/products/Cuellosdepollo100gr.png?v=1682119828',
  'COM-009': 'https://pxmshare.colgatepalmolive.com/PNG_2000/XtwHccspcOr_wysOLtAps.png',
  'COM-010': 'https://www.purina.com.bo/sites/default/files/styles/webp/public/2022-10/ProPlan-Adulto-Razas-Grandes-01.png.webp?itok=i4zbHXeV',
  'COM-011': 'https://irp.cdn-website.com/3ead19e6/dms3rep/multi/GALLETAS.jpg',
  'COM-012': 'https://d34xtejqjqcp3x.cloudfront.net/store/617a6e5af02c9b581068dcab65f3f3e5.png',
  'COM-013': 'https://podium.com.bo/cdn/shop/files/23KG-CACHORRO-R.-PEQUENA.png?v=1760707792&width=1050',
  'COM-014': 'https://patitasco.com/12775-large_default/catit-creamy-snacks-cremosos-de-salmon-y-gambas-4-tubos-para-gatos.webp',
  'COM-015': 'https://cordoba.pluspet.com.ar/cdn/shop/files/alimento-kenl-perro-adulto-light-bajas-calorias-01.jpg?v=1746461216&width=1080',
  'ROP-001': 'https://m.media-amazon.com/images/I/7176ZRdpSYL._AC_SX679_.jpg',
  'ROP-002': 'https://m.media-amazon.com/images/I/71q5QmqdYML._AC_SX679_.jpg',
  'ROP-003': 'https://acdn-us.mitiendanube.com/stores/575/267/products/chatgpt-image-23-may-2025-14_02_47-bfd0033504eeaded5617480201346783-1024-1024.webp',
  'ROP-004': 'https://m.media-amazon.com/images/I/81W7vxMC2iL.jpg',
  'ROP-005': 'https://candypet.es/cdn/shop/files/Arnes_Antitirones_Reflectante_en_Forma_Y_-_-_-5487419.jpg?v=1731597253',
  'ROP-006': 'https://image.made-in-china.com/365f3j00UDIVKsNqnipW/Su-ter-para-mascotas-de-punto-trenzado-de-color-s-lido-aspecto-elegante.webp',
  'ROP-007': 'https://www.tiendanimal.es/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dw1f605120/images/chaleco_salvavidas_perro_tkpet_naranja_TKP40874_00.jpg',
  'ROP-008': 'https://i5.walmartimages.com/asr/aae7c3f8-5e1c-4315-881f-4995aad30d38.4c0e1a514d2158ff3b38ed79f1a6f2f8.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
  'ROP-009': 'https://www.disfracesjarana.com/cdn/shop/files/disfraz-princesa-rosa-para-perro.jpg?v=1718797104&width=800',
  'ROP-010': 'https://m.media-amazon.com/images/I/71ybrBcD3sL._AC_UF350,350_QL80_.jpg',
  'ROP-011': 'https://http2.mlstatic.com/D_NQ_NP_917246-CBT96916167974_112025-O.webp',
  'ROP-012': 'https://i5.walmartimages.com/asr/fed5d102-1065-4d25-877c-1e3a396379fd.3fd8ba9490d5484d8704ae6161439658.jpeg?odnHeight=612&odnWidth=612&odnBg=FFFFFF',
  'JUG-001': 'https://de2kqc9pq55cj.cloudfront.net/fit-in/700x700/filters:fill(FFFFFF):quality(90):format(webp)/_img_productos/pelota-interactiva-loi-g-073-gris-16551-foto1.jpg',
  'JUG-002': 'https://m.media-amazon.com/images/I/81We9qHdqPL._AC_SX679_.jpg',
  'JUG-003': 'https://cdn0.expertoanimal.com/es/posts/5/5/2/como_funciona_el_kong_para_perros_20255_600.jpg',
  'JUG-004': 'https://www.tiendanimal.es/dw/image/v2/BDLQ_PRD/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dwdba6169e/images/large/43e3e4f5d4de4811ba942634bbecde4f.jpg?sw=780&sh=780&sm=fit&q=85',
  'JUG-005': 'https://http2.mlstatic.com/D_NQ_NP_952233-MLA106796107174_022026-O.webp',
  'JUG-006': 'https://image.made-in-china.com/202f0j00RfcbvNEWCqrA/Customized-Round-Dog-Pet-Training-Toys-Rubber-Flying-Disc-Bite-Resistant-Frisbeed-for-Training-Dogs.webp',
  'JUG-007': 'https://m.media-amazon.com/images/I/81We9qHdqPL._AC_SX679_.jpg',
  'JUG-008': 'https://dcdn-us.mitiendanube.com/stores/005/967/463/products/d_nq_np_942903-mla87509212543_072025-f-3ef4fe26538c13d80e17523475673187-480-0.webp',
  'JUG-009': 'https://http2.mlstatic.com/D_Q_NP_2X_823113-MLA110641893944_052026-P.webp',
  'JUG-010': 'https://cdn0.expertoanimal.com/es/posts/5/5/2/como_funciona_el_kong_para_perros_20255_600.jpg',
  'JUG-011': 'https://de2kqc9pq55cj.cloudfront.net/fit-in/700x700/filters:fill(FFFFFF):quality(90):format(webp)/_img_productos/pelota-interactiva-loi-g-073-gris-16551-foto1.jpg',
  'JUG-012': 'https://m.media-amazon.com/images/I/81We9qHdqPL._AC_SX679_.jpg',
  'ACC-001': 'https://ae01.alicdn.com/kf/Sa919a941119b41fda1b6b9eb00c85d84H.jpg',
  'ACC-002': 'https://cdn.billowshop.com/0bd0313a-ccf0-5fc3/img/Producto/d7a86b57-46ca-ba90-d788-9980aef5e5f1/8445-2-66c71e3adc675-O.jpg',
  'ACC-003': 'https://petformed.com/es/wp-content/uploads/sites/7/2024/04/Legowisko-Petformed-Niebieskie-2.jpg',
  'ACC-004': 'https://pethome.cl/imagenes/productos/mochila-transporte-astronauta-color-rojo.webp',
  'ACC-005': 'https://image.made-in-china.com/202f0j00gMbknplqlmcH/Personalized-Custom-Steel-Pet-Dog-Tags-Engraving-Anti-Lost-Dog-Cat-Nameplate-Collars-Bone-Shape-Dog-Tag.webp',
  'ACC-006': 'https://mundomascotas.com.ar/wp-content/uploads/2022/06/61tRU1J6okL._AC_SL1500_.jpg',
  'ACC-007': 'https://m.media-amazon.com/images/I/71eixSVUruL._AC_UF1000,1000_QL80_.jpg',
  'ACC-008': 'https://imagenes.elpais.com/resizer/v2/EVL3O2VMMFG5VGSRWPMH5HAZOM.png?auth=2585570b888f088b5bfcaa82f0145cd56e80eeeded7241bc7c19f4eb118f949c&width=1960',
  'ACC-009': 'https://www.latiendadefrida.com/cdn/shop/products/4_b5b06cf2-3cfe-4890-ba16-c0aff8bd173a_2048x2048.jpg?v=1673454793',
  'ACC-010': 'https://http2.mlstatic.com/D_NQ_NP_768874-MLM76208093292_052024-O-2-es-1-cepillo-para-perro-gato-estetica-y-cuidados-mascotas.webp',
  'ACC-011': 'https://m.media-amazon.com/images/I/71870m49h3L._AC_UF1000,1000_QL80_.jpg',
  'ACC-012': 'https://todovigilancia.com/wp-content/uploads/2025/09/camara-de-seguridad-para-mascotas.jpg',
  'SAL-001': 'https://postgradoveterinaria.com/wp-content/uploads/pipetas-para-perros.jpg',
  'SAL-002': 'https://www.tiendanimal.es/dw/image/v2/BDLQ_PRD/on/demandware.static/-/Sites-kiwoko-master-catalog/default/dwfc4bcb3c/images/large/0fe8bdfcac6e4ffb8b6810cfbf9da441.jpg?sw=780&sh=780&sm=fit&q=85',
  'SAL-003': 'https://m.media-amazon.com/images/I/81C89UmtLoL._AC_UF1000,1000_QL80_.jpg',
  'SAL-004': 'https://m.media-amazon.com/images/I/61iUWfX+HyL.jpg',
  'SAL-005': 'https://cdn.eddress.co/market-products/merchants/7wg0D5ChQU-pXxzCDmVhkA/6946a6a5d87d082b0f5cb79a-4pPKHQnXSNKA5r3DObQiaQ-OxN63xtVRxizUoO5nDrBZg.png?v=1767026304823',
  'SAL-006': 'https://ferreteriavidri.com/images/items/large/96078.jpg',
  'SAL-007': 'https://m.media-amazon.com/images/I/81NMIC94-vL._AC_UF1000,1000_QL80_.jpg',
  'SAL-008': 'https://http2.mlstatic.com/D_Q_NP_2X_825940-MLA108189570587_032026-P.webp',
  'SAL-009': 'https://http2.mlstatic.com/D_NQ_NP_930564-MLA98391711331_112025-O.webp',
  'SAL-010': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZEwnXJtCUusTQpEUD6F_B0Vk2XnX-IJrdNw&s',
  'SAL-011': 'https://m.media-amazon.com/images/I/81IdE1xdGvL._AC_UF1000,1000_QL80_.jpg',
  'SAL-012': 'https://www.bpets.cl/cdn/shop/files/Bloqueador-Solar-Mascotas-Men-For-San-60-ML_2048x2048.jpg?v=1769034556',
})[id] || 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop';

const comidaSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'comida' }, precio: Number, marca: String, image: String, tipo_animal: [String], peso_kg: Number, sabores: [String], etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });
const ropaSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'ropa' }, precio: Number, marca: String, image: String, tipo_animal: [String], tallas: [String], colores: [String], material: String, etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });
const juguetesSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'juguetes' }, precio: Number, marca: String, image: String, tipo_animal: [String], material: String, edad_minima_meses: Number, interactivo: Boolean, variantes: [String], etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });
const accesoriosSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'accesorios' }, precio: Number, marca: String, image: String, tipo_animal: [String], material: String, colores: [String], variantes: [String], etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });
const saludSchema = new mongoose.Schema({ producto_id: String, nombre: String, categoria: { type: String, default: 'salud' }, precio: Number, marca: String, image: String, tipo_animal: [String], tipo_producto: String, requiere_receta: Boolean, presentacion: [String], etiquetas: [String], industria: [String], stock: Number, activo: { type: Boolean, default: true } });

const Comida = mongoose.model('Comida', comidaSchema, 'productos_comida');
const Ropa = mongoose.model('Ropa', ropaSchema, 'productos_ropa');
const Juguetes = mongoose.model('Juguetes', juguetesSchema, 'productos_juguetes');
const Accesorios = mongoose.model('Accesorios', accesoriosSchema, 'productos_accesorios');
const Salud = mongoose.model('Salud', saludSchema, 'productos_salud');

const comida = [
  { producto_id: 'COM-001', nombre: 'Croquetas Premium Pollo', precio: 180, marca: 'Purina Pro Plan', image: img('COM-001'), tipo_animal: ['perro'], peso_kg: 3, sabores: ['pollo','arroz'], etiquetas: ['premium','adulto','seco'], industria: ['mascotas','nutricion'], stock: 80 },
  { producto_id: 'COM-002', nombre: 'Alimento Humedo Atun Gato', precio: 45, marca: 'Whiskas', image: img('COM-002'), tipo_animal: ['gato'], peso_kg: 0.4, sabores: ['atun','salmon'], etiquetas: ['humedo','natural'], industria: ['mascotas','nutricion'], stock: 150 },
  { producto_id: 'COM-003', nombre: 'Snacks Dentales Perro', precio: 95, marca: 'Pedigree', image: img('COM-003'), tipo_animal: ['perro'], peso_kg: 0.5, sabores: ['menta','pollo'], etiquetas: ['dental','premio','snack'], industria: ['mascotas','salud'], stock: 120 },
  { producto_id: 'COM-004', nombre: 'Alimento Senior Perro 7+', precio: 210, marca: 'Royal Canin', image: img('COM-004'), tipo_animal: ['perro'], peso_kg: 2, sabores: ['pollo','arroz integral'], etiquetas: ['senior','premium','digestivo'], industria: ['mascotas','nutricion'], stock: 45 },
  { producto_id: 'COM-005', nombre: 'Alimento Natural Sin Granos', precio: 250, marca: 'Acana', image: img('COM-005'), tipo_animal: ['perro'], peso_kg: 2.5, sabores: ['salmon','batata'], etiquetas: ['natural','sin granos','premium'], industria: ['mascotas','nutricion'], stock: 35 },
  { producto_id: 'COM-006', nombre: 'Comida Humeda Gato Salmon', precio: 55, marca: 'Purina Gourmet', image: img('COM-006'), tipo_animal: ['gato'], peso_kg: 0.4, sabores: ['salmon','camaron'], etiquetas: ['humedo','premium','gato'], industria: ['mascotas','nutricion'], stock: 120 },
  { producto_id: 'COM-007', nombre: 'Alimento Cachorro Raza Pequena', precio: 195, marca: 'Royal Canin', image: img('COM-007'), tipo_animal: ['perro'], peso_kg: 1.5, sabores: ['pollo'], etiquetas: ['cachorro','premium'], industria: ['mascotas','nutricion'], stock: 60 },
  { producto_id: 'COM-008', nombre: 'Snack Natural Pollo Deshidratado', precio: 65, marca: 'Purina Pro Plan', image: img('COM-008'), tipo_animal: ['perro','gato'], peso_kg: 0.2, sabores: ['pollo'], etiquetas: ['natural','premio','snack'], industria: ['mascotas','salud'], stock: 200 },
  { producto_id: 'COM-009', nombre: 'Croquetas Gato Esterilizado', precio: 170, marca: "Hill's Science", image: img('COM-009'), tipo_animal: ['gato'], peso_kg: 1.5, sabores: ['pollo','arroz'], etiquetas: ['esterilizado','adulto','premium'], industria: ['mascotas','nutricion'], stock: 70 },
  { producto_id: 'COM-010', nombre: 'Alimento Perro Raza Grande', precio: 230, marca: 'Eukanuba', image: img('COM-010'), tipo_animal: ['perro'], peso_kg: 4, sabores: ['pollo','cebada'], etiquetas: ['raza grande','adulto','premium'], industria: ['mascotas','nutricion'], stock: 40 },
  { producto_id: 'COM-011', nombre: 'Galletas Entrenamiento Perro', precio: 35, marca: 'Pedigree', image: img('COM-011'), tipo_animal: ['perro'], peso_kg: 0.3, sabores: ['higado','pollo'], etiquetas: ['premio','entrenamiento','snack'], industria: ['mascotas','nutricion'], stock: 300 },
  { producto_id: 'COM-012', nombre: 'Alimento Humedo Gato Pato', precio: 60, marca: 'Purina Gourmet', image: img('COM-012'), tipo_animal: ['gato'], peso_kg: 0.4, sabores: ['pato','pavo'], etiquetas: ['humedo','premium','gato'], industria: ['mascotas','nutricion'], stock: 100 },
  { producto_id: 'COM-013', nombre: 'Comida Perro Cachorro 0-12m', precio: 200, marca: 'Royal Canin', image: img('COM-013'), tipo_animal: ['perro'], peso_kg: 2, sabores: ['pollo'], etiquetas: ['cachorro','starter','premium'], industria: ['mascotas','nutricion'], stock: 55 },
  { producto_id: 'COM-014', nombre: 'Snack Suave Gato Adulto', precio: 40, marca: 'Whiskas', image: img('COM-014'), tipo_animal: ['gato'], peso_kg: 0.1, sabores: ['atun','queso'], etiquetas: ['snack','suave','premio'], industria: ['mascotas','nutricion'], stock: 250 },
  { producto_id: 'COM-015', nombre: 'Alimento Perro Light Bajo Calorias', precio: 215, marca: "Hill's Science", image: img('COM-015'), tipo_animal: ['perro'], peso_kg: 2, sabores: ['pollo','arroz'], etiquetas: ['light','bajo calorias','control peso'], industria: ['mascotas','nutricion'], stock: 30 },
];

const ropa = [
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

const juguetes = [
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

const accesorios = [
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
  { producto_id: 'ACC-011', nombre: 'Cortaunas Mascotas Profesional', precio: 70, marca: 'SafePet', image: img('ACC-011'), tipo_animal: ['perro','gato'], material: 'acero inoxidable', colores: ['plata','negro'], variantes: ['S','M'], etiquetas: ['cortaunas','higiene','profesional'], industria: ['mascotas','higiene'], stock: 75 },
  { producto_id: 'ACC-012', nombre: 'Camara PetCam HD WiFi', precio: 480, marca: 'SafePet', image: img('ACC-012'), tipo_animal: ['perro','gato'], material: 'plastico ABS', colores: ['blanco','negro'], variantes: ['estandar','con golosina'], etiquetas: ['camara','petcam','wifi'], industria: ['mascotas','tecnologia'], stock: 12 },
];

const salud = [
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

await Promise.all([
  Comida.deleteMany({}), Ropa.deleteMany({}), Juguetes.deleteMany({}),
  Accesorios.deleteMany({}), Salud.deleteMany({})
]);
await Promise.all([
  Comida.insertMany(comida), Ropa.insertMany(ropa), Juguetes.insertMany(juguetes),
  Accesorios.insertMany(accesorios), Salud.insertMany(salud)
]);
console.log(`Seed completado: ${comida.length + ropa.length + juguetes.length + accesorios.length + salud.length} productos`);
await mongoose.disconnect();