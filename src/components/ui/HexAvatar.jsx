import { useState } from 'react'

// Pointy-top hexagon clip-path
const HEX = 'polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)'

function initials(name = '') {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

/**
 * HexAvatar — hexagon-clipped player photo with a gold ring + optional glow,
 * initials fallback when no photo. `size` is the width; height defaults to the
 * proper pointy-top regular hex ratio (≈1.155×).
 *
 * Ring rendering — the inner hex uses `transform: scale(sx, sy)` rather than
 * `inset: Npx`. Reason: when a hex clip-path is applied to a smaller rectangle
 * its vertex *positions* differ from the outer hex (since the polygon points are
 * percentage-based), producing a non-uniform ring (gold thick on one side, thin
 * on the other). A concentric scale gives a perfectly uniform ring around the
 * whole hex.
 */
export function HexAvatar({
  name = '',
  photoURL,
  size = 46,
  height,
  ring = true,
  glow = false,
  ringWidth = 3,
}) {
  const [imgError, setImgError] = useState(false)
  const w = size
  const h = height ?? Math.round(size * 1.155)

  // Scale factors that shrink the inner hex by `ringWidth` pixels on each side.
  const sx = ring ? Math.max(0, (w - ringWidth * 2) / w) : 1
  const sy = ring ? Math.max(0, (h - ringWidth * 2) / h) : 1

  const outer = {
    width: w,
    height: h,
    flexShrink: 0,
    position: 'relative',
    clipPath: HEX,
    WebkitClipPath: HEX,
    background: ring
      ? 'linear-gradient(140deg, var(--gold-light, #f7cd54), var(--gold-dark, #c8960a))'
      : 'transparent',
    filter: glow ? 'drop-shadow(0 0 12px rgba(241,184,19,.45))' : undefined,
  }

  const innerWrap = {
    position: 'absolute',
    inset: 0,
    clipPath: HEX,
    WebkitClipPath: HEX,
    overflow: 'hidden',
    background: 'var(--navy-soft, #1a2942)',
    transform: `scale(${sx}, ${sy})`,
    transformOrigin: 'center',
  }

  const showImg = photoURL && !imgError

  return (
    <div style={outer}>
      <div style={innerWrap}>
        {showImg ? (
          <img
            src={photoURL}
            alt={name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'Tottenham,"Barlow Condensed",sans-serif',
                fontSize: Math.round(w * 0.36),
                color: 'var(--gold)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {initials(name)}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
