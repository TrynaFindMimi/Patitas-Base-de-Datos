import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { catalogoService } from '../services/catalogo.js';
import { productImages } from '../data/products';
import { useCart } from '../context/CartContext';
import { IconTruck, IconShield } from '../components/Icons';

export default function ProductDetail() {
  const { id } = useParams();
  const { addItem, items } = useCart();
  const [apiProduct, setApiProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const product = products.find(p => p.id === Number(id) || String(p.id) === id) || apiProduct;

  useEffect(() => {
    if (products.find(p => p.id === Number(id) || String(p.id) === id)) return;
    setLoading(true);
    catalogoService.listar({}).then(data => {
      const items = data.productos ?? data ?? [];
      const found = items.find(p => (p.producto_id || p._id) === id);
      if (found) {
        setApiProduct({
          id: found.producto_id || found._id,
          name: found.nombre,
          price: found.precio,
          image: productImages[found.producto_id] || `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop`,
          category: found.categoria,
          brand: found.marca || '',
          type: found.tipo || '',
          description: found.descripcion || found.nombre,
          rating: found.rating || 4,
          isNew: false,
          promo: null,
        });
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-neon-pink brutal-border rounded-full flex items-center justify-center mx-auto mb-4 animate-wiggle">
          <span className="text-3xl">&#128533;</span>
        </div>
        <h2 className="text-2xl font-black text-text mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>Producto no encontrado</h2>
        <Link to="/catalogo" className="bg-primary text-white font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all inline-block">Volver al catalogo</Link>
      </div>
    );
  }

  const inCart = items.some(i => i.id === product.id);
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <nav className="flex items-center gap-2 text-sm mb-6 flex-wrap">
        <Link to="/" className="bg-white brutal-border brutal-shadow-sm rounded-lg px-3 py-1 font-bold hover-lift transition-all">Inicio</Link>
        <span className="text-text-muted">&#8594;</span>
        <Link to="/catalogo" className="bg-white brutal-border brutal-shadow-sm rounded-lg px-3 py-1 font-bold hover-lift transition-all">Catalogo</Link>
        <span className="text-text-muted">&#8594;</span>
        <span className="sticker bg-accent text-text">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative">
          <div className="aspect-square rounded-2xl overflow-hidden brutal-border brutal-shadow-lg bg-white">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
          </div>
          {product.isNew && (
            <div className="absolute top-4 left-4 sticker bg-neon-purple text-white animate-bounce-in">NUEVO</div>
          )}
          {product.promo && (
            <div className="absolute top-4 right-4 sticker bg-neon-pink text-white animate-pulse-brutal">{product.promo.label}</div>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="sticker bg-primary text-white">{product.category}</span>
            <span className="sticker bg-accent text-text">{product.brand}</span>
            <span className="sticker bg-secondary text-text">{product.type}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-text mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={i} className={`w-6 h-6 ${i < Math.round(product.rating) ? 'text-accent' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
            ))}
            <span className="font-bold text-text ml-1">{product.rating}</span>
          </div>

          <div className="bg-accent brutal-border brutal-shadow rounded-2xl p-6 mb-6 inline-block">
            <span className="text-sm font-bold text-text uppercase">Precio</span>
            <p className="text-4xl font-black text-primary" style={{ fontFamily: 'var(--font-family-display)' }}>Bs {product.price.toFixed(2)}</p>
          </div>

          <p className="text-text-muted leading-relaxed mb-8 text-lg">{product.description}</p>

          <button
            onClick={() => addItem(product)}
            className={`w-full sm:w-auto px-10 py-4 rounded-xl text-lg font-black brutal-border brutal-shadow-lg hover-lift transition-all cursor-pointer ${
              inCart
                ? 'bg-secondary text-white'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {inCart ? '&#10003; Ya esta en tu carrito' : '&#128722; Agregar al carrito'}
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
