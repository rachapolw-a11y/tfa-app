import { useState, useEffect } from 'react'
import { subscribeTo, addEvaluation, updateEvaluation, deleteEvaluation } from '../lib/storage'
import Modal from '../components/Modal'
import { RadarChart } from '../components/ui'
import { Plus, Star, Trash2, Pencil } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const SKILLS = [
  { key: 'ballMastery', label: 'Ball Mastery' },
  { key: 'dribbling',   label: 'Dribbling'   },
  { key: 'passing',     label: 'Passing'     },
  { key: 'shooting',    label: 'Shooting'    },
  { key: 'pace',        label: 'Pace'        },
  { key: 'positioning', label: 'Positioning' },
  { key: 'attitude',    label: 'Attitude'    },
]

// Age group dot accent colours (player picker)
const AGE_COLOR = {
  U8:  '#c084fc',
  U10: '#38bdf8',
  U12: '#34d399',
  U14: '#fb923c',
  U16: '#f87171',
  U18: '#f1b813',
}

const LINE_COLORS = ['#f1b813', '#38bdf8', '#4ade80', '#f87171', '#c084fc', '#fb923c', '#e2e8f0']

// Rating band color (0–3 red, 4–6 orange, 7–8 cyan, 9–10 gold)
function ratingColor(v) {
  if (v <= 3) return 'var(--rating-low, #e2493f)'
  if (v <= 6) return 'var(--rating-mid, #f97316)'
  if (v <= 8) return 'var(--rating-high, #06b6d4)'
  return 'var(--rating-elite, #f1b813)'
}

function emptyEval() {
  return {
    date:   new Date().toISOString().split('T')[0],
    skills: Object.fromEntries(SKILLS.map(s => [s.key, 5])),
    notes:  '',
  }
}

