import { Link } from 'react-router-dom';
import { latestNews, products } from '../data/products';
import ProductCard from '../components/ProductCard';
import { IconBell, IconSearch } from '../components/Icons';

export default function LatestNews() {
  const getNewsProducts = (ids) => products.filter(p => ids.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-neon-blue brutal-border brutal-shadow-lg rounded-2xl flex items-center justify-center mx-auto mb-4 animate-wiggle">
          <IconBell className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black text-text mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
          <span className="text-gradient">NOVEDADES</span>
        </h1>
        <p className="text-text-muted max-w-xl mx-auto text-lg">
          Mantente al dia con los lanzamientos mas recientes y las promociones para ti y tu mascota.
        </p>
      </div>

      <div className="space-y-10">
        {latestNews.map((news, index) => {
          const newsProds = getNewsProducts(news.products);
          const colors = ['bg-primary', 'bg-neon-pink', 'bg-neon-purple', 'bg-secondary', 'bg-neon-blue', 'bg-accent'];
          const bgColor = colors[index % colors.length];
          return (
            <article key={news.id} className="bg-white brutal-border brutal-shadow-lg rounded-2xl overflow-hidden hover-lift transition-all">
              <div className={`${bgColor} h-2`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <span className="sticker bg-text text-white mb-2 inline-block">
                      {new Date(news.date).toLocaleDateString('es-BO', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <h2 className="text-xl font-black text-text mt-2" style={{ fontFamily: 'var(--font-family-display)' }}>{news.title}</h2>
                  </div>
                  <span className={`sticker ${bgColor} text-white`}>
                    {index === 0 ? 'ULTIMA' : 'NUEVO'}
                  </span>
                </div>
                <p className="text-text-muted mb-4 leading-relaxed text-lg">{news.description}</p>
                {newsProds.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {newsProds.map(p => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
                {newsProds.length === 0 && (
                  <div className="bg-accent/20 brutal-border rounded-xl p-6 text-center">
                    <p className="text-text-muted text-sm mb-2">Esta noticia no esta asociada a un producto.</p>
                    <Link to="/catalogo" className="bg-primary text-white font-bold px-4 py-2 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all inline-block text-sm">
                      Explorar catalogo &#8594;
                    </Link>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-12 gradient-ocean rounded-2xl brutal-border brutal-shadow-lg p-8 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-5" />
        <div className="relative">
          <div className="w-16 h-16 bg-white/20 brutal-border rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ borderColor: 'white' }}>
            <IconSearch className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>No encuentras lo que buscas?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">Revisa nuestro catalogo completo con cientos de productos para tu mascota.</p>
          <Link to="/catalogo" className="inline-block bg-white text-text font-black px-8 py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all" style={{ borderColor: 'white' }}>
            Ir al catalogo &#8594;
          </Link>
        </div>
      </div>
    </div>
  );
}
