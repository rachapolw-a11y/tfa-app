/**
 * TFA RadarChart — 7-skill polygon (0–10), pure SVG.
 * Gold fill on navy web. Replaces recharts RadarChart throughout the app.
 *
 * Props:
 *   skills  — { ballMastery, dribbling, passing, shooting, pace, positioning, attitude }
 *   order   — array of skill keys (default: all 7)
 *   size    — px (default 240)
 *   max     — axis maximum (default 10)
 *   color   — stroke/fill color (default brand gold)
 *   showLabels — render axis labels (default true)
 */

const SKILL_LABELS = {
  ballMastery: 'Ball',
  dribbling:   'Dribbling',
  passing:     'Passing',
  shooting:    'Shooting',
  pace:        'Pace',
  positioning: 'Position',
  attitude:    'Attitude',
}

const DEFAULT_ORDER = ['ballMastery','dribbling','passing','shooting','pace','positioning','attitude']

export function RadarChart({
  skills = {},
  order = DEFAULT_ORDER,
  size = 240,
  max = 10,
  color = '#f1b813',
  showLabels = true,
  style = {},
}) {
  const cx = size / 2
  const cy = size / 2
  const r  = size * (showLabels ? 0.32 : 0.42)
  const n  = order.length

  const angleFor = (i) => (Math.PI * 2 * i) / n - Math.PI / 2
  const point    = (i, value) => {
    const rr = (value / max) * r
    return [cx + rr * Math.cos(angleFor(i)), cy + rr * Math.sin(angleFor(i))]
  }

  const rings = [0.25, 0.5, 0.75, 1]
  const dataPts = order.map((k, i) => point(i, Math.max(0, Math.min(max, skills[k] ?? 0))))
  const dataPath = dataPts.map(p => p.join(',')).join(' ')

  const borderColor = 'var(--navy-line, #25375a)'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: 'visible', ...style }}
    >
      {/* Web rings */}
      {rings.map((ring, ri) => (
        <polygon
          key={ri}
          points={order.map((_, i) => point(i, ring * max).join(',')).join(' ')}
          fill="none"
          stroke={borderColor}
          strokeWidth="1"
        />
      ))}
      {/* Spokes */}
      {order.map((_, i) => {
        const [x, y] = point(i, max)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={borderColor} strokeWidth="1" />
      })}
      {/* Data polygon */}
      <polygon
        points={dataPath}
        fill={color}
        fillOpacity="0.28"
        stroke={color}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {dataPts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={color} stroke="var(--navy,#070f1e)" strokeWidth="1.5" />
      ))}
      {/* Labels */}
      {showLabels && order.map((k, i) => {
        const [x, y] = point(i, max * 1.28)
        const anchor   = x < cx - 4 ? 'end' : x > cx + 4 ? 'start' : 'middle'
        const baseline = y < cy - 4 ? 'auto' : y > cy + 4 ? 'hanging' : 'middle'
        return (
          <text
            key={k}
            x={x} y={y}
            textAnchor={anchor}
            dominantBaseline={baseline}
            style={{
              fontFamily: '"Barlow Condensed", sans-serif',
              fontWeight: 600,
              fontSize: size * 0.041,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              fill: 'var(--text-muted, #8fa1bd)',
            }}
          >
            {SKILL_LABELS[k] ?? k}
          </text>
        )
      })}
    </svg>
  )
}

RadarChart.SKILL_LABELS = SKILL_LABELS