export default function Evaluation({ role = 'parent' }) {
  const isCoach = role === 'coach'

  const [players,     setPlayers]     = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selectedId,  setSelectedId]  = useState(null)
  const [showModal,   setShowModal]   = useState(false)
  const [editingEval, setEditingEval] = useState(null)
  const [form,        setForm]        = useState(emptyEval)

  useEffect(() => {
    const unsubPlayers = subscribeTo('players',     setPlayers)
    const unsubEvals   = subscribeTo('evaluations', data => { setEvaluations(data); setLoading(false) })
    return () => { unsubPlayers(); unsubEvals() }
  }, [])

  function openAdd() {
    setEditingEval(null); setForm(emptyEval()); setShowModal(true)
  }
  function openEditEval(ev) {
    setEditingEval(ev.id)
    setForm({ date: ev.date, skills: { ...ev.skills }, notes: ev.notes || '' })
    setShowModal(true)
  }

  async function submit(e) {
    e.preventDefault()
    if (editingEval) {
      await updateEvaluation(editingEval, { ...form, playerId: selectedId })
    } else {
      await addEvaluation({ ...form, playerId: selectedId })
    }
    setShowModal(false)
  }

  async function removeEval(id) {
    if (window.confirm('Delete this evaluation?')) await deleteEvaluation(id)
  }

  function setSkill(key, val) {
    setForm(f => ({ ...f, skills: { ...f.skills, [key]: Number(val) } }))
  }

  if (loading) return (
    <div className="text-center py-20 text-cream/40">
      <p className="text-lg font-medium">Loading...</p>
    </div>
  )

  const selected     = players.find(p => p.id === selectedId)
  const playerEvals  = evaluations
    .filter(e => e.playerId === selectedId)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const latest = playerEvals.at(-1)
  const avg    = latest
    ? (Object.values(latest.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
    : null

  const lineData = playerEvals.map(ev => ({
    date: ev.date,
    ...Object.fromEntries(SKILLS.map(s => [s.label, ev.skills[s.key]])),
  }))

  const activePlayers = players.filter(p => p.active)

  return (
    <div>
      {/* Player picker */}
      <div className="mb-6">
        <p className="label">Select Player</p>
        {activePlayers.length === 0 ? (
          <p className="text-sm text-cream/40">Add active players in the Squad tab first.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {activePlayers.map(p => {
              const count    = evaluations.filter(e => e.playerId === p.id).length
              const accent   = AGE_COLOR[p.ageGroup] || '#f1b813'
              const hasData  = count > 0
              const isActive = selectedId === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`text-left rounded-xl border p-3 transition-all ${
                    isActive
                      ? 'border-gold bg-gold/10 shadow-sm'
                      : hasData
                        ? 'border-white/15 bg-navy-mid hover:border-gold/30'
                        : 'border-white/8 bg-navy-mid/60 hover:border-white/20 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: accent }} />
                    <span className="font-condensed font-semibold text-sm text-cream truncate tracking-wide">
                      {p.nickname || p.name}
                    </span>
                  </div>
                  <p className="text-xs text-cream/40 pl-3.5">
                    {p.ageGroup} · {count > 0 ? `${count} eval${count !== 1 ? 's' : ''}` : 'no evals'}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {selected && (
        <>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-cream">{selected.name}</h2>
              {avg && (
                <p className="flex items-center gap-1 text-sm text-cream/50">
                  <Star size={14} className="text-gold fill-gold" />
                  Overall avg: <span className="font-bold text-gold">{avg}</span>/10
                </p>
              )}
            </div>
            {isCoach && (
              <button
                onClick={openAdd}
                className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors"
              >
                <Plus size={16} /> Evaluate
              </button>
            )}
          </div>

          {playerEvals.length === 0 && (
            <div className="text-center py-16 text-cream/30 bg-navy-mid rounded-xl border border-dashed border-white/10">
              <p className="font-medium">No evaluations yet</p>
              {isCoach && <p className="text-sm mt-1">Click "Evaluate" to score {selected.nickname || selected.name}.</p>}
            </div>
          )}

          {playerEvals.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                {/* SVG Radar — design system component */}
                <div className="bg-navy-mid rounded-xl border border-white/10 p-4 flex flex-col items-center">
                  <p className="text-sm font-semibold text-cream mb-1 self-start">Latest Snapshot</p>
                  <p className="text-xs text-cream/40 mb-3 self-start">{latest.date}</p>
                  <RadarChart
                    skills={latest.skills}
                    size={220}
                    color="var(--gold, #f1b813)"
                    showLabels
                  />
                </div>

                {/* Line chart */}
                {playerEvals.length > 1 ? (
                  <div className="bg-navy-mid rounded-xl border border-white/10 p-4">
                    <p className="text-sm font-semibold text-cream mb-3">Progress Over Time</p>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(245,240,232,0.4)', fontFamily: 'Barlow Condensed' }} />
                        <YAxis domain={[0, 10]} ticks={[0,2,4,6,8,10]} tick={{ fontSize: 10, fill: 'rgba(245,240,232,0.4)' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#101c33', border: '1px solid rgba(241,184,19,0.2)', borderRadius: 8, fontSize: 12, color: '#f5f0e8' }}
                          itemStyle={{ color: '#f5f0e8' }}
                          cursor={{ stroke: 'rgba(241,184,19,0.2)', strokeWidth: 1 }}
                        />
                        <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Barlow Condensed', color: 'rgba(245,240,232,0.7)', paddingTop: 8 }} />
                        {SKILLS.map((s, i) => (
                          <Line
                            key={s.key}
                            type="monotone"
                            dataKey={s.label}
                            stroke={LINE_COLORS[i]}
                            strokeWidth={2.5}
                            dot={{ r: 4, fill: LINE_COLORS[i], strokeWidth: 0 }}
                            activeDot={{ r: 5, strokeWidth: 0 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="bg-navy-mid rounded-xl border border-dashed border-white/10 p-4 flex items-center justify-center text-cream/30 text-sm">
                    Add a second evaluation to see progress over time.
                  </div>
                )}
              </div>

              {/* History table */}
              <div className="bg-navy-mid rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <p className="font-condensed font-semibold text-base tracking-wide text-cream">Evaluation History</p>
                  <div className="flex items-center gap-3 text-xs text-cream/30 font-condensed">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--rating-elite)' }} /> 9–10
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--rating-high)' }} /> 7–8
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--rating-low)' }} /> 0–3
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-white/5">
                  {[...playerEvals].reverse().map(ev => {
                    const evAvg = (Object.values(ev.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
                    return (
                      <div key={ev.id} className="px-4 py-3">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-condensed text-sm text-cream/60 tracking-wide">{ev.date}</span>
                            <span className="font-display text-sm text-gold bg-gold/10 px-2 py-0.5 rounded-full tracking-wider">avg {evAvg}</span>
                          </div>
                          {isCoach && (
                            <div className="flex items-center gap-1">
                              <button onClick={() => openEditEval(ev)} className="p-1.5 text-cream/20 hover:text-gold rounded transition-colors"><Pencil size={13} /></button>
                              <button onClick={() => removeEval(ev.id)} className="p-1.5 text-cream/20 hover:text-red-400 rounded transition-colors"><Trash2 size={13} /></button>
                            </div>
                          )}
                        </div>
                        <div className="space-y-1.5">
                          {SKILLS.map(s => {
                            const val = ev.skills[s.key]
                            const c   = ratingColor(val)
                            return (
                              <div key={s.key} className="flex items-center gap-2">
                                <span className="font-condensed text-xs text-cream/40 w-20 shrink-0 truncate">{s.label}</span>
                                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${(val / 10) * 100}%`, backgroundColor: c }} />
                                </div>
                                <span className="font-display text-sm w-4 shrink-0 text-right" style={{ color: c }}>{val}</span>
                              </div>
                            )
                          })}
                        </div>
                        {ev.notes && <p className="text-xs text-cream/40 mt-2 italic">"{ev.notes}"</p>}
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {showModal && isCoach && (
        <Modal
          title={editingEval ? `Edit Evaluation — ${selected?.nickname || selected?.name}` : `Evaluate — ${selected?.nickname || selected?.name}`}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="label">Date</label>
              <input className="input" type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>

            <div className="space-y-3">
              <p className="label">Skills (1 = weak · 10 = elite)</p>
              {SKILLS.map(s => (
                <div key={s.key} className="flex items-center gap-3">
                  <label className="font-condensed text-xs text-cream/60 w-28 shrink-0 uppercase tracking-wide">{s.label}</label>
                  <input
                    type="range" min="1" max="10" step="1"
                    value={form.skills[s.key]}
                    onChange={e => setSkill(s.key, e.target.value)}
                    className="flex-1 accent-gold"
                  />
                  <span
                    className="w-6 text-right font-display text-sm font-bold shrink-0"
                    style={{ color: ratingColor(form.skills[s.key]) }}
                  >
                    {form.skills[s.key]}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <label className="label">Notes</label>
              <textarea className="input" rows={2} placeholder="Observations, standout moments, areas to focus on..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-cream/50 hover:text-cream">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-gold text-navy rounded-lg hover:bg-gold-light font-semibold">
                {editingEval ? 'Update Evaluation' : 'Save Evaluation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
