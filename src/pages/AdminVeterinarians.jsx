import { useState } from 'react'
import { UserCog, Plus, Info } from 'lucide-react'
import VeterinarianTable from '../components/VeterinarianTable'
import VeterinarianModal from '../components/VeterinarianModal'
import {
  getVeterinarians,
  addVeterinarian,
  updateVeterinarian,
  setVeterinarianStatus,
} from '../services/mockData'

// Admin-only veterinarian directory. This is the SAME VETS array
// used everywhere else in the app (case assignment, My Tasks
// reassignment, Calendar reminders, Login) — see mockData.js. Adding
// or editing a vet here mutates that shared array in place, so every
// other page picks up the change the next time it renders. There is
// no separate "admin's copy" of veterinarian data.
export default function AdminVeterinarians() {
  const [veterinarians, setVeterinarians] = useState(() => getVeterinarians())
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVet, setEditingVet] = useState(null)

  function refresh() {
    // getVeterinarians() returns the live VETS array reference; copy
    // it into a new array so React sees a changed value and re-renders.
    setVeterinarians([...getVeterinarians()])
  }

  function openAddModal() {
    setEditingVet(null)
    setModalOpen(true)
  }

  function openEditModal(vet) {
    setEditingVet(vet)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
    setEditingVet(null)
  }

  function handleSave(formData) {
    if (editingVet) {
      updateVeterinarian(editingVet.id, formData)
    } else {
      addVeterinarian(formData)
    }
    refresh()
    closeModal()
  }

  function handleSetStatus(id, status) {
    setVeterinarianStatus(id, status)
    refresh()
  }

  return (
    <div className="max-w-[1100px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-ink flex items-center gap-2">
            <UserCog size={22} className="text-primary" />
            Veterinarian Management
          </h2>
          <p className="text-sm text-steel mt-1">
            Add, edit, and manage the veterinarians who can be assigned to cases.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 h-10 px-4 rounded-control bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus size={16} />
          Add Veterinarian
        </button>
      </div>

      <VeterinarianTable
        veterinarians={veterinarians}
        onEdit={openEditModal}
        onSetStatus={handleSetStatus}
      />

      <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-control bg-app-bg border border-border">
        <Info size={15} className="text-accent-blue shrink-0 mt-0.5" />
        <p className="text-xs text-steel leading-relaxed">
          Deactivated veterinarians can no longer be selected for new case or
          task assignments, but existing historical assignments are kept
          exactly as they are. This directory is frontend/mock data only —
          it resets on page reload until a real backend is connected.
        </p>
      </div>

      <VeterinarianModal
        key={modalOpen ? `modal-${editingVet?.id ?? 'add'}` : 'modal-closed'}
        open={modalOpen}
        veterinarian={editingVet}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  )
}
