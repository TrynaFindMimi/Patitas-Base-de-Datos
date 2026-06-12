import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products, categories, brands, productTypes } from '../data/products';
import ProductCard from '../components/ProductCard';
import { IconSearch, IconPaw, IconCat, IconBird, IconReptile } from '../components/Icons';

const categoryIcons = {
  perros: IconPaw,
  gatos: IconCat,
  aves: IconBird,
  reptiles: IconReptile,
};

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 99999]);

  const activeCategory = searchParams.get('categoria') || '';
  const activeBrand = searchParams.get('brand') || '';
  const activeType = searchParams.get('tipo') || '';

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPriceRange([0, 99999]);
  };

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (activeCategory && p.category !== activeCategory) return false;
      if (activeBrand && p.brand !== activeBrand) return false;
      if (activeType && p.type !== activeType) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });
  }, [activeCategory, activeBrand, activeType, priceRange]);

  const hasAnyFilter = activeCategory || activeBrand || activeType || priceRange[0] > 0 || priceRange[1] < 99999;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-neon-purple brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center animate-wiggle">
          <IconSearch className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Catalogo</h1>
          <p className="text-text-muted text-sm">Encuentra lo mejor para tu mascota</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <div className="bg-accent brutal-border brutal-shadow-lg rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-text text-lg" style={{ fontFamily: 'var(--font-family-display)' }}>Filtros</h3>
              {hasAnyFilter && (
                <button onClick={clearFilters} className="sticker bg-neon-pink text-white cursor-pointer hover-lift transition-all">
                  Limpiar
                </button>
              )}
            </div>

            <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-wider">Categoria</h4>
            <div className="space-y-1 mb-5">
              <button
                onClick={() => setFilter('categoria', '')}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${!activeCategory ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-white'}`}
              >
                Todas
              </button>
              {categories.map(cat => {
                const Icon = categoryIcons[cat.id];
                return (
                  <button
                    key={cat.id}
                    onClick={() => setFilter('categoria', cat.id)}
                    className={`flex items-center gap-2 w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${activeCategory === cat.id ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-white'}`}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-wider">Marca</h4>
            <div className="space-y-1 mb-5 max-h-48 overflow-y-auto">
              <button
                onClick={() => setFilter('brand', '')}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${!activeBrand ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-white'}`}
              >
                Todas
              </button>
              {brands.map(b => (
                <button
                  key={b}
                  onClick={() => setFilter('brand', b)}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${activeBrand === b ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-white'}`}
                >
                  {b}
                </button>
              ))}
            </div>

            <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-wider">Tipo</h4>
            <div className="space-y-1 mb-5">
              <button
                onClick={() => setFilter('tipo', '')}
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${!activeType ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-white'}`}
              >
                Todos
              </button>
              {productTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setFilter('tipo', t)}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${activeType === t ? 'bg-primary text-white' : 'bg-white text-text-muted hover:bg-white'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-wider">Precio</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Minimo</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
                  className="w-full brutal-border rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Maximo</label>
                <input
                  type="number"
                  value={priceRange[1] >= 99999 ? '' : priceRange[1]}
                  onChange={e => setPriceRange([priceRange[0], e.target.value ? Number(e.target.value) : 99999])}
                  className="w-full brutal-border rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                  placeholder="Sin limite"
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="sticker bg-primary text-white">{filtered.length} productos</span>
            {hasAnyFilter && (
              <button onClick={clearFilters} className="sticker bg-neon-pink text-white cursor-pointer hover-lift transition-all">
                Quitar filtros
              </button>
            )}
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white brutal-border brutal-shadow-lg rounded-2xl">
              <div className="w-20 h-20 bg-accent brutal-border rounded-full flex items-center justify-center mx-auto mb-4 animate-wiggle">
                <IconSearch className="w-10 h-10 text-text" />
              </div>
              <p className="text-text font-black text-xl mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>No se encontraron productos</p>
              <p className="text-text-muted text-sm mb-6">Intenta con otros filtros o revisa nuestro catalogo completo.</p>
              <button onClick={clearFilters} className="bg-primary text-white font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all cursor-pointer">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
