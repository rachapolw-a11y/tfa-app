import { useState, useEffect } from 'react'
import { subscribeTo, updatePlayer, uploadPlayerPhoto } from '../lib/storage'
import { Avatar } from './Roster'
import Modal from '../components/Modal'
import { RadarChart, StatBar, ScoreBadge, Badge } from '../components/ui'
import { generateCard, shareCard } from '../lib/generateCard.fut'
import { ImageDown, ArrowLeft, Pencil, Camera } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import tfaLogo from '../assets/tfa-logo.png'

const SKILLS = [
  { key: 'ballMastery', label: 'Ball Mastery' },
  { key: 'dribbling',   label: 'Dribbling'   },
  { key: 'passing',     label: 'Passing'     },
  { key: 'shooting',    label: 'Shooting'    },
  { key: 'pace',        label: 'Pace'        },
  { key: 'positioning', label: 'Positioning' },
  { key: 'attitude',    label: 'Attitude'    },
]

const AGE_GROUPS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']
const POSITIONS  = ['GK', 'DEF', 'MID', 'FWD']

const POS_COLOR = {
  GK:  'bg-gold/20 text-gold',
  DEF: 'bg-blue-500/20 text-blue-300',
  MID: 'bg-white/10 text-cream/80',
  FWD: 'bg-red-500/20 text-red-300',
}

