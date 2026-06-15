import { api } from './api.js';

export const catalogoService = {
  listar:   (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/catalogo${qs ? `?${qs}` : ''}`);
  },
  buscar:   (q, extra = {}) => {
    const qs = new URLSearchParams({ q, ...extra }).toString();
    return api.get(`/catalogo/buscar?${qs}`);
  },
  producto: (categoria, id) => api.get(`/catalogo/${categoria}/${id}`),
};

export const carritoService = {
  obtener:      ()      => api.get('/carrito'),
  actualizar:   (items) => api.put('/carrito', { items }),
  preferencias: (prefs) => api.put('/carrito/preferencias', prefs),
};

export const pedidoService = {
  departamentos: () => api.get('/pedidos/departamentos'),
  crear:   (datos) => api.post('/pedidos', datos),
  pagar:   (datos) => api.post('/pedidos/pago', datos),
  listar:  ()      => api.get('/pedidos'),
  detalle: (id)    => api.get(`/pedidos/${id}`),
};

export const adminService = {
  listar: () => api.get('/admin/productos'),
  crearProducto: (categoria, datos) => api.post(`/admin/productos/${categoria}`, datos),
  actualizarProducto: (categoria, id, datos) => api.put(`/admin/productos/${categoria}/${id}`, datos),
  pedidos: () => api.get('/admin/pedidos'),
  actualizarEstado: (id, estado) => api.put(`/admin/pedidos/${id}/estado`, { estado }),
};
