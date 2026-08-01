/**
 * TFA Button — canonical pill button.
 *
 * variant: 'primary' (gold + glow) | 'secondary' (subtle surface) | 'ghost' (text-only)
 *        | 'danger' (red) | 'outline' (gold outline)
 * size:    'sm' | 'md' (default) | 'lg'
 * block:   true → fills width
 */
export function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  const sizes = {
    sm: 'h-9 px-3 text-[12px]',
    md: 'h-11 px-5 text-[13px]',
    lg: 'h-12 px-6 text-[14px]',
  }
  const variants = {
    primary:
      'bg-gold text-navy hover:bg-gold-light active:bg-gold-dark shadow-glow hover:shadow-glow-lg',
    secondary:
      'bg-white/5 text-cream border border-white/10 hover:bg-white/10 active:bg-white/[0.15]',
    ghost: 'text-cream hover:bg-white/5 active:bg-white/10',
    danger: 'text-white hover:brightness-110',
    outline:
      'border border-gold/60 text-gold hover:bg-gold/10 active:bg-gold/20',
  }
  const variantInline = variant === 'danger' ? { background: 'var(--danger)' } : undefined

  return (
    <button
      type={type}
      style={variantInline}
      className={`inline-flex items-center justify-center gap-2 font-condensed font-bold uppercase tracking-[0.08em] rounded-pill transition-all duration-200 ease-out-soft active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 disabled:opacity-45 disabled:pointer-events-none ${sizes[size]} ${variants[variant]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {leftIcon ? <span className="inline-flex">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="inline-flex">{rightIcon}</span> : null}
    </button>
  )
}
