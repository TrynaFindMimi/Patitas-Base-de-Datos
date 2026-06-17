import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, cargando, usuario } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(form.email, form.password);
      if (user?.rol === 'owner' || user?.rol === 'admin') {
        navigate('/admin/panel');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const inputClass = 'w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white';

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-black text-text mb-6" style={{ fontFamily: 'var(--font-family-display)' }}>Iniciar sesion</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-text mb-1 uppercase">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-text mb-1 uppercase">Contrasena</label>
            <input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={inputClass} />
          </div>
          <button type="submit" disabled={cargando} className="w-full bg-primary text-white font-bold py-3 rounded-xl brutal-border brutal-shadow hover-lift transition-all disabled:opacity-50">
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
          <button type="button" onClick={() => setForm({ email: 'owner@patitas.bo', password: 'owner12345' })} className="w-full bg-yellow-300 text-text font-bold py-2.5 rounded-xl brutal-border brutal-shadow-sm hover-lift transition-all text-sm">
            Acceso rápido: Dueño
          </button>
          <div className="flex items-center justify-between text-sm mt-2">
            <Link to="/registro" className="text-primary font-bold hover:underline">Registrate</Link>
            <span className="text-text-muted">¿Olvidaste tu contraseña?</span>
          </div>
        </form>
        <p className="text-center text-sm text-text-muted mt-4">
          ¿Problemas para ingresar? Contacta a <a href="mailto:soporte@patitas.bo" className="text-primary font-bold">soporte@patitas.bo</a>
        </p>
      </div>
    </div>
  );
}
