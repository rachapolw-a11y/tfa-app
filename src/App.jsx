import { useState, useEffect, lazy, Suspense } from 'react'
import { subscribeTo } from './lib/storage'
import { Header } from './components/ui'
import RoleSelector from './components/RoleSelector'
import { ParentChildBar } from './components/ParentChildBar'
import { ParentProvider, useParent } from './lib/parentContext'
import { ParentLink } from './pages/parent/ParentLink'
import { loadRole, saveRole, ROLE_SUBTITLE } from './lib/roles'
import {
  Home, Users, TrendingUp, Megaphone, MoreHorizontal,
  Image as ImageIcon, ClipboardList, BarChart3,
} from 'lucide-react'

// Coach pages — existing
import Today          from './pages/Today'
import Squad          from './pages/Squad'
import Stats          from './pages/Stats'
import PlayerDetail   from './pages/PlayerDetail'
import EvaluateScreen from './pages/EvaluateScreen'
import Leads          from './pages/Leads'
import More           from './pages/More'

// Role-first pages
import { ParentHome, ParentProgress, ParentPhotos, ParentMore } from './pages/parent/Parent'
import { AdminDash }                                             from './pages/admin/Admin'

const PlayerPortal = lazy(() => import('./pages/PlayerPortal'))

function PageLoader() {
  return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>Loading...</div>
}

const ROLE_TABS = {
  parent: [
    { id: 'home',     label: 'Home',     Icon: Home },
    { id: 'progress', label: 'Progress', Icon: TrendingUp },
    { id: 'photos',   label: 'Photos',   Icon: ImageIcon },
    { id: 'more',     label: 'More',     Icon: MoreHorizontal },
  ],
  coach: [
    { id: 'today',    label: 'Today',    Icon: Home },
    { id: 'squad',    label: 'Squad',    Icon: Users },
    { id: 'evaluate', label: 'Evaluate', Icon: ClipboardList },
    { id: 'leads',    label: 'Leads',    Icon: Megaphone },
    { id: 'more',     label: 'More',     Icon: MoreHorizontal },
  ],
  admin: [
    { id: 'dash',     label: 'Dash',     Icon: BarChart3 },
    { id: 'squad',    label: 'Squad',    Icon: Users },
    { id: 'leads',    label: 'Leads',    Icon: Megaphone },
    { id: 'more',     label: 'More',     Icon: MoreHorizontal },
  ],
}

const DEFAULT_TAB = {
  parent: 'home',
  coach:  'today',
  admin:  'dash',
}

export default function App() {
  const [role, setRole] = useState(() => loadRole())

  // ── PlayerPortal: ?id= bypasses everything ────────────────────────────────
  const playerId = new URLSearchParams(window.location.search).get('id')
  if (playerId) {
    return (
      <Suspense fallback={<PageLoader />}>
        <PlayerPortal playerId={playerId} />
      </Suspense>
    )
  }

  if (!role) {
    return <RoleSelector onPick={r => { saveRole(r); setRole(r) }} />
  }

  function switchRole() {
    saveRole(null)
    setRole(null)
  }

  if (role === 'parent') {
    return (
      <ParentProvider>
        <ParentGate onSwitchRole={switchRole} />
      </ParentProvider>
    )
  }
  return <Shell role={role} onSwitchRole={switchRole} />
}

// Gates the parent Shell on the parent having linked at least one child via
// editCode. Until then, the link screen replaces the whole surface — no
// header, no tab bar, no other families' data.
function ParentGate({ onSwitchRole }) {
  const { hasLinkedChildren } = useParent()
  if (!hasLinkedChildren) {
    return <ParentLink onSwitchRole={onSwitchRole} />
  }
  return <Shell role="parent" onSwitchRole={onSwitchRole} />
}

