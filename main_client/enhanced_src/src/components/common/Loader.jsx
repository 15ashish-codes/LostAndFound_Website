const Loader = ({ fullScreen = true, size = 'md' }) => {
  const sizes = { sm: '32px', md: '48px', lg: '64px' };
  const dim = sizes[size];

  const spinner = (
    <div style={{ position: 'relative', width: dim, height: dim }}>
      <div
        style={{
          width: dim,
          height: dim,
          borderRadius: '50%',
          border: '3px solid var(--border)',
          borderTopColor: 'var(--gold)',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(var(--surface), 0.85)',
          backdropFilter: 'blur(4px)',
          zIndex: 9999,
        }}
      >
        <div className="flex flex-col items-center gap-3">
          {spinner}
          <p className="font-display font-semibold text-sm" style={{ color: 'var(--text-muted)' }}>Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-10">
      {spinner}
    </div>
  );
};

export default Loader;
