import { Link } from 'react-router-dom';
import { IconPaw, IconCat, IconBird, IconReptile } from './Icons';

const categoryIcons = {
  perros: IconPaw,
  gatos: IconCat,
  aves: IconBird,
  reptiles: IconReptile,
};

const categoryColors = {
  perros: 'bg-primary',
  gatos: 'bg-neon-purple',
  aves: 'bg-secondary',
  reptiles: 'bg-neon-blue',
};

export default function CategoryCard({ category }) {
  const Icon = categoryIcons[category.id] || IconPaw;
  const color = categoryColors[category.id] || 'bg-primary';

  return (
    <Link
      to={`/catalogo?categoria=${category.id}`}
      className="group relative rounded-2xl overflow-hidden brutal-border brutal-shadow hover-lift block"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-5`}>
        <div className={`${color} w-12 h-12 rounded-xl brutal-border flex items-center justify-center mb-2 group-hover:animate-wiggle transition-transform`} style={{ borderColor: 'white' }}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <h3 className="text-white font-black text-xl" style={{ fontFamily: 'var(--font-family-display)' }}>{category.name}</h3>
        <p className="text-white/80 text-sm">{category.description}</p>
      </div>
    </Link>
  );
}
