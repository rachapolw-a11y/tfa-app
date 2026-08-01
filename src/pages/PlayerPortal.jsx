import { useState, useEffect, useMemo } from 'react'
import { subscribeTo } from '../lib/storage'
import {
  RadarChart,
  StatBar,
  ScoreBadge,
  Badge,
  SummaryTile,
  Button,
  Avatar,
} from '../components/ui'
import { generateCard, shareCard } from '../lib/generateCard.fut'
import {
  Share2,
  Home,
  TrendingUp,
  CreditCard,
  Link2,
  ImageDown,
  Printer,
  MessageCircle,
  Sparkles,
} from 'lucide-react'
import {
  skillsToOvr,
  playerEvals,
  ovrDelta,
  SKILL_ORDER,
  SKILL_LABELS,
} from '../lib/ratings'
import tfaLogo from '../assets/tfa-logo.png'

// ── Hero card composition (Home + Card tabs) ──────────────────────────────────
function PlayerHero({ player, latestSkills, ovr }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '6px 0 8px' }}>
      <Avatar name={player.name} photoURL={player.photoURL} size={90} ring />
      <div
        className="tfa-display"
        style={{ fontSize: 22, color: 'var(--text-strong)', marginTop: 4, textAlign: 'center' }}
      >
        {player.name}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Badge kind="position" value={player.position} size="sm" />
        <Badge kind="age" value={player.ageGroup} size="sm" />
      </div>
      <ScoreBadge value={ovr} tone="gold" size="md" />
      {latestSkills && (
        <div className="pp-radar" style={{ marginTop: 4 }}>
          <RadarChart skills={latestSkills} size={160} showLabels />
        </div>
      )}
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function monthYear() {
  return new Date()
    .toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    .toUpperCase()
}

