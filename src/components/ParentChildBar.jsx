import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { HexAvatar } from './ui'
import { useParent } from '../lib/parentContext'

export function ParentChildBar() {
  const { activePlayers, child, pickChild } = useParent()
  const [open, setOpen] = useState(false)

  if (!child) return null
  const siblings = activePlayers.filter(p => p.id !== child.id).slice(0, 3)

  return (
    <div className="sticky top-14 z-30 tfa-blur-bar border-b border-white/[0.06]">
      <div className="mx-auto max-w-[1080px] px-4 md:px-6 py-2 flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => activePlayers.length > 1 && setOpen(v => !v)}
          className="flex items-center gap-2.5 flex-1 min-w-0 px-2 py-1 rounded-pill bg-white/[0.04] border border-gold/40 text-left"
        >
          <HexAvatar name={child.name} photoURL={child.photoURL} size={30} glow />
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold uppercase text-cream text-sm leading-none truncate">
              {child.name}
            </div>
            <div className="font-condensed font-bold uppercase tracking-[0.06em] text-muted text-[9.5px] mt-0.5">
              {child.ageGroup} · {child.position}
            </div>
          </div>
          {activePlayers.length > 1 && <ChevronDown size={13} className="text-muted mr-1.5" />}
        </button>

        {siblings.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => pickChild(p.id)}
            title={p.name}
            className="w-9 h-9 rounded-full bg-navy-soft border border-white/[0.1] flex items-center justify-center overflow-hidden flex-none"
          >
            <HexAvatar name={p.name} photoURL={p.photoURL} size={30} />
          </button>
        ))}
      </div>

      {open && activePlayers.length > 1 && (
        <div className="mx-auto max-w-[1080px] px-4 md:px-6 pb-2">
          <div className="rounded-md border border-white/[0.08] bg-white/[0.03] divide-y divide-white/[0.05]">
            {activePlayers.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => { pickChild(p.id); setOpen(false) }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left"
              >
                <HexAvatar name={p.name} photoURL={p.photoURL} size={28} />
                <div className="flex-1">
                  <div className="font-display text-cream text-sm">{p.name}</div>
                  <div className="font-condensed text-[10px] text-muted uppercase tracking-[0.06em]">
                    {p.ageGroup} · {p.position}
                  </div>
                </div>
                {p.id === child.id && <span className="text-gold text-xs">●</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
