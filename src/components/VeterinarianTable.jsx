import { useState } from 'react'
import { Users, Pencil, UserX, UserCheck } from 'lucide-react'

const MASKED_PASSWORD = '••••••••'

function StatusPill({ status }) {
  const isActive = status === 'active'
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-control text-xs font-medium ${
        isActive ? 'bg-risk-low/10 text-risk-low' : 'bg-steel/10 text-steel'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-risk-low' : 'bg-steel'}`}
        aria-hidden="true"
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  )
}

// Deactivating removes a vet from future assignment dropdowns, so it
// gets a lightweight inline confirm step (per the brief's manual
// test list). Reactivating is the "safe" direction and doesn't need
// one. Implemented as a small state machine local to this component
// rather than a second modal, to keep the interaction fast.
export default function VeterinarianTable({ veterinarians, onEdit, onSetStatus }) {
  const [confirmingId, setConfirmingId] = useState(null)

  if (veterinarians.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-card p-10 flex flex-col items-center text-center">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-app-bg text-steel mb-3">
          <Users size={20} />
        </div>
        <p className="text-sm font-semibold text-ink">No veterinarians yet</p>
      </div>
    )
  }

  function handleDeactivateClick(id) {
    setConfirmingId(id)
  }

  function confirmDeactivate(id) {
    onSetStatus(id, 'inactive')
    setConfirmingId(null)
  }

  function ActionCell({ vet }) {
    if (confirmingId === vet.id) {
      return (
        <div className="flex items-center justify-end gap-2">
          <span className="text-xs text-steel">Deactivate?</span>
          <button
            type="button"
            onClick={() => confirmDeactivate(vet.id)}
            className="h-7 px-2.5 rounded-control bg-risk-high text-white text-xs font-medium hover:opacity-90 transition-opacity"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={() => setConfirmingId(null)}
            className="h-7 px-2.5 rounded-control border border-border text-xs font-medium text-ink hover:bg-app-bg transition-colors"
          >
            Cancel
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => onEdit(vet)}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary-hover"
        >
          <Pencil size={13} />
          Edit
        </button>
        {vet.status === 'active' ? (
          <button
            type="button"
            onClick={() => handleDeactivateClick(vet.id)}
            className="inline-flex items-center gap-1 text-xs font-medium text-risk-high hover:opacity-80"
          >
            <UserX size={13} />
            Deactivate
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onSetStatus(vet.id, 'active')}
            className="inline-flex items-center gap-1 text-xs font-medium text-risk-low hover:opacity-80"
          >
            <UserCheck size={13} />
            Activate
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-card overflow-hidden">
      {/* Desktop / tablet table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-border">
              {['Veterinarian Name', 'Phone', 'Email', 'Password', 'Status', ''].map((heading) => (
                <th key={heading} className="text-left px-4 py-3">
                  <span className="text-[11px] font-semibold tracking-wide uppercase text-steel">
                    {heading}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {veterinarians.map((vet) => (
              <tr key={vet.id} className="border-b border-border last:border-0 hover:bg-app-bg">
                <td className="px-4 py-3 font-medium text-ink whitespace-nowrap">{vet.name}</td>
                <td className="px-4 py-3 text-steel whitespace-nowrap">{vet.phone}</td>
                <td className="px-4 py-3 text-steel whitespace-nowrap">{vet.email}</td>
                <td className="px-4 py-3 text-steel whitespace-nowrap tracking-widest">
                  {MASKED_PASSWORD}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StatusPill status={vet.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <ActionCell vet={vet} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile compact cards */}
      <ul className="md:hidden divide-y divide-border">
        {veterinarians.map((vet) => (
          <li key={vet.id} className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{vet.name}</p>
                <p className="text-xs text-steel truncate">{vet.phone}</p>
                <p className="text-xs text-steel truncate">{vet.email}</p>
              </div>
              <StatusPill status={vet.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-steel tracking-widest">{MASKED_PASSWORD}</span>
              <ActionCell vet={vet} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
