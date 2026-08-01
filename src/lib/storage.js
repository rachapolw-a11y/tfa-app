import { db, storage } from './firebase'
import {
  collection, doc,
  addDoc, updateDoc, deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

// ─── Subscribe to a collection (returns unsubscribe fn) ───────────────────────
export function subscribeTo(name, callback) {
  return onSnapshot(collection(db, name), snapshot => {
    callback(snapshot.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}

// ─── Parent edit code (soft gate — see firestore.rules) ───────────────────────
// Friendly alphabet: no 0/O/1/I/L to avoid ambiguity when read aloud or typed.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function makeEditCode(n = 6) {
  const bytes = crypto.getRandomValues(new Uint8Array(n))
  return Array.from(bytes, b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

// ─── Players ──────────────────────────────────────────────────────────────────
export const addPlayer = data =>
  addDoc(collection(db, 'players'), { ...data, createdAt: serverTimestamp() })

export const updatePlayer = (id, data) => {
  const { id: _id, createdAt: _ts, ...rest } = data
  return updateDoc(doc(db, 'players', id), rest)
}

export const deletePlayer = id => deleteDoc(doc(db, 'players', id))

// ─── Sessions ─────────────────────────────────────────────────────────────────
export const addSession = data =>
  addDoc(collection(db, 'sessions'), { ...data, createdAt: serverTimestamp() })

export const updateSession = (id, data) => {
  const { id: _id, createdAt: _ts, ...rest } = data
  return updateDoc(doc(db, 'sessions', id), rest)
}

export const deleteSession = id => deleteDoc(doc(db, 'sessions', id))

// ─── Evaluations ──────────────────────────────────────────────────────────────
export const addEvaluation = data =>
  addDoc(collection(db, 'evaluations'), { ...data, createdAt: serverTimestamp() })

export const updateEvaluation = (id, data) => {
  const { id: _id, createdAt: _ts, ...rest } = data
  return updateDoc(doc(db, 'evaluations', id), rest)
}

export const deleteEvaluation = id => deleteDoc(doc(db, 'evaluations', id))

// ─── Player photo upload ──────────────────────────────────────────────────────
export async function uploadPlayerPhoto(playerId, file) {
  const ext      = file.type === 'image/png' ? 'png' : 'jpg'
  const photoRef = ref(storage, `players/${playerId}/photo.${ext}`)
  await uploadBytes(photoRef, file, { contentType: file.type })
  return getDownloadURL(photoRef)
}

export async function deletePlayerPhoto(playerId) {
  // Try both extensions — ignore errors if file doesn't exist
  for (const ext of ['jpg', 'png', 'jpeg', 'webp']) {
    try { await deleteObject(ref(storage, `players/${playerId}/photo.${ext}`)) } catch { /* ok */ }
  }
}

// ─── Notices (coach announcements) ───────────────────────────────────────────
export const addNotice = data =>
  addDoc(collection(db, 'notices'), { ...data, createdAt: serverTimestamp() })

export const deleteNotice = id => deleteDoc(doc(db, 'notices', id))

// ─── Quests (coach-set, per player) ──────────────────────────────────────────
export const addQuest = data =>
  addDoc(collection(db, 'quests'), {
    current: 0,
    done: false,
    ...data,
    createdAt: serverTimestamp(),
  })

export const updateQuest = (id, data) => {
  const { id: _id, createdAt: _ts, ...rest } = data
  return updateDoc(doc(db, 'quests', id), rest)
}

export const deleteQuest = id => deleteDoc(doc(db, 'quests', id))

// ─── Badges (one doc per player-badge unlock) ───────────────────────────────
export const awardBadge = (playerId, badgeId) =>
  addDoc(collection(db, 'badges'), {
    playerId,
    badgeId,
    earnedAt: serverTimestamp(),
  })

export const revokeBadge = id => deleteDoc(doc(db, 'badges', id))

// ─── Leads (recruitment pipeline) ────────────────────────────────────────────
export const addLead = data =>
  addDoc(collection(db, 'leads'), { ...data, createdAt: serverTimestamp() })

export const updateLead = (id, data) => {
  const { id: _id, createdAt: _ts, ...rest } = data
  return updateDoc(doc(db, 'leads', id), rest)
}

export const deleteLead = id => deleteDoc(doc(db, 'leads', id))

// Promote a lead to a player + mint an editCode. The lead stays in place
// (current stage preserved) with playerId + editCode stamped on it so
// admin keeps the funnel history alongside the live player record.
const AGE_GROUPS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']
const POSITIONS  = ['GK', 'DEF', 'MID', 'FWD']

export async function convertLeadToPlayer(lead) {
  if (lead.playerId) return { playerId: lead.playerId, editCode: lead.editCode }
  const editCode = makeEditCode()
  const playerRef = await addDoc(collection(db, 'players'), {
    name:     (lead.name || '').trim() || 'Unnamed',
    ageGroup: AGE_GROUPS.includes(lead.ageGroup) ? lead.ageGroup : 'U10',
    position: POSITIONS.includes(lead.position)  ? lead.position : 'MID',
    active:   true,
    editCode,
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, 'leads', lead.id), {
    playerId: playerRef.id,
    editCode,
  })
  return { playerId: playerRef.id, editCode }
}
