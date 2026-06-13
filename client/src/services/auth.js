import { api } from './api.js';

export const authService = {
  login:    (email, password) => api.post('/clientes/login', { email, password }),
  register: (datos) =>           api.post('/clientes/registro', datos),
  perfil:   () =>                api.get('/clientes/perfil'),
  logout:   () => {
    localStorage.removeItem('patitas_token');
    localStorage.removeItem('patitas_user');
  },
};
