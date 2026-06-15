import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IconCheck, IconFileText } from '../components/Icons';
import { pedidoService } from '../services/catalogo.js';
import { generateInvoicePDF } from '../utils/invoice.js';

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '', city: '', state: '', zip: '', card: '', expiry: '', cvv: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('patitas_token');
      if (!token) {
        setError('Debes iniciar sesion para completar el pedido');
        setLoading(false);
        return;
      }
      const itemsFormateados = items.map(item => ({
        producto_mongo_id: item.id || item.producto_id || 'PROD-000',
        nombre_producto: item.name || item.nombre,
        cantidad: item.quantity || item.cantidad || 1,
        precio_unitario: item.price || item.precio || 0
      }));

      const pedido = await pedidoService.crear({
        items: itemsFormateados,
        calle: form.address,
        ciudad: form.city,
        estado: form.state,
        codigo_postal: form.zip,
      });

      const pago = await pedidoService.pagar({ pedido_id: pedido.pedido_id, metodo_id: 1 });

      const cliente = JSON.parse(localStorage.getItem('patitas_user') || '{}');

      setOrderData({
        pedido_id: pedido.pedido_id,
        factura_id: pago.factura_id,
        items: itemsFormateados,
        subtotal,
        envio: subtotal >= 999 ? 0 : 99,
        total: subtotal + (subtotal >= 999 ? 0 : 99),
        direccion: {
          calle: form.address,
          ciudad: form.city,
          estado: form.state,
        },
        cliente,
        fecha: new Date().toISOString(),
      });
      clearCart();
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!orderData) return;
    setDownloading(true);
    try {
      const doc = generateInvoicePDF(orderData);
      doc.save(`factura-${orderData.pedido_id.slice(0, 8).toLowerCase()}.pdf`);
    } catch (err) {
      console.error('Error al generar PDF:', err);
    } finally {
      setDownloading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-secondary brutal-border brutal-shadow-lg rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
          <IconCheck className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-3xl font-black text-text mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>Pedido confirmado!</h2>
        <p className="text-text-muted mb-2 text-lg">Tu pedido fue registrado y pagado exitosamente.</p>
        {orderData?.factura_id && (
          <p className="text-sm text-text-muted mb-6">Factura N°: <span className="font-bold text-primary">{orderData.factura_id}</span></p>
        )}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleDownloadInvoice}
            disabled={downloading}
            className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all cursor-pointer disabled:opacity-50"
          >
            <IconFileText className="w-5 h-5" />
            {downloading ? 'Generando...' : 'Descargar factura PDF'}
          </button>
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-text font-bold px-8 py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-black text-text mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>No hay productos en tu carrito</h2>
        <Link to="/catalogo" className="bg-primary text-white font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all inline-block">Ir al catalogo</Link>
      </div>
    );
  }

  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;
  const inputClass = "w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-neon-purple brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center animate-wiggle">
          <span className="text-xl text-white">💳</span>
        </div>
        <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Checkout</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6">
              <h2 className="font-black text-text text-xl mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                <span className="w-8 h-8 bg-primary brutal-border rounded-lg flex items-center justify-center text-white text-sm">1</span>
                Informacion de envio
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Nombre completo</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Telefono</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Direccion</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Ciudad</label>
                  <input type="text" name="city" value={form.city} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Estado</label>
                  <input type="text" name="state" value={form.state} onChange={handleChange} required className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Codigo Postal</label>
                  <input type="text" name="zip" value={form.zip} onChange={handleChange} required className={inputClass} />
                </div>
              </div>
            </div>

            <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6">
              <h2 className="font-black text-text text-xl mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                <span className="w-8 h-8 bg-neon-purple brutal-border rounded-lg flex items-center justify-center text-white text-sm">2</span>
                Pago
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Numero de tarjeta</label>
                  <input type="text" name="card" value={form.card} onChange={handleChange} required placeholder="1234 5678 9012 3456" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Vencimiento</label>
                  <input type="text" name="expiry" value={form.expiry} onChange={handleChange} required placeholder="MM/AA" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">CVV</label>
                  <input type="text" name="cvv" value={form.cvv} onChange={handleChange} required placeholder="123" className={inputClass} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-black py-5 rounded-xl brutal-border brutal-shadow-lg hover-lift transition-all text-xl cursor-pointer disabled:opacity-50">
              {loading ? 'Procesando pedido...' : `Confirmar pedido — Bs ${total.toFixed(2)}`}
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-accent brutal-border brutal-shadow-lg rounded-2xl p-6 sticky top-24">
              <h3 className="font-black text-text text-xl mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>Resumen del pedido</h3>
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 bg-white brutal-border rounded-xl p-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden brutal-border shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text truncate">{item.name}</p>
                      <p className="text-xs text-text-muted">Cant: {item.quantity}</p>
                      <p className="text-sm font-black text-primary">Bs {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2 mt-4 pt-4 border-t-2 border-dashed border-text/20">
                <div className="flex justify-between bg-white brutal-border rounded-xl px-4 py-2 text-sm">
                  <span className="font-bold">Subtotal</span>
                  <span className="font-black">Bs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between bg-white brutal-border rounded-xl px-4 py-2 text-sm">
                  <span className="font-bold">Envio</span>
                  <span className="font-black">{shipping === 0 ? 'Gratis!' : `Bs ${shipping.toFixed(2)}`}</span>
                </div>
                <div className="bg-text text-white brutal-border rounded-xl px-4 py-3 flex justify-between">
                  <span className="font-black text-lg">Total</span>
                  <span className="font-black text-lg text-accent" style={{ fontFamily: 'var(--font-family-display)' }}>Bs {total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}