/**
 * TFA ratings layer — pure derivations over `players` + `evaluations`.
 *
 * Locked product decisions (per design handoff README):
 *   • OVR = round(averageSkill × 10), capped at 99. A skill of 1 → 10.
 *   • Seven canonical skills; SKILL_ORDER is the authoritative axis order
 *     for the RadarChart and any iteration over a player's skills.
 *   • "Evals due" = player has either no evaluation or a latest eval older
 *     than EVAL_STALE_DAYS (default 180 ~ 6 months).
 */

// ── Canonical skill schema ────────────────────────────────────────────────────

export const SKILL_ORDER = [
  'ballMastery',
  'dribbling',
  'passing',
  'shooting',
  'pace',
  'positioning',
  'attitude',
]

export const SKILL_LABELS = {
  ballMastery: 'Ball Mastery',
  dribbling:   'Dribbling',
  passing:     'Passing',
  shooting:    'Shooting',
  pace:        'Pace',
  positioning: 'Positioning',
  attitude:    'Attitude',
}

export const EVAL_STALE_DAYS = 180

// ── Per-skills derivations ────────────────────────────────────────────────────

/**
 * Average of all numeric skill values. Returns 0 if the skills object is empty
 * or missing.
 */
export function avgSkills(skills) {
  if (!skills) return 0
  const vals = Object.values(skills).filter(v => typeof v === 'number')
  if (!vals.length) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

/**
 * Skills → 0–99 OVR. `avg × 10`, capped at 99, floored at 1 when any skills exist.
 */
export function skillsToOvr(skills) {
  if (!skills) return 0
  const vals = Object.values(skills).filter(v => typeof v === 'number')
  if (!vals.length) return 0
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length
  return Math.max(1, Math.min(99, Math.round(avg * 10)))
}

/**
 * Highest-rated `n` skills, formatted for StatBar rendering.
 * Returns [{ key, label, value }, …]
 */
export function topSkills(skills, n = 3) {
  if (!skills) return []
  return Object.entries(skills)
    .filter(([, v]) => typeof v === 'number')
    .sort(([, a], [, b]) => b - a)
    .slice(0, n)
    .map(([k, v]) => ({ key: k, label: SKILL_LABELS[k] ?? k, value: v }))
}

// ── Per-player derivations ────────────────────────────────────────────────────

/**
 * All evaluations for a player. `dir` controls ordering:
 *   'asc'  → oldest first (default; for charts)
 *   'desc' → newest first (for "latest" / history lists)
 */
export function playerEvals(playerId, evaluations, dir = 'asc') {
  if (!evaluations) return []
  const list = evaluations.filter(e => e.playerId === playerId)
  list.sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
  if (dir === 'desc') list.reverse()
  return list
}

/**
 * Most recent evaluation for a player, or null if they have none.
 */
export function latestEval(playerId, evaluations) {
  const list = playerEvals(playerId, evaluations, 'desc')
  return list[0] ?? null
}

/**
 * Difference between the LAST TWO evaluations' OVR.
 * Use for the "▲ +4 since last eval" chip.
 */
export function ovrDelta(playerId, evaluations) {
  const list = playerEvals(playerId, evaluations, 'desc')
  if (list.length < 2) return 0
  return skillsToOvr(list[0].skills) - skillsToOvr(list[1].skills)
}

/**
 * Difference between the player's FIRST and LATEST evaluations' OVR.
 * Use for the "▲ +14 since Mar" trend chip on the Progress page.
 */
export function ovrSince(playerId, evaluations) {
  const list = playerEvals(playerId, evaluations, 'asc')
  if (list.length < 2) return 0
  return skillsToOvr(list[list.length - 1].skills) - skillsToOvr(list[0].skills)
}

/**
 * Time-series for the "OVR over time" area chart on Progress.
 * Returns [{ date, label, ovr }, …] oldest-first.
 * `label` is the short month name (Mar, Apr…) suitable for an x-axis tick.
 */
export function ovrTrend(playerId, evaluations) {
  return playerEvals(playerId, evaluations, 'asc').map(e => ({
    date: e.date,
    label: e.date ? new Date(e.date).toLocaleDateString('en-GB', { month: 'short' }) : '',
    ovr: skillsToOvr(e.skills),
  }))
}

/**
 * True if a player needs a new evaluation: no evaluations at all OR latest
 * is older than `thresholdDays` (default EVAL_STALE_DAYS).
 */
export function evalsDueFor(playerId, evaluations, thresholdDays = EVAL_STALE_DAYS) {
  const last = latestEval(playerId, evaluations)
  if (!last || !last.date) return true
  const ageDays = (Date.now() - new Date(last.date).getTime()) / 86_400_000
  return ageDays > thresholdDays
}

// ── Squad-level aggregates ────────────────────────────────────────────────────

/**
 * Summary tile numbers for a single age group (or 'All').
 * Returns { size, avgOvr, topOvr, evalsDue }.
 */
export function squadAverages(players, evaluations, ageGroup) {
  const filteredPlayers = players.filter(p =>
    p.active !== false && (ageGroup === 'All' || !ageGroup || p.ageGroup === ageGroup)
  )
  const size = filteredPlayers.length
  if (size === 0) return { size: 0, avgOvr: 0, topOvr: 0, evalsDue: 0 }

  let totalOvr = 0
  let topOvr = 0
  let evalsDue = 0
  let ratedCount = 0

  for (const p of filteredPlayers) {
    if (evalsDueFor(p.id, evaluations)) evalsDue++
    const last = latestEval(p.id, evaluations)
    if (!last) continue
    const ovr = skillsToOvr(last.skills)
    if (ovr > 0) {
      totalOvr += ovr
      ratedCount++
      if (ovr > topOvr) topOvr = ovr
    }
  }

  return {
    size,
    avgOvr: ratedCount > 0 ? Math.round(totalOvr / ratedCount) : 0,
    topOvr,
    evalsDue,
  }
}

// ── Color & display helpers ───────────────────────────────────────────────────

/**
 * Banded color for a 0–10 skill value (or any 0–10 number).
 * Returns a CSS variable for theming. Matches `--rating-*` tokens.
 *   0–3   red    (low)
 *   4–6   orange (mid)
 *   7–8   cyan   (high)
 *   9–10  gold   (elite)
 */
export function bandColor(value) {
  if (value <= 3) return 'var(--rating-low)'
  if (value <= 6) return 'var(--rating-mid)'
  if (value <= 8) return 'var(--rating-high)'
  return 'var(--rating-elite)'
}

/**
 * Banded color for a 0–99 OVR value, with the same intent as bandColor:
 *   <50 red, <70 orange, <85 cyan, ≥85 gold.
 * Used by ScoreBadge tone="rated".
 */
export function ovrBandColor(value) {
  if (value < 50) return 'var(--rating-low)'
  if (value < 70) return 'var(--rating-mid)'
  if (value < 85) return 'var(--rating-high)'
  return 'var(--rating-elite)'
}

/**
 * Pitch-position color (GK/DEF/MID/FWD). Returns a CSS variable.
 */
export function positionColor(position) {
  return {
    GK:  'var(--pos-gk)',
    DEF: 'var(--pos-def)',
    MID: 'var(--pos-mid)',
    FWD: 'var(--pos-fwd)',
  }[position] ?? 'var(--text-muted)'
}

/**
 * Date of birth (YYYY-MM-DD or any Date-parsable string) → age in whole years.
 * Returns null if `dob` is missing or unparseable.
 */
export function calcAge(dob) {
  if (!dob) return null
  const birth = new Date(dob)
  if (Number.isNaN(birth.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--
  return age
}

/**
 * "Somchai Prasert" → "SP". Up to two letters, uppercase.
 */
export function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}
