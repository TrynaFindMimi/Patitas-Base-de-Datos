import { Router } from 'express';
import {
  listarProductos, crearProducto, actualizarProducto,
  listarPedidosAdmin, actualizarEstadoPedido,
} from '../controllers/adminController.js';
import { verificarToken, requiereRol } from '../middleware/auth.js';

const router = Router();

router.use(verificarToken, requiereRol('owner', 'admin'));

router.get('/productos', listarProductos);
router.post('/productos/:categoria', crearProducto);
router.put('/productos/:categoria/:id', actualizarProducto);

router.get('/pedidos', listarPedidosAdmin);
router.put('/pedidos/:id/estado', actualizarEstadoPedido);

export default router;
