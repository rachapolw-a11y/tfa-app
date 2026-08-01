// Badge catalog — client-side definitions for the badge set.
// Firestore stores one doc per (playerId, badgeId) unlock; the catalog here
// holds the visual identity (label + Lucide icon) for each badge.
// Decoupled from any UI so future surfaces (parent, admin, share image) can
// reuse the same set.
import { Star, Zap, Trophy, Crosshair, Target } from 'lucide-react'

export const BADGE_CATALOG = [
  { id: 'top-rated', label: 'Top\nrated', Icon: Star },
  { id: 'on-fire',   label: 'On\nfire',   Icon: Zap },
  { id: '100-club',  label: '100\nclub',  Icon: Trophy },
  { id: 'streak-4',  label: 'Streak\n×4', Icon: Crosshair },
  { id: 'hat-trick', label: 'Hat\ntrick', Icon: Target },
  { id: 'captain',   label: 'Captain',    Icon: Star },
  { id: 'iron-wall', label: 'Iron\nwall', Icon: Trophy },
  { id: 'playmaker', label: 'Play\nmaker',Icon: Zap },
  { id: 'mvp',       label: 'MVP',        Icon: Trophy },
]
