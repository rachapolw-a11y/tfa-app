// ─── TFA shareable player card — FUT (Ultimate Team) style ────────────────────
// Data-driven canvas renderer. Drop-in replacement for generateCard.js:
// exports generateCard(player, evaluations, sessions) -> HTMLCanvasElement
// and shareCard(canvas, playerName).
//
// The drawing itself lives in drawCard(ctx, data) so it can be rendered
// headlessly (e.g. node-canvas) for previews without a browser.

// Vite rewrites this to the bundled asset URL; Node resolves it to the file.
const tfaLogo = new URL('../assets/tfa-logo.png', import.meta.url).href

// ─── Brand palette (matches Tailwind theme) ──────────────────────────────────
const NAVY      = '#070f1e'
const NAVY_TOP  = '#123257'
const NAVY_MID  = '#0c2244'
const NAVY_LOW  = '#060d1a'
const GOLD      = '#f1b813'
const GOLD_HI   = '#ffe27a'
const GOLD_LO   = '#b9860a'
const CREAM     = '#f5f0e8'
const MUTED     = 'rgba(245,240,232,0.45)'
const RED       = '#ef4444'

// ─── Skills: FUT-style two columns (left 4 / right 3) ─────────────────────────
const SKILLS = [
  { key: 'ballMastery', abbr: 'BAL' },
  { key: 'dribbling',   abbr: 'DRI' },
  { key: 'passing',     abbr: 'PAS' },
  { key: 'shooting',    abbr: 'SHO' },
  { key: 'pace',        abbr: 'PAC' },
  { key: 'positioning', abbr: 'POS' },
  { key: 'attitude',    abbr: 'ATT' },
]
const LEFT_COL  = SKILLS.slice(0, 4)   // BAL DRI PAS SHO
const RIGHT_COL = SKILLS.slice(4)      // PAC POS ATT

// ─── Logical card size (drawn in these units, then scaled up) ─────────────────
export const CARD_W = 420
export const CARD_H = 600
export const SCALE  = 3                // export bitmap = 1260 × 1800 (retina)

// ─── Helpers ──────────────────────────────────────────────────────────────────
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function star(ctx, cx, cy, r) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const a1 = (Math.PI * 2 * i / 5) - Math.PI / 2
    const a2 = a1 + Math.PI / 5
    ctx[i === 0 ? 'moveTo' : 'lineTo'](cx + r * Math.cos(a1), cy + r * Math.sin(a1))
    ctx.lineTo(cx + r * 0.42 * Math.cos(a2), cy + r * 0.42 * Math.sin(a2))
  }
  ctx.closePath()
}

function goldFill(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)
  g.addColorStop(0,    GOLD_HI)
  g.addColorStop(0.45, GOLD)
  g.addColorStop(1,    GOLD_LO)
  return g
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

