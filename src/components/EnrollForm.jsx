import { useState } from 'react'
import { addLead } from '../lib/storage'
import { Button } from './ui'
import { CheckCircle2 } from 'lucide-react'

const AGE_GROUPS = ['U8', 'U10', 'U12', 'U14', 'U16', 'U18']
const POSITIONS  = ['GK', 'DEF', 'MID', 'FWD']

const EMPTY = {
  childName: '', parentName: '', parentPhone: '',
  ageGroup: 'U10', position: 'MID', dob: '', notes: '',
}

export default function EnrollForm({ onBack }) {
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [done, setDone]     = useState(false)
  const [error, setError]   = useState('')

  function field(key, val) { setForm(f => ({ ...f, [key]: val })) }

  async function submit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await addLead({
        name:       form.childName.trim(),
        parentName: form.parentName.trim(),
        parentPhone: form.parentPhone.trim(),
        ageGroup:   form.ageGroup,
        position:   form.position,
        dob:        form.dob,
        stage:      'new',
        source:     'self_enrollment',
        notes:      form.notes.trim() ||
                    `Self-enrolled via app. Contact: ${form.parentPhone.trim()}`,
      })
      setDone(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-5 py-6 text-center">
        <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-gold" />
        </div>
        <div>
          <div
            className="font-display font-bold uppercase text-cream text-[24px]"
            style={{ lineHeight: 0.9 }}
          >
            Submitted!
          </div>
          <p className="font-body text-sm text-muted mt-3 max-w-[280px] leading-relaxed">
            TFA Admin will contact you via LINE with your child's access code.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="mt-2 px-6 h-11 rounded-md border border-white/[0.1] text-muted font-condensed font-bold uppercase tracking-[0.14em] text-xs hover:bg-white/[0.05] transition-colors"
        >
          Back to home
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        {/* Child info */}
        <div className="col-span-2">
          <label className="label">Child's Full Name *</label>
          <input
            className="input"
            required
            autoFocus
            placeholder="e.g. Somchai Jaidee"
            value={form.childName}
            onChange={e => field('childName', e.target.value)}
          />
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
        <div className="col-span-2">
          <label className="label">Date of Birth</label>
          <input
            className="input"
            type="date"
            value={form.dob}
            onChange={e => field('dob', e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="col-span-2 border-t border-white/[0.07] my-1" />

        {/* Parent contact */}
        <div className="col-span-2">
          <label className="label">Parent Name *</label>
          <input
            className="input"
            required
            placeholder="e.g. Khun Malee"
            value={form.parentName}
            onChange={e => field('parentName', e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="label">LINE ID or Phone *</label>
          <input
            className="input"
            required
            placeholder="@line_id or 08x-xxx-xxxx"
            value={form.parentPhone}
            onChange={e => field('parentPhone', e.target.value)}
          />
        </div>
        <div className="col-span-2">
          <label className="label">Notes (optional)</label>
          <textarea
            className="input"
            rows={2}
            placeholder="Any special notes for the coach…"
            value={form.notes}
            onChange={e => field('notes', e.target.value)}
          />
        </div>
      </div>

      {error && (
        <div className="font-condensed text-[11.5px] text-red-400 text-center">{error}</div>
      )}

      <div className="flex gap-2 pt-2 border-t border-white/[0.08]">
        <button
          type="button"
          onClick={onBack}
          className="h-11 px-5 rounded-md border border-white/[0.1] text-muted font-condensed font-bold uppercase tracking-[0.14em] text-xs hover:bg-white/[0.05] transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 h-11 rounded-md bg-gold text-navy font-condensed font-bold uppercase tracking-[0.14em] text-xs disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Sending…' : 'Submit Enrollment'}
        </button>
      </div>
    </form>
  )
}
