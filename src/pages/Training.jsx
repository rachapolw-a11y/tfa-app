import { useState, useEffect, useMemo } from 'react'
import { subscribeTo, addSession, updateSession, deleteSession } from '../lib/storage'
import Modal from '../components/Modal'
import {
  Badge,
  SummaryTile,
  PillTabs,
  HeroCard,
  Button,
} from '../components/ui'
import {
  Plus,
  Pencil,
  Trash2,
  PlusCircle,
  Pin,
  Clock,
  MapPin,
  Users as UsersIcon,
} from 'lucide-react'
import { initials } from '../lib/ratings'

const AGE_GROUPS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']

const DRILL_COLOR = {
  'Ball Mastery':          '#f1b813',
  'Finishing':             '#e25563',
  '1v1 Moves':             '#3b9ae1',
  'Team Tactics':          '#2ec18d',
  'Speed':                 '#f97316',
  'Running with the Ball': '#06b6d4',
  'Group Moves':           '#9b7cf0',
  'Passing':               '#3b9ae1',
  'Heading':               '#e0a92e',
}

const COERVER = [
  'Ball Mastery',
  'Running with the Ball',
  '1v1 Moves',
  'Finishing',
  'Speed',
  'Heading',
  'Group Moves',
  'Team Tactics',
]

const EMPTY_SESSION = {
  date: '',
  time: '',
  pitch: '',
  title: '',
  ageGroup: 'U10',
  drills: [],
  coachNotes: '',
  pinned: false,
}
const EMPTY_DRILL = { name: '', category: 'Ball Mastery', duration: 10, notes: '' }

function drillColor(cat) {
  return DRILL_COLOR[cat] ?? 'var(--text-muted)'
}

