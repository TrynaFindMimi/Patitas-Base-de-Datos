# Patitas — E-commerce Multitienda

Plataforma de e-commerce con arquitectura híbrida SQL + NoSQL (Persistencia Políglota).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite 8 + Tailwind 4 |
| Backend | Node.js + Express |
| BD Relacional | PostgreSQL 16 + pgcrypto |
| BD NoSQL | MongoDB 7 + Mongoose |
| Auth | JWT + bcryptjs |

## Requisitos

- Node.js 18+
- PostgreSQL 15+
- MongoDB 7+

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/ArianaCordero/Patitas-Base-de-Datos.git
cd Patitas-Base-de-Datos
```

### 2. Configurar variables de entorno

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
# Editar ambos archivos con tus credenciales
```

### 3. Inicializar PostgreSQL

```bash
psql -U postgres -c "CREATE DATABASE patitas_db;"
psql -U postgres -d patitas_db -f database/postgres/01_schema.sql
psql -U postgres -d patitas_db -f database/postgres/02_roles.sql
psql -U postgres -d patitas_db -f database/postgres/03_views.sql
psql -U postgres -d patitas_db -f database/postgres/04_procedures.sql
```

### 4. Inicializar MongoDB

```bash
cd database/mongodb
npm install
node seed.js
cd ../..
```

### 5. Instalar dependencias y correr

```bash
# Instalar todo desde la raíz
npm run install:all

# Backend
cd server
npm run dev

# Frontend (nueva terminal)
cd client
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:3001

### Scripts disponibles (raíz del proyecto)

```bash
npm run install:all   # Instala dependencias de server y client
npm run dev           # Corre servidor y cliente simultáneamente
npm run build         # Compila el frontend para producción
npm run start         # Inicia el servidor en producción
npm run lint          # Ejecuta linter del frontend
```

## Características

- **40+ productos** en 6 categorías (perros, gatos, aves, roedores, reptiles, peces)
- **5 categorías en API** con MongoDB (comida, ropa, juguetes, accesorios, salud)
- Catálogo híbrido: productos hardcodeados en frontend + dinámicos desde API
- Carrito de compras con persistencia local y sincronización con MongoDB
- Generación de facturas en PDF con jsPDF
- Autenticación JWT con roles
- Transacciones ACID en PostgreSQL para pedidos y pagos
- Cifrado de tarjetas con pgcrypto
- Búsqueda con filtros (categoría, precio, etiquetas)
- Diseño responsivo con Tailwind

## Arquitectura

Ver [docs/arquitectura.md](docs/arquitectura.md)

## API

Ver [docs/api.md](docs/api.md)

## Despliegue

### Vercel (Frontend)

El proyecto incluye `vercel.json` para desplegar el frontend en Vercel:

```bash
cd client
vercel --prod
```

### Producción (Backend)

```bash
cd server
NODE_ENV=production npm start
```

El servidor valida las variables de entorno al iniciar y cuenta con apagado graceful (SIGINT/SIGTERM).
