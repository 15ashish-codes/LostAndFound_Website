import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios.js';
import { CATEGORIES } from '../utils/helpers.js';

const PostItem = () => {
  const { type: typeParam, id: editId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    type: typeParam || 'lost',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactInfo: '',
    reward: '',
  });

  // Image state is kept completely separate from form state
  // so that toggling type (which updates form) never wipes it out
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load existing item for edit mode
  useEffect(() => {
    if (editId) {
      API.get(`/items/${editId}`)
        .then((res) => {
          const item = res.data.data;
          setForm({
            title: item.title,
            description: item.description,
            category: item.category,
            type: item.type,
            location: item.location,
            date: item.date?.split('T')[0] || '',
            contactInfo: item.contactInfo || '',
            reward: item.reward || '',
          });
          if (item.image?.url) setPreview(item.image.url);
        })
        .catch(() => toast.error('Item not found'));
    }
  }, [editId]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((er) => ({ ...er, [e.target.name]: '' }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      // Reset the input so the same file can be reselected later
      e.target.value = '';
      return;
    }
    setImageFile(file);
    // Revoke previous blob URL to avoid memory leaks
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = (e) => {
    e.stopPropagation();
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setImageFile(null);
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.category) errs.category = 'Category is required';
    if (!form.location.trim()) errs.location = 'Location is required';
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      // Only append the image field when a NEW file has been chosen
      if (imageFile) data.append('image', imageFile);

      if (editId) {
        await API.put(`/items/${editId}`, data);
        toast.success('Item updated successfully!');
      } else {
        const res = await API.post('/items', data);
        toast.success(res.data.message);
      }
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const isLost = form.type === 'lost';

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: '100%' }}>
      {/* Page header */}
      <div style={{ background: 'linear-gradient(135deg, #0d1b3e 0%, #1a3270 100%)', padding: '2.5rem 0 3.5rem' }}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'rgba(245,166,35,0.2)', border: '1px solid rgba(245,166,35,0.3)' }}
            >
              {editId ? '✏️' : isLost ? '📢' : '✋'}
            </div>
            <div>
              <h1 className="font-display font-extrabold text-2xl text-white">
                {editId ? 'Edit Item' : isLost ? 'Report Lost Item' : 'Report Found Item'}
              </h1>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {editId ? 'Update item details below' : 'Fill in the details to help others identify the item'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-12" style={{ marginTop: '-1.5rem' }}>
        <div className="card" style={{ boxShadow: 'var(--shadow-lg)', overflow: 'hidden' }}>

          {/* Type Toggle — only on create */}
          {!editId && (
            <div className="grid grid-cols-2" style={{ borderBottom: '1px solid var(--border)' }}>
              {['lost', 'found'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className="py-4 font-display font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    background: form.type === t
                      ? t === 'lost'
                        ? 'linear-gradient(135deg, rgba(230,57,70,0.12), rgba(230,57,70,0.06))'
                        : 'linear-gradient(135deg, rgba(46,196,182,0.12), rgba(46,196,182,0.06))'
                      : 'transparent',
                    color: form.type === t
                      ? t === 'lost' ? '#e63946' : '#2ec4b6'
                      : 'var(--text-muted)',
                    borderBottom: form.type === t
                      ? `2px solid ${t === 'lost' ? '#e63946' : '#2ec4b6'}`
                      : '2px solid transparent',
                    marginBottom: '-1px',
                  }}
                >
                  {t === 'lost' ? '🔴 I Lost Something' : '🟢 I Found Something'}
                </button>
              ))}
            </div>
          )}

          <div className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ── Image Upload ── */}
              <div>
                <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                  Item Photo <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                </label>

                {/* Hidden file input — always mounted */}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  // Allow selecting the same file again after removal
                  onClick={(e) => { e.target.value = ''; }}
                />

                <div
                  onClick={() => fileRef.current?.click()}
                  className="rounded-2xl transition-all duration-200 cursor-pointer overflow-hidden"
                  style={{
                    border: `2px dashed ${preview ? 'var(--gold)' : 'var(--border)'}`,
                    background: preview ? 'var(--surface)' : 'var(--surface-2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--gold)';
                    e.currentTarget.style.background = 'rgba(245,166,35,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = preview ? 'var(--gold)' : 'var(--border)';
                    e.currentTarget.style.background = preview ? 'var(--surface)' : 'var(--surface-2)';
                  }}
                >
                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full object-cover"
                        style={{ maxHeight: '220px', display: 'block' }}
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white transition-all duration-200 hover:scale-110"
                        style={{ background: '#e63946' }}
                      >
                        ✕
                      </button>
                      <div
                        className="absolute bottom-3 left-3 text-xs px-2.5 py-1 rounded-full font-semibold"
                        style={{ background: 'rgba(13,27,62,0.7)', color: '#fff', backdropFilter: 'blur(4px)' }}
                      >
                        {imageFile ? imageFile.name : 'Current photo'} — click to change
                      </div>
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm font-semibold font-display" style={{ color: 'var(--text-muted)' }}>
                        Click to upload photo
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                        JPG, PNG, WEBP up to 5MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Title ── */}
              <div>
                <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                  Item Title <span style={{ color: 'var(--gold)' }}>*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="input-field"
                  style={errors.title ? { borderColor: '#e63946' } : {}}
                  placeholder="e.g., Black iPhone 14 Pro, Blue Backpack"
                />
                {errors.title && <p className="text-xs mt-1.5" style={{ color: '#e63946' }}>{errors.title}</p>}
              </div>

              {/* ── Description ── */}
              <div>
                <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                  Description <span style={{ color: 'var(--gold)' }}>*</span>
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="input-field resize-none"
                  style={errors.description ? { borderColor: '#e63946' } : {}}
                  placeholder="Describe color, brand, unique features, serial number…"
                />
                <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>
                  {form.description.length}/1000
                </p>
                {errors.description && <p className="text-xs mt-1" style={{ color: '#e63946' }}>{errors.description}</p>}
              </div>

              {/* ── Category & Date ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                    Category <span style={{ color: 'var(--gold)' }}>*</span>
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="input-field"
                    style={errors.category ? { borderColor: '#e63946' } : {}}
                  >
                    <option value="">Select…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-xs mt-1.5" style={{ color: '#e63946' }}>{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                    Date <span style={{ color: 'var(--gold)' }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    className="input-field"
                    style={errors.date ? { borderColor: '#e63946' } : {}}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.date && <p className="text-xs mt-1.5" style={{ color: '#e63946' }}>{errors.date}</p>}
                </div>
              </div>

              {/* ── Location ── */}
              <div>
                <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                  Location <span style={{ color: 'var(--gold)' }}>*</span>
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="input-field"
                  style={errors.location ? { borderColor: '#e63946' } : {}}
                  placeholder="e.g., Central Park, NYC or Times Square subway"
                />
                {errors.location && <p className="text-xs mt-1.5" style={{ color: '#e63946' }}>{errors.location}</p>}
              </div>

              {/* ── Contact & Reward ── */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                    Contact Info
                  </label>
                  <input
                    name="contactInfo"
                    value={form.contactInfo}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Phone or email"
                  />
                </div>
                {isLost && (
                  <div>
                    <label className="block text-sm font-display font-bold mb-2" style={{ color: 'var(--text)' }}>
                      Reward <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
                    </label>
                    <input
                      name="reward"
                      value={form.reward}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="e.g., $50 reward"
                    />
                  </div>
                )}
              </div>

              {/* ── Actions ── */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1 py-3">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span style={{ width: '16px', height: '16px', border: '2px solid rgba(13,27,62,0.3)', borderTopColor: 'var(--navy-mid)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      Saving…
                    </span>
                  ) : editId ? 'Update Item' : 'Post Item →'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
