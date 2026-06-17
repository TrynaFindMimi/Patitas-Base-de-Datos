# Patitas — Documento de Requisitos para IA

> E-commerce multitienda de mascotas (Bolivia). Stack: React 19 + Vite 8 + Tailwind 4 (frontend) / Node.js + Express (backend) / PostgreSQL 16 + MongoDB 7.

---

## 1. ARQUITECTURA GENERAL

### 1.1 Persistencia Políglota
| Base de Datos | Uso |
|---|---|
| **PostgreSQL 16** | Datos transaccionales: clientes, direcciones, métodos de pago, pedidos, detalle_pedido, facturas, pagos, departamentos |
| **MongoDB 7** | Catálogo de productos (5 colecciones), carritos de compra, preferencias de usuario |

### 1.2 Conexión entre DBs
- `cliente_id` (UUID de PostgreSQL) se usa como `cliente_uuid` en MongoDB
- `producto_mongo_id` en `detalle_pedido` (PG) referencia el `producto_id` de MongoDB

### 1.3 Dependencias npm

**Server** (`server/package.json`):
| Paquete | Versión | Uso |
|---|---|---|
| `express` | ^4.18.0 | Framework HTTP |
| `mongoose` | ^8.0.0 | ODM MongoDB |
| `pg` | ^8.11.0 | Cliente PostgreSQL |
| `jsonwebtoken` | ^9.0.3 | JWT auth |
| `bcryptjs` | ^2.4.3 | Hashing de passwords |
| `express-validator` | ^7.0.0 | Validación de requests |
| `helmet` | ^7.0.0 | Seguridad HTTP |
| `cors` | ^2.8.5 | CORS |
| `dotenv` | ^16.0.0 | Variables de entorno |
| `uuid` | ^9.0.0 | Generación de UUIDs |
| `nodemon` (dev) | ^3.0.0 | Recarga automática en desarrollo |

**Client** (`client/package.json`):
| Paquete | Versión | Uso |
|---|---|---|
| `react` | ^19.2.6 | UI library |
| `react-dom` | ^19.2.6 | Renderizado DOM |
| `react-router-dom` | ^7.17.0 | Enrutamiento SPA |
| `jspdf` | ^4.2.1 | Generación de PDF facturas |
| `vite` (dev) | ^8.0.12 | Build tool / dev server |
| `tailwindcss` (dev) | ^4.3.0 | CSS utility framework |
| `@tailwindcss/vite` (dev) | ^4.3.0 | Plugin Tailwind para Vite |
| `@vitejs/plugin-react` (dev) | ^6.0.1 | Plugin React para Vite |
| `eslint` (dev) | ^10.3.0 | Linter |

### 1.4 Variables de Entorno

**Server** (`.env`):
```
PORT=3001
CLIENT_URL=http://localhost:5173
PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=tu_password
PG_DATABASE=patitas_db
MONGO_URI=mongodb://127.0.0.1:27017/patitas_catalog
JWT_SECRET=tu_jwt_secret_largo
APP_ENCRYPTION_KEY=tu_clave_de_encriptacion
```

**Client** (`.env`):
```
VITE_API_URL=http://localhost:3001/api
```