export default function PlayerPortal({ playerId }) {
  const [player,      setPlayer]      = useState(null)
  const [evaluations, setEvaluations] = useState([])
  const [sessions,    setSessions]    = useState([])
  const [allSessions, setAllSessions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [generating,  setGenerating]  = useState(false)

  // ── Soft-gated self-edit (see firestore.rules) ──────────────────────────────
  const editToken     = new URLSearchParams(window.location.search).get('edit')
  const isCoachSession = sessionStorage.getItem('tfa_role') === 'coach'
  const [unlocked,     setUnlocked]     = useState(false)
  const [showEdit,     setShowEdit]     = useState(false)
  const [editForm,     setEditForm]     = useState(null)
  const [photoFile,    setPhotoFile]    = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [saving,       setSaving]       = useState(false)

  // Can this visitor edit? Coach, an unlocked code, or a matching link token.
  const canEdit = isCoachSession || unlocked ||
    (!!player?.editCode && editToken === player.editCode)

  function openEdit() {
    setEditForm({
      name:        player.name        || '',
      nickname:    player.nickname    || '',
      dob:         player.dob         || '',
      ageGroup:    player.ageGroup    || 'U10',
      position:    player.position    || 'MID',
      parentName:  player.parentName  || '',
      parentPhone: player.parentPhone || '',
      notes:       player.notes       || '',
    })
    setPhotoFile(null); setPhotoPreview(player.photoURL || null); setShowEdit(true)
  }

  // Locked visitor with the bare code (lost their link): prompt, verify, unlock, open.
  function unlockThenEdit() {
    const code = window.prompt("Enter your child's edit code:")
    if (code === null) return
    if (player.editCode && code.trim().toUpperCase() === player.editCode) {
      setUnlocked(true)
      openEdit()
    } else {
      window.alert('That code does not match. Ask your coach if you need it re-sent.')
    }
  }

  function editField(key, val) { setEditForm(f => ({ ...f, [key]: val })) }

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = ev => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  async function saveEdit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      // Spread existing player first so active/feeStatus/editCode are preserved untouched.
      const merged = { ...player, ...editForm }
      await updatePlayer(playerId, merged)
      if (photoFile) {
        const url = await uploadPlayerPhoto(playerId, photoFile)
        await updatePlayer(playerId, { ...merged, photoURL: url })
      }
      setShowEdit(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleShareImage() {
    setGenerating(true)
    try {
      const canvas = await generateCard(player, evaluations, sessions)
      await shareCard(canvas, player.name)
    } finally {
      setGenerating(false)
    }
  }

  useEffect(() => {
    const loaded = { players: false, evals: false, sessions: false }
    function check() {
      if (loaded.players && loaded.evals && loaded.sessions) setLoading(false)
    }
    const unsubP = subscribeTo('players', data => {
      setPlayer(data.find(p => p.id === playerId) ?? null)
      loaded.players = true; check()
    })
    const unsubE = subscribeTo('evaluations', data => {
      setEvaluations(data.filter(e => e.playerId === playerId))
      loaded.evals = true; check()
    })
    const unsubS = subscribeTo('sessions', data => {
      setAllSessions(data)
      setSessions(data.filter(s => (s.attendanceIds ?? []).includes(playerId)))
      loaded.sessions = true; check()
    })
    return () => { unsubP(); unsubE(); unsubS() }
  }, [playerId])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-cream/40">Loading...</p>
    </div>
  )

  if (!player) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-cream/40">Player not found.</p>
    </div>
  )

  const sorted = [...evaluations].sort((a, b) => new Date(a.date) - new Date(b.date))
  const latest = sorted.at(-1)
  const avg    = latest
    ? (Object.values(latest.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
    : null

  const radarData = latest
    ? SKILLS.map(s => ({ skill: s.label, value: latest.skills[s.key] ?? 0 }))
    : []

  const lineData = sorted.map(ev => ({
    date: ev.date,
    Avg: parseFloat((Object.values(ev.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)),
  }))

  const groupSessions  = allSessions.filter(s => s.ageGroup === player.ageGroup)
  const attendanceRate = groupSessions.length > 0
    ? Math.round(sessions.length / groupSessions.length * 100)
    : null

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  return (
    <div className="min-h-screen">
      <header className="bg-navy-mid border-b border-white/10 px-4 py-4 flex items-center gap-3">
        <a
          href={window.location.origin + window.location.pathname}
          className="p-1.5 -ml-1 text-cream/30 hover:text-cream transition-colors shrink-0"
          title="Back to academy"
        >
          <ArrowLeft size={18} />
        </a>
        <img src={tfaLogo} alt="TFA" className="w-10 h-10 object-contain shrink-0" />
        <div className="flex-1">
          <p className="text-xs text-gold/60 uppercase tracking-widest font-semibold leading-none mb-1">Player Progress</p>
          <p className="text-cream font-bold leading-none">{player.name}</p>
        </div>
        {(canEdit || player.editCode) && (
          <button
            onClick={canEdit ? openEdit : unlockThenEdit}
            className="flex items-center gap-1.5 border border-gold/40 text-gold text-xs font-bold px-3 py-2 rounded-lg shrink-0 hover:bg-gold/10 transition-colors"
          >
            <Pencil size={13} />
            Edit
          </button>
        )}
        {latest && (
          <button
            onClick={handleShareImage}
            disabled={generating}
            className="flex items-center gap-2 bg-gold text-navy text-xs font-bold px-3 py-2 rounded-lg shrink-0 disabled:opacity-50 transition-opacity"
          >
            <ImageDown size={14} />
            {generating ? 'Generating…' : 'Share Image'}
          </button>
        )}
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Player badge */}
        <div className="bg-navy-mid rounded-xl border border-white/10 p-4 flex items-center gap-4">
          <Avatar name={player.name} photoURL={player.photoURL} size={64} />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-lg text-cream leading-tight">{player.name}</p>
            {player.nickname && <p className="text-sm text-cream/40">"{player.nickname}"</p>}
            <div className="flex gap-2 mt-2 flex-wrap">
              <Badge kind="age"      value={player.ageGroup} size="sm">{player.ageGroup}</Badge>
              <Badge kind="position" value={player.position} size="sm" />
            </div>
          </div>
          {avg && (
            <ScoreBadge
              value={Math.round(parseFloat(avg) * 9.9)}
              label="OVR"
              size="lg"
              tone="gold"
            />
          )}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="Sessions Attended" value={sessions.length} />
          <StatCard label="Evaluations" value={evaluations.length} highlight={evaluations.length > 0} />
          <StatCard
            label="Attendance Rate"
            value={attendanceRate !== null ? `${attendanceRate}%` : '—'}
            highlight={attendanceRate !== null && attendanceRate >= 70}
            warn={attendanceRate !== null && attendanceRate < 40}
          />
        </div>

        {evaluations.length === 0 && (
          <div className="text-center py-16 text-cream/30 bg-navy-mid rounded-xl border border-dashed border-white/10">
            <p className="font-medium">No evaluations yet</p>
            <p className="text-sm mt-1">Check back after the next training assessment.</p>
          </div>
        )}

        {/* Radar + StatBar — latest snapshot */}
        {latest && (
          <div className="bg-navy-mid rounded-xl border border-white/10 p-4">
            <p className="text-sm font-semibold text-cream mb-0.5">Latest Skill Snapshot</p>
            <p className="text-xs text-cream/40 mb-3">{latest.date}</p>
            {/* SVG RadarChart */}
            <div className="flex justify-center mb-4">
              <RadarChart
                skills={latest.skills}
                size={220}
                color="var(--gold, #f1b813)"
                showLabels
              />
            </div>
            {/* StatBar breakdown */}
            <div className="space-y-2 pt-3 border-t border-white/10">
              {SKILLS.map(s => (
                <StatBar
                  key={s.key}
                  label={s.label}
                  value={latest.skills[s.key] ?? 0}
                  max={10}
                />
              ))}
            </div>
            {latest.notes && (
              <p className="text-sm text-cream/60 italic mt-3 pt-3 border-t border-white/10">"{latest.notes}"</p>
            )}
          </div>
        )}

        {/* Progress line chart */}
        {sorted.length > 1 && (
          <div className="bg-navy-mid rounded-xl border border-white/10 p-4">
            <p className="text-sm font-semibold text-cream mb-3">Progress Over Time</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={lineData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'rgba(245,240,232,0.4)' }} />
                <YAxis domain={[1, 10]} ticks={[1,3,5,7,10]} tick={{ fontSize: 10, fill: 'rgba(245,240,232,0.4)' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d1f38', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#f5f0e8' }}
                  formatter={v => [`${v} / 10`, 'Avg Score']}
                />
                <Line type="monotone" dataKey="Avg" stroke="#f1b813" strokeWidth={2.5} dot={{ r: 4, fill: '#f1b813' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Full evaluation history */}
        {sorted.length > 0 && (
          <div className="bg-navy-mid rounded-xl border border-white/10 overflow-hidden">
            <p className="text-sm font-semibold text-cream px-4 py-3 border-b border-white/10">Evaluation History</p>
            <div className="divide-y divide-white/5">
              {[...sorted].reverse().map(ev => {
                const evAvg = (Object.values(ev.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
                return (
                  <div key={ev.id} className="px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-cream/60">{ev.date}</span>
                      <span className="text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">avg {evAvg}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {SKILLS.map(s => {
                        const v = ev.skills[s.key]
                        const c = v <= 3 ? 'var(--rating-low)' : v <= 6 ? 'var(--rating-mid)' : v <= 8 ? 'var(--rating-high)' : 'var(--rating-elite)'
                        return (
                          <div key={s.key} className="text-center">
                            <div className="text-sm font-bold" style={{ color: c }}>{v}</div>
                            <div className="text-xs text-cream/25 leading-tight">{s.label.split(' ')[0]}</div>
                          </div>
                        )
                      })}
                    </div>
                    {ev.notes && <p className="text-xs text-cream/40 italic mt-2">"{ev.notes}"</p>}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent sessions attended */}
        {recentSessions.length > 0 && (
          <div className="bg-navy-mid rounded-xl border border-white/10 overflow-hidden">
            <p className="text-sm font-semibold text-cream px-4 py-3 border-b border-white/10">Recent Sessions Attended</p>
            <div className="divide-y divide-white/5">
              {recentSessions.map(s => (
                <div key={s.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-cream/80">{s.title || 'Training Session'}</p>
                    <p className="text-xs text-cream/40 mt-0.5">{s.date} · {s.ageGroup}</p>
                  </div>
                  {s.drills?.length > 0 && (
                    <span className="text-xs text-cream/30">{s.drills.length} drill{s.drills.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-center text-xs text-cream/20 pt-2">The Football Academy · TFA</p>
      </main>

      {showEdit && editForm && (
        <Modal title={`Edit — ${player.nickname || player.name}`} onClose={() => setShowEdit(false)}>
          <form onSubmit={saveEdit} className="space-y-4">

            {/* Photo */}
            <div className="flex items-center gap-4">
              <label
                htmlFor="portal-photo-input"
                className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden bg-white/5 border-2 border-dashed border-white/20 hover:border-gold/50 transition-colors group cursor-pointer"
              >
                {photoPreview
                  ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  : (
                    <span className="flex flex-col items-center justify-center h-full gap-0.5 text-cream/30 group-hover:text-gold transition-colors">
                      <Camera size={18} />
                      <span className="text-[9px] font-medium">Photo</span>
                    </span>
                  )
                }
              </label>
              <input id="portal-photo-input" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
              <div className="text-xs text-cream/40">
                <p>Tap to update the photo</p>
                <p className="mt-0.5">JPG or PNG · max 5 MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name *</label>
                <input className="input" required value={editForm.name} onChange={e => editField('name', e.target.value)} />
              </div>
              <div>
                <label className="label">Nickname</label>
                <input className="input" value={editForm.nickname} onChange={e => editField('nickname', e.target.value)} />
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input className="input" type="date" value={editForm.dob} onChange={e => editField('dob', e.target.value)} />
              </div>
              <div>
                <label className="label">Age Group</label>
                <select className="input" value={editForm.ageGroup} onChange={e => editField('ageGroup', e.target.value)}>
                  {AGE_GROUPS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Position</label>
                <select className="input" value={editForm.position} onChange={e => editField('position', e.target.value)}>
                  {POSITIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Parent / Guardian Name</label>
                <input className="input" value={editForm.parentName} onChange={e => editField('parentName', e.target.value)} />
              </div>
              <div>
                <label className="label">Parent Phone</label>
                <input className="input" type="tel" value={editForm.parentPhone} onChange={e => editField('parentPhone', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="label">Notes</label>
                <textarea className="input" rows={2} value={editForm.notes} onChange={e => editField('notes', e.target.value)} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <button type="button" onClick={() => setShowEdit(false)} className="px-4 py-2 text-sm text-cream/50 hover:text-cream">Cancel</button>
              <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-gold text-navy rounded-lg hover:bg-gold-light font-semibold disabled:opacity-60">
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function StatCard({ label, value, highlight, warn }) {
  return (
    <div className="bg-navy-mid rounded-xl border border-white/10 p-3 text-center">
      <p className={`text-xl font-bold ${warn ? 'text-red-400' : highlight ? 'text-gold' : 'text-cream'}`}>{value}</p>
      <p className="text-xs text-cream/40 mt-0.5 leading-tight">{label}</p>
    </div>
  )
}
