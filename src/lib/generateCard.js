// ─── Colours ──────────────────────────────────────────────────────────────────
const NAVY  = '#070f1e'
const GOLD  = '#f1b813'
const CREAM = '#f5f0e8'
const MUTED = 'rgba(245,240,232,0.45)'
const DIM   = 'rgba(245,240,232,0.08)'

const SKILLS = [
  { key: 'ballMastery', label: 'Ball Mastery', abbr: 'BM'  },
  { key: 'dribbling',   label: 'Dribbling',    abbr: 'DRI' },
  { key: 'passing',     label: 'Passing',      abbr: 'PAS' },
  { key: 'shooting',    label: 'Shooting',     abbr: 'SHO' },
  { key: 'pace',        label: 'Pace',         abbr: 'PAC' },
  { key: 'positioning', label: 'Positioning',  abbr: 'POS' },
  { key: 'attitude',    label: 'Attitude',     abbr: 'ATT' },
]

// ─── Card dimensions (portrait 2:3) ──────────────────────────────────────────
const W = 420
const H = 600

// Zone boundaries
const PHOTO_BOTTOM = 310   // dark navy photo section ends here
const BAND_BOTTOM  = 370   // gold name band ends here
// stats section: BAND_BOTTOM → H - 36 (footer area)

// ─── Helpers ──────────────────────────────────────────────────────────────────
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y,     x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h,     x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y,         x + r, y)
  ctx.closePath()
}

function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

