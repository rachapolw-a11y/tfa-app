import { useState } from 'react'
import { storage } from '../lib/storage'
import Modal from '../components/Modal'
import { Plus, Star, Trash2 } from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'

const SKILLS = [
  { key: 'ballMastery', label: 'Ball Mastery' },
  { key: 'dribbling', label: 'Dribbling' },
  { key: 'passing', label: 'Passing' },
  { key: 'shooting', label: 'Shooting' },
  { key: 'pace', label: 'Pace' },
  { key: 'positioning', label: 'Positioning' },
  { key: 'attitude', label: 'Attitude' },
]

const LINE_COLORS = ['#f1b813', '#60a5fa', '#f87171', '#fb923c', '#c084fc', '#34d399', '#e879f9']

function emptyEval() {
  return {
    date: new Date().toISOString().split('T')[0],
    skills: Object.fromEntries(SKILLS.map(s => [s.key, 5])),
    notes: '',
  }
}

export default function Evaluation() {
  const [players] = useState(() => storage.getPlayers())
  const [evaluations, setEvaluations] = useState(() => storage.getEvaluations())
  const [selectedId, setSelectedId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyEval)

  function persist(data) {
    storage.saveEvaluations(data)
    setEvaluations(data)
  }

  function submit(e) {
    e.preventDefault()
    persist([...evaluations, { ...form, id: crypto.randomUUID(), playerId: selectedId }])
    setShowModal(false)
  }

  function removeEval(id) {
    if (window.confirm('Delete this evaluation?')) persist(evaluations.filter(e => e.id !== id))
  }

  function setSkill(key, val) {
    setForm(f => ({ ...f, skills: { ...f.skills, [key]: Number(val) } }))
  }

  const selected = players.find(p => p.id === selectedId)
  const playerEvals = evaluations
    .filter(e => e.playerId === selectedId)
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  const latest = playerEvals.at(-1)
  const avg = latest
    ? (Object.values(latest.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
    : null

  const radarData = latest ? SKILLS.map(s => ({ skill: s.label, value: latest.skills[s.key] })) : []
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
              const count = evaluations.filter(e => e.playerId === p.id).length
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`text-left rounded-xl border p-3 transition-colors ${
                    selectedId === p.id
                      ? 'border-gold bg-gold/10 shadow-sm'
                      : 'border-white/10 bg-navy-mid hover:border-gold/30'
                  }`}
                >
                  <p className="font-semibold text-sm text-cream truncate">{p.nickname || p.name}</p>
                  <p className="text-xs text-cream/40 mt-0.5">{p.ageGroup} · {count} eval{count !== 1 ? 's' : ''}</p>
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
            <button
              onClick={() => { setForm(emptyEval()); setShowModal(true) }}
              className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors"
            >
              <Plus size={16} /> Evaluate
            </button>
          </div>

          {playerEvals.length === 0 && (
            <div className="text-center py-16 text-cream/30 bg-navy-mid rounded-xl border border-dashed border-white/10">
              <p className="font-medium">No evaluations yet</p>
              <p className="text-sm mt-1">Click "Evaluate" to score {selected.nickname || selected.name}.</p>
            </div>
          )}

          {playerEvals.length > 0 && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
                {/* Radar — latest snapshot */}
                <div className="bg-navy-mid rounded-xl border border-white/10 p-4">
                  <p className="text-sm font-semibold text-cream mb-1">Latest Snapshot</p>
                  <p className="text-xs text-cream/40 mb-3">{latest.date}</p>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radarData} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="skill" tick={{ fontSize: 11, fill: 'rgba(245,240,232,0.5)' }} />
                      <Radar dataKey="value" stroke="#f1b813" fill="#f1b813" fillOpacity={0.2} dot={{ r: 3, fill: '#f1b813' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Line chart — progress over time */}
                {playerEvals.length > 1 ? (
                  <div className="bg-navy-mid rounded-xl border border-white/10 p-4">
                    <p className="text-sm font-semibold text-cream mb-3">Progress Over Time</p>
                    <ResponsiveContainer width="100%" height={240}>
                      <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(245,240,232,0.4)' }} />
                        <YAxis domain={[1, 10]} ticks={[1,2,3,4,5,6,7,8,9,10]} tick={{ fontSize: 10, fill: 'rgba(245,240,232,0.4)' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#0d1f38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#f5f0e8' }} />
                        <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(245,240,232,0.6)' }} />
                        {SKILLS.map((s, i) => (
                          <Line
                            key={s.key}
                            type="monotone"
                            dataKey={s.label}
                            stroke={LINE_COLORS[i]}
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
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
                <p className="text-sm font-semibold text-cream px-4 py-3 border-b border-white/10">Evaluation History</p>
                <div className="divide-y divide-white/5">
                  {[...playerEvals].reverse().map(ev => {
                    const evAvg = (Object.values(ev.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
                    return (
                      <div key={ev.id} className="px-4 py-3">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-cream/70">{ev.date}</span>
                            <span className="text-xs text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-full">avg {evAvg}</span>
                          </div>
                          <button onClick={() => removeEval(ev.id)} className="text-cream/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                          {SKILLS.map(s => (
                            <div key={s.key} className="text-center">
                              <div className={`text-base font-bold ${ev.skills[s.key] >= 8 ? 'text-gold' : ev.skills[s.key] <= 4 ? 'text-red-400' : 'text-cream/70'}`}>
                                {ev.skills[s.key]}
                              </div>
                              <div className="text-xs text-cream/30 leading-tight mt-0.5">{s.label.split(' ')[0]}</div>
                            </div>
                          ))}
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

      {showModal && (
        <Modal title={`Evaluate — ${selected?.nickname || selected?.name}`} onClose={() => setShowModal(false)}>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="label">Date</label>
              <input className="input" type="date" required value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>

            <div className="space-y-3">
              <p className="label">Skills (1 = weak · 10 = elite)</p>
              {SKILLS.map(s => (
                <div key={s.key} className="flex items-center gap-3">
                  <label className="text-sm text-cream/70 w-28 shrink-0">{s.label}</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={form.skills[s.key]}
                    onChange={e => setSkill(s.key, e.target.value)}
                    className="flex-1 accent-gold"
                  />
                  <span className={`w-6 text-right text-sm font-bold shrink-0 ${form.skills[s.key] >= 8 ? 'text-gold' : form.skills[s.key] <= 4 ? 'text-red-400' : 'text-cream/70'}`}>
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
              <button type="submit" className="px-4 py-2 text-sm bg-gold text-navy rounded-lg hover:bg-gold-light font-semibold">Save Evaluation</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
