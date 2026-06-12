import { Link } from 'react-router-dom';
import { promotions, brands, productTypes } from '../data/products';
import PromoCard from '../components/PromoCard';
import { useState, useMemo } from 'react';
import { IconTag, IconClock } from '../components/Icons';

export default function Promotions() {
  const [filterBrand, setFilterBrand] = useState('');
  const [filterType, setFilterType] = useState('');

  const filtered = useMemo(() => {
    return promotions.filter(p => {
      if (filterBrand && p.brand !== filterBrand) return false;
      if (filterType && p.type !== filterType) return false;
      return true;
    });
  }, [filterBrand, filterType]);

  const groupedByBrand = useMemo(() => {
    const grouped = {};
    filtered.forEach(p => {
      if (!grouped[p.brand]) grouped[p.brand] = [];
      grouped[p.brand].push(p);
    });
    return grouped;
  }, [filtered]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-neon-pink brutal-border brutal-shadow-lg rounded-2xl flex items-center justify-center mx-auto mb-4 animate-wiggle">
          <IconTag className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black text-text mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
          <span className="text-gradient">PROMOCIONES</span>
        </h1>
        <p className="text-text-muted max-w-xl mx-auto text-lg">
          Descuentos, combos y ofertas limitadas. El mejor cuidado para tu mascota al mejor precio.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-center mb-10">
        <select
          value={filterBrand}
          onChange={e => setFilterBrand(e.target.value)}
          className="brutal-border brutal-shadow-sm rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white hover-lift transition-all cursor-pointer"
        >
          <option value="">Todas las marcas</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="brutal-border brutal-shadow-sm rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white hover-lift transition-all cursor-pointer"
        >
          <option value="">Todos los tipos</option>
          {productTypes.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {(filterBrand || filterType) && (
          <button
            onClick={() => { setFilterBrand(''); setFilterType(''); }}
            className="sticker bg-neon-pink text-white cursor-pointer hover-lift transition-all"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {Object.entries(groupedByBrand).length === 0 ? (
        <div className="text-center py-16 bg-white brutal-border brutal-shadow-lg rounded-2xl">
          <div className="w-20 h-20 bg-accent brutal-border rounded-full flex items-center justify-center mx-auto mb-4 animate-wiggle">
            <IconTag className="w-10 h-10 text-text" />
          </div>
          <p className="text-text font-black text-xl mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>No hay promociones con esos filtros</p>
          <button
            onClick={() => { setFilterBrand(''); setFilterType(''); }}
            className="bg-primary text-white font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all cursor-pointer mt-4"
          >
            Ver todas las promociones
          </button>
        </div>
      ) : (
        Object.entries(groupedByBrand).map(([brand, promos]) => (
          <section key={brand} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="sticker bg-primary text-white">{brand}</span>
                <h2 className="text-2xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>{brand}</h2>
              </div>
              <Link
                to={`/catalogo?brand=${encodeURIComponent(brand)}`}
                className="bg-white brutal-border brutal-shadow-sm rounded-xl px-4 py-2 font-bold text-sm hover-lift transition-all"
              >
                Ver productos &#8594;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map(p => (
                <PromoCard key={p.id} promo={p} />
              ))}
            </div>
          </section>
        ))
      )}

      <section className="mt-16 gradient-fire rounded-2xl brutal-border brutal-shadow-lg p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="relative">
          <div className="w-16 h-16 bg-white/20 brutal-border rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-brutal" style={{ borderColor: 'white' }}>
            <IconClock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>Ofertas por tiempo limitado</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Aprovecha estos descuentos antes de que se agoten. Renovamos promociones cada semana.</p>
          <Link to="/catalogo" className="inline-block bg-white text-text font-black px-8 py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all" style={{ borderColor: 'white' }}>
            Explorar ofertas &#8594;
          </Link>
        </div>
      </section>
    </div>
  );
}
