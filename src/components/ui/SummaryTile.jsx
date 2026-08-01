/**
 * TFA SummaryTile — label + big tabular number.
 *
 * Optional `suffix` renders smaller next to the value (e.g. "%" on Attendance).
 * Optional `hint` is a small condensed-uppercase line below the value.
 * `accent` is a CSS color string (e.g. var(--gold)) for the highlighted tile.
 */
export function SummaryTile({ label, value, suffix, hint, accent, className = '' }) {
  return (
    <div
      className={`bg-navy-mid/80 border border-white/[0.06] rounded-lg p-4 shadow-card transition-all duration-200 ease-out-soft hover:-translate-y-[2px] hover:shadow-md ${className}`}
    >
      <div className="font-condensed font-bold text-[10.5px] tracking-[0.18em] uppercase text-muted">
        {label}
      </div>
      <div className="flex items-baseline gap-1.5 mt-2">
        <span
          className="font-display font-bold leading-[0.92] text-[34px]"
          style={{
            color: accent ?? 'var(--cream)',
            letterSpacing: '-0.01em',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {value}
        </span>
        {suffix ? (
          <span
            className="font-display leading-[0.92] text-[16px]"
            style={{ color: accent ?? 'var(--text-muted)', letterSpacing: '-0.01em' }}
          >
            {suffix}
          </span>
        ) : null}
      </div>
      {hint ? (
        <div className="font-condensed uppercase text-[10px] tracking-[0.14em] text-faint mt-2">
          {hint}
        </div>
      ) : null}
    </div>
  )
}
