import { CARD_STATS, statValues } from './cardData'

const EDITIONS = {
  prime:   { ca: '#f1b813', caLight: '#ffd24a', caDark: '#c8960a', ce: '#2ad4ff' },
  venom:   { ca: '#2ee0c1', caLight: '#7defd9', caDark: '#15a98e', ce: '#c8ff3d' },
  inferno: { ca: '#ff5a3c', caLight: '#ff8055', caDark: '#c8360f', ce: '#ffc62e' },
  voltage: { ca: '#4d8dff', caLight: '#86b2ff', caDark: '#1f5fd6', ce: '#ffd24a' },
}

const FONT_DISPLAY   = "'Tottenham', 'Barlow Condensed', Impact, sans-serif"
const FONT_CONDENSED = "'Barlow Condensed', system-ui, sans-serif"
const FONT_BODY      = "'Barlow', system-ui, sans-serif"

const CREAM = '#f5f0e8'
const NAVY  = '#070f1e'
const MUTED = '#8fa1bd'
const POS_MID = '#2ec18d'

/**
 * 1080×1920 portrait shareable card.
 * Renders statically (no animations) so html-to-image captures the final state.
 *
 * @param {object} props
 * @param {object} props.player        — { name, position, ageGroup, photoURL }
 * @param {object} props.latest        — latest evaluation { skills: {...} }
 * @param {number} props.sessionsCount — total sessions attended
 * @param {string} props.ovr           — e.g. "8.5"
 * @param {string} props.edition       — 'prime' | 'venom' | 'inferno' | 'voltage'
 * @param {string} props.logoSrc       — TFA logo URL
 */
