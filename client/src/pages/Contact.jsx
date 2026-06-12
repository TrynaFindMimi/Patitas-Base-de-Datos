import { useState } from 'react';
import { IconPhone, IconMail, IconMapPin, IconClock, IconCheck, IconHeart } from '../components/Icons';

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-secondary brutal-border brutal-shadow-lg rounded-2xl flex items-center justify-center mx-auto mb-4 animate-wiggle">
          <IconPhone className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-black text-text mb-3" style={{ fontFamily: 'var(--font-family-display)' }}>
          <span className="text-gradient">CONTACTO</span>
        </h1>
        <p className="text-text-muted max-w-xl mx-auto text-lg">
          Tienes dudas, sugerencias o quieres saber mas? Estamos aqui para ayudarte.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
        <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-8">
          {sent ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-secondary brutal-border brutal-shadow-lg rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-in">
                <IconCheck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black text-text mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>Mensaje enviado!</h2>
              <p className="text-text-muted mb-6">Gracias por contactarnos. Te responderemos a la brevedad.</p>
              <button
                onClick={() => setSent(false)}
                className="bg-primary text-white font-bold px-8 py-3 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all cursor-pointer"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-xl font-black text-text mb-6 flex items-center gap-2" style={{ fontFamily: 'var(--font-family-display)' }}>
                <span className="w-8 h-8 bg-primary brutal-border rounded-lg flex items-center justify-center text-white text-sm" style={{ borderColor: '#1A1A2E' }}>&#9993;</span>
                Envia un mensaje
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Nombre completo</label>
                  <input type="text" required className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="Tu nombre" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Correo electronico</label>
                  <input type="email" required className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="correo@ejemplo.com" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Telefono</label>
                  <input type="tel" className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white" placeholder="+591 777 12345" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Asunto</label>
                  <select className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white cursor-pointer">
                    <option>Consulta general</option>
                    <option>Pedidos y envios</option>
                    <option>Devoluciones</option>
                    <option>Sugerencia</option>
                    <option>Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-1 uppercase">Mensaje</label>
                  <textarea required rows={4} className="w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white resize-none" placeholder="Escribe tu mensaje aqui..." />
                </div>
                <button type="submit" className="w-full bg-primary text-white font-black py-4 rounded-xl brutal-border brutal-shadow-lg hover-lift transition-all cursor-pointer text-lg">
                  Enviar mensaje &#128640;
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6">
            <h3 className="font-black text-text text-xl mb-4" style={{ fontFamily: 'var(--font-family-display)' }}>Informacion de contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 bg-accent/10 brutal-border rounded-xl p-4 hover-lift transition-all">
                <div className="w-12 h-12 bg-primary brutal-border rounded-xl flex items-center justify-center shrink-0 brutal-shadow-sm">
                  <IconMail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-text text-sm">Correo electronico</p>
                  <p className="text-text-muted text-sm">info@patitas.bo</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-secondary/10 brutal-border rounded-xl p-4 hover-lift transition-all">
                <div className="w-12 h-12 bg-secondary brutal-border rounded-xl flex items-center justify-center shrink-0 brutal-shadow-sm">
                  <IconPhone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-text text-sm">Telefono</p>
                  <p className="text-text-muted text-sm">+591 777 12345</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-neon-purple/10 brutal-border rounded-xl p-4 hover-lift transition-all">
                <div className="w-12 h-12 bg-neon-purple brutal-border rounded-xl flex items-center justify-center shrink-0 brutal-shadow-sm">
                  <IconMapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-text text-sm">Direccion</p>
                  <p className="text-text-muted text-sm">Calle 21 de Calacoto, Edificio Pet, La Paz - Bolivia</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-neon-pink/10 brutal-border rounded-xl p-4 hover-lift transition-all">
                <div className="w-12 h-12 bg-neon-pink brutal-border rounded-xl flex items-center justify-center shrink-0 brutal-shadow-sm">
                  <IconClock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black text-text text-sm">Horarios</p>
                  <p className="text-text-muted text-sm">Lun - Vie: 9:00 - 19:00<br/>Sab: 9:00 - 13:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="gradient-tropical animate-gradient rounded-2xl brutal-border brutal-shadow-lg p-6 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 pattern-dots opacity-5" />
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 brutal-border rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ borderColor: 'white' }}>
                <IconHeart className="w-7 h-7" />
              </div>
              <h3 className="font-black text-lg mb-2" style={{ fontFamily: 'var(--font-family-display)' }}>Tienes una mascota?</h3>
              <p className="text-white/80 text-sm mb-4">Registrate para recibir consejos, ofertas exclusivas y novedades.</p>
              <button className="bg-white text-text font-bold px-6 py-2.5 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all cursor-pointer" style={{ borderColor: 'white' }}>
                Suscribirme &#10084;
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16 relative overflow-hidden">
        <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-6 relative">
          <h3 className="font-black text-text text-xl mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-family-display)' }}>
            <div className="w-8 h-8 bg-primary brutal-border rounded-lg flex items-center justify-center" style={{ borderColor: '#1A1A2E' }}>
              <IconMapPin className="w-5 h-5 text-white" />
            </div>
            Nuestra ubicacion
          </h3>
          <div className="rounded-2xl overflow-hidden brutal-border bg-stone-100 relative">
            <div className="w-full h-[300px] sm:h-[400px] relative flex items-center justify-center bg-gradient-to-br from-primary/10 via-neon-purple/10 to-secondary/10">
              <div className="absolute inset-0 pattern-dots opacity-5" />
              <div className="text-center relative z-10">
                <div className="w-24 h-24 bg-primary brutal-border brutal-shadow-lg rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
                  <IconMapPin className="w-12 h-12 text-white" />
                </div>
                <p className="font-black text-text text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>Patitas</p>
                <p className="text-text-muted">Calle 21 de Calacoto, Edificio Pet</p>
                <p className="text-text-muted">La Paz - Bolivia</p>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <span className="sticker bg-secondary text-text">Abierto ahora</span>
                  <span className="text-text-muted">Lun a Vie 9:00 - 19:00</span>
                </div>
                <div className="mt-4 flex gap-3 justify-center flex-wrap">
                  <span className="sticker bg-primary text-white">+591 777 12345</span>
                  <span className="sticker bg-neon-purple text-white">info@patitas.bo</span>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-4 w-full bg-primary text-white font-black py-4 rounded-xl brutal-border brutal-shadow hover-lift transition-all cursor-pointer flex items-center justify-center gap-2 text-lg">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            Abrir en Google Maps
          </button>
        </div>
      </section>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 bg-accent brutal-border rounded-full px-6 py-3 text-sm font-bold text-text brutal-shadow-sm">
          <IconHeart className="w-4 h-4 text-neon-pink" />
          <span>Pagina de demostracion — datos ficticios</span>
        </div>
      </div>
    </div>
  );
}
