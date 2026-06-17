import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/catalogo';
import {
  IconPackage, IconSave, IconAlertCircle, IconPlus,
  IconShoppingBag, IconCheck, IconTruck,
} from '../components/Icons';

const CATEGORIAS = ['comida', 'ropa', 'juguetes', 'accesorios', 'salud'];
const ESTADOS_PEDIDO = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'];

const tabs = [
  { id: 'stock', label: 'Stock', icon: IconPackage },
  { id: 'add', label: 'Nuevo Producto', icon: IconPlus },
  { id: 'orders', label: 'Pedidos', icon: IconShoppingBag },
];

export default function OwnerDashboard() {
  const { usuario } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState(searchParams.get('tab') || 'stock');

  const cambiarTab = (id) => {
    setTab(id);
    setSearchParams({ tab: id });
  };

  const acceso = usuario?.rol === 'owner' || usuario?.rol === 'admin';
  if (!acceso) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center">
          <IconPackage className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Panel del Dueño</h1>
          <p className="text-sm text-text-muted">Gestiona productos, stock y pedidos</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => cambiarTab(t.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all brutal-border brutal-shadow-sm cursor-pointer ${
              tab === t.id ? 'bg-primary text-white' : 'bg-white text-text hover:bg-accent'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'stock' && <TabStock />}
      {tab === 'add' && <TabAddProduct />}
      {tab === 'orders' && <TabOrders />}
    </div>
  );
}

