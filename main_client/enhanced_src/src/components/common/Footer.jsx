import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #112354 100%)', color: '#fff', marginTop: 'auto' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/logo.png" alt="FoundIt!" className="h-10 w-10 object-contain" />
            <span className="font-display font-bold text-xl">
              Found<span style={{ color: '#f5a623' }}>It!</span>
            </span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem', lineHeight: '1.7' }}>
            Helping communities reconnect people with their lost belongings since 2026.
          </p>
          <div className="flex gap-3 mt-5">
            {['📘', '🐦', '📸'].map((icon, i) => (
              <button
                key={i}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-4" style={{ color: '#f5a623' }}>
            Quick Links
          </h4>
          <ul className="space-y-2.5">
            {[
              { to: '/?type=lost', label: 'Lost Items' },
              { to: '/?type=found', label: 'Found Items' },
              { to: '/register', label: 'Create Account' },
              { to: '/login', label: 'Sign In' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="text-sm flex items-center gap-2 transition-all duration-200 hover:translate-x-1"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#f5a623'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                >
                  <span style={{ color: '#f5a623', fontSize: '10px' }}>▶</span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* How it works */}
        <div>
          <h4 className="font-display font-bold text-sm uppercase tracking-widest mb-4" style={{ color: '#f5a623' }}>
            How It Works
          </h4>
          <ul className="space-y-3">
            {[
              { step: '01', text: 'Report a lost or found item' },
              { step: '02', text: 'Upload a photo for better identification' },
              { step: '03', text: 'Connect with finder/owner to claim' },
            ].map(({ step, text }) => (
              <li key={step} className="flex items-start gap-3">
                <span
                  className="font-display font-bold text-xs mt-0.5 flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(245,166,35,0.2)', color: '#f5a623' }}
                >
                  {step}
                </span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)' }}
      >
        <span>© {new Date().getFullYear()} FoundIt! — All rights reserved.</span>
        <div className="flex gap-4">
          {['Privacy Policy', 'Terms of Use', 'Contact'].map((l) => (
            <a
              key={l}
              href="#"
              className="hover:text-yellow-400 transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
