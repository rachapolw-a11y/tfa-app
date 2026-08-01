/**
 * TFA PillTabs — horizontally scrollable pill row.
 *
 * Two API shapes (kept compatible):
 *   <PillTabs tabs={['U8','U10']} activeTab={'U10'} onChange={…} />
 *   <PillTabs items={[{value,label}]} value={…} onChange={…} scroll={true} />
 */
export function PillTabs({
  tabs,
  activeTab,
  items,
  value,
  onChange,
  scroll = true,
  size = 'md',
  className = '',
}) {
  // Normalize: accept legacy (tabs/activeTab) or new (items/value).
  const raw = items ?? tabs ?? []
  const list = raw.map((it) => (typeof it === 'string' ? { value: it, label: it } : it))
  const selected = value ?? activeTab

  const padY = size === 'sm' ? '6px' : '8px'
  const padX = size === 'sm' ? '12px' : '16px'
  const fs = size === 'sm' ? '11px' : '12px'

  return (
    <div
      role="tablist"
      className={`${scroll ? 'tfa-scroll-x flex' : 'flex flex-wrap'} gap-2 ${className}`}
    >
      {list.map((t) => {
        const isActive = selected === t.value
        return (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange?.(t.value)}
            className="shrink-0 inline-flex items-center justify-center rounded-pill font-condensed font-bold uppercase transition-all duration-200 ease-out-soft active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70"
            style={{
              padding: `${padY} ${padX}`,
              fontSize: fs,
              letterSpacing: '0.1em',
              background: isActive ? 'var(--gold)' : 'rgba(255,255,255,0.04)',
              color: isActive ? 'var(--navy)' : 'var(--text-muted)',
              border: isActive
                ? '1px solid transparent'
                : '1px solid rgba(255,255,255,0.10)',
              boxShadow: isActive ? 'var(--glow-gold)' : 'none',
              lineHeight: 1,
            }}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
