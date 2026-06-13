import { Router } from 'express';
import { obtenerCarrito, actualizarCarrito, actualizarPreferencias } from '../controllers/carritoController.js';
import { verificarToken } from '../middleware/auth.js';

const router = Router();

router.use(verificarToken);
router.get('/', obtenerCarrito);
router.put('/', actualizarCarrito);
router.put('/preferencias', actualizarPreferencias);

export default router;