// ─── Pure renderer — assumes ctx is already scaled to logical units ───────────
export function drawCard(ctx, { player, latest, avg, sessionCount = 0, photoImg = null, logoImg = null }) {
  const W = CARD_W, H = CARD_H

  // 1. Background ─ navy gradient + gold glow + diagonal streaks
  const bg = ctx.createLinearGradient(0, 0, 0, H)
  bg.addColorStop(0,    NAVY_TOP)
  bg.addColorStop(0.45, NAVY_MID)
  bg.addColorStop(1,    NAVY_LOW)
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  const glow = ctx.createRadialGradient(W / 2, 175, 0, W / 2, 175, 260)
  glow.addColorStop(0, 'rgba(64,128,200,0.30)')
  glow.addColorStop(1, 'rgba(64,128,200,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, W, H)

  ctx.save()
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = '#bfe0ff'
  ctx.lineWidth = 2
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(-40, 120 + i * 44)
    ctx.lineTo(W + 40, 20 + i * 44)
    ctx.stroke()
  }
  ctx.restore()

  // 2. Gold frame (outer thick + inner hairline), rounded
  rr(ctx, 9, 9, W - 18, H - 18, 26)
  ctx.lineWidth   = 6
  ctx.strokeStyle = goldFill(ctx, 0, 0, 0, H)
  ctx.stroke()
  rr(ctx, 18, 18, W - 36, H - 36, 20)
  ctx.lineWidth   = 1.5
  ctx.strokeStyle = 'rgba(241,184,19,0.45)'
  ctx.stroke()

  // 3. Player photo — circle, slightly right of centre
  const PX = 232, PY = 158, PR = 92
  // soft disc behind
  ctx.beginPath(); ctx.arc(PX, PY, PR + 10, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill()

  ctx.save()
  ctx.beginPath(); ctx.arc(PX, PY, PR, 0, Math.PI * 2); ctx.clip()
  if (photoImg) {
    const scale = (PR * 2) / Math.min(photoImg.width, photoImg.height)
    const sw = photoImg.width * scale, sh = photoImg.height * scale
    ctx.drawImage(photoImg, PX - sw / 2, PY - sh / 2, sw, sh)
  } else {
    const fb = ctx.createRadialGradient(PX, PY - PR * 0.25, PR * 0.1, PX, PY, PR)
    fb.addColorStop(0, '#f5c842'); fb.addColorStop(1, '#b9860a')
    ctx.fillStyle = fb
    ctx.fillRect(PX - PR, PY - PR, PR * 2, PR * 2)
    ctx.fillStyle = NAVY
    ctx.font = `bold ${PR}px Arial, sans-serif`
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText((player.name || '?')[0].toUpperCase(), PX, PY + PR * 0.06)
  }
  ctx.restore()
  ctx.beginPath(); ctx.arc(PX, PY, PR + 3, 0, Math.PI * 2)
  ctx.lineWidth = 3; ctx.strokeStyle = goldFill(ctx, PX, PY - PR, PX, PY + PR)
  ctx.stroke()

  // 4. Top-left rating block (FUT signature: OVR / position / crest / age)
  const CXn = 64
  ctx.textAlign = 'center'

  if (avg) {
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = goldFill(ctx, CXn, 44, CXn, 96)
    ctx.font = 'bold 54px Spurs, sans-serif'
    ctx.fillText(avg, CXn, 96)
    ctx.fillStyle = MUTED
    ctx.font = 'bold 11px Arial, sans-serif'
    ctx.fillText('OVR', CXn, 112)
  } else {
    ctx.fillStyle = MUTED
    ctx.font = 'bold 13px Arial, sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText('NEW', CXn, 78)
  }

  ctx.fillStyle = goldFill(ctx, CXn, 122, CXn, 150)
  ctx.font = 'bold 26px Spurs, sans-serif'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText((player.position || '—').toUpperCase(), CXn, 146)

  ctx.strokeStyle = 'rgba(241,184,19,0.5)'; ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(CXn - 26, 162); ctx.lineTo(CXn + 26, 162); ctx.stroke()

  // real TFA crest (falls back to a drawn shield if the logo can't load)
  if (logoImg && logoImg.width) {
    const box = 60
    const ar = logoImg.width / logoImg.height
    let lw = box, lh = box
    if (ar > 1) lh = box / ar; else lw = box * ar
    ctx.drawImage(logoImg, CXn - lw / 2, 196 - lh / 2, lw, lh)
  } else {
    drawCrest(ctx, CXn, 196)
  }

  // age chip
  const age = (player.ageGroup || '').toUpperCase()
  if (age) {
    ctx.font = 'bold 13px Arial, sans-serif'
    const tw = ctx.measureText(age).width
    const cw = tw + 22
    rr(ctx, CXn - cw / 2, 232, cw, 24, 12)
    ctx.fillStyle = 'rgba(241,184,19,0.14)'; ctx.fill()
    ctx.strokeStyle = 'rgba(241,184,19,0.5)'; ctx.lineWidth = 1; ctx.stroke()
    ctx.fillStyle = GOLD; ctx.textBaseline = 'middle'
    ctx.fillText(age, CXn, 245)
  }

  // 5. Card-version stars above the name band
  ctx.fillStyle = GOLD
  for (let i = -1; i <= 1; i++) { star(ctx, W / 2 + i * 26, 290, 9); ctx.fill() }

  // 6. Gold NAME band
  const BAND_TOP = 306, BAND_H = 58
  ctx.fillStyle = goldFill(ctx, 0, BAND_TOP, 0, BAND_TOP + BAND_H)
  rr(ctx, 26, BAND_TOP, W - 52, BAND_H, 10); ctx.fill()

  const displayName = (player.name || 'PLAYER').toUpperCase()
  ctx.fillStyle = NAVY; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  let fs = 30
  ctx.font = `bold ${fs}px Spurs, sans-serif`
  while (ctx.measureText(displayName).width > W - 90 && fs > 14) {
    fs -= 1; ctx.font = `bold ${fs}px Spurs, sans-serif`
  }
  ctx.fillText(displayName, W / 2, BAND_TOP + BAND_H / 2 + 1)

  // 7. STATS — two columns (4 left / 3 right) FUT style
  if (latest) {
    const ROW_Y0 = 414, STEP = 41
    const LX = 86, RX = 250

    // centre divider
    ctx.strokeStyle = 'rgba(241,184,19,0.45)'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(W / 2, 392); ctx.lineTo(W / 2, ROW_Y0 + STEP * 3 + 6); ctx.stroke()

    const drawStat = (s, x, y) => {
      const v = latest.skills?.[s.key] ?? 0
      ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left'
      ctx.font = 'bold 30px Arial, sans-serif'
      ctx.fillStyle = v >= 8 ? GOLD : v <= 4 ? RED : CREAM
      ctx.fillText(String(v), x, y)
      const vw = ctx.measureText(String(v)).width
      ctx.font = 'bold 17px Arial, sans-serif'
      ctx.fillStyle = 'rgba(245,240,232,0.85)'
      ctx.fillText(s.abbr, x + vw + 8, y)
    }

    LEFT_COL.forEach((s, i)  => drawStat(s, LX, ROW_Y0 + i * STEP))
    RIGHT_COL.forEach((s, i) => drawStat(s, RX, ROW_Y0 + i * STEP))
  } else {
    ctx.fillStyle = MUTED; ctx.font = '13px Arial, sans-serif'
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    ctx.fillText('No skill data yet', W / 2, 460)
  }

  // 8. Footer
  ctx.strokeStyle = 'rgba(241,184,19,0.3)'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(40, H - 46); ctx.lineTo(W - 40, H - 46); ctx.stroke()

  ctx.fillStyle = GOLD; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.font = 'bold 13px Spurs, sans-serif'
  ctx.fillText('THE FOOTBALL ACADEMY', W / 2, H - 30)

  ctx.fillStyle = MUTED; ctx.font = '10px Arial, sans-serif'
  const dateStr = latest?.date || ''
  ctx.fillText(
    `${sessionCount} session${sessionCount !== 1 ? 's' : ''}${dateStr ? '  ·  ' + dateStr : ''}`,
    W / 2, H - 15
  )
}

// small shield crest with football
function drawCrest(ctx, cx, cy) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.beginPath()
  ctx.moveTo(-20, -20); ctx.lineTo(20, -20); ctx.lineTo(20, 6)
  ctx.quadraticCurveTo(20, 22, 0, 30)
  ctx.quadraticCurveTo(-20, 22, -20, 6)
  ctx.closePath()
  ctx.fillStyle = NAVY; ctx.fill()
  ctx.lineWidth = 2; ctx.strokeStyle = GOLD; ctx.stroke()
  // football
  ctx.beginPath(); ctx.arc(0, 4, 9, 0, Math.PI * 2)
  ctx.fillStyle = CREAM; ctx.fill()
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i / 5) - Math.PI / 2
    ctx[i === 0 ? 'moveTo' : 'lineTo'](0 + 4 * Math.cos(a), 4 + 4 * Math.sin(a))
  }
  ctx.closePath(); ctx.fillStyle = NAVY; ctx.fill()
  ctx.restore()
}

