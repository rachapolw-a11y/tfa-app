import { useState } from 'react'

function initials(name = '') {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

/**
 * TFA Avatar — circular player photo with optional gold gradient ring,
 * initials fallback when no photo.
 *
 * Ring rendered via padding on the outer div (gold gradient bg) + inner
 * circle (navy bg). box-sizing: border-box keeps outer at exactly `size×size`.
 */
export function Avatar({ name = '', photoURL, size = 46, ring = true }) {
  const [imgError, setImgError] = useState(false)
  const showImg = photoURL && !imgError
  const ringWidth = ring ? Math.max(2, Math.round(size * 0.032)) : 0

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        background: ring
          ? 'linear-gradient(140deg, var(--gold-light, #f7cd54), var(--gold-dark, #c8960a))'
          : 'transparent',
        padding: ringWidth,
        boxSizing: 'border-box',
        display: 'block',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'var(--navy-soft, #1a2942)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {showImg ? (
          <img
            src={photoURL}
            alt={name}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <span
            style={{
              fontFamily: 'Tottenham,"Barlow Condensed",sans-serif',
              fontSize: Math.round(size * 0.36),
              color: 'var(--gold)',
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {initials(name)}
          </span>
        )}
      </div>
    </div>
  )
}
