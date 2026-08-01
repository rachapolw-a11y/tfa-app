// Add Session 3 · Group C (U16 & U18) · Fri 2026-06-12
// Week 1 theme: Ball Mastery Foundation
// Run from TFA-app dir:  node ../../<outputs>/add_session3.mjs

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { randomUUID } from 'crypto'

const firebaseConfig = {
  apiKey:            'AIzaSyBFNUsqBSIGQkD0cf8AswlroicLmyzNzE8',
  authDomain:        'tfa-academy.firebaseapp.com',
  projectId:         'tfa-academy',
  storageBucket:     'tfa-academy.firebasestorage.app',
  messagingSenderId: '983148814427',
  appId:             '1:983148814427:web:d69e7d6665527b8490df7e',
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

const drills = [
  { id: randomUUID(), name: 'High-tempo pattern circuit',            category: 'Ball Mastery',  duration: 10, notes: 'Warm-up' },
  { id: randomUUID(), name: 'Receiving under pressure, first-touch', category: 'Ball Mastery',  duration: 20, notes: 'Technical block' },
  { id: randomUUID(), name: '1v1 transition game',                   category: '1v1 Moves',     duration: 20, notes: 'Both ends' },
  { id: randomUUID(), name: 'Positional play 6v4',                   category: 'Team Tactics',  duration: 25, notes: 'Breaking lines' },
  { id: randomUUID(), name: 'Conditioned game: combination goals',   category: 'Finishing',     duration: 15, notes: 'Goals after combination only' },
]

const base = {
  date:          '2026-06-12',
  title:         'Ball Mastery Foundation',
  drills,
  attendanceIds: [],
  coachNotes:    'Session 3 · Week 1 · Group C · 90 min',
  createdAt:     serverTimestamp(),
}

async function run() {
  for (const ageGroup of ['U16', 'U18']) {
    const ref = await addDoc(collection(db, 'sessions'), { ...base, ageGroup })
    console.log(`✓ Added ${ageGroup} session — id: ${ref.id}`)
  }
  console.log('Done.')
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
