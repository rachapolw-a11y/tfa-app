import { useMemo, useState, useEffect } from 'react'
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  ChevronLeft,
  Share2,
  ClipboardEdit,
  TrendingUp,
  TrendingDown,
  Pencil,
  Check,
  X,
} from 'lucide-react'
import { updatePlayer } from '../lib/storage'
import {
  HexAvatar,
  ScoreBadge,
  StatBar,
  Badge,
  RadarChart,
  HeroCard,
  Button,
} from '../components/ui'
import {
  skillsToOvr,
  playerEvals as playerEvalsAsc,
  ovrTrend,
  SKILL_ORDER,
  SKILL_LABELS,
} from '../lib/ratings'

// ── Trend chip (matches v2's design used on Progress) ───────────────────────
function TrendChip({ delta, since = 'last eval' }) {
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

export default function PlayerDetail({
  playerId,
  players,
  evaluations,
  sessions: _sessions,
  onBack,
  onEvaluate,
  role,
}) {
  const isCoach = role === 'coach'
  const player = players.find(p => p.id === playerId)

  const evals = useMemo(
    () => (player ? playerEvalsAsc(player.id, evaluations, 'asc') : []),
    [player, evaluations],
  )
  const latest = evals.at(-1) ?? null
  const prev   = evals.at(-2) ?? null
  const currentOvr  = latest ? skillsToOvr(latest.skills) : 0
  const previousOvr = prev   ? skillsToOvr(prev.skills)   : null
  const ovrDelta    = previousOvr !== null ? currentOvr - previousOvr : null

  const trend = useMemo(
    () => (player ? ovrTrend(player.id, evaluations) : []),
    [player, evaluations],
  )

  if (!player) {
    return (
      <div className="px-4 md:px-6 py-12 text-center text-muted font-condensed uppercase tracking-[0.16em] text-xs">
        Player not found
      </div>
    )
  }

  async function sharePortal() {
    const url = `${window.location.origin}${window.location.pathname}?id=${playerId}`
    try {
      if (navigator.share) {
        await navigator.share({ title: `${player.name} — TFA Progress`, url })
        return
      }
    } catch {
      /* cancelled */
    }
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt('Copy link:', url)
    }
  }

  const latestLabel = latest
    ? `Latest evaluation · ${new Date(latest.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
    : 'No evaluation yet'

  return (
    <div className="pb-32">
      {/* ── Back-bar chrome — full-bleed sticky blur ── */}
      <div className="sticky top-0 z-30 tfa-blur-bar border-b border-white/[0.06]">
        <div className="h-14 px-4 md:px-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            leftIcon={<ChevronLeft size={16} strokeWidth={2.2} />}
          >
            Squad
          </Button>
          <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted truncate">
            Player profile
          </div>
          <div className="w-[88px]" />{/* spacer for symmetric centering on mobile */}
        </div>
      </div>

      {/* ── Hero profile card ── */}
      <div className="px-4 md:px-6 pt-6">
        <HeroCard jersey={player.jersey ?? player.position ?? '★'}>
          <div className="flex flex-col lg:flex-row gap-7 lg:items-center">
            {/* HEAD — avatar + ovr + name + badges + trend */}
            <div className="lg:w-[300px] lg:shrink-0">
              <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted mb-3">
                {latestLabel}
              </div>

              <div className="flex items-center gap-4">
                <HexAvatar
                  name={player.name}
                  photoURL={player.photoURL}
                  size={88}
                  glow
                />
                {latest ? (
                  <ScoreBadge value={currentOvr} tone="gold" size="lg" />
                ) : null}
              </div>

              <h1
                className="font-display uppercase text-cream mt-5"
                style={{
                  fontSize: 'clamp(28px, 4vw, 36px)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.01em',
                }}
              >
                {player.name}
              </h1>

              <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                <Badge kind="position" value={player.position} size="sm" />
                <Badge kind="age" value={player.ageGroup} size="sm" />
                {player.jersey ? (
                  <span className="font-condensed uppercase text-[11px] tracking-[0.14em] text-muted">
                    #{player.jersey}
                  </span>
                ) : null}
              </div>

              {ovrDelta !== null && (
                <div className="mt-4">
                  <TrendChip delta={ovrDelta} since="last eval" />
                </div>
              )}
            </div>

            {/* RADAR */}
            {latest ? (
              <div className="flex justify-center lg:flex-1">
                <RadarChart skills={latest.skills} size={230} showLabels />
              </div>
            ) : null}

            {/* SKILL BREAKDOWN — all 7 stat bars */}
            {latest ? (
              <div className="lg:w-[280px] lg:shrink-0">
                <div className="font-condensed uppercase tracking-[0.2em] text-[10.5px] text-muted mb-3">
                  Skill breakdown
                </div>
                <div className="space-y-2.5">
                  {SKILL_ORDER.map(k => (
                    <StatBar
                      key={k}
                      label={SKILL_LABELS[k]}
                      value={latest.skills[k] ?? 0}
                      variant="vertical"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </HeroCard>
      </div>

      {/* ── Coach note + parent name (coach-editable, parent-visible) ── */}
      <div className="px-4 md:px-6 pt-5">
        <CoachNotePanel player={player} isCoach={isCoach} />
      </div>

      {/* ── OVR trend card ── */}
      {trend.length > 1 && (
        <div className="px-4 md:px-6 pt-5">
          <div className="bg-navy-mid/85 border border-white/[0.06] rounded-lg p-5 shadow-card">
            <div className="flex items-baseline justify-between mb-4 gap-3 flex-wrap">
              <div
                className="font-display text-[18px] uppercase text-cream"
                style={{ letterSpacing: '0.02em' }}
              >
                OVR over time
              </div>
              {ovrDelta !== null && <TrendChip delta={ovrDelta} since="last eval" />}
            </div>
            <div className="h-[180px] -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="ovrFillPD" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#ovrFillPD)"
                    dot={{ r: 4, fill: '#f1b813', stroke: '#0a1322', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* ── Empty state when no evaluations ── */}
      {!latest && (
        <div className="px-4 md:px-6 pt-5">
          <div className="rounded-lg border border-dashed border-white/10 text-center py-12 px-4 text-muted">
            <div className="font-condensed uppercase tracking-[0.16em] text-xs">
              No evaluations logged yet
            </div>
            {isCoach && (
              <p className="text-xs mt-2 text-faint">
                Tap <strong className="text-cream/80">Evaluate</strong> to log the first one.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Sticky footer action bar — full-bleed blur ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 tfa-blur-bar border-t border-white/[0.06]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)', paddingTop: 12 }}
      >
        <div className="mx-auto max-w-[720px] px-4 md:px-6 flex gap-3">
          <Button
            variant="secondary"
            block
            leftIcon={<Share2 size={15} strokeWidth={2.2} />}
            onClick={sharePortal}
          >
            Share player card
          </Button>
          {isCoach && (
            <Button
              block
              leftIcon={<ClipboardEdit size={15} strokeWidth={2.2} />}
              onClick={onEvaluate}
            >
              Evaluate
            </Button>
          )}
        </div>
      </nav>
    </div>
  )
}

// ── Coach note + parent name panel ─────────────────────────────────────────
function CoachNotePanel({ player, isCoach }) {
  const [editing, setEditing] = useState(false)
  const [note,    setNote]    = useState(player.coachNote   || '')
  const [parent,  setParent]  = useState(player.parentName  || '')
  const [saving,  setSaving]  = useState(false)

  // Sync local form when the underlying player changes (live subs).
  useEffect(() => {
    if (!editing) {
      setNote(player.coachNote || '')
      setParent(player.parentName || '')
    }
  }, [player.coachNote, player.parentName, editing])

  async function save() {
    setSaving(true)
    try {
      await updatePlayer(player.id, {
        coachNote:   note.trim(),
        coachNoteAt: note.trim() ? new Date().toISOString().slice(0, 10) : null,
        parentName:  parent.trim(),
      })
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    setNote(player.coachNote || '')
    setParent(player.parentName || '')
    setEditing(false)
  }

  // Read-only view (non-coach, or coach not editing).
  if (!editing) {
    const empty = !player.coachNote && !player.parentName
    if (empty && !isCoach) return null
    return (
      <div className="bg-navy-mid/85 border border-white/[0.06] rounded-lg p-5 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted">
            Parent view
          </div>
          {isCoach && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Pencil size={13} strokeWidth={2.2} />}
              onClick={() => setEditing(true)}
            >
              {empty ? 'Add note' : 'Edit'}
            </Button>
          )}
        </div>

        {player.coachNote ? (
          <div className="mt-3 font-body italic text-[14px] text-cream/90 leading-snug">
            “{player.coachNote}”
          </div>
        ) : (
          <div className="mt-3 font-body text-sm text-faint italic">
            No coach note yet — parents will see a blank space here.
          </div>
        )}

        <div className="mt-3 font-condensed uppercase tracking-[0.14em] text-[10px] text-muted">
          Parent
          {player.parentName ? (
            <span className="text-cream/85 ml-2 normal-case tracking-normal font-body">
              Khun {player.parentName}
            </span>
          ) : (
            <span className="text-faint ml-2 normal-case tracking-normal font-body">
              Not set
            </span>
          )}
        </div>
      </div>
    )
  }

  // Edit mode (coach only).
  return (
    <div className="bg-navy-mid/85 border border-gold/40 rounded-lg p-5 shadow-card">
      <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-gold">
        Edit parent view
      </div>

      <label className="block mt-4">
        <div className="font-condensed uppercase tracking-[0.14em] text-[10px] text-muted mb-1.5">
          Coach note · shown to parent
        </div>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          maxLength={240}
          rows={3}
          placeholder={`e.g. "${player.name.split(' ')[0]}'s finishing has come on brilliantly."`}
          className="w-full px-3 py-2.5 rounded-md bg-navy-soft border border-white/[0.1] text-cream font-body text-sm focus:outline-none focus:border-gold resize-none"
        />
        <div className="text-right font-condensed text-[10px] text-faint mt-1">{note.length}/240</div>
      </label>

      <label className="block mt-3">
        <div className="font-condensed uppercase tracking-[0.14em] text-[10px] text-muted mb-1.5">
          Parent name
        </div>
        <input
          value={parent}
          onChange={e => setParent(e.target.value)}
          placeholder="e.g. Ploy"
          className="w-full h-10 px-3 rounded-md bg-navy-soft border border-white/[0.1] text-cream font-body text-sm focus:outline-none focus:border-gold"
        />
      </label>

      <div className="flex gap-2 mt-4">
        <Button
          variant="secondary"
          block
          leftIcon={<X size={14} strokeWidth={2.2} />}
          onClick={cancel}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          block
          leftIcon={<Check size={14} strokeWidth={2.4} />}
          onClick={save}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
