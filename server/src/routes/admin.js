import { Router } from 'express';
import { listarProductos, actualizarStock } from '../controllers/adminController.js';
import { verificarToken, requiereRol } from '../middleware/auth.js';

const router = Router();

router.use(verificarToken, requiereRol('owner', 'admin'));

router.get('/productos', listarProductos);
router.put('/productos/:categoria/:id/stock', actualizarStock);

export default router;
