/**
 * TFA ScoreBadge — FIFA-style OVR badge.
 *
 * tone="gold"  → gold gradient (default, for top scores)
 * tone="navy"  → navy with gold text
 * tone="rated" → navy with rating-band border + text color
 *
 * size="sm" | "md" | "lg"
 */

function ratingColor(v) {
  if (v < 50) return 'var(--rating-low)'
  if (v < 70) return 'var(--rating-mid)'
  if (v < 85) return 'var(--rating-high)'
  return 'var(--rating-elite)'
}

const DIMS = {
  sm: { box: 40, num: 20, lbl: 8 },
  md: { box: 56, num: 28, lbl: 9 },
  lg: { box: 80, num: 44, lbl: 11 },
}

export function ScoreBadge({ value = 0, label = 'OVR', size = 'lg', tone = 'gold', style = {} }) {
  const d = DIMS[size] ?? DIMS.lg

  const tones = {
    gold: {
      background: 'linear-gradient(155deg, var(--gold, #f1b813), var(--gold-dim, #c8960a))',
      color: 'var(--navy, #070f1e)',
      border: 'none',
      boxShadow: 'var(--glow-gold, 0 4px 18px rgba(241,184,19,0.35))',
    },
    navy: {
      background: 'var(--navy-soft, #1a2942)',
      color: 'var(--gold, #f1b813)',
      border: '1px solid var(--border-strong, #34507e)',
      boxShadow: 'none',
    },
    rated: {
      background: 'var(--navy-soft, #1a2942)',
      color: ratingColor(value),
      border: `2px solid ${ratingColor(value)}`,
      boxShadow: 'none',
    },
  }
  const t = tones[tone] ?? tones.gold

  return (
    <div style={{
      width: d.box, height: d.box, flex: 'none',
      borderRadius: 'var(--radius-md, 12px)',
      background: t.background,
      border: t.border,
      boxShadow: t.boxShadow,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      lineHeight: 1,
      ...style,
    }}>
      <span style={{
        fontFamily: '"Spurs", "Barlow Condensed", sans-serif',
        fontSize: d.num, color: t.color,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: '"Barlow Condensed", sans-serif',
        fontWeight: 700, fontSize: d.lbl,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: t.color, opacity: 0.85, marginTop: 2,
      }}>
        {label}
      </span>
    </div>
  )
}
