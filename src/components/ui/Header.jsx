import { initials } from '../../lib/ratings'

/**
 * TFA Header — sticky top bar with crest + wordmark + optional ⌘K hint + coach avatar.
 *
 * Lives inside the centered shell, so it stretches across the shell width.
 * Uses tfa-blur-bar (saturate 140% + blur 14px) over translucent navy.
 *
 * Props:
 *   subtitle  — small condensed-uppercase line under the wordmark. Default "Coach dashboard".
 *   coachName — name string used to generate the avatar initials. Default "Coach Racha".
 *   onSearch  — optional click handler for the ⌘K hint button.
 */
export function Header({
  subtitle = 'Coach dashboard',
  coachName = 'Coach Racha',
  onSearch,
  onLogoClick,
}) {
  const logoContent = (
    <>
      <img
        src="/tfa-logo.png"
        alt="TFA"
        className="h-9 w-9 object-contain shrink-0"
        style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))' }}
      />
      <div className="leading-tight min-w-0 text-left">
        <div
          className="font-display uppercase text-cream truncate"
          style={{ fontSize: 15, letterSpacing: '0.04em', lineHeight: 1.05 }}
        >
          The Football Academy
        </div>
        {subtitle ? (
          <div className="font-condensed uppercase text-[10.5px] tracking-[0.22em] text-muted truncate">
            {subtitle}
          </div>
        ) : null}
      </div>
    </>
  )

  return (
    <header className="sticky top-0 z-40 tfa-blur-bar border-b border-white/[0.06] pt-safe">
      <div className="mx-auto max-w-[1080px] h-14 px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Crest + wordmark — tap returns to the role's home tab */}
        {onLogoClick ? (
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="Home"
            className="flex items-center gap-3 min-w-0 rounded-md -mx-1 px-1 transition-opacity duration-fast active:opacity-70 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
          >
            {logoContent}
          </button>
        ) : (
          <div className="flex items-center gap-3 min-w-0">{logoContent}</div>
        )}

        {/* Search hint + coach avatar */}
        <div className="flex items-center gap-3 shrink-0">
          {onSearch && (
            <button
              type="button"
              onClick={onSearch}
              className="hidden md:inline-flex font-condensed uppercase text-[11px] tracking-[0.18em] text-muted hover:text-cream transition-colors"
            >
              ⌘K · Search
            </button>
          )}
          <div
            className="h-9 w-9 rounded-full bg-navy-soft flex items-center justify-center font-condensed font-bold uppercase text-[12px] tracking-[0.05em] text-cream shrink-0"
            style={{
              boxShadow: '0 0 0 2px var(--gold), 0 4px 18px rgba(241,184,19,0.35)',
            }}
            title={coachName}
          >
            {initials(coachName) || '·'}
          </div>
        </div>
      </div>
    </header>
  )
}
