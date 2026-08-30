import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PawPrint, LogIn, ShieldAlert } from 'lucide-react'
import PasswordField from '../components/PasswordField'
import RoleToggle from '../components/RoleToggle'
import { authenticateVeterinarian } from '../services/mockData'

// Login uses local mock authentication only — see the mockData.js
// header comment and authenticateVeterinarian(). There is no real
// backend, no hashing, no session/token; this exists purely so the
// demo can show a veterinarian created in Admin's Veterinarian
// Management actually being able to sign in. Admin sign-in has no
// equivalent mock credential store yet (no admin-management feature
// exists), so it stays a UI-only stub — any filled-in submission is
// accepted, same behavior as before this step.
const AUTH_ERROR_MESSAGES = {
  not_found: 'No account found with that phone number or email.',
  wrong_password: 'Incorrect password. Please try again.',
  inactive: 'Your account is inactive. Please contact the administrator.',
}

export default function Login() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('vet')
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [authError, setAuthError] = useState(null)

  const identifierMissing = submitAttempted && identifier.trim() === ''
  const passwordMissing = submitAttempted && password.trim() === ''

  function handleRoleChange(nextRole) {
    setRole(nextRole)
    setAuthError(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitAttempted(true)
    setAuthError(null)

    if (identifier.trim() === '' || password.trim() === '') return

    if (role === 'admin') {
      // No admin credential store exists yet — this stays a
      // frontend-only stub, same as before Veterinarian Management.
      navigate('/admin')
      return
    }

    const result = authenticateVeterinarian(identifier, password)
    if (result.ok) {
      navigate('/dashboard')
      return
    }

    setAuthError(AUTH_ERROR_MESSAGES[result.reason] ?? 'Unable to sign in. Please try again.')
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-app-bg">
      {/* Branding panel */}
      <div className="md:w-[42%] lg:w-[38%] bg-sidebar-bg text-white flex flex-col justify-between px-6 py-8 md:px-10 md:py-12">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-9 h-9 rounded-control bg-primary shrink-0">
            <PawPrint size={19} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">
              Livestock Health Surveillance
            </p>
            <p className="text-[11px] text-white/45 leading-tight">
              SIH26128
            </p>
          </div>
        </div>

        <div className="hidden md:block max-w-sm">
          <h1 className="text-2xl font-semibold leading-snug mb-3">
            Early-warning and response platform for livestock health
          </h1>
          <p className="text-sm text-white/60 leading-relaxed">
            A shared workspace for veterinarians and administrators to
            review reported cases, understand AI-assisted risk
            assessments, and coordinate the response to possible
            disease clusters.
          </p>
        </div>

        <p className="hidden md:block text-[11px] text-white/35 leading-relaxed max-w-sm">
          Risk assessments are decision support only and do not
          replace veterinary judgment. Every flagged case is intended
          for professional review before any action is taken.
        </p>
      </div>

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-4 py-10 md:py-8">
        <div className="w-full max-w-sm">
          <div className="bg-surface border border-border rounded-card p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-ink mb-1">Sign in</h2>
            <p className="text-sm text-steel mb-6">
              Enter your credentials to access the surveillance
              dashboard.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-4"
            >
              <RoleToggle value={role} onChange={handleRoleChange} />

              <div>
                <label
                  htmlFor="login-identifier"
                  className="block text-[13px] font-medium text-steel mb-1.5"
                >
                  Phone or email
                </label>
                <input
                  id="login-identifier"
                  type="text"
                  inputMode="email"
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="you@example.com"
                  aria-invalid={identifierMissing}
                  aria-describedby={
                    identifierMissing ? 'login-identifier-error' : undefined
                  }
                  className={`w-full h-10 px-3 rounded-control border bg-surface text-sm text-ink placeholder:text-steel/70 focus:outline-none ${
                    identifierMissing
                      ? 'border-risk-critical focus:border-risk-critical'
                      : 'border-border focus:border-primary'
                  }`}
                />
                {identifierMissing && (
                  <p
                    id="login-identifier-error"
                    role="alert"
                    className="mt-1 text-xs text-risk-critical"
                  >
                    Enter your phone number or email to continue.
                  </p>
                )}
              </div>

              <div>
                <PasswordField
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {passwordMissing && (
                  <p role="alert" className="mt-1 text-xs text-risk-critical">
                    Enter your password to continue.
                  </p>
                )}
              </div>

              {authError && (
                <p
                  role="alert"
                  className="text-xs text-risk-critical bg-risk-critical/10 border border-risk-critical/30 rounded-control px-3 py-2.5"
                >
                  {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full h-10 rounded-control bg-primary text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary-hover transition-colors"
              >
                <LogIn size={16} />
                Sign in
              </button>
            </form>

            {/* Demo-mode notice. Veterinarian sign-in checks against the
                local mock veterinarian directory (see Admin's
                Veterinarian Management); admin sign-in is still a UI-only
                stub. Neither is real, backend-verified authentication. */}
            <div className="mt-5 flex items-start gap-2.5 px-3 py-2.5 rounded-control bg-app-bg border border-border">
              <ShieldAlert size={16} className="text-accent-blue shrink-0 mt-0.5" />
              <p className="text-xs text-steel leading-relaxed">
                This uses local demo credentials only — no backend
                authentication is connected yet.
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs text-steel md:hidden">
            Risk assessments are decision support only and do not
            replace veterinary judgment.
          </p>
        </div>
      </div>
    </div>
  )
}
