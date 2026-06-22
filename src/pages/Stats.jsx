import { useState, useEffect } from 'react'
import { subscribeTo } from '../lib/storage'
import { RadarChart, ScoreBadge, Badge } from '../components/ui'

const AGE_GROUPS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']

const SKILLS = [
  { key: 'ballMastery', label: 'Ball Mastery' },
  { key: 'dribbling',   label: 'Dribbling'   },
  { key: 'passing',     label: 'Passing'     },
  { key: 'shooting',    label: 'Shooting'    },
  { key: 'pace',        label: 'Pace'        },
  { key: 'positioning', label: 'Positioning' },
  { key: 'attitude',    label: 'Attitude'    },
]

// Build skills map from radar data array for the SVG RadarChart
function toSkillsMap(radarArr) {
  const keyMap = {
    'Ball Mastery': 'ballMastery', 'Dribbling': 'dribbling', 'Passing': 'passing',
    'Shooting': 'shooting', 'Pace': 'pace', 'Positioning': 'positioning', 'Attitude': 'attitude',
  }
  return Object.fromEntries(radarArr.map(d => [keyMap[d.skill] ?? d.skill, d.value]))
}

// avg 0–10 → OVR 0–99
function toOvr(avg) { return Math.round(avg * 9.9) }

function ratingColor(v) {
  if (v <= 3) return 'var(--rating-low, #e2493f)'
  if (v <= 6) return 'var(--rating-mid, #f97316)'
  if (v <= 8) return 'var(--rating-high, #06b6d4)'
  return 'var(--rating-elite, #f1b813)'
}

