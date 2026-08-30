import { Stethoscope, ShieldCheck } from 'lucide-react'

const ROLES = [
  { value: 'vet', label: 'Veterinarian', icon: Stethoscope },
  { value: 'admin', label: 'Admin', icon: ShieldCheck },
]

// One login screen serves both roles — this only indicates which
// role the person is signing in as, it does not route to a
// separate page. The backend/auth response ultimately determines
// the actual role and permissions once wired in.
export default function RoleToggle({ value, onChange }) {
  return (
    <div>
      <p className="block text-[13px] font-medium text-steel mb-1.5">
        Signing in as
      </p>
      <div
        role="radiogroup"
        aria-label="Select role"
        className="grid grid-cols-2 gap-2"
      >
        {ROLES.map(({ value: roleValue, label, icon: Icon }) => {
          const active = value === roleValue
          return (
            <button
              key={roleValue}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(roleValue)}
              className={`flex items-center justify-center gap-2 h-10 rounded-control border text-sm font-medium transition-colors ${
                active
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-surface text-steel hover:bg-surface-hover'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
