const KEYS = {
  players: 'tfa_players',
  sessions: 'tfa_sessions',
  evaluations: 'tfa_evaluations',
}

function load(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export const storage = {
  getPlayers: () => load(KEYS.players),
  savePlayers: (data) => save(KEYS.players, data),
  getSessions: () => load(KEYS.sessions),
  saveSessions: (data) => save(KEYS.sessions, data),
  getEvaluations: () => load(KEYS.evaluations),
  saveEvaluations: (data) => save(KEYS.evaluations, data),
}
