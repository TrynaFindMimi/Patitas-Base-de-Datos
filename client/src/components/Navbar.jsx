import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { IconHome, IconGrid, IconBell, IconTag, IconPhone, IconShoppingBag, IconPaw } from './Icons';

const navItems = [
  { path: '/', label: 'Home', icon: IconHome },
  { path: '/catalogo', label: 'Catalogo', icon: IconGrid },
  { path: '/novedades', label: 'Novedades', icon: IconBell },
  { path: '/promociones', label: 'Promos', icon: IconTag },
  { path: '/contacto', label: 'Contacto', icon: IconPhone },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <>
      <div className="bg-text text-accent overflow-hidden py-2">
        <div className="animate-marquee whitespace-nowrap flex gap-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 text-xs font-bold uppercase tracking-widest">
              <span>Envio gratis en pedidos +Bs 999</span>
              <span className="text-neon-pink">&#9733;</span>
              <span>Nuevos productos cada semana</span>
              <span className="text-secondary">&#9733;</span>
              <span>Adopcion responsable</span>
              <span className="text-neon-purple">&#9733;</span>
              <span>La Paz - Bolivia</span>
              <span className="text-neon-pink">&#9733;</span>
            </span>
          ))}
        </div>
      </div>
      <nav className="bg-bg sticky top-0 z-50 brutal-border border-t-0 border-l-0 border-r-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-10 h-10 bg-primary brutal-border brutal-shadow-sm rounded-xl flex items-center justify-center group-hover:animate-wiggle transition-transform">
                <IconPaw className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight" style={{ fontFamily: 'var(--font-family-display)' }}>
                PATI<span className="text-primary">TAS</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm hover-lift ${
                    location.pathname === item.path
                      ? 'bg-primary text-white'
                      : 'bg-white text-text hover:bg-accent'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link to="/carrito" className="relative bg-accent brutal-border brutal-shadow-sm rounded-xl p-2.5 hover-lift transition-all">
                <IconShoppingBag className="w-6 h-6 text-text" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-black brutal-border animate-bounce-in">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button
                className="lg:hidden bg-white brutal-border brutal-shadow-sm rounded-xl p-2.5 hover-lift transition-all cursor-pointer"
                onClick={() => {
                  const menu = document.getElementById('mobile-menu');
                  menu.classList.toggle('hidden');
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>

          <div id="mobile-menu" className="hidden lg:hidden pb-4 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => document.getElementById('mobile-menu').classList.add('hidden')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all brutal-border brutal-shadow-sm ${
                  location.pathname === item.path
                    ? 'bg-primary text-white'
                    : 'bg-white text-text hover:bg-accent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
