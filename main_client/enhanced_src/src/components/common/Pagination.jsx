const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalItems } = pagination;
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const btnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '36px',
    height: '36px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'Syne, sans-serif',
    border: '1.5px solid var(--border)',
    background: 'var(--surface)',
    color: 'var(--text)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    padding: '0 10px',
  };

  const btnActive = {
    ...btnBase,
    background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
    borderColor: 'transparent',
    color: 'var(--navy-mid)',
    boxShadow: '0 4px 12px rgba(245,166,35,0.3)',
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        Page <span className="font-bold" style={{ color: 'var(--text)' }}>{currentPage}</span> of{' '}
        <span className="font-bold" style={{ color: 'var(--text)' }}>{totalPages}</span>{' '}
        &bull; {totalItems} total items
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{ ...btnBase, opacity: currentPage === 1 ? 0.4 : 1 }}
        >
          ← Prev
        </button>

        {start > 1 && (
          <>
            <button onClick={() => onPageChange(1)} style={btnBase}>1</button>
            {start > 2 && <span style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            style={p === currentPage ? btnActive : btnBase}
          >
            {p}
          </button>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>}
            <button onClick={() => onPageChange(totalPages)} style={btnBase}>{totalPages}</button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          style={{ ...btnBase, opacity: !pagination.hasNextPage ? 0.4 : 1 }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;