Requeridas (validadas al iniciar servidor): `PG_HOST`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE`, `JWT_SECRET`.

---

## 2. BASE DE DATOS POSTGRESQL

### 2.1 Tablas

**clientes**
| Columna | Tipo | Detalle |
|---|---|---|
| `cliente_id` | UUID PK | `uuid_generate_v4()` |
| `nombre` | VARCHAR(100) | NOT NULL |
| `apellido` | VARCHAR(100) | NOT NULL |
| `email` | VARCHAR(150) | UNIQUE, NOT NULL |
| `password_hash` | VARCHAR(255) | bcrypt hash |
| `rol` | VARCHAR(20) | DEFAULT 'cliente' — valores: `cliente`, `admin`, `owner` |
| `telefono` | VARCHAR(20) | nullable |
| `fecha_registro` | TIMESTAMPTZ | DEFAULT NOW() |
| `activo` | BOOLEAN | DEFAULT TRUE |

**direcciones**
| Columna | Tipo | Detalle |
|---|---|---|
| `direccion_id` | SERIAL PK | |
| `cliente_id` | UUID FK | → clientes(cliente_id) ON DELETE CASCADE |
| `calle` | VARCHAR(200) | NOT NULL |
| `ciudad` | VARCHAR(100) | NOT NULL |
| `estado` | VARCHAR(100) | NOT NULL |
| `codigo_postal` | VARCHAR(20) | NOT NULL |
| `es_principal` | BOOLEAN | DEFAULT FALSE |

**metodos_pago**
| Columna | Tipo | Detalle |
|---|---|---|
| `metodo_id` | SERIAL PK | |
| `cliente_id` | UUID FK | → clientes |
| `tipo` | VARCHAR(20) | CHECK IN ('credito','debito','qr') |
| `ultimos_4_digitos` | VARCHAR(4) | |
| `numero_encriptado` | BYTEA | cifrado con `pgp_sym_encrypt()` |
| `fecha_expiracion` | VARCHAR(7) | |
| `es_principal` | BOOLEAN | DEFAULT FALSE |

**departamentos** (datos seed de Bolivia)
| Columna | Tipo | Detalle |
|---|---|---|
| `departamento_id` | SERIAL PK | |
| `nombre` | VARCHAR(50) | UNIQUE |
| `costo_envio` | NUMERIC(10,2) | ej: La Paz 15, Oruro 20, Santa Cruz 25... |
| `tipo_envio_oferta` | VARCHAR(20) | CHECK 'domicilio' o 'paqueteria' |
| `envio_gratis_desde` | NUMERIC(10,2) | DEFAULT 99999 (envío gratis si subtotal >= este valor) |

Datos semilla: La Paz (15, domicilio, 500), Oruro (20, domicilio, 500), Santa Cruz (25, domicilio, 500), Cochabamba (30, paqueteria, 500), Chuquisaca (35, paqueteria, 500), Tarija (35, paqueteria, 500), Potosí (40, paqueteria, 500), Beni (45, paqueteria, 500), Pando (50, paqueteria, 500).

**pedidos**
| Columna | Tipo | Detalle |
|---|---|---|
| `pedido_id` | UUID PK | |
| `cliente_id` | UUID FK | → clientes |
| `direccion_id` | INT FK | → direcciones |
| `departamento` | VARCHAR(50) | DEFAULT 'La Paz' |
| `tipo_envio` | VARCHAR(20) | CHECK 'domicilio' o 'paqueteria' |
| `estado` | VARCHAR(20) | CHECK: pendiente, procesando, enviado, entregado, cancelado |
| `subtotal` | NUMERIC(10,2) | |
| `costo_envio` | NUMERIC(10,2) | |
| `total` | NUMERIC(10,2) | |
| `creado_en` | TIMESTAMPTZ | |
| `actualizado_en` | TIMESTAMPTZ | |

**detalle_pedido**
| Columna | Tipo | Detalle |
|---|---|---|
| `detalle_id` | SERIAL PK | |
| `pedido_id` | UUID FK | ON DELETE CASCADE |
| `producto_mongo_id` | VARCHAR(24) | NOT NULL (referencia MongoDB) |
| `nombre_producto` | VARCHAR(200) | |
| `cantidad` | INT | CHECK > 0 |
| `precio_unitario` | NUMERIC(10,2) | |
| `subtotal` | NUMERIC(10,2) | GENERATED ALWAYS AS (cantidad * precio_unitario) |

**facturas**
| Columna | Tipo | Detalle |
|---|---|---|
| `factura_id` | UUID PK | |
| `pedido_id` | UUID FK | UNIQUE (1:1) |
| `cliente_id` | UUID FK | |
| `numero_factura` | VARCHAR(30) | UNIQUE, formato: FAC-YYYYMMDD-XXXXXXXX |
| `total` | NUMERIC(10,2) | |
| `emitida_en` | TIMESTAMPTZ | |
| `estado` | VARCHAR(20) | CHECK: emitida, pagada, anulada |

**pagos**
| Columna | Tipo | Detalle |
|---|---|---|
| `pago_id` | UUID PK | |
| `factura_id` | UUID FK | |
| `metodo_id` | INT FK | nullable (para QR) |
| `monto` | NUMERIC(10,2) | |
| `estado` | VARCHAR(20) | CHECK: pendiente, completado, fallido, reembolsado |
| `procesado_en` | TIMESTAMPTZ | |

### 2.2 Stored Procedures

**`fn_registrar_pedido(p_cliente_id, p_direccion_id, p_departamento, p_tipo_envio, p_items JSONB)` → UUID**
- Inserta pedido, itera items JSONB, calcula subtotal + envío (gratis si subtotal >= `envio_gratis_desde`), actualiza total.
- Usada como alternativa a la lógica inline en el controlador.

**`fn_procesar_pago(p_pedido_id, p_tipo_pago, p_metodo_id)` → UUID**
- Genera factura (número: FAC-YYYYMMDD-XXXXXXXX).
- Si `tipo_pago = 'qr'`: factura en estado 'emitida', pago 'pendiente'.
- Si `tipo_pago = 'tarjeta'`: factura 'pagada', pago 'completado', pedido → 'procesando'.

**`fn_cifrar_tarjeta(p_numero VARCHAR)` → BYTEA**
- `pgp_sym_encrypt(p_numero, current_setting('app.encryption_key'))`

**`fn_descifrar_tarjeta(p_encriptado BYTEA)` → VARCHAR**
- `pgp_sym_decrypt(p_encriptado, current_setting('app.encryption_key'))`

### 2.3 Vistas Analíticas

| View | Propósito |
|---|---|
| `v_pedidos_detalle` | Pedidos + cliente + dirección + total_items |
| `v_resumen_ventas` | Agregación mensual: pedidos, clientes únicos, ingresos, ticket promedio |
| `v_clientes_activos` | Clientes con total pedidos, gasto total, último pedido |
| `v_productos_mas_vendidos` | Productos por unidades vendidas e ingresos |
| `v_clientes_frecuentes` | Clientes con >2 pedidos y gasto > promedio |

### 2.4 Índices
`idx_pedidos_cliente`, `idx_pedidos_estado`, `idx_detalle_pedido`, `idx_pagos_factura`, `idx_facturas_pedido`

### 2.5 Roles de BD
- `patitas_admin`: acceso completo
- `patitas_cajero`: operaciones de pedidos/pagos
- `patitas_cliente`: solo lectura de datos propios + INSERT pedidos

---

## 3. BASE DE DATOS MONGODB

### 3.1 Colección: `productos_comida` (Schema: Comida)

**Todos los schemas de producto comparten:**
| Campo | Tipo | Requerido |
|---|---|---|
| `producto_id` | String (único) | ✅ |
| `nombre` | String | ✅ |
| `categoria` | String (default según colección) | |
| `precio` | Number (min: 0) | ✅ |
| `marca` | String | ✅ |
| `image` | String (URL) | |
| `descripcion` | String | |
| `tipo_animal` | [String] | |
| `etiquetas` | [String] | |
| `industria` | [String] | |
| `stock` | Number (default: 0) | |
| `activo` | Boolean (default: true) | |
| `creado_en` | Date (default: now) | |

**Comida** adicional: `peso_kg` (Number), `sabores` [String]
**Ropa** adicional: `tallas` [String], `colores` [String], `material` (String)
**Juguetes** adicional: `material` (String), `edad_minima_meses` (Number), `interactivo` (Boolean), `variantes` [String]
**Accesorios** adicional: `material` (String), `colores` [String], `variantes` [String]
**Salud** adicional: `tipo_producto` (String), `requiere_receta` (Boolean), `presentacion` [String]

### 3.2 Colecciones

| Colección | Modelo | Nombre MongoDB |
|---|---|---|
| Comida | `Comida` | `productos_comida` |
| Ropa | `Ropa` | `productos_ropa` |
| Juguetes | `Juguetes` | `productos_juguetes` |
| Accesorios | `Accesorios` | `productos_accesorios` |
| Salud | `Salud` | `productos_salud` |
| Carritos | `Carrito` | `carritos` |
| Preferencias | `Preferencias` | `preferencias` |

### 3.3 Schema: `carritos`
| Campo | Tipo |
|---|---|
| `cliente_uuid` | String (único) = UUID de PostgreSQL |
| `items` | [{ producto_id, nombre, precio, cantidad, categoria }] |
| `actualizado_en` | Date |

### 3.4 Schema: `preferencias`
| Campo | Tipo |
|---|---|
| `cliente_uuid` | String (único) |
| `categorias_favoritas` | [String] |
| `marcas_favoritas` | [String] |
| `rango_precio` | { min, max } |
| `historial_vistos` | [String] |
| `actualizado_en` | Date |

### 3.5 Seed Data
- 60+ productos (15 comida, 12 ropa, 12 juguetes, 12 accesorios, 12 salud)
- Imágenes placeholder: `https://picsum.photos/seed/{producto_id}/400/400`

