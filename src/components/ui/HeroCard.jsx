/**
 * TFA HeroCard — navy-gradient panel shell with pitch-stripes + gold radial glow.
 *
 * Optional `jersey` renders a giant faint number bottom-right (used by Squad / Progress
 * featured-player heroes). `pad` controls inner padding; defaults match the README
 * spec of 20px mobile / 28px ≥md.
 */
export function HeroCard({ children, className = '', jersey, pad = true }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 tfa-hero-gradient shadow-lg ${className}`}
    >
      {/* Subtle diagonal pitch stripes texture */}
      <div className="absolute inset-0 tfa-pitch-stripes pointer-events-none" aria-hidden />

      {/* Faint ghost jersey number (decorative) */}
      {jersey != null ? (
        <div
          aria-hidden
          className="absolute font-display select-none pointer-events-none"
          style={{
            right: '-12px',
            bottom: '-32px',
            fontSize: '220px',
            lineHeight: 1,
            color: 'rgba(255,255,255,0.035)',
            letterSpacing: '-0.04em',
          }}
        >
          {jersey}
        </div>
      ) : null}

      <div className={`relative z-10 ${pad ? 'p-5 md:p-7' : ''}`}>{children}</div>
    </div>
  )
}
