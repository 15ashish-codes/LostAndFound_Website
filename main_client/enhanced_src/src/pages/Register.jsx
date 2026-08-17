import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register, loading, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.length < 2) errs.name = 'Name must be at least 2 characters';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.password || form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const result = await register({ name: form.name, email: form.email, password: form.password, phone: form.phone });
    if (result.success) navigate('/dashboard');
  };

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const strength = form.password.length >= 8 ? 'strong' : form.password.length >= 6 ? 'medium' : form.password.length > 0 ? 'weak' : '';
  const strengthMeta = {
    strong: { color: '#2ec4b6', label: 'Strong', bars: [true, true, true] },
    medium: { color: '#f5a623', label: 'Medium', bars: [true, true, false] },
    weak:   { color: '#e63946', label: 'Weak',   bars: [true, false, false] },
  };
  const sm = strengthMeta[strength];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12" style={{ background: 'var(--surface-2)' }}>
      <div className="w-full max-w-md animate-fade-up">

        <div className="text-center mb-6">
          <img src="/logo.png" alt="FoundIt!" className="h-14 w-14 mx-auto mb-3 object-contain" />
          <h1 className="font-display font-extrabold text-2xl" style={{ color: 'var(--text)' }}>Create Your Account</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Join the FoundIt! community — it's free</p>
        </div>

        <div className="card p-8" style={{ boxShadow: 'var(--shadow-lg)' }}>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold font-display mb-2" style={{ color: 'var(--text)' }}>
                Full Name <span style={{ color: 'var(--gold)' }}>*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="input-field"
                style={errors.name ? { borderColor: '#e63946' } : {}}
                placeholder="John Doe"
                autoComplete="name"
              />
              {errors.name && <p className="text-xs mt-1.5" style={{ color: '#e63946' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold font-display mb-2" style={{ color: 'var(--text)' }}>
                Email <span style={{ color: 'var(--gold)' }}>*</span>
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

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold font-display mb-2" style={{ color: 'var(--text)' }}>
                Phone <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="input-field"
                placeholder="+1 234 567 8900"
                autoComplete="tel"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold font-display mb-2" style={{ color: 'var(--text)' }}>
                Password <span style={{ color: 'var(--gold)' }}>*</span>
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="input-field pr-12"
                  style={errors.password ? { borderColor: '#e63946' } : {}}
                  placeholder="Min 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)', fontSize: '16px' }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {strength && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-300"
                        style={{ height: '3px', background: sm.bars[i] ? sm.color : 'var(--border)' }}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-semibold" style={{ color: sm.color }}>{sm.label} password</p>
                </div>
              )}
              {errors.password && <p className="text-xs mt-1.5" style={{ color: '#e63946' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold font-display mb-2" style={{ color: 'var(--text)' }}>
                Confirm Password <span style={{ color: 'var(--gold)' }}>*</span>
              </label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                className="input-field"
                style={errors.confirm ? { borderColor: '#e63946' } : {}}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
              {errors.confirm && <p className="text-xs mt-1.5" style={{ color: '#e63946' }}>{errors.confirm}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span style={{ width: '16px', height: '16px', border: '2px solid rgba(13,27,62,0.3)', borderTopColor: 'var(--navy-mid)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                  Creating account…
                </span>
              ) : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-bold hover:underline" style={{ color: 'var(--gold)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
