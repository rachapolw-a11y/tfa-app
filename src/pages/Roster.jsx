import { useState } from 'react'
import { storage } from '../lib/storage'
import Modal from '../components/Modal'
import { Plus, Pencil, Trash2, Phone } from 'lucide-react'

const AGE_GROUPS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']
const POSITIONS = ['GK', 'DEF', 'MID', 'FWD']

const POS_COLOR = {
  GK: 'bg-gold/20 text-gold',
  DEF: 'bg-blue-500/20 text-blue-300',
  MID: 'bg-white/10 text-cream/80',
  FWD: 'bg-red-500/20 text-red-300',
}

const EMPTY = {
  name: '',
  nickname: '',
  dob: '',
  ageGroup: 'U10',
  position: 'MID',
  parentName: '',
  parentPhone: '',
  joinDate: '',
  notes: '',
  active: true,
}

export default function Roster() {
  const [players, setPlayers] = useState(() => storage.getPlayers())
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)

  function persist(data) {
    storage.savePlayers(data)
    setPlayers(data)
  }

  function openAdd() {
    setEditing(null)
    setForm(EMPTY)
    setShowModal(true)
  }

  function openEdit(player) {
    setEditing(player.id)
    setForm({ ...player })
    setShowModal(true)
  }

  function submit(e) {
    e.preventDefault()
    if (editing) {
      persist(players.map(p => p.id === editing ? { ...form, id: editing } : p))
    } else {
      persist([...players, { ...form, id: crypto.randomUUID() }])
    }
    setShowModal(false)
  }

  function remove(id) {
    if (window.confirm('Remove this player?')) persist(players.filter(p => p.id !== id))
  }

  function field(key, val) { setForm(f => ({ ...f, [key]: val })) }

  const visible = filter === 'all' ? players : players.filter(p => p.ageGroup === filter)
  const active = visible.filter(p => p.active)
  const inactive = visible.filter(p => !p.active)

  return (
    <div>
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          <FilterChip label={`All (${players.length})`} active={filter === 'all'} onClick={() => setFilter('all')} />
          {AGE_GROUPS.map(g => {
            const count = players.filter(p => p.ageGroup === g).length
            return count > 0 ? (
              <FilterChip key={g} label={`${g} (${count})`} active={filter === g} onClick={() => setFilter(g)} />
            ) : null
          })}
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors">
          <Plus size={16} /> Add Player
        </button>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-20 text-cream/40">
          <p className="text-lg font-medium">No players yet</p>
          <p className="text-sm mt-1">Click "Add Player" to build your squad.</p>
        </div>
      )}

      {active.length > 0 && (
        <section className="mb-6">
          {inactive.length > 0 && <p className="text-xs font-bold text-cream/30 uppercase tracking-wide mb-3">Active</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map(p => <PlayerCard key={p.id} player={p} onEdit={openEdit} onRemove={remove} />)}
          </div>
        </section>
      )}

      {inactive.length > 0 && (
        <section className="opacity-60">
          <p className="text-xs font-bold text-cream/30 uppercase tracking-wide mb-3">Inactive</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactive.map(p => <PlayerCard key={p.id} player={p} onEdit={openEdit} onRemove={remove} />)}
          </div>
        </section>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Player' : 'Add Player'} onClose={() => setShowModal(false)}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="label">Full Name *</label>
                <input className="input" required value={form.name} onChange={e => field('name', e.target.value)} />
              </div>
              <div>
                <label className="label">Nickname</label>
                <input className="input" value={form.nickname} onChange={e => field('nickname', e.target.value)} />
              </div>
              <div>
                <label className="label">Date of Birth</label>
                <input className="input" type="date" value={form.dob} onChange={e => field('dob', e.target.value)} />
              </div>
              <div>
                <label className="label">Age Group</label>
                <select className="input" value={form.ageGroup} onChange={e => field('ageGroup', e.target.value)}>
                  {AGE_GROUPS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Position</label>
                <select className="input" value={form.position} onChange={e => field('position', e.target.value)}>
                  {POSITIONS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Parent / Guardian Name</label>
                <input className="input" value={form.parentName} onChange={e => field('parentName', e.target.value)} />
              </div>
              <div>
                <label className="label">Parent Phone</label>
                <input className="input" type="tel" value={form.parentPhone} onChange={e => field('parentPhone', e.target.value)} />
              </div>
              <div>
                <label className="label">Join Date</label>
                <input className="input" type="date" value={form.joinDate} onChange={e => field('joinDate', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="label">Notes</label>
                <textarea className="input" rows={2} value={form.notes} onChange={e => field('notes', e.target.value)} />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input id="active" type="checkbox" checked={form.active} onChange={e => field('active', e.target.checked)} className="w-4 h-4 accent-gold" />
                <label htmlFor="active" className="text-sm text-cream/70">Active player</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
              <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-cream/50 hover:text-cream">Cancel</button>
              <button type="submit" className="px-4 py-2 text-sm bg-gold text-navy rounded-lg hover:bg-gold-light font-semibold">Save Player</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function PlayerCard({ player, onEdit, onRemove }) {
  const age = player.dob
    ? Math.floor((Date.now() - new Date(player.dob)) / (365.25 * 24 * 3600 * 1000))
    : null

  return (
    <div className="bg-navy-mid rounded-xl border border-white/10 p-4 hover:border-gold/30 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-cream truncate">{player.name}</p>
          {player.nickname && <p className="text-sm text-cream/40 truncate">"{player.nickname}"</p>}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={() => onEdit(player)} className="p-1.5 text-cream/20 hover:text-gold rounded transition-colors"><Pencil size={14} /></button>
          <button onClick={() => onRemove(player.id)} className="p-1.5 text-cream/20 hover:text-red-400 rounded transition-colors"><Trash2 size={14} /></button>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${POS_COLOR[player.position] || 'bg-white/10 text-cream/70'}`}>{player.position}</span>
        <span className="text-xs bg-gold/10 text-gold font-semibold px-2 py-0.5 rounded-full">{player.ageGroup}</span>
        {age !== null && <span className="text-xs text-cream/30">Age {age}</span>}
      </div>

      {player.parentPhone && (
        <p className="flex items-center gap-1 text-xs text-cream/30 mt-2">
          <Phone size={11} /> {player.parentPhone}
        </p>
      )}
    </div>
  )
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
        active ? 'bg-gold text-navy border-gold font-semibold' : 'border-white/20 text-cream/60 hover:border-gold/50 hover:text-cream'
      }`}
    >
      {label}
    </button>
  )
}
