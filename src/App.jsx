import { useState } from 'react'
import Roster from './pages/Roster'
import Training from './pages/Training'
import Evaluation from './pages/Evaluation'
import { Users, CalendarDays, TrendingUp } from 'lucide-react'

const TABS = [
  { id: 'roster', label: 'Squad', icon: Users },
  { id: 'training', label: 'Training', icon: CalendarDays },
  { id: 'evaluation', label: 'Progress', icon: TrendingUp },
]

export default function App() {
  const [tab, setTab] = useState('roster')

  return (
    <div className="min-h-screen bg-navy">
      <header className="bg-navy-mid border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center shrink-0">
            <span className="text-navy font-black text-sm leading-none">TFA</span>
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none text-cream">The Football Academy</h1>
            <p className="text-gold/60 text-xs mt-0.5">Coach Dashboard</p>
          </div>
        </div>
        <div className="max-w-5xl mx-auto px-4 flex gap-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t transition-colors ${
                tab === id
                  ? 'bg-gold text-navy font-semibold'
                  : 'text-cream/60 hover:text-cream hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {tab === 'roster' && <Roster />}
        {tab === 'training' && <Training />}
        {tab === 'evaluation' && <Evaluation />}
      </main>
    </div>
  )
}
