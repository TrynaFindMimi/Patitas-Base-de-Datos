import { Router } from 'express';
import { listarProductos, obtenerProducto, buscarProductos } from '../controllers/catalogoController.js';

const router = Router();

router.get('/', listarProductos);
router.get('/buscar', buscarProductos);
router.get('/:categoria/:id', obtenerProducto);

export default router;