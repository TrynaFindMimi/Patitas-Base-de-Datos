import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectMongo from './src/config/mongodb.js';
import pool from './src/config/postgres.js';
import { runMigrations } from './src/config/runMigrations.js';
import clientesRouter from './src/routes/clientes.js';
import pedidosRouter from './src/routes/pedidos.js';
import catalogoRouter from './src/routes/catalogo.js';
import carritoRouter from './src/routes/carrito.js';
import adminRouter from './src/routes/admin.js';

dotenv.config();

const app = express();

app.use(helmet());
const origenesPermitidos = [
  'http://localhost:5173',
  'https://patitas-base-de-datos.vercel.app',
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];
app.use(cors({ origin: origenesPermitidos }));
app.use(express.json());

app.use('/api/clientes', clientesRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/catalogo', catalogoRouter);
app.use('/api/carrito', carritoRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', async (_req, res) => {
  try {
    const pg = await pool.query('SELECT 1');
    res.json({
      status: 'ok',
      postgres: !!pg,
      mongo: mongoose.connection.readyState === 1
    });
  } catch {
    res.status(503).json({ status: 'error', postgres: false, mongo: false });
  }
});

app.use((err, _req, res, _next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err?.message || err?.toString() || 'Error interno del servidor' });
});

const requiredEnv = ['PG_HOST', 'PG_USER', 'PG_PASSWORD', 'PG_DATABASE', 'JWT_SECRET'];
const missing = requiredEnv.filter(k => !process.env[k]);
if (missing.length) {
  console.error(`Faltan variables de entorno: ${missing.join(', ')}`);
  process.exit(1);
}

let server;

const start = async () => {
  await connectMongo().catch(() =>
    console.warn('MongoDB no disponible — catálogo y carrito desactivados')
  );
  await pool.query('SELECT 1');
  console.log('PostgreSQL conectado');
  await runMigrations();
  const PORT = process.env.PORT ?? 3001;
  server = app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
};

start().catch((err) => {
  console.error('Error al iniciar servidor:', err.message);
  process.exit(1);
});

const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} recibido. Cerrando servidor...`);
  if (server) {
    server.close(() => {
      console.log('Servidor HTTP cerrado');
    });
  }
  await mongoose.connection.close().catch(() => {});
  await pool.end().catch(() => {});
  console.log('Conexiones cerradas');
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));