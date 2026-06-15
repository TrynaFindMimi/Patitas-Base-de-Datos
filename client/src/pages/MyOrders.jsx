import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { pedidoService } from '../services/catalogo.js';
import { IconShoppingBag, IconFileText, IconPackage, IconClock } from '../components/Icons';
import { generateInvoicePDF } from '../utils/invoice';

export default function MyOrders() {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    if (!usuario) return;
    pedidoService.listar()
      .then(data => setPedidos(data ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [usuario]);

  const handleDownload = async (pedido) => {
    setDownloading(pedido.pedido_id);
    try {
      const detalle = await pedidoService.detalle(pedido.pedido_id);
      const items = detalle.items || detalle.detalle || [];
      const subtotal = Number(pedido.subtotal || 0);
      const envio = Number(pedido.costo_envio || (subtotal >= 999 ? 0 : 99));
      const total = Number(pedido.total || subtotal + envio);
      const doc = generateInvoicePDF({
        pedido,
        items,
        subtotal,
        envio,
        total,
        direccion: { calle: pedido.direccion || '—', ciudad: pedido.ciudad || '—', estado: pedido.estado || '—' },
        cliente: { nombre: usuario?.nombre || '—', apellido: '', email: usuario?.email || '—' },
        factura_id: pedido.factura_id || `FAC-${pedido.pedido_id?.slice(0, 8)?.toUpperCase()}`,
      });
      doc.save(`factura-${pedido.pedido_id?.slice(0, 8)?.toLowerCase() || 'pedido'}.pdf`);
    } catch (err) {
      console.error('Error al descargar factura:', err);
    } finally {
      setDownloading(null);
    }
  };

  if (!usuario) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-neon-pink brutal-border rounded-full flex items-center justify-center mx-auto mb-4 animate-wiggle">
          <span className="text-3xl">🔒</span>
        </div>
        <h2 className="text-2xl font-black text-text mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>Inicia sesion para ver tus pedidos</h2>
        <Link to="/login" className="bg-primary text-white font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all inline-block">Iniciar sesion</Link>
      </div>
    );
  }

  const statusStyles = {
    pendiente: 'bg-yellow-100 text-yellow-800',
    procesando: 'bg-blue-100 text-blue-800',
    enviado: 'bg-purple-100 text-purple-800',
    entregado: 'bg-green-100 text-green-800',
    cancelado: 'bg-red-100 text-red-800',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-secondary brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center animate-wiggle">
          <IconPackage className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Mis pedidos</h1>
          <p className="text-text-muted text-sm">Historial de tus compras en Patitas</p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <p className="text-text font-black text-xl animate-pulse">Cargando pedidos...</p>
        </div>
      )}

      {!loading && pedidos.length === 0 && (
        <div className="text-center py-20 bg-white brutal-border brutal-shadow-lg rounded-2xl">
          <div className="w-20 h-20 bg-accent brutal-border rounded-full flex items-center justify-center mx-auto mb-4 animate-wiggle">
            <IconShoppingBag className="w-10 h-10 text-text" />
          </div>
          <p className="text-text font-black text-xl mb-2">No tienes pedidos aun</p>
          <Link to="/catalogo" className="bg-primary text-white font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all inline-block">
            Ir al catalogo
          </Link>
        </div>
      )}

      {!loading && pedidos.length > 0 && (
        <div className="space-y-4">
          {pedidos.map(pedido => (
            <div key={pedido.pedido_id} className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6 hover-lift transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent brutal-border rounded-xl flex items-center justify-center shrink-0">
                    <IconPackage className="w-6 h-6 text-text" />
                  </div>
                  <div>
                    <p className="font-black text-text text-sm">
                      Pedido #{pedido.pedido_id?.slice(0, 8)?.toUpperCase() || '---'}
                    </p>
                    <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
                      <IconClock className="w-3 h-3" />
                      {pedido.fecha ? new Date(pedido.fecha).toLocaleDateString('es-BO', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {pedido.items || pedido.detalle?.length || 0} producto(s)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`sticker ${statusStyles[pedido.estado] || 'bg-stone-100 text-stone-800'}`}>
                    {pedido.estado || 'pendiente'}
                  </span>
                  <span className="font-black text-primary text-lg" style={{ fontFamily: 'var(--font-family-display)' }}>
                    Bs {Number(pedido.total || 0).toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-dashed border-stone-200 flex justify-end">
                <button
                  onClick={() => handleDownload(pedido)}
                  disabled={downloading === pedido.pedido_id}
                  className="flex items-center gap-2 bg-primary text-white font-bold px-5 py-2.5 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all text-sm cursor-pointer disabled:opacity-50"
                >
                  <IconFileText className="w-4 h-4" />
                  {downloading === pedido.pedido_id ? 'Generando...' : 'Descargar factura PDF'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