function TabStock() {
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

  const handleGuardar = async (categoria, productoId) => {
    try {
      await adminService.actualizarProducto(categoria, productoId, { stock: parseInt(nuevoStock, 10) || 0 });
      setCategorias(prev => prev.map(cat => {
        if (cat.categoria !== categoria) return cat;
        return {
          ...cat,
          productos: cat.productos.map(p =>
            p.producto_id === productoId ? { ...p, stock: parseInt(nuevoStock, 10) || 0 } : p
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

  const toggleActivo = async (categoria, producto) => {
    try {
      const nuevoActivo = !producto.activo;
      await adminService.actualizarProducto(categoria, producto.producto_id, { activo: nuevoActivo });
      setCategorias(prev => prev.map(cat => {
        if (cat.categoria !== categoria) return cat;
        return {
          ...cat,
          productos: cat.productos.map(p =>
            p.producto_id === producto.producto_id ? { ...p, activo: nuevoActivo } : p
          )
        };
      }));
      setMensaje(nuevoActivo ? 'Producto activado' : 'Producto desactivado');
      setTimeout(() => setMensaje(''), 2500);
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">{error}</div>}
      {mensaje && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-bounce-in">{mensaje}</div>}
      <div className="space-y-6">
        {categorias.map((cat, catIdx) => (
          <div key={cat.categoria} className="bg-white brutal-border brutal-shadow-lg rounded-2xl overflow-hidden">
            <div className="bg-text text-white px-6 py-4 flex items-center justify-between">
              <h2 className="font-black text-lg uppercase tracking-wider">
                {cat.categoria} <span className="text-accent text-sm font-bold">({cat.productos.length} prod.)</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-accent/50 text-text text-left">
                    <th className="px-4 py-3 font-bold">ID</th>
                    <th className="px-4 py-3 font-bold">Nombre</th>
                    <th className="px-4 py-3 font-bold">Precio</th>
                    <th className="px-4 py-3 font-bold w-24">Stock</th>
                    <th className="px-4 py-3 font-bold w-24">Activo</th>
                    <th className="px-4 py-3 font-bold w-24">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {cat.productos.map((prod, prodIdx) => (
                    <tr key={prod.producto_id} className={`border-t border-accent/30 hover:bg-accent/20 transition-colors ${!prod.activo ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 font-mono text-xs text-text-muted">{prod.producto_id}</td>
                      <td className="px-4 py-3 font-bold text-text">{prod.nombre}</td>
                      <td className="px-4 py-3 text-text">Bs {prod.precio?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        {editando === `${catIdx}-${prodIdx}` ? (
                          <input type="number" min="0" value={nuevoStock}
                            onChange={e => setNuevoStock(e.target.value)}
                            className="w-20 brutal-border rounded-lg px-2 py-1.5 font-bold text-center focus:outline-none focus:ring-2 focus:ring-primary" autoFocus
                          />
                        ) : (
                          <span className={`font-bold ${prod.stock <= 5 ? 'text-red-600' : prod.stock <= 20 ? 'text-amber-600' : 'text-green-700'}`}>
                            {prod.stock}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActivo(cat.categoria, prod)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold brutal-border brutal-shadow-sm cursor-pointer transition-all ${
                            prod.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {prod.activo ? 'Si' : 'No'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {editando === `${catIdx}-${prodIdx}` ? (
                          <button onClick={() => handleGuardar(cat.categoria, prod.producto_id)}
                            className="flex items-center gap-1 bg-primary text-white font-bold px-3 py-1.5 rounded-lg brutal-border brutal-shadow-sm hover-lift transition-all text-xs cursor-pointer"
                          >
                            <IconSave className="w-3.5 h-3.5" /> Guardar
                          </button>
                        ) : (
                          <button onClick={() => { setEditando(`${catIdx}-${prodIdx}`); setNuevoStock(String(prod.stock)); }}
                            className="bg-accent text-text font-bold px-3 py-1.5 rounded-lg brutal-border brutal-shadow-sm hover-lift transition-all text-xs cursor-pointer"
                          >Editar</button>
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
    </>
  );
}

function TabAddProduct() {
  const [form, setForm] = useState({
    categoria: 'comida', producto_id: '', nombre: '', precio: '', marca: '',
    descripcion: '', stock: '0', image: '', tipo_animal: '',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [creando, setCreando] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setExito('');
    setCreando(true);
    try {
      const tipo_animal = form.tipo_animal.split(',').map(s => s.trim()).filter(Boolean);
      await adminService.crearProducto(form.categoria, {
        producto_id: form.producto_id,
        nombre: form.nombre,
        precio: parseFloat(form.precio) || 0,
        marca: form.marca || 'Generica',
        descripcion: form.descripcion || form.nombre,
        stock: parseInt(form.stock, 10) || 0,
        image: form.image || '',
        tipo_animal,
      });
      setExito(`Producto "${form.nombre}" creado exitosamente`);
      setForm({ categoria: 'comida', producto_id: '', nombre: '', precio: '', marca: '', descripcion: '', stock: '0', image: '', tipo_animal: '' });
    } catch (e) {
      setError(e.message);
    } finally {
      setCreando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">{error}</div>}
      {exito && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-bounce-in">{exito}</div>}
      <form onSubmit={handleSubmit} className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-text mb-1">Categoria</label>
            <select name="categoria" value={form.categoria} onChange={handleChange} className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white">
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-text mb-1">ID del producto</label>
            <input name="producto_id" value={form.producto_id} onChange={handleChange} required placeholder="EJ: COM-016" className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-text mb-1">Nombre</label>
          <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold text-text mb-1">Precio (Bs)</label>
            <input name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} required className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-text mb-1">Marca</label>
            <input name="marca" value={form.marca} onChange={handleChange} className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-text mb-1">Stock inicial</label>
            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-text mb-1">Descripcion</label>
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows="3" className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-text mb-1">URL de imagen</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://..." className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
          </div>
          <div>
            <label className="block text-sm font-bold text-text mb-1">Tipo de animal (separado por coma)</label>
            <input name="tipo_animal" value={form.tipo_animal} onChange={handleChange} placeholder="perro, gato" className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" />
          </div>
        </div>
        <button type="submit" disabled={creando}
          className="w-full bg-primary text-white font-black py-4 rounded-xl brutal-border brutal-shadow-lg hover-lift transition-all text-lg cursor-pointer disabled:opacity-50"
        >
          {creando ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
}

function TabOrders() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargar = () => {
    setLoading(true);
    adminService.pedidos()
      .then(setPedidos)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(cargar, []);

  const cambiarEstado = async (id, estado) => {
    try {
      await adminService.actualizarEstado(id, estado);
      setMensaje(`Pedido actualizado a "${estado}"`);
      setTimeout(() => setMensaje(''), 2500);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <div className="text-center py-12"><div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto" /></div>;

  return (
    <>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">{error}</div>}
      {mensaje && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium animate-bounce-in">{mensaje}</div>}
      {pedidos.length === 0 ? (
        <p className="text-text-muted text-center py-12 font-bold">No hay pedidos registrados</p>
      ) : (
        <div className="space-y-4">
          {pedidos.map(pedido => (
            <div key={pedido.pedido_id} className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-xs font-mono text-text-muted">#{pedido.pedido_id?.slice(0, 8).toUpperCase()}</p>
                  <p className="font-bold text-text">{pedido.cliente_nombre}</p>
                  <p className="text-xs text-text-muted">{pedido.cliente_email}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-primary">Bs {Number(pedido.total).toFixed(2)}</p>
                  <p className="text-xs text-text-muted">{new Date(pedido.creado_en).toLocaleString('es-BO')}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  pedido.estado === 'entregado' ? 'bg-green-100 text-green-700' :
                  pedido.estado === 'cancelado' ? 'bg-red-100 text-red-700' :
                  pedido.estado === 'enviado' ? 'bg-blue-100 text-blue-700' :
                  pedido.estado === 'procesando' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>{pedido.estado}</span>
                <span className="text-xs text-text-muted">{pedido.departamento} — {pedido.tipo_envio}</span>
              </div>
              {pedido.items?.length > 0 && (
                <details className="mt-3">
                  <summary className="text-xs font-bold text-primary cursor-pointer">Ver productos ({pedido.items.length})</summary>
                  <div className="mt-2 space-y-1">
                    {pedido.items.map((item, i) => (
                      <p key={i} className="text-xs text-text-muted">x{item.cantidad} {item.nombre_producto} — Bs {Number(item.precio_unitario).toFixed(2)}</p>
                    ))}
                  </div>
                </details>
              )}
              <div className="flex gap-2 mt-4 flex-wrap">
                {ESTADOS_PEDIDO.map(est => (
                  <button
                    key={est}
                    onClick={() => cambiarEstado(pedido.pedido_id, est)}
                    disabled={est === pedido.estado}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold brutal-border brutal-shadow-sm transition-all cursor-pointer disabled:opacity-30 ${
                      est === pedido.estado
                        ? 'bg-primary text-white'
                        : 'bg-accent text-text hover:bg-primary hover:text-white'
                    }`}
                  >
                    {est === 'entregado' && <IconCheck className="w-3 h-3 inline mr-1" />}
                    {est === 'enviado' && <IconTruck className="w-3 h-3 inline mr-1" />}
                    {est}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
