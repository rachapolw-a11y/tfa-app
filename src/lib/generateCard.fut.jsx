// TFA shareable player card.
//
// Renders one of two JSX card designs (Special / Share) at 1080×1920,
// rasterises with html-to-image, returns an HTMLCanvasElement.
//
// API preserved from the previous Canvas-based implementation:
//   generateCard(player, evaluations, sessions, options?) -> Promise<HTMLCanvasElement>
//   shareCard(canvas, playerName)                        -> Promise<'shared'|'downloaded'>

import { createRoot } from 'react-dom/client'
import { toCanvas } from 'html-to-image'
import SpecialCard from '../components/cards/SpecialCard'
import ShareCard from '../components/cards/ShareCard'
import { pickLatest, computeOVR } from '../components/cards/cardData'
import logoUrl from '../assets/tfa-logo.png'

export const CARD_W = 1080
export const CARD_H = 1920

// Default card variant for the share flow.
const DEFAULT_TYPE = 'share'

// OVR → edition/tier auto-select. Coaches can override via options.
function autoEdition(ovr) {
  const n = Number(ovr)
  if (!Number.isFinite(n)) return 'prime'
  if (n >= 8.5) return 'prime'
  if (n >= 7.5) return 'voltage'
  if (n >= 6.5) return 'venom'
  return 'inferno'
}

function autoTier(ovr) {
  const n = Number(ovr)
  if (!Number.isFinite(n)) return 'gold'
  if (n >= 8) return 'gold'
  if (n >= 7) return 'silver'
  if (n >= 5) return 'bronze'
  return 'special'
}

// Wait for the offscreen DOM to fully paint: fonts loaded, images decoded, two RAFs.
async function waitForReady(node) {
  if (document.fonts?.ready) {
    try { await document.fonts.ready } catch { /* ignore */ }
  }
  const imgs = Array.from(node.querySelectorAll('img'))
  await Promise.all(imgs.map(img => {
    if (img.complete && img.naturalWidth > 0) return Promise.resolve()
    return new Promise(resolve => {
      img.addEventListener('load', resolve, { once: true })
      img.addEventListener('error', resolve, { once: true })
    })
  }))
  await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))
}

/**
 * Render a card React component offscreen and rasterise to canvas.
 * @param {React.ReactElement} element
 * @returns {Promise<HTMLCanvasElement>}
 */
async function renderToCanvas(element) {
  const host = document.createElement('div')
  // Keep the node renderable but invisible — html-to-image needs real layout.
  host.style.cssText = 'position:fixed;left:-99999px;top:0;width:1080px;height:1920px;pointer-events:none;'
  document.body.appendChild(host)

  const root = createRoot(host)
  try {
    root.render(element)
    await waitForReady(host)
    const inner = host.firstElementChild
    const canvas = await toCanvas(inner, {
      width: CARD_W,
      height: CARD_H,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor: '#05090f',
    })
    return canvas
  } finally {
    root.unmount()
    host.remove()
  }
}

/**
 * @param {object} player
 * @param {Array}  evaluations
 * @param {Array}  sessions
 * @param {object} [options]
 * @param {'special'|'share'} [options.type]
 * @param {'prime'|'venom'|'inferno'|'voltage'} [options.edition]
 * @param {'gold'|'silver'|'bronze'|'special'} [options.tier]
 */
export async function generateCard(player, evaluations, sessions, options = {}) {
  const type = options.type || DEFAULT_TYPE
  const latest = pickLatest(evaluations)
  const ovr = computeOVR(latest)
  const sessionsCount = sessions?.length ?? 0

  const element = type === 'share'
    ? <ShareCard
        player={player}
        latest={latest}
        sessionsCount={sessionsCount}
        ovr={ovr}
        tier={options.tier || autoTier(ovr)}
        logoSrc={logoUrl}
      />
    : <SpecialCard
        player={player}
        latest={latest}
        sessionsCount={sessionsCount}
        ovr={ovr}
        edition={options.edition || autoEdition(ovr)}
        logoSrc={logoUrl}
      />

  return renderToCanvas(element)
}

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
