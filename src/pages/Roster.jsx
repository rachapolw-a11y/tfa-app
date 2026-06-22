import { useState, useEffect, useMemo } from 'react'
import { subscribeTo, addPlayer, updatePlayer, deletePlayer, uploadPlayerPhoto, deletePlayerPhoto, makeEditCode } from '../lib/storage'
import Modal from '../components/Modal'
import { Badge } from '../components/ui'
import { Plus, Pencil, Trash2, Phone, Share2, Check, DollarSign, Camera, Copy } from 'lucide-react'

const AGE_GROUPS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']
const POSITIONS  = ['GK', 'DEF', 'MID', 'FWD']

// Kept for attendance bar only
const FEE_STATUS = {
  paid:    { label: 'Paid',    cls: 'bg-green-500/20 text-green-400'   },
  partial: { label: 'Partial', cls: 'bg-orange-400/20 text-orange-300' },
  unpaid:  { label: 'Unpaid',  cls: 'bg-red-500/20 text-red-400'       },
}

const EMPTY = {
  name: '', nickname: '', dob: '', ageGroup: 'U10', position: 'MID',
  parentName: '', parentPhone: '', joinDate: '', notes: '',
  active: true, feeStatus: 'unpaid',
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

function initials(name = '') {
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function Roster({ role = 'parent' }) {
  const isCoach = role === 'coach'

  const [players,        setPlayers]        = useState([])
  const [sessions,       setSessions]       = useState([])
  const [evaluations,    setEvaluations]    = useState([])
  const [loading,        setLoading]        = useState(true)
  const [ageFilter,      setAgeFilter]      = useState('all')
  const [showUnpaidOnly, setShowUnpaidOnly] = useState(false)
  const [showModal,      setShowModal]      = useState(false)
  const [editing,        setEditing]        = useState(null)
  const [form,           setForm]           = useState(EMPTY)
  const [showAllFields,  setShowAllFields]  = useState(false)
  const [photoFile,      setPhotoFile]      = useState(null)
  const [photoPreview,   setPhotoPreview]   = useState(null)
  const [saving,         setSaving]         = useState(false)
  const [registered,     setRegistered]     = useState(null)   // {name, code, link} after a parent/coach registers
  const isMobile = useIsMobile()

  useEffect(() => {
    const unsubP = subscribeTo('players',  data => { setPlayers(data);  setLoading(false) })
    const unsubS = subscribeTo('sessions', data => { setSessions(data) })
    const unsubE = subscribeTo('evaluations', data => { setEvaluations(data) })
    return () => { unsubP(); unsubS(); unsubE() }
  }, [])

  // Precompute attendance map: playerId → { attended, total }
  const attendanceMap = useMemo(() => {
    const map = {}
    for (const player of players) {
      const groupSessions = sessions.filter(s => s.ageGroup === player.ageGroup)
      const attended      = groupSessions.filter(s => (s.attendanceIds || []).includes(player.id)).length
      map[player.id] = { attended, total: groupSessions.length }
    }
    return map
  }, [players, sessions])

  // Precompute evaluations count map: playerId → count
  const evalCountMap = useMemo(() => {
    const map = {}
    for (const player of players) {
      map[player.id] = evaluations.filter(e => e.playerId === player.id).length
    }
    return map
  }, [players, evaluations])

  function openAdd() {
    setEditing(null); setForm(EMPTY); setShowAllFields(false); setRegistered(null)
    setPhotoFile(null); setPhotoPreview(null); setShowModal(true)
  }
  function openEdit(player) {
    setEditing(player.id); setForm({ ...player }); setShowAllFields(true); setRegistered(null)
    setPhotoFile(null); setPhotoPreview(player.photoURL || null); setShowModal(true)
  }
  function closeModal() {
    setShowModal(false); setRegistered(null)
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setPhotoFile(file)
    const reader = new FileReader()
    reader.onload = ev => setPhotoPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await updatePlayer(editing, form)
        if (photoFile) {
          const url = await uploadPlayerPhoto(editing, photoFile)
          await updatePlayer(editing, { ...form, photoURL: url })
        }
        setShowModal(false)
      } else {
        const editCode = makeEditCode()
        const docRef   = await addPlayer({ ...form, editCode })
        if (photoFile) {
          const url = await uploadPlayerPhoto(docRef.id, photoFile)
          await updatePlayer(docRef.id, { ...form, editCode, photoURL: url })
        }
        const link = `${window.location.origin}${window.location.pathname}?id=${docRef.id}&edit=${editCode}`
        setRegistered({ name: form.name, code: editCode, link })
      }
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!window.confirm('Remove this player?')) return
    await deletePlayerPhoto(id).catch(() => {})
    await deletePlayer(id)
  }

  function field(key, val) { setForm(f => ({ ...f, [key]: val })) }

  // Filter
  let visible = ageFilter === 'all' ? players : players.filter(p => p.ageGroup === ageFilter)
  if (showUnpaidOnly) visible = visible.filter(p => p.feeStatus !== 'paid')
  const active      = visible.filter(p =>  p.active)
  const inactive    = visible.filter(p => !p.active)
  const unpaidCount = players.filter(p => p.active && p.feeStatus !== 'paid').length

  if (loading) return (
    <div className="text-center py-20 text-cream/40">
      <p className="text-lg font-medium">Loading squad...</p>
    </div>
  )

  return (
    <div>
      {/* Filters */}
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            label={`All (${players.length})`}
            active={ageFilter === 'all' && !showUnpaidOnly}
            onClick={() => { setAgeFilter('all'); setShowUnpaidOnly(false) }}
          />
          {AGE_GROUPS.map(g => {
            const count = players.filter(p => p.ageGroup === g).length
            return count > 0 ? (
              <FilterChip
                key={g} label={`${g} (${count})`}
                active={ageFilter === g && !showUnpaidOnly}
                onClick={() => { setAgeFilter(g); setShowUnpaidOnly(false) }}
              />
            ) : null
          })}
          {/* Unpaid filter — coaches only */}
          {isCoach && unpaidCount > 0 && (
            <button
              onClick={() => { setShowUnpaidOnly(v => !v); setAgeFilter('all') }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border transition-colors ${
                showUnpaidOnly
                  ? 'bg-red-500/20 text-red-300 border-red-500/40 font-semibold'
                  : 'border-white/20 text-cream/60 hover:border-red-400/50 hover:text-cream'
              }`}
            >
              <DollarSign size={12} /> Unpaid ({unpaidCount})
            </button>
          )}
        </div>

        {/* Open to everyone — parents register their own child (coach-only fields stay hidden) */}
        <button onClick={openAdd} className="flex items-center gap-2 bg-gold text-navy px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gold-light transition-colors">
          <Plus size={16} /> {isCoach ? 'Add Player' : 'Register Player'}
        </button>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-20 text-cream/40">
          <p className="text-lg font-medium">{showUnpaidOnly ? 'No unpaid players' : 'No players yet'}</p>
          {!showUnpaidOnly && <p className="text-sm mt-1">Click "Add Player" to register your child.</p>}
        </div>
      )}

      {active.length > 0 && (
        <section className="mb-6 space-y-6">
          {inactive.length > 0 && <p className="text-xs font-bold text-cream/30 uppercase tracking-wide mb-3">Active Squads</p>}
          {AGE_GROUPS.map(group => {
            const groupActive = active.filter(p => p.ageGroup === group)
            if (groupActive.length === 0) return null
            return (
              <div key={group} className="space-y-3">
                <h3 className="text-xs font-bold text-gold/70 uppercase tracking-wider border-b border-white/5 pb-1 flex items-center gap-2">
                  <span>{group} Squad</span>
                  <span className="text-[10px] bg-white/5 text-cream/35 px-1.5 py-0.5 rounded-full normal-case font-normal">
                    {groupActive.length} player{groupActive.length !== 1 ? 's' : ''}
                  </span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupActive.map(p => (
                    <PlayerCard 
                      key={p.id} 
                      player={p} 
                      isCoach={isCoach} 
                      attendance={attendanceMap[p.id]} 
                      evalCount={evalCountMap[p.id]} 
                      onEdit={openEdit} 
                      onRemove={remove} 
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      )}

      {inactive.length > 0 && (
        <section className="opacity-60 space-y-6">
          <p className="text-xs font-bold text-cream/30 uppercase tracking-wide mb-3">Inactive Squads</p>
          {AGE_GROUPS.map(group => {
            const groupInactive = inactive.filter(p => p.ageGroup === group)
            if (groupInactive.length === 0) return null
            return (
              <div key={group} className="space-y-3">
                <h4 className="text-xs font-bold text-cream/40 uppercase tracking-wider border-b border-white/5 pb-1">
                  {group} (Inactive)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupInactive.map(p => (
                    <PlayerCard 
                      key={p.id} 
                      player={p} 
                      isCoach={isCoach} 
                      attendance={attendanceMap[p.id]} 
                      evalCount={evalCountMap[p.id]} 
                      onEdit={openEdit} 
                      onRemove={remove} 
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      )}

      {showModal && (() => {
        const showFull = !isMobile || showAllFields || !!editing
        const title = registered
          ? 'Player Registered'
          : editing ? 'Edit Player' : isCoach ? 'Add Player' : 'Register Player'
        return (
          <Modal title={title} onClose={closeModal}>
            {registered ? (
              <RegisteredPanel registered={registered} isCoach={isCoach} onDone={closeModal} />
            ) : (
            <form onSubmit={submit} className="space-y-4">

              {/* Photo upload */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="player-photo-input"
                  className="relative shrink-0 w-16 h-16 rounded-full overflow-hidden bg-white/5 border-2 border-dashed border-white/20 hover:border-gold/50 transition-colors group cursor-pointer"
                >
                  {photoPreview
                    ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    : (
                      <span className="flex flex-col items-center justify-center h-full gap-0.5 text-cream/30 group-hover:text-gold transition-colors">
                        <Camera size={18} />
                        <span className="text-[9px] font-medium">Photo</span>
                      </span>
                    )
                  }
                  {photoPreview && (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={16} className="text-white" />
                    </span>
                  )}
                </label>
                <input
                  id="player-photo-input"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoChange}
                />
                <div className="text-xs text-cream/40">
                  <p>Tap to add a photo</p>
                  <p className="mt-0.5">JPG or PNG · max 5 MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Full Name *</label>
                  <input className="input" required autoFocus value={form.name} onChange={e => field('name', e.target.value)} />
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

                {!showFull && (
                  <div className="col-span-2">
                    <button type="button" onClick={() => setShowAllFields(true)} className="text-sm text-gold/70 hover:text-gold transition-colors">
                      + Add parent info & more details
                    </button>
                  </div>
                )}

                {showFull && (
                  <>
                    <div>
                      <label className="label">Nickname</label>
                      <input className="input" value={form.nickname} onChange={e => field('nickname', e.target.value)} />
                    </div>
                    <div>
                      <label className="label">Date of Birth</label>
                      <input className="input" type="date" value={form.dob} onChange={e => field('dob', e.target.value)} />
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
                    {/* Fee status — coaches only */}
                    {isCoach && (
                      <div>
                        <label className="label">Fee Status</label>
                        <select className="input" value={form.feeStatus || 'unpaid'} onChange={e => field('feeStatus', e.target.value)}>
                          <option value="unpaid">Unpaid</option>
                          <option value="partial">Partial</option>
                          <option value="paid">Paid</option>
                        </select>
                      </div>
                    )}
                    <div className="col-span-2">
                      <label className="label">Notes</label>
                      <textarea className="input" rows={2} value={form.notes} onChange={e => field('notes', e.target.value)} />
                    </div>
                    {isCoach && (
                      <div className="col-span-2 flex items-center gap-2">
                        <input id="active" type="checkbox" checked={form.active} onChange={e => field('active', e.target.checked)} className="w-4 h-4 accent-gold" />
                        <label htmlFor="active" className="text-sm text-cream/70">Active player</label>
                      </div>
                    )}
                    {/* Parent edit code — coach recovery / re-share */}
                    {editing && isCoach && form.editCode && (
                      <div className="col-span-2">
                        <label className="label">Parent Edit Code</label>
                        <CopyField value={form.editCode} mono />
                        <p className="text-xs text-cream/30 mt-1">Share with the parent so they can update their child's details.</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-cream/50 hover:text-cream">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-gold text-navy rounded-lg hover:bg-gold-light font-semibold disabled:opacity-60">
                  {saving ? 'Saving…' : editing || isCoach ? 'Save Player' : 'Register'}
                </button>
              </div>
            </form>
            )}
          </Modal>
        )
      })()}
    </div>
  )
}

function PlayerCard({ player, isCoach, attendance, evalCount, onEdit, onRemove }) {
  const [shared, setShared] = useState(false)
  const age = player.dob
    ? Math.floor((Date.now() - new Date(player.dob)) / (365.25 * 24 * 3600 * 1000))
    : null
  const fee = FEE_STATUS[player.feeStatus] ?? FEE_STATUS.unpaid
  const createdMs = player.createdAt?.toMillis?.() ?? null
  const isNew = createdMs !== null && (Date.now() - createdMs) < 7 * 24 * 3600 * 1000

  async function share() {
    const url = `${window.location.origin}${window.location.pathname}?id=${player.id}`
    try {
      if (navigator.share) { await navigator.share({ title: `${player.name} — TFA Progress`, url }); return }
    } catch { /* cancelled */ }
    try {
      await navigator.clipboard.writeText(url)
      setShared(true); setTimeout(() => setShared(false), 2000); return
    } catch { /* no clipboard */ }
    window.prompt('Copy this link:', url)
  }

  function navigate() {
    window.location.href = `${window.location.origin}${window.location.pathname}?id=${player.id}`
  }

  return (
    <div
      onClick={navigate}
      className="bg-navy-mid rounded-xl border border-white/10 p-4 hover:border-gold/30 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        {/* Avatar + name */}
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={player.name} photoURL={player.photoURL} size={40} />
          <div className="min-w-0">
            <p className="font-semibold text-cream truncate">{player.name}</p>
            {player.nickname && <p className="text-sm text-cream/40 truncate">"{player.nickname}"</p>}
          </div>
        </div>
        <div className="flex gap-1 shrink-0">
          {/* Share — everyone can share */}
          <button onClick={e => { e.stopPropagation(); share() }} title="Share progress link" className={`p-1.5 rounded transition-colors ${shared ? 'text-green-400' : 'text-cream/20 hover:text-gold'}`}>
            {shared ? <Check size={14} /> : <Share2 size={14} />}
          </button>
          {/* Edit / Delete — coaches only */}
          {isCoach && (
            <>
              <button onClick={e => { e.stopPropagation(); onEdit(player) }} className="p-1.5 text-cream/20 hover:text-gold rounded transition-colors"><Pencil size={14} /></button>
              <button onClick={e => { e.stopPropagation(); onRemove(player.id) }} className="p-1.5 text-cream/20 hover:text-red-400 rounded transition-colors"><Trash2 size={14} /></button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <Badge kind="position" value={player.position} size="sm" />
        <Badge kind="age" value={player.ageGroup} size="sm">{player.ageGroup}</Badge>
        {isNew && <Badge size="sm" style={{ background: 'var(--status-enrolled)', color: '#fff', border: 'none' }}>New</Badge>}
        {age !== null && <span className="text-xs text-cream/30">Age {age}</span>}
        {/* Fee badge — coaches only */}
        {isCoach && <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${fee.cls}`}>{fee.label}</span>}
        {/* Eval count — coaches only */}
        {isCoach && evalCount !== undefined && (
          <Badge style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(245,240,232,0.6)', borderColor: 'rgba(255,255,255,0.1)' }} size="sm">
            {evalCount} Eval{evalCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {attendance && attendance.total > 0 && (() => {
        const pct = Math.round(attendance.attended / attendance.total * 100)
        const cls = pct >= 70 ? 'text-green-400' : pct >= 40 ? 'text-orange-300' : 'text-red-400'
        return (
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
              <div className={`h-full rounded-full ${pct >= 70 ? 'bg-green-400' : pct >= 40 ? 'bg-orange-300' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
            </div>
            <span className={`text-xs font-semibold shrink-0 ${cls}`}>{attendance.attended}/{attendance.total}</span>
          </div>
        )
      })()}

      {player.parentPhone && isCoach && (
        <p className="flex items-center gap-1 text-xs text-cream/30 mt-2">
          <Phone size={11} /> {player.parentPhone}
        </p>
      )}
    </div>
  )
}

// Reusable avatar: photo if available, else colored initials circle
export function Avatar({ name = '', photoURL, size = 40 }) {
  const [imgError, setImgError] = useState(false)
  const ini = initials(name)
  const style = { width: size, height: size, fontSize: size * 0.36 }

  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name}
        style={style}
        className="rounded-full object-cover shrink-0 bg-navy"
        onError={() => setImgError(true)}
      />
    )
  }

  return (
    <div
      style={style}
      className="rounded-full shrink-0 bg-gold/20 text-gold font-bold flex items-center justify-center leading-none select-none"
    >
      {ini}
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

// Shown after a successful registration: the private edit link + code to hand to the parent.
function RegisteredPanel({ registered, isCoach, onDone }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20 text-green-400 shrink-0">
          <Check size={20} />
        </span>
        <p className="text-sm text-cream/80">
          <span className="font-semibold text-cream">{registered.name}</span> is registered.
        </p>
      </div>

      <div className="bg-navy rounded-lg p-3 space-y-3">
        <p className="text-xs text-cream/50 leading-relaxed">
          {isCoach
            ? "Send this private link to the parent so they can update their child's details. Keep the code safe — anyone with it can edit this player."
            : "Save this private link — it's how you'll update your child's details later. Keep the code safe; don't share it publicly."}
        </p>
        <div>
          <label className="label">Private edit link</label>
          <CopyField value={registered.link} />
        </div>
        <div>
          <label className="label">Edit code</label>
          <CopyField value={registered.code} mono />
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-white/10">
        <button onClick={onDone} className="px-4 py-2 text-sm bg-gold text-navy rounded-lg hover:bg-gold-light font-semibold">Done</button>
      </div>
    </div>
  )
}

// Read-only value with a copy button.
function CopyField({ value, mono = false }) {
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch { window.prompt('Copy:', value) }
  }
  return (
    <div className="flex items-center gap-2">
      <input
        readOnly
        value={value}
        onFocus={e => e.target.select()}
        className={`input flex-1 text-sm ${mono ? 'font-mono tracking-widest' : ''}`}
      />
      <button
        type="button"
        onClick={copy}
        title="Copy"
        className={`p-2 rounded-lg border shrink-0 transition-colors ${copied ? 'border-green-500/40 text-green-400' : 'border-white/20 text-cream/50 hover:text-gold hover:border-gold/40'}`}
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  )
}