// Shared stadium-style navy panel style
const stadium = {
  background: 'linear-gradient(170deg, #101c33, #070f1e)',
  border: '1px solid #25375a',
  borderRadius: 20,
  boxShadow: 'var(--shadow-md)',
  overflow: 'hidden',
  position: 'relative',
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PlayerPortal({ playerId }) {
  // Data
  const [player,      setPlayer]      = useState(null)
  const [evaluations, setEvaluations] = useState([])
  const [sessions,    setSessions]    = useState([])
  const [allSessions, setAllSessions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [generating,  setGenerating]  = useState(false)

  // UI
  const [tab,       setTab]       = useState('home')
  const [shareOpen, setShareOpen] = useState(false)
  const [toast,     setToast]     = useState('')

  // Toast auto-clear
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 1900)
    return () => clearTimeout(t)
  }, [toast])

  // Firestore subscriptions
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

  // Derived
  const sorted = useMemo(
    () => playerEvals(playerId, evaluations, 'asc'),
    [playerId, evaluations],
  )
  const latest      = sorted.at(-1)
  const prev        = sorted.at(-2)
  const latestSkills = latest?.skills ?? null
  const ovr          = latestSkills ? skillsToOvr(latestSkills) : 0
  const ovrDeltaVal  = ovrDelta(playerId, evaluations)

  const skillDeltas = useMemo(() => {
    if (!latestSkills || !prev?.skills) return null
    return SKILL_ORDER.map(k => ({
      key:   k,
      delta: Math.round((latestSkills[k] ?? 0) - (prev.skills[k] ?? 0)),
    }))
  }, [latestSkills, prev])

  const biggestGain = useMemo(() => {
    if (!skillDeltas) return null
    const pos = skillDeltas.filter(s => s.delta > 0)
    if (!pos.length) return null
    return pos.reduce((a, b) => (b.delta > a.delta ? b : a))
  }, [skillDeltas])

  const groupSessions  = allSessions.filter(s => s.ageGroup === player?.ageGroup)
  const attendancePct  = groupSessions.length
    ? Math.round(sessions.length / groupSessions.length * 100)
    : 0
  const evalCount  = sorted.length
  const monthLabel = monthYear()
  const firstName  = player?.name?.split(' ')[0]?.toUpperCase() ?? ''
  const shareUrl   = `${window.location.origin}${window.location.pathname}?id=${playerId}`

  // Actions
  function openShare()  { setShareOpen(true) }
  function closeShare() { setShareOpen(false) }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).catch(() => {})
    setShareOpen(false)
    setToast('Link copied!')
  }

  async function saveImage() {
    setShareOpen(false)
    setGenerating(true)
    try {
      const canvas = await generateCard(player, evaluations, sessions)
      await shareCard(canvas, player.name)
    } finally {
      setGenerating(false)
    }
  }

  async function saveHype() {
    setShareOpen(false)
    setGenerating(true)
    try {
      const canvas = await generateCard(player, evaluations, sessions, { type: 'special' })
      await shareCard(canvas, player.name)
    } finally {
      setGenerating(false)
    }
  }

  function shareLine() {
    setShareOpen(false)
    window.open(
      `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  function printCard() {
    setShareOpen(false)
    window.print()
  }

  // Loading / not-found
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted font-condensed uppercase tracking-[0.16em] text-xs">
        Loading…
      </div>
    )
  }
  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted font-condensed uppercase tracking-[0.16em] text-xs">
        Player not found.
      </div>
    )
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100dvh', background: 'var(--bg-app)', overflowX: 'hidden' }}>

      {/* ── Header ── */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'var(--bg-app)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: 'calc(env(safe-area-inset-top) + 14px) 18px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={tfaLogo} alt="TFA" style={{ height: 30, flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="tfa-display" style={{ fontSize: 16, color: 'var(--text-strong)' }}>
              Player Portal
            </div>
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {player.name} · {player.ageGroup} · {monthLabel}
            </div>
          </div>
          <button
            onClick={openShare}
            aria-label="Share"
            style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cream)', cursor: 'pointer', flexShrink: 0 }}
          >
            <Share2 size={16} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main style={{ paddingTop: 'calc(env(safe-area-inset-top) + 62px)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>

        {/* ══ HOME ══ */}
        {tab === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, padding: '22px 20px 30px' }}>

            {/* Greeting */}
            <div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
                {monthLabel} · Development Card
              </div>
              <div className="tfa-display" style={{ fontSize: 33, lineHeight: 1.02, color: 'var(--cream)' }}>
                Great month,<br />{firstName}.
              </div>
              <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, lineHeight: 1.5, color: 'var(--text-muted)', maxWidth: '32ch', marginTop: 8 }}>
                {player.nickname || firstName} is making great progress this month. Keep it up!
              </div>
            </div>

            {/* Hero card — tappable → Card tab */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', inset: -26, background: 'radial-gradient(circle at 50% 42%, rgba(241,184,19,0.34), transparent 68%)', filter: 'blur(22px)', pointerEvents: 'none', zIndex: 0 }} aria-hidden />
              <button
                onClick={() => setTab('card')}
                style={{ width: '100%', background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'block', position: 'relative', zIndex: 1 }}
              >
                <div style={{ background: 'linear-gradient(140deg, #172c4e 0%, #0c1830 54%, #070f1e 100%)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 16, overflow: 'hidden', position: 'relative', boxShadow: '0 6px 18px rgba(3,8,18,0.38)' }}>
                  <div className="tfa-pitch-stripes" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden />
                  <div style={{ position: 'relative', zIndex: 1, padding: '20px 16px' }}>
                    <PlayerHero player={player} latestSkills={latestSkills} ovr={ovr} />
                  </div>
                </div>
                {ovrDeltaVal > 0 && (
                  <div style={{ position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-dark))', color: 'var(--navy)', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '6px 18px', borderRadius: 999, whiteSpace: 'nowrap', zIndex: 2 }}>
                    ▲ +{ovrDeltaVal} OVR THIS MONTH
                  </div>
                )}
              </button>
              <div style={{ textAlign: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-faint)', marginTop: ovrDeltaVal > 0 ? 26 : 12 }}>
                TAP CARD TO OPEN FULL VIEW →
              </div>
            </div>

            {/* Summary tiles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
              <SummaryTile label="Sessions" value={sessions.length} hint="This month" />
              <SummaryTile
                label="Attendance"
                value={attendancePct}
                suffix="%"
                hint={`${sessions.length} of ${groupSessions.length}`}
                accent="var(--gold)"
              />
              <SummaryTile label="Evaluations" value={evalCount} hint="All-time" />
            </div>

            {/* Coach's Note */}
            {player.coachNote && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: 'var(--shadow-light)', padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <Avatar name="Rachapol" size={40} ring />
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>Rachapol</div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 2 }}>Head Coach</div>
                  </div>
                </div>
                <div style={{ width: 22, height: 2, background: 'var(--gold)', marginBottom: 12 }} />
                <div style={{ fontFamily: "'Barlow',sans-serif", fontSize: 14.5, lineHeight: 1.62, color: 'var(--text-muted)' }}>
                  {player.coachNote}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ══ PROGRESS ══ */}
        {tab === 'progress' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '22px 20px 30px' }}>

            {/* Header */}
            <div>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
                Development · {monthLabel}
              </div>
              <div className="tfa-display" style={{ fontSize: 30, color: 'var(--cream)' }}>
                Skill Progress
              </div>
            </div>

            {/* Radar stadium */}
            <div style={stadium}>
              <div className="tfa-pitch-stripes" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden />
              <div style={{ position: 'relative', zIndex: 1, padding: '20px 20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div className="tfa-display" style={{ fontSize: 14, color: 'var(--text-strong)' }}>Skill Radar</div>
                    <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 3 }}>7-Axis Profile</div>
                  </div>
                  <ScoreBadge value={ovr} tone="gold" size="md" />
                </div>
                {latestSkills ? (
                  <div className="pp-radar" style={{ display: 'flex', justifyContent: 'center' }}>
                    <RadarChart skills={latestSkills} size={214} showLabels />
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-faint)', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', padding: '32px 0' }}>
                    No evaluations yet
                  </div>
                )}
              </div>
            </div>

            {/* Biggest gain */}
            {biggestGain && (
              <div style={{ background: 'linear-gradient(135deg, rgba(241,184,19,0.12), var(--surface))', border: '1px solid var(--border)', borderRadius: 16, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(241,184,19,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--glow-gold)' }}>
                  <span style={{ color: 'var(--gold)', fontSize: 22, lineHeight: 1 }}>↑</span>
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
                    Biggest Gain This Month
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 16, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-strong)' }}>
                    {SKILL_LABELS[biggestGain.key]}{' '}
                    <span style={{ color: 'var(--success)' }}>+{biggestGain.delta}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Skill breakdown */}
            {latestSkills && (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, boxShadow: 'var(--shadow-light)', padding: '18px 18px 20px' }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>
                  Skill Breakdown
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {SKILL_ORDER.map(k => {
                    const delta = skillDeltas?.find(s => s.key === k)?.delta ?? null
                    return (
                      <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <StatBar label={SKILL_LABELS[k]} value={latestSkills[k] ?? 0} variant="vertical" />
                        </div>
                        <div style={{ width: 38, textAlign: 'right', flexShrink: 0 }}>
                          {delta === null || delta === 0 ? (
                            <span style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 13, color: 'var(--text-faint)' }}>—</span>
                          ) : (
                            <span style={{ display: 'inline-block', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, color: delta > 0 ? 'var(--success)' : 'var(--danger)', background: delta > 0 ? 'rgba(46,193,141,0.16)' : 'rgba(226,73,63,0.16)', padding: '2px 7px', borderRadius: 999 }}>
                              {delta > 0 ? '+' : ''}{delta}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Footnote */}
            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-faint)', textAlign: 'center' }}>
              Ratings from {evalCount} coach evaluation{evalCount !== 1 ? 's' : ''} · 0–10 scale
            </div>
          </div>
        )}

        {/* ══ CARD ══ */}
        {tab === 'card' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '22px 20px 30px' }}>

            {/* Header */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
                Official Development Card
              </div>
              <div className="tfa-display" style={{ fontSize: 30, color: 'var(--cream)' }}>
                Share The Card
              </div>
            </div>

            {/* Spotlight panel */}
            <div style={{ ...stadium, borderRadius: 22, boxShadow: 'var(--shadow-lg)' }}>
              <div className="tfa-pitch-stripes" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden />
              <div style={{ position: 'relative', zIndex: 1, padding: '26px 16px 30px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
                  The Football Academy
                </div>
                <PlayerHero player={player} latestSkills={latestSkills} ovr={ovr} />
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 10 }}>
                  Issued {monthLabel} · Read-only
                </div>
              </div>
            </div>

            <Button variant="primary" size="lg" block onClick={openShare}>
              Share to LINE
            </Button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <Button variant="secondary" onClick={copyLink}>
                Copy link
              </Button>
              <Button variant="secondary" onClick={saveImage} disabled={generating}>
                {generating ? 'Saving…' : 'Save'}
              </Button>
              <Button variant="secondary" onClick={saveHype} disabled={generating} leftIcon={<Sparkles size={13} strokeWidth={2} />}>
                Hype
              </Button>
            </div>

            <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-faint)', textAlign: 'center' }}>
              Read-only link · No login required
            </div>
          </div>
        )}
        </div>
      </main>

      {/* ── Tab bar ── */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, background: 'var(--surface)', borderTop: '1px solid var(--border)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex' }}>
          {[
            { id: 'home',     label: 'Home',     Icon: Home },
            { id: 'progress', label: 'Progress', Icon: TrendingUp },
            { id: 'card',     label: 'Card',     Icon: CreditCard },
          ].map(({ id, label, Icon }) => {
            const active = tab === id
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '10px 0', color: active ? 'var(--gold)' : 'var(--text-muted)', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 10, fontWeight: active ? 700 : 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', border: 'none', background: 'none', transition: 'color 200ms' }}
              >
                <Icon size={22} strokeWidth={1.8} />
                {label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ── Share bottom sheet ── */}
      {shareOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
          <div
            onClick={closeShare}
            style={{ position: 'absolute', inset: 0, background: 'rgba(7,15,30,0.62)', backdropFilter: 'saturate(140%) blur(3px)', WebkitBackdropFilter: 'saturate(140%) blur(3px)' }}
          />
          <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: 'var(--surface)', borderRadius: '22px 22px 0 0', boxShadow: '0 -12px 44px rgba(3,8,18,.34)', padding: `14px 16px calc(18px + env(safe-area-inset-bottom))` }}>
            <div style={{ width: 40, height: 4, borderRadius: 999, background: 'var(--border-strong)', margin: '0 auto 16px' }} />
            {[
              { label: 'Share to LINE',         Icon: MessageCircle, iconBg: 'rgba(6,199,85,0.16)', iconColor: '#06b14e', onClick: shareLine },
              { label: 'Copy read-only link',   Icon: Link2,         iconBg: 'var(--surface-2)',     iconColor: 'var(--text-muted)', onClick: copyLink },
              { label: 'Save image to Photos',  Icon: ImageDown,     iconBg: 'var(--surface-2)',                 iconColor: 'var(--text-muted)', onClick: saveImage },
              { label: 'Hype edition card',     Icon: Sparkles,      iconBg: 'rgba(241,184,19,0.14)',            iconColor: 'var(--gold)',        onClick: saveHype  },
              { label: 'Print card',            Icon: Printer,       iconBg: 'var(--surface-2)',                 iconColor: 'var(--text-muted)', onClick: printCard },
            ].map(({ label, Icon, iconBg, iconColor, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', background: 'none', border: 'none', borderRadius: 12, cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: iconColor }}>
                  <Icon size={20} strokeWidth={1.8} />
                </div>
                <span style={{ flex: 1, fontFamily: "'Barlow Condensed',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--text-strong)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {label}
                </span>
                <span style={{ color: 'var(--text-faint)', fontSize: 18, lineHeight: 1 }}>›</span>
              </button>
            ))}
            <div style={{ height: 1, background: 'var(--border)', margin: '8px 0 12px' }} />
            <Button variant="secondary" block onClick={closeShare}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position: 'fixed', left: '50%', bottom: 88, transform: 'translateX(-50%)', zIndex: 70, background: 'var(--navy-soft)', color: 'var(--cream)', fontFamily: "'Barlow Condensed',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '10px 20px', borderRadius: 999, boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-strong)', whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {toast}
        </div>
      )}
    </div>
  )
}
