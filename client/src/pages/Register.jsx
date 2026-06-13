import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register, cargando } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const inputClass = 'w-full brutal-border rounded-xl px-4 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary bg-white';

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white brutal-border brutal-shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-black text-text mb-6" style={{ fontFamily: 'var(--font-family-display)' }}>Crear cuenta</h1>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-text mb-1 uppercase">Nombre</label>
              <input type="text" required value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-text mb-1 uppercase">Apellido</label>
              <input type="text" required value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-text mb-1 uppercase">Email</label>
            <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-bold text-text mb-1 uppercase">Contrasena</label>
            <input type="password" required minLength={8} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className={inputClass} />
          </div>
          <button type="submit" disabled={cargando} className="w-full bg-primary text-white font-bold py-3 rounded-xl brutal-border brutal-shadow hover-lift transition-all disabled:opacity-50">
            {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-center text-sm text-text-muted mt-4">
          Ya tienes cuenta? <Link to="/login" className="text-primary font-bold">Inicia sesion</Link>
        </p>
      </div>
    </div>
  );
}
