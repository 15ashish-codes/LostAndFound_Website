import { useState } from 'react';
import { formatDate, formatRelative, getInitials } from '../../utils/helpers.js';

/**
 * UserTable — Displays paginated, searchable list of all users
 * Props:
 *   users        : array  — list of user objects
 *   onToggle     : fn(id) — callback to activate/deactivate a user
 *   onRoleChange : fn(id, role) — callback to change user role (optional)
 *   loading      : bool
 */
const UserTable = ({ users = [], onToggle, loading = false }) => {
  const [expandedUser, setExpandedUser] = useState(null);

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="animate-pulse">
          {/* Table header skeleton */}
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 flex gap-4">
            {['w-32', 'w-48', 'w-20', 'w-24', 'w-20', 'w-24'].map((w, i) => (
              <div key={i} className={`h-4 bg-gray-200 dark:bg-gray-600 rounded ${w}`} />
            ))}
          </div>
          {/* Row skeletons */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex gap-4 border-t border-gray-100 dark:border-gray-700">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600" />
              <div className="w-32 h-4 bg-gray-200 dark:bg-gray-600 rounded mt-1" />
              <div className="w-48 h-4 bg-gray-200 dark:bg-gray-600 rounded mt-1" />
              <div className="w-20 h-4 bg-gray-200 dark:bg-gray-600 rounded mt-1" />
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-600 rounded mt-1" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="text-5xl mb-3">👤</div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">No users found</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search query</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-5 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">User</th>
              <th className="text-left px-5 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Email</th>
              <th className="text-left px-5 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Role</th>
              <th className="text-left px-5 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Joined</th>
              <th className="text-left px-5 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Status</th>
              <th className="text-left px-5 py-3.5 text-gray-600 dark:text-gray-400 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
            {users.map((user) => (
              <tr
                key={user._id}
                className={`group transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/30 ${
                  !user.isActive ? 'opacity-60' : ''
                }`}
              >
                {/* Avatar + Name */}
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                        />
                      ) : (
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-gray-100 dark:ring-gray-700 ${
                          user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
                        }`}>
                          {getInitials(user.name)}
                        </div>
                      )}
                      {/* Online indicator dot (visual only) */}
                      <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                        user.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white leading-tight">{user.name}</p>
                      {user.phone && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">📞 {user.phone}</p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Email */}
                <td className="px-5 py-3.5">
                  <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                </td>

                {/* Role Badge */}
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {user.role === 'admin' ? '👑' : '👤'} {user.role}
                  </span>
                </td>

                {/* Joined Date */}
                <td className="px-5 py-3.5">
                  <div>
                    <p className="text-gray-700 dark:text-gray-300">{formatDate(user.createdAt)}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatRelative(user.createdAt)}</p>
                  </div>
                </td>

                {/* Status Badge */}
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    user.isActive
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-5 py-3.5">
                  {user.role === 'admin' ? (
                    <span className="text-xs text-gray-400 italic">Protected</span>
                  ) : (
                    <button
                      onClick={() => onToggle(user._id)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                        user.isActive
                          ? 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40'
                          : 'border-green-200 bg-green-50 text-green-600 hover:bg-green-100 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40'
                      }`}
                    >
                      {user.isActive ? '⛔ Deactivate' : '✅ Activate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List — shown on small screens */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
        {users.map((user) => (
          <div
            key={user._id}
            className={`p-4 ${!user.isActive ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Left: Avatar + Info */}
              <div className="flex items-center gap-3">
                <div className="relative flex-shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      user.role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
                    }`}>
                      {getInitials(user.name)}
                    </div>
                  )}
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {user.role === 'admin' ? '👑' : '👤'} {user.role}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.isActive
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Toggle button */}
              {user.role !== 'admin' && (
                <button
                  onClick={() => onToggle(user._id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex-shrink-0 mt-1 ${
                    user.isActive
                      ? 'border-red-200 bg-red-50 text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400'
                      : 'border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}
                >
                  {user.isActive ? '⛔ Ban' : '✅ Restore'}
                </button>
              )}
            </div>

            {/* Expandable extra info */}
            <button
              onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
              className="mt-2 text-xs text-blue-500 hover:underline"
            >
              {expandedUser === user._id ? '▲ Less info' : '▼ More info'}
            </button>

            {expandedUser === user._id && (
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1 bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
                <p>📅 Joined: {formatDate(user.createdAt)}</p>
                {user.phone && <p>📞 Phone: {user.phone}</p>}
                <p>🆔 ID: <span className="font-mono">{user._id}</span></p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer row — total count */}
      <div className="bg-gray-50 dark:bg-gray-700/30 px-5 py-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
        <span>Showing <strong className="text-gray-700 dark:text-gray-300">{users.length}</strong> user{users.length !== 1 ? 's' : ''}</span>
        <span>
          {users.filter((u) => u.isActive).length} active •{' '}
          {users.filter((u) => !u.isActive).length} inactive •{' '}
          {users.filter((u) => u.role === 'admin').length} admin
        </span>
      </div>
    </div>
  );
};

export default UserTable;