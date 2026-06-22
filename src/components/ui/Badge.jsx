/**
 * TFA Badge — condensed-uppercase pill for age groups, positions, lead status.
 *
 * kind="age"      → gold tint   (e.g. value="U12")
 * kind="position" → pitch-role color (value="GK"|"DEF"|"MID"|"FWD")
 * kind="status"   → lead-funnel color (value="new"|"trial"|"attended"|"offer"|"paid"|"enrolled")
 * kind="neutral"  → subtle surface (default)
 * kind="solid"    → gold fill
 */

const POS_COLOR = {
  GK:  'var(--pos-gk)',
  DEF: 'var(--pos-def)',
  MID: 'var(--pos-mid)',
  FWD: 'var(--pos-fwd)',
}

const STATUS_META = {
  new:      { color: 'var(--status-new)',      label: 'New'            },
  trial:    { color: 'var(--status-trial)',    label: 'Trial booked'   },
  attended: { color: 'var(--status-attended)', label: 'Trial attended' },
  offer:    { color: 'var(--status-offer)',    label: 'Offer sent'     },
  paid:     { color: 'var(--status-paid)',     label: 'Paid'           },
  enrolled: { color: 'var(--status-enrolled)', label: 'Enrolled'       },
}

export function Badge({ children, kind = 'neutral', value, size = 'md', style = {}, ...rest }) {
  const pad = size === 'sm' ? '3px 8px' : '4px 11px'
  const fs  = size === 'sm' ? '10px'    : '11px'

  let bg = 'var(--navy-soft)', fg = 'var(--cream)', border = '1px solid var(--navy-line)'
  let label = children ?? value

  if (kind === 'age') {
    bg = 'color-mix(in srgb, var(--gold) 16%, transparent)'
    fg = 'var(--gold-light)'
    border = '1px solid color-mix(in srgb, var(--gold) 40%, transparent)'
  } else if (kind === 'position') {
    const c = POS_COLOR[value] ?? 'var(--text-muted)'
    bg = `color-mix(in srgb, ${c} 18%, transparent)`
    fg = c
    border = `1px solid color-mix(in srgb, ${c} 50%, transparent)`
  } else if (kind === 'status') {
    const s = STATUS_META[value] ?? { color: 'var(--status-new)', label: value }
    bg = s.color; fg = '#fff'; border = '1px solid transparent'
    label = children ?? s.label
  } else if (kind === 'solid') {
    bg = 'var(--gold)'; fg = 'var(--navy)'; border = '1px solid transparent'
  }

  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center',
        padding: pad,
        fontFamily: 'var(--font-condensed, "Barlow Condensed", sans-serif)',
        fontWeight: 600,
        fontSize: fs,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        lineHeight: 1,
        borderRadius: 'var(--radius-pill, 999px)',
        whiteSpace: 'nowrap',
        background: bg, color: fg, border,
        ...style,
      }}
      {...rest}
    >
      {label}
    </span>
  )
}

Badge.POS_COLOR   = POS_COLOR
Badge.STATUS_META = STATUS_META
