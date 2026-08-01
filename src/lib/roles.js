export const ROLES = ['parent', 'coach', 'admin']

export const ROLE_LABEL = {
  parent: 'Parent',
  coach:  'Coach',
  admin:  'Admin',
}

export const ROLE_TAGLINE = {
  parent: 'Your child’s development · daily',
  coach:  'Today · squad · evaluations',
  admin:  'Revenue · leads · payments',
}

export const ROLE_SUBTITLE = {
  parent: 'Player development',
  coach:  'Coach dashboard',
  admin:  'Academy admin',
}

// Roles that require a PIN gate.
export const PIN_GATED = new Set(['coach', 'admin'])
export const COACH_PIN = '1234'
export const ADMIN_PIN = '4321'

export function loadRole() {
  return sessionStorage.getItem('tfa_role')
}

export function saveRole(role) {
  if (role) sessionStorage.setItem('tfa_role', role)
  else sessionStorage.removeItem('tfa_role')
}
