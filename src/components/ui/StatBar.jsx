/**
 * TFA StatBar — labelled 0–10 skill bar with rating-band color chip.
 * Used in player profiles and the parent portal skill breakdown.
 *
 * Rating bands: 0–3 red, 4–6 orange, 7–8 cyan, 9–10 gold
 */

function ratingColor(v) {
  if (v <= 3) return 'var(--rating-low)'
  if (v <= 6) return 'var(--rating-mid)'
  if (v <= 8) return 'var(--rating-high)'
  return 'var(--rating-elite)'
}

export function StatBar({ label, value = 0, max = 10, color, style = {} }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  const c   = color ?? ratingColor(value)

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
        fontFamily: '"Spurs", "Barlow Condensed", sans-serif',
        fontSize: 18, lineHeight: 1, color: c,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
    </div>
  )
}

StatBar.ratingColor = ratingColor
