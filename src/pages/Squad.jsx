import { useState, useEffect, useMemo } from 'react'
import { subscribeTo, addPlayer, updatePlayer, uploadPlayerPhoto, makeEditCode } from '../lib/storage'
import Modal from '../components/Modal'
import {
  RadarChart,
  ScoreBadge,
  StatBar,
  Badge,
  HexAvatar,
  SummaryTile,
  PillTabs,
  HeroCard,
  Button,
  PlayerCard,
} from '../components/ui'
import { Search, Camera, Check, Copy, Plus, Star } from 'lucide-react'
import {
  skillsToOvr as calcOvr,
  topSkills,
  squadAverages,
  latestEval,
} from '../lib/ratings'

const AGE_GROUPS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']
const POSITIONS  = ['GK', 'DEF', 'MID', 'FWD']

const EMPTY = {
  name: '', nickname: '', dob: '', ageGroup: 'U10', position: 'MID',
  jersey: '',
  parentName: '', parentPhone: '', joinDate: '', notes: '',
  active: true, feeStatus: 'unpaid', featured: false,
}

export default function Squad({ role = 'parent', onPlayerOpen }) {
  const isCoach = role === 'coach' || role === 'admin'

  const [players,      setPlayers]      = useState([])
  const [evaluations,  setEvaluations]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [search,       setSearch]       = useState('')
  // Default to U8 — v2-style decisive filter.
  // No "All" option; coach always sees a single age group at a time.
  const [ageFilter,    setAgeFilter]    = useState('U8')
  const [showModal,    setShowModal]    = useState(false)
  const [form,         setForm]         = useState(EMPTY)
  const [photoFile,    setPhotoFile]    = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [saving,       setSaving]       = useState(false)
  const [registered,   setRegistered]   = useState(null)

  useEffect(() => {
    const unsubP = subscribeTo('players',     data => { setPlayers(data); setLoading(false) })
    const unsubE = subscribeTo('evaluations', setEvaluations)
    return () => { unsubP(); unsubE() }
  }, [])

  const latestEvalMap = useMemo(() => {
    const map = {}
    for (const p of players) {
      const ev = latestEval(p.id, evaluations)
      if (ev) map[p.id] = ev
    }
    return map
  }, [players, evaluations])

  const ovrMap = useMemo(() => {
    const map = {}
    for (const [id, ev] of Object.entries(latestEvalMap)) map[id] = calcOvr(ev.skills)
    return map
  }, [latestEvalMap])

  const activePlayers = useMemo(() => players.filter(p => p.active), [players])

  const visible = useMemo(() => {
    let list = activePlayers.filter(p => p.ageGroup === ageFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => (ovrMap[b.id] ?? 0) - (ovrMap[a.id] ?? 0))
  }, [activePlayers, ageFilter, search, ovrMap])

  // Summary tile numbers
  const { avgOvr, topOvr, evalsDue: evalsNeeded } = squadAverages(players, evaluations, ageFilter)

  // Featured: manual flag wins; otherwise fall back to top-OVR in current view.
  // (Per README "Locked product decisions": one featured per squad via `featured: true`.)
  const manualFeatured = useMemo(
    () => visible.find(p => p.featured === true),
    [visible],
  )
  const featured       = manualFeatured ?? visible.find(p => ovrMap[p.id]) ?? visible[0]
  const featuredEval   = featured ? latestEvalMap[featured.id] : null
  const featuredOvr    = featured ? ovrMap[featured.id] : null
  const isManualFeatured = featured && featured === manualFeatured

  function openAdd() {
    setForm(EMPTY); setPhotoFile(null); setPhotoPreview(null); setRegistered(null); setShowModal(true)
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
      const editCode = makeEditCode()
      // If marking this new player as featured, clear flag on any other player.
      if (form.featured) {
        const others = players.filter(p => p.featured === true)
        for (const p of others) {
          // best-effort; non-blocking on errors
          try { await updatePlayer(p.id, { ...p, featured: false }) } catch {}
        }
      }
      const docRef   = await addPlayer({ ...form, editCode })
      if (photoFile) {
        const url = await uploadPlayerPhoto(docRef.id, photoFile)
        await updatePlayer(docRef.id, { ...form, editCode, photoURL: url })
      }
      const link = `${window.location.origin}${window.location.pathname}?id=${docRef.id}&edit=${editCode}`
      setRegistered({ name: form.name, code: editCode, link })
    } finally {
      setSaving(false)
    }
  }

  function field(key, val) { setForm(f => ({ ...f, [key]: val })) }

  // Pill order — explicit numeric order (U8 first → U18 last), no "All".
  const tabs = AGE_GROUPS

  if (loading) return (
    <div className="text-center py-12 text-muted">Loading squad…</div>
  )

  return (
    <div className="pb-6">
      {/* ── Title row ── */}
      <div className="flex items-end justify-between gap-3 flex-wrap px-4 md:px-6 pt-5">
        <div className="min-w-0">
          <h1
            className="font-display uppercase text-cream text-[42px] md:text-[52px]"
            style={{
              lineHeight: 0.92,
              letterSpacing: '-0.01em',
            }}
          >
            Squad
          </h1>
          <div className="font-condensed uppercase tracking-[0.18em] text-muted text-xs mt-2">
            {ageFilter} · {visible.length} active player{visible.length !== 1 ? 's' : ''}
          </div>
        </div>
        {isCoach && (
          <Button onClick={openAdd} leftIcon={<Plus size={15} strokeWidth={2.5} />}>
            Add player
          </Button>
        )}
      </div>

      {/* ── Summary tiles ── 2 cols mobile / 4 cols ≥md (README §11) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 px-4 md:px-6 pt-4">
        <SummaryTile label="Squad size"  value={activePlayers.length} />
        <SummaryTile label="Average OVR" value={avgOvr || 'N/A'} accent="var(--gold)" />
        <SummaryTile label="Top rated"   value={topOvr || 'N/A'} />
        <SummaryTile
          label="Evals due"
          value={evalsNeeded}
          hint={evalsNeeded ? 'Action needed' : 'All up to date'}
        />
      </div>

      {/* ── Age filter (with eyebrow label) + search ── */}
      <div className="px-4 md:px-6 pt-5 space-y-4">
        <div>
          <div className="font-condensed uppercase tracking-[0.2em] text-[10.5px] text-faint mb-3">
            Filter by age group
          </div>
          <PillTabs items={tabs} value={ageFilter} onChange={setAgeFilter} scroll />
        </div>

        <div className="relative max-w-xl">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-faint pointer-events-none"
          />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search any player…"
            className="w-full h-10 pl-10 pr-4 rounded-pill bg-white/[0.04] border border-white/10 text-sm text-cream placeholder:text-faint outline-none focus:border-gold/70 focus:shadow-[0_0_0_3px_rgba(241,184,19,0.18)]"
          />
        </div>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-12 text-muted font-condensed uppercase tracking-[0.16em] text-xs px-4">
          No players found
        </div>
      )}

      {/* ── Featured hero card ── */}
      {featured && featuredOvr != null && (
        <div className="px-4 md:px-6 pt-4">
          <HeroCard jersey={featured.jersey ?? featured.position ?? '★'}>
            {/* Eyebrow label */}
            <div className="flex items-center gap-2 mb-5">
              <Star size={14} className="text-gold" fill="currentColor" />
              <span className="font-condensed font-bold uppercase tracking-[0.24em] text-[11px] text-gold">
                {isManualFeatured ? 'Player of the week' : 'Top rated'}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 lg:items-center">
              {/* HEAD — hex avatar + name + badges + OVR */}
              <div className="flex items-center gap-4 lg:w-[260px] lg:shrink-0">
                <HexAvatar
                  name={featured.name}
                  photoURL={featured.photoURL}
                  size={88}
                  glow
                />
                <div className="min-w-0 flex-1">
                  <div
                    className="font-display uppercase text-cream"
                    style={{
                      fontSize: 'clamp(26px, 4vw, 34px)',
                      lineHeight: 0.92,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {featured.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                    <Badge kind="position" value={featured.position} size="sm" />
                    <Badge kind="age" value={featured.ageGroup} size="sm" />
                    {featured.jersey ? (
                      <span className="font-condensed uppercase text-[11px] tracking-[0.14em] text-muted">
                        #{featured.jersey}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4">
                    <ScoreBadge value={featuredOvr} size="lg" tone="gold" />
                  </div>
                </div>
              </div>

              {/* RADAR — centered on mobile, middle column on desktop */}
              {featuredEval ? (
                <div className="flex justify-center lg:flex-1">
                  <RadarChart skills={featuredEval.skills} size={210} showLabels />
                </div>
              ) : null}

              {/* STAT BARS — top 3 */}
              {featuredEval ? (
                <div className="lg:w-[260px] lg:shrink-0 space-y-2.5">
                  <div className="font-condensed uppercase tracking-[0.2em] text-[10.5px] text-muted">
                    Top skills
                  </div>
                  {topSkills(featuredEval.skills, 3).map(s => (
                    <StatBar key={s.key ?? s.label} label={s.label} value={s.value} />
                  ))}
                </div>
              ) : null}
            </div>
          </HeroCard>
        </div>
      )}

      {/* ── Player list ── */}
      {visible.length > 0 && (
        <div className="px-4 md:px-6 pt-6">
          <div className="flex items-baseline justify-between mb-3">
            <div className="font-display text-[20px] uppercase text-cream" style={{ letterSpacing: '0.02em' }}>
              All players · {ageFilter}
            </div>
            <div className="font-condensed uppercase tracking-[0.18em] text-[10.5px] text-muted">
              Sorted by OVR
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {visible.map(p => (
              <PlayerCard
                key={p.id}
                player={p}
                evaluation={latestEvalMap[p.id]}
                onClick={() => onPlayerOpen(p.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Add player modal ── */}
      {showModal && (
        <Modal
          title={registered ? 'Player Registered' : 'Add Player'}
          onClose={() => { setShowModal(false); setRegistered(null) }}
        >
          {registered ? (
            <RegisteredPanel registered={registered} onDone={() => { setShowModal(false); setRegistered(null) }} />
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="flex items-center gap-4 mb-1">
                <label
                  htmlFor="squad-photo-input"
                  className="w-[60px] h-[60px] rounded-full shrink-0 border-2 border-dashed border-white/20 overflow-hidden flex items-center justify-center cursor-pointer bg-white/[0.03]"
                >
                  {photoPreview
                    ? <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                    : <Camera size={18} className="text-faint" />
                  }
                </label>
                <input id="squad-photo-input" type="file" accept="image/*" className="sr-only" onChange={handlePhotoChange} />
                <div className="text-xs text-muted">Tap to add photo · JPG or PNG</div>
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
                <div>
                  <label className="label">Jersey #</label>
                  <input className="input" inputMode="numeric" value={form.jersey} onChange={e => field('jersey', e.target.value.replace(/\D/g, '').slice(0, 3))} />
                </div>
                <div>
                  <label className="label">Nickname</label>
                  <input className="input" value={form.nickname} onChange={e => field('nickname', e.target.value)} />
                </div>
                <div>
                  <label className="label">Parent Name</label>
                  <input className="input" value={form.parentName} onChange={e => field('parentName', e.target.value)} />
                </div>
                <div>
                  <label className="label">Parent Phone</label>
                  <input className="input" type="tel" value={form.parentPhone} onChange={e => field('parentPhone', e.target.value)} />
                </div>
                <div className="col-span-2">
                  <label className="label">Date of Birth</label>
                  <input className="input" type="date" value={form.dob} onChange={e => field('dob', e.target.value)} />
                </div>

                {/* Featured toggle */}
                <label className="col-span-2 flex items-center gap-3 p-3 rounded-md border border-white/10 bg-white/[0.03] cursor-pointer hover:bg-white/[0.06] transition-colors">
                  <input
                    type="checkbox"
                    checked={!!form.featured}
                    onChange={e => field('featured', e.target.checked)}
                    className="h-4 w-4 accent-[#f1b813]"
                  />
                  <div className="flex-1">
                    <div className="font-condensed font-bold uppercase text-[11px] tracking-[0.16em] text-cream flex items-center gap-1.5">
                      <Star size={13} className="text-gold" fill="currentColor" />
                      Player of the week
                    </div>
                    <div className="text-[11px] text-muted mt-0.5">
                      Pin this player to the Squad hero card. Replaces any existing featured player.
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <Button variant="ghost" onClick={() => setShowModal(false)} type="button">
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Add Player'}
                </Button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  )
}

function RegisteredPanel({ registered, onDone }) {
  const [copied, setCopied] = useState(false)
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(registered.link)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch { window.prompt('Copy:', registered.link) }
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0">
          <Check size={18} className="text-success" />
        </div>
        <p className="text-sm text-cream"><strong>{registered.name}</strong> is registered.</p>
      </div>
      <div className="bg-navy rounded-md p-3.5">
        <p className="text-xs text-muted mb-2.5">
          Share this link with the parent so they can view progress.
        </p>
        <div className="flex gap-2 items-center">
          <input readOnly value={registered.link} onFocus={e => e.target.select()} className="input flex-1 text-xs" />
          <button
            onClick={copyLink}
            className="shrink-0 px-2.5 py-2 rounded-md border border-white/10 text-gold hover:bg-white/5"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
      </div>
      <div className="flex justify-end pt-2 border-t border-white/10">
        <Button onClick={onDone}>Done</Button>
      </div>
    </div>
  )
}
