/**
 * TFA ScoreBadge — FIFA-style OVR badge.
 *
 * tone="gold"  → gold gradient (default, for top scores)
 * tone="navy"  → navy with gold text
 * tone="rated" → rating-band gradient fill + dark text (matches the v2 redesign)
 *
 * size="sm" | "md" | "lg" | "xl"
 */

// Raw hex values needed for color-mix() — CSS variables don't work inside it.
const BAND_HEX = {
  low:   '#e2493f',
  mid:   '#f97316',
  high:  '#06b6d4',
  elite: '#f1b813',
}

function ratingBand(v) {
  if (v < 50) return BAND_HEX.low
  if (v < 70) return BAND_HEX.mid
  if (v < 85) return BAND_HEX.high
  return BAND_HEX.elite
}

const DIMS = {
  sm: { box: 40, num: 20, lbl: 8 },
  md: { box: 56, num: 28, lbl: 9 },
  lg: { box: 80, num: 44, lbl: 11 },
  xl: { box: 96, num: 56, lbl: 12 },
}

export function ScoreBadge({ value = 0, label = 'OVR', size = 'lg', tone = 'gold', band, style = {} }) {
  const d = DIMS[size] ?? DIMS.lg
  // `band` (elite/high/mid/low) overrides the raw-value band — used when a
  // caller has ranked the player against age-group peers instead of the
  // flat 0–99 scale. Falls back to the absolute band when not provided.
  const c = band ? BAND_HEX[band] : ratingBand(value)

  const tones = {
    gold: {
      background: 'linear-gradient(155deg, var(--gold, #f1b813), var(--gold-dim, #c8960a))',
      color: 'var(--navy, #070f1e)',
      border: '1px solid rgba(255,255,255,0.25)',
      boxShadow: 'var(--glow-gold, 0 4px 18px rgba(241,184,19,0.35))',
    },
    navy: {
      background: 'var(--navy-soft, #1a2942)',
      color: 'var(--gold, #f1b813)',
      border: '1px solid var(--border-strong, #34507e)',
      boxShadow: 'none',
    },
    // Rated tone: filled gradient using the rating band color, dark text. Matches v2.
    rated: {
      background: `linear-gradient(140deg, ${c}, color-mix(in srgb, ${c} 70%, black))`,
      color: '#0a1322',
      border: '1px solid rgba(255,255,255,0.25)',
      boxShadow: `0 4px 18px ${c}55`,
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
        fontFamily: 'Tottenham, "Barlow Condensed", sans-serif',
        fontSize: d.num, color: t.color,
        letterSpacing: '-0.01em',
        fontVariantNumeric: 'tabular-nums',
      }}>
        {value}
      </span>
      <span style={{
        fontFamily: '"Barlow Condensed", sans-serif',
        fontWeight: 700, fontSize: d.lbl,
        letterSpacing: '0.18em', textTransform: 'uppercase',
        color: t.color, opacity: 0.78, marginTop: 2,
      }}>
        {label}
      </span>
    </div>
  )
}
