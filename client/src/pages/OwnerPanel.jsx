import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminService } from '../services/catalogo';
import {
  IconPackage, IconShoppingBag, IconUser, IconAlertCircle,
  IconTruck, IconCheck, IconClock, IconPlus, IconFileText,
} from '../components/Icons';

export default function OwnerPanel() {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({ productos: 0, activos: 0, pedidos: 0, pendientes: 0, ingresos: 0 });
  const [ultimosPedidos, setUltimosPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (usuario?.rol !== 'owner' && usuario?.rol !== 'admin') {
      setLoading(false);
      return;
    }
    Promise.all([
      adminService.listar().catch(() => []),
      adminService.pedidos().catch(() => []),
    ]).then(([cats, pedidos]) => {
      const totalProductos = cats.reduce((sum, c) => sum + (c.productos?.length || 0), 0);
      const activos = cats.reduce((sum, c) => sum + (c.productos?.filter(p => p.activo)?.length || 0), 0);
      const totalPedidos = pedidos.length;
      const pendientes = pedidos.filter(p => p.estado === 'pendiente').length;
      const ingresos = pedidos
        .filter(p => p.estado !== 'cancelado')
        .reduce((sum, p) => sum + Number(p.total || 0), 0);
      setStats({ productos: totalProductos, activos, pedidos: totalPedidos, pendientes, ingresos });
      setUltimosPedidos(pedidos.slice(0, 5));
    }).catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [usuario]);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const cards = [
    { label: 'Productos', valor: stats.productos, sub: `${stats.activos} activos`, icon: IconPackage, color: 'bg-neon-blue text-white' },
    { label: 'Pedidos', valor: stats.pedidos, sub: `${stats.pendientes} pendientes`, icon: IconShoppingBag, color: 'bg-neon-purple text-white' },
    { label: 'Ingresos', valor: `Bs ${stats.ingresos.toFixed(2)}`, sub: 'totales', icon: IconFileText, color: 'bg-secondary text-white' },
    { label: 'Clientes', valor: '—', sub: 'consulta en BD', icon: IconUser, color: 'bg-neon-cyan text-text' },
  ];

  const statusStyle = (estado) => {
    const s = {
      entregado: 'bg-green-100 text-green-700',
      enviado: 'bg-blue-100 text-blue-700',
      procesando: 'bg-amber-100 text-amber-700',
      pendiente: 'bg-gray-100 text-gray-700',
      cancelado: 'bg-red-100 text-red-700',
    };
    return s[estado] || s.pendiente;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-14 h-14 bg-primary brutal-border brutal-shadow rounded-xl flex items-center justify-center">
          <IconPackage className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>
            Panel de Control
          </h1>
          <p className="text-text-muted">Bienvenido de vuelta, {usuario?.nombre || 'Dueño'} · {usuario?.rol}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mt-4 mb-6 text-sm font-medium">{error}</div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white brutal-border brutal-shadow rounded-2xl p-5 hover-lift transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-black text-text">{card.valor}</p>
            <p className="text-sm font-bold text-text-muted">{card.label}</p>
            <p className="text-xs text-text-muted">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6">
          <h2 className="text-lg font-black text-text mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>Acciones rapidas</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/admin/stock?tab=stock" className="flex items-center gap-3 bg-accent/30 brutal-border brutal-shadow-sm rounded-xl p-4 hover-lift transition-all">
              <IconPackage className="w-5 h-5 text-text shrink-0" />
              <span className="font-bold text-sm">Gestionar Stock</span>
            </Link>
            <Link to="/admin/stock?tab=add" className="flex items-center gap-3 bg-secondary/20 brutal-border brutal-shadow-sm rounded-xl p-4 hover-lift transition-all">
              <IconPlus className="w-5 h-5 text-secondary-dark shrink-0" />
              <span className="font-bold text-sm">Nuevo Producto</span>
            </Link>
            <Link to="/admin/stock?tab=orders" className="flex items-center gap-3 bg-neon-blue/20 brutal-border brutal-shadow-sm rounded-xl p-4 hover-lift transition-all">
              <IconShoppingBag className="w-5 h-5 text-neon-blue shrink-0" />
              <span className="font-bold text-sm">Ver Pedidos</span>
            </Link>
            <Link to="/catalogo" className="flex items-center gap-3 bg-neon-purple/20 brutal-border brutal-shadow-sm rounded-xl p-4 hover-lift transition-all">
              <IconFileText className="w-5 h-5 text-neon-purple shrink-0" />
              <span className="font-bold text-sm">Ver Tienda</span>
            </Link>
          </div>
        </div>

        <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Ultimos pedidos</h2>
            <Link to="/admin/stock?tab=orders" className="text-xs font-bold text-primary hover:underline">Ver todos</Link>
          </div>
          {ultimosPedidos.length === 0 ? (
            <p className="text-text-muted text-sm font-medium text-center py-6">No hay pedidos registrados</p>
          ) : (
            <div className="space-y-3">
              {ultimosPedidos.map(p => (
                <div key={p.pedido_id} className="flex items-center justify-between border-b border-accent/30 pb-3 last:border-b-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="text-xs font-mono text-text-muted truncate">#{p.pedido_id?.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm font-bold text-text truncate">{p.cliente_nombre || 'Anonimo'}</p>
                    <p className="text-xs text-text-muted">{new Date(p.creado_en).toLocaleString('es-BO')}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="font-black text-sm text-primary">Bs {Number(p.total).toFixed(2)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-bold ${statusStyle(p.estado)}`}>{p.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
