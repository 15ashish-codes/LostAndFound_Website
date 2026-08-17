import { useState } from 'react';
import { CATEGORIES } from '../../utils/helpers.js';

const SearchFilter = ({ onFilter, initialValues = {} }) => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    location: '',
    startDate: '',
    endDate: '',
    ...initialValues,
  });

  const handleChange = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    onFilter(updated);
  };

  const handleReset = () => {
    const reset = { search: '', type: '', category: '', location: '', startDate: '', endDate: '' };
    setFilters(reset);
    onFilter(reset);
  };

  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="card mb-6 overflow-hidden">
      {/* Header bar */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ background: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{ color: 'var(--gold)' }}>🔍</span>
          <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>Search & Filter</span>
        </div>
        {hasFilters && (
          <button
            onClick={handleReset}
            className="text-xs font-semibold px-3 py-1 rounded-lg transition-all duration-200"
            style={{ color: '#e63946', background: 'rgba(230,57,70,0.08)', border: '1px solid rgba(230,57,70,0.15)' }}
          >
            ✕ Clear All
          </button>
        )}
      </div>

      <div className="p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <span
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base pointer-events-none"
            style={{ color: 'var(--text-muted)' }}
          >
            🔍
          </span>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by title, description, location…"
            className="input-field pl-10"
          />
        </div>

        {/* Filter row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <select name="type" value={filters.type} onChange={handleChange} className="input-field text-sm">
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <select name="category" value={filters.category} onChange={handleChange} className="input-field text-sm">
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="📍 Location"
            className="input-field text-sm col-span-2 sm:col-span-1"
          />

          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleChange}
            className="input-field text-sm"
          />

          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleChange}
            className="input-field text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
