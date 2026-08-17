import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios.js';
import Loader from '../components/common/Loader.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { formatDate, formatRelative, PLACEHOLDER_IMG, getInitials } from '../utils/helpers.js';

const ItemDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = user && item && item.userId?._id === user._id;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await API.get(`/items/${id}`);
        setItem(res.data.data);
      } catch {
        toast.error('Item not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  useEffect(() => {
    if (isOwner || isAdmin) {
      API.get(`/claims/item/${id}`).then((res) => setClaims(res.data.data)).catch(() => {});
    }
  }, [isOwner, isAdmin, id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await API.delete(`/items/${id}`);
      toast.success('Item deleted');
      navigate('/dashboard');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const handleClaimUpdate = async (claimId, status) => {
    try {
      await API.put(`/claims/${claimId}`, { status });
      setClaims((prev) => prev.map((c) => c._id === claimId ? { ...c, status } : c));
      toast.success(`Claim ${status}`);
      if (status === 'approved') setItem((prev) => ({ ...prev, status: 'claimed' }));
    } catch {
      toast.error('Failed to update claim');
    }
  };

  if (loading) return <Loader />;
  if (!item) return null;

  const statusStyle = {
    active:   { bg: 'rgba(96,165,250,0.12)',  color: '#3b82f6',  border: 'rgba(96,165,250,0.3)'  },
    claimed:  { bg: 'rgba(245,166,35,0.12)',  color: '#f5a623',  border: 'rgba(245,166,35,0.3)'  },
    resolved: { bg: 'rgba(46,196,182,0.12)',  color: '#2ec4b6',  border: 'rgba(46,196,182,0.3)'  },
  }[item.status] || { bg: 'var(--surface-2)', color: 'var(--text-muted)', border: 'var(--border)' };

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100%', paddingBottom: '3rem' }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
            <Link to="/" className="hover:underline" style={{ color: 'var(--gold)' }}>Home</Link>
            <span>/</span>
            <span className="truncate max-w-xs" style={{ color: 'var(--text)' }}>{item.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left: Image */}
          <div className="space-y-4">
            <div className="card overflow-hidden" style={{ boxShadow: 'var(--shadow-md)' }}>
              <div className="relative">
                <img
                  src={item.image?.url || PLACEHOLDER_IMG}
                  alt={item.title}
                  className="w-full object-cover"
                  style={{ height: '340px' }}
                  onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
                    {item.type === 'lost' ? '● Lost' : '● Found'}
                  </span>
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-bold font-display capitalize"
                    style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Actions */}
            {(isOwner || isAdmin) && (
              <div className="flex gap-3">
                {isOwner && (
                  <Link to={`/edit-item/${item._id}`} className="btn-secondary flex-1 text-center text-sm">
                    ✏️ Edit Item
                  </Link>
                )}
                {!deleteConfirm ? (
                  <button onClick={() => setDeleteConfirm(true)} className="btn-danger flex-1 text-sm">
                    🗑️ Delete
                  </button>
                ) : (
                  <div className="flex gap-2 flex-1">
                    <button onClick={handleDelete} disabled={deleting} className="btn-danger flex-1 text-sm">
                      {deleting ? 'Deleting…' : 'Confirm Delete'}
                    </button>
                    <button onClick={() => setDeleteConfirm(false)} className="btn-secondary px-3 text-sm">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-4">
            {/* Main info */}
            <div className="card p-6" style={{ boxShadow: 'var(--shadow-md)' }}>
              <h1 className="font-display font-extrabold text-2xl mb-4" style={{ color: 'var(--text)' }}>
                {item.title}
              </h1>

              <div className="grid grid-cols-2 gap-3 mb-5">
                {[
                  { label: 'Category', value: item.category, icon: '🏷️' },
                  { label: 'Date', value: formatDate(item.date), icon: '📅' },
                ].map(({ label, value, icon }) => (
                  <div
                    key={label}
                    className="p-3 rounded-xl"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>{icon} {label}</p>
                    <p className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{value}</p>
                  </div>
                ))}
                <div
                  className="col-span-2 p-3 rounded-xl"
                  style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>📍 Location</p>
                  <p className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{item.location}</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-display font-bold text-sm mb-2" style={{ color: 'var(--text)' }}>Description</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-muted)' }}>
                  {item.description}
                </p>
              </div>

              {item.reward && (
                <div
                  className="p-3.5 rounded-xl flex items-center gap-3"
                  style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.2)' }}
                >
                  <span className="text-xl">🏆</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--gold)' }}>Reward Offered</p>
                    <p className="font-display font-bold text-sm" style={{ color: 'var(--gold)' }}>{item.reward}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Reporter */}
            {item.userId && (
              <div className="card p-4" style={{ boxShadow: 'var(--shadow-sm)' }}>
                <h3 className="font-display font-bold text-sm mb-3" style={{ color: 'var(--text)' }}>Reported By</h3>
                <div className="flex items-center gap-3">
                  {item.userId.avatar ? (
                    <img src={item.userId.avatar} alt={item.userId.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold font-display"
                      style={{ background: 'linear-gradient(135deg, var(--navy-mid), var(--navy-light))' }}
                    >
                      {getInitials(item.userId.name)}
                    </div>
                  )}
                  <div>
                    <p className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>{item.userId.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Joined {formatDate(item.userId.createdAt)}</p>
                  </div>
                </div>
                {item.contactInfo && (
                  <div className="mt-3 pt-3 text-sm" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                    📞 {item.contactInfo}
                  </div>
                )}
              </div>
            )}

            {/* Claim button */}
            {user && !isOwner && item.status === 'active' && (
              <Link
                to={`/claim/${item._id}`}
                className="btn-primary w-full py-3.5 text-base justify-center"
                style={{ display: 'flex' }}
              >
                {item.type === 'lost' ? '🙋 I Found This Item' : '🙋 This Is My Item'}
              </Link>
            )}

            {!user && (
              <div
                className="card p-5 text-center"
                style={{ background: 'rgba(245,166,35,0.05)', border: '1px solid rgba(245,166,35,0.2)' }}
              >
                <p className="text-sm mb-3" style={{ color: 'var(--text-muted)' }}>Sign in to claim this item</p>
                <Link to="/login" className="btn-primary px-6">Sign In</Link>
              </div>
            )}

            <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Posted {formatRelative(item.createdAt)}
            </p>
          </div>
        </div>

        {/* Claims Section */}
        {(isOwner || isAdmin) && claims.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display font-extrabold text-xl mb-5" style={{ color: 'var(--text)' }}>
              📬 Claim Requests
              <span
                className="ml-2 text-sm px-2.5 py-1 rounded-full font-bold"
                style={{ background: 'rgba(245,166,35,0.12)', color: 'var(--gold)', border: '1px solid rgba(245,166,35,0.2)' }}
              >
                {claims.length}
              </span>
            </h2>
            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim._id} className="card p-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold font-display flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg, #7c3aed, #4f46e5)' }}
                      >
                        {getInitials(claim.claimantId?.name)}
                      </div>
                      <div>
                        <p className="font-display font-bold" style={{ color: 'var(--text)' }}>{claim.claimantId?.name}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{claim.claimantId?.email}</p>
                      </div>
                    </div>
                    <span className={`badge-${claim.status} flex-shrink-0`}>{claim.status}</span>
                  </div>

                  <div
                    className="mt-4 p-4 rounded-xl"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{claim.message}</p>
                    {claim.proofDescription && (
                      <p className="text-sm mt-2" style={{ color: 'var(--text-muted)' }}>
                        <strong style={{ color: 'var(--text)' }}>Proof:</strong> {claim.proofDescription}
                      </p>
                    )}
                  </div>

                  {claim.status === 'pending' && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleClaimUpdate(claim._id, 'approved')}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-display font-bold text-sm transition-all duration-200 text-white hover:-translate-y-0.5"
                        style={{ background: 'linear-gradient(135deg, #2ec4b6, #20a89b)', boxShadow: '0 4px 12px rgba(46,196,182,0.3)' }}
                      >
                        ✅ Approve Claim
                      </button>
                      <button
                        onClick={() => handleClaimUpdate(claim._id, 'rejected')}
                        className="flex-1 btn-danger text-sm"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;
