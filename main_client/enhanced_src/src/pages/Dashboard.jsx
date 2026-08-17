import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate, formatRelative, PLACEHOLDER_IMG, STATUS_COLORS, getInitials } from '../utils/helpers.js';
import Loader from '../components/common/Loader.jsx';
import toast from 'react-hot-toast';

const TAB_CONFIG = [
  { key: 'lost',      label: 'My Lost',      icon: '🔴' },
  { key: 'found',     label: 'My Found',     icon: '🟢' },
  { key: 'my-claims', label: 'My Claims',    icon: '📤' },
  { key: 'incoming',  label: 'Incoming',     icon: '📬' },
];

const STATUS_STYLE = {
  active:   { background: 'rgba(96,165,250,0.12)', color: '#3b82f6', border: '1px solid rgba(96,165,250,0.25)' },
  claimed:  { background: 'rgba(245,166,35,0.12)', color: '#f5a623', border: '1px solid rgba(245,166,35,0.25)' },
  resolved: { background: 'rgba(46,196,182,0.12)', color: '#2ec4b6', border: '1px solid rgba(46,196,182,0.25)' },
  deleted:  { background: 'rgba(230,57,70,0.12)',  color: '#e63946', border: '1px solid rgba(230,57,70,0.25)' },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('lost');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (tab === 'lost' || tab === 'found') {
          res = await API.get('/items/my-items');
          setData(res.data.data.filter((i) => i.type === tab));
        } else if (tab === 'my-claims') {
          res = await API.get('/claims/my-claims?role=claimant');
          setData(res.data.data);
        } else if (tab === 'incoming') {
          res = await API.get('/claims/my-claims?role=owner');
          setData(res.data.data);
        }
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const handleDeleteItem = async (itemId) => {
    if (!confirm('Delete this item?')) return;
    try {
      await API.delete(`/items/${itemId}`);
      setData((prev) => prev.filter((i) => i._id !== itemId));
      toast.success('Item deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100%' }}>
      {/* Hero header */}
      <div style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a3270 100%)', color: '#fff', padding: '2.5rem 0 3rem' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-display font-bold text-xl overflow-hidden flex-shrink-0"
                style={{ background: 'rgba(245,166,35,0.2)', border: '2px solid rgba(245,166,35,0.4)' }}
              >
                {user?.avatar
                  ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  : getInitials(user?.name)
                }
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>Welcome back</p>
                <h1 className="font-display font-extrabold text-2xl" style={{ color: '#fff' }}>
                  {user?.name?.split(' ')[0]}'s Dashboard
                </h1>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/post-item/lost"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-display font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'rgba(230,57,70,0.2)', color: '#f87171', border: '1px solid rgba(230,57,70,0.35)' }}
              >
                🔴 + Lost
              </Link>
              <Link
                to="/post-item/found"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-display font-bold text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'rgba(46,196,182,0.2)', color: '#2ec4b6', border: '1px solid rgba(46,196,182,0.35)' }}
              >
                🟢 + Found
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" style={{ marginTop: '-1.5rem', paddingBottom: '3rem' }}>
        {/* Tabs card */}
        <div className="card mb-6 overflow-hidden" style={{ boxShadow: 'var(--shadow-md)' }}>
          <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid var(--border)' }}>
            {TAB_CONFIG.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-2 px-5 py-4 text-sm font-display font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 relative"
                style={{
                  color: tab === t.key ? 'var(--gold)' : 'var(--text-muted)',
                  borderBottom: tab === t.key ? '2px solid var(--gold)' : '2px solid transparent',
                  marginBottom: '-1px',
                  background: 'transparent',
                }}
              >
                <span>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-5">
            {loading ? (
              <Loader fullScreen={false} />
            ) : data.length === 0 ? (
              <div className="text-center py-16">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                  style={{ background: 'var(--surface-2)', border: '2px dashed var(--border)' }}
                >
                  {tab === 'lost' ? '🔴' : tab === 'found' ? '🟢' : tab === 'my-claims' ? '📤' : '📬'}
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: 'var(--text)' }}>Nothing here yet</h3>
                {(tab === 'lost' || tab === 'found') && (
                  <Link to={`/post-item/${tab}`} className="btn-primary mt-2 inline-flex">
                    Report {tab === 'lost' ? 'Lost' : 'Found'} Item
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {/* My Items */}
                {(tab === 'lost' || tab === 'found') && data.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    <img
                      src={item.image?.url || PLACEHOLDER_IMG}
                      alt={item.title}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Link
                          to={`/items/${item._id}`}
                          className="font-display font-bold text-base hover:underline truncate"
                          style={{ color: 'var(--text)' }}
                        >
                          {item.title}
                        </Link>
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-bold font-display flex-shrink-0 capitalize"
                          style={STATUS_STYLE[item.status] || { background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                        📍 {item.location} &bull; {formatDate(item.date)}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{formatRelative(item.createdAt)}</p>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <Link
                        to={`/edit-item/${item._id}`}
                        className="text-xs font-bold font-display px-3 py-1.5 rounded-lg transition-all duration-200"
                        style={{ color: '#3b82f6', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-xs font-bold font-display px-3 py-1.5 rounded-lg transition-all duration-200"
                        style={{ color: '#e63946', background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.2)' }}
                      >
                        🗑️ Del
                      </button>
                    </div>
                  </div>
                ))}

                {/* My Claims */}
                {tab === 'my-claims' && data.map((claim) => (
                  <div
                    key={claim._id}
                    className="flex gap-4 p-4 rounded-2xl"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    <img
                      src={claim.itemId?.image?.url || PLACEHOLDER_IMG}
                      alt={claim.itemId?.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                    />
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/items/${claim.itemId?._id}`}
                        className="font-display font-bold text-base hover:underline"
                        style={{ color: 'var(--text)' }}
                      >
                        {claim.itemId?.title}
                      </Link>
                      <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{claim.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`badge-${claim.status}`}>{claim.status}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatRelative(claim.createdAt)}</span>
                      </div>
                      {claim.responseMessage && (
                        <div className="mt-2 text-xs p-2.5 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                          <strong>Response:</strong> {claim.responseMessage}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Incoming Claims */}
                {tab === 'incoming' && data.map((claim) => (
                  <div
                    key={claim._id}
                    className="p-4 rounded-2xl"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold font-display flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                      >
                        {getInitials(claim.claimantId?.name)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-display font-bold" style={{ color: 'var(--text)' }}>{claim.claimantId?.name}</p>
                          <span className={`badge-${claim.status}`}>{claim.status}</span>
                        </div>
                        <Link
                          to={`/items/${claim.itemId?._id}`}
                          className="text-sm hover:underline"
                          style={{ color: 'var(--gold)' }}
                        >
                          {claim.itemId?.title}
                        </Link>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{claim.message}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatRelative(claim.createdAt)}</span>
                          {claim.status === 'pending' && (
                            <Link
                              to={`/items/${claim.itemId?._id}`}
                              className="text-xs font-bold font-display hover:underline"
                              style={{ color: 'var(--gold)' }}
                            >
                              Review →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
