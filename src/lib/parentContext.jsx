import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { subscribeTo } from './storage'

const ParentCtx = createContext(null)

// LocalStorage key — holds the set of player editCodes a parent has linked.
// Persists across role switches so parents don't re-enter codes every visit.
const LS_CODES = 'tfa_parent_codes'

function loadCodes() {
  try {
    const raw = localStorage.getItem(LS_CODES)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(s => typeof s === 'string' && s.length > 0)
  } catch {
    return []
  }
}

function saveCodes(codes) {
  try { localStorage.setItem(LS_CODES, JSON.stringify(codes)) } catch { /* ok */ }
}

// Normalize for case-insensitive matching against players[].editCode.
function normalizeCode(raw) {
  return String(raw || '').trim().toUpperCase().replace(/\s+/g, '')
}

export function ParentProvider({ children }) {
  const [players,     setPlayers]     = useState([])
  const [sessions,    setSessions]    = useState([])
  const [evaluations, setEvaluations] = useState([])
  const [notices,     setNotices]     = useState([])
  const [codes,       setCodes]       = useState(() => loadCodes())
  const [childId,     setChildId]     = useState(() => sessionStorage.getItem('tfa_parent_child') || null)

  useEffect(() => {
    const unsubs = [
      subscribeTo('players',     setPlayers),
      subscribeTo('sessions',    setSessions),
      subscribeTo('evaluations', setEvaluations),
      subscribeTo('notices',     data => setNotices(
        [...data].sort((a, b) => new Date(b.date) - new Date(a.date))
      )),
    ]
    return () => unsubs.forEach(fn => fn())
  }, [])

  // Players the parent has linked via editCode. UI-side scoping only — see
  // firestore.rules comments for the known server-side gap and Firebase Auth
  // follow-up plan.
  const linkedPlayers = useMemo(() => {
    if (codes.length === 0) return []
    const codeSet = new Set(codes)
    return players.filter(p => p.editCode && codeSet.has(normalizeCode(p.editCode)))
  }, [players, codes])

  const activePlayers = useMemo(
    () => linkedPlayers.filter(p => p.active),
    [linkedPlayers],
  )

  const child = useMemo(() => {
    if (childId) {
      const found = activePlayers.find(p => p.id === childId)
      if (found) return found
    }
    return activePlayers[0] || null
  }, [activePlayers, childId])

  // Scope shared collections to the linked children so parents never see other
  // families' evaluations, or sessions/notices for cohorts their kid isn't in.
  const linkedIds = useMemo(() => new Set(linkedPlayers.map(p => p.id)), [linkedPlayers])
  const linkedAgeGroups = useMemo(
    () => new Set(linkedPlayers.map(p => p.ageGroup).filter(Boolean)),
    [linkedPlayers],
  )

  const scopedEvaluations = useMemo(
    () => evaluations.filter(e => linkedIds.has(e.playerId)),
    [evaluations, linkedIds],
  )
  const scopedSessions = useMemo(
    () => linkedAgeGroups.size === 0
      ? []
      : sessions.filter(s => linkedAgeGroups.has(s.ageGroup)),
    [sessions, linkedAgeGroups],
  )
  const scopedNotices = useMemo(
    () => linkedAgeGroups.size === 0
      ? notices.filter(n => !n.ageGroup)
      : notices.filter(n => !n.ageGroup || linkedAgeGroups.has(n.ageGroup)),
    [notices, linkedAgeGroups],
  )

  function pickChild(id) {
    sessionStorage.setItem('tfa_parent_child', id)
    setChildId(id)
  }

  const addCode = useCallback((raw) => {
    const code = normalizeCode(raw)
    if (!code) return { ok: false, reason: 'empty' }
    const match = players.find(p => p.editCode && normalizeCode(p.editCode) === code)
    if (!match) return { ok: false, reason: 'no-match' }
    setCodes(prev => {
      if (prev.includes(code)) return prev
      const next = [...prev, code]
      saveCodes(next)
      return next
    })
    setChildId(match.id)
    sessionStorage.setItem('tfa_parent_child', match.id)
    return { ok: true, player: match }
  }, [players])

  const removeChild = useCallback((playerId) => {
    const target = players.find(p => p.id === playerId)
    if (!target?.editCode) return
    const codeToRemove = normalizeCode(target.editCode)
    setCodes(prev => {
      const next = prev.filter(c => c !== codeToRemove)
      saveCodes(next)
      return next
    })
  }, [players])

  const clearCodes = useCallback(() => {
    saveCodes([])
    setCodes([])
    sessionStorage.removeItem('tfa_parent_child')
    setChildId(null)
  }, [])

  const value = {
    players, activePlayers, linkedPlayers,
    sessions: scopedSessions,
    evaluations: scopedEvaluations,
    notices: scopedNotices,
    child, pickChild,
    codes,
    addCode, removeChild, clearCodes,
    hasLinkedChildren: activePlayers.length > 0,
  }
  return <ParentCtx.Provider value={value}>{children}</ParentCtx.Provider>
}

export function useParent() {
  const ctx = useContext(ParentCtx)
  if (!ctx) throw new Error('useParent must be used inside <ParentProvider>')
  return ctx
}

export function greeting(d = new Date()) {
  const h = d.getHours()
  if (h < 12)  return 'Good morning'
  if (h < 17)  return 'Good afternoon'
  return 'Good evening'
}
