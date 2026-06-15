import { Router } from 'express';
import { body } from 'express-validator';
import { crearPedido, procesarPago, obtenerPedidos, obtenerPedido, listarDepartamentos } from '../controllers/pedidoController.js';
import { verificarToken } from '../middleware/auth.js';
import { validar } from '../middleware/validate.js';

const router = Router();

router.get('/departamentos', listarDepartamentos);

router.use(verificarToken);
router.get('/', obtenerPedidos);
router.get('/:id', obtenerPedido);
router.post('/',
  [
    body('departamento').optional().isString(),
    body('tipo_envio').optional().isIn(['domicilio', 'paqueteria']),
    body('direccion_id').optional().isInt(),
    body('calle').optional().notEmpty(),
    body('ciudad').optional().notEmpty(),
    body('codigo_postal').optional().notEmpty(),
    body('items').isArray({ min: 1 }),
  ],
  validar, crearPedido
);
router.post('/pago',
  [
    body('pedido_id').isUUID(),
    body('tipo_pago').optional().isIn(['qr', 'tarjeta']),
    body('metodo_id').optional({ values: 'null' }).isInt(),
  ],
  validar, procesarPago
);

export default router;
