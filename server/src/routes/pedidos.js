import { Router } from 'express';
import { body } from 'express-validator';
import { crearPedido, procesarPago, obtenerPedidos, obtenerPedido } from '../controllers/pedidoController.js';
import { verificarToken } from '../middleware/auth.js';
import { validar } from '../middleware/validate.js';

const router = Router();

router.use(verificarToken);
router.get('/', obtenerPedidos);
router.get('/:id', obtenerPedido);
router.post('/',
  [
    body('direccion_id').optional().isInt(),
    body('calle').optional().notEmpty(),
    body('ciudad').optional().notEmpty(),
    body('estado').optional().notEmpty(),
    body('codigo_postal').optional().notEmpty(),
    body('items').isArray({ min: 1 }),
  ],
  validar, crearPedido
);
router.post('/pago',
  [body('pedido_id').isUUID(), body('metodo_id').isInt()],
  validar, procesarPago
);

export default router;