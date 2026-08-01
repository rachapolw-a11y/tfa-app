import { useState, useEffect, useMemo } from 'react'
import { subscribeTo, addLead, updateLead, deleteLead, convertLeadToPlayer } from '../lib/storage'
import Modal from '../components/Modal'
import { Plus, ChevronRight, Trash2, KeyRound, Copy, Check, Link2 } from 'lucide-react'
import { Button } from '../components/ui'

// Pipeline stages — colors mirror README §11 status ramp.
const STAGES = [
  { id: 'new',   label: 'New',   color: '#7286a0' },
  { id: 'trial', label: 'Trial', color: '#3b9ae1' },
  { id: 'offer', label: 'Offer', color: '#9b7cf0' },
  { id: 'paid',  label: 'Paid',  color: '#2ec18d' },
]
const STAGE_INDEX = { new: 0, trial: 1, offer: 2, paid: 3 }
const AGE_GROUPS  = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']

const EMPTY_LEAD = { name: '', parentName: '', ageGroup: '', stage: 'new', notes: '' }

// ── Per-stage summary tile ───────────────────────────────────────────────────
function StageTile({ label, count, color, accent }) {
  return (
    <div className="bg-navy-mid/80 border border-white/[0.06] rounded-lg p-4 shadow-card transition-all duration-200 ease-out-soft hover:-translate-y-[2px] hover:shadow-md">
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full shrink-0"
          style={{ background: color, boxShadow: `0 0 10px ${color}99` }}
        />
        <div className="font-condensed uppercase text-[10.5px] tracking-[0.18em] text-muted">
          {label}
        </div>
      </div>
      <div
        className="font-display font-bold leading-[0.92] text-[34px] mt-2"
        style={{
          color: accent ?? 'var(--cream)',
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
      </div>
    </div>
  )
}

// ── Single lead row ──────────────────────────────────────────────────────────
function LeadCard({ lead, stage, isCoach, onAdvance, onEdit, onDelete, onGenerateCode }) {
  const meta = [lead.parentName && `Parent ${lead.parentName}`, lead.ageGroup]
    .filter(Boolean)
    .join(' · ')
  const isLast = stage.id === 'paid'
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(null) // 'code' | 'link' | null

  async function generate() {
    if (busy) return
    setBusy(true)
    try { await onGenerateCode(lead) }
    finally { setBusy(false) }
  }

  async function copy(value, kind) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(kind)
      setTimeout(() => setCopied(null), 1600)
    } catch { /* clipboard unavailable */ }
  }

  const shareLink = lead.editCode && lead.playerId
    ? `${window.location.origin}${window.location.pathname}?id=${lead.playerId}&edit=${lead.editCode}`
    : null

  return (
    <div className="bg-navy-mid/85 border border-white/[0.06] rounded-md p-3.5 shadow-card transition-all duration-200 ease-out-soft hover:-translate-y-[1px] hover:shadow-md hover:border-white/15">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div
            className="font-display uppercase text-cream truncate"
            style={{ fontSize: 17, lineHeight: 1.05, letterSpacing: '-0.005em' }}
          >
            {lead.name || 'Untitled'}
          </div>
          {meta && (
            <div className="font-condensed uppercase text-[10.5px] tracking-[0.12em] text-muted mt-1.5 truncate">
              {meta}
            </div>
          )}
        </div>
        {isCoach && (
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(lead)}
              className="p-1 rounded-md text-faint hover:text-cream hover:bg-white/5"
              aria-label="Edit"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(lead)}
              className="p-1 rounded-md text-faint hover:text-danger hover:bg-white/5"
              aria-label="Delete"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
      {lead.notes && (
        <div className="font-body italic text-[12.5px] text-cream/75 mt-2 line-clamp-2">
          {lead.notes}
        </div>
      )}

      {isCoach && lead.editCode && (
        <div className="mt-3 rounded-md border border-gold/30 bg-gold/[0.06] px-2.5 py-2">
          <div className="flex items-center gap-2">
            <KeyRound size={12} className="text-gold flex-none" />
            <span className="font-display font-bold tracking-[0.2em] text-gold text-sm truncate">
              {lead.editCode}
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => copy(lead.editCode, 'code')}
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
        </div>
      )}

      {isCoach && !lead.editCode && (
        <div className="mt-3">
          <button
            type="button"
            onClick={generate}
            disabled={busy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill border border-gold/50 text-gold font-condensed font-bold uppercase tracking-[0.12em] text-[10.5px] transition-all duration-200 ease-out-soft hover:bg-gold/10 active:scale-[0.97] disabled:opacity-50"
          >
            <KeyRound size={12} strokeWidth={2.5} />
            {busy ? 'Generating…' : 'Generate access code'}
          </button>
        </div>
      )}

      {isCoach && !isLast && (
        <div className="mt-2">
          <button
            type="button"
            onClick={() => onAdvance(lead)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-pill border font-condensed font-bold uppercase tracking-[0.12em] text-[10.5px] transition-all duration-200 ease-out-soft hover:bg-white/5 active:scale-[0.97]"
            style={{ color: stage.color, borderColor: `${stage.color}66` }}
          >
            Advance to {STAGES[STAGE_INDEX[stage.id] + 1].label}
            <ChevronRight size={12} strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Leads({ role = 'parent' }) {
  const isCoach = role === 'coach'
  const [leads,     setLeads]     = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing,   setEditing]   = useState(null)
  const [form,      setForm]      = useState(EMPTY_LEAD)
  const [saving,    setSaving]    = useState(false)

  useEffect(() => subscribeTo('leads', setLeads), [])

  function field(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function openAdd() {
    setEditing(null); setForm(EMPTY_LEAD); setShowModal(true)
  }
  function openEdit(lead) {
    setEditing(lead.id); setForm({ ...EMPTY_LEAD, ...lead }); setShowModal(true)
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await updateLead(editing, form)
      } else {
        await addLead(form)
      }
      setShowModal(false)
      setForm(EMPTY_LEAD)
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  async function advance(lead) {
    const idx = STAGE_INDEX[lead.stage] ?? 0
    if (idx >= STAGES.length - 1) return
    const nextStage = STAGES[idx + 1].id
    await updateLead(lead.id, { ...lead, stage: nextStage })
  }

  async function remove(lead) {
    if (!window.confirm(`Delete "${lead.name || 'this lead'}"?`)) return
    await deleteLead(lead.id)
  }

  async function generateCode(lead) {
    try {
      await convertLeadToPlayer(lead)
    } catch (err) {
      console.error('convertLeadToPlayer failed', err)
      window.alert(`Couldn't generate access code: ${err?.message || err}`)
      throw err
    }
  }

  const grouped = useMemo(
    () => Object.fromEntries(STAGES.map(s => [s.id, leads.filter(l => l.stage === s.id)])),
    [leads],
  )

  return (
    <div className="pb-6">
      {/* ── Title row ── */}
      <div className="flex items-end justify-between gap-3 flex-wrap px-4 md:px-6 pt-5">
        <div className="min-w-0">
          <h1
            className="font-display uppercase text-cream text-[42px] md:text-[52px]"
            style={{ lineHeight: 0.92, letterSpacing: '-0.01em' }}
          >
            Leads
          </h1>
          <div className="font-condensed uppercase tracking-[0.18em] text-muted text-xs mt-2">
            Pipeline · {leads.length} active
          </div>
        </div>
        {isCoach && (
          <Button onClick={openAdd} leftIcon={<Plus size={15} strokeWidth={2.5} />}>
            New lead
          </Button>
        )}
      </div>

      {/* ── Stage summary tiles ── 2 cols mobile / 4 cols ≥md */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 px-4 md:px-6 pt-4">
        {STAGES.map(s => (
          <StageTile
            key={s.id}
            label={s.label}
            count={grouped[s.id]?.length || 0}
            color={s.color}
            accent={s.id === 'paid' ? 'var(--gold)' : undefined}
          />
        ))}
      </div>

      {/* ── Empty state ── */}
      {leads.length === 0 && (
        <div className="mx-4 md:mx-6 mt-6 rounded-lg border border-dashed border-white/10 text-center py-12 px-4 text-muted">
          <div className="font-condensed uppercase tracking-[0.16em] text-xs">
            No leads in the pipeline yet
          </div>
          {isCoach && (
            <p className="text-xs mt-2 text-faint">
              Tap <strong className="text-cream/80">New lead</strong> to start tracking.
            </p>
          )}
        </div>
      )}

      {/* ── Kanban columns ── 1 col mobile / 2 cols md / 4 cols lg */}
      {leads.length > 0 && (
        <div className="px-4 md:px-6 pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map(stage => {
            const cards = grouped[stage.id] || []
            return (
              <div key={stage.id} className="space-y-2.5">
                {/* Column header */}
                <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: stage.color, boxShadow: `0 0 8px ${stage.color}99` }}
                  />
                  <span
                    className="font-condensed font-bold uppercase tracking-[0.18em] text-[11px]"
                    style={{ color: stage.color }}
                  >
                    {stage.label}
                  </span>
                  <span className="font-condensed uppercase text-[11px] tracking-[0.1em] text-faint ml-auto">
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                {cards.length > 0 ? (
                  cards.map(lead => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      stage={stage}
                      isCoach={isCoach}
                      onAdvance={advance}
                      onEdit={openEdit}
                      onDelete={remove}
                      onGenerateCode={generateCode}
                    />
                  ))
                ) : (
                  <div className="rounded-md border border-dashed border-white/10 py-6 text-center text-faint font-condensed uppercase text-[10.5px] tracking-[0.16em]">
                    Empty
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Lead modal ── */}
      {showModal && (
        <Modal title={editing ? 'Edit Lead' : 'New Lead'} onClose={() => setShowModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Player Name *</label>
                <input
                  className="input"
                  required
                  autoFocus
                  value={form.name}
                  onChange={e => field('name', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Parent Name</label>
                <input
                  className="input"
                  value={form.parentName}
                  onChange={e => field('parentName', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Age Group</label>
                <select
                  className="input"
                  value={form.ageGroup}
                  onChange={e => field('ageGroup', e.target.value)}
                >
                  <option value="">—</option>
                  {AGE_GROUPS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Stage</label>
                <select
                  className="input"
                  value={form.stage}
                  onChange={e => field('stage', e.target.value)}
                >
                  {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="label">Notes</label>
                <textarea
                  className="input"
                  rows={3}
                  value={form.notes}
                  onChange={e => field('notes', e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Save changes' : 'Add lead'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
