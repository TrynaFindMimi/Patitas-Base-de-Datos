# Patitas — E-commerce Multitienda

Plataforma de e-commerce con arquitectura híbrida SQL + NoSQL (Persistencia Políglota).

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind |
| Backend | Node.js + Express |
| BD Relacional | PostgreSQL + pgcrypto |
| BD NoSQL | MongoDB + Mongoose |
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
# Editar server/.env con tus credenciales
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
node seed.js
cd ../..
```

### 5. Instalar dependencias y correr

```bash
# Backend
cd server
npm install
npm run dev

# Frontend (nueva terminal)
cd client
npm install
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:3001

## Arquitectura

Ver [docs/arquitectura.md](docs/arquitectura.md)

## API

Ver [docs/api.md](docs/api.md)
