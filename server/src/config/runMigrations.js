import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import pool from './postgres.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SQL_DIR = join(__dirname, '../../../database/postgres');

const SQL_FILES = [
  '01_schema.sql',
  '02_roles.sql',
  '03_views.sql',
  '04_procedures.sql',
  '05_seed_owner.sql',
];

export const runMigrations = async () => {
  for (const file of SQL_FILES) {
    const filePath = join(SQL_DIR, file);
    try {
      const sql = readFileSync(filePath, 'utf-8');
      await pool.query(sql);
      console.log(`Migración aplicada: ${file}`);
    } catch (err) {
      const msg = err.message ?? '';
      if (msg.includes('already exists')) {
        console.log(`Migración ya aplicada: ${file}`);
      } else {
        console.error(`Error en migración ${file}:`, err.message);
        throw err;
      }
    }
  }
};