// ─── Browser entry point (drop-in compatible) ─────────────────────────────────
export async function generateCard(player, evaluations, sessions) {
  const canvas = document.createElement('canvas')
  canvas.width  = CARD_W * SCALE
  canvas.height = CARD_H * SCALE
  const ctx = canvas.getContext('2d')
  ctx.scale(SCALE, SCALE)

  const latest = [...evaluations].sort((a, b) => new Date(b.date) - new Date(a.date))[0]
  const avg = latest
    ? (Object.values(latest.skills).reduce((a, b) => a + b, 0) / SKILLS.length).toFixed(1)
    : null
  const [photoImg, logoImg] = await Promise.all([
    player.photoURL ? loadImage(player.photoURL) : Promise.resolve(null),
    loadImage(tfaLogo),
  ])

  drawCard(ctx, { player, latest, avg, sessionCount: sessions?.length ?? 0, photoImg, logoImg })
  return canvas
}

// ─── Share or download ────────────────────────────────────────────────────────
export async function shareCard(canvas, playerName) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async blob => {
      if (!blob) { reject(new Error('toBlob failed')); return }
      const file = new File([blob], `${playerName}-tfa-card.png`, { type: 'image/png' })
      try {
        if (navigator.canShare?.({ files: [file] })) {
          await navigator.share({ files: [file], title: `${playerName} — TFA Player Card` })
          resolve('shared'); return
        }
      } catch { /* cancelled / unsupported */ }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `${playerName}-tfa-card.png`; a.click()
      URL.revokeObjectURL(url)
      resolve('downloaded')
    }, 'image/png')
  })
}
