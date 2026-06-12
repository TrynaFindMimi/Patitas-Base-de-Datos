import { Router } from 'express';
import { body } from 'express-validator';
import { registrar, login, obtenerPerfil, agregarDireccion, agregarMetodoPago } from '../controllers/clienteController.js';
import { verificarToken } from '../middleware/auth.js';
import { validar } from '../middleware/validate.js';

const router = Router();

router.post('/registro',
  [body('email').isEmail(), body('password').isLength({ min: 8 }), body('nombre').notEmpty(), body('apellido').notEmpty()],
  validar, registrar
);
router.post('/login',
  [body('email').isEmail(), body('password').notEmpty()],
  validar, login
);
router.get('/perfil', verificarToken, obtenerPerfil);
router.post('/direcciones', verificarToken,
  [body('calle').notEmpty(), body('ciudad').notEmpty(), body('estado').notEmpty(), body('codigo_postal').notEmpty()],
  validar, agregarDireccion
);
router.post('/metodos-pago', verificarToken,
  [body('tipo').isIn(['credito','debito']), body('numero_tarjeta').isLength({ min: 16, max: 16 }), body('fecha_expiracion').notEmpty()],
  validar, agregarMetodoPago
);

export default router;