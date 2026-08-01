import { useState, useMemo } from 'react'
import { addEvaluation } from '../lib/storage'
import {
  ChevronLeft,
  RotateCcw,
  Check,
  Share2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import {
  HexAvatar,
  ScoreBadge,
  Badge,
  RadarChart,
  HeroCard,
  Button,
} from '../components/ui'
import {
  skillsToOvr,
  playerEvals as playerEvalsAsc,
  bandColor,
  ovrBandForGroup,
  SKILL_ORDER,
  SKILL_LABELS,
} from '../lib/ratings'

// ── Local TrendChip — same shape as Progress / PlayerDetail ──────────────────
function TrendChip({ delta, since = 'last eval' }) {
  if (delta == null || delta === 0) return null
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

// ── Skill slider row — vertical label/value above a custom range ─────────────
function SkillSliderRow({ label, value, lastValue, onChange }) {
  const c = bandColor(value)
  const pct = (value / 10) * 100
  const delta = lastValue != null ? value - lastValue : null
  const deltaPositive = delta != null && delta > 0
  const deltaNegative = delta != null && delta < 0
  return (
    <div className="px-5 py-4 border-b border-white/[0.05] last:border-b-0">
      {/* Header row: label · last → current · delta chip */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="font-condensed uppercase text-[11px] tracking-[0.14em] text-muted">
          {label}
        </div>
        <div className="flex items-center gap-3">
          {lastValue != null && (
            <span className="font-display text-[15px] leading-none text-faint" style={{ letterSpacing: '-0.01em' }}>
              {Math.round(lastValue * 10) / 10}
              <span className="text-[10px] text-faint/70 ml-1">last</span>
            </span>
          )}
          <span
            className="font-display text-[20px] leading-none"
            style={{ color: c, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}
          >
            {Math.round(value * 10) / 10}
          </span>
          {delta != null && delta !== 0 && (
            <span
              className="font-condensed font-bold uppercase text-[10.5px] tracking-[0.12em] rounded-pill px-2 py-[3px]"
              style={{
                color: deltaPositive ? 'var(--success)' : 'var(--danger)',
                background: deltaPositive ? 'rgba(46,193,141,0.14)' : 'rgba(226,73,63,0.14)',
              }}
            >
              {deltaPositive ? '+' : ''}
              {Math.round(delta * 10) / 10}
            </span>
          )}
        </div>
      </div>
      {/* Custom range */}
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="tfa-slider w-full"
        style={{ '--val': `${pct}%` }}
      />
    </div>
  )
}

// ── Compare-to-last micro chart ──────────────────────────────────────────────
function CompareBar({ from, to }) {
  const cTo = bandColor(to / 10)
  const min = Math.min(from, to)
  const range = Math.abs(to - from)
  return (
    <div className="bg-navy-mid/85 border border-white/[0.06] rounded-lg p-4 md:p-5 shadow-card">
      <div className="font-condensed uppercase text-[10.5px] tracking-[0.18em] text-muted mb-3">
        Compare to last evaluation
      </div>
      <div className="flex items-center gap-4">
        <span
          className="font-display text-[28px] leading-none text-faint"
          style={{ letterSpacing: '-0.01em' }}
        >
          {from}
        </span>
        <div className="flex-1 relative h-[8px] rounded-pill" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <div
            className="absolute h-full rounded-pill"
            style={{
              left: `${(min / 99) * 100}%`,
              width: `${(range / 99) * 100}%`,
              background: to >= from ? 'var(--success)' : 'var(--danger)',
              boxShadow: `0 0 12px ${to >= from ? 'rgba(46,193,141,0.45)' : 'rgba(226,73,63,0.45)'}`,
            }}
          />
        </div>
        <span
          className="font-display text-[28px] leading-none"
          style={{ color: cTo, letterSpacing: '-0.01em' }}
        >
          {to}
        </span>
      </div>
    </div>
  )
}

export default function EvaluateScreen({ playerId, players, evaluations, onBack, onSaved, role }) {
  const player = players.find(p => p.id === playerId)

  const sortedEvals = useMemo(
    () => (player ? playerEvalsAsc(player.id, evaluations, 'asc') : []),
    [player, evaluations],
  )
  const lastEval = sortedEvals.at(-1)
  const lastOvr  = lastEval ? skillsToOvr(lastEval.skills) : null

  const DEFAULT_SKILLS = useMemo(
    () => Object.fromEntries(SKILL_ORDER.map(k => [k, lastEval?.skills[k] ?? 5])),
    [lastEval],
  )
  const [skills, setSkills] = useState(DEFAULT_SKILLS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savedFromOvr, setSavedFromOvr] = useState(null)

  const ovr = useMemo(() => skillsToOvr(skills), [skills])
  // Same age-group-relative band as the Squad list, so the live preview
  // during evaluation matches how this OVR will render on the roster.
  const ovrBand = useMemo(
    () => (player ? ovrBandForGroup(ovr, player.ageGroup, players, evaluations) : null),
    [ovr, player, players, evaluations],
  )
  // Snapshot for the confirmation sheet (avoid Firestore re-read flipping the "before" value)
  const displayLastOvr = saved ? savedFromOvr : lastOvr
  const ovrDelta = displayLastOvr !== null ? ovr - displayLastOvr : null

  function resetSkills() { setSkills(DEFAULT_SKILLS) }
  function setSkill(key, val) {
    setSkills(s => ({ ...s, [key]: Number(val) }))
  }

  async function save() {
    if (saving) return
    setSaving(true)
    setSavedFromOvr(lastOvr)
    try {
      await addEvaluation({
        playerId,
        date: new Date().toISOString().split('T')[0],
        skills,
      })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  // Movers: skills that changed by ≥ 1 vs last eval
  const movers = lastEval
    ? SKILL_ORDER.filter(k => Math.abs(skills[k] - (lastEval.skills[k] ?? 5)) >= 1)
        .map(k => ({
          key: k,
          label: SKILL_LABELS[k],
          delta: skills[k] - (lastEval.skills[k] ?? 5),
        }))
        .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
        .slice(0, 4)
    : []

  if (!player) {
    return (
      <div className="px-4 md:px-6 py-12 text-center text-muted font-condensed uppercase tracking-[0.16em] text-xs">
        Player not found
      </div>
    )
  }

  return (
    <div className="pb-32">
      {/* ── Back-bar chrome ── */}
      <div className="sticky top-0 z-30 tfa-blur-bar border-b border-white/[0.06]">
        <div className="h-14 px-4 md:px-6 flex items-center justify-between gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            leftIcon={<ChevronLeft size={16} strokeWidth={2.2} />}
          >
            Back
          </Button>
          <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted truncate">
            Log evaluation
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetSkills}
            leftIcon={<RotateCcw size={14} strokeWidth={2.2} />}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* ── Player context hero ── */}
      <div className="px-4 md:px-6 pt-6">
        <HeroCard jersey={player.jersey ?? player.position ?? '★'}>
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            {/* Identity */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <HexAvatar name={player.name} photoURL={player.photoURL} size={72} glow />
              <div className="min-w-0">
                <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted mb-1.5">
                  Evaluating
                </div>
                <h1
                  className="font-display uppercase text-cream truncate"
                  style={{
                    fontSize: 'clamp(24px, 3.5vw, 32px)',
                    lineHeight: 0.92,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {player.name}
                </h1>
                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                  <Badge kind="position" value={player.position} size="sm" />
                  <Badge kind="age" value={player.ageGroup} size="sm" />
                  {player.jersey ? (
                    <span className="font-condensed uppercase text-[11px] tracking-[0.14em] text-muted">
                      #{player.jersey}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Live OVR */}
            <div className="flex items-center gap-3 md:flex-col md:items-end md:gap-2">
              <ScoreBadge value={ovr} tone="rated" size="lg" band={ovrBand} />
              {ovrDelta !== null && ovrDelta !== 0 ? (
                <TrendChip delta={ovrDelta} />
              ) : (
                <div className="font-condensed uppercase text-[10.5px] tracking-[0.16em] text-faint">
                  Live preview
                </div>
              )}
            </div>
          </div>
        </HeroCard>
      </div>

      {/* ── Compare-to-last card ── */}
      {lastOvr !== null && (
        <div className="px-4 md:px-6 pt-3">
          <CompareBar from={lastOvr} to={ovr} />
        </div>
      )}

      {/* ── Skill sliders ── */}
      <div className="px-4 md:px-6 pt-3">
        <div className="bg-navy-mid/85 border border-white/[0.06] rounded-lg shadow-card overflow-hidden">
          {SKILL_ORDER.map(k => (
            <SkillSliderRow
              key={k}
              label={SKILL_LABELS[k]}
              value={skills[k]}
              lastValue={lastEval?.skills[k]}
              onChange={v => setSkill(k, v)}
            />
          ))}
        </div>
      </div>

      {/* ── Sticky save bar ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 tfa-blur-bar border-t border-white/[0.06]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)', paddingTop: 12 }}
      >
        <div className="mx-auto max-w-[720px] px-4 md:px-6">
          <Button
            block
            size="lg"
            onClick={save}
            disabled={saving}
            leftIcon={<Check size={16} strokeWidth={2.5} />}
          >
            {saving ? 'Saving…' : 'Save evaluation'}
          </Button>
        </div>
      </nav>

      {/* ── Save confirmation sheet ── */}
      {saved && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          onClick={onSaved}
        >
          {/* Scrim */}
          <div className="absolute inset-0 bg-navy/85 backdrop-blur-sm" />

          {/* Sheet */}
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-[520px] bg-navy-mid border border-white/[0.06] rounded-t-xl shadow-lg"
            style={{ padding: '28px 24px calc(28px + env(safe-area-inset-bottom, 0px))' }}
          >
            {/* Drag handle */}
            <div className="mx-auto mb-5 h-1 w-12 rounded-full bg-white/15" />

            {/* Header — check icon + title + OVR transition */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(46,193,141,0.18)' }}
              >
                <Check size={26} className="text-success" />
              </div>
              <div
                className="font-display text-[24px] uppercase text-cream"
                style={{ letterSpacing: '-0.005em' }}
              >
                Evaluation saved
              </div>
              {displayLastOvr !== null && (
                <div className="flex items-center gap-3">
                  <span
                    className="font-display text-[22px] leading-none text-faint"
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    {displayLastOvr}
                  </span>
                  <span className="text-muted">→</span>
                  <span
                    className="font-display text-[28px] leading-none"
                    style={{ color: bandColor(ovr / 10), letterSpacing: '-0.01em' }}
                  >
                    {ovr}
                  </span>
                  {ovrDelta != null && ovrDelta !== 0 && (
                    <TrendChip delta={ovrDelta} />
                  )}
                </div>
              )}
            </div>

            {/* Mini radar */}
            <div className="flex justify-center mt-5">
              <RadarChart skills={skills} size={140} showLabels={false} />
            </div>

            {/* Movers — show ±1 skills, capped at 4 */}
            {movers.length > 0 && (
              <div className="mt-5">
                <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted mb-2 text-center">
                  Biggest movers
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {movers.map(m => (
                    <span
                      key={m.key}
                      className="font-condensed font-bold uppercase tracking-[0.14em] text-[11px] rounded-pill px-3 py-1.5 border"
                      style={{
                        color: m.delta > 0 ? 'var(--success)' : 'var(--danger)',
                        background: m.delta > 0 ? 'rgba(46,193,141,0.12)' : 'rgba(226,73,63,0.12)',
                        borderColor: m.delta > 0 ? 'rgba(46,193,141,0.35)' : 'rgba(226,73,63,0.35)',
                      }}
                    >
                      {m.delta > 0 ? '↑' : '↓'} {m.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                block
                leftIcon={<Share2 size={15} strokeWidth={2.2} />}
                onClick={() => {
                  const url = `${window.location.origin}${window.location.pathname}?id=${playerId}`
                  if (navigator.share) {
                    navigator.share({ title: `${player.name} — TFA`, url }).catch(() => {})
                  } else {
                    window.open(url, '_blank')
                  }
                }}
              >
                Share with parent
              </Button>
              <Button block onClick={onSaved}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