// ─── Main card generator (async for photo load) ───────────────────────────────
export async function generateCard(player, evaluations, sessions) {
  const canvas = document.createElement('canvas')
  canvas.width  = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  const latest = [...evaluations].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  const avg = latest
    ? (Object.values(latest.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
    : null

  // Load player photo (non-blocking — null on failure)
  const photoImg = player.photoURL ? await loadImage(player.photoURL) : null

  // ── 1. PHOTO SECTION (dark navy, top) ──────────────────────────────────────
  ctx.fillStyle = NAVY
  ctx.fillRect(0, 0, W, PHOTO_BOTTOM)

  // Subtle gold radial glow behind photo area
  const glow = ctx.createRadialGradient(W / 2, 140, 0, W / 2, 140, 200)
  glow.addColorStop(0, 'rgba(241,184,19,0.07)')
  glow.addColorStop(1, 'transparent')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, PHOTO_BOTTOM)

  // Gold top edge
  ctx.fillStyle = GOLD
  ctx.fillRect(0, 0, W, 3)

  // TFA badge (top-left)
  const BX = 30, BY = 34, BR = 20
  ctx.beginPath()
  ctx.arc(BX, BY, BR, 0, Math.PI * 2)
  ctx.fillStyle = GOLD
  ctx.fill()
  ctx.fillStyle    = NAVY
  ctx.font         = 'bold 10px Arial, sans-serif'
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('TFA', BX, BY)

  // Age group + position chips (top-right)
  ctx.font = 'bold 9px Arial, sans-serif'
  let chipX = W - 14
  for (const text of [player.position, player.ageGroup]) {   // reversed so ageGroup is leftmost
    const tw = ctx.measureText(text).width
    const cw = tw + 16
    chipX -= cw
    rr(ctx, chipX, 18, cw, 18, 9)
    ctx.fillStyle    = 'rgba(241,184,19,0.15)'
    ctx.fill()
    ctx.strokeStyle  = 'rgba(241,184,19,0.35)'
    ctx.lineWidth    = 0.5
    ctx.stroke()
    ctx.fillStyle    = GOLD
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, chipX + cw / 2, 27)
    chipX -= 6
  }

  // Player photo — circle crop, centered in top section
  const PX = W / 2, PY = 160, PR = 76
  ctx.save()
  ctx.beginPath()
  ctx.arc(PX, PY, PR, 0, Math.PI * 2)
  ctx.clip()

  if (photoImg) {
    // Draw image scaled to fill the circle
    const scale = (PR * 2) / Math.min(photoImg.width, photoImg.height)
    const sw    = photoImg.width  * scale
    const sh    = photoImg.height * scale
    ctx.drawImage(photoImg, PX - sw / 2, PY - sh / 2, sw, sh)
  } else {
    // Fallback: gold gradient circle with initial
    const fallback = ctx.createRadialGradient(PX, PY - PR * 0.2, PR * 0.1, PX, PY, PR)
    fallback.addColorStop(0, '#f5c842')
    fallback.addColorStop(1, '#c89010')
    ctx.fillStyle = fallback
    ctx.fillRect(PX - PR, PY - PR, PR * 2, PR * 2)
    ctx.restore()
    ctx.fillStyle    = NAVY
    ctx.font         = `bold ${PR}px Arial, sans-serif`
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((player.name || '?')[0].toUpperCase(), PX, PY + PR * 0.05)
    ctx.save()  // balance the restore below
  }
  ctx.restore()

  // Gold ring around photo
  ctx.beginPath()
  ctx.arc(PX, PY, PR + 3, 0, Math.PI * 2)
  ctx.strokeStyle = GOLD
  ctx.lineWidth   = 2.5
  ctx.stroke()

  // Average rating — large, below photo
  if (avg) {
    ctx.fillStyle    = GOLD
    ctx.font         = 'bold 60px Arial, sans-serif'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText(avg, W / 2, 276)
    ctx.fillStyle    = MUTED
    ctx.font         = '11px Arial, sans-serif'
    ctx.textBaseline = 'alphabetic'
    ctx.fillText('/ 10', W / 2, 294)
  } else {
    ctx.fillStyle    = MUTED
    ctx.font         = '13px Arial, sans-serif'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Not evaluated', W / 2, 270)
  }

  // ── 2. GOLD NAME BAND ──────────────────────────────────────────────────────
  ctx.fillStyle = GOLD
  ctx.fillRect(0, PHOTO_BOTTOM, W, BAND_BOTTOM - PHOTO_BOTTOM)

  // Player name (surname large, full name if short enough)
  const displayName = player.name.toUpperCase()
  ctx.fillStyle    = NAVY
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'

  // Auto-size font to fit width
  let nameFontSize = 28
  ctx.font = `bold ${nameFontSize}px Arial, sans-serif`
  while (ctx.measureText(displayName).width > W - 40 && nameFontSize > 14) {
    nameFontSize -= 1
    ctx.font = `bold ${nameFontSize}px Arial, sans-serif`
  }
  ctx.fillText(displayName, W / 2, PHOTO_BOTTOM + (BAND_BOTTOM - PHOTO_BOTTOM) / 2)

  // ── 3. STATS SECTION (dark navy bottom) ───────────────────────────────────
  ctx.fillStyle = NAVY
  ctx.fillRect(0, BAND_BOTTOM, W, H - BAND_BOTTOM)

  if (latest) {
    // Radar chart — compact, radius 80px
    const CX    = W / 2
    const CY    = BAND_BOTTOM + 110   // ~480
    const MAX_R = 80
    const N     = SKILLS.length
    const angle = i => (Math.PI * 2 * i / N) - Math.PI / 2

    // Grid rings
    for (let ring = 1; ring <= 5; ring++) {
      const r = MAX_R * ring / 5
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        const a = angle(i)
        i === 0
          ? ctx.moveTo(CX + r * Math.cos(a), CY + r * Math.sin(a))
          : ctx.lineTo(CX + r * Math.cos(a), CY + r * Math.sin(a))
      }
      ctx.closePath()
      ctx.strokeStyle = ring === 5 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)'
      ctx.lineWidth   = 0.8
      ctx.stroke()
    }

    // Spokes
    for (let i = 0; i < N; i++) {
      const a = angle(i)
      ctx.beginPath()
      ctx.moveTo(CX, CY)
      ctx.lineTo(CX + MAX_R * Math.cos(a), CY + MAX_R * Math.sin(a))
      ctx.strokeStyle = 'rgba(255,255,255,0.07)'
      ctx.lineWidth   = 0.8
      ctx.stroke()
    }

    // Filled polygon
    ctx.beginPath()
    for (let i = 0; i < N; i++) {
      const val = latest.skills[SKILLS[i].key] ?? 0
      const r   = MAX_R * (val / 10)
      const a   = angle(i)
      i === 0
        ? ctx.moveTo(CX + r * Math.cos(a), CY + r * Math.sin(a))
        : ctx.lineTo(CX + r * Math.cos(a), CY + r * Math.sin(a))
    }
    ctx.closePath()
    ctx.fillStyle   = 'rgba(241,184,19,0.20)'
    ctx.fill()
    ctx.strokeStyle = GOLD
    ctx.lineWidth   = 1.8
    ctx.stroke()

    // Dots
    for (let i = 0; i < N; i++) {
      const val = latest.skills[SKILLS[i].key] ?? 0
      const r   = MAX_R * (val / 10)
      const a   = angle(i)
      ctx.beginPath()
      ctx.arc(CX + r * Math.cos(a), CY + r * Math.sin(a), 3, 0, Math.PI * 2)
      ctx.fillStyle = GOLD
      ctx.fill()
    }

    // ── Abbreviated skill stat row below radar ─────────────────────────────
    // Two rows: BM DRI PAS SHO  /  PAC POS ATT
    const ROW1 = SKILLS.slice(0, 4)
    const ROW2 = SKILLS.slice(4)
    const STAT_Y1 = CY + MAX_R + 28
    const STAT_Y2 = STAT_Y1 + 36

    function drawStatRow(row, y) {
      const colW = W / (row.length + 1)
      row.forEach((s, i) => {
        const val = latest.skills[s.key] ?? 0
        const x   = colW * (i + 1)
        ctx.textAlign    = 'center'
        ctx.textBaseline = 'middle'
        // Value
        ctx.font      = `bold 16px Arial, sans-serif`
        ctx.fillStyle = val >= 8 ? GOLD : val <= 4 ? '#ef4444' : CREAM
        ctx.fillText(String(val), x, y)
        // Abbreviation below
        ctx.font      = '9px Arial, sans-serif'
        ctx.fillStyle = MUTED
        ctx.fillText(s.abbr, x, y + 14)
      })
    }

    drawStatRow(ROW1, STAT_Y1)
    drawStatRow(ROW2, STAT_Y2)
  } else {
    // No evaluation yet
    ctx.fillStyle    = MUTED
    ctx.font         = '12px Arial, sans-serif'
    ctx.textAlign    = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('No skill data yet', W / 2, BAND_BOTTOM + 90)
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  ctx.fillStyle = DIM
  ctx.fillRect(20, H - 32, W - 40, 0.5)
  ctx.font         = '9px Arial, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillStyle    = MUTED

  const dateStr = latest ? latest.date : ''
  ctx.textAlign = 'left'
  ctx.fillText(`${sessions.length} session${sessions.length !== 1 ? 's' : ''}  ·  ${dateStr}`, 20, H - 18)
  ctx.textAlign = 'right'
  ctx.fillText('The Football Academy · TFA', W - 20, H - 18)

  return canvas
}

// ─── Share or download the generated card ─────────────────────────────────────
export async function shareCard(canvas, playerName) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async blob => {
      if (!blob) { reject(new Error('toBlob failed')); return }

      const file = new File([blob], `${playerName}-tfa-progress.png`, { type: 'image/png' })

      // Try native share (iOS/Android share sheet)
      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: `${playerName} — TFA Progress` })
          resolve('shared')
          return
        }
      } catch { /* cancelled or unsupported — fall through */ }

      // Fallback: download
      const url = URL.createObjectURL(blob)
      const a   = document.createElement('a')
      a.href     = url
      a.download = `${playerName}-tfa-progress.png`
      a.click()
      URL.revokeObjectURL(url)
      resolve('downloaded')
    }, 'image/png')
  })
}