---

## 4. API REST (BACKEND)

### 4.1 Middleware Global
- `helmet()` — seguridad HTTP
- `cors()` — origen dinámico (permite cualquier origin)
- `express.json()` — parseo JSON
- Middleware de error global: captura errores y responde `{ error: mensaje }`

### 4.2 Autenticación

**Middleware `verificarToken`:**
1. Extrae `Authorization: Bearer <token>`
2. Verifica JWT con `process.env.JWT_SECRET`
3. Consulta PostgreSQL: `SELECT cliente_id, email, rol FROM clientes WHERE cliente_id = $1 AND activo = TRUE`
4. Adjunta `req.usuario` si es válido
5. 401 si token inválido, expirado, o usuario inactivo

**Middleware `requiereRol(...roles)`:**
- Verifica que `req.usuario.rol` esté en los roles permitidos
- 403 si no tiene permisos

### 4.3 Endpoints

#### Health Check
```
GET /api/health
→ { status: 'ok', postgres: true, mongo: true }
```

#### Clientes (Auth)
```
POST /api/clientes/registro
  Body: { nombre, apellido, email, password (min 8 chars) }
  → 201: { cliente: { cliente_id, nombre, email }, token }
  Lógica:
    - bcrypt.hash(password, 12)
    - INSERT en clientes
    - Crea Carrito y Preferencias en MongoDB
    - Si MongoDB falla: ROLLBACK cliente PG, responde 503
    - Genera JWT con { cliente_id }, expira 7 días

POST /api/clientes/login
  Body: { email, password }
  → { cliente, token }
  Lógica:
    - Busca cliente por email WHERE activo = TRUE
    - bcrypt.compare(password, password_hash)
    - Genera JWT

GET /api/clientes/perfil
  Auth: JWT
  → { cliente_id, nombre, apellido, email, fecha_registro, total_pedidos, total_gastado, preferencias }
  Lógica:
    - LEFT JOIN pedidos (excluye cancelados)
    - Busca preferencias en MongoDB

POST /api/clientes/direcciones
  Auth: JWT
  Body: { calle, ciudad, estado, codigo_postal, es_principal? }
  → 201: direccion creada

POST /api/clientes/metodos-pago
  Auth: JWT
  Body: { tipo ('credito'|'debito'), numero_tarjeta (16 dígitos), fecha_expiracion }
  → 201: { metodo_id, tipo, ultimos_4_digitos, fecha_expiracion }
  Lógica:
    - Transacción ACID
    - set_config('app.encryption_key', ...)
    - fn_cifrar_tarjeta() para encriptar número
```

