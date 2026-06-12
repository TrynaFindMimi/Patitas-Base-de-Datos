import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { products, categories, heroImages } from '../data/products';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import { IconTruck, IconShield, IconHeart, IconPhone } from '../components/Icons';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(s => (s + 1) % heroImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const featured = products.slice(0, 4);

  return (
    <div className="relative overflow-hidden">
      <section className="relative min-h-[500px] lg:min-h-[600px]">
        <div className="absolute inset-0">
          {heroImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-text/90 via-text/60 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center min-h-[500px] lg:min-h-[600px]">
          <div className="max-w-xl">
            <div className="sticker bg-neon-pink text-white mb-4 animate-bounce-in">
              &#128062; Tienda de mascotas diferente
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-none mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>
              BIENESTAR<br/>
              <span className="text-gradient">ANIMAL</span><br/>
              CON ESTILO
            </h1>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Productos seleccionados para perros, gatos, aves y reptiles. No somos una tienda aburrida.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalogo" className="inline-block bg-primary text-white font-bold px-8 py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all" style={{ borderColor: 'white' }}>
                Explorar catalogo &#8594;
              </Link>
              <Link to="/promociones" className="inline-block bg-accent text-text font-bold px-8 py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all">
                Ver ofertas &#9733;
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {heroImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-3 rounded-full transition-all brutal-border ${
                i === currentSlide ? 'w-10 bg-primary' : 'w-3 bg-white/60'
              }`}
              style={{ borderColor: i === currentSlide ? '#1A1A2E' : 'transparent' }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="absolute top-20 right-10 animate-float hidden lg:block">
          <div className="w-20 h-20 bg-accent brutal-border rounded-2xl flex items-center justify-center brutal-shadow-lg rotate-12">
            <span className="text-3xl">&#128054;</span>
          </div>
        </div>
        <div className="absolute bottom-32 right-20 animate-float-reverse hidden lg:block">
          <div className="w-16 h-16 bg-neon-pink brutal-border rounded-full flex items-center justify-center brutal-shadow rotate-[-12deg]">
            <span className="text-2xl">&#10084;&#65039;</span>
          </div>
        </div>
      </section>

      <section className="relative py-6 bg-accent brutal-border border-l-0 border-r-0 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-6 mx-6 text-text font-black text-sm uppercase tracking-widest">
              <span>&#128062; Perros</span>
              <span>&#128049; Gatos</span>
              <span>&#128038; Aves</span>
              <span>&#129422; Reptiles</span>
              <span className="text-neon-pink">&#9733;</span>
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="sticker bg-secondary text-text mb-2 inline-block">Explora</span>
            <h2 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Categorias</h2>
          </div>
          <Link to="/catalogo" className="bg-white brutal-border brutal-shadow-sm rounded-xl px-4 py-2 font-bold text-sm hover-lift transition-all">
            Ver todas &#8594;
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="sticker bg-neon-pink text-white mb-2 inline-block">Top picks</span>
            <h2 className="text-3xl font-black text-text" style={{ fontFamily: 'var(--font-family-display)' }}>Destacados</h2>
          </div>
          <Link to="/catalogo" className="bg-white brutal-border brutal-shadow-sm rounded-xl px-4 py-2 font-bold text-sm hover-lift transition-all">
            Ver todos &#8594;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-16 py-16 relative overflow-hidden bg-text">
        <div className="absolute top-0 left-0 right-0 h-3 gradient-sunset" />
        <div className="absolute top-20 right-20 w-40 h-40 bg-neon-purple/20 blob-shape pointer-events-none animate-float" />
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-neon-pink/20 blob-shape-2 pointer-events-none animate-float-reverse" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <span className="sticker bg-accent text-text mb-3 inline-block">Por que elegirnos</span>
            <h2 className="text-3xl font-black text-white" style={{ fontFamily: 'var(--font-family-display)' }}>Por que Patitas es diferente</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 brutal-border rounded-2xl p-6 text-center hover-lift" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="w-16 h-16 bg-primary brutal-border rounded-2xl flex items-center justify-center mx-auto mb-4 brutal-shadow-sm" style={{ borderColor: 'white' }}>
                <IconTruck className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-black text-white mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>Envio rapido</h3>
              <p className="text-sm text-stone-400">Entrega en 24-48 hrs en La Paz. Envio gratis en pedidos mayores a Bs 999.</p>
            </div>
            <div className="bg-white/5 brutal-border rounded-2xl p-6 text-center hover-lift" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="w-16 h-16 bg-secondary brutal-border rounded-2xl flex items-center justify-center mx-auto mb-4 brutal-shadow-sm" style={{ borderColor: 'white' }}>
                <IconShield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-black text-white mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>Calidad garantizada</h3>
              <p className="text-sm text-stone-400">Productos originales de las mejores marcas internacionales.</p>
            </div>
            <div className="bg-white/5 brutal-border rounded-2xl p-6 text-center hover-lift" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="w-16 h-16 bg-neon-pink brutal-border rounded-2xl flex items-center justify-center mx-auto mb-4 brutal-shadow-sm" style={{ borderColor: 'white' }}>
                <IconHeart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-black text-white mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>Amor animal</h3>
              <p className="text-sm text-stone-400">Parte de nuestras ventas apoya a refugios y rescates locales.</p>
            </div>
            <div className="bg-white/5 brutal-border rounded-2xl p-6 text-center hover-lift" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <div className="w-16 h-16 bg-neon-purple brutal-border rounded-2xl flex items-center justify-center mx-auto mb-4 brutal-shadow-sm" style={{ borderColor: 'white' }}>
                <IconPhone className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-black text-white mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>Soporte dedicado</h3>
              <p className="text-sm text-stone-400">Atencion personalizada via WhatsApp y telefono.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 py-12 relative overflow-hidden gradient-tropical animate-gradient">
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="sticker bg-white text-text mb-4 inline-block">&#9993; Newsletter</div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>Descuentos exclusivos</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Suscribete a nuestro newsletter y recibe 10% de descuento en tu primera compra.</p>
          <form className="max-w-md mx-auto flex gap-3" onSubmit={e => e.preventDefault()}>
            <input
              type="email"
              placeholder="tu@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-sm brutal-border bg-white focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button className="bg-accent text-text font-bold px-6 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all cursor-pointer shrink-0">
              Suscribirme
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
