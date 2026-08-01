import { useState, useEffect, useMemo } from 'react'
import { subscribeTo, updatePlayer, makeEditCode, convertLeadToPlayer } from '../../lib/storage'
import { Button } from '../../components/ui'
import Modal from '../../components/Modal'
import { calcAge } from '../../lib/ratings'
import { KeyRound, Copy, Check, Link2, ChevronRight, UserPlus } from 'lucide-react'

function useAdminData() {
  const [players, setPlayers] = useState([])
  const [leads,   setLeads]   = useState([])
  useEffect(() => {
    const unsubs = [
      subscribeTo('players', setPlayers),
      subscribeTo('leads',   setLeads),
    ]
    return () => unsubs.forEach(fn => fn())
  }, [])
  return { players, leads }
}

const LEAD_STAGES = [
  { key: 'new',   label: 'New',   color: '#7286a0', width: '20%' },
  { key: 'trial', label: 'Trial', color: '#3b9ae1', width: '40%' },
  { key: 'offer', label: 'Offer', color: '#9b7cf0', width: '20%' },
  { key: 'paid',  label: 'Paid',  color: '#2ec18d', width: '20%' },
]

// ── ADMIN · DASH ──────────────────────────────────────────────────────────────

export function AdminDash({ onOpenLeads }) {
  const { players, leads } = useAdminData()
  const [codesOpen, setCodesOpen] = useState(false)
  // Lead IDs converted in this session — kept visible so admin can copy the
  // code/link after Generate, even though they now have editCode and would
  // otherwise drop out of the pending filter.
  const [justConverted, setJustConverted] = useState(() => new Set())
  const enrolled = players.filter(p => p.active).length

  const pendingLeads = useMemo(
    () => leads
      .filter(l => (!l.editCode || justConverted.has(l.id)) && l.stage !== 'lost')
      .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)),
    [leads, justConverted],
  )

  const funnel = useMemo(() => {
    const counts = { new: 0, trial: 0, offer: 0, paid: 0 }
    leads.forEach(l => {
      const k = (l.stage || 'new').toLowerCase()
      if (k in counts) counts[k] += 1
    })
    const total = Math.max(1, Object.values(counts).reduce((a,b) => a+b, 0))
    return LEAD_STAGES.map(s => ({
      ...s,
      count: counts[s.key],
      width: `${(counts[s.key] / total) * 100}%`,
    }))
  }, [leads])

  const activeLeads = leads.filter(l => l.stage !== 'paid' && l.stage !== 'lost').length

  const codedCount    = players.filter(p => !!p.editCode).length
  const totalPlayers  = players.length
  const missingCodes  = totalPlayers - codedCount

  return (
    <div className="px-4 md:px-6 pt-3 pb-6 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="font-display font-bold uppercase text-cream text-[28px]" style={{ lineHeight: 0.85 }}>
          Academy
        </div>
        <span className="font-condensed font-bold uppercase tracking-[0.1em] text-[10px] text-muted border border-white/[0.15] rounded-pill px-2.5 py-1">
          Admin
        </span>
      </div>

      {/* tiles — finances (revenue, fees due, payment reminders) are handled
          outside this app, so nothing here reports money. */}
      <div className="grid grid-cols-2 gap-2.5">
        <Tile label="Enrolled" value={enrolled} valueClass="text-cream" />
        <Tile label="Active leads" value={activeLeads} valueClass="text-gold" />
      </div>

      {/* lead funnel */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="font-condensed font-bold uppercase tracking-[0.14em] text-[10.5px] text-muted">Lead funnel</div>
          <span className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-gold">
            {activeLeads} active
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {funnel.map(s => (
            <div key={s.key} className="flex items-center gap-2.5">
              <span className="flex-none w-12 font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted">
                {s.label}
              </span>
              <div className="flex-1 h-2.5 rounded-pill bg-white/[0.06] overflow-hidden">
                <div className="h-full rounded-pill" style={{ width: s.width, background: s.color }} />
              </div>
              <span className="flex-none w-5 text-right font-display text-sm text-cream">{s.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* new enrollments — inline generate-code list */}
      {pendingLeads.length > 0 && (
        <div className="rounded-2xl border border-gold/40 bg-gold/[0.06] p-3.5 flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 border border-gold/40 flex-none">
              <UserPlus size={16} className="text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-bold uppercase text-cream text-base leading-tight">
                {pendingLeads.length} new {pendingLeads.length === 1 ? 'enrollment' : 'enrollments'}
              </div>
              <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted mt-0.5">
                Generate access code to send via LINE
              </div>
            </div>
            {onOpenLeads && (
              <button
                type="button"
                onClick={onOpenLeads}
                className="font-condensed font-bold uppercase tracking-[0.1em] text-[10px] text-muted hover:text-cream"
              >
                Leads ›
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            {pendingLeads.map(lead => (
              <PendingLeadRow
                key={lead.id}
                lead={lead}
                onConverted={() => setJustConverted(s => new Set(s).add(lead.id))}
              />
            ))}
          </div>
        </div>
      )}

      {/* parent access codes */}
      <button
        type="button"
        onClick={() => setCodesOpen(true)}
        className="flex items-center gap-3 px-3.5 py-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] text-left transition-all duration-fast ease-out-soft active:scale-[0.99] hover:border-white/[0.12]"
      >
        <div className={`inline-flex h-9 w-9 items-center justify-center rounded-xl flex-none ${missingCodes > 0 ? 'bg-gold/15 border border-gold/40' : 'bg-white/[0.04] border border-white/[0.08]'}`}>
          <KeyRound size={16} className={missingCodes > 0 ? 'text-gold' : 'text-muted'} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-bold uppercase text-cream text-base leading-tight">
            Parent access codes
          </div>
          <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted mt-0.5">
            {codedCount} of {totalPlayers} linked
            {missingCodes > 0 ? ` · ${missingCodes} pending` : ''}
          </div>
        </div>
        <ChevronRight size={14} className="text-faint flex-none" />
      </button>

      {codesOpen && <ParentCodesSheet players={players} onClose={() => setCodesOpen(false)} />}
    </div>
  )
}

function Tile({ label, value, valueClass = 'text-cream' }) {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3.5">
      <div className="font-condensed font-bold uppercase tracking-[0.14em] text-[10px] text-muted">{label}</div>
      <div className={`font-display font-bold text-[36px] leading-[0.8] mt-1.5 ${valueClass}`}>{value}</div>
    </div>
  )
}

// Pending-enrollment row on AdminDash. Converts the lead → player + editCode
// in place, then shows the code with Copy / Link buttons so admin can send
// the share link to the parent via LINE without leaving Dash.
function PendingLeadRow({ lead, onConverted }) {
  const [busy, setBusy]       = useState(false)
  const [result, setResult]   = useState(null) // { playerId, editCode }
  const [copied, setCopied]   = useState(null) // 'code' | 'link' | null

  const meta = [lead.ageGroup, lead.position, lead.parentName && `Khun ${lead.parentName}`]
    .filter(Boolean)
    .join(' · ')

  const editCode = result?.editCode ?? lead.editCode
  const playerId = result?.playerId ?? lead.playerId
  const shareLink = (editCode && playerId)
    ? `${window.location.origin}${window.location.pathname}?id=${playerId}&edit=${editCode}`
    : null

  async function generate() {
    if (busy) return
    setBusy(true)
    try {
      const r = await convertLeadToPlayer(lead)
      setResult(r)
      onConverted?.()
    } catch (err) {
      console.error('convertLeadToPlayer failed', err)
      window.alert(`Couldn't generate access code: ${err?.message || err}`)
    } finally {
      setBusy(false)
    }
  }

  async function copy(value, kind) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      setTimeout(() => setCopied(null), 1600)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div className="rounded-xl bg-navy/40 border border-white/[0.06] px-3 py-2.5">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-body text-sm text-cream truncate">{lead.name || 'Untitled'}</div>
          {meta && (
            <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted truncate mt-0.5">
              {meta}
            </div>
          )}
        </div>
        {!editCode && (
          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-pill border border-gold/50 text-gold font-condensed font-bold uppercase tracking-[0.1em] text-[10px] hover:bg-gold/10 active:scale-[0.97] disabled:opacity-50"
          >
            <KeyRound size={11} strokeWidth={2.5} />
            {busy ? '…' : 'Generate'}
          </button>
        )}
      </div>

      {editCode && (
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="font-display font-bold tracking-[0.2em] text-gold text-sm">
            {editCode}
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => copy(editCode, 'code')}
              className="inline-flex items-center gap-1 px-2 h-6 rounded border border-gold/40 text-gold font-condensed font-bold uppercase tracking-[0.1em] text-[9.5px]"
            >
              {copied === 'code' ? <Check size={10} strokeWidth={2.5} /> : <Copy size={10} strokeWidth={2.5} />}
              {copied === 'code' ? 'Copied' : 'Code'}
            </button>
            {shareLink && (
              <button
                type="button"
                onClick={() => copy(shareLink, 'link')}
                className="inline-flex items-center gap-1 px-2 h-6 rounded border border-gold/40 text-gold font-condensed font-bold uppercase tracking-[0.1em] text-[9.5px]"
              >
                {copied === 'link' ? <Check size={10} strokeWidth={2.5} /> : <Link2 size={10} strokeWidth={2.5} />}
                {copied === 'link' ? 'Copied' : 'Link'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── ADMIN · PARENT CODES SHEET ────────────────────────────────────────────────

// Admin-only management surface for parent access (editCode). For each
// player: generate-if-missing, copy code, or copy the full share link
// (`?id=<playerId>&edit=<code>`) suitable for LINE.
// Codes are immutable once set (anti-hijack) — enforced by firestore.rules.
function ParentCodesSheet({ players, onClose }) {
  const [filter, setFilter] = useState('all') // 'all' | 'pending'
  const [copied, setCopied] = useState({})    // { [playerId]: 'code' | 'link' }
  const [busy,   setBusy]   = useState({})    // { [playerId]: true } during generate

  const sorted = useMemo(() => {
    const list = filter === 'pending'
      ? players.filter(p => !p.editCode)
      : [...players]
    return list.sort((a, b) => {
      // Pending (no code) at top so admin sees what still needs action
      if (!!a.editCode !== !!b.editCode) return a.editCode ? 1 : -1
      // Within the coded group, newest first so freshly converted leads surface
      const aT = a.createdAt?.toMillis?.() ?? 0
      const bT = b.createdAt?.toMillis?.() ?? 0
      if (aT !== bT) return bT - aT
      return a.name.localeCompare(b.name)
    })
  }, [players, filter])

  const codedCount   = players.filter(p => !!p.editCode).length
  const pendingCount = players.length - codedCount

  function shareLinkFor(player) {
    return `${window.location.origin}${window.location.pathname}?id=${player.id}&edit=${player.editCode}`
  }

  async function copy(playerId, value, kind) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(prev => ({ ...prev, [playerId]: kind }))
      setTimeout(() => setCopied(prev => {
        const next = { ...prev }
        delete next[playerId]
        return next
      }), 1600)
    } catch { /* clipboard unavailable */ }
  }

  async function generate(playerId) {
    if (busy[playerId]) return
    setBusy(prev => ({ ...prev, [playerId]: true }))
    try {
      const code = makeEditCode()
      // updatePlayer strips id+createdAt; we only need to set editCode here.
      // Pulling current doc shape from the players list to satisfy validation.
      const target = players.find(p => p.id === playerId)
      if (!target) return
      await updatePlayer(playerId, { ...target, editCode: code })
    } finally {
      setBusy(prev => {
        const next = { ...prev }
        delete next[playerId]
        return next
      })
    }
  }

  return (
    <Modal title="Parent access codes" onClose={onClose}>
      <div className="flex flex-col gap-3.5">
        <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5 flex items-center gap-3">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gold/15 border border-gold/30 flex-none">
            <KeyRound size={16} className="text-gold" />
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-cream text-lg leading-tight">
              {codedCount} of {players.length} linked
            </div>
            <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted mt-0.5">
              {pendingCount === 0
                ? 'All players have parent codes'
                : `${pendingCount} ${pendingCount === 1 ? 'player needs a code' : 'players need codes'}`}
            </div>
          </div>
        </div>

        <div className="flex gap-1 p-0.5 rounded-pill bg-white/[0.04] border border-white/[0.06] self-start">
          <FilterPill active={filter === 'all'}     onClick={() => setFilter('all')}     label={`All · ${players.length}`} />
          <FilterPill active={filter === 'pending'} onClick={() => setFilter('pending')} label={`Pending · ${pendingCount}`} />
        </div>

        {sorted.length === 0 ? (
          <div className="px-6 py-8 text-center font-condensed font-bold uppercase tracking-[0.14em] text-[10.5px] text-muted">
            No players match this filter
          </div>
        ) : (
          <div className="flex flex-col gap-1.5 max-h-[58vh] overflow-y-auto pr-1 -mr-1">
            {sorted.map(p => {
              const hasCode = !!p.editCode
              const cp = copied[p.id]
              return (
                <div key={p.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-sm text-cream truncate">{p.name}</div>
                    <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted">
                      {p.ageGroup} · {p.position}{p.active ? '' : ' · inactive'}
                    </div>
                    <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-faint mt-0.5">
                      {p.dob
                        ? `DOB ${new Date(p.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · age ${calcAge(p.dob)}`
                        : 'DOB not set'}
                    </div>
                    {hasCode && (
                      <div className="font-display font-bold tracking-[0.2em] text-gold text-sm mt-1 truncate">
                        {p.editCode}
                      </div>
                    )}
                  </div>
                  {hasCode ? (
                    <div className="flex flex-col gap-1.5 flex-none">
                      <ActionPill
                        Icon={cp === 'code' ? Check : Copy}
                        label={cp === 'code' ? 'Copied' : 'Code'}
                        onClick={() => copy(p.id, p.editCode, 'code')}
                      />
                      <ActionPill
                        Icon={cp === 'link' ? Check : Link2}
                        label={cp === 'link' ? 'Copied' : 'Link'}
                        onClick={() => copy(p.id, shareLinkFor(p), 'link')}
                      />
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generate(p.id)}
                      disabled={!!busy[p.id]}
                    >
                      {busy[p.id] ? '…' : 'Generate'}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="font-body text-[12px] text-muted leading-snug">
          Codes are one-time generated and can’t be changed (anti-hijack). Share the link via LINE — parents tap to open the portal, then use the code on the main app to link their child.
        </div>
      </div>
    </Modal>
  )
}

function FilterPill({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 h-8 rounded-pill font-condensed font-bold uppercase tracking-[0.1em] text-[10px] transition-all duration-fast ${active ? 'bg-gold text-navy' : 'text-muted'}`}
    >
      {label}
    </button>
  )
}

function ActionPill({ Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 px-2.5 h-7 rounded-md border border-gold/40 text-gold font-condensed font-bold uppercase tracking-[0.1em] text-[10px] transition-all duration-fast active:scale-[0.96]"
    >
      <Icon size={11} strokeWidth={2.5} />
      <span>{label}</span>
    </button>
  )
}
