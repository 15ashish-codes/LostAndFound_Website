import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { getInitials } from '../../utils/helpers.js';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav
      className="sticky top-0 z-40"
      style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        boxShadow: '0 1px 20px rgba(13,27,62,0.07)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <img src="/logo.png" alt="FoundIt!" className="h-9 w-9 object-contain transition-transform duration-300 group-hover:scale-110" />
            <span
              className="hidden sm:block font-display font-bold text-xl"
              style={{ color: 'var(--navy)' }}
            >
              Found<span className="text-gold-500" style={{ color: 'var(--gold)' }}>It!</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/?type=lost', label: 'Lost Items' },
              { to: '/?type=found', label: 'Found Items' },
            ].map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 font-display ${
                    isActive ? 'nav-active' : ''
                  }`
                }
                style={({ isActive }) => ({
                  color: isActive ? 'var(--gold)' : 'var(--text-muted)',
                })}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl transition-all duration-200 hover:scale-110"
              style={{ color: 'var(--text-muted)', background: 'var(--surface-2)' }}
              title="Toggle theme"
            >
              {dark ? '☀️' : '🌙'}
            </button>

            {user ? (
              <>
                {/* Post Item Button */}
                <Link to="/post-item" className="btn-primary hidden sm:inline-flex text-sm py-2 px-4">
                  <span>+</span> Report Item
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen((o) => !o)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200"
                    style={{ background: dropdownOpen ? 'var(--surface-2)' : 'transparent' }}
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-gold-400" style={{ ringColor: 'var(--gold)' }} />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold font-display"
                        style={{ background: 'linear-gradient(135deg, var(--navy-mid), var(--navy-light))' }}
                      >
                        {getInitials(user.name)}
                      </div>
                    )}
                    <span className="hidden sm:block text-sm font-semibold font-display" style={{ color: 'var(--text)' }}>
                      {user.name.split(' ')[0]}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>▾</span>
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden z-50"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow-lg)',
                      }}
                    >
                      <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                        <p className="text-xs font-semibold font-display" style={{ color: 'var(--text-muted)' }}>Signed in as</p>
                        <p className="text-sm font-bold font-display truncate" style={{ color: 'var(--text)' }}>{user.name}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-opacity-50"
                          style={{ color: 'var(--text)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span className="text-base">📊</span> Dashboard
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150"
                            style={{ color: 'var(--text)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <span className="text-base">⚙️</span> Admin Panel
                          </Link>
                        )}
                        <div style={{ height: '1px', background: 'var(--border)', margin: '4px 16px' }} />
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-150"
                          style={{ color: '#e63946' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(230,57,70,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <span className="text-base">🚪</span> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="md:hidden p-2 rounded-xl transition-colors"
              style={{ color: 'var(--text-muted)', background: 'var(--surface-2)' }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden pb-4 pt-2 space-y-1"
            style={{ borderTop: '1px solid var(--border)' }}
          >
            {[
              { to: '/', label: '🏠 Home' },
              { to: '/?type=lost', label: '🔴 Lost Items' },
              { to: '/?type=found', label: '🟢 Found Items' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold font-display transition-colors"
                style={{ color: 'var(--text)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {label}
              </Link>
            ))}
            {user && (
              <Link
                to="/post-item"
                onClick={() => setMenuOpen(false)}
                className="btn-primary block text-center mt-2"
              >
                + Report Item
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
