import { useState, useEffect, lazy, Suspense } from 'react'
import { Users, CalendarDays, TrendingUp, BarChart2, Lock, LockOpen, Megaphone, X, Send } from 'lucide-react'
import { subscribeTo, addNotice, deleteNotice } from './lib/storage'
import tfaLogo from './assets/tfa-logo.png'

const Roster      = lazy(() => import('./pages/Roster'))
const Training    = lazy(() => import('./pages/Training'))
const Evaluation  = lazy(() => import('./pages/Evaluation'))
const Stats       = lazy(() => import('./pages/Stats'))
const PlayerPortal = lazy(() => import('./pages/PlayerPortal'))

function PageLoader() {
  return <div className="text-center py-20 text-cream/30 text-sm">Loading...</div>
}

// ── Change this PIN to something your coaches know ────────────────────────────
const COACH_PIN = '1234'

const TABS = [
  { id: 'roster',     label: 'Squad',    icon: Users        },
  { id: 'training',   label: 'Training', icon: CalendarDays },
  { id: 'evaluation', label: 'Progress', icon: TrendingUp   },
  { id: 'stats',      label: 'Stats',    icon: BarChart2    },
]

export default function App() {
  const [tab,     setTab]     = useState('roster')
  const [role,    setRole]    = useState(() => sessionStorage.getItem('tfa_role') || 'parent')
  const [notices, setNotices] = useState([])
  const [noticeMsg,    setNoticeMsg]    = useState('')
  const [showNoticeForm, setShowNoticeForm] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinInput,     setPinInput]     = useState('')
  const [pinError,     setPinError]     = useState(false)

  const playerId = new URLSearchParams(window.location.search).get('id')
  if (playerId) return <Suspense fallback={<PageLoader />}><PlayerPortal playerId={playerId} /></Suspense>

  const isCoach = role === 'coach'

  useEffect(() => {
    return subscribeTo('notices', data => {
      // Sort newest first
      setNotices(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
    })
  }, [])

  // Latest active notice (not dismissed by this session)
  const latestNotice = notices[0] || null
  const dismissedId  = sessionStorage.getItem('tfa_dismissed_notice')
  const showBanner   = latestNotice && latestNotice.id !== dismissedId

  function dismissBanner() {
    sessionStorage.setItem('tfa_dismissed_notice', latestNotice.id)
    // Force re-render
    setNotices(n => [...n])
  }

  async function postNotice(e) {
    e.preventDefault()
    if (!noticeMsg.trim()) return
    await addNotice({ message: noticeMsg.trim(), date: new Date().toISOString().split('T')[0] })
    setNoticeMsg('')
    setShowNoticeForm(false)
  }

  function toggleCoachMode() {
    if (isCoach) {
      if (window.confirm('Exit coach mode?')) {
        sessionStorage.setItem('tfa_role', 'parent')
        setRole('parent')
      }
    } else {
      setPinInput('')
      setPinError(false)
      setShowPinModal(true)
    }
  }

  function handlePinPress(num) {
    setPinError(false)
    if (pinInput.length < 4) {
      const newPin = pinInput + num
      setPinInput(newPin)
      if (newPin.length === 4) {
        if (newPin === COACH_PIN) {
          sessionStorage.setItem('tfa_role', 'coach')
          setRole('coach')
          setShowPinModal(false)
        } else {
          setPinError(true)
          setPinInput('')
        }
      }
    }
  }

  function handlePinBackspace() {
    setPinInput(pinInput.slice(0, -1))
  }

  return (
    <div className="min-h-screen">
      <header className="bg-navy-mid border-b border-white/10" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <img src={tfaLogo} alt="TFA" className="w-10 h-10 object-contain shrink-0" />
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl leading-none text-cream tracking-wide">THE FOOTBALL ACADEMY</h1>
            <p className="font-condensed text-gold/60 text-xs tracking-widest uppercase mt-0.5">
              {isCoach ? 'Coach Dashboard' : 'Parent Portal'}
            </p>
          </div>

          {/* Coach: announcement button */}
          {isCoach && (
            <button
              onClick={() => setShowNoticeForm(v => !v)}
              title="Post announcement"
              className={`p-2 rounded-lg transition-colors ${showNoticeForm ? 'bg-gold/20 text-gold' : 'text-cream/30 hover:text-gold'}`}
            >
              <Megaphone size={16} />
            </button>
          )}

          {/* Role toggle */}
          <button
            onClick={toggleCoachMode}
            title={isCoach ? 'Exit coach mode' : 'Coach login'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-condensed text-sm font-semibold tracking-wide transition-colors border ${
              isCoach
                ? 'bg-gold/15 text-gold border-gold/30 hover:bg-gold/25'
                : 'bg-white/5 text-cream/60 border-white/10 hover:bg-white/10 hover:text-cream'
            }`}
          >
            {isCoach ? <LockOpen size={13} /> : <Lock size={13} />}
            {isCoach ? 'Coach Active' : 'Coach Portal'}
          </button>
        </div>

        {/* Coach: post announcement form */}
        {isCoach && showNoticeForm && (
          <div className="max-w-5xl mx-auto px-4 pb-3">
            <form onSubmit={postNotice} className="flex gap-2">
              <input
                className="input flex-1 text-sm py-2"
                placeholder="Post an announcement to parents…"
                value={noticeMsg}
                onChange={e => setNoticeMsg(e.target.value)}
                maxLength={280}
                autoFocus
              />
              <button type="submit" className="flex items-center gap-1.5 bg-gold text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light shrink-0">
                <Send size={13} /> Post
              </button>
            </form>
            {notices.length > 0 && (
              <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
                {notices.map(n => (
                  <div key={n.id} className="flex items-center justify-between gap-2 bg-navy rounded-lg px-3 py-2 text-xs text-cream/60">
                    <span className="flex-1 truncate">{n.message}</span>
                    <span className="text-cream/30 shrink-0">{n.date}</span>
                    <button onClick={() => deleteNotice(n.id)} className="text-cream/20 hover:text-red-400 shrink-0 ml-1"><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 font-condensed font-semibold text-base tracking-wide rounded-t transition-colors whitespace-nowrap ${
                tab === id
                  ? 'bg-gold text-navy'
                  : 'text-cream/60 hover:text-cream hover:bg-white/5'
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Announcement banner — visible to everyone when a notice exists */}
      {showBanner && (
        <div className="bg-gold/10 border-b border-gold/20 max-w-full">
          <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
            <Megaphone size={14} className="text-gold shrink-0" />
            <p className="flex-1 text-sm text-cream/90">{latestNotice.message}</p>
            <span className="text-xs text-cream/30 shrink-0">{latestNotice.date}</span>
            <button onClick={dismissBanner} className="text-cream/30 hover:text-cream shrink-0 ml-1"><X size={14} /></button>
          </div>
        </div>
      )}

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Suspense fallback={<PageLoader />}>
          {tab === 'roster'     && <Roster     role={role} />}
          {tab === 'training'   && <Training   role={role} />}
          {tab === 'evaluation' && <Evaluation role={role} />}
          {tab === 'stats'      && <Stats />}
        </Suspense>
      </main>

      {/* Custom Numeric PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-navy-mid border border-white/10 rounded-2xl shadow-2xl w-full max-w-xs overflow-hidden">
            <div className="p-5 text-center relative">
              <button 
                type="button"
                onClick={() => setShowPinModal(false)}
                className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors"
              >
                <X size={18} />
              </button>
              
              <div className="w-12 h-12 bg-gold/15 text-gold rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock size={20} />
              </div>
              <h3 className="font-display text-xl text-cream tracking-wide">COACH VERIFICATION</h3>
              <p className="text-xs text-cream/50 mt-1">Enter PIN to access dashboard</p>

              {/* Masked PIN dots */}
              <div className="flex justify-center gap-3 my-5">
                {[0, 1, 2, 3].map(i => (
                  <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full border transition-all duration-100 ${
                      pinError 
                        ? 'border-red-500 bg-red-500/20' 
                        : i < pinInput.length 
                          ? 'border-gold bg-gold scale-110' 
                          : 'border-white/20 bg-white/5'
                    }`} 
                  />
                ))}
              </div>

              {pinError && (
                <p className="text-xs text-red-400 font-semibold mb-3">Incorrect PIN</p>
              )}

              {/* Grid numeric keypad */}
              <div className="grid grid-cols-3 gap-3 max-w-[200px] mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handlePinPress(num)}
                    className="w-12 h-12 bg-navy border border-white/5 rounded-full text-cream text-lg font-bold hover:bg-white/5 hover:border-gold/30 active:scale-95 transition-all flex items-center justify-center mx-auto"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPinInput('')}
                  className="w-12 h-12 text-xs font-semibold text-cream/40 hover:text-cream transition-colors flex items-center justify-center mx-auto"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => handlePinPress(0)}
                  className="w-12 h-12 bg-navy border border-white/5 rounded-full text-cream text-lg font-bold hover:bg-white/5 hover:border-gold/30 active:scale-95 transition-all flex items-center justify-center mx-auto"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handlePinBackspace}
                  className="w-12 h-12 text-xs font-semibold text-cream/40 hover:text-cream transition-colors flex items-center justify-center mx-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
