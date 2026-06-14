# Arquitectura del Sistema

## Diagrama de Flujo de Datos

```
Cliente React (puerto 5173)
        |
        | HTTP/REST (JSON)
        v
API REST — Express (puerto 3001)
        |
        |--- Clientes / Pedidos / Pagos ---> PostgreSQL
        |        datos transaccionales            3NF, ACID
        |        cifrado pgcrypto                 Stored Procedures
        |        roles RBAC                       Vistas y Subconsultas
        |
        +--- Catálogo / Carrito -----------> MongoDB
                 esquema BSON dinámico           colecciones por categoría
                 preferencias del cliente        queries con operadores
```

## Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| Frontend | React 18 + Vite + Tailwind | Interfaz de usuario |
| Backend | Node.js + Express | API REST y lógica de negocio |
| BD Relacional | PostgreSQL 15 + pgcrypto | Datos transaccionales y seguridad |
| BD NoSQL | MongoDB 7 + Mongoose | Catálogo dinámico y carrito |
| Autenticación | JWT + bcryptjs | Sesiones y hash de contraseñas |

## Módulo Relacional — PostgreSQL

### Tablas normalizadas (3NF)

| Tabla | Descripción |
|---|---|
| `clientes` | Datos personales con UUID como clave primaria |
| `direcciones` | Direcciones de envío, relacionadas por cliente_id |
| `metodos_pago` | Tarjetas con número cifrado en columna BYTEA |
| `pedidos` | Cabecera de orden con estado y totales calculados |
| `detalle_pedido` | Ítems con referencia al producto_id de MongoDB |
| `facturas` | Documento fiscal generado por pedido (relación 1:1) |
| `pagos` | Registro de transacciones vinculadas a facturas |

### Seguridad implementada

- Cifrado de número de tarjeta con `pgp_sym_encrypt` (extensión pgcrypto)
- Roles RBAC: `patitas_admin`, `patitas_cajero`, `patitas_cliente`
- Queries parametrizadas en toda la API — sin concatenación de strings
- Contraseñas hasheadas con bcrypt (salt factor 12)
- Funciones `SECURITY DEFINER` para acceso controlado al cifrado

### Procedimientos almacenados

| Función | Descripción |
|---|---|
| `fn_registrar_pedido()` | Inserta pedido + ítems y calcula totales en una sola transacción |
| `fn_procesar_pago()` | Crea factura y pago, actualiza estado del pedido |
| `fn_cifrar_tarjeta()` | Wrapper de pgp_sym_encrypt con clave de aplicación |
| `fn_descifrar_tarjeta()` | Wrapper de pgp_sym_decrypt con clave de aplicación |

### Vistas

| Vista | Descripción |
|---|---|
| `v_pedidos_detalle` | JOIN entre pedidos, clientes y direcciones |
| `v_resumen_ventas` | Ingresos y pedidos agrupados por mes |
| `v_clientes_activos` | Clientes con total gastado y fecha del último pedido |
| `v_productos_mas_vendidos` | Ranking de productos por unidades vendidas |
| `v_clientes_frecuentes` | Subconsulta anidada: clientes sobre el promedio de gasto |

## Módulo NoSQL — MongoDB

### Colecciones con esquema BSON dinámico

| Colección | Atributos específicos por categoría |
|---|---|
| `productos_comida` | peso_kg, sabores [ ], tipo_animal [ ] |
| `productos_ropa` | tallas [ ], colores [ ], material, tipo_animal [ ] |
| `productos_juguetes` | material, edad_minima_meses, interactivo, variantes [ ] |
| `productos_accesorios` | material, colores [ ], variantes [ ], tipo_animal [ ] |
| `productos_salud` | tipo_producto, requiere_receta, presentacion [ ] |
| `carritos` | Carrito activo vinculado al cliente por UUID |
| `preferencias` | Historial y preferencias del cliente vinculado por UUID |

### Campos tipo arreglo usados en queries

- `tallas`, `colores`, `etiquetas`, `industria` (presentes en todas las categorías)
- `tipo_animal` (filtro por especie: perro, gato, etc.)
- `sabores` (comida)
- `variantes` (juguetes, accesorios)
- `presentacion` (salud)

### Queries con operadores de comparación y lógicos

| Query | Operadores utilizados |
|---|---|
| Productos por especie y precio > 500 | `$and`, `$in`, `$gt` |
| Ropa talla M o L con precio < 500 | `$and`, `$in`, `$lt` |
| Juguetes interactivos para gatos | `$and`, `$eq` |
| Productos por etiqueta (arreglo) | `$in` |
| Productos por industria (arreglo exacto) | `$all` |
| Búsqueda por nombre en todas las colecciones | `$regex`, `$options` |

## Integración entre bases de datos

El campo `cliente_id` (UUID generado en PostgreSQL) actúa como clave de integración
en MongoDB bajo el nombre `cliente_uuid`. Esto permite que la API combine datos
transaccionales con datos de comportamiento en una sola respuesta sin duplicar información.

```
clientes.cliente_id  (PostgreSQL — UUID)
        |
        +---> carritos.cliente_uuid     (MongoDB)
        +---> preferencias.cliente_uuid (MongoDB)
```

Flujo de registro de un cliente nuevo:

1. Se inserta el cliente en PostgreSQL y se obtiene el UUID generado
2. Se crean documentos vacíos en MongoDB con ese UUID
3. La API retorna el JWT firmado con el UUID como payload
4. Todas las operaciones posteriores usan ese UUID para unir ambas BDs