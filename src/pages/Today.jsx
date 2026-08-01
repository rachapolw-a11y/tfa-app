import { useState, useEffect, useMemo } from 'react'
import { subscribeTo } from '../lib/storage'
import tfaLogo from '../assets/tfa-logo.png'

const DISPLAY = '"Tottenham","Barlow Condensed",sans-serif'
const CONDENSED = '"Barlow Condensed",sans-serif'

function getISOWeekBounds() {
  const now = new Date()
  const day = now.getDay()
  const diffToMon = (day === 0 ? -6 : 1 - day)
  const mon = new Date(now)
  mon.setDate(now.getDate() + diffToMon)
  mon.setHours(0, 0, 0, 0)
  const sun = new Date(mon)
  sun.setDate(mon.getDate() + 6)
  sun.setHours(23, 59, 59, 999)
  return { mon, sun }
}

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Today({ onTabSwitch }) {
  const [players,     setPlayers]     = useState([])
  const [sessions,    setSessions]    = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [leads,       setLeads]       = useState([])

  useEffect(() => {
    const unsubs = [
      subscribeTo('players',     setPlayers),
      subscribeTo('sessions',    setSessions),
      subscribeTo('evaluations', setEvaluations),
      subscribeTo('leads',       setLeads),
    ]
    return () => unsubs.forEach(fn => fn())
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const { mon, sun } = getISOWeekBounds()
  const now = new Date()
  const dateLabel = `${DAY_NAMES[now.getDay()]} ${now.getDate()} ${MONTH_NAMES[now.getMonth()]}`

  const activePlayers = players.filter(p => p.active)

  const weekSessions = sessions.filter(s => {
    const d = new Date(s.date + 'T00:00:00')
    return d >= mon && d <= sun
  })

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const evalsDue = useMemo(() => activePlayers.filter(p => {
    const evals = evaluations.filter(e => e.playerId === p.id)
    if (!evals.length) return true
    const latest = evals.map(e => new Date(e.date)).sort((a, b) => b - a)[0]
    return latest < thirtyDaysAgo
  }), [activePlayers, evaluations])

  const hotLeads = leads.filter(l => l.stage === 'trial' || l.stage === 'offer')

  const upcomingSession = sessions
    .filter(s => s.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0]

  const needsAction = []
  if (evalsDue.length > 0) {
    needsAction.push({
      label: `Evaluation due · ${evalsDue[0]?.name ?? 'player'}`,
      tag: 'Eval', color: 'var(--gold)',
      go: () => onTabSwitch('squad'),
    })
  }
  hotLeads.slice(0, 2).forEach(l => {
    needsAction.push({
      label: `Follow up · ${l.name}`,
      tag: 'New', color: 'var(--status-new)',
      go: () => onTabSwitch('leads'),
    })
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15, padding: '4px 20px 14px' }}>

      {/* Logo + coach label row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 2, paddingBottom: 8 }}>
        <img src={tfaLogo} alt="TFA" style={{ height: 28, width: 'auto' }} />
        <div style={{ fontFamily: CONDENSED, fontWeight: 600, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Coach Rachapol
        </div>
      </div>

      {/* Hero: big session count */}
      <div>
        <div style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)' }}>
          {dateLabel} · Match week
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 13, marginTop: 8 }}>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 96, lineHeight: 0.6, color: 'var(--gold)' }}>
            {weekSessions.length}
          </div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, lineHeight: 0.92, textTransform: 'uppercase', color: 'var(--cream)', paddingBottom: 5 }}>
            Sessions<br />this week
          </div>
        </div>
        <div style={{ fontFamily: CONDENSED, fontWeight: 500, fontSize: 12.5, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 13 }}>
          {activePlayers.length} players · {hotLeads.length} leads hot · {evalsDue.length} evals due
        </div>
      </div>

      {/* Quick cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <button
          onClick={() => onTabSwitch('squad')}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 15px', textAlign: 'left', cursor: 'pointer' }}
        >
          <div style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Squad</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, lineHeight: 0.8, color: 'var(--cream)', marginTop: 8 }}>{activePlayers.length}</div>
          <div style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 8 }}>View ›</div>
        </button>
        <button
          onClick={() => onTabSwitch('leads')}
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '14px 15px', textAlign: 'left', cursor: 'pointer' }}
        >
          <div style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Leads</div>
          <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 44, lineHeight: 0.8, color: 'var(--cream)', marginTop: 8 }}>{hotLeads.length}</div>
          <div style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--gold)', marginTop: 8 }}>Pipeline ›</div>
        </button>
      </div>

      {/* Upcoming session */}
      {upcomingSession && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)' }}>
              Today · {upcomingSession.date === today ? new Date(upcomingSession.date + 'T00:00:00').toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit' }) : upcomingSession.date}
            </div>
            <div style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, lineHeight: 0.9, textTransform: 'uppercase', color: 'var(--cream)', marginTop: 5 }}>
              {upcomingSession.ageGroup} · {(upcomingSession.attendanceIds || []).length || 14} kids
            </div>
          </div>
          <button style={{
            background: 'var(--gold)', border: 'none', borderRadius: 8,
            padding: '8px 14px', color: 'var(--navy)',
            fontFamily: CONDENSED, fontWeight: 700, fontSize: 13, letterSpacing: '0.06em',
            textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            Attend →
          </button>
        </div>
      )}

      {/* Needs action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div style={{ fontFamily: CONDENSED, fontWeight: 700, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
          Needs action · {needsAction.length}
        </div>
        {needsAction.length === 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 13, padding: '14px 16px', color: 'var(--text-muted)', fontSize: 13, textAlign: 'center' }}>
            All caught up — no pending actions.
          </div>
        )}
        {needsAction.map((item, i) => (
          <button
            key={i}
            onClick={item.go}
            style={{
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 11,
              padding: '11px 13px', background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: 13,
              width: '100%', textAlign: 'left',
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, background: item.color }} />
            <div style={{ flex: 1, minWidth: 0, fontFamily: '"Barlow",sans-serif', fontSize: 14, color: 'var(--cream)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.label}
            </div>
            <span style={{
              flexShrink: 0, fontFamily: CONDENSED, fontWeight: 700, fontSize: 10,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: item.color, border: `1px solid ${item.color}`, borderRadius: 999,
              padding: '2px 9px',
            }}>
              {item.tag}
            </span>
          </button>
        ))}
      </div>

    </div>
  )
}
