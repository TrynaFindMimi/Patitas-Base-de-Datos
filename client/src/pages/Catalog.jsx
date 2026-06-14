import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { catalogoService } from '../services/catalogo.js';
import { productImages } from '../data/products';
import ProductCard from '../components/ProductCard';
import { IconSearch } from '../components/Icons';

const CATEGORIAS = [
  { id: 'comida',     nombre: 'Comida' },
  { id: 'ropa',       nombre: 'Ropa' },
  { id: 'juguetes',   nombre: 'Juguetes' },
  { id: 'accesorios', nombre: 'Accesorios' },
  { id: 'salud',      nombre: 'Salud' },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  const activeCategory = searchParams.get('categoria') || '';
  const activeEtiqueta = searchParams.get('etiqueta') || '';

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchParams({});
    setPrecioMin('');
    setPrecioMax('');
  };

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (activeCategory) params.categoria = activeCategory;
        if (activeEtiqueta) params.etiqueta = activeEtiqueta;
        if (precioMin) params.precio_min = precioMin;
        if (precioMax) params.precio_max = precioMax;

        const data = await catalogoService.listar(params);
        setProductos(data.productos ?? []);
        setTotal(data.total ?? (data.productos?.length ?? 0));
      } catch (err) {
        setError('Error al cargar productos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();
  }, [activeCategory, activeEtiqueta, precioMin, precioMax]);

  const hasAnyFilter = activeCategory || activeEtiqueta || precioMin || precioMax;

const productosNormalizados = productos.map(p => ({
  id: p.producto_id || p._id,
  producto_id: p.producto_id,
  name: p.nombre,
  price: p.precio,
  brand: p.marca,
  category: p.categoria,
  image: productImages[p.producto_id] || `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop`,
  description: p.descripcion || p.nombre,
}));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-neon-purple brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center animate-wiggle">
          <IconSearch className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Catalogo</h1>
          <p className="text-text-muted text-sm">Comida, Ropa, Juguetes, Accesorios y Salud para tu mascota</p>
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
                className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${!activeCategory ? 'bg-primary text-white' : 'bg-white text-text-muted'}`}
              >
                Todas
              </button>
              {CATEGORIAS.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilter('categoria', cat.id)}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${activeCategory === cat.id ? 'bg-primary text-white' : 'bg-white text-text-muted'}`}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>

            <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-wider">Precio</h4>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Minimo</label>
                <input type="number" value={precioMin} onChange={e => setPrecioMin(e.target.value)}
                  className="w-full brutal-border rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="0" />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Maximo</label>
                <input type="number" value={precioMax} onChange={e => setPrecioMax(e.target.value)}
                  className="w-full brutal-border rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="Sin limite" />
              </div>
            </div>

            <h4 className="text-sm font-bold text-text mb-2 uppercase tracking-wider">Etiqueta</h4>
            <div className="space-y-1">
              {['premium', 'natural', 'invierno', 'interactivo', 'dental', 'seguridad', 'ortopedica', 'medicado'].map(tag => (
                <button key={tag} onClick={() => setFilter('etiqueta', activeEtiqueta === tag ? '' : tag)}
                  className={`block w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift cursor-pointer ${activeEtiqueta === tag ? 'bg-primary text-white' : 'bg-white text-text-muted'}`}>
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <span className="sticker bg-primary text-white">{total} productos</span>
            {hasAnyFilter && (
              <button onClick={clearFilters} className="sticker bg-neon-pink text-white cursor-pointer hover-lift transition-all">
                Quitar filtros
              </button>
            )}
          </div>

          {loading && (
            <div className="text-center py-20">
              <p className="text-text font-black text-xl animate-pulse">Cargando productos...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm font-medium">
              {error}
            </div>
          )}

          {!loading && !error && productosNormalizados.length === 0 && (
            <div className="text-center py-20 bg-white brutal-border brutal-shadow-lg rounded-2xl">
              <p className="text-text font-black text-xl mb-2">No se encontraron productos</p>
              <button onClick={clearFilters} className="bg-primary text-white font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all cursor-pointer">
                Limpiar filtros
              </button>
            </div>
          )}

          {!loading && productosNormalizados.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productosNormalizados.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}