#### Catálogo (público)
```
GET /api/catalogo
  Query: { categoria, marca, precio_min, precio_max, etiqueta, page (default 1), limit (default 12) }
  → Con categoria: { productos[], total, page, pages }
  → Sin categoria: { productos[] } (6 productos de cada categoría)
  Lógica: filtros MongoDB con skip/limit

GET /api/catalogo/buscar?q=
  Query: { q (requerido), precio_min, precio_max }
  → { productos[], query }
  Lógica: regex case-insensitive sobre nombre en todas las colecciones

GET /api/catalogo/:categoria/:id
  → producto
  Categorías válidas: comida, ropa, juguetes, accesorios, salud
```

#### Carrito
```
GET /api/carrito
  Auth: JWT
  → { cliente_uuid, items[], actualizado_en }

PUT /api/carrito
  Auth: JWT
  Body: { items: [{ producto_id, nombre, precio, cantidad, categoria }] }
  → upsert: carrito actualizado

PUT /api/carrito/preferencias
  Auth: JWT
  Body: { categorias_favoritas?, marcas_favoritas?, rango_precio?, historial_vistos? }
  → upsert: preferencias actualizadas
```

#### Pedidos
```
GET /api/pedidos/departamentos
  → [{ departamento_id, nombre, costo_envio, tipo_envio_oferta, envio_gratis_desde }]

GET /api/pedidos
  Auth: JWT
  → [pedidos del usuario] (ordenados por creado_en DESC)

GET /api/pedidos/:id
  Auth: JWT
  → { pedido completo con items (json_agg) }

POST /api/pedidos
  Auth: JWT
  Body: { items[], departamento?, tipo_envio?, direccion_id?, calle?, ciudad?, codigo_postal? }
  → 201: { pedido_id, subtotal, costo_envio, total, departamento, tipo_envio }
  Lógica:
    - Transacción ACID en PostgreSQL
    - Si no hay direccion_id, crea dirección nueva
    - Calcula costo envío según departamento (gratis si subtotal >= envio_gratis_desde)
    - Inserta pedido + detalle_pedido
    - Limpia carrito en MongoDB
    - COMMIT / ROLLBACK

POST /api/pedidos/pago
  Auth: JWT
  Body: { pedido_id (UUID), tipo_pago ('qr'|'tarjeta'), metodo_id? }
  → { factura_id, estado, total }
  Lógica:
    - Transacción ACID
    - Llama fn_procesar_pago()
    - COMMIT / ROLLBACK
```

#### Admin
```
Todos requieren JWT + rol 'owner' o 'admin'

GET /api/admin/productos
  → [{ categoria, productos[] }] — todos los productos de todas las categorías

POST /api/admin/productos/:categoria
  Body: { producto_id, nombre, precio, marca?, image?, descripcion?, tipo_animal?, stock?, activo?, ... }
  → 201: producto creado
  Validaciones: producto_id, nombre, precio requeridos; 409 si producto_id duplicado

PUT /api/admin/productos/:categoria/:id
  Body: { nombre?, precio?, marca?, image?, descripcion?, tipo_animal?, stock?, activo?, etiquetas? }
  → producto actualizado
  Lógica: solo actualiza campos permitidos, stock >= 0

GET /api/admin/pedidos
  → [pedidos con cliente_nombre, cliente_email, items] (ORDER BY creado_en DESC)

PUT /api/admin/pedidos/:id/estado
  Body: { estado ('pendiente'|'procesando'|'enviado'|'entregado'|'cancelado') }
  → { pedido_id, estado, actualizado_en }
```

