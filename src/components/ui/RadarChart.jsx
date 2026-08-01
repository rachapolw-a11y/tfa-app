/**
 * TFA RadarChart — 7-skill polygon (0–10), pure SVG. Matches the v2 redesign.
 *
 * Props:
 *   skills      — { ballMastery, dribbling, passing, shooting, pace, positioning, attitude }
 *   order       — array of skill keys (default: SKILL_ORDER from ratings.js)
 *   size        — px (default 220)
 *   max         — axis maximum (default 10)
 *   color       — stroke/fill color (default brand gold)
 *   showLabels  — render axis labels (default true)
 */

import { SKILL_ORDER, SKILL_LABELS } from '../../lib/ratings'

export function RadarChart({
  skills,
  order = SKILL_ORDER,
  size = 220,
  max = 10,
  color = 'var(--gold)',
  showLabels = true,
  style = {},
}) {
  if (!skills) return null
  const cx = size / 2
  const cy = size / 2
  const padding = showLabels ? 28 : 8
  const radius = size / 2 - padding
  const n = order.length

  // `frac` is 0–1 (fraction of the chart radius). Labels pass values > 1 to
  // sit just outside the rings.
  const point = (i, frac) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2
    return [cx + Math.cos(angle) * radius * frac, cy + Math.sin(angle) * radius * frac]
  }

  const dataPts = order.map((k, i) =>
    point(i, Math.max(0, Math.min(1, (skills[k] || 0) / max))),
  )
  const polyPath = dataPts.map(([x, y]) => `${x},${y}`).join(' ')
  const rings = [0.25, 0.5, 0.75, 1].map(f =>
    order.map((_, i) => point(i, f).join(',')).join(' '),
  )

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Skill radar"
      style={{ overflow: 'visible', ...style }}
    >
      {/* rings — faint near center, slightly bolder at the outer ring */}
      {rings.map((r, i) => (
        <polygon
          key={i}
          points={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          opacity={0.5 + i * 0.05}
        />
      ))}
      {/* spokes — semi-transparent */}
      {order.map((_, i) => {
        const [x, y] = point(i, 1)
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="var(--border)"
            strokeWidth="1"
            opacity={0.5}
          />
        )
      })}
      {/* data polygon */}
      <polygon
        points={polyPath}
        fill={color}
        fillOpacity={0.28}
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      {/* vertex dots */}
      {dataPts.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={3.5}
          fill={color}
          stroke="var(--navy)"
          strokeWidth={1.5}
        />
      ))}
      {/* labels — first word only, centered just outside the outer ring */}
      {showLabels &&
        order.map((k, i) => {
          const [lx, ly] = point(i, 1.18)
          const label = (SKILL_LABELS[k] || k).split(' ')[0]
          return (
            <text
              key={k}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--text-muted)"
              fontFamily="Barlow Condensed, sans-serif"
              fontSize={Math.max(9, size * 0.05)}
              fontWeight={700}
              letterSpacing="0.14em"
              style={{ textTransform: 'uppercase' }}
            >
              {label}
            </text>
          )
        })}
    </svg>
  )
}

// Re-export for any caller that needs the label dict
RadarChart.SKILL_LABELS = SKILL_LABELS
