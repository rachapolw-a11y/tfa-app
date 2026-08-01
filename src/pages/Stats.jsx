import { useState, useEffect, useMemo } from 'react'
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { subscribeTo } from '../lib/storage'
import {
  RadarChart,
  ScoreBadge,
  StatBar,
  Badge,
  HexAvatar,
  HeroCard,
  Button,
} from '../components/ui'
import { Plus, TrendingUp, TrendingDown } from 'lucide-react'
import {
  skillsToOvr,
  avgSkills,
  ovrSince,
  ovrTrend,
  playerEvals as playerEvalsAsc,
  SKILL_ORDER,
  SKILL_LABELS,
} from '../lib/ratings'

// ── Trend chip ───────────────────────────────────────────────────────────────
function TrendChip({ delta, since = 'last term' }) {
  if (delta == null) return null
  const up = delta >= 0
  const Icon = up ? TrendingUp : TrendingDown
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-pill font-condensed font-bold uppercase tracking-[0.16em] text-[11px]"
      style={{
        background: up ? 'rgba(46,193,141,0.16)' : 'rgba(226,73,63,0.18)',
        color: up ? 'var(--success)' : 'var(--danger)',
      }}
    >
      <Icon size={12} />
      {up ? '+' : ''}
      {delta} OVR since {since}
    </span>
  )
}

