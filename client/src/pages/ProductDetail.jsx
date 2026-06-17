import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { catalogoService } from '../services/catalogo.js';
import { useCart } from '../context/CartContext';
import { IconTruck, IconShield } from '../components/Icons';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, items } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    catalogoService.listar({}).then(data => {
      const todos = data.productos ?? [];
      const found = todos.find(p => (p.producto_id || p._id) === id);
      if (found) {
        const normalizado = {
          id: found.producto_id || found._id,
          name: found.nombre,
          price: found.precio,
          image: found.image || `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop`,
          category: found.categoria,
          brand: found.marca || '',
          description: found.descripcion || found.nombre,
          stock: found.stock ?? 0,
          rating: 4.5,
          isNew: false,
          promo: null,
        };
        setProduct(normalizado);
        const rel = todos
          .filter(p => p.categoria === found.categoria && (p.producto_id || p._id) !== id)
          .slice(0, 4)
          .map(p => ({
            id: p.producto_id || p._id,
            name: p.nombre,
            price: p.precio,
            image: p.image || `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop`,
            category: p.categoria,
          }));
        setRelated(rel);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-text font-black text-xl animate-pulse">Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-neon-pink brutal-border rounded-full flex items-center justify-center mx-auto mb-4 animate-wiggle">
          <span className="text-3xl">:(</span>
        </div>
        <h2 className="text-2xl font-black text-text mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>Producto no encontrado</h2>
        <Link to="/catalogo" className="bg-primary text-white font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all inline-block">Volver al catalogo</Link>
      </div>
    );
  }

  const stock = product.stock ?? 0;
  const stockLabel = stock === 0
    ? 'Agotado'
    : stock <= 10
    ? 'Quedan pocas unidades'
    : null;

  const inCart = items.some(i => i.id === product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
        <Link to="/" className="bg-white brutal-border brutal-shadow-sm rounded-lg px-3 py-1 font-bold hover-lift transition-all">Inicio</Link>
        <span className="text-text-muted">→</span>
        <Link to="/catalogo" className="bg-white brutal-border brutal-shadow-sm rounded-lg px-3 py-1 font-bold hover-lift transition-all">Catalogo</Link>
        <span className="text-text-muted">→</span>
        <span className="sticker bg-accent text-text">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative">
          <div
            className="aspect-square rounded-2xl overflow-hidden brutal-border brutal-shadow-lg bg-stone-100 cursor-crosshair group"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setZoom(s => ({ ...s, show: false }))}
          >
            <div
              className="w-full h-full transition-transform duration-100"
              style={{
                backgroundImage: `url(${product.image})`,
                backgroundSize: zoom.show ? '200%' : '100%',
                backgroundPosition: zoom.show ? `${zoom.x}% ${zoom.y}%` : 'center',
              }}
            />
            <div className="absolute inset-0 ring-1 ring-black/5 ring-inset rounded-2xl pointer-events-none" />
          </div>
          {product.isNew && (
            <div className="absolute top-4 left-4 sticker bg-neon-purple text-white animate-bounce-in">NUEVO</div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="sticker bg-primary text-white">{product.category}</span>
            <span className="sticker bg-accent text-text">{product.brand}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-text mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} className={`w-6 h-6 ${i < Math.round(product.rating) ? 'text-accent' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
            <span className="font-bold text-text ml-1">{product.rating}</span>
          </div>

          <div className="bg-accent brutal-border brutal-shadow rounded-2xl p-6 mb-6 inline-block">
            <span className="text-sm font-bold text-text uppercase">Precio</span>
            <p className="text-4xl font-black text-primary" style={{ fontFamily: 'var(--font-family-display)' }}>Bs {product.price.toFixed(2)}</p>
          </div>

          <p className="text-text-muted leading-relaxed mb-6 text-lg">{product.description}</p>

          <div className="flex items-center gap-4 mb-6">
            <div className="bg-white brutal-border brutal-shadow-sm rounded-xl px-4 py-3">
              <span className="text-xs font-bold text-text-muted uppercase">Stock</span>
              <p className={`text-lg font-black ${stock === 0 ? 'text-red-600' : stock <= 10 ? 'text-amber-600' : 'text-green-700'}`} style={{ fontFamily: 'var(--font-family-display)' }}>
                {stock === 0 ? 'Agotado' : `${stock} unid.`}
              </p>
            </div>
            {product.brand && (
              <div className="bg-white brutal-border brutal-shadow-sm rounded-xl px-4 py-3">
                <span className="text-xs font-bold text-text-muted uppercase">Marca</span>
                <p className="text-lg font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>{product.brand}</p>
              </div>
            )}
          </div>

          {stockLabel && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-6 text-sm font-bold animate-bounce-in">
              {stockLabel}
            </div>
          )}

          <button
            onClick={() => addItem(product)}
            disabled={stock === 0}
            className={`w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-black brutal-border brutal-shadow-lg hover-lift transition-all cursor-pointer ${
              stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : inCart
                  ? 'bg-secondary text-white'
                  : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {stock === 0 ? 'Agotado' : inCart ? '✓ Ya esta en tu carrito' : '🛒 Agregar al carrito'}
          </button>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <div className="bg-white brutal-border brutal-shadow-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <IconTruck className="w-5 h-5 text-primary" />
              <span className="font-bold text-sm">Envio seguro</span>
            </div>
            <div className="bg-white brutal-border brutal-shadow-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <IconShield className="w-5 h-5 text-secondary" />
              <span className="font-bold text-sm">Pago seguro</span>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="sticker bg-neon-purple text-white">Relacionados</span>
            <h2 className="text-2xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Tambien te puede gustar</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(p => (
              <div key={p.id} className="bg-white brutal-border brutal-shadow rounded-2xl overflow-hidden hover-lift group">
                <Link to={`/producto/${p.id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/producto/${p.id}`}>
                    <h3 className="font-bold text-text hover:text-primary transition-colors">{p.name}</h3>
                  </Link>
                  <span className="text-xl font-black text-primary mt-1 block" style={{ fontFamily: 'var(--font-family-display)' }}>Bs {p.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}