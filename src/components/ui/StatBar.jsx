/**
 * TFA StatBar — labelled 0–10 skill bar with rating-band color chip.
 *
 * Rating bands: 0–3 red, 4–6 orange, 7–8 cyan, 9–10 gold
 *
 * variant:
 *   'horizontal' (default) — label LEFT · bar MIDDLE · value RIGHT. Best in wide
 *                            cards (Stats hero, Squad featured hero, PlayerPortal).
 *   'vertical'             — label+value in a HEADER ROW above the bar. Best in
 *                            narrow cards (PlayerCard). Matches the v2 redesign.
 *
 * compact (vertical only) — tighter spacing + smaller label text. Used inside
 *                           player cards where vertical space matters.
 */

function ratingColor(v) {
  if (v <= 3) return 'var(--rating-low)'
  if (v <= 6) return 'var(--rating-mid)'
  if (v <= 8) return 'var(--rating-high)'
  return 'var(--rating-elite)'
}

export function StatBar({
  label,
  value = 0,
  max = 10,
  color,
  variant = 'horizontal',
  compact = false,
  style = {},
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const c   = color ?? ratingColor(value)

  if (variant === 'vertical') {
    return (
      <div className={`w-full ${compact ? 'space-y-1' : 'space-y-1.5'}`} style={style}>
        <div className="flex items-center justify-between">
          <span
            className={`font-condensed font-bold uppercase ${compact ? 'text-[10px]' : 'text-[11px]'}`}
            style={{ color: 'var(--text-muted)', letterSpacing: '0.14em' }}
          >
            {label}
          </span>
          <span
            className="font-display leading-none"
            style={{
              fontSize: compact ? 14 : 16,
              color: c,
              letterSpacing: '-0.01em',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {value}
          </span>
        </div>
        <div
          className="h-[6px] rounded-pill overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full rounded-pill transition-all duration-500 ease-out-soft"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${c}, color-mix(in srgb, ${c} 75%, white))`,
              boxShadow: `0 0 12px ${c}55`,
            }}
          />
        </div>
      </div>
    )
  }

  // Default horizontal layout — used by older pages
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...style }}>
      <span style={{
        flex: 'none', minWidth: 108,
        fontFamily: '"Barlow Condensed", sans-serif',
        fontWeight: 600, fontSize: 11,
        letterSpacing: '0.04em', textTransform: 'uppercase',
        color: 'var(--text-muted, #8fa1bd)',
      }}>
        {label}
      </span>
      <div style={{
        flex: 1, height: 8,
        background: 'var(--navy-soft, #1a2942)',
        borderRadius: 999, overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: c, borderRadius: 999,
          transition: 'width 320ms cubic-bezier(0.22,0.61,0.36,1)',
        }} />
      </div>
      <span style={{
        flex: 'none', width: 22, textAlign: 'right',
        fontFamily: 'Tottenham, "Barlow Condensed", sans-serif',
        fontSize: 18, lineHeight: 1, color: c,
        letterSpacing: '-0.01em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  )
}

StatBar.ratingColor = ratingColor
