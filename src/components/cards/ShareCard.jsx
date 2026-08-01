import { CARD_STATS, statValues } from './cardData'

const TIERS = {
  gold:    { ca: '#f1b813', caLight: '#f7cd54', caDark: '#c8960a', glow: 'rgba(241,184,19,0.42)' },
  silver:  { ca: '#cdd6e4', caLight: '#eef2f8', caDark: '#98a6bd', glow: 'rgba(205,214,228,0.34)' },
  bronze:  { ca: '#d0894f', caLight: '#e8aa76', caDark: '#9c5c2c', glow: 'rgba(208,137,79,0.40)' },
  special: { ca: '#2ee0c1', caLight: '#7eefd9', caDark: '#15a98e', glow: 'rgba(46,224,193,0.42)' },
}

const FONT_DISPLAY   = "'Tottenham', 'Barlow Condensed', Impact, sans-serif"
const FONT_CONDENSED = "'Barlow Condensed', system-ui, sans-serif"
const FONT_BODY      = "'Barlow', system-ui, sans-serif"

const CREAM = '#f5f0e8'
const NAVY  = '#070f1e'
const NAVY_SOFT = '#1a2942'
const MUTED = '#8fa1bd'
const BORDER_STRONG = '#34507e'
const POS_MID = '#2ec18d'

/**
 * 1080×1920 portrait shareable card — calmer, no animations.
 *
 * @param {object} props.player
 * @param {object} props.latest
 * @param {number} props.sessionsCount
 * @param {string} props.ovr
 * @param {string} props.tier   — 'gold' | 'silver' | 'bronze' | 'special'
 * @param {string} props.season — e.g. "Season 2025/26"
 * @param {string} props.logoSrc
 * @param {boolean} props.showStars
 * @param {boolean} props.gloss
 */
