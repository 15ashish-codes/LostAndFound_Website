/**
 * AnalyticsCard — Reusable stat/metric display card for the Admin Panel.
 *
 * Variants:
 *   "stat"      — Large number with label, icon, optional trend
 *   "bar"       — Horizontal bar chart (category breakdown)
 *   "list"      — Scrollable recent-activity list
 *   "donut"     — Simple CSS donut / progress ring (e.g. success rate)
 */

// ─── Individual Stat Card ───────────────────────────────────────────────────
export const StatCard = ({
  icon,
  label,
  value,
  sub,
  color = 'blue',
  trend,       // { value: "+12%", direction: "up" | "down" }
  loading = false,
}) => {
  const colorMap = {
    blue:   { bg: 'bg-blue-50   dark:bg-blue-900/20',   icon: 'bg-blue-100  dark:bg-blue-900/40  text-blue-600  dark:text-blue-300',  text: 'text-blue-700  dark:text-blue-300'  },
    green:  { bg: 'bg-green-50  dark:bg-green-900/20',  icon: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300', text: 'text-green-700 dark:text-green-300' },
    red:    { bg: 'bg-red-50    dark:bg-red-900/20',    icon: 'bg-red-100   dark:bg-red-900/40   text-red-600   dark:text-red-300',   text: 'text-red-700   dark:text-red-300'   },
    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', icon: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300', text: 'text-yellow-700 dark:text-yellow-300' },
    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300', text: 'text-purple-700 dark:text-purple-300' },
    gray:   { bg: 'bg-gray-50   dark:bg-gray-800',      icon: 'bg-gray-100  dark:bg-gray-700     text-gray-600  dark:text-gray-300',  text: 'text-gray-700  dark:text-gray-200'  },
  };

  const c = colorMap[color] || colorMap.blue;

  if (loading) {
    return (
      <div className="card p-5 animate-pulse">
        <div className="flex items-start justify-between mb-3">
          <div className="w-11 h-11 rounded-xl bg-gray-200 dark:bg-gray-700" />
          <div className="w-12 h-5 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  return (
    <div className={`card p-5 ${c.bg} border-0`}>
      <div className="flex items-start justify-between mb-3">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${c.icon}`}>
          {icon}
        </div>

        {/* Trend badge */}
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-0.5 ${
            trend.direction === 'up'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
          }`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      {/* Value */}
      <p className={`text-3xl font-extrabold leading-none mb-1.5 ${c.text}`}>
        {value}
      </p>

      {/* Label */}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>

      {/* Sub-label */}
      {sub && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>
      )}
    </div>
  );
};

// ─── Bar Chart Card ─────────────────────────────────────────────────────────
export const BarChartCard = ({
  title,
  icon = '📊',
  data = [],         // [{ label, value, color? }]
  loading = false,
}) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  const barColors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500',
    'bg-red-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500',
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">{icon}</span>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full" style={{ width: `${Math.random() * 60 + 20}%` }} />
              <div className="w-6 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-400 py-6 text-sm">No data available</p>
      ) : (
        <div className="space-y-3">
          {data.map(({ label, value }, i) => (
            <div key={label} className="flex items-center gap-3">
              {/* Label */}
              <span className="text-sm text-gray-600 dark:text-gray-400 w-28 truncate flex-shrink-0">
                {label}
              </span>

              {/* Bar track */}
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out ${barColors[i % barColors.length]}`}
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>

              {/* Count */}
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-8 text-right flex-shrink-0">
                {value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Recent Activity List Card ───────────────────────────────────────────────
export const RecentListCard = ({
  title,
  icon = '🕐',
  items = [],        // [{ id, primary, secondary, badge, badgeColor, meta, onDelete }]
  emptyText = 'Nothing here yet',
  loading = false,
  maxHeight = 'max-h-72',
}) => {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">{icon}</span>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
        {items.length > 0 && (
          <span className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-semibold px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-1">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
              <div className="w-14 h-5 bg-gray-200 dark:bg-gray-700 rounded-full" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 dark:text-gray-500 text-sm">{emptyText}</p>
        </div>
      ) : (
        <div className={`${maxHeight} overflow-y-auto space-y-1 -mx-1 px-1`}>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors group"
            >
              {/* Avatar / Icon */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                item.avatarColor || 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300'
              }`}>
                {item.avatar || '?'}
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                  {item.primary}
                </p>
                {item.secondary && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5">
                    {item.secondary}
                  </p>
                )}
              </div>

              {/* Badge */}
              {item.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                  item.badgeColor || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {item.badge}
                </span>
              )}

              {/* Meta + optional delete */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {item.meta && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">{item.meta}</span>
                )}
                {item.onDelete && (
                  <button
                    onClick={() => item.onDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-sm transition-opacity"
                    title="Delete"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Donut / Progress Ring Card ──────────────────────────────────────────────
export const DonutCard = ({
  title,
  icon = '🎯',
  percentage = 0,   // 0–100
  label,
  sublabel,
  color = 'blue',
  loading = false,
}) => {
  const colorMap = {
    blue:   'stroke-blue-500',
    green:  'stroke-green-500',
    red:    'stroke-red-500',
    yellow: 'stroke-yellow-500',
    purple: 'stroke-purple-500',
  };

  // SVG circle math
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="card p-5 flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-4 self-start">
        <span className="text-lg">{icon}</span>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
      </div>

      {loading ? (
        <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      ) : (
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Track */}
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              strokeWidth="10"
              className="stroke-gray-100 dark:stroke-gray-700"
            />
            {/* Progress */}
            <circle
              cx="50" cy="50" r={radius}
              fill="none"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`${colorMap[color] || colorMap.blue} transition-all duration-700 ease-out`}
            />
          </svg>
          {/* Centre text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">{percentage}%</span>
          </div>
        </div>
      )}

      {label && (
        <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</p>
      )}
      {sublabel && (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{sublabel}</p>
      )}
    </div>
  );
};

// ─── Default export: convenience bundle ──────────────────────────────────────
const AnalyticsCard = { StatCard, BarChartCard, RecentListCard, DonutCard };
export default AnalyticsCard;