export default function Stats() {
  const [players,     setPlayers]     = useState([])
  const [sessions,    setSessions]    = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    const loaded = { p: false, s: false, e: false }
    function check() { if (loaded.p && loaded.s && loaded.e) setLoading(false) }
    const unsubP = subscribeTo('players',     d => { setPlayers(d);     loaded.p = true; check() })
    const unsubS = subscribeTo('sessions',    d => { setSessions(d);    loaded.s = true; check() })
    const unsubE = subscribeTo('evaluations', d => { setEvaluations(d); loaded.e = true; check() })
    return () => { unsubP(); unsubS(); unsubE() }
  }, [])

  if (loading) return (
    <div className="text-center py-20 text-cream/40">
      <p className="text-lg font-medium">Loading stats...</p>
    </div>
  )

  const activePlayers = players.filter(p => p.active)

  function latestEval(playerId) {
    return [...evaluations]
      .filter(e => e.playerId === playerId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  }
  function evalAvg(ev) {
    return Object.values(ev.skills).reduce((a, b) => a + b, 0) / SKILLS.length
  }

  // KPIs
  const now = new Date()
  const thisMonthSessions = sessions.filter(s => {
    const d = new Date(s.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
  const evaluatedCount = activePlayers.filter(p => latestEval(p.id)).length

  // Top performers
  const topPlayers = activePlayers
    .map(p => { const ev = latestEval(p.id); return ev ? { ...p, avg: evalAvg(ev) } : null })
    .filter(Boolean)
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 5)

  // Team radar
  const evaldEvals = activePlayers.map(p => latestEval(p.id)).filter(Boolean)
  const teamRadarArr = SKILLS.map(s => ({
    skill: s.label,
    value: evaldEvals.length > 0
      ? parseFloat((evaldEvals.reduce((sum, ev) => sum + (ev.skills[s.key] || 0), 0) / evaldEvals.length).toFixed(1))
      : 0,
  }))
  const teamSkillsMap = toSkillsMap(teamRadarArr)

  // Age group breakdown
  const groupStats = AGE_GROUPS.map(group => {
    const gPlayers  = activePlayers.filter(p => p.ageGroup === group)
    if (gPlayers.length === 0) return null
    const gSessions = sessions.filter(s => s.ageGroup === group)
    const gEvals    = gPlayers.map(p => latestEval(p.id)).filter(Boolean)

    const avgScore = gEvals.length > 0
      ? (gEvals.reduce((sum, ev) => sum + evalAvg(ev), 0) / gEvals.length).toFixed(1)
      : null

    const avgAttendance = gSessions.length > 0 && gPlayers.length > 0
      ? Math.round(
          gSessions.reduce((sum, s) => {
            const present = (s.attendanceIds || []).filter(id => gPlayers.some(p => p.id === id)).length
            return sum + present / gPlayers.length
          }, 0) / gSessions.length * 100
        )
      : null

    const feePaid   = gPlayers.filter(p => p.feeStatus === 'paid').length
    const feeUnpaid = gPlayers.filter(p => p.feeStatus !== 'paid').length

    return { group, players: gPlayers.length, sessions: gSessions.length, evaled: gEvals.length, avgScore, avgAttendance, feePaid, feeUnpaid }
  }).filter(Boolean)

  const hasAnyData = activePlayers.length > 0

  return (
    <div className="space-y-6">

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard label="Active Players"        value={activePlayers.length} />
        <KpiCard label="Total Sessions"        value={sessions.length}      />
        <KpiCard label="Sessions This Month"   value={thisMonthSessions}    />
        <KpiCard label="Players Evaluated"     value={`${evaluatedCount} / ${activePlayers.length}`} highlight={evaluatedCount > 0} />
      </div>

      {!hasAnyData && (
        <div className="text-center py-20 text-cream/40">
          <p className="text-lg font-medium">No data yet</p>
          <p className="text-sm mt-1">Add players and log sessions to see stats here.</p>
        </div>
      )}

      {/* Age group breakdown */}
      {groupStats.length > 0 && (
        <div className="bg-navy-mid rounded-xl border border-white/10 overflow-hidden">
          <p className="text-sm font-semibold text-cream px-4 py-3 border-b border-white/10">Age Group Breakdown</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Group', 'Players', 'Sessions', 'Avg Score', 'Attendance', 'Fees'].map(h => (
                    <th key={h} className={`px-4 py-2 text-xs font-bold text-cream/30 uppercase tracking-wide ${h === 'Group' ? 'text-left' : 'text-center'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {groupStats.map(g => {
                  const avgNum = g.avgScore ? parseFloat(g.avgScore) : null
                  return (
                    <tr key={g.group} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-3">
                        <Badge kind="age" size="sm">{g.group}</Badge>
                      </td>
                      <td className="text-center px-4 py-3 text-cream/70">{g.players}</td>
                      <td className="text-center px-4 py-3 text-cream/70">{g.sessions}</td>
                      <td className="text-center px-4 py-3">
                        {avgNum !== null
                          ? <span className="font-bold" style={{ color: ratingColor(avgNum) }}>{g.avgScore}</span>
                          : <span className="text-cream/20">—</span>}
                      </td>
                      <td className="text-center px-4 py-3">
                        {g.avgAttendance !== null
                          ? <span className={`font-medium ${g.avgAttendance >= 70 ? 'text-green-400' : g.avgAttendance >= 40 ? 'text-orange-300' : 'text-red-400'}`}>{g.avgAttendance}%</span>
                          : <span className="text-cream/20">—</span>}
                      </td>
                      <td className="text-center px-4 py-3">
                        <span className="text-green-400 font-medium">{g.feePaid}</span>
                        <span className="text-cream/20"> / </span>
                        <span className={g.feeUnpaid > 0 ? 'text-red-400 font-medium' : 'text-cream/20'}>{g.feeUnpaid} unpaid</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom row: top performers + team radar */}
      {(topPlayers.length > 0 || evaldEvals.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {topPlayers.length > 0 && (
            <div className="bg-navy-mid rounded-xl border border-white/10 overflow-hidden">
              <p className="text-sm font-semibold text-cream px-4 py-3 border-b border-white/10">Top Performers</p>
              <div className="divide-y divide-white/5">
                {topPlayers.map((p, i) => {
                  const ovr = toOvr(p.avg)
                  return (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                      <span className={`w-5 text-sm font-bold shrink-0 font-display ${i === 0 ? 'text-gold' : 'text-cream/20'}`}>{i + 1}</span>
                      {/* OVR ScoreBadge */}
                      <ScoreBadge
                        value={ovr}
                        label="OVR"
                        size="sm"
                        tone={i === 0 ? 'gold' : 'rated'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-cream truncate">{p.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Badge kind="age"      value={p.ageGroup} size="sm">{p.ageGroup}</Badge>
                          <Badge kind="position" value={p.position} size="sm" />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-display text-base" style={{ color: ratingColor(p.avg) }}>{p.avg.toFixed(1)}</span>
                        <span className="text-xs text-cream/30"> /10</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {evaldEvals.length > 0 && (
            <div className="bg-navy-mid rounded-xl border border-white/10 p-4 flex flex-col items-center">
              <div className="self-start mb-1">
                <p className="text-sm font-semibold text-cream">Team Skill Profile</p>
                <p className="text-xs text-cream/40">Average across {evaldEvals.length} evaluated player{evaldEvals.length !== 1 ? 's' : ''}</p>
              </div>
              <RadarChart
                skills={teamSkillsMap}
                size={220}
                color="var(--gold, #f1b813)"
                showLabels
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function KpiCard({ label, value, highlight }) {
  return (
    <div className="bg-navy-mid rounded-xl border border-white/10 p-4 text-center">
      <p className={`font-display text-3xl tracking-wide uppercase ${highlight ? 'text-gold' : 'text-cream'}`}>{value}</p>
      <p className="font-condensed text-xs text-cream/40 mt-1 leading-tight tracking-widest uppercase">{label}</p>
    </div>
  )
}
