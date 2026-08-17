import { Link } from 'react-router-dom';

const NotFound = () => (
  <div
    className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center"
    style={{ background: 'var(--surface-2)' }}
  >
    <div
      className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl mb-6 animate-fade-up"
      style={{
        background: 'linear-gradient(135deg, rgba(245,166,35,0.12), rgba(245,166,35,0.06))',
        border: '2px solid rgba(245,166,35,0.2)',
      }}
    >
      🔍
    </div>
    <h1
      className="font-display font-extrabold animate-fade-up-delay-1"
      style={{ fontSize: '6rem', lineHeight: 1, color: 'var(--text)', letterSpacing: '-0.04em' }}
    >
      404
    </h1>
    <p className="text-xl font-display font-bold mb-2 animate-fade-up-delay-2" style={{ color: 'var(--text)' }}>
      Page not found
    </p>
    <p className="text-sm mb-8 animate-fade-up-delay-2" style={{ color: 'var(--text-muted)', maxWidth: '320px' }}>
      Looks like this page got lost too. Let's get you back on track.
    </p>
    <Link to="/" className="btn-primary px-8 py-3 text-sm animate-fade-up-delay-3">
      ← Go Home
    </Link>
  </div>
);

export default NotFound;