---

### 4.4 Reglas de Validación (express-validator)

Cada endpoint sensible usa reglas `express-validator` ejecutadas antes del controlador mediante el middleware `validar` (que llama `validationResult()` y responde 422 si hay errores).

| Endpoint | Reglas |
|---|---|
| `POST /api/clientes/registro` | `email` isEmail; `password` isLength({ min: 8 }); `nombre` notEmpty; `apellido` notEmpty |
| `POST /api/clientes/login` | `email` isEmail; `password` notEmpty |
| `POST /api/clientes/direcciones` | `calle` notEmpty; `ciudad` notEmpty; `estado` notEmpty; `codigo_postal` notEmpty |
| `POST /api/clientes/metodos-pago` | `tipo` isIn(['credito','debito']); `numero_tarjeta` isLength({ min: 16, max: 16 }); `fecha_expiracion` notEmpty |
| `PUT /api/carrito` | `items` isArray |
| `POST /api/pedidos` | `departamento` optional isString; `tipo_envio` optional isIn(['domicilio','paqueteria']); `direccion_id` optional isInt; `calle` optional notEmpty; `ciudad` optional notEmpty; `codigo_postal` optional notEmpty; `items` isArray({ min: 1 }) |
| `POST /api/pedidos/pago` | `pedido_id` isUUID; `tipo_pago` optional isIn(['qr','tarjeta']); `metodo_id` optional isInt |

---

## 5. FRONTEND (REACT + VITE + TAILWIND)

### 5.1 Estructura de Rutas

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Landing: hero carrusel, categorías, productos destacados, newsletter |
| `/catalogo` | Catalog | Listado con filtros (categoría, precio, etiquetas) |
| `/producto/:id` | ProductDetail | Detalle + productos relacionados |
| `/carrito` | Cart | Carrito con controles de cantidad |
| `/checkout` | Checkout | Formulario de envío + pago |
| `/novedades` | LatestNews | Novedades y lanzamientos |
| `/promociones` | Promotions | Promociones filtrables por marca/tipo |
| `/contacto` | Contact | Formulario de contacto + info |
| `/login` | Login | Inicio de sesión |
| `/registro` | Register | Registro de usuario |
| `/mis-pedidos` | MyOrders | Historial de pedidos + descarga PDF factura |
| `/admin/stock` | OwnerDashboard | Panel admin: stock, productos, pedidos |

### 5.2 Descripción Detallada de Páginas

**Home** (`Home.jsx`):
- **Estado local**: `currentSlide` (carrusel rotativo), `featured` (productos destacados desde API)
- **Efectos**: `setInterval` 5s para carrusel; `useEffect` inicial que llama a `catalogoService.listar()` para obtener hasta 4 productos destacados de MongoDB
- **Renderiza**: Carrusel hero con 3 imágenes Unsplash + overlay gradiente; parrilla de 6 categorías de animales (`CategoryCard`); sección de productos destacados (`ProductCard`); sección de beneficios (envío, shield, heart, phone); newsletter (solo UI)
- **Fallback**: Si API falla, `featured` queda vacío sin error visible

**Catalog** (`Catalog.jsx`):
- **Estado local**: `productos[]`, `total`, `loading`, `error`, `precioMin`, `precioMax`
- **URLSearchParams**: `categoria` y `etiqueta` como query params (compartibles por URL)
- **Efectos**: `useEffect` que llama a `catalogoService.listar(params)` con cada cambio de filtro; mapea `productos` desde API a formato `ProductCard`
- **Filtros**: categoría (comida, ropa, juguetes, accesorios, salud), etiqueta, rango de precio (min/max)
- **Imágenes**: usa `productImages` del objeto hardcodeado como fallback si API no trae imagen

**ProductDetail** (`ProductDetail.jsx`):
- Toma `id` de URL params, busca coincidencia en datos hardcodeados vs API
- Muestra: imagen ampliada, nombre, precio, rating, descripción, selector de cantidad, botón añadir al carrito
- Productos relacionados: misma categoría

**Cart** (`Cart.jsx`):
- Consume `CartContext`: muestra `items[]`, `subtotal`, `totalItems`
- Controles: incrementar/decrementar cantidad, eliminar item, vaciar carrito
- Enlace a `/checkout` si hay items; mensaje "carrito vacío" si no
- Persiste en localStorage automáticamente vía `useEffect`

