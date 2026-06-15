import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/catalogo';
import { IconPackage, IconSave, IconAlertCircle } from '../components/Icons';

export default function OwnerDashboard() {
  const { usuario } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(null);
  const [nuevoStock, setNuevoStock] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    adminService.listar()
      .then(setCategorias)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEditar = (catIdx, prodIdx, stockActual) => {
    setEditando(`${catIdx}-${prodIdx}`);
    setNuevoStock(String(stockActual));
  };

  const handleGuardar = async (categoria, productoId) => {
    try {
      const actualizado = await adminService.actualizarStock(categoria, productoId, parseInt(nuevoStock, 10) || 0);
      setCategorias(prev => prev.map(cat => {
        if (cat.categoria !== categoria) return cat;
        return {
          ...cat,
          productos: cat.productos.map(p =>
            p.producto_id === productoId ? { ...p, stock: actualizado.stock } : p
          )
        };
      }));
      setEditando(null);
      setMensaje('Stock actualizado');
      setTimeout(() => setMensaje(''), 2500);
    } catch (e) {
      setError(e.message);
    }
  };

  if (usuario?.rol !== 'owner' && usuario?.rol !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-red-100 brutal-border brutal-shadow-lg rounded-full flex items-center justify-center mx-auto mb-6">
          <IconAlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-text mb-2">Acceso restringido</h2>
        <p className="text-text-muted">Solo el dueño de la tienda puede acceder a esta seccion.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-text-muted font-bold">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center">
          <IconPackage className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Gestion de Stock</h1>
          <p className="text-sm text-text-muted">Administra el inventario de la tienda</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">{error}</div>
      )}
      {mensaje && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-bounce-in">{mensaje}</div>
      )}

      <div className="space-y-8">
        {categorias.map((cat, catIdx) => (
          <div key={cat.categoria} className="bg-white brutal-border brutal-shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-text text-white px-6 py-4">
              <h2 className="font-black text-lg uppercase tracking-wider">
                {cat.categoria} <span className="text-accent text-sm font-bold">({cat.productos.length} productos)</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-accent/50 text-text text-left">
                    <th className="px-4 py-3 font-bold">ID</th>
                    <th className="px-4 py-3 font-bold">Nombre</th>
                    <th className="px-4 py-3 font-bold">Precio</th>
                    <th className="px-4 py-3 font-bold w-32">Stock</th>
                    <th className="px-4 py-3 font-bold w-24">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.productos.map((prod, prodIdx) => (
                    <tr key={prod.producto_id} className="border-t border-accent/30 hover:bg-accent/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-text-muted">{prod.producto_id}</td>
                      <td className="px-4 py-3 font-bold text-text">{prod.nombre}</td>
                      <td className="px-4 py-3 text-text">Bs {prod.precio?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {editando === `${catIdx}-${prodIdx}` ? (
                          <input
                            type="number"
                            min="0"
                            value={nuevoStock}
                            onChange={e => setNuevoStock(e.target.value)}
                            className="w-24 brutal-border rounded-lg px-3 py-1.5 font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary"
                            autoFocus
                          />
                        ) : (
                          <span className={`font-bold ${prod.stock <= 5 ? 'text-red-600' : prod.stock <= 20 ? 'text-amber-600' : 'text-green-700'}`}>
                            {prod.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {editando === `${catIdx}-${prodIdx}` ? (
                          <button
                            onClick={() => handleGuardar(cat.categoria, prod.producto_id)}
                            className="flex items-center gap-1 bg-primary text-white font-bold px-3 py-1.5 rounded-lg brutal-border brutal-shadow-sm hover-lift transition-all text-xs cursor-pointer"
                          >
                            <IconSave className="w-3.5 h-3.5" />
                            Guardar
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEditar(catIdx, prodIdx, prod.stock)}
                            className="bg-accent text-text font-bold px-3 py-1.5 rounded-lg brutal-border brutal-shadow-sm hover-lift transition-all text-xs cursor-pointer"
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
