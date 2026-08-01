import { HexAvatar } from './HexAvatar.jsx'
import { Badge } from './Badge.jsx'
import { ScoreBadge } from './ScoreBadge.jsx'
import { StatBar } from './StatBar.jsx'
import { RadarChart } from './RadarChart.jsx'
import { skillsToOvr, topSkills } from '../../lib/ratings'

/**
 * TFA PlayerCard — compact roster tile (matches the 5180 redesign).
 *
 * Layout:
 *   [HexAvatar]  Name (Tottenham 20px)              [ScoreBadge md]
 *                position badge + age · #jersey
 *   ─────────────────────────────────────────────
 *   Top-3 StatBars (vertical, compact)   |  RadarChart 100px (lg+ only)
 *
 * Props:
 *   player      — { id, name, position, ageGroup, jersey?, photoURL? }
 *   evaluation  — { skills } | null
 *   onClick     — click handler
 */
export function PlayerCard({ player, evaluation, onClick }) {
  const skills = evaluation?.skills
  const ovr = skills ? skillsToOvr(skills) : 0
  const top = skills ? topSkills(skills, 3) : []

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left w-full rounded-lg bg-navy-mid/85 border border-white/[0.06] shadow-card p-4 md:p-5 transition-all duration-200 ease-out-soft hover:-translate-y-[2px] hover:shadow-md hover:border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60"
    >
      {/* Identity row */}
      <div className="flex items-center gap-3">
        <HexAvatar
          name={player.name}
          photoURL={player.photoURL}
          size={50}
          height={56}
        />
        <div className="flex-1 min-w-0">
          <div
            className="font-display uppercase text-cream truncate"
            style={{ fontSize: 20, lineHeight: 1, letterSpacing: '-0.005em' }}
          >
            {player.name}
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <Badge kind="position" value={player.position} size="sm" />
            <span className="font-condensed font-bold uppercase text-[11px] tracking-[0.14em] text-muted">
              {player.ageGroup}{player.jersey ? ` · #${player.jersey}` : ''}
            </span>
          </div>
        </div>
        {skills ? <ScoreBadge value={ovr} tone="rated" size="md" /> : null}
      </div>

      {/* Divider + stats */}
      <div className="my-4 h-px bg-white/[0.06]" />

      {skills ? (
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0 space-y-2.5">
            {top.map((s) => (
              <StatBar
                key={s.key ?? s.label}
                label={s.label}
                value={s.value}
                variant="vertical"
                compact
              />
            ))}
          </div>
          {/* Radar appears only on desktop (≥lg) — per README spec */}
          <div className="hidden lg:block shrink-0">
            <RadarChart skills={skills} size={100} showLabels={false} />
          </div>
        </div>
      ) : (
        <div className="text-faint text-xs font-condensed uppercase tracking-[0.16em]">
          No evaluation yet
        </div>
      )}
    </button>
  )
}
