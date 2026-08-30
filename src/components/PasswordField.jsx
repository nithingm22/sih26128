import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

// Reusable password field with a show/hide toggle. Follows the
// form/input styling from the approved design system: 40px height,
// 1px border, 6px radius, visible label above the field.
export default function PasswordField({
  label = 'Password',
  value,
  onChange,
  autoComplete = 'current-password',
  required = false,
}) {
  const [visible, setVisible] = useState(false)
  const inputId = useId()

  return (
    <div>
      <label
        htmlFor={inputId}
        className="block text-[13px] font-medium text-steel mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          placeholder="Enter your password"
          className="w-full h-10 pl-3 pr-10 rounded-control border border-border bg-surface text-sm text-ink placeholder:text-steel/70 focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 flex items-center px-3 text-steel hover:text-ink"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  )
}