export default function Stats({ role = 'parent', onEvaluatePlayer }) {
  const isCoach = role === 'coach'

  const [players,     setPlayers]     = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [selectedId,  setSelectedId]  = useState(null)

  useEffect(() => {
    const loaded = { p: false, e: false }
    function check() { if (loaded.p && loaded.e) setLoading(false) }
    const unsubP = subscribeTo('players',     d => { setPlayers(d);     loaded.p = true; check() })
    const unsubE = subscribeTo('evaluations', d => { setEvaluations(d); loaded.e = true; check() })
    return () => { unsubP(); unsubE() }
  }, [])

  const activePlayers = useMemo(() => players.filter(p => p.active), [players])

  // OVR per player (for picker chips + sorting)
  const ovrMap = useMemo(() => {
    const map = {}
    for (const p of activePlayers) {
      const evs = playerEvalsAsc(p.id, evaluations, 'desc')
      if (evs[0]) map[p.id] = skillsToOvr(evs[0].skills)
    }
    return map
  }, [activePlayers, evaluations])

  // Auto-select first player that has an evaluation
  useEffect(() => {
    if (selectedId && activePlayers.some(p => p.id === selectedId)) return
    if (activePlayers.length) {
      const first =
        activePlayers.find(p => evaluations.some(e => e.playerId === p.id)) ??
        activePlayers[0]
      if (first) setSelectedId(first.id)
    } else {
      setSelectedId(null)
    }
  }, [activePlayers, evaluations, selectedId])

  // All evals for selected player, newest-first (for hero + history list)
  const evals = useMemo(
    () => (selectedId ? playerEvalsAsc(selectedId, evaluations, 'desc') : []),
    [selectedId, evaluations],
  )
  const latest = evals[0] ?? null
  const prev   = evals[1] ?? null
  const latestOvr = latest ? skillsToOvr(latest.skills) : null
  const prevOvr   = prev   ? skillsToOvr(prev.skills)   : null
  const lastDelta = latestOvr !== null && prevOvr !== null ? latestOvr - prevOvr : null

  const sincePts = selectedId ? ovrSince(selectedId, evaluations) : 0
  const firstEval = useMemo(
    () => (selectedId ? playerEvalsAsc(selectedId, evaluations, 'asc')[0] : null),
    [selectedId, evaluations],
  )
  const sinceLabel = firstEval
    ? new Date(firstEval.date).toLocaleDateString('en-GB', { month: 'short' })
    : null

  // Trend series for the recharts area chart (oldest → newest)
  const trend = useMemo(
    () => (selectedId ? ovrTrend(selectedId, evaluations) : []),
    [selectedId, evaluations],
  )

  const selectedPlayer = activePlayers.find(p => p.id === selectedId) ?? null

  if (loading)
    return <div className="text-center py-12 text-muted">Loading…</div>

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
            Progress
          </h1>
          <div className="font-condensed uppercase tracking-[0.18em] text-muted text-xs mt-2">
            {activePlayers.length === 0
              ? 'No players yet'
              : 'Select player to review development'}
          </div>
        </div>
        {isCoach && selectedPlayer && (
          <Button
            onClick={() => onEvaluatePlayer?.(selectedPlayer.id)}
            leftIcon={<Plus size={15} strokeWidth={2.5} />}
          >
            New evaluation
          </Button>
        )}
      </div>

      {/* ── Empty state ── */}
      {activePlayers.length === 0 && (
        <div className="mx-4 md:mx-6 mt-6 rounded-lg border border-dashed border-white/10 text-center py-12 px-4">
          <div className="font-condensed uppercase tracking-[0.16em] text-xs text-muted">
            No players yet. Add players to track progress.
          </div>
        </div>
      )}

      {/* ── Player picker ── */}
      {activePlayers.length > 0 && (
        <div className="px-4 md:px-6 pt-5">
          <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted mb-3">
            Select player
          </div>
          <div className="tfa-scroll-x flex gap-2.5 -mx-1 px-1 pb-1">
            {activePlayers.map(p => {
              const isSel = p.id === selectedId
              const ovr   = ovrMap[p.id]
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`shrink-0 flex items-center gap-2.5 pl-2 pr-3.5 py-2 rounded-lg border transition-all duration-200 ease-out-soft active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 ${
                    isSel
                      ? 'bg-gold/[0.12] border-gold/60 shadow-glow'
                      : 'bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/15'
                  }`}
                >
                  <HexAvatar name={p.name} photoURL={p.photoURL} size={40} />
                  <div className="text-left">
                    <div
                      className="font-display uppercase leading-none text-cream"
                      style={{ fontSize: 15, letterSpacing: '-0.005em' }}
                    >
                      {p.name.split(' ')[0]}
                    </div>
                    <div
                      className="font-condensed font-bold uppercase text-[10px] tracking-[0.16em] mt-1.5"
                      style={{ color: isSel ? 'var(--gold)' : 'var(--text-muted)' }}
                    >
                      OVR {ovr ?? '—'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Hero profile card ── */}
      {selectedPlayer && (
        <div className="px-4 md:px-6 pt-4">
          <HeroCard jersey={selectedPlayer.jersey ?? selectedPlayer.position ?? '★'}>
            <div className="flex flex-col lg:flex-row gap-7 lg:items-center">
              {/* HEAD */}
              <div className="lg:w-[280px] lg:shrink-0">
                <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted mb-3">
                  {latest
                    ? `Latest evaluation · ${new Date(latest.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                    : 'No evaluation yet'}
                </div>
                <div className="flex items-center gap-4">
                  <HexAvatar
                    name={selectedPlayer.name}
                    photoURL={selectedPlayer.photoURL}
                    size={88}
                    glow
                  />
                  {latestOvr !== null && (
                    <ScoreBadge value={latestOvr} size="lg" tone="gold" />
                  )}
                </div>
                <div
                  className="font-display uppercase text-cream mt-5"
                  style={{
                    fontSize: 'clamp(26px, 4vw, 34px)',
                    lineHeight: 0.92,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {selectedPlayer.name}
                </div>
                <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                  <Badge kind="position" value={selectedPlayer.position} size="sm" />
                  <Badge kind="age" value={selectedPlayer.ageGroup} size="sm" />
                  {selectedPlayer.jersey ? (
                    <span className="font-condensed uppercase text-[11px] tracking-[0.14em] text-muted">
                      #{selectedPlayer.jersey}
                    </span>
                  ) : null}
                </div>
                {evals.length >= 2 && (
                  <div className="mt-4">
                    {/* Hero chip uses the generic "since last term" copy (v2 default). */}
                    <TrendChip delta={sincePts} />
                  </div>
                )}
              </div>

              {/* RADAR */}
              {latest ? (
                <div className="flex justify-center lg:flex-1">
                  <RadarChart skills={latest.skills} size={230} showLabels />
                </div>
              ) : null}

              {/* SKILL BREAKDOWN */}
              {latest ? (
                <div className="lg:w-[280px] lg:shrink-0">
                  <div className="font-condensed uppercase tracking-[0.2em] text-[10.5px] text-muted mb-3">
                    Skill breakdown
                  </div>
                  <div className="space-y-2.5">
                    {SKILL_ORDER.map(k => (
                      <StatBar key={k} label={SKILL_LABELS[k]} value={latest.skills[k] ?? 0} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="lg:flex-1 text-center text-muted py-6 font-condensed uppercase text-xs tracking-[0.14em]">
                  No evaluation yet for this player.
                </div>
              )}
            </div>
          </HeroCard>
        </div>
      )}

      {/* ── Trend + history grid ── */}
      {selectedPlayer && evals.length > 0 && (
        <div className="px-4 md:px-6 pt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* OVR over time */}
          <div className="bg-navy-mid/85 border border-white/[0.06] rounded-lg p-5 shadow-card">
            <div className="flex items-baseline justify-between mb-4 gap-3 flex-wrap">
              <div
                className="font-display text-[18px] uppercase text-cream"
                style={{ letterSpacing: '0.02em' }}
              >
                OVR over time
              </div>
              {sincePts !== 0 && <TrendChip delta={sincePts} since={sinceLabel} />}
            </div>
            {trend.length > 1 ? (
              <div className="h-[180px] -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ovrFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#f1b813" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="#f1b813" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 4" stroke="rgba(255,255,255,0.05)" />
                    <XAxis
                      dataKey="label"
                      stroke="var(--text-muted)"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      fontFamily="Barlow Condensed"
                      tick={{ letterSpacing: '0.14em' }}
                    />
                    <YAxis
                      stroke="var(--text-muted)"
                      tickLine={false}
                      axisLine={false}
                      fontSize={11}
                      domain={[0, 99]}
                      hide
                    />
                    <Tooltip
                      contentStyle={{
                        background: 'var(--navy)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        color: 'var(--cream)',
                        fontFamily: 'Barlow',
                        fontSize: 12,
                      }}
                      labelStyle={{ color: 'var(--text-muted)' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="ovr"
                      stroke="#f1b813"
                      strokeWidth={2.5}
                      fill="url(#ovrFill)"
                      dot={{ r: 4, fill: '#f1b813', stroke: '#0a1322', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-muted font-condensed uppercase text-xs tracking-[0.14em]">
                Need at least 2 evaluations to chart a trend.
              </div>
            )}
          </div>

          {/* Evaluation history */}
          <div className="bg-navy-mid/85 border border-white/[0.06] rounded-lg p-5 shadow-card flex flex-col">
            <div
              className="font-display text-[18px] uppercase text-cream mb-4"
              style={{ letterSpacing: '0.02em' }}
            >
              Evaluation history
            </div>
            <div className="flex-1 space-y-2.5 overflow-y-auto pr-1 max-h-[320px]">
              {evals.map((e, i) => {
                const ovr   = skillsToOvr(e.skills)
                const next  = evals[i + 1]
                const delta = next ? ovr - skillsToOvr(next.skills) : null
                const avg   = avgSkills(e.skills).toFixed(1)
                return (
                  <div
                    key={e.id ?? i}
                    className="flex items-start gap-4 p-3 rounded-md bg-white/[0.03] border border-white/[0.05]"
                  >
                    <div className="text-center pr-3 border-r border-white/[0.08]">
                      <div
                        className="font-display text-cream"
                        style={{ fontSize: 18, lineHeight: 1, letterSpacing: '-0.01em' }}
                      >
                        {new Date(e.date).getDate()}
                      </div>
                      <div className="font-condensed font-bold uppercase text-[10px] tracking-[0.18em] text-muted mt-1">
                        {new Date(e.date).toLocaleDateString('en-GB', { month: 'short' })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {e.notes ? (
                        <div className="font-body italic text-[12.5px] text-cream/80 leading-snug">
                          {e.notes}
                        </div>
                      ) : (
                        <div className="font-condensed uppercase text-[11px] tracking-[0.14em] text-faint">
                          No coach notes
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className="font-display leading-none"
                        style={{ fontSize: 20, color: 'var(--gold)', letterSpacing: '-0.01em' }}
                      >
                        {avg}
                      </div>
                      <div className="font-condensed uppercase text-[10px] tracking-[0.18em] text-muted mt-1.5">
                        Avg
                      </div>
                    </div>
                    <div
                      className="text-right shrink-0 font-display"
                      style={{
                        fontSize: 15,
                        color:
                          delta === null
                            ? 'var(--text-faint)'
                            : delta > 0
                              ? 'var(--success)'
                              : delta < 0
                                ? 'var(--danger)'
                                : 'var(--text-muted)',
                        letterSpacing: '-0.01em',
                        minWidth: 40,
                      }}
                    >
                      {delta === null ? '—' : `${delta > 0 ? '+' : ''}${delta}`}
                    </div>
                  </div>
                )
              })}
            </div>
            {isCoach && (
              <Button
                variant="outline"
                block
                className="mt-4"
                onClick={() => onEvaluatePlayer?.(selectedPlayer.id)}
              >
                + New evaluation
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
