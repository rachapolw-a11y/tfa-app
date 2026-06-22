import { useState, useEffect, useMemo } from 'react'
import { subscribeTo, addSession, updateSession, deleteSession } from '../lib/storage'
import Modal from '../components/Modal'
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, PlusCircle, Dumbbell } from 'lucide-react'

const AGE_GROUPS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']

const AGE_COLOR = {
  U8:  '#c084fc',
  U10: '#38bdf8',
  U12: '#34d399',
  U14: '#fb923c',
  U16: '#f87171',
  U18: '#f1b813',
}
const COERVER    = ['Ball Mastery', 'Running with the Ball', '1v1 Moves', 'Finishing', 'Speed', 'Heading', 'Group Moves', 'Team Tactics']

const EMPTY_SESSION = { date: '', title: '', ageGroup: 'U10', drills: [], coachNotes: '' }
const EMPTY_DRILL   = { name: '', category: 'Ball Mastery', duration: 10, notes: '' }

export default function Training({ role = 'parent' }) {
  const isCoach = role === 'coach'

  const [sessions,       setSessions]       = useState([])
  const [players,        setPlayers]        = useState([])
  const [loading,        setLoading]        = useState(true)
  const [filterGroup,    setFilterGroup]    = useState('all')
  const [showModal,      setShowModal]      = useState(false)
  const [editing,        setEditing]        = useState(null)
  const [form,           setForm]           = useState(EMPTY_SESSION)
  const [attendanceIds,  setAttendanceIds]  = useState([])
  const [newDrill,       setNewDrill]       = useState(EMPTY_DRILL)
  const [showDrillForm,  setShowDrillForm]  = useState(false)
  const [expanded,       setExpanded]       = useState(null)

  useEffect(() => {
    const unsubPlayers  = subscribeTo('players',  setPlayers)
    const unsubSessions = subscribeTo('sessions', data => { setSessions(data); setLoading(false) })
    return () => { unsubPlayers(); unsubSessions() }
  }, [])

  // Drill library: unique drills from all sessions, most-recently-used first
  const drillSuggestions = useMemo(() => {
    const seen   = new Set()
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

  function today() { return new Date().toISOString().split('T')[0] }

  function openAdd() {
    setEditing(null); setForm({ ...EMPTY_SESSION, date: today() })
    setAttendanceIds([]); setNewDrill(EMPTY_DRILL); setShowDrillForm(false); setShowModal(true)
  }
  function openEdit(s) {
    setEditing(s.id); setForm({ ...s }); setAttendanceIds(s.attendanceIds || [])
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
    const session = { ...form, attendanceIds }
    editing ? await updateSession(editing, session) : await addSession(session)
    setShowModal(false)
  }
  async function remove(id) {
    if (window.confirm('Delete this session?')) await deleteSession(id)
  }
  function field(key, val) { setForm(f => ({ ...f, [key]: val })) }
  function drillField(key, val) { setNewDrill(d => ({ ...d, [key]: val })) }

  if (loading) return (
    <div className="text-center py-20 text-cream/40">
      <p className="text-lg font-medium">Loading sessions...</p>
    </div>
  )

  const sorted  = [...sessions].sort((a, b) => new Date(b.date) - new Date(a.date))
  const visible = filterGroup === 'all' ? sorted : sorted.filter(s => s.ageGroup === filterGroup)
  const squadPlayers = players.filter(p => p.active && (!form.ageGroup || p.ageGroup === form.ageGroup))

  const groupCounts = Object.fromEntries(
    AGE_GROUPS.map(g => [g, sessions.filter(s => s.ageGroup === g).length])
  )

  return (
    <div>
      {/* Header + filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-cream">Training Sessions</h2>
        {/* New Session — coaches only */}
        {isCoach && (
          <button onClick={openAdd} className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors">
            <Plus size={16} /> New Session
          </button>
        )}
      </div>

      {sessions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <FilterChip label={`All (${sessions.length})`} active={filterGroup === 'all'} onClick={() => setFilterGroup('all')} />
          {AGE_GROUPS.map(g => groupCounts[g] > 0 ? (
            <FilterChip key={g} label={`${g} (${groupCounts[g]})`} active={filterGroup === g} onClick={() => setFilterGroup(g)} />
          ) : null)}
        </div>
      )}

      {visible.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-cream/30 border border-dashed border-white/10 rounded-2xl">
          <Dumbbell size={36} className="mb-3 text-cream/15" />
          <p className="font-condensed font-semibold text-lg tracking-wide">
            {sessions.length === 0 ? 'No sessions logged yet' : `No ${filterGroup} sessions`}
          </p>
          {sessions.length === 0 && isCoach && (
            <p className="text-sm mt-1 text-cream/20">Tap <span className="text-gold/50">+ New Session</span> to log your first training.</p>
          )}
        </div>
      )}

      <div className="space-y-3">
        {visible.map(s => {
          const open     = expanded === s.id
          const totalMin = (s.drills || []).reduce((n, d) => n + Number(d.duration), 0)
          const accent   = AGE_COLOR[s.ageGroup] || '#f1b813'
          return (
            <div key={s.id} className="bg-navy-mid rounded-xl border border-white/10 overflow-hidden hover:border-gold/20 transition-colors flex">
              {/* Age group accent stripe */}
              <div className="w-1 shrink-0 rounded-l-xl" style={{ backgroundColor: accent }} />
              <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 p-4 cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setExpanded(open ? null : s.id)}>
                <div className="flex-1 min-w-0">
                  <p className="font-condensed font-semibold text-base tracking-wide text-cream truncate">{s.title || 'Untitled Session'}</p>
                  <p className="text-sm text-cream/40 mt-0.5">
                    {s.date}
                    {s.ageGroup && ` · ${s.ageGroup}`}
                    {s.drills?.length > 0 && ` · ${s.drills.length} drill${s.drills.length !== 1 ? 's' : ''}`}
                    {totalMin > 0 && ` · ${totalMin} min`}
                    {s.attendanceIds?.length > 0 && ` · ${s.attendanceIds.length} present`}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {/* Edit / Delete — coaches only */}
                  {isCoach && (
                    <>
                      <button onClick={e => { e.stopPropagation(); openEdit(s) }} className="p-1.5 text-cream/20 hover:text-gold rounded transition-colors"><Pencil size={14} /></button>
                      <button onClick={e => { e.stopPropagation(); remove(s.id) }} className="p-1.5 text-cream/20 hover:text-red-400 rounded transition-colors"><Trash2 size={14} /></button>
                    </>
                  )}
                  {open ? <ChevronUp size={16} className="text-cream/20 ml-1" /> : <ChevronDown size={16} className="text-cream/20 ml-1" />}
                </div>
              </div>

              {open && (
                <div className="border-t border-white/10 p-4 bg-navy/50 space-y-4">
                  {s.drills?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-cream/30 uppercase tracking-wide mb-2">Drills</p>
                      <div className="space-y-2">
                        {s.drills.map(d => (
                          <div key={d.id} className="flex items-start gap-3 text-sm">
                            <span className="shrink-0 text-xs bg-gold/10 text-gold font-medium px-2 py-0.5 rounded-full mt-0.5">{d.category}</span>
                            <div>
                              <span className="font-medium text-cream">{d.name}</span>
                              <span className="text-cream/40"> — {d.duration} min</span>
                              {d.notes && <p className="text-xs text-cream/30 mt-0.5">{d.notes}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {s.attendanceIds?.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-cream/30 uppercase tracking-wide mb-2">Present ({s.attendanceIds.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {s.attendanceIds.map(id => {
                          const p = players.find(pl => pl.id === id)
                          return p ? (
                            <span key={id} className="text-xs bg-white/10 border border-white/10 px-2 py-0.5 rounded-full text-cream/70">{p.nickname || p.name}</span>
                          ) : null
                        })}
                      </div>
                    </div>
                  )}
                  {s.coachNotes && (
                    <div>
                      <p className="text-xs font-bold text-cream/30 uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm text-cream/70">{s.coachNotes}</p>
                    </div>
                  )}
                </div>
              )}
              </div>
            </div>
          )
        })}
      </div>

      {showModal && isCoach && (
        <Modal title={editing ? 'Edit Session' : 'New Session'} onClose={() => setShowModal(false)}>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Title</label>
                <input className="input" placeholder="e.g. Ball Mastery Focus" value={form.title} onChange={e => field('title', e.target.value)} />
              </div>
              <div>
                <label className="label">Date *</label>
                <input className="input" type="date" required value={form.date} onChange={e => field('date', e.target.value)} />
              </div>
              <div>
                <label className="label">Age Group</label>
                <select className="input" value={form.ageGroup} onChange={e => field('ageGroup', e.target.value)}>
                  {AGE_GROUPS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>

            {/* Drills */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="label mb-0">Drills</span>
                <button type="button" onClick={() => setShowDrillForm(v => !v)} className="flex items-center gap-1 text-xs text-gold hover:text-gold-light font-semibold">
                  <PlusCircle size={14} /> Add Drill
                </button>
              </div>

              {form.drills.length > 0 && (
                <div className="space-y-1.5 mb-2">
                  {form.drills.map(d => (
                    <div key={d.id} className="flex items-center gap-2 bg-navy rounded-lg px-3 py-2 text-sm">
                      <span className="flex-1 font-medium text-cream truncate">{d.name}</span>
                      <span className="text-xs text-cream/40 shrink-0">{d.category} · {d.duration}min</span>
                      <button type="button" onClick={() => removeDrill(d.id)} className="text-cream/20 hover:text-red-400 shrink-0"><Trash2 size={12} /></button>
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
                            onClick={() => setNewDrill(nd => ({ ...nd, name: d.name, category: d.category }))}
                            className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-cream/60 hover:border-gold/40 hover:text-cream transition-colors"
                          >
                            {d.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <input className="input" placeholder="Drill name *" value={newDrill.name} onChange={e => drillField('name', e.target.value)} />
                  <div className="grid grid-cols-2 gap-2">
                    <select className="input" value={newDrill.category} onChange={e => drillField('category', e.target.value)}>
                      {COERVER.map(c => <option key={c}>{c}</option>)}
                    </select>
                    <div className="flex items-center gap-2">
                      <input className="input" type="number" min="1" max="120" value={newDrill.duration} onChange={e => drillField('duration', Number(e.target.value))} />
                      <span className="text-sm text-cream/40 whitespace-nowrap">min</span>
                    </div>
                  </div>
                  <input className="input" placeholder="Notes (optional)" value={newDrill.notes} onChange={e => drillField('notes', e.target.value)} />
                  <button type="button" onClick={addDrill} className="w-full bg-gold text-navy text-sm py-1.5 rounded-lg hover:bg-gold-light font-semibold">Add to Session</button>
                </div>
              )}
            </div>

            {/* Attendance */}
            {squadPlayers.length > 0 && (
              <div>
                <label className="label">Attendance</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto bg-navy rounded-lg p-3">
                  {squadPlayers.map(p => (
                    <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer select-none text-cream/70">
                      <input type="checkbox" checked={attendanceIds.includes(p.id)} onChange={() => toggleAttend(p.id)} className="w-4 h-4 accent-gold" />
                      <span className="truncate">{p.nickname || p.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="label">Coach Notes</label>
              <textarea className="input" rows={2} value={form.coachNotes} onChange={e => field('coachNotes', e.target.value)} />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-cream/50 hover:text-cream">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-gold text-navy rounded-lg hover:bg-gold-light font-semibold">Save Session</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
        active ? 'bg-gold text-navy border-gold font-semibold' : 'border-white/20 text-cream/60 hover:border-gold/50 hover:text-cream'
      }`}
    >
      {label}
    </button>
  )
}
