import { useId, useState } from 'react'
import { X } from 'lucide-react'

function Field({ label, value, onChange, required, placeholder }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-medium text-steel mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-control border border-border bg-surface text-sm text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none"
      />
    </div>
  )
}

// Frontend-only "New Case" form. There is no POST /cases endpoint
// yet, so submitting never adds a row to the mock CASES list or
// simulates a fake success toast — it just closes. The shape of
// these fields already matches the Report portion of the locked
// API contract, so wiring this up later is additive, not a rewrite.
export default function NewCaseModal({ open, onClose }) {
  const [animalName, setAnimalName] = useState('')
  const [species, setSpecies] = useState('')
  const [location, setLocation] = useState('')
  const [symptoms, setSymptoms] = useState('')
  const titleId = useId()
  const symptomsId = useId()

  if (!open) return null

  function resetAndClose() {
    setAnimalName('')
    setSpecies('')
    setLocation('')
    setSymptoms('')
    onClose()
  }

  function handleSubmit(e) {
    e.preventDefault()
    resetAndClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={resetAndClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-md bg-surface border border-border rounded-card p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className="text-lg font-semibold text-ink">
            New Case
          </h2>
          <button
            type="button"
            onClick={resetAndClose}
            aria-label="Close"
            className="text-steel hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Animal name" value={animalName} onChange={setAnimalName} required />
          <Field label="Species" value={species} onChange={setSpecies} required placeholder="e.g. Cattle, Goat, Poultry" />
          <Field label="Location" value={location} onChange={setLocation} required placeholder="e.g. Erode District" />

          <div>
            <label htmlFor={symptomsId} className="block text-[13px] font-medium text-steel mb-1.5">
              Symptoms
            </label>
            <textarea
              id={symptomsId}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
              placeholder="Describe observed symptoms"
              className="w-full px-3 py-2 rounded-control border border-border bg-surface text-sm text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none resize-none"
            />
          </div>

          <p className="text-xs text-steel bg-app-bg border border-border rounded-control px-3 py-2.5">
            Case submission isn't connected to a backend yet — this form is UI-only for now.
          </p>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={resetAndClose}
              className="h-10 px-4 rounded-control border border-border text-sm font-medium text-ink hover:bg-app-bg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-4 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Save Case
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