**Checkout** (`Checkout.jsx`):
- **Estado local**: `form` (name, email, phone, calle, departamento, tipo_envio, tipo_pago, card data), `submitted`, `loading`, `error`, `orderData`, `departamentos`
- **Efecto inicial**: `pedidoService.departamentos()` desde API; fallback: array hardcodeado con datos default
- **Flujo**:
  1. Selección de departamento (cambia automáticamente tipo de envío: domicilio para LP/Oruro/SC, paquetería para otros)
  2. Cálculo automático de costo de envío (gratis si subtotal >= `envio_gratis_desde`)
  3. Selección de método de pago (QR/transferencia o tarjeta; si tarjeta: número, expiración, CVV)
  4. Submit: verifica token JWT → `pedidoService.crear()` con items formateados → si ok, `pedidoService.pagar()` → muestra resumen con pedido_id y botón descargar PDF
- **Manejo de errores**: muestra `error` string; token expirado redirige a login

**MyOrders** (`MyOrders.jsx`):
- **Estado local**: `pedidos[]`, `loading`, `downloading` (id del pedido descargándose)
- **Guarda**: si no hay `usuario`, muestra pantalla de "inicia sesión"
- **Efecto**: `pedidoService.listar()` cuando `usuario` cambia
- **Renderiza**: tabla de pedidos con estado (coloreado), total, fecha; acciones: ver detalle y descargar PDF
- **Descarga PDF**: `handleDownload()` → `pedidoService.detalle(id)` → `generateInvoicePDF()` → `doc.save()`

**OwnerDashboard** (`OwnerDashboard.jsx`):
- **Estado local**: `tab` ('stock' | 'add' | 'orders')
- **Guarda**: si rol != 'owner'/'admin', muestra pantalla "Acceso restringido"
- **Tabs**:
  - **Stock** (`tab='stock'`): `adminService.listar()` → muestra todas las categorías con productos; toggle activo/inactivo; editar stock in-place
  - **Nuevo Producto** (`tab='add'`): formulario con campos dinámicos según categoría; llama `adminService.crearProducto(categoria, data)`
  - **Pedidos** (`tab='orders'`): `adminService.pedidos()` → tabla con cliente, items, total, estado; dropdown para cambiar estado vía `adminService.actualizarEstado(id, estado)`

**Login / Register**:
- Formularios con validación básica (email formato, password >= 8 chars)
- Llaman a `authService.login()` / `authService.register()`
- En éxito: almacenan token y usuario en localStorage, redirigen a Home
- En error: muestran mensaje de error

**LatestNews / Promotions / Contact**:
- `LatestNews`: renderiza datos de `latestNews` desde products.js, tarjetas con fecha y productos relacionados
- `Promotions`: filtra `promotions` por brand/type, muestra `PromoCard` con descuento y fecha límite
- `Contact`: formulario de contacto (solo UI, sin endpoint), mapa/business info

### 5.2 Componentes Compartidos

| Componente | Props | Descripción |
|---|---|---|
| `Navbar` | — | Nav superior responsive: logo, enlaces, carrito badge, menú usuario (login/logout/admin link segun rol), menú hamburguesa mobile |
| `Footer` | — | Links, redes sociales, contacto, ubicación |
| `ProductCard` | `{ product }` | Card: imagen, rating, nombre, precio, botón añadir al carrito |
| `CategoryCard` | `{ category }` | Card de categoría de animal (perros, gatos, aves, reptiles, roedores, peces) |
| `PromoCard` | `{ promo }` | Card de promoción con badge descuento y timer |
| `Icons` | — | 25+ SVG icons: Home, Grid, Bell, Tag, Phone, Mail, MapPin, Clock, Check, Search, Close, Truck, Shield, Heart, Minus, Plus, Paw, Cat, Bird, Reptile, Package, FileText, User, ShoppingBag, Save, AlertCircle |

### 5.3 Contextos

**AuthContext** (`AuthContext.jsx`):
- Estado: `usuario` (desde localStorage `patitas_user`), `cargando`
- Funciones: `login(email, password)`, `register(datos)`, `logout()`
- Persistencia: `localStorage` (claves `patitas_token` y `patitas_user`)

**CartContext** (`CartContext.jsx`):
- Estado: `items[]` con `useReducer`
- Reducer actions: `ADD_ITEM`, `REMOVE_ITEM`, `UPDATE_QUANTITY`, `CLEAR_CART`
- Computados: `totalItems`, `subtotal`
- Persistencia: localStorage (`patitas-cart`)
- Lógica: producto duplicado → incrementa cantidad en vez de duplicar

### 5.4 Servicios (API Client)

