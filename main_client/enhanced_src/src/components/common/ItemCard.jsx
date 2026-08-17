import { Link } from 'react-router-dom';
import { formatDate, formatRelative, truncate, PLACEHOLDER_IMG } from '../../utils/helpers.js';

const ItemCard = ({ item }) => {
  return (
    <Link
      to={`/items/${item._id}`}
      className="card-hover overflow-hidden block group"
      style={{ textDecoration: 'none' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: '200px', background: 'var(--surface-2)' }}>
        <img
          src={item.image?.url || PLACEHOLDER_IMG}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
          style={{ transition: 'transform 0.5s ease' }}
          onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
        />

        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(13,27,62,0.6) 0%, transparent 50%)' }}
        />

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
            {item.type === 'lost' ? '● Lost' : '● Found'}
          </span>
        </div>

        {/* Category pill top-right */}
        <div className="absolute top-3 right-3">
          <span
            className="text-xs px-2.5 py-1 rounded-full font-semibold"
            style={{ background: 'rgba(13,27,62,0.65)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            {item.category}
          </span>
        </div>

        {/* Status overlay */}
        {item.status !== 'active' && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(13,27,62,0.65)' }}>
            <span
              className="font-display font-bold text-sm px-4 py-1.5 rounded-full capitalize"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {item.status}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-display font-bold text-base mb-1.5 line-clamp-1 transition-colors duration-200"
          style={{ color: 'var(--text)' }}
          // Title color on hover handled by group
        >
          {item.title}
        </h3>

        <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>
          {truncate(item.description, 80)}
        </p>

        <div
          className="flex items-center justify-between text-xs pt-3"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          <span className="flex items-center gap-1.5 truncate max-w-[60%]">
            <span>📍</span>
            <span className="truncate">{item.location}</span>
          </span>
          <span>{formatRelative(item.createdAt)}</span>
        </div>

        {/* Reporter */}
        {item.userId && (
          <div className="mt-3 flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold font-display flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--navy-mid), var(--navy-light))' }}
            >
              {item.userId.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs truncate flex-1" style={{ color: 'var(--text-muted)' }}>
              by {item.userId.name}
            </span>
            <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
              {formatDate(item.date)}
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ItemCard;
