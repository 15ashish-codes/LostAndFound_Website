import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios.js';
import ItemCard from '../components/common/ItemCard.jsx';
import SearchFilter from '../components/common/SearchFilter.jsx';
import Pagination from '../components/common/Pagination.jsx';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const STATS = [
  { label: 'Items Reported', value: '10+', icon: '📋', color: '#f5a623' },
  { label: 'Items Recovered', value: '5+', icon: '✅', color: '#2ec4b6' },
  { label: 'Active Users', value: '7+', icon: '👥', color: '#60a5fa' },
  { label: 'Success Rate', value: '75%', icon: '🎯', color: '#a78bfa' },
];

const Home = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: searchParams.get('type') || '',
    category: '',
    location: '',
    startDate: '',
    endDate: '',
  });
  const [page, setPage] = useState(1);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12, ...filters });
      [...params.entries()].forEach(([k, v]) => { if (!v) params.delete(k); });
      const res = await API.get(`/items?${params}`);
      setItems(res.data.data);
      setPagination(res.data.pagination);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const showHero = !filters.search && !filters.type && !filters.category && page === 1;

  return (
    <div>
      {/* ── Hero ── */}
      {showHero && (
        <section className="hero-gradient" style={{ color: '#fff', paddingBottom: '0' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ paddingTop: '5rem', paddingBottom: '5rem' }}>
            <div className="text-center max-w-3xl mx-auto animate-fade-up">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
                style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.4)', color: '#ffc55a' }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ffc55a', display: 'inline-block' }} />
                Community Lost & Found Portal
              </div>

              <h1
                className="font-display font-extrabold mb-5"
                style={{ fontSize: 'clamp(2.4rem, 6vw, 4rem)', lineHeight: '1.1', letterSpacing: '-0.02em' }}
              >
                Reuniting People With
                <br />
                <span style={{ color: '#f5a623' }}>Their Lost Belongings</span>
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', lineHeight: '1.7', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
                Report, search, and claim lost or found items in your community — fast, simple, and free.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {user ? (
                  <>
                    <Link
                      to="/post-item/lost"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-display font-bold text-sm transition-all duration-200 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #e63946, #c1121f)', color: '#fff', boxShadow: '0 6px 20px rgba(230,57,70,0.4)' }}
                    >
                      📢 Report Lost Item
                    </Link>
                    <Link
                      to="/post-item/found"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-display font-bold text-sm transition-all duration-200 hover:scale-105"
                      style={{ background: 'linear-gradient(135deg, #2ec4b6, #20a89b)', color: '#fff', boxShadow: '0 6px 20px rgba(46,196,182,0.4)' }}
                    >
                      ✋ Report Found Item
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn-primary px-8 py-3.5 text-sm font-display font-bold rounded-2xl hover:scale-105"
                    >
                      Get Started — It's Free
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-display font-bold text-sm transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-2xl mx-auto animate-fade-up-delay-1">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="glass text-center py-5 px-3 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-2xl mb-2">{s.icon}</div>
                  <div className="font-display font-extrabold text-xl" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Wave divider */}
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', marginTop: '-1px' }}>
            <path d="M0 60V30C240 0 480 60 720 40C960 20 1200 50 1440 30V60H0Z" fill="var(--surface-2)" />
          </svg>
        </section>
      )}

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SearchFilter onFilter={handleFilter} initialValues={filters} />

        {/* Type Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { label: 'All Items', value: '', icon: '🗂️' },
            { label: 'Lost', value: 'lost', icon: '🔴' },
            { label: 'Found', value: 'found', icon: '🟢' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilter({ ...filters, type: tab.value })}
              className={`tab-pill ${filters.type === tab.value ? 'active' : ''}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Results header */}
        {!loading && items.length > 0 && (
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold font-display" style={{ color: 'var(--text-muted)' }}>
              Showing <span style={{ color: 'var(--text)' }}>{items.length}</span> items
            </p>
          </div>
        )}

        {loading ? (
          <Loader fullScreen={false} />
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4"
              style={{ background: 'var(--surface)', border: '2px dashed var(--border)' }}
            >
              🔎
            </div>
            <h3 className="font-display font-bold text-xl mb-2" style={{ color: 'var(--text)' }}>No items found</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Try adjusting your search filters</p>
            {user && (
              <Link to="/post-item" className="btn-primary">
                + Report an Item
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {items.map((item) => (
                <ItemCard key={item._id} item={item} />
              ))}
            </div>
            <Pagination pagination={pagination} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