export default function SpecialCard({
  player,
  latest,
  sessionsCount = 0,
  ovr,
  edition = 'prime',
  logoSrc,
}) {
  const e = EDITIONS[edition] || EDITIONS.prime
  const stats = statValues(latest)
  const ovrText = ovr ?? '—'
  const pos = (player?.position || 'MID').toUpperCase()
  const age = (player?.ageGroup || 'U10').toUpperCase()

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
        padding: '64px 60px 56px',
        background: 'radial-gradient(130% 70% at 50% 0%, #16243f 0%, #0a1322 46%, #05090f 100%)',
        color: CREAM,
        fontFamily: FONT_BODY,
      }}
    >
      {/* Diagonal streaks */}
      <div style={{ position: 'absolute', inset: '-22%', pointerEvents: 'none', opacity: 0.1,
        backgroundImage: `repeating-linear-gradient(122deg, ${e.ca} 0 3px, transparent 3px 46px)` }} />
      <div style={{ position: 'absolute', inset: '-22%', pointerEvents: 'none', opacity: 0.08,
        backgroundImage: `repeating-linear-gradient(122deg, ${e.ce} 0 2px, transparent 2px 120px)` }} />
      {/* Top sheen band */}
      <div style={{ position: 'absolute', top: '-8%', left: '-25%', width: '150%', height: '70%',
        pointerEvents: 'none', transform: 'skewY(-13deg)',
        background: `linear-gradient(100deg, transparent 30%, ${e.ca}29 50%, transparent 70%)` }} />

      {/* Header */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {logoSrc && <img src={logoSrc} alt="TFA" crossOrigin="anonymous" style={{ width: 50, height: 'auto', display: 'block' }} />}
          <div style={{ fontFamily: FONT_CONDENSED, fontWeight: 700, fontStyle: 'italic', textTransform: 'uppercase',
            letterSpacing: '0.12em', fontSize: 20, lineHeight: 1, color: CREAM }}>
            The Football<br />Academy
          </div>
        </div>
        <div style={{ fontFamily: FONT_CONDENSED, fontWeight: 700, fontStyle: 'italic', textTransform: 'uppercase',
          letterSpacing: '0.22em', fontSize: 18, color: NAVY, padding: '9px 20px 9px 16px',
          background: `linear-gradient(120deg, ${e.caLight}, ${e.caDark})`,
          clipPath: 'polygon(12% 0, 100% 0, 88% 100%, 0 100%)',
          boxShadow: `0 0 24px ${e.ca}8c` }}>Special</div>
      </div>

      {/* Photo block */}
      <div style={{ position: 'relative', marginTop: 30, height: 760 }}>
        <div style={{ position: 'absolute', inset: 0, clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
          background: `linear-gradient(150deg, ${e.caLight}, ${e.ca} 45%, ${e.caDark})`,
          filter: `drop-shadow(0 0 34px ${e.ca}8c)` }} />
        <div style={{ position: 'absolute', inset: 5, clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)',
          overflow: 'hidden', background: NAVY }}>
          {player?.photoURL ? (
            <img src={player.photoURL} alt={player.name} crossOrigin="anonymous"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_DISPLAY, fontSize: 360, color: CREAM, opacity: 0.18 }}>
              {(player?.name || '?')[0].toUpperCase()}
            </div>
          )}
          {/* Coloured overlay */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `linear-gradient(150deg, ${e.ca}8c 0%, transparent 42%)`, opacity: 0.5 }} />
          {/* Bottom fade */}
          <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: '52%', pointerEvents: 'none',
            background: 'linear-gradient(to top, rgba(5,9,15,0.97) 6%, rgba(5,9,15,0.5) 42%, transparent 100%)' }} />
        </div>

        {/* Position / age chips */}
        <div style={{ position: 'absolute', top: 22, right: 22, display: 'flex', flexDirection: 'column',
          gap: 11, alignItems: 'flex-end' }}>
          <span style={{ fontFamily: FONT_CONDENSED, fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.14em',
            fontSize: 26, color: NAVY, background: POS_MID, padding: '8px 20px 8px 16px',
            clipPath: 'polygon(14% 0, 100% 0, 86% 100%, 0 100%)',
            boxShadow: '0 6px 16px rgba(0,0,0,0.4)' }}>{pos}</span>
          <span style={{ fontFamily: FONT_CONDENSED, fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.14em',
            fontSize: 23, color: e.caLight, background: 'rgba(5,9,15,0.7)', border: `1px solid ${e.ca}`,
            padding: '7px 20px 7px 16px',
            clipPath: 'polygon(14% 0, 100% 0, 86% 100%, 0 100%)' }}>{age}</span>
        </div>

        {/* OVR */}
        <div style={{ position: 'absolute', left: 16, bottom: 22, display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <div style={{ position: 'relative', lineHeight: 0.8 }}>
            <span style={{ position: 'relative', fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 150,
              color: e.caLight, textShadow: `0 0 22px ${e.ca}, 0 0 56px ${e.ca}` }}>{ovrText}</span>
          </div>
          <span style={{ fontFamily: FONT_CONDENSED, fontWeight: 700, fontStyle: 'italic', letterSpacing: '0.28em',
            fontSize: 22, color: CREAM, paddingBottom: 30 }}>OVR</span>
        </div>
      </div>

      {/* Name band */}
      <div style={{ position: 'relative', zIndex: 3, marginTop: -26, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', overflow: 'hidden',
          background: `linear-gradient(120deg, ${e.caLight}, ${e.ca} 50%, ${e.caDark})`,
          color: NAVY, fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontSize: 58,
          textTransform: 'uppercase', letterSpacing: '0.01em', lineHeight: 1, padding: '16px 56px',
          clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)',
          boxShadow: `0 12px 34px rgba(0,0,0,0.5), 0 0 30px ${e.ca}73`, whiteSpace: 'nowrap' }}>
          {player?.name || 'Player'}
        </div>
      </div>

      {/* Stat bars */}
      <div style={{ marginTop: 42, display: 'flex', flexDirection: 'column', gap: 22 }}>
        {stats.map(s => {
          const widthPct = Math.max(0, Math.min(100, (s.value / 10) * 100))
          return (
            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
              <span style={{ width: 250, fontFamily: FONT_CONDENSED, fontWeight: 700, fontStyle: 'italic',
                textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: 30, color: CREAM }}>{s.label}</span>
              <div style={{ flex: 1, height: 18, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                <div style={{ width: `${widthPct}%`, height: '100%', borderRadius: 999,
                  background: `linear-gradient(90deg, ${e.caDark}, ${e.caLight})`,
                  boxShadow: `0 0 16px ${e.ca}99` }} />
              </div>
              <span style={{ width: 58, textAlign: 'right', fontFamily: FONT_DISPLAY, fontStyle: 'italic',
                fontSize: 46, color: e.caLight }}>{s.value}</span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 34, height: 4, background: e.ca, transform: 'skewX(-30deg)' }} />
          <div style={{ fontFamily: FONT_CONDENSED, fontWeight: 600, fontStyle: 'italic', textTransform: 'uppercase',
            letterSpacing: '0.12em', color: MUTED, fontSize: 23 }}>
            {sessionsCount} {sessionsCount === 1 ? 'Session' : 'Sessions'} • Class of {age}
          </div>
        </div>
        <div style={{ fontFamily: FONT_CONDENSED, fontWeight: 700, fontStyle: 'italic', textTransform: 'uppercase',
          letterSpacing: '0.16em', color: e.ca, fontSize: 24 }}>#TFA</div>
      </div>
    </div>
  )
}

export { EDITIONS }
