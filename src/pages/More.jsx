import { useState, useEffect } from 'react'
import { subscribeTo, addNotice, deleteNotice } from '../lib/storage'
import {
  ChevronRight,
  Lock,
  LockOpen,
  Send,
  X,
  CalendarDays,
  Users,
  CreditCard,
  MessageCircle,
  Settings,
  Megaphone,
} from 'lucide-react'
import { Button } from '../components/ui'

const MENU_ITEMS = [
  { icon: CalendarDays,   label: 'Schedule',   sub: 'Sessions & match days' },
  { icon: Users,          label: 'Attendance', sub: 'Today · U12 · 14 kids' },
  { icon: CreditCard,     label: 'Payments',   sub: 'PromptPay · 3 due'     },
  { icon: MessageCircle,  label: 'Messages',   sub: 'LINE · parents'        },
  { icon: Settings,       label: 'Settings',   sub: 'Academy & account'     },
]

const COACH_PIN = '1234'

export default function More({ role, onCoachToggle, isCoach }) {
  const [notices,         setNotices]         = useState([])
  const [noticeMsg,       setNoticeMsg]       = useState('')
  const [showNoticeForm,  setShowNoticeForm]  = useState(false)

  useEffect(() => {
    return subscribeTo('notices', data => {
      setNotices(data.sort((a, b) => new Date(b.date) - new Date(a.date)))
    })
  }, [])

  async function postNotice(e) {
    e.preventDefault()
    if (!noticeMsg.trim()) return
    await addNotice({ message: noticeMsg.trim(), date: new Date().toISOString().split('T')[0] })
    setNoticeMsg('')
    setShowNoticeForm(false)
  }

  function handleCoachToggle() {
    if (isCoach) {
      if (window.confirm('Exit coach mode?')) onCoachToggle(false)
    } else {
      const pin = window.prompt('Enter coach PIN:')
      if (pin === null) return
      if (pin === COACH_PIN) onCoachToggle(true)
      else window.alert('Incorrect PIN')
    }
  }

  return (
    <div className="pb-6">
      {/* ── Title row ── */}
      <div className="px-4 md:px-6 pt-5">
        <h1
          className="font-display uppercase text-cream text-[42px] md:text-[52px]"
          style={{ lineHeight: 0.92, letterSpacing: '-0.01em' }}
        >
          More
        </h1>
        <div className="font-condensed uppercase tracking-[0.18em] text-muted text-xs mt-2">
          {isCoach ? 'Coach Rachapol · Academy Admin' : 'Parent Portal'}
        </div>
      </div>

      {/* ── Coach-only: Post Announcement ── */}
      {isCoach && (
        <div className="px-4 md:px-6 pt-5">
          <button
            type="button"
            onClick={() => setShowNoticeForm(v => !v)}
            className={`w-full flex items-center gap-2.5 px-4 h-12 rounded-md border transition-all duration-200 ease-out-soft active:scale-[0.99] ${
              showNoticeForm
                ? 'bg-gold/10 border-gold/40 text-gold'
                : 'bg-white/[0.04] border-white/10 text-cream hover:bg-white/[0.08]'
            }`}
          >
            <Megaphone size={15} />
            <span className="font-condensed font-bold uppercase tracking-[0.14em] text-[12px]">
              Post announcement
            </span>
          </button>

          {showNoticeForm && (
            <form onSubmit={postNotice} className="mt-3 space-y-3">
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Post an announcement to parents…"
                  value={noticeMsg}
                  onChange={e => setNoticeMsg(e.target.value)}
                  maxLength={280}
                  autoFocus
                />
                <Button
                  type="submit"
                  leftIcon={<Send size={13} strokeWidth={2.2} />}
                  size="md"
                >
                  Post
                </Button>
              </div>
              {notices.length > 0 && (
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {notices.map(n => (
                    <div
                      key={n.id}
                      className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] rounded-md px-3 py-2"
                    >
                      <span className="flex-1 text-[12.5px] text-cream/85 truncate">
                        {n.message}
                      </span>
                      <span className="font-condensed uppercase text-[10px] tracking-[0.14em] text-faint shrink-0">
                        {n.date}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteNotice(n.id)}
                        className="text-faint hover:text-danger p-1 rounded-md hover:bg-white/5 shrink-0"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </form>
          )}
        </div>
      )}

      {/* ── Menu list ── */}
      <div className="px-4 md:px-6 pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {MENU_ITEMS.map(item => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              type="button"
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-lg bg-navy-mid/85 border border-white/[0.06] shadow-card transition-all duration-200 ease-out-soft hover:-translate-y-[2px] hover:shadow-md hover:border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/60 text-left"
            >
              <div className="h-10 w-10 shrink-0 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-muted">
                <Icon size={18} strokeWidth={1.85} />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="font-display uppercase text-cream truncate"
                  style={{ fontSize: 16, lineHeight: 1, letterSpacing: '0.01em' }}
                >
                  {item.label}
                </div>
                <div className="font-condensed uppercase text-[11px] tracking-[0.1em] text-muted mt-1.5 truncate">
                  {item.sub}
                </div>
              </div>
              <ChevronRight size={16} className="text-faint shrink-0" />
            </button>
          )
        })}
      </div>

      {/* ── Coach mode toggle ── */}
      <div className="px-4 md:px-6 pt-6">
        <button
          type="button"
          onClick={handleCoachToggle}
          className={`w-full flex items-center justify-center gap-2 h-12 rounded-md border transition-all duration-200 ease-out-soft active:scale-[0.99] ${
            isCoach
              ? 'bg-gold/10 border-gold/40 text-gold hover:bg-gold/15'
              : 'bg-white/[0.04] border-white/10 text-cream hover:bg-white/[0.08]'
          }`}
        >
          {isCoach ? <LockOpen size={15} /> : <Lock size={15} />}
          <span className="font-condensed font-bold uppercase tracking-[0.14em] text-[12px]">
            {isCoach ? 'Exit coach mode' : 'Coach login'}
          </span>
        </button>
      </div>
    </div>
  )
}