export default function ShareCard({
  player,
  latest,
  sessionsCount = 0,
  ovr,
  tier = 'gold',
  season = 'Season 2025/26',
  logoSrc,
  showStars = true,
  gloss = true,
}) {
  const t = TIERS[tier] || TIERS.gold
  const stats = statValues(latest)
  const ovrText = ovr ?? '—'
  const pos = (player?.position || 'MID').toUpperCase()
  const age = (player?.ageGroup || 'U10').toUpperCase()

  // Star count: 1 star per 3.33 OVR points, capped at 3
  const numericOvr = Number(ovrText)
  const stars = Number.isFinite(numericOvr) ? Math.max(1, Math.min(3, Math.round(numericOvr / 3.34))) : 3

  // Split 6 stats into 2 columns of 3
  const left  = stats.slice(0, 3)
  const right = stats.slice(3)

  return (
    <div
      style={{
        width: 1080,
        height: 1920,
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 64px 64px',
        background: 'radial-gradient(120% 80% at 50% -10%, #14233f 0%, #0a1424 45%, #070f1e 100%)',
        color: CREAM,
        fontFamily: FONT_BODY,
      }}
    >
      {/* Texture lines */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.5,
        backgroundImage: 'repeating-linear-gradient(115deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 2px, transparent 2px, transparent 64px)' }} />
      {/* Soft tier glow disc */}
      <div style={{ position: 'absolute', top: 280, left: '50%', transform: 'translateX(-50%)',
        width: 760, height: 760, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(closest-side, ${t.ca}42, transparent)`, filter: 'blur(20px)' }} />

      {/* Header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {logoSrc && <img src={logoSrc} alt="TFA" crossOrigin="anonymous" style={{ width: 56, height: 'auto', display: 'block' }} />}
          <div style={{ fontFamily: FONT_CONDENSED, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.16em', fontSize: 21, lineHeight: 1.05, color: CREAM }}>
            The Football<br />Academy
          </div>
        </div>
        <div style={{ fontFamily: FONT_CONDENSED, fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.16em', fontSize: 19, color: MUTED, border: `1px solid ${BORDER_STRONG}`,
          padding: '9px 18px', borderRadius: 999 }}>{season}</div>
      </div>

      {/* Photo card */}
      <div style={{ position: 'relative', marginTop: 40, height: 880, borderRadius: 34,
        border: `3px solid ${t.ca}`, boxShadow: `0 10px 38px ${t.glow}, 0 16px 40px rgba(3,8,18,0.48)`,
        overflow: 'hidden', background: NAVY_SOFT }}>
        {player?.photoURL ? (
          <img src={player.photoURL} alt={player.name} crossOrigin="anonymous"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        ) : (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONT_DISPLAY, fontSize: 420, color: CREAM, opacity: 0.18 }}>
            {(player?.name || '?')[0].toUpperCase()}
          </div>
        )}

        {/* Bottom fade */}
        <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: '48%', pointerEvents: 'none',
          background: 'linear-gradient(to top, rgba(7,15,30,0.96) 8%, rgba(7,15,30,0.55) 45%, transparent 100%)' }} />

        {/* Gloss sheen */}
        {gloss && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(118deg, transparent 38%, rgba(255,255,255,0.16) 49%, rgba(255,255,255,0.04) 53%, transparent 62%)' }} />
        )}

        {/* OVR badge top-left */}
        <div style={{ position: 'absolute', top: 28, left: 28, display: 'flex', flexDirection: 'column',
          alignItems: 'center', lineHeight: 0.86, padding: '14px 22px 12px', borderRadius: 20,
          color: NAVY, background: `linear-gradient(158deg, ${t.caLight}, ${t.caDark})`,
          boxShadow: '0 8px 22px rgba(0,0,0,0.42)' }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 76 }}>{ovrText}</span>
          <span style={{ fontFamily: FONT_CONDENSED, fontWeight: 700, letterSpacing: '0.24em',
            fontSize: 17, marginTop: 2 }}>OVR</span>
        </div>

        {/* Position / age top-right */}
        <div style={{ position: 'absolute', top: 28, right: 28, display: 'flex', flexDirection: 'column',
          gap: 12, alignItems: 'flex-end' }}>
          <span style={{ background: POS_MID, color: '#04130c', fontFamily: FONT_CONDENSED, fontWeight: 700,
            letterSpacing: '0.14em', fontSize: 25, padding: '9px 20px', borderRadius: 999,
            boxShadow: '0 6px 16px rgba(0,0,0,0.35)' }}>{pos}</span>
          <span style={{ background: 'rgba(7,15,30,0.62)', border: `1px solid ${t.ca}`, color: t.caLight,
            fontFamily: FONT_CONDENSED, fontWeight: 700, letterSpacing: '0.14em', fontSize: 23,
            padding: '8px 20px', borderRadius: 999 }}>{age}</span>
        </div>
      </div>

      {/* Name banner */}
      <div style={{ position: 'relative', zIndex: 3, marginTop: -44, display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: `linear-gradient(158deg, ${t.caLight}, ${t.caDark})`, color: NAVY,
          fontFamily: FONT_DISPLAY, fontSize: 60, textTransform: 'uppercase', letterSpacing: '0.02em',
          lineHeight: 1, padding: '18px 52px', borderRadius: 20,
          boxShadow: `0 16px 40px rgba(3,8,18,0.48), 0 10px 34px ${t.glow}`, whiteSpace: 'nowrap' }}>
          {player?.name || 'Player'}
        </div>
      </div>

      {/* Stars */}
      {showStars && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 22,
          color: t.ca, fontSize: 40, lineHeight: 1 }}>
          {Array.from({ length: stars }).map((_, i) => <span key={i}>★</span>)}
        </div>
      )}

      {/* Stat grid */}
      <div style={{ display: 'flex', marginTop: 48 }}>
        <StatColumn rows={left} tier={t} side="right" />
        <div style={{ width: 2, background: `linear-gradient(to bottom, transparent, ${BORDER_STRONG} 20%, ${BORDER_STRONG} 80%, transparent)` }} />
        <StatColumn rows={right} tier={t} side="left" />
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ height: 1, background: BORDER_STRONG }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: FONT_CONDENSED, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.14em', color: MUTED, fontSize: 24 }}>
            {sessionsCount} {sessionsCount === 1 ? 'Session' : 'Sessions'}  •  Class of {age}
          </div>
          <div style={{ fontFamily: FONT_CONDENSED, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '0.16em', color: t.ca, fontSize: 24 }}>#TFA</div>
        </div>
      </div>
    </div>
  )
}

function StatColumn({ rows, tier, side }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 30,
      paddingRight: side === 'right' ? 44 : 0, paddingLeft: side === 'left' ? 44 : 0 }}>
      {rows.map(s => (
        <div key={s.key} style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 62, color: tier.caLight,
            minWidth: 72, textAlign: 'right' }}>{s.value}</span>
          <span style={{ fontFamily: FONT_CONDENSED, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.14em', fontSize: 32, color: MUTED }}>{s.label}</span>
        </div>
      ))}
    </div>
  )
}

export { TIERS }
