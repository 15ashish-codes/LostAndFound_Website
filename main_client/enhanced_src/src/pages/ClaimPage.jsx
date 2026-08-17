import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios.js';
import { formatDate, PLACEHOLDER_IMG } from '../utils/helpers.js';

const ClaimPage = () => {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ message: '', proofDescription: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    API.get(`/items/${itemId}`)
      .then((res) => setItem(res.data.data))
      .catch(() => { toast.error('Item not found'); navigate('/'); })
      .finally(() => setLoading(false));
  }, [itemId, navigate]);

  const validate = () => {
    const errs = {};
    if (!form.message.trim() || form.message.length < 20)
      errs.message = 'Please provide at least 20 characters explaining your claim';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      await API.post('/claims', { itemId, ...form });
      toast.success('Claim submitted! The owner will review your request.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit claim');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--gold)', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
  if (!item) return null;

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100%', paddingBottom: '3rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a3270 100%)', padding: '2.5rem 0 3.5rem' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.3)' }}
            >
              {item.type === 'lost' ? '✋' : '🙋'}
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl text-white">
                {item.type === 'lost' ? 'Report as Found' : 'Claim This Item'}
              </h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Describe how you know this item or how you found it
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6" style={{ marginTop: '-1.5rem' }}>
        {/* Item Preview */}
        <div className="card p-4 mb-5 flex gap-4" style={{ boxShadow: 'var(--shadow-md)' }}>
          <img
            src={item.image?.url || PLACEHOLDER_IMG}
            alt={item.title}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0"
            onError={(e) => { e.target.src = PLACEHOLDER_IMG; }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex gap-2 mb-1.5">
              <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>{item.type}</span>
            </div>
            <h2 className="font-display font-bold text-lg" style={{ color: 'var(--text)' }}>{item.title}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              📍 {item.location} &bull; {formatDate(item.date)}
            </p>
          </div>
        </div>

        {/* Claim Form */}
        <div className="card p-6 sm:p-8" style={{ boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                Your Message <span style={{ color: 'var(--gold)' }}>*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => {
                  setForm((f) => ({ ...f, message: e.target.value }));
                  if (errors.message) setErrors({});
                }}
                rows={5}
                className="input-field resize-none"
                style={errors.message ? { borderColor: '#e63946' } : {}}
                placeholder={
                  item.type === 'found'
                    ? 'Describe where you found it, exact condition, any unique identifiers…'
                    : 'Describe unique features only the owner would know — serial number, engraving, data, etc.'
                }
              />
              <div className="flex items-center justify-between mt-1.5">
                {errors.message
                  ? <p className="text-xs" style={{ color: '#e63946' }}>{errors.message}</p>
                  : <span />
                }
                <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{form.message.length}/500</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                Proof of Ownership <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                value={form.proofDescription}
                onChange={(e) => setForm((f) => ({ ...f, proofDescription: e.target.value }))}
                rows={3}
                className="input-field resize-none"
                placeholder="Receipt number, purchase date, photos, serial number, etc."
              />
            </div>

            <div
              className="p-4 rounded-xl flex items-start gap-3 text-sm"
              style={{ background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.2)' }}
            >
              <span className="text-lg flex-shrink-0">⚠️</span>
              <p style={{ color: 'var(--text-muted)' }}>
                False claims are violations of our terms. Provide accurate information to help verify your claim.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <Link to={`/items/${itemId}`} className="btn-secondary flex-1 text-center">
                Cancel
              </Link>
              <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3">
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span style={{ width: '16px', height: '16px', border: '2px solid rgba(13,27,62,0.3)', borderTopColor: 'var(--navy-mid)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    Submitting…
                  </span>
                ) : 'Submit Claim →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClaimPage;
