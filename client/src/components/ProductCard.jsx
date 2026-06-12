import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem, items } = useCart();
  const inCart = items.some(i => i.id === product.id);

  return (
    <div className="bg-white brutal-border brutal-shadow rounded-2xl overflow-hidden hover-lift group relative">
      {product.isNew && (
        <div className="absolute top-3 left-3 z-10 sticker bg-neon-purple text-white animate-bounce-in">
          NUEVO
        </div>
      )}
      {product.promo && (
        <div className="absolute top-3 right-3 z-10 sticker bg-neon-pink text-white animate-pulse-brutal">
          {product.promo.label}
        </div>
      )}
      <Link to={`/producto/${product.id}`}>
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="sticker bg-accent text-text">{product.category}</span>
          <span className="sticker bg-bg text-text-muted">{product.brand}</span>
        </div>
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-bold text-text mt-1 mb-2 line-clamp-2 hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-family-display)' }}>{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }, (_, i) => (
            <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-accent' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-black text-primary" style={{ fontFamily: 'var(--font-family-display)' }}>Bs {product.price.toFixed(2)}</span>
          <button
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className={`px-4 py-2 rounded-xl text-sm font-bold brutal-border brutal-shadow-sm hover-lift transition-all cursor-pointer ${
              inCart
                ? 'bg-secondary text-white'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            {inCart ? 'Agregado!' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  );
}
