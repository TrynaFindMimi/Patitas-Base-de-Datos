# Deploy

## Frontend — Vercel

```bash
# 1. Ir al directorio del frontend
cd client

# 2. Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# 3. Configurar variables de entorno en Vercel
#    Ve a https://vercel.com -> proyecto -> Settings -> Environment Variables
#    Agrega:
#      VITE_API_URL = https://tu-backend.railway.app/api

# 4. Desplegar
vercel --prod
```

El `vercel.json` ya está configurado con rewrites para SPA.

---

## Backend — Railway

```bash
# 1. Ir al directorio del servidor
cd server

# 2. Asegúrate de tener el proyecto en GitHub
#    Railway se conecta directo al repo

# 3. En Railway.app:
#    - New Project -> Deploy from GitHub repo
#    - Root Directory: server
#    - Start Command: node index.js

# 4. Agregar variables de entorno en Railway:
#    PORT = 3001
#    CLIENT_URL = https://tu-frontend.vercel.app
#    PG_HOST = (host de tu PostgreSQL, usa Railway Postgres o Supabase)
#    PG_PORT = 5432
#    PG_USER = postgres
#    PG_PASSWORD = (tu password)
#    PG_DATABASE = patitas_db
#    MONGO_URI = mongodb+srv://... (usa MongoDB Atlas)
#    JWT_SECRET = (genera una clave segura)
#    APP_ENCRYPTION_KEY = (genera otra clave segura)

# 5. Railway deploy automático al hacer push a main
```

## Requisitos previos

- PostgreSQL (Railway Postgres o [Supabase](https://supabase.com) gratis)
- MongoDB ([MongoDB Atlas](https://www.mongodb.com/atlas) gratis)

### Inicializar base de datos

Conéctate a tu PostgreSQL remoto y ejecuta:

```bash
psql $PG_CONNECTION_STRING -f database/postgres/01_schema.sql
psql $PG_CONNECTION_STRING -f database/postgres/02_roles.sql
psql $PG_CONNECTION_STRING -f database/postgres/03_views.sql
psql $PG_CONNECTION_STRING -f database/postgres/04_procedures.sql
```

Para MongoDB, ejecuta el seed localmente apuntando a tu Atlas:

```bash
cd database/mongodb
npm install
MONGO_URI=mongodb+srv://... node seed.js
```
