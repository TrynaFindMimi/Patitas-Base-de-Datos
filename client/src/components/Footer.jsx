import { Link } from 'react-router-dom';
import { IconPaw, IconMail, IconPhone, IconMapPin, IconHome, IconGrid, IconBell, IconTag } from './Icons';

export default function Footer() {
  return (
    <footer className="bg-text text-white mt-16 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-3 gradient-tropical" />
      <div className="absolute top-20 right-10 w-40 h-40 bg-neon-purple/10 blob-shape pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-neon-pink/10 blob-shape-2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary brutal-border rounded-xl flex items-center justify-center" style={{ borderColor: 'white' }}>
                <IconPaw className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl" style={{ fontFamily: 'var(--font-family-display)' }}>
                PATI<span className="text-primary">TAS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-stone-400">Tu tienda de mascotas mas loca de Bolivia. Productos increibles para animales increibles.</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="w-10 h-10 bg-white/10 brutal-border rounded-xl flex items-center justify-center hover:bg-primary transition-colors hover-lift" style={{ borderColor: 'rgba(255,255,255,0.2)' }} aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 brutal-border rounded-xl flex items-center justify-center hover:bg-neon-pink transition-colors hover-lift" style={{ borderColor: 'rgba(255,255,255,0.2)' }} aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 brutal-border rounded-xl flex items-center justify-center hover:bg-neon-blue transition-colors hover-lift" style={{ borderColor: 'rgba(255,255,255,0.2)' }} aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-black text-lg mb-4 text-accent" style={{ fontFamily: 'var(--font-family-display)' }}>NAVEGACION</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors"><IconHome className="w-4 h-4" /> Home</Link></li>
              <li><Link to="/catalogo" className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors"><IconGrid className="w-4 h-4" /> Catalogo</Link></li>
              <li><Link to="/novedades" className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors"><IconBell className="w-4 h-4" /> Novedades</Link></li>
              <li><Link to="/promociones" className="flex items-center gap-2 text-stone-400 hover:text-primary transition-colors"><IconTag className="w-4 h-4" /> Promociones</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-lg mb-4 text-accent" style={{ fontFamily: 'var(--font-family-display)' }}>AYUDA</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/contacto" className="text-stone-400 hover:text-primary transition-colors">Preguntas frecuentes</Link></li>
              <li><Link to="/contacto" className="text-stone-400 hover:text-primary transition-colors">Envios y devoluciones</Link></li>
              <li><Link to="/contacto" className="text-stone-400 hover:text-primary transition-colors">Terminos y condiciones</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-black text-lg mb-4 text-accent" style={{ fontFamily: 'var(--font-family-display)' }}>CONTACTO</h3>
            <div className="space-y-3 text-sm text-stone-400">
              <p className="flex items-center gap-2"><IconMail className="w-4 h-4 text-primary" /> info@patitas.bo</p>
              <p className="flex items-center gap-2"><IconPhone className="w-4 h-4 text-primary" /> +591 777 12345</p>
              <p className="flex items-center gap-2"><IconMapPin className="w-4 h-4 text-primary" /> La Paz - Bolivia</p>
            </div>
            <div className="mt-4 bg-white/5 brutal-border rounded-xl p-3 text-center" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
              <p className="text-xs text-stone-400">Horarios</p>
              <p className="text-sm font-bold text-white">Lun-Vie 9-19 | Sab 9-13</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-500">&copy; {new Date().getFullYear()} Patitas. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span className="sticker bg-neon-pink text-white" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>La Paz</span>
            <span className="sticker bg-secondary text-text" style={{ borderColor: 'rgba(255,255,255,0.3)' }}>Bolivia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
