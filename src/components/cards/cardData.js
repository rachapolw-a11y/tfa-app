// Map app skills → 6 stats used by both new card designs.
// Order matches the design layout; labels are display-only.
export const CARD_STATS = [
  { key: 'pace',        label: 'Pace' },
  { key: 'passing',     label: 'Passing' },
  { key: 'dribbling',   label: 'Dribbling' },
  { key: 'shooting',    label: 'Shooting' },
  { key: 'positioning', label: 'Positioning' },
  { key: 'attitude',    label: 'Attitude' },
]

export function pickLatest(evaluations) {
  if (!evaluations || evaluations.length === 0) return null
  return [...evaluations].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
}

// All seven app skills feed into the OVR average, even though the cards
// only display six — keeps OVR aligned with the rest of the app.
export function computeOVR(latest) {
  if (!latest?.skills) return null
  const vals = Object.values(latest.skills)
  if (!vals.length) return null
  const sum = vals.reduce((a, b) => a + b, 0)
  return (sum / vals.length).toFixed(1)
}

export function statValues(latest) {
  return CARD_STATS.map(s => ({
    ...s,
    value: latest?.skills?.[s.key] ?? 0,
  }))
}
