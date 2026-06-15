import { Router } from 'express';
import { body } from 'express-validator';
import { obtenerCarrito, actualizarCarrito, actualizarPreferencias } from '../controllers/carritoController.js';
import { verificarToken } from '../middleware/auth.js';
import { validar } from '../middleware/validate.js';

const router = Router();

router.use(verificarToken);
router.get('/', obtenerCarrito);
router.put('/',
  body('items').isArray().withMessage('items debe ser un arreglo'),
  validar,
  actualizarCarrito
);
router.put('/preferencias', actualizarPreferencias);

export default router;