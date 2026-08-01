import { useMemo, useState } from 'react'
import { useParent, greeting } from '../../lib/parentContext'
import { skillsToOvr, latestEval, ovrDelta, SKILL_ORDER, SKILL_LABELS } from '../../lib/ratings'
import { HexAvatar, RadarChart, StatBar, Button } from '../../components/ui'
import Modal from '../../components/Modal'
import { ParentLink } from './ParentLink'
import { CLUB } from '../../lib/clubInfo'
import { generateCard, shareCard } from '../../lib/generateCard.fut'
import {
  ChevronLeft, ChevronRight, MessageCircle, CheckSquare,
  TrendingUp, Megaphone, Share2, Copy, Check, ImageOff, Info, Users, Download, Sparkles,
} from 'lucide-react'

// Shared share/download state for the player card. Used by Home's hero share
// button and Progress's download button. Resolves to whichever path the
// device supports — Web Share API on mobile, PNG download on desktop —
// without navigating anywhere.
function useShareCardState() {
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(null) // 'shared' | 'downloaded' | null

  async function run(child, allEvals, allSessions, type) {
    if (busy) return
    setBusy(true)
    try {
      const childEvals    = allEvals.filter(e => e.playerId === child.id)
      const childSessions = allSessions.filter(s => (s.attendanceIds ?? []).includes(child.id))
      const opts = type ? { type } : undefined
      const canvas = await generateCard(child, childEvals, childSessions, opts)
      const result = await shareCard(canvas, child.name)
      setDone(result || 'downloaded')
      setTimeout(() => setDone(null), 1600)
    } finally {
      setBusy(false)
    }
  }

  const doneLabel = done === 'shared' ? 'Shared' : 'Saved'
  return { busy, done: !!done, doneLabel, run }
}

const SKILL_CODE = {
  shooting:    'SHO',
  dribbling:   'DRI',
  pace:        'PAC',
  passing:     'PAS',
  positioning: 'POS',
  ballMastery: 'BAL',
  attitude:    'ATT',
}

// ── PARENT · HOME ─────────────────────────────────────────────────────────────

export function ParentHome({ onTabSwitch }) {
  const { evaluations, sessions, child, notices } = useParent()
  const shareCardState = useShareCardState()
  const go = onTabSwitch || (() => {})

  if (!child) return <EmptyState message="No active players in the roster yet." />

  const parentFirst = (child.parentName || '').split(' ')[0]
  const latest = latestEval(child.id, evaluations)
  const ovr    = latest ? skillsToOvr(latest.skills) : 0
  const delta  = ovrDelta(child.id, evaluations)

  const handleShare = () => shareCardState.run(child, evaluations, sessions)
  const handleHype  = () => shareCardState.run(child, evaluations, sessions, 'special')

  return (
    <div className="px-4 md:px-6 pt-3 pb-6 flex flex-col gap-3.5">
      {/* greeting */}
      <div>
        <div className="font-condensed font-bold uppercase tracking-[0.08em] text-[11px] text-muted">
          {greeting()}
        </div>
        <div className="font-display font-bold uppercase text-cream text-2xl mt-0.5" style={{ lineHeight: 0.9 }}>
          {parentFirst ? `Khun ${parentFirst}` : `${child.name}’s parent`}
        </div>
      </div>

      <NoticesStrip notices={notices} />

      {/* hero player card */}
      <div className="relative h-[226px] rounded-2xl overflow-hidden border border-white/[0.06]"
           style={{ background: 'linear-gradient(165deg,#13233d,#070f1e)' }}>
        {child.photoURL ? (
          <img src={child.photoURL} alt={child.name}
               className="absolute inset-0 w-full h-full object-cover"
               style={{ objectPosition: '50% 12%' }} />
        ) : (
          <div className="absolute right-[-6px] bottom-[-34px] font-display text-[200px] leading-[0.7]"
               style={{ color: 'rgba(245,240,232,.05)' }}>
            {child.jerseyNumber || '#'}
          </div>
        )}
        <div className="absolute inset-0"
             style={{ background: 'linear-gradient(to top,#070f1e 6%,rgba(7,15,30,.35) 55%,transparent)' }} />
        <div className="absolute top-3.5 left-3.5 inline-flex h-[60px] w-[60px] items-center justify-center rounded-full bg-gold text-navy font-display text-[30px]"
             style={{ boxShadow: '0 0 26px rgba(241,184,19,.55)' }}>
          {ovr}
        </div>
        <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
          <button
            type="button"
            onClick={handleHype}
            disabled={shareCardState.busy}
            aria-label="Hype card — special edition"
            title="Hype card"
            className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-pill bg-navy/55 backdrop-blur-sm border border-gold/30 text-cream transition-all duration-fast ease-out-soft active:scale-[0.94] disabled:opacity-70"
          >
            <Sparkles size={13} strokeWidth={2.25} />
            <span className="font-condensed font-bold uppercase tracking-[0.1em] text-[10px]">Hype</span>
          </button>
          <button
            type="button"
            onClick={handleShare}
            disabled={shareCardState.busy}
            aria-label="Share or download player card"
            className="inline-flex items-center gap-1.5 px-2.5 h-9 rounded-pill bg-navy/55 backdrop-blur-sm border border-gold/40 text-gold transition-all duration-fast ease-out-soft active:scale-[0.94] disabled:opacity-70"
          >
            {shareCardState.done
              ? <Check size={14} strokeWidth={3} />
              : <Share2 size={14} strokeWidth={2.25} />}
            <span className="font-condensed font-bold uppercase tracking-[0.1em] text-[10px]">
              {shareCardState.busy ? '…' : shareCardState.done ? shareCardState.doneLabel : 'Share'}
            </span>
          </button>
        </div>
        {delta > 0 && (
          <span className="absolute top-[58px] right-3.5 font-condensed font-bold uppercase tracking-[0.08em] text-[10px] px-2.5 py-1 rounded-pill border border-emerald-400/50 text-emerald-400 bg-emerald-400/10">
            ▲ +{delta} this term
          </span>
        )}
        <div className="absolute left-4 right-4 bottom-3.5">
          <div className="font-display font-bold uppercase text-cream text-[30px]" style={{ lineHeight: 0.84 }}>
            {child.name}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            <span className="font-condensed font-bold uppercase tracking-[0.1em] text-[11px] text-red-400">
              {child.position}
            </span>
            <span className="font-condensed font-bold uppercase tracking-[0.05em] text-[11px] text-muted">
              {child.ageGroup}{child.jerseyNumber ? ` · #${child.jerseyNumber}` : ''}
            </span>
          </div>
        </div>
      </div>

      <CoachNote child={child} />

      {/* progress mini */}
      <button
        type="button"
        onClick={() => go('progress')}
        className="flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-left transition-all duration-fast ease-out-soft active:scale-[0.985] hover:border-white/[0.12]"
      >
        <div>
          <div className="font-condensed font-bold uppercase tracking-[0.12em] text-[9.5px] text-muted">Overall</div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-display font-bold text-gold text-[38px] leading-[0.7]">{ovr || '—'}</span>
            {delta !== 0 && (
              <span className={`font-display font-bold text-sm ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {delta > 0 ? '▲' : '▼'}{Math.abs(delta)}
              </span>
            )}
          </div>
          <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[9px] text-muted mt-1">
            Since enrolled
          </div>
        </div>
        <Sparkline values={ovrSeries(child.id, evaluations)} />
        <ChevronRight size={16} className="text-gold" />
      </button>

      <PhotosTeaser child={child} onSeeAll={() => go('photos')} />
    </div>
  )
}

function NoticesStrip({ notices }) {
  const recent = notices?.slice(0, 2) ?? []
  if (!recent.length) return null
  return (
    <div className="flex flex-col gap-1.5">
      {recent.map(n => (
        <div key={n.id} className="flex items-start gap-2.5 px-3 py-2 rounded-xl bg-gold/[0.08] border border-gold/30">
          <Megaphone size={14} className="text-gold mt-0.5 flex-none" />
          <div className="flex-1 min-w-0">
            <div className="font-body text-[13px] text-cream leading-snug">{n.message}</div>
            <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[9px] text-muted mt-0.5">
              {formatShortDate(n.date)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CoachNote({ child }) {
  if (!child.coachNote) return null
  return (
    <div className="flex gap-3 px-3.5 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
      <div className="w-9 h-9 rounded-full flex-none flex items-center justify-center border-2 border-gold bg-navy-soft"
           style={{ boxShadow: '0 0 18px rgba(241,184,19,.35)' }}>
        <span className="font-display text-gold text-sm">CR</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-condensed font-bold uppercase tracking-[0.1em] text-[9.5px] text-gold">
          Coach Rachapol{child.coachNoteAt ? ` · ${formatShortDate(child.coachNoteAt)}` : ''}
        </div>
        <div className="font-body italic text-[13.5px] text-cream/90 mt-1 leading-snug">
          "{child.coachNote}"
        </div>
      </div>
    </div>
  )
}

// Single source of truth for parent-visible photos. Until a real media model
// + per-player photo collection exist, this returns []. PhotosTeaser (Home)
// and ParentPhotos (Photos tab) both read from here so they never disagree.
function usePlayerPhotos(_childId) {
  return useMemo(() => [], [_childId])
}

function PhotosTeaser({ child, onSeeAll }) {
  const photos = usePlayerPhotos(child.id)
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-condensed font-bold uppercase tracking-[0.14em] text-[10.5px] text-muted">
          Photos & highlights
        </div>
        <button
          type="button"
          onClick={onSeeAll}
          className="font-condensed font-bold uppercase tracking-[0.08em] text-[10px] text-gold transition-opacity duration-fast active:opacity-60"
        >
          See all ›
        </button>
      </div>
      {photos.length === 0 ? (
        <button
          type="button"
          onClick={onSeeAll}
          className="w-full rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-4 py-5 flex items-center gap-3 text-left transition-all duration-fast active:scale-[0.99] hover:border-white/[0.18]"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-gold/12 border border-gold/30 flex-none">
            <ImageOff size={16} className="text-gold" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold uppercase text-cream text-base leading-tight">No photos yet</div>
            <div className="font-condensed font-bold uppercase tracking-[0.08em] text-[10px] text-muted mt-1">
              {CLUB.coachName} will post highlights here
            </div>
          </div>
          <ChevronRight size={16} className="text-faint flex-none" />
        </button>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.slice(0, 3).map(p => (
            <div key={p.id} className="relative aspect-square rounded-xl overflow-hidden border border-white/[0.06]">
              <img src={p.url} alt={p.caption || ''} className="w-full h-full object-cover" />
              {p.caption && (
                <div className="absolute inset-x-0 bottom-0 px-2 py-1.5 font-condensed font-bold uppercase tracking-[0.06em] text-[9px] text-cream"
                     style={{ background: 'linear-gradient(to top,rgba(7,15,30,.85),transparent)' }}>
                  {p.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Sparkline({ values }) {
  if (!values.length) return <div className="flex-1 h-[46px]" />
  const min = Math.min(...values), max = Math.max(...values)
  const range = Math.max(1, max - min)
  const pts = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * 146 + 2
    const y = 44 - ((v - min) / range) * 36
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const last = pts.split(' ').slice(-1)[0].split(',')
  return (
    <svg viewBox="0 0 150 48" preserveAspectRatio="none" className="flex-1 h-[46px]">
      <polyline points={pts} fill="none" stroke="var(--gold)" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill="var(--cream)" />
    </svg>
  )
}

function ovrSeries(playerId, evaluations) {
  return evaluations
    .filter(e => e.playerId === playerId)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map(e => skillsToOvr(e.skills))
}

// ── PARENT · PROGRESS ─────────────────────────────────────────────────────────

export function ParentProgress({ onTabSwitch }) {
  const { evaluations, sessions, child } = useParent()
  const shareCardState = useShareCardState()
  if (!child) return <EmptyState message="No child selected." />
  const back = () => onTabSwitch && onTabSwitch('home')
  const handleDownload = () => shareCardState.run(child, evaluations, sessions)
  const handleHype     = () => shareCardState.run(child, evaluations, sessions, 'special')

  const series = ovrSeries(child.id, evaluations)
  const latest = latestEval(child.id, evaluations)
  const ovr    = latest ? skillsToOvr(latest.skills) : 0
  const delta  = ovrDelta(child.id, evaluations)
  const enrolled = series[0] ?? ovr
  const skillDelta = skillDeltas(child.id, evaluations)
  const mostImproved = skillDelta.find(s => s.delta > 0) || skillDelta[0]
  const evalCount = evaluations.filter(e => e.playerId === child.id).length

  if (evalCount === 0) {
    return (
      <div className="px-4 md:px-6 pt-3 pb-6">
        <Heading kicker={`${child.name.split(' ')[0]}'s`} title="Progress" onBack={back} />
        <div className="mt-6 px-5 py-12 rounded-2xl border border-dashed border-white/10 text-center">
          <div className="font-condensed font-bold uppercase tracking-[0.18em] text-[10.5px] text-muted">
            No evaluations yet
          </div>
          <div className="font-body text-sm text-muted mt-2">
            Your coach will log {child.name.split(' ')[0]}'s first evaluation soon.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-6 pt-3 pb-6 flex flex-col gap-3.5">
      <div className="flex items-center justify-between gap-3">
        <Heading kicker={`${child.name.split(' ')[0]}'s`} title="Progress" onBack={back} />
        {ovr > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleHype}
              disabled={shareCardState.busy}
              aria-label="Hype card — special edition"
              title="Hype card"
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-pill border border-gold/30 text-cream transition-all duration-fast ease-out-soft active:scale-[0.96] disabled:opacity-70"
            >
              <Sparkles size={13} strokeWidth={2.25} />
              <span className="font-condensed font-bold uppercase tracking-[0.1em] text-[10px]">Hype</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={shareCardState.busy}
              aria-label="Download player card image"
              className="inline-flex items-center gap-1.5 px-3 h-9 rounded-pill border border-gold/40 text-gold transition-all duration-fast ease-out-soft active:scale-[0.96] disabled:opacity-70"
            >
              {shareCardState.done
                ? <Check size={13} strokeWidth={3} />
                : <Download size={13} strokeWidth={2.25} />}
              <span className="font-condensed font-bold uppercase tracking-[0.1em] text-[10px]">
                {shareCardState.busy ? '…' : shareCardState.done ? shareCardState.doneLabel : 'Card'}
              </span>
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4">
        <div className="flex items-end justify-between">
          <div>
            <div className="font-condensed font-bold uppercase tracking-[0.12em] text-[10px] text-muted">Overall rating</div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="font-display font-bold text-gold text-[52px] leading-[0.7]">{ovr || '—'}</span>
              {evalCount > 1 && delta !== 0 && (
                <span className={`font-display font-bold text-lg ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {delta > 0 ? '▲' : '▼'} {Math.abs(delta)}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-condensed font-bold uppercase tracking-[0.08em] text-[9px] text-muted">OVR at start</div>
            <div className="font-display font-bold text-faint text-lg">{enrolled}</div>
          </div>
        </div>
        <BigSparkline values={series} />
        <div className="flex items-start gap-1.5 mt-2 font-body text-[11.5px] text-muted leading-snug">
          <Info size={11} className="mt-px flex-none text-faint" />
          <span>
            OVR is a 0–99 scale (avg of seven skills × 10). Deltas like <span className="text-emerald-400">▲6</span> show change since {child.name.split(' ')[0]}'s first evaluation.
          </span>
        </div>
        {evalCount === 1 && (
          <div className="font-condensed font-bold uppercase tracking-[0.1em] text-[9.5px] text-muted mt-2 text-center">
            Just one evaluation logged — trend will appear after the next one.
          </div>
        )}
      </div>

      {latest && (
        <div className="flex gap-2 items-center rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3">
          <RadarChart skills={latest.skills} size={156} showLabels />
          <div className="flex-1 min-w-0">
            <div className="font-condensed font-bold uppercase tracking-[0.12em] text-[10px] text-gold">Skill shape</div>
            <div className="font-body text-[12.5px] text-muted mt-1.5 leading-snug">
              {skillShapeBlurb(latest.skills)}
            </div>
          </div>
        </div>
      )}

      {evalCount > 1 && skillDelta.length > 0 && (
        <div>
          <div className="font-condensed font-bold uppercase tracking-[0.14em] text-[10.5px] text-muted mb-2.5">
            Growth since enrolled
          </div>
          <div className="flex flex-col gap-3">
            {skillDelta.slice(0, 4).map(s => (
              <div key={s.key} className="flex items-center gap-2.5">
                <div className="flex-1">
                  <StatBar label={SKILL_LABELS[s.key]} value={s.current} variant="vertical" compact />
                </div>
                <span className={`flex-none w-8 text-right font-condensed font-bold text-xs ${s.delta > 0 ? 'text-emerald-400' : s.delta < 0 ? 'text-red-400' : 'text-faint'}`}>
                  {s.delta > 0 ? `+${s.delta}` : s.delta < 0 ? s.delta : '•'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {evalCount > 1 && mostImproved && mostImproved.delta > 0 && (
        <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl border border-emerald-400/40 bg-emerald-400/10">
          <TrendingUp size={22} className="text-emerald-400" />
          <div>
            <div className="font-display font-bold uppercase text-cream text-base leading-tight">
              Most improved · {SKILL_LABELS[mostImproved.key]}
            </div>
            <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted mt-0.5">
              Up {mostImproved.delta} {mostImproved.delta === 1 ? 'point' : 'points'} since enrolled
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function skillShapeBlurb(skills) {
  if (!skills) return 'Track strengths and the next focus area at a glance.'
  const entries = SKILL_ORDER
    .map(k => ({ k, v: skills[k] ?? 0 }))
    .sort((a, b) => b.v - a.v)
  const top = entries[0]
  const bottom = entries[entries.length - 1]
  if (top.v === bottom.v) return 'Balanced skill profile — even shape across the board.'
  return `${SKILL_LABELS[top.k]} leads. ${SKILL_LABELS[bottom.k]} is the next focus.`
}

function skillDeltas(playerId, evaluations) {
  const evals = evaluations
    .filter(e => e.playerId === playerId)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
  if (!evals.length) return []
  const latest = evals[evals.length - 1]
  const first  = evals[0]
  return SKILL_ORDER.map(k => ({
    key: k,
    current: latest.skills?.[k] ?? 0,
    delta: (latest.skills?.[k] ?? 0) - (first.skills?.[k] ?? 0),
  }))
}

function BigSparkline({ values }) {
  if (!values.length) {
    return <div className="w-full h-[84px] mt-2" />
  }
  if (values.length === 1) {
    return (
      <svg viewBox="0 0 320 86" preserveAspectRatio="none" className="w-full h-[84px] mt-2">
        <line x1="0" y1="44" x2="320" y2="44" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="160" cy="44" r="5" fill="var(--gold)" />
      </svg>
    )
  }
  const min = Math.min(...values), max = Math.max(...values)
  const range = Math.max(1, max - min)
  const pts = values.map((v, i) => {
    const x = (i / Math.max(1, values.length - 1)) * 312 + 4
    const y = 78 - ((v - min) / range) * 68
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const last = pts.split(' ').slice(-1)[0].split(',')
  return (
    <svg viewBox="0 0 320 86" preserveAspectRatio="none" className="w-full h-[84px] mt-2">
      <line x1="0" y1="82" x2="320" y2="82" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <line x1="0" y1="44" x2="320" y2="44" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 5" />
      <polyline points={pts} fill="none" stroke="var(--gold)" strokeWidth="3"
                strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="4.5" fill="var(--cream)" />
    </svg>
  )
}

// ── PARENT · PHOTOS ───────────────────────────────────────────────────────────

export function ParentPhotos({ onTabSwitch }) {
  const { child } = useParent()
  const photos = usePlayerPhotos(child?.id)

  if (!child) return <EmptyState message="No child selected." />

  return (
    <div className="px-4 md:px-6 pt-3 pb-6 flex flex-col gap-3.5">
      <Heading
        kicker={`${child.name.split(' ')[0]}'s`}
        title="Photos"
        onBack={onTabSwitch ? () => onTabSwitch('home') : undefined}
      />

      {photos.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-12 flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gold/15 border border-gold/30">
            <ImageOff size={20} className="text-gold" />
          </div>
          <div>
            <div className="font-display font-bold uppercase text-cream text-xl" style={{ lineHeight: 0.9 }}>
              No photos yet
            </div>
            <div className="font-body text-[13px] text-muted mt-2 leading-snug max-w-[260px]">
              {CLUB.coachName} will share match-day and training highlights here as the term unfolds.
            </div>
          </div>
          <div className="font-condensed font-bold uppercase tracking-[0.12em] text-[10px] text-faint mt-1">
            {child.ageGroup} · {child.name.split(' ')[0]}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {photos.map(p => (
            <figure key={p.id} className="flex flex-col gap-1.5">
              <div className="aspect-square rounded-xl overflow-hidden border border-white/[0.06]">
                <img src={p.url} alt={p.caption || ''} className="w-full h-full object-cover" />
              </div>
              {(p.caption || p.date) && (
                <figcaption className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted leading-snug">
                  {p.caption}{p.caption && p.date ? ' · ' : ''}{p.date ? formatShortDate(p.date) : ''}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </div>
  )
}

// ── PARENT · MORE ─────────────────────────────────────────────────────────────

// Single classifier shared by the schedule list and the attendance modal so
// "MISSED" and "Upcoming" can never disagree for the same session.
// A session is only "missed" when the coach has recorded attendance (the
// session has an attendanceIds field) and the child wasn't on the list.
// Past sessions without recorded attendance are "pending" — not yet judged.
function sessionStatus(session, childId, todayIso) {
  if (!session) return 'upcoming'
  if (session.date > todayIso) return 'upcoming'
  const recorded = Array.isArray(session.attendanceIds)
  if (!recorded) return 'pending'
  return session.attendanceIds.includes(childId) ? 'attended' : 'missed'
}

export function ParentMore({ onSwitchRole }) {
  const { sessions, child, linkedPlayers, clearCodes } = useParent()
  const [sheet, setSheet] = useState(null) // 'pay' | 'attendance' | 'children' | null

  const today = new Date().toISOString().split('T')[0]

  const weekSessions = useMemo(() => {
    const now = new Date()
    const day = now.getDay()
    const diffToMon = (day === 0 ? -6 : 1 - day)
    const mon = new Date(now); mon.setDate(now.getDate() + diffToMon); mon.setHours(0,0,0,0)
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23,59,59,999)
    return sessions
      .filter(s => {
        const d = new Date(s.date + 'T00:00:00')
        return d >= mon && d <= sun && (!child || s.ageGroup === child.ageGroup)
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }, [sessions, child])

  const nextUpcoming = weekSessions.find(s => s.date >= today)
  const hasWeekSessions = weekSessions.length > 0

  return (
    <div className="px-4 md:px-6 pt-3 pb-6 flex flex-col gap-3.5">
      <div className="font-display font-bold uppercase text-cream text-[30px]" style={{ lineHeight: 0.85 }}>
        Schedule & more
      </div>

      <div className="rounded-2xl p-4 border border-gold/30"
           style={{ background: 'linear-gradient(160deg,#16284a,#0a1322)' }}>
        {hasWeekSessions && nextUpcoming ? (
          <>
            <div className="font-condensed font-bold uppercase tracking-[0.14em] text-[10px] text-gold">
              Next session · {formatDay(nextUpcoming.date)}
            </div>
            <div className="font-display font-bold uppercase text-cream text-2xl mt-1.5" style={{ lineHeight: 0.9 }}>
              {nextUpcoming.title || `${nextUpcoming.ageGroup} Training`}
            </div>
            <div className="font-condensed font-bold uppercase tracking-[0.05em] text-[11px] text-muted mt-1">
              {nextUpcoming.location || 'Main pitch'} · {nextUpcoming.time || '5:00 PM'} · {CLUB.coachName}
            </div>
          </>
        ) : hasWeekSessions ? (
          <>
            <div className="font-condensed font-bold uppercase tracking-[0.14em] text-[10px] text-gold">
              Week complete
            </div>
            <div className="font-display font-bold uppercase text-cream text-2xl mt-1.5" style={{ lineHeight: 0.9 }}>
              All this week's sessions done
            </div>
            <div className="font-condensed font-bold uppercase tracking-[0.05em] text-[11px] text-muted mt-1">
              Next week's schedule appears Monday
            </div>
          </>
        ) : (
          <>
            <div className="font-condensed font-bold uppercase tracking-[0.14em] text-[10px] text-gold">
              No sessions this week
            </div>
            <div className="font-display font-bold uppercase text-cream text-2xl mt-1.5" style={{ lineHeight: 0.9 }}>
              Check back soon
            </div>
            <div className="font-condensed font-bold uppercase tracking-[0.05em] text-[11px] text-muted mt-1">
              {CLUB.coachName} will post the next week's plan
            </div>
          </>
        )}
      </div>

      {hasWeekSessions && (
        <div>
          <div className="font-condensed font-bold uppercase tracking-[0.14em] text-[10.5px] text-muted mb-2">
            This week
          </div>
          <div className="flex flex-col gap-1.5">
            {weekSessions.map(s => {
              const isToday = s.date === today
              const isMatch = s.type === 'match' || /vs/i.test(s.title || '')
              const status  = child ? sessionStatus(s, child.id, today) : 'upcoming'
              return (
                <div key={s.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="w-10 text-center flex-none">
                    <div className={`font-display font-bold text-lg leading-[0.8] ${isToday ? 'text-gold' : 'text-muted'}`}>
                      {dayName(s.date)}
                    </div>
                    <div className="font-condensed font-bold text-[10px] text-muted">
                      {new Date(s.date).getDate()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-body text-sm text-cream truncate">{s.title || `${s.ageGroup} Training`}</div>
                    <div className="font-condensed font-bold uppercase tracking-[0.05em] text-[10px] text-muted mt-0.5">
                      {s.time || '5:00 PM'} · {s.location || 'Main pitch'}
                    </div>
                  </div>
                  <StatusPill isToday={isToday} isMatch={isMatch} status={status} />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2.5 px-4 py-3.5 rounded-2xl border border-gold/35 bg-gold/[0.07]">
        <div className="flex items-center gap-3.5">
          <div className="flex-1">
            <div className="font-condensed font-bold uppercase tracking-[0.12em] text-[10px] text-gold">Term fee due</div>
            <div className="font-display font-bold text-cream text-2xl mt-1" style={{ lineHeight: 0.85 }}>
              {CLUB.termFeeCurrency}{CLUB.termFee.toLocaleString()}
            </div>
            <div className="font-condensed font-bold uppercase tracking-[0.05em] text-[10px] text-muted mt-1">
              PromptPay · {CLUB.termDueLabel}
            </div>
          </div>
          <Button variant="primary" size="md" onClick={() => setSheet('pay')}>Pay now</Button>
        </div>
        <div className="flex items-start gap-1.5 font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted/90 leading-snug">
          <Info size={11} className="mt-px flex-none" />
          <span>Shows PromptPay details — pay in your bank app. No charge happens inside TFA.</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <QuickLink
          Icon={MessageCircle}
          label="Chat on LINE ↗"
          ariaLabel={`Open LINE chat with ${CLUB.coachName} (external)`}
          onClick={openCoachMessage}
        />
        <QuickLink
          Icon={CheckSquare}
          label="Attendance"
          onClick={() => setSheet('attendance')}
        />
      </div>

      <button
        type="button"
        onClick={() => setSheet('children')}
        className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left transition-all duration-fast ease-out-soft active:scale-[0.99] hover:border-white/[0.12]"
      >
        <Users size={18} className="text-gold flex-none" />
        <div className="flex-1 min-w-0">
          <div className="font-condensed font-bold uppercase tracking-[0.06em] text-xs text-cream">
            Manage children
          </div>
          <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted mt-0.5">
            {linkedPlayers.length} linked · add or unlink
          </div>
        </div>
        <ChevronRight size={14} className="text-faint flex-none" />
      </button>

      <button
        type="button"
        onClick={() => { clearCodes(); onSwitchRole && onSwitchRole() }}
        className="mt-2 w-full px-4 h-11 rounded-md border border-white/[0.1] text-muted font-condensed font-bold uppercase tracking-[0.14em] text-xs"
      >
        Sign out
      </button>

      {sheet === 'pay'        && <PromptPaySheet onClose={() => setSheet(null)} />}
      {sheet === 'attendance' && <AttendanceSheet onClose={() => setSheet(null)} sessions={sessions} child={child} />}
      {sheet === 'children'   && (
        <Modal title="Linked children" onClose={() => setSheet(null)}>
          <ParentLink embedded />
        </Modal>
      )}
    </div>
  )
}

function openCoachMessage() {
  // line:// scheme deep-links into the LINE app on mobile; web URL fallback
  // is taken when the scheme is unavailable.
  window.open(CLUB.lineUrl, '_blank', 'noopener,noreferrer')
}

function StatusPill({ isToday, isMatch, status }) {
  if (isToday) {
    return (
      <span className="font-condensed font-bold uppercase tracking-[0.08em] text-[9px] text-gold border border-gold rounded-pill px-2 py-0.5">
        Today
      </span>
    )
  }
  if (status === 'attended') {
    return (
      <span className="font-condensed font-bold uppercase tracking-[0.08em] text-[9px] text-emerald-400 border border-emerald-400/50 rounded-pill px-2 py-0.5">
        Here
      </span>
    )
  }
  if (status === 'missed') {
    return (
      <span className="font-condensed font-bold uppercase tracking-[0.08em] text-[9px] text-red-400 border border-red-400/50 rounded-pill px-2 py-0.5">
        Missed
      </span>
    )
  }
  if (status === 'pending') {
    return (
      <span className="font-condensed font-bold uppercase tracking-[0.08em] text-[9px] text-faint border border-white/[0.15] rounded-pill px-2 py-0.5">
        Pending
      </span>
    )
  }
  if (isMatch) {
    return (
      <span className="font-condensed font-bold uppercase tracking-[0.08em] text-[9px] text-red-400 border border-red-400/50 rounded-pill px-2 py-0.5">
        Match
      </span>
    )
  }
  return (
    <span className="font-condensed font-bold uppercase tracking-[0.08em] text-[9px] text-muted border border-white/[0.15] rounded-pill px-2 py-0.5">
      Upcoming
    </span>
  )
}

function QuickLink({ Icon, label, onClick, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      className="flex items-center gap-2.5 px-3 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-left transition-all duration-fast ease-out-soft active:scale-[0.97] hover:border-white/[0.12]"
    >
      <Icon size={18} className="text-gold" />
      <span className="font-condensed font-bold uppercase tracking-[0.04em] text-xs text-cream truncate">{label}</span>
    </button>
  )
}

function PromptPaySheet({ onClose }) {
  const [copied, setCopied] = useState(null) // 'phone' | 'amount' | null

  async function copy(value, key) {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(key)
      setTimeout(() => setCopied(null), 1600)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <Modal title="Pay term fee" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="rounded-xl p-4 border border-gold/30 bg-gold/[0.07]">
          <div className="font-condensed font-bold uppercase tracking-[0.12em] text-[10px] text-gold">Amount</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display font-bold text-cream text-[36px] leading-[0.7]">
              {CLUB.termFeeCurrency}{CLUB.termFee.toLocaleString()}
            </span>
            <span className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted">
              {CLUB.termDueLabel}
            </span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 divide-y divide-white/[0.06]">
          <CopyRow
            label="PromptPay"
            value={CLUB.promptPay.phone}
            copied={copied === 'phone'}
            onCopy={() => copy(CLUB.promptPay.phone, 'phone')}
          />
          <CopyRow
            label="Account name"
            value={CLUB.promptPay.accountName}
            copied={false}
          />
          <CopyRow
            label="Amount"
            value={`${CLUB.termFee}`}
            copied={copied === 'amount'}
            onCopy={() => copy(`${CLUB.termFee}`, 'amount')}
            mono
          />
        </div>

        <div className="font-body text-[12.5px] text-muted leading-snug">
          Open your bank app, pay via PromptPay using the phone number above, and {CLUB.coachName} will confirm receipt shortly.
        </div>

        <Button variant="primary" size="md" onClick={onClose}>Done</Button>
      </div>
    </Modal>
  )
}

function CopyRow({ label, value, copied, onCopy, mono }) {
  return (
    <div className="flex items-center gap-3 px-3.5 py-3">
      <div className="flex-1 min-w-0">
        <div className="font-condensed font-bold uppercase tracking-[0.1em] text-[9.5px] text-muted">{label}</div>
        <div className={`text-cream mt-0.5 truncate ${mono ? 'font-display text-lg' : 'font-body text-sm'}`}>{value}</div>
      </div>
      {onCopy && (
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 px-2.5 h-8 rounded-md border border-gold/40 text-gold font-condensed font-bold uppercase tracking-[0.1em] text-[10px] transition-all duration-fast active:scale-[0.96]"
        >
          {copied ? <><Check size={12} strokeWidth={3} /> Copied</> : <><Copy size={12} /> Copy</>}
        </button>
      )}
    </div>
  )
}

function AttendanceSheet({ onClose, sessions, child }) {
  const { attended, missed, pending, upcoming, recent } = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    const childAge = child?.ageGroup
    const scoped = sessions.filter(s => !childAge || s.ageGroup === childAge)
    let attended = 0, missed = 0, pending = 0, upcoming = 0
    for (const s of scoped) {
      switch (sessionStatus(s, child.id, today)) {
        case 'attended': attended += 1; break
        case 'missed':   missed   += 1; break
        case 'pending':  pending  += 1; break
        case 'upcoming': upcoming += 1; break
      }
    }
    const recent = [...scoped]
      .filter(s => s.date <= today)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 6)
    return { attended, missed, pending, upcoming, recent }
  }, [sessions, child])

  // Rate is based on RECORDED sessions only — pending sessions don't count
  // against the child until the coach logs attendance.
  const recordedCount = attended + missed
  const rate = recordedCount ? Math.round((attended / recordedCount) * 100) : null
  const today = new Date().toISOString().split('T')[0]

  return (
    <Modal title={`${child.name.split(' ')[0]}'s attendance`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="rounded-xl p-4 border border-white/10 bg-white/[0.03]">
          <div className="font-condensed font-bold uppercase tracking-[0.12em] text-[10px] text-muted">Attendance rate</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display font-bold text-gold text-[42px] leading-[0.7]">
              {rate !== null ? `${rate}%` : '—'}
            </span>
            <span className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted">
              {recordedCount > 0
                ? `${attended} of ${recordedCount} recorded`
                : 'No recorded sessions yet'}
            </span>
          </div>
          <div className="flex items-start gap-1.5 mt-2 font-body text-[12px] text-muted leading-snug">
            <Info size={12} className="mt-0.5 flex-none text-faint" />
            <span>
              {recordedCount === 0 && upcoming > 0
                ? `Counting starts once ${CLUB.coachName} records the first session — ${upcoming} upcoming this term.`
                : recordedCount === 0
                  ? 'Counting starts once your coach records the first session.'
                  : 'Pending sessions aren’t counted until your coach logs attendance.'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          <MiniStat label="Attended" value={attended} tone="success" />
          <MiniStat label="Missed"   value={missed}   tone="danger" />
          <MiniStat label="Pending"  value={pending}  tone="muted" />
          <MiniStat label="Upcoming" value={upcoming} tone="gold" />
        </div>

        {recent.length > 0 && (
          <div>
            <div className="font-condensed font-bold uppercase tracking-[0.12em] text-[10px] text-muted mb-2">
              Recent sessions
            </div>
            <div className="flex flex-col gap-1.5">
              {recent.map(s => {
                const st = sessionStatus(s, child.id, today)
                const tone = st === 'attended' ? 'text-emerald-400'
                           : st === 'missed'   ? 'text-red-400'
                           :                     'text-faint'
                const label = st === 'attended' ? 'Here'
                            : st === 'missed'   ? 'Missed'
                            :                     'Pending'
                return (
                  <div key={s.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex-1 min-w-0">
                      <div className="font-body text-[13px] text-cream truncate">{s.title || `${s.ageGroup} Training`}</div>
                      <div className="font-condensed font-bold uppercase tracking-[0.06em] text-[10px] text-muted">{s.date}</div>
                    </div>
                    <span className={`font-condensed font-bold uppercase tracking-[0.08em] text-[10px] ${tone}`}>
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}

function MiniStat({ label, value, tone }) {
  const color = tone === 'success' ? 'text-emerald-400'
              : tone === 'danger'  ? 'text-red-400'
              : tone === 'gold'    ? 'text-gold'
              :                       'text-cream'
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
      <div className="font-condensed font-bold uppercase tracking-[0.1em] text-[9.5px] text-muted">{label}</div>
      <div className={`font-display font-bold text-2xl mt-1 leading-[0.8] ${color}`}>{value}</div>
    </div>
  )
}

// ── shared ────────────────────────────────────────────────────────────────────

function Heading({ kicker, title, onBack }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onBack}
        disabled={!onBack}
        aria-label="Back"
        className="w-8 h-8 rounded-full flex items-center justify-center border border-white/[0.1] bg-white/[0.03] text-cream transition-all duration-fast ease-out-soft active:scale-[0.92] hover:border-white/[0.2] disabled:opacity-50 disabled:cursor-default"
      >
        <ChevronLeft size={16} strokeWidth={2.25} />
      </button>
      <div>
        <div className="font-condensed font-bold uppercase tracking-[0.1em] text-[10px] text-muted">{kicker}</div>
        <div className="font-display font-bold uppercase text-cream text-[26px]" style={{ lineHeight: 0.85 }}>
          {title}
        </div>
      </div>
    </div>
  )
}

function EmptyState({ message }) {
  return (
    <div className="px-6 py-16 text-center font-condensed text-sm text-muted">
      {message}
    </div>
  )
}

const DAY_NAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT']
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function dayName(iso) {
  return DAY_NAMES[new Date(iso + 'T00:00:00').getDay()]
}

function formatDay(iso) {
  const d = new Date(iso + 'T00:00:00')
  const today = new Date(); today.setHours(0,0,0,0)
  if (d.getTime() === today.getTime()) return 'today 5:00 PM'
  return `${dayName(iso)} ${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`
}

function formatShortDate(iso) {
  if (!iso) return ''
  const d = new Date(iso + (iso.length === 10 ? 'T00:00:00' : ''))
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`
}
