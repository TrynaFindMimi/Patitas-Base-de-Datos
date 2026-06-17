import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IconShoppingBag, IconMinus, IconPlus } from '../components/Icons';

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-accent brutal-border brutal-shadow-lg rounded-full flex items-center justify-center mx-auto mb-6 animate-wiggle">
          <IconShoppingBag className="w-12 h-12 text-text" />
        </div>
        <h2 className="text-3xl font-black text-text mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>Tu carrito esta vacio</h2>
        <p className="text-text-muted mb-6">Explora nuestro catalogo y encuentra lo que necesitas para tu mascota.</p>
        <Link to="/catalogo" className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all">Ir al catalogo &#8594;</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-primary brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center animate-wiggle">
          <IconShoppingBag className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Carrito de compras</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item, index) => (
            <div key={item.id} className="bg-white brutal-border brutal-shadow rounded-2xl p-4 flex gap-4 hover-lift transition-all" style={{ animationDelay: `${index * 100}ms` }}>
              <Link to={`/producto/${item.id}`} className="w-24 h-24 rounded-xl overflow-hidden brutal-border shrink-0 bg-stone-100 group">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/producto/${item.id}`}>
                  <h3 className="font-bold text-text hover:text-primary transition-colors">{item.name}</h3>
                </Link>
                <p className="text-primary font-black text-lg" style={{ fontFamily: 'var(--font-family-display)' }}>Bs {item.price.toFixed(2)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-9 h-9 rounded-xl brutal-border bg-white flex items-center justify-center hover:bg-accent transition-colors cursor-pointer brutal-shadow-sm hover-lift disabled:opacity-30 disabled:cursor-not-allowed">
                      <IconMinus className="w-3 h-3" />
                    </button>
                    <span className="w-10 h-9 rounded-xl brutal-border bg-accent flex items-center justify-center font-black text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= (item.stock ?? 9999)} className="w-9 h-9 rounded-xl brutal-border bg-white flex items-center justify-center hover:bg-accent transition-colors cursor-pointer brutal-shadow-sm hover-lift disabled:opacity-30 disabled:cursor-not-allowed">
                      <IconPlus className="w-3 h-3" />
                    </button>
                  </div>
                  {item.stock !== undefined && item.quantity >= item.stock && (
                    <p className="text-xs font-bold text-amber-600 mt-1">Stock maximo alcanzado</p>
                  )}
                  {item.stock !== undefined && item.stock - item.quantity <= 5 && item.quantity < item.stock && (
                    <p className="text-xs font-bold text-amber-600 mt-1">Solo quedan {item.stock - item.quantity} unid. disponibles</p>
                  )}
                  <button onClick={() => removeItem(item.id)} className="sticker bg-neon-pink text-white cursor-pointer hover-lift transition-all">Eliminar</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-accent brutal-border brutal-shadow-lg rounded-2xl p-6 h-fit sticky top-24">
          <h3 className="font-black text-text text-xl mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>Resumen</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between bg-white brutal-border rounded-xl px-4 py-3">
              <span className="font-bold">Subtotal</span>
              <span className="font-black">Bs {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between bg-white brutal-border rounded-xl px-4 py-3">
              <span className="font-bold">Envio</span>
              <span className="font-black">Calculado en checkout</span>
            </div>
            <div className="bg-primary/10 brutal-border rounded-xl px-4 py-2 text-center">
              <p className="text-xs font-bold text-primary">Envio gratis desde Bs 500 a todo el pais</p>
            </div>
            <div className="bg-text text-white brutal-border rounded-xl px-4 py-4 flex justify-between">
              <span className="font-black text-lg">Subtotal</span>
              <span className="font-black text-lg text-accent" style={{ fontFamily: 'var(--font-family-display)' }}>Bs {subtotal.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout" className="block mt-6 bg-primary text-white text-center font-black py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all text-lg">
            Proceder al pago &#8594;
          </Link>
        </div>
      </div>
    </div>
  );
}
