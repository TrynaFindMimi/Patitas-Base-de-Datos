import { Link } from 'react-router-dom';
import { IconClock } from './Icons';

export default function PromoCard({ promo }) {
  return (
    <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl overflow-hidden hover-lift group relative">
      <div className="aspect-[3/2] overflow-hidden relative">
        <img
          src={promo.image}
          alt={promo.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 right-3 bg-neon-pink text-white font-black text-lg px-4 py-2 rounded-xl brutal-border animate-pulse-brutal" style={{ borderColor: 'white' }}>
          -{promo.discount}%
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="sticker bg-accent text-text">{promo.brand}</span>
        </div>
      </div>
      <div className="p-5">
        <span className="sticker bg-neon-purple/10 text-neon-purple mb-2 inline-block">{promo.type}</span>
        <h3 className="font-black text-text mb-2 text-lg" style={{ fontFamily: 'var(--font-family-display)' }}>{promo.title}</h3>
        <p className="text-sm text-text-muted mb-3">{promo.description}</p>
        <p className="flex items-center gap-1 text-xs text-neon-pink font-bold mb-4">
          <IconClock className="w-3.5 h-3.5" /> {promo.limit}
        </p>
        <Link
          to={`/catalogo?brand=${encodeURIComponent(promo.brand)}`}
          className="block w-full text-center bg-primary text-white font-bold py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all"
        >
          Ver oferta!
        </Link>
      </div>
    </div>
  );
}
