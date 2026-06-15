# Documentación de la API

Base URL: `http://localhost:3001/api`

## Autenticación

Los endpoints protegidos requieren el siguiente header HTTP:

```
Authorization: Bearer <token>
```

El token JWT se obtiene al hacer login o registro. Expira en 7 días.

---

## Clientes

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/clientes/registro` | No | Crear cuenta + carrito en MongoDB |
| POST | `/clientes/login` | No | Login, retorna JWT |
| GET | `/clientes/perfil` | Sí | Perfil + estadísticas + preferencias |
| POST | `/clientes/direcciones` | Sí | Agregar dirección de envío |
| POST | `/clientes/metodos-pago` | Sí | Agregar tarjeta (cifrada con pgcrypto) |

### POST /clientes/registro

```json
{
  "nombre": "Ariana",
  "apellido": "Cordero",
  "email": "ariana@email.com",
  "password": "minimo8chars"
}
```

### POST /clientes/login

```json
{
  "email": "ariana@email.com",
  "password": "minimo8chars"
}
```

### POST /clientes/metodos-pago

```json
{
  "tipo": "credito",
  "numero_tarjeta": "4111111111111111",
  "fecha_expiracion": "12/27"
}
```

---

## Catálogo (MongoDB)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/catalogo` | No | Listar productos con filtros opcionales |
| GET | `/catalogo/buscar?q=texto` | No | Búsqueda comparativa en todas las colecciones |
| GET | `/catalogo/:categoria/:id` | No | Detalle de un producto específico |

### Parámetros de filtro — GET /catalogo

| Parámetro | Ejemplo | Operador MongoDB | Descripción |
|---|---|---|---|
| `categoria` | `ropa` | — | Filtrar por colección específica |
| `marca` | `Sony` | `$eq` | Filtrar por marca exacta |
| `precio_min` | `500` | `$gte` | Precio mínimo |
| `precio_max` | `2000` | `$lte` | Precio máximo |
| `etiqueta` | `premium` | `$in` | Buscar en arreglo de etiquetas |
| `page` | `1` | — | Número de página |
| `limit` | `12` | — | Resultados por página |

### Categorías válidas

| Valor | Colección MongoDB | Descripción |
|---|---|---|
| `comida` | `productos_comida` | Alimentos secos, húmedos y snacks |
| `ropa` | `productos_ropa` | Abrigos, camisetas, arneses y accesorios de vestir |
| `juguetes` | `productos_juguetes` | Juguetes interactivos, cuerdas, rascadores |
| `accesorios` | `productos_accesorios` | Collares, camas, transportadores, correas |
| `salud` | `productos_salud` | Antiparasitarios, suplementos, shampoos |

---

## Carrito y Preferencias (MongoDB)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/carrito` | Sí | Obtener carrito activo del cliente |
| PUT | `/carrito` | Sí | Actualizar ítems del carrito |
| PUT | `/carrito/preferencias` | Sí | Actualizar preferencias del cliente |

### PUT /carrito

```json
{
  "items": [
    {
      "producto_id": "ELEC-001",
      "nombre": "Audífonos Bluetooth Pro",
      "precio": 1200,
      "cantidad": 2,
      "categoria": "electronica"
    }
  ]
}
```

---

## Pedidos y Pagos (PostgreSQL — ACID)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/pedidos` | Sí | Listar pedidos del cliente autenticado |
| GET | `/pedidos/:id` | Sí | Detalle de pedido con todos sus ítems |
| POST | `/pedidos` | Sí | Crear pedido (llama a fn_registrar_pedido) |
| POST | `/pedidos/pago` | Sí | Procesar pago (transacción ACID) |

### POST /pedidos

```json
{
  "direccion_id": 1,
  "items": [
    {
      "producto_mongo_id": "ELEC-001",
      "nombre_producto": "Audífonos Bluetooth Pro",
      "cantidad": 2,
      "precio_unitario": 1200
    }
  ]
}
```

### POST /pedidos/pago

```json
{
  "pedido_id": "uuid-del-pedido",
  "metodo_id": 1
}
```

### Flujo de pago (transacción ACID)

1. `BEGIN` — abre transacción en PostgreSQL
2. `fn_procesar_pago()` — genera factura con número único
3. Inserta registro en tabla `pagos`
4. Actualiza estado del pedido a `procesando`
5. Actualiza estado de la factura a `pagada`
6. `COMMIT` — confirma todos los cambios atómicamente
7. `ROLLBACK` automático si cualquier paso falla

---

## Administración (owner/admin)

Todas las rutas requieren `Authorization: Bearer <token>` y rol `owner` o `admin`.

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/admin/productos` | owner/admin | Listar todos los productos (stock, activo) |
| POST | `/admin/productos/:categoria` | owner/admin | Crear un nuevo producto |
| PUT | `/admin/productos/:categoria/:id` | owner/admin | Actualizar producto (stock, activo, precio, etc.) |
| GET | `/admin/pedidos` | owner/admin | Listar todos los pedidos con detalle |
| PUT | `/admin/pedidos/:id/estado` | owner/admin | Cambiar estado de un pedido |

### Categorías válidas para productos

`comida`, `ropa`, `juguetes`, `accesorios`, `salud`

### POST /admin/productos/:categoria

```json
{
  "producto_id": "COM-016",
  "nombre": "Croquetas Premium",
  "precio": 120.00,
  "marca": "Royal Canin",
  "descripcion": "Alimento balanceado para perros adultos",
  "stock": 50,
  "image": "https://...",
  "tipo_animal": ["perro"],
  "activo": true
}
```

Solo `producto_id`, `nombre` y `precio` son obligatorios.

### PUT /admin/productos/:categoria/:id

```json
{ "stock": 100, "activo": false }
```

Se puede enviar cualquier combinación de campos: `nombre`, `precio`, `marca`, `image`, `descripcion`, `tipo_animal`, `stock`, `activo`, `etiquetas`.

### Estados válidos para pedidos

`pendiente`, `procesando`, `enviado`, `entregado`, `cancelado`

### PUT /admin/pedidos/:id/estado

```json
{ "estado": "enviado" }
```

---

## Health Check

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Verifica conexión activa a PostgreSQL y MongoDB |

### Respuesta exitosa

```json
{
  "status": "ok",
  "postgres": true,
  "mongo": true
}
```