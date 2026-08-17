import { useState, useEffect, useCallback } from 'react';
import API from '../api/axios.js';
import { formatRelative, getInitials } from '../utils/helpers.js';
import toast from 'react-hot-toast';
import UserTable from '../components/admin/UserTable.jsx';
import { StatCard, BarChartCard, RecentListCard, DonutCard } from '../components/admin/AnalyticsCard.jsx';

const TABS = [
  { key: 'overview', label: 'Overview', emoji: '📊' },
  { key: 'users',    label: 'Users',    emoji: '👥' },
  { key: 'claims',   label: 'Claims',   emoji: '📋' },
];

const AdminPanel = () => {
  const [tab, setTab]             = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers]         = useState([]);
  const [claims, setClaims]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [userSearch, setUserSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const res = await API.get('/admin/analytics');
        setAnalytics(res.data.data);
      } else if (tab === 'users') {
        const res = await API.get(`/admin/users?search=${userSearch}`);
        setUsers(res.data.data);
      } else if (tab === 'claims') {
        const res = await API.get('/admin/claims');
        setClaims(res.data.data);
      }
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [tab, userSearch]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggleUser = async (userId) => {
    try {
      const res = await API.put(`/admin/users/${userId}/toggle`);
      setUsers((prev) => prev.map((u) => u._id === userId ? { ...u, isActive: res.data.data.isActive } : u));
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Permanently remove this item?')) return;
    try {
      await API.delete(`/admin/items/${itemId}`);
      toast.success('Item removed');
      fetchData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const categoryBarData = analytics?.categoryStats?.map(({ _id, count }) => ({ label: _id, value: count })) || [];

  const recentItemListData = analytics?.recentItems?.map((item) => ({
    id: item._id,
    avatar: item.userId?.name?.[0]?.toUpperCase() || '?',
    avatarColor: item.type === 'lost'
      ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300'
      : 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300',
    primary: item.title,
    secondary: `by ${item.userId?.name || 'Unknown'} · ${item.location || ''}`,
    badge: item.type,
    badgeColor: item.type === 'lost'
      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    meta: formatRelative(item.createdAt),
    onDelete: handleDeleteItem,
  })) || [];

  const recentUserListData = analytics?.recentUsers?.map((u) => ({
    id: u._id,
    avatar: getInitials(u.name),
    avatarColor: u.role === 'admin'
      ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300'
      : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300',
    primary: u.name,
    secondary: u.email,
    badge: u.role,
    badgeColor: u.role === 'admin'
      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
    meta: formatRelative(u.createdAt),
  })) || [];

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100%' }}>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a3270 100%)', padding: '2.5rem 0 3.5rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.3)' }}
            >
              ⚙️
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl text-white">Admin Panel</h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>Monitor and manage the entire platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12" style={{ marginTop: '-1.5rem' }}>
        {/* Tab bar */}
        <div className="card mb-6 overflow-hidden" style={{ boxShadow: 'var(--shadow-md)' }}>
          <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-2 px-6 py-4 font-display font-bold text-sm whitespace-nowrap transition-all duration-200 flex-shrink-0"
                style={{
                  color: tab === t.key ? 'var(--gold)' : 'var(--text-muted)',
                  borderBottom: tab === t.key ? '2px solid var(--gold)' : '2px solid transparent',
                  marginBottom: '-1px',
                  background: 'transparent',
                }}
              >
                <span>{t.emoji}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* ── OVERVIEW ── */}
            {tab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard loading={loading} icon="👥" label="Total Users"    value={analytics?.stats.totalUsers    ?? '—'} color="blue"   trend={{ value: 'all time', direction: 'up' }} />
                  <StatCard loading={loading} icon="📋" label="Total Items"    value={analytics?.stats.totalItems    ?? '—'} color="gray"   />
                  <StatCard loading={loading} icon="🔴" label="Lost Items"     value={analytics?.stats.lostItems     ?? '—'} color="red"    />
                  <StatCard loading={loading} icon="🟢" label="Found Items"    value={analytics?.stats.foundItems    ?? '—'} color="green"  />
                  <StatCard loading={loading} icon="📬" label="Total Claims"   value={analytics?.stats.totalClaims   ?? '—'} color="purple" />
                  <StatCard loading={loading} icon="⏳" label="Pending Claims" value={analytics?.stats.pendingClaims ?? '—'} color="yellow" />
                  <StatCard loading={loading} icon="✅" label="Resolved"       value={analytics?.stats.resolvedItems ?? '—'} color="green"  />
                  <DonutCard
                    loading={loading}
                    icon="🎯"
                    title="Success Rate"
                    percentage={analytics?.stats.successRate ?? 0}
                    label="Items resolved"
                    sublabel="out of all active posts"
                    color="green"
                  />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <BarChartCard loading={loading} icon="📦" title="Items by Category" data={categoryBarData} />
                  <RecentListCard loading={loading} icon="🕐" title="Recent Items" items={recentItemListData} emptyText="No items posted yet" />
                  <RecentListCard loading={loading} icon="🆕" title="New Members" items={recentUserListData} emptyText="No recent signups" />
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {tab === 'users' && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative max-w-sm w-full">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>🔍</span>
                    <input
                      type="text"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Search by name or email…"
                      className="input-field pl-10"
                    />
                  </div>
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    {users.length} result{users.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <UserTable users={users} onToggle={handleToggleUser} loading={loading} />
              </div>
            )}

            {/* ── CLAIMS ── */}
            {tab === 'claims' && (
              <div>
                {loading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="rounded-2xl p-4 animate-pulse flex gap-4" style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                        <div className="w-10 h-10 rounded-full skeleton flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 skeleton rounded w-1/2" />
                          <div className="h-3 skeleton rounded w-3/4" />
                          <div className="h-3 skeleton rounded w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : claims.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-display font-bold" style={{ color: 'var(--text-muted)' }}>No claims found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {claims.map((claim) => (
                      <div
                        key={claim._id}
                        className="p-4 rounded-2xl transition-all duration-200"
                        style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold font-display text-sm flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)' }}
                          >
                            {getInitials(claim.claimantId?.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="font-display font-bold" style={{ color: 'var(--text)' }}>{claim.claimantId?.name}</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>claimed</span>
                              <span className="font-semibold truncate max-w-[180px]" style={{ color: 'var(--gold)' }}>{claim.itemId?.title}</span>
                              <span className={claim.itemId?.type === 'lost' ? 'badge-lost' : 'badge-found'}>{claim.itemId?.type}</span>
                            </div>
                            <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--text-muted)' }}>{claim.message}</p>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className={`badge-${claim.status}`}>
                                {claim.status === 'pending' ? '⏳' : claim.status === 'approved' ? '✅' : '❌'} {claim.status}
                              </span>
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                Owner: <span style={{ color: 'var(--text)' }}>{claim.ownerId?.name}</span>
                              </span>
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatRelative(claim.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
