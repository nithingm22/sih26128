import { useId, useState } from 'react'
import { X } from 'lucide-react'
import PasswordField from './PasswordField'
import { isDuplicateVetEmail, isDuplicateVetPhone } from '../services/mockData'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// Accepts a plain 10-digit number, with or without spaces/dashes, and
// an optional leading +<country code>. Intentionally simple ("reasonable
// phone validation" per the brief) rather than a full international
// phone library — this is mock data entry, not billing/SMS.
const PHONE_PATTERN = /^\+?\d{1,3}[\s-]?\d{10}$/

function normalizePhoneForCheck(phone) {
  return phone.replace(/[\s-]/g, '')
}

const EMPTY_FORM = { name: '', phone: '', email: '', password: '', status: 'active' }

// Shared Add/Edit form. `veterinarian` (optional) switches the modal
// into edit mode and pre-fills the fields; omitting it (or passing
// null) is add mode. Duplicate email/phone checks exclude the vet
// currently being edited, so saving a vet's own unchanged email
// doesn't trip the duplicate check on itself.
//
// The parent (AdminVeterinarians.jsx) remounts this component with a
// fresh `key` whenever it opens for add vs. a different vet to edit,
// so the form's initial state below is simply derived from props at
// mount time — no effect-driven setState needed to "resync" it.
export default function VeterinarianModal({ open, veterinarian, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    veterinarian
      ? {
          name: veterinarian.name,
          phone: veterinarian.phone,
          email: veterinarian.email,
          password: veterinarian.password,
          status: veterinarian.status,
        }
      : EMPTY_FORM,
  )
  const [errors, setErrors] = useState({})
  const titleId = useId()

  const isEdit = veterinarian != null

  if (!open) return null

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function validate() {
    const nextErrors = {}
    const name = form.name.trim()
    const phone = form.phone.trim()
    const email = form.email.trim()
    const password = form.password

    if (!name) nextErrors.name = 'Veterinarian name is required.'

    if (!phone) {
      nextErrors.phone = 'Phone number is required.'
    } else if (!PHONE_PATTERN.test(normalizePhoneForCheck(phone))) {
      nextErrors.phone = 'Enter a valid 10-digit phone number.'
    } else if (isDuplicateVetPhone(phone, veterinarian?.id ?? null)) {
      nextErrors.phone = 'This phone number is already in use by another veterinarian.'
    }

    if (!email) {
      nextErrors.email = 'Email is required.'
    } else if (!EMAIL_PATTERN.test(email)) {
      nextErrors.email = 'Enter a valid email address.'
    } else if (isDuplicateVetEmail(email, veterinarian?.id ?? null)) {
      nextErrors.email = 'This email is already in use by another veterinarian.'
    }

    if (!password) nextErrors.password = 'Password is required.'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    onSave({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      password: form.password,
      status: form.status,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md bg-surface border border-border rounded-card p-6 shadow-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className="text-lg font-semibold text-ink">
            {isEdit ? 'Edit Veterinarian' : 'Add Veterinarian'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-steel hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <TextField
            label="Veterinarian Name"
            required
            value={form.name}
            onChange={(v) => update('name', v)}
            error={errors.name}
            placeholder="e.g. Dr. Anitha Raj"
          />

          <TextField
            label="Phone"
            required
            value={form.phone}
            onChange={(v) => update('phone', v)}
            error={errors.phone}
            placeholder="e.g. 9876543210"
            inputMode="tel"
          />

          <TextField
            label="Email"
            required
            value={form.email}
            onChange={(v) => update('email', v)}
            error={errors.email}
            placeholder="e.g. anitha@vetcare.in"
            inputMode="email"
          />

          <div>
            <PasswordField
              label="Password *"
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              autoComplete="new-password"
            />
            {errors.password && (
              <p role="alert" className="mt-1 text-xs text-risk-critical">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="vet-status" className="block text-[13px] font-medium text-steel mb-1.5">
              Status
            </label>
            <select
              id="vet-status"
              value={form.status}
              onChange={(e) => update('status', e.target.value)}
              className="w-full h-10 px-3 rounded-control border border-border bg-app-bg text-sm text-ink focus:border-primary focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <p className="text-xs text-steel bg-app-bg border border-border rounded-control px-3 py-2.5">
            This is frontend/mock data only — not yet connected to a backend.
            Passwords are stored in plain text here purely so the demo Login
            page has something to check; the real backend will hash and
            secure credentials properly.
          </p>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-control border border-border text-sm font-medium text-ink hover:bg-app-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-4 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              {isEdit ? 'Save Changes' : 'Add Veterinarian'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TextField({ label, value, onChange, required, placeholder, error, inputMode }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-steel mb-1.5">
        {label}
        {required && ' *'}
      </label>
      <input
        id={id}
        type="text"
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full h-10 px-3 rounded-control border bg-surface text-sm text-ink placeholder:text-steel/70 focus:outline-none ${
          error ? 'border-risk-critical focus:border-risk-critical' : 'border-border focus:border-primary'
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs text-risk-critical">
          {error}
        </p>
      )}
    </div>
  )
}
