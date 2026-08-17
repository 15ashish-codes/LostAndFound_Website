import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, navigate, from]);

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email';
    if (!form.password) errs.password = 'Password is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await login(form);
    if (result.success) navigate(from, { replace: true });
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] flex"
      style={{ background: 'var(--surface-2)' }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-center items-center p-12"
        style={{
          background: 'linear-gradient(135deg, #0d1b3e 0%, #112354 50%, #1a3270 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: 'rgba(245,166,35,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(46,196,182,0.08)' }} />

        <div className="relative z-10 text-center">
          <img src="/logo.png" alt="FoundIt!" className="h-24 w-24 mx-auto mb-6 object-contain" />
          <h2 className="font-display font-extrabold text-3xl mb-3" style={{ color: '#fff' }}>
            Welcome to <span style={{ color: '#f5a623' }}>FoundIt!</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '320px', lineHeight: '1.7' }}>
            Your community's trusted platform for reuniting lost items with their owners.
          </p>

          <div className="mt-10 space-y-4 text-left max-w-xs mx-auto">
            {[
              { icon: '🔍', text: 'Search thousands of reported items' },
              { icon: '📢', text: 'Report lost or found items instantly' },
              { icon: '🤝', text: 'Connect & claim with confidence' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <span
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.3)' }}
                >
                  {icon}
                </span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden text-center mb-8">
            <img src="/logo.png" alt="FoundIt!" className="h-14 w-14 mx-auto mb-3 object-contain" />
          </div>

          <div className="card p-8" style={{ boxShadow: 'var(--shadow-lg)' }}>
            <div className="mb-8">
              <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text)' }}>
                Sign In
              </h1>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
                Welcome back! Enter your credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold font-display mb-2" style={{ color: 'var(--text)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="input-field"
                  style={errors.email ? { borderColor: '#e63946' } : {}}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {errors.email && <p className="text-xs mt-1.5" style={{ color: '#e63946' }}>{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold font-display mb-2" style={{ color: 'var(--text)' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="input-field pr-12"
                    style={errors.password ? { borderColor: '#e63946' } : {}}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-70"
                    style={{ color: 'var(--text-muted)', fontSize: '16px' }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {errors.password && <p className="text-xs mt-1.5" style={{ color: '#e63946' }}>{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm mt-2">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(13,27,62,0.3)', borderTopColor: 'var(--navy-mid)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Signing in…
                  </span>
                ) : 'Sign In →'}
              </button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-bold hover:underline" style={{ color: 'var(--gold)' }}>
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
