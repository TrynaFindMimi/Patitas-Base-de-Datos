import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { pedidoService } from '../services/catalogo.js';

const DEPARTAMENTOS_BOLIVIA = [
  'La Paz', 'Oruro', 'Santa Cruz', 'Cochabamba',
  'Chuquisaca', 'Tarija', 'Potosí', 'Beni', 'Pando',
];

const MOTODELIVERY_DPTOS = ['La Paz', 'Oruro', 'Santa Cruz'];

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [departamentos, setDepartamentos] = useState([]);
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    calle: '', departamento: 'La Paz', tipo_envio: 'domicilio',
    tipo_pago: 'qr', metodo_id: null,
    card: '', expiry: '', cvv: '',
  });

  useEffect(() => {
    pedidoService.departamentos()
      .then(setDepartamentos)
      .catch(() => setDepartamentos(DEPARTAMENTOS_BOLIVIA.map(n => ({ nombre: n, costo_envio: 20, tipo_envio_oferta: MOTODELIVERY_DPTOS.includes(n) ? 'domicilio' : 'paqueteria', envio_gratis_desde: 500 }))));
  }, []);

  const deptInfo = departamentos.find(d => d.nombre === form.departamento);
  const envioGratis = deptInfo ? Number(deptInfo.envio_gratis_desde) : 500;
  const costoEnvio = subtotal >= envioGratis ? 0 : (deptInfo ? Number(deptInfo.costo_envio) : 20);
  const total = subtotal + costoEnvio;
  const puedeDomicilio = MOTODELIVERY_DPTOS.includes(form.departamento);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updates = { [name]: value };
    if (name === 'departamento') {
      updates.tipo_envio = MOTODELIVERY_DPTOS.includes(value) ? 'domicilio' : 'paqueteria';
    }
    setForm(f => ({ ...f, ...updates }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('patitas_token');
      if (!token) { setError('Debes iniciar sesion para completar el pedido'); setLoading(false); return; }

      const itemsFormateados = items.map(item => ({
        producto_mongo_id: item.id || item.producto_id || 'PROD-000',
        nombre_producto: item.name || item.nombre,
        cantidad: item.quantity || item.cantidad || 1,
        precio_unitario: item.price || item.precio || 0,
      }));

      const pedido = await pedidoService.crear({
        items: itemsFormateados,
        calle: form.calle,
        departamento: form.departamento,
        tipo_envio: form.tipo_envio,
      });

      const pago = await pedidoService.pagar({
        pedido_id: pedido.pedido_id,
        tipo_pago: form.tipo_pago,
      });

      const cliente = JSON.parse(localStorage.getItem('patitas_user') || '{}');

      setOrderData({
        pedido_id: pedido.pedido_id,
        factura_id: pago.factura_id,
        factura_estado: pago.estado,
        items: itemsFormateados,
        subtotal,
        costo_envio: pedido.costo_envio ?? costoEnvio,
        total: pedido.total ?? total,
        departamento: form.departamento,
        tipo_envio: form.tipo_envio,
        tipo_pago: form.tipo_pago,
        calle: form.calle,
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

  if (submitted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-secondary brutal-border brutal-shadow-lg rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
          <span className="text-4xl">🎉</span>
        </div>
        <h2 className="text-3xl font-black text-text mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>Pedido confirmado!</h2>
        <p className="text-text-muted mb-4 text-lg">
          {orderData?.factura_estado === 'emitida'
            ? 'Tu pedido está pendiente de pago. Realiza el depósito o transferencia para activarlo.'
            : 'Tu pedido fue registrado y pagado exitosamente.'}
        </p>
        {orderData?.factura_id && (
          <p className="text-sm text-text-muted mb-2">
            Factura N°: <span className="font-bold text-primary">{orderData.factura_id}</span>
          </p>
        )}
        <p className="text-sm text-text-muted mb-6">
          Pedido N°: <span className="font-bold text-primary">#{orderData?.pedido_id?.slice(0, 8).toUpperCase()}</span>
        </p>

        {orderData?.tipo_pago === 'qr' && (
          <div className="max-w-md mx-auto bg-white brutal-border brutal-shadow-lg rounded-2xl p-6 mb-6 text-left">
            <h3 className="font-black text-text text-lg mb-3 text-center">Datos para el pago</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between bg-accent/30 rounded-xl px-4 py-3">
                <span className="font-bold">Banco:</span>
                <span>BCP - Patitas SRL</span>
              </div>
              <div className="flex justify-between bg-accent/30 rounded-xl px-4 py-3">
                <span className="font-bold">Cuenta:</span>
                <span>102-3456789-0-00</span>
              </div>
              <div className="flex justify-between bg-accent/30 rounded-xl px-4 py-3">
                <span className="font-bold">NIT/Cédula:</span>
                <span>{orderData?.cliente?.cliente_id?.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between bg-accent/30 rounded-xl px-4 py-3">
                <span className="font-bold">Monto:</span>
                <span className="text-primary font-black">Bs {Number(orderData?.total || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between bg-accent/30 rounded-xl px-4 py-3">
                <span className="font-bold">Referencia:</span>
                <span className="font-mono">{orderData?.pedido_id?.slice(0, 8).toUpperCase()}</span>
              </div>
            </div>
            <p className="text-xs text-text-muted mt-4 text-center">
              Envía el comprobante a nuestro WhatsApp para confirmar el pago.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/" className="inline-flex items-center gap-2 bg-accent text-text font-bold px-8 py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all">
            Volver al inicio
          </Link>
          <Link to="/mis-pedidos" className="inline-flex items-center gap-2 bg-primary text-white font-bold px-8 py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all">
            Ver mis pedidos
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

  const inputClass = "w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white";
  const selectClass = "w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white appearance-none";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-neon-purple brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center animate-wiggle">
          <span className="text-xl text-white">🚚</span>
        </div>
        <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Checkout</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">{error}</div>
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
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Direccion / Calle</label>
                  <input type="text" name="calle" value={form.calle} onChange={handleChange} required className={inputClass} placeholder="Av. siempre viva #123" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Departamento</label>
                  <select name="departamento" value={form.departamento} onChange={handleChange} required className={selectClass}>
                    {DEPARTAMENTOS_BOLIVIA.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Tipo de envio</label>
                  <div className="h-full flex items-center">
                    {puedeDomicilio ? (
                      <span className="bg-secondary/20 text-secondary font-bold px-4 py-3 rounded-xl brutal-border w-full text-center">
                        🏍️ Delivery en moto
                      </span>
                    ) : (
                      <span className="bg-accent/50 text-text font-bold px-4 py-3 rounded-xl brutal-border w-full text-center">
                        📦 Envio por paqueteria
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6">
              <h2 className="font-black text-text text-xl mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                <span className="w-8 h-8 bg-neon-purple brutal-border rounded-lg flex items-center justify-center text-white text-sm">2</span>
                Metodo de pago
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, tipo_pago: 'qr' }))}
                  className={`p-4 rounded-xl brutal-border text-center transition-all cursor-pointer hover-lift ${form.tipo_pago === 'qr' ? 'bg-primary text-white ring-2 ring-primary' : 'bg-white text-text'}`}
                >
                  <span className="text-2xl block mb-1">📱</span>
                  <span className="font-bold text-sm">QR / Transferencia</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, tipo_pago: 'tarjeta' }))}
                  className={`p-4 rounded-xl brutal-border text-center transition-all cursor-pointer hover-lift ${form.tipo_pago === 'tarjeta' ? 'bg-primary text-white ring-2 ring-primary' : 'bg-white text-text'}`}
                >
                  <span className="text-2xl block mb-1">💳</span>
                  <span className="font-bold text-sm">Tarjeta debito/credito</span>
                </button>
              </div>

              {form.tipo_pago === 'qr' && (
                <div className="bg-accent/30 brutal-border rounded-xl p-4 text-sm">
                  <p className="font-bold text-text mb-2">Paga con QR o transferencia:</p>
                  <ul className="text-text-muted space-y-1 list-disc list-inside">
                    <li>BCP: <strong>102-3456789-0-00</strong></li>
                    <li>Usa tu numero de pedido como referencia</li>
                    <li>Envia el comprobante a nuestro WhatsApp</li>
                  </ul>
                </div>
              )}

              {form.tipo_pago === 'tarjeta' && (
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
              )}
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white font-black py-5 rounded-xl brutal-border brutal-shadow-lg hover-lift transition-all text-xl cursor-pointer disabled:opacity-50">
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
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
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
                  <span className="font-bold">
                    Envio ({form.departamento})
                    {costoEnvio === 0 && <span className="text-secondary ml-1">Gratis!</span>}
                    {puedeDomicilio ? ' 🏍️' : ' 📦'}
                  </span>
                  <span className="font-black">{costoEnvio === 0 ? 'Gratis' : `Bs ${costoEnvio.toFixed(2)}`}</span>
                </div>
                {costoEnvio > 0 && (
                  <div className="bg-primary/10 brutal-border rounded-xl px-4 py-2 text-center">
                    <p className="text-xs font-bold text-primary">Agrega Bs {(envioGratis - subtotal).toFixed(2)} mas para envio gratis</p>
                  </div>
                )}
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
