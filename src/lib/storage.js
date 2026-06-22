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