function Shell({ role, onSwitchRole }) {
  const [tab,   setTab]   = useState(() => DEFAULT_TAB[role])
  const [stack, setStack] = useState([])

  // Subscriptions used by coach stack (PlayerDetail/EvaluateScreen)
  const [players,     setPlayers]     = useState([])
  const [sessions,    setSessions]    = useState([])
  const [evaluations, setEvaluations] = useState([])

  useEffect(() => {
    if (role !== 'coach' && role !== 'admin') return
    const unsubs = [
      subscribeTo('players',     setPlayers),
      subscribeTo('sessions',    setSessions),
      subscribeTo('evaluations', setEvaluations),
    ]
    return () => unsubs.forEach(fn => fn())
  }, [role])

  const TABS = ROLE_TABS[role]
  const currentScreen = stack.length > 0 ? stack[stack.length - 1] : null
  const isStacked     = stack.length > 0

  function openPlayer(pid)     { setStack([{ screen: 'player', playerId: pid }]) }
  function openEvaluate() {
    const top = stack[stack.length - 1]
    if (top) setStack([...stack, { screen: 'evaluate', playerId: top.playerId }])
  }
  function evaluatePlayer(pid) { if (pid) setStack([{ screen: 'evaluate', playerId: pid }]) }
  function goBack()            { setStack(s => s.slice(0, -1)) }
  function handleEvalSaved()   { setStack(s => s.slice(0, -1)) }

  function renderTab() {
    if (role === 'parent') {
      if (tab === 'home')     return <ParentHome onTabSwitch={setTab} />
      if (tab === 'progress') return <ParentProgress onTabSwitch={setTab} />
      if (tab === 'photos')   return <ParentPhotos onTabSwitch={setTab} />
      if (tab === 'more')     return <ParentMore onSwitchRole={onSwitchRole} />
    }
    if (role === 'coach') {
      if (tab === 'today')    return <Today onTabSwitch={setTab} />
      if (tab === 'squad')    return <Squad role="coach" onPlayerOpen={openPlayer} />
      if (tab === 'evaluate') return <Stats role="coach" onEvaluatePlayer={evaluatePlayer} />
      // Today's "Pipeline ›" card and its "Follow up ·" rows switch to this
      // tab; without the branch they fell through to null — a blank screen
      // with no nav item highlighted and no way back.
      if (tab === 'leads')    return <Leads role="coach" />
      if (tab === 'more')     return <More  role="coach" isCoach onCoachToggle={onSwitchRole} />
    }
    if (role === 'admin') {
      if (tab === 'dash')     return <AdminDash onOpenLeads={() => setTab('leads')} />
      if (tab === 'squad')    return <Squad role="admin" onPlayerOpen={openPlayer} />
      if (tab === 'leads')    return <Leads role="coach" />
      if (tab === 'more')     return <More role="coach" isCoach onCoachToggle={onSwitchRole} />
    }
    return null
  }

  return (
    <>
      {!isStacked && <HeaderForRole role={role} onHome={onSwitchRole} />}
      {!isStacked && role === 'parent' && <ParentChildBar />}

      <main
        className="flex-1"
        style={{
          paddingBottom: isStacked ? 0 : 'calc(72px + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {currentScreen?.screen === 'player' && (
          <div className="mx-auto max-w-[1080px]">
            <PlayerDetail
              playerId={currentScreen.playerId}
              players={players}
              evaluations={evaluations}
              sessions={sessions}
              onBack={goBack}
              onEvaluate={openEvaluate}
              role={role}
            />
          </div>
        )}
        {currentScreen?.screen === 'evaluate' && (
          <div className="mx-auto max-w-[1080px]">
            <EvaluateScreen
              playerId={currentScreen.playerId}
              players={players}
              evaluations={evaluations}
              onBack={goBack}
              onSaved={handleEvalSaved}
              role={role}
            />
          </div>
        )}
        {!isStacked && (
          <div className="mx-auto max-w-[1080px]">
            {renderTab()}
          </div>
        )}
      </main>

      {!isStacked && (
        <nav
          className="fixed bottom-0 left-0 right-0 z-50 tfa-blur-bar border-t border-white/[0.06]"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
        >
          <div className="mx-auto max-w-[720px] flex">
            {TABS.map(({ id, label, Icon }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="flex-1 flex flex-col items-center justify-center gap-1 min-h-[64px] transition-all duration-200 ease-out-soft active:scale-[0.96] focus:outline-none"
                >
                  <span
                    className={`inline-flex h-9 w-9 items-center justify-center rounded-pill transition-all ${
                      active ? 'bg-gold/15' : ''
                    }`}
                    style={active ? { boxShadow: '0 0 18px rgba(241,184,19,0.35)' } : undefined}
                  >
                    <Icon
                      size={20}
                      strokeWidth={2}
                      className={active ? 'text-gold' : 'text-muted'}
                    />
                  </span>
                  <span
                    className={`font-condensed font-bold uppercase text-[10px] tracking-[0.18em] leading-none ${
                      active ? 'text-gold' : 'text-faint'
                    }`}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}

function HeaderForRole({ role, onHome }) {
  if (role === 'parent') return <ParentHeader onHome={onHome} />
  const headerName = role === 'player' ? 'Player'
                   : role === 'coach'  ? 'Coach Rachapol'
                   : 'Academy Admin'
  return <Header subtitle={ROLE_SUBTITLE[role] || ''} coachName={headerName} onLogoClick={onHome} />
}

function ParentHeader({ onHome }) {
  const { child } = useParent()
  const name = child?.parentName ? `Khun ${child.parentName.split(' ')[0]}` : 'Parent'
  return <Header subtitle={ROLE_SUBTITLE.parent} coachName={name} onLogoClick={onHome} />
}
