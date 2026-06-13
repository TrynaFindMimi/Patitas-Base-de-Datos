const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

const getHeaders = () => {
  const token = localStorage.getItem('patitas_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Error en la solicitud');
  return data;
};

export const api = {
  get:    (path) =>       fetch(`${BASE}${path}`, { headers: getHeaders() }).then(handleResponse),
  post:   (path, body) => fetch(`${BASE}${path}`, { method: 'POST',   headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  put:    (path, body) => fetch(`${BASE}${path}`, { method: 'PUT',    headers: getHeaders(), body: JSON.stringify(body) }).then(handleResponse),
  delete: (path) =>       fetch(`${BASE}${path}`, { method: 'DELETE', headers: getHeaders() }).then(handleResponse),
};