**api.js**: Cliente HTTP base con fetch
- Inyecta `Content-Type: application/json` y `Authorization: Bearer <token>` automáticamente
- Base URL: `VITE_API_URL` (default `http://localhost:3001/api`)
- `api.get()`, `api.post()`, `api.put()`, `api.delete()`
- Manejo de errores: lanza Error con `data.error`

**auth.js**: `login()`, `register()`, `perfil()`, `logout()`

**catalogo.js**:
- `catalogoService.listar(params)`, `.buscar(q, extra)`, `.producto(categoria, id)`
- `carritoService.obtener()`, `.actualizar(items)`, `.preferencias(prefs)`
- `pedidoService.departamentos()`, `.crear(datos)`, `.pagar(datos)`, `.listar()`, `.detalle(id)`
- `adminService.listar()`, `.crearProducto(categoria, datos)`, `.actualizarProducto(categoria, id, datos)`, `.pedidos()`, `.actualizarEstado(id, estado)`

### 5.5 Utilidades

**invoice.js** — Generador de PDF (jsPDF):
- Formato: A4
- Contenido: encabezado Patitas, datos del cliente, tabla detallada de productos (cantidad, precio unitario, subtotal), totales (subtotal, envío, total), footer
- Colores: primario `rgb(108,78,209)`, fondo oscuro `rgb(26,26,46)`

### 5.6 Datos Hardcodeados (Frontend)

`client/src/data/products.js`:
- 40+ productos estáticos para renderizado inmediato
- 6 categorías de animales: perros, gatos, aves, roedores, reptiles, peces
- 8 promociones, 8 novedades
- 7 marcas, 6 tipos de producto
- Imágenes hero, definiciones de categorías

### 5.7 Estilos (Tailwind v4)

`client/src/index.css` — Tema brutalista con colores neón y animaciones juguetonas.

**Paleta de colores personalizados (`@theme`):**
| Variable | Color | Uso |
|---|---|---|
| `--color-primary` | `#FF6B35` (naranja) | Botones, acentos principales |
| `--color-primary-dark` | `#E85D2C` | Hover estados |
| `--color-primary-light` | `#FFF3ED` | Fondos suaves |
| `--color-accent` | `#FFD23F` (amarillo) | Badges, destacados |
| `--color-secondary` | `#06D6A0` (verde) | Éxito, confirmación |
| `--color-neon-pink` | `#FF006E` | Stickers, errores |
| `--color-neon-purple` | `#8338EC` | Acentos secundarios |
| `--color-neon-blue` | `#3A86FF` | Links, interactivos |
| `--color-neon-cyan` | `#00F5D4` | Acentos frescos |
| `--color-bg` | `#FFF8F0` | Fondo general |
| `--color-bg-card` | `#FFFFFF` | Fondo tarjetas |
| `--color-bg-dark` | `#1A1A2E` | Footer, dark sections |
| `--color-text` | `#1A1A2E` | Texto principal |
| `--color-border` | `#1A1A2E` | Bordes (mismo que texto) |

**CSS Custom Properties:**
| Propiedad | Valor | Uso |
|---|---|---|
| `--font-family-body` | `'Outfit', system-ui, sans-serif` | Texto general |
| `--font-family-display` | `'Space Grotesk', system-ui, sans-serif` | Títulos |
| `--border-thick` | `3px` | Grosor bordes brutalistas |
| `--shadow-brutal` | `5px 5px 0px #1A1A2E` | Sombra default |
| `--shadow-brutal-lg` | `8px 8px 0px #1A1A2E` | Sombra grande |
| `--shadow-brutal-sm` | `3px 3px 0px #1A1A2E` | Sombra pequeña |

**Clases utilitarias:**
| Clase | Efecto |
|---|---|
| `.brutal-border` | `border: 3px solid #1A1A2E` |
| `.brutal-shadow` / `.brutal-shadow-lg` / `.brutal-shadow-sm` | Sombras duras sin blur |
| `.hover-lift` | Translate(-3px, -3px) + shadow-lg en hover |
| `.sticker` | Badge pill con border y uppercase |
| `.text-gradient` | Gradiente naranja → rosa → púrpura en texto |
| `.pattern-dots` | Background de puntos |
| `.pattern-zigzag` | Background de zigzag |
| `.blob-shape` / `.blob-shape-2` | Bordes irregulares blob |

**Gradientes predefinidos:**
| Clase | Colores |
|---|---|
| `.gradient-tropical` | naranja → rosa → púrpura → azul |
| `.gradient-sunset` | naranja → amarillo → verde |
| `.gradient-ocean` | azul → cyan → verde |
| `.gradient-fire` | rosa → naranja → amarillo |

