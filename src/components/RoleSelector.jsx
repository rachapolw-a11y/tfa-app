import { useState } from 'react'
import { Home, Clipboard, BarChart3, UserPlus } from 'lucide-react'
import tfaLogo from '../assets/tfa-logo.png'
import { ROLE_LABEL, ROLE_TAGLINE, PIN_GATED, COACH_PIN, ADMIN_PIN } from '../lib/roles'
import EnrollForm from './EnrollForm'

const ROLE_ICONS = {
  parent: Home,
  coach:  Clipboard,
  admin:  BarChart3,
}

const PINS = { coach: COACH_PIN, admin: ADMIN_PIN }

export default function RoleSelector({ onPick }) {
  const [pinFor, setPinFor]     = useState(null)
  const [pin, setPin]           = useState('')
  const [pinError, setError]    = useState('')
  const [enrolling, setEnrolling] = useState(false)

  function choose(role) {
    if (PIN_GATED.has(role)) {
      setPinFor(role)
      setPin('')
      setError('')
    } else {
      onPick(role)
    }
  }

  function submitPin(e) {
    e.preventDefault()
    if (pin === PINS[pinFor]) {
      onPick(pinFor)
    } else {
      setError('Incorrect PIN')
    }
  }

  // ── Enrollment surface ────────────────────────────────────────────────────
  if (enrolling) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center px-5 py-10">
        <div className="flex items-center gap-3 mb-6">
          <img src={tfaLogo} alt="TFA" className="h-12 w-auto" />
          <div>
            <div className="font-condensed font-bold uppercase tracking-[0.2em] text-[10px] text-muted">
              The Football Academy
            </div>
            <div
              className="font-display font-bold uppercase text-cream text-[26px]"
              style={{ lineHeight: 0.9 }}
            >
              New Enrollment
            </div>
          </div>
        </div>
        <div className="w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <EnrollForm onBack={() => setEnrolling(false)} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-5 py-10">
      <div className="flex items-center gap-3 mb-8">
        <img src={tfaLogo} alt="TFA" className="h-12 w-auto" />
        <div>
          <div className="font-condensed font-bold uppercase tracking-[0.2em] text-[10px] text-muted">
            The Football Academy
          </div>
          <div
            className="font-display font-bold uppercase text-cream text-[26px]"
            style={{ lineHeight: 0.9 }}
          >
            Who's using the app?
          </div>
        </div>
      </div>

      {!pinFor && (
        <div className="grid grid-cols-2 gap-3 w-full max-w-[420px]">
          {['parent', 'coach', 'admin'].map(r => {
            const Icon = ROLE_ICONS[r]
            return (
              <button
                key={r}
                type="button"
                onClick={() => choose(r)}
                className="flex flex-col items-start gap-2 p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-gold/40 transition-all duration-200 ease-out-soft active:scale-[0.98] text-left"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
                  <Icon size={20} strokeWidth={2} className="text-gold" />
                </span>
                <div
                  className="font-display font-bold uppercase text-cream text-[22px]"
                  style={{ lineHeight: 0.9 }}
                >
                  {ROLE_LABEL[r]}
                </div>
                <div className="font-condensed text-[11px] tracking-[0.04em] text-muted leading-snug">
                  {ROLE_TAGLINE[r]}
                </div>
                {PIN_GATED.has(r) && (
                  <span className="font-condensed font-bold uppercase tracking-[0.12em] text-[9px] text-gold mt-1">
                    PIN required
                  </span>
                )}
              </button>
            )
          })}

          {/* ── New Family enrollment card (bottom-right slot) ── */}
          <button
            type="button"
            onClick={() => setEnrolling(true)}
            className="flex flex-col items-start gap-2 p-4 rounded-2xl border border-gold/20 bg-gold/[0.04] hover:bg-gold/[0.08] hover:border-gold/50 transition-all duration-200 ease-out-soft active:scale-[0.98] text-left"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
              <UserPlus size={20} strokeWidth={2} className="text-gold" />
            </span>
            <div
              className="font-display font-bold uppercase text-cream text-[22px]"
              style={{ lineHeight: 0.9 }}
            >
              New Family
            </div>
            <div className="font-condensed text-[11px] tracking-[0.04em] text-muted leading-snug">
              Enroll your child · get started
            </div>
            <span className="font-condensed font-bold uppercase tracking-[0.12em] text-[9px] text-gold mt-1">
              New enrollment
            </span>
          </button>
        </div>
      )}

      {pinFor && (
        <form
          onSubmit={submitPin}
          className="w-full max-w-[320px] flex flex-col gap-3 p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03]"
        >
          <div className="font-condensed font-bold uppercase tracking-[0.14em] text-[10px] text-gold">
            {ROLE_LABEL[pinFor]} PIN
          </div>
          <input
            autoFocus
            inputMode="numeric"
            pattern="[0-9]*"
            value={pin}
            onChange={e => { setPin(e.target.value); setError('') }}
            className="w-full h-12 px-4 rounded-md bg-navy-soft border border-white/[0.1] text-cream font-display text-xl tracking-[0.4em] text-center focus:outline-none focus:border-gold"
            placeholder="••••"
            maxLength={6}
          />
          {pinError && (
            <div className="font-condensed text-[11px] text-red-400 text-center">{pinError}</div>
          )}
          <div className="flex gap-2 mt-1">
            <button
              type="button"
              onClick={() => setPinFor(null)}
              className="flex-1 h-11 rounded-md border border-white/[0.1] text-muted font-condensed font-bold uppercase tracking-[0.12em] text-xs"
            >
              Back
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-md bg-gold text-navy font-condensed font-bold uppercase tracking-[0.12em] text-xs"
            >
              Enter
            </button>
          </div>
        </form>
      )}

      <div className="font-condensed text-[10px] tracking-[0.14em] uppercase text-faint mt-8">
        Pick once · you can switch later in More
      </div>
    </div>
  )
}