// ── Small subcomponent: drill chip ───────────────────────────────────────────
function DrillChip({ category, label, tone = 'default' }) {
  const color = drillColor(category)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill border ${
        tone === 'on-hero'
          ? 'bg-white/[0.04] border-white/[0.08]'
          : 'bg-navy-soft border-white/[0.06]'
      }`}
    >
      <span
        className="h-[7px] w-[7px] rounded-full shrink-0"
        style={{ background: color, boxShadow: `0 0 8px ${color}99` }}
      />
      <span className="font-condensed uppercase text-[10.5px] tracking-[0.14em] text-cream/90">
        {label ?? category}
      </span>
    </span>
  )
}

// Initials-only round avatar (used in the attendance stack)
function InitialsAvatar({ name, size = 36 }) {
  return (
    <div
      className="rounded-full bg-navy-soft text-cream font-condensed font-bold uppercase flex items-center justify-center"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(11, size * 0.32),
        letterSpacing: '0.04em',
        border: '2px solid var(--navy-mid)',
      }}
    >
      {initials(name) || '·'}
    </div>
  )
}

// ── Page ────────────────────────────────────────────────────────────────────
export default function Training({ role = 'parent' }) {
  const isCoach = role === 'coach'

  const [sessions,      setSessions]      = useState([])
  const [players,       setPlayers]       = useState([])
  const [loading,       setLoading]       = useState(true)
  const [filterGroup,   setFilterGroup]   = useState('all')
  const [showModal,     setShowModal]     = useState(false)
  const [editing,       setEditing]       = useState(null)
  const [form,          setForm]          = useState(EMPTY_SESSION)
  const [attendanceIds, setAttendanceIds] = useState([])
  const [newDrill,      setNewDrill]      = useState(EMPTY_DRILL)
  const [showDrillForm, setShowDrillForm] = useState(false)

  useEffect(() => {
    const unsubPlayers  = subscribeTo('players',  setPlayers)
    const unsubSessions = subscribeTo('sessions', data => { setSessions(data); setLoading(false) })
    return () => { unsubPlayers(); unsubSessions() }
  }, [])

  const drillSuggestions = useMemo(() => {
    const seen = new Set()
    const result = []
    ;[...sessions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach(s => {
        ;(s.drills || []).forEach(d => {
          if (d.name && !seen.has(d.name.toLowerCase())) {
            seen.add(d.name.toLowerCase())
            result.push({ name: d.name, category: d.category })
          }
        })
      })
    return result.slice(0, 12)
  }, [sessions])

  const sorted  = useMemo(
    () => [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [sessions],
  )
  const visible = useMemo(
    () => (filterGroup === 'all' ? sorted : sorted.filter(s => s.ageGroup === filterGroup)),
    [sorted, filterGroup],
  )

  // Summary stats
  const totalMinutes = useMemo(
    () =>
      sessions.reduce(
        (n, s) => n + (s.drills || []).reduce((a, d) => a + Number(d.duration || 0), 0),
        0,
      ),
    [sessions],
  )
  const totalDrills = useMemo(
    () => sessions.reduce((n, s) => n + (s.drills || []).length, 0),
    [sessions],
  )
  const avgAttendance = useMemo(() => {
    const withAtt = sessions.filter(s => s.attendanceIds?.length)
    if (!withAtt.length) return null
    const avg =
      withAtt.reduce((sum, s) => {
        const grp = players.filter(p => p.active && p.ageGroup === s.ageGroup).length
        return sum + (grp > 0 ? s.attendanceIds.length / grp : 0)
      }, 0) / withAtt.length
    return Math.round(avg * 100)
  }, [sessions, players])

  // Pinned wins; otherwise the most recent session.
  const heroSession = useMemo(
    () => sorted.find(s => s.pinned) ?? sorted[0],
    [sorted],
  )
  const heroIsPinned = !!heroSession?.pinned

  const heroDuration = useMemo(
    () =>
      heroSession
        ? (heroSession.drills || []).reduce((a, d) => a + Number(d.duration || 0), 0)
        : 0,
    [heroSession],
  )

  const heroSquadSize = useMemo(() => {
    if (!heroSession) return 0
    return players.filter(p => p.active && p.ageGroup === heroSession.ageGroup).length
  }, [heroSession, players])

  const heroAttendees = useMemo(() => {
    if (!heroSession?.attendanceIds?.length) return []
    return heroSession.attendanceIds
      .map(id => players.find(p => p.id === id))
      .filter(Boolean)
  }, [heroSession, players])

  function today() { return new Date().toISOString().split('T')[0] }
  function openAdd() {
    setEditing(null); setForm({ ...EMPTY_SESSION, date: today() })
    setAttendanceIds([]); setNewDrill(EMPTY_DRILL); setShowDrillForm(false); setShowModal(true)
  }
  function openEdit(s) {
    setEditing(s.id); setForm({ ...EMPTY_SESSION, ...s }); setAttendanceIds(s.attendanceIds || [])
    setNewDrill(EMPTY_DRILL); setShowDrillForm(false); setShowModal(true)
  }
  function addDrill() {
    if (!newDrill.name.trim()) return
    setForm(f => ({ ...f, drills: [...f.drills, { ...newDrill, id: crypto.randomUUID() }] }))
    setNewDrill(EMPTY_DRILL); setShowDrillForm(false)
  }
  function removeDrill(id) { setForm(f => ({ ...f, drills: f.drills.filter(d => d.id !== id) })) }
  function toggleAttend(id) { setAttendanceIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]) }
  async function submit(e) {
    e.preventDefault()
    // If pinning this session, clear pinned flag on any other session.
    if (form.pinned) {
      const others = sessions.filter(s => s.pinned && s.id !== editing)
      for (const s of others) {
        try { await updateSession(s.id, { ...s, pinned: false }) } catch {}
      }
    }
    editing
      ? await updateSession(editing, { ...form, attendanceIds })
      : await addSession({ ...form, attendanceIds })
    setShowModal(false)
  }
  async function remove(id) { if (window.confirm('Delete this session?')) await deleteSession(id) }
  function field(key, val) { setForm(f => ({ ...f, [key]: val })) }
  function drillField(key, val) { setNewDrill(d => ({ ...d, [key]: val })) }

  const squadPlayers = players.filter(
    p => p.active && (!form.ageGroup || p.ageGroup === form.ageGroup),
  )

  if (loading)
    return <div className="text-center py-12 text-muted">Loading sessions…</div>

  // Format the "pinned" eyebrow date label
  const heroEyebrow = (() => {
    if (!heroSession) return ''
    const d = new Date(heroSession.date + 'T00:00:00')
    const today0 = new Date(); today0.setHours(0, 0, 0, 0)
    const tomorrow0 = new Date(today0); tomorrow0.setDate(tomorrow0.getDate() + 1)
    const fmt = (x) =>
      x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    let day
    if (d.getTime() === today0.getTime()) day = 'Today'
    else if (d.getTime() === tomorrow0.getTime()) day = 'Tomorrow'
    else day = fmt(d)
    return heroSession.time ? `${day} · ${heroSession.time}` : day
  })()

  return (
    <div className="pb-6">
      {/* ── Title row ── */}
      <div className="flex items-end justify-between gap-3 flex-wrap px-4 md:px-6 pt-5">
        <div className="min-w-0">
          <h1
            className="font-display uppercase text-cream text-[42px] md:text-[52px]"
            style={{
              lineHeight: 0.92,
              letterSpacing: '-0.01em',
            }}
          >
            Training
          </h1>
          <div className="font-condensed uppercase tracking-[0.18em] text-muted text-xs mt-2">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} logged
          </div>
        </div>
        {isCoach && (
          <Button onClick={openAdd} leftIcon={<Plus size={15} strokeWidth={2.5} />}>
            New session
          </Button>
        )}
      </div>

      {/* ── Summary tiles ── 2 cols mobile / 4 cols ≥md */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 px-4 md:px-6 pt-4">
        <SummaryTile label="Sessions" value={sessions.length} />
        <SummaryTile label="Minutes"  value={totalMinutes} />
        <SummaryTile
          label="Attendance"
          value={avgAttendance !== null ? avgAttendance : 'N/A'}
          suffix={avgAttendance !== null ? '%' : null}
          accent="var(--gold)"
        />
        <SummaryTile label="Drills" value={totalDrills} />
      </div>

      {/* ── Hero session card ── */}
      {heroSession && (
        <div className="px-4 md:px-6 pt-4">
          <HeroCard>
            <div className="flex flex-col lg:flex-row gap-7 lg:items-center">
              {/* LEFT — pinned/latest detail */}
              <div className="flex-1 min-w-0">
                {/* Eyebrow */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-pill mb-4 ${
                    heroIsPinned
                      ? 'bg-gold/15 border border-gold/40'
                      : 'bg-white/[0.04] border border-white/[0.08]'
                  }`}
                >
                  <Pin
                    size={12}
                    className={heroIsPinned ? 'text-gold' : 'text-muted'}
                    fill={heroIsPinned ? 'currentColor' : 'none'}
                  />
                  <span
                    className={`font-condensed font-bold uppercase tracking-[0.18em] text-[10.5px] ${
                      heroIsPinned ? 'text-gold' : 'text-muted'
                    }`}
                  >
                    {heroIsPinned ? 'Pinned next' : 'Latest session'} · {heroEyebrow}
                  </span>
                </div>

                {/* Title */}
                <div
                  className="font-display uppercase text-cream"
                  style={{
                    fontSize: 'clamp(28px, 4.5vw, 40px)',
                    lineHeight: 0.92,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {heroSession.title || 'Untitled session'}
                </div>

                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <Badge kind="age" value={heroSession.ageGroup} size="sm" />
                  {heroDuration > 0 && (
                    <div className="flex items-center gap-1.5 font-condensed uppercase text-[11px] tracking-[0.14em] text-cream/85">
                      <Clock size={13} className="text-gold/80" /> {heroDuration} min
                    </div>
                  )}
                  {heroSession.drills?.length > 0 && (
                    <div className="flex items-center gap-1.5 font-condensed uppercase text-[11px] tracking-[0.14em] text-cream/85">
                      <UsersIcon size={13} className="text-gold/80" />
                      {heroSession.drills.length} drill{heroSession.drills.length !== 1 ? 's' : ''}
                    </div>
                  )}
                  {heroSession.pitch && (
                    <div className="flex items-center gap-1.5 font-condensed uppercase text-[11px] tracking-[0.14em] text-cream/85">
                      <MapPin size={13} className="text-gold/80" /> {heroSession.pitch}
                    </div>
                  )}
                </div>

                {/* Drill chips */}
                {heroSession.drills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-5">
                    {[...new Set(heroSession.drills.map(d => d.category))].map(cat => (
                      <DrillChip key={cat} category={cat} tone="on-hero" />
                    ))}
                  </div>
                )}
              </div>

              {/* RIGHT — attendance stack + CTA */}
              <div className="lg:w-[260px] flex flex-col items-start lg:items-end gap-3">
                <div className="flex items-center">
                  {heroAttendees.slice(0, 6).map((p, i) => (
                    <div
                      key={p.id}
                      style={{ marginLeft: i === 0 ? 0 : -10, zIndex: 10 - i }}
                    >
                      <InitialsAvatar name={p.name} />
                    </div>
                  ))}
                  {heroAttendees.length > 6 && (
                    <div
                      style={{ marginLeft: -10 }}
                      className="h-9 w-9 rounded-full bg-white/10 border-2 border-navy-mid flex items-center justify-center font-condensed font-bold text-[10px] tracking-[0.08em] text-cream"
                    >
                      +{heroAttendees.length - 6}
                    </div>
                  )}
                  {heroAttendees.length === 0 && heroSquadSize > 0 && (
                    <div className="font-condensed uppercase text-[11px] tracking-[0.14em] text-muted">
                      Not taken yet
                    </div>
                  )}
                </div>
                {heroSquadSize > 0 && (
                  <div className="font-condensed uppercase text-[11px] tracking-[0.16em] text-cream/85">
                    {heroAttendees.length} of {heroSquadSize} confirmed
                  </div>
                )}
                {isCoach && (
                  <Button size="md" onClick={() => openEdit(heroSession)}>
                    Take attendance →
                  </Button>
                )}
              </div>
            </div>
          </HeroCard>
        </div>
      )}

      {/* ── Empty state ── */}
      {sessions.length === 0 && (
        <div className="mx-4 md:mx-6 mt-4 rounded-lg border border-dashed border-white/10 text-center py-12 px-4 text-muted">
          <div className="font-condensed uppercase tracking-[0.16em] text-xs">
            No sessions logged yet
          </div>
          {isCoach && (
            <p className="text-xs mt-2 text-faint">
              Tap <strong className="text-cream/80">New session</strong> to get started.
            </p>
          )}
        </div>
      )}

      {/* ── Session list ── */}
      {sessions.length > 0 && (
        <div className="px-4 md:px-6 pt-6">
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-3">
            <div
              className="font-display text-[18px] uppercase text-cream"
              style={{ letterSpacing: '0.02em' }}
            >
              Recent sessions
            </div>
            <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted">
              Last 30 days
            </div>
          </div>

          <div className="mb-4">
            <PillTabs
              items={['all', ...AGE_GROUPS.filter(g => sessions.some(s => s.ageGroup === g))]}
              value={filterGroup}
              onChange={setFilterGroup}
              scroll
            />
          </div>

          <div className="space-y-2.5">
            {visible.map(s => {
              const totalMin = (s.drills || []).reduce((n, d) => n + Number(d.duration || 0), 0)
              const dateObj  = new Date(s.date + 'T00:00:00')
              const day = dateObj.getDate()
              const mon = dateObj.toLocaleString('en', { month: 'short' }).toUpperCase()
              const cats = [...new Set((s.drills || []).map(d => d.category))]
              const isPinnedRow = s.id === heroSession?.id && heroIsPinned

              return (
                <div
                  key={s.id}
                  className={`grid grid-cols-[auto_1fr_auto] gap-4 md:gap-5 items-center rounded-lg border p-4 md:p-5 shadow-card transition-all duration-200 ease-out-soft hover:-translate-y-[2px] hover:shadow-md ${
                    isPinnedRow
                      ? 'bg-gold/[0.04] border-gold/40'
                      : 'bg-navy-mid/85 border-white/[0.06]'
                  }`}
                >
                  {/* Date block */}
                  <div className="pr-4 md:pr-5 border-r border-white/[0.08] text-center">
                    <div
                      className="font-display text-cream"
                      style={{ fontSize: 32, lineHeight: 0.74, letterSpacing: '-0.01em' }}
                    >
                      {day}
                    </div>
                    <div className="font-condensed uppercase text-[10.5px] tracking-[0.2em] text-muted mt-1">
                      {mon}
                    </div>
                  </div>

                  {/* Title + drills */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className="font-display uppercase text-cream truncate"
                        style={{ fontSize: 18, lineHeight: 1, letterSpacing: '0.02em', maxWidth: '60vw' }}
                      >
                        {s.title || 'Untitled'}
                      </div>
                      <Badge kind="age" value={s.ageGroup} size="sm" />
                      {isPinnedRow && (
                        <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-pill bg-gold/15 border border-gold/40 font-condensed font-bold uppercase text-[9.5px] tracking-[0.18em] text-gold">
                          <Pin size={10} fill="currentColor" /> Pinned
                        </span>
                      )}
                    </div>
                    {(cats.length > 0 || s.pitch) && (
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {cats.slice(0, 4).map(cat => (
                          <DrillChip key={cat} category={cat} />
                        ))}
                        {s.pitch && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill border border-white/[0.06] bg-navy-soft font-condensed uppercase text-[10.5px] tracking-[0.14em] text-cream/90">
                            <MapPin size={11} className="text-gold/80" /> {s.pitch}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Stats + actions */}
                  <div className="text-right">
                    {totalMin > 0 && (
                      <div className="leading-none">
                        <span
                          className="font-display"
                          style={{ fontSize: 24, color: 'var(--gold)', letterSpacing: '-0.01em' }}
                        >
                          {totalMin}
                        </span>
                        <span className="font-condensed uppercase text-[10px] tracking-[0.12em] text-muted ml-1">
                          min
                        </span>
                      </div>
                    )}
                    {s.attendanceIds?.length > 0 && (
                      <div className="font-condensed uppercase text-[11px] tracking-[0.14em] text-muted mt-2">
                        {s.attendanceIds.length} present
                      </div>
                    )}
                    {isCoach && (
                      <div className="flex justify-end gap-1 mt-2">
                        <button
                          onClick={() => openEdit(s)}
                          className="p-1.5 rounded-md text-faint hover:text-cream hover:bg-white/5"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => remove(s.id)}
                          className="p-1.5 rounded-md text-faint hover:text-danger hover:bg-white/5"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Session modal ── */}
      {showModal && isCoach && (
        <Modal title={editing ? 'Edit Session' : 'New Session'} onClose={() => setShowModal(false)}>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Title</label>
                <input
                  className="input"
                  placeholder="e.g. Finishing & 1v1"
                  value={form.title}
                  onChange={e => field('title', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Date *</label>
                <input
                  className="input"
                  type="date"
                  required
                  value={form.date}
                  onChange={e => field('date', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Time</label>
                <input
                  className="input"
                  type="time"
                  value={form.time || ''}
                  onChange={e => field('time', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Age Group</label>
                <select
                  className="input"
                  value={form.ageGroup}
                  onChange={e => field('ageGroup', e.target.value)}
                >
                  {AGE_GROUPS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Pitch</label>
                <input
                  className="input"
                  placeholder="e.g. Pitch 2"
                  value={form.pitch || ''}
                  onChange={e => field('pitch', e.target.value)}
                />
              </div>

              {/* Pin toggle */}
              <label className="col-span-2 flex items-center gap-3 p-3 rounded-md border border-white/10 bg-white/[0.03] cursor-pointer hover:bg-white/[0.06] transition-colors">
                <input
                  type="checkbox"
                  checked={form.pinned || false}
                  onChange={e => field('pinned', e.target.checked)}
                  className="h-4 w-4 accent-[#f1b813]"
                />
                <div className="flex-1">
                  <div className="font-condensed font-bold uppercase text-[11px] tracking-[0.16em] text-cream flex items-center gap-1.5">
                    <Pin size={13} className="text-gold" fill="currentColor" />
                    Pin as "Up Next"
                  </div>
                  <div className="text-[11px] text-muted mt-0.5">
                    Show this session in the Training hero card. Replaces any existing pinned session.
                  </div>
                </div>
              </label>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="label mb-0">Drills</span>
                <button
                  type="button"
                  onClick={() => setShowDrillForm(v => !v)}
                  className="flex items-center gap-1 text-xs text-gold hover:text-gold-light font-semibold"
                >
                  <PlusCircle size={14} /> Add Drill
                </button>
              </div>
              {form.drills.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {form.drills.map(d => (
                    <div
                      key={d.id}
                      className="flex items-center gap-2 bg-navy rounded-lg px-3 py-2 text-sm"
                    >
                      <span className="flex-1 font-medium text-cream truncate">{d.name}</span>
                      <span className="text-xs text-cream/40 shrink-0">
                        {d.category} · {d.duration}min
                      </span>
                      <button
                        type="button"
                        onClick={() => removeDrill(d.id)}
                        className="text-cream/20 hover:text-danger shrink-0"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {showDrillForm && (
                <div className="border border-gold/20 bg-gold/5 rounded-lg p-3 space-y-2">
                  {drillSuggestions.length > 0 && (
                    <div>
                      <p className="text-xs text-cream/30 mb-1.5">Recent drills — tap to fill:</p>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {drillSuggestions.map(d => (
                          <button
                            key={d.name}
                            type="button"
                            onClick={() =>
                              setNewDrill(nd => ({ ...nd, name: d.name, category: d.category }))
                            }
                            className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-cream/60 hover:border-gold/40 hover:text-cream transition-colors"
                          >
                            {d.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <input
                    className="input"
                    placeholder="Drill name *"
                    value={newDrill.name}
                    onChange={e => drillField('name', e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      className="input"
                      value={newDrill.category}
                      onChange={e => drillField('category', e.target.value)}
                    >
                      {COERVER.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <div className="flex items-center gap-2">
                      <input
                        className="input"
                        type="number"
                        min="1"
                        max="120"
                        value={newDrill.duration}
                        onChange={e => drillField('duration', Number(e.target.value))}
                      />
                      <span className="text-sm text-cream/40 whitespace-nowrap">min</span>
                    </div>
                  </div>
                  <input
                    className="input"
                    placeholder="Notes (optional)"
                    value={newDrill.notes}
                    onChange={e => drillField('notes', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={addDrill}
                    className="w-full bg-gold text-navy text-sm py-1.5 rounded-lg hover:bg-gold-light font-semibold"
                  >
                    Add to Session
                  </button>
                </div>
              )}
            </div>

            {squadPlayers.length > 0 && (
              <div>
                <label className="label">
                  Attendance — {attendanceIds.length} of {squadPlayers.length}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto bg-navy rounded-lg p-3">
                  {squadPlayers.map(p => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 text-sm cursor-pointer select-none text-cream/70 hover:text-cream"
                    >
                      <input
                        type="checkbox"
                        checked={attendanceIds.includes(p.id)}
                        onChange={() => toggleAttend(p.id)}
                        className="w-4 h-4 accent-[#f1b813]"
                      />
                      <span className="truncate">{p.nickname || p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="label">Coach Notes</label>
              <textarea
                className="input"
                rows={2}
                value={form.coachNotes}
                onChange={e => field('coachNotes', e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <Button variant="ghost" type="button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Session</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