**Animaciones keyframes:**
| Animación | Duración | Comportamiento |
|---|---|---|
| `float` | 4s | Flotar vertical ±15px con rotación |
| `float-reverse` | 5s | Flotar inverso |
| `wiggle` | 2s | Oscilar ±3° |
| `pulse-brutal` | 2s | Scale 1 → 1.05 |
| `slide-in-right` | 0.3s | Deslizar desde derecha |
| `slide-in-up` | 0.5s | Deslizar desde abajo |
| `bounce-in` | 0.4s | Escalar 0 → 1.15 → 1 |
| `marquee` | 20s | Desplazamiento horizontal infinito |
| `gradient-shift` | 4s | Movimiento de fondo gradiente |

**Scrollbar personalizada:** ancho 10px, thumb naranja con borde, track color bg.

**Diseño responsivo:** mobile-first con menú hamburguesa en `< lg` (`1024px`).

---

## 6. FLUJOS PRINCIPALES

### 6.1 Registro
Frontend `/registro` → `POST /api/clientes/registro` → Crea en PG + MongoDB carrito/preferencias → Retorna JWT → Almacena en localStorage → Redirige a Home

### 6.2 Login
Frontend `/login` → `POST /api/clientes/login` → Verifica credenciales → Retorna JWT → localStorage → Redirige

### 6.3 Navegación Catálogo
Frontend `/catalogo` → `GET /api/catalogo` (con filtros) → Renderiza ProductCard → Usuario puede filtrar por categoría, marca, precio, etiquetas

### 6.4 Compra (Carrito → Checkout → Pago)
1. Añadir al carrito (CartContext → localStorage)
2. `/carrito`: revisar items, modificar cantidades
3. `/checkout`: seleccionar/enviar dirección, departamento, tipo envío
4. `POST /api/pedidos`: crea pedido (ACID), limpia carrito
5. `POST /api/pedidos/pago`: procesa pago, genera factura, actualiza estado
6. Descargar PDF factura desde `/mis-pedidos`

### 6.5 Admin
1. `GET /api/admin/productos`: listar todos los productos con stock
2. `POST /api/admin/productos/:categoria`: crear nuevo producto (requiere producto_id único)
3. `PUT /api/admin/productos/:categoria/:id`: actualizar stock/precio/activo
4. `GET /api/admin/pedidos`: ver todos los pedidos
5. `PUT /api/admin/pedidos/:id/estado`: cambiar estado del pedido

---

## 7. SEGURIDAD

| Aspecto | Implementación |
|---|---|
| Passwords | bcrypt con salt rounds = 12 |
| JWT | 7 días de expiración, payload mínimo `{ cliente_id }` |
| Tarjetas | Cifrado simétrico con `pgp_sym_encrypt()` + clave de entorno |
| Roles | 3 niveles: `cliente`, `admin`, `owner` — middleware `requiereRol` |
| Helmet | Headers de seguridad HTTP |
| CORS | Origen dinámico |
| Validación | `express-validator` en todos los endpoints sensibles |
| Protección rutas | Frontend: verificación de rol para /admin/stock; Backend: middleware por endpoint |

---

## 8. DEPLOYMENT

| Componente | Plataforma |
|---|---|
| Frontend | Vercel (con `vercel.json` para SPA rewrites) |
| Backend | Railway (con `railway.toml`) |
| PostgreSQL | Railway / Supabase |
| MongoDB | MongoDB Atlas |

### Scripts raíz (`package.json`)
```
npm run install:all   # Instala server + client
npm run dev           # Corre ambos simultáneamente
npm run build         # Build frontend
npm run start         # Inicia servidor producción
npm run lint          # Linter frontend
```

### Migraciones automáticas
En startup del servidor, `runMigrations.js` aplica secuencialmente:
1. `01_schema.sql` (tablas, constraints, índices, seed departamentos)
2. `02_roles.sql` (roles BD)
3. `03_views.sql` (vistas analíticas)
4. `04_procedures.sql` (funciones + stored procedures)

### Seed MongoDB
Se ejecuta automáticamente en `connectMongo()` si las colecciones están vacías.

---

## 9. LIMITACIONES / OBSERVACIONES

1. **Catálogo híbrido**: El frontend tiene productos hardcodeados en `products.js` para renderizado inmediato. La API de MongoDB sirve productos dinámicos. Ambos orígenes coexisten.
2. **Pago QR**: Se marca como 'pendiente' — no hay integración real con pasarela de pagos.
3. **Contacto**: Solo UI, no hay endpoint que procese el formulario.
4. **Imágenes**: Usan `picsum.photos` como placeholder.
5. **No hay tests**: No se detectaron suites de prueba.
6. **Compatibilidad mongoose**: Puede haber warnings de mongoose por schemas sin `strictQuery` o timestamps.
7. **MongoDB no disponible**: El servidor arranca con warning si MongoDB no está disponible; el carrito y catálogo dinámico se desactivan.
