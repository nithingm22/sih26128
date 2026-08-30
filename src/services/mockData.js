// ---------------------------------------------------------------
// Synthetic demo data — mirrors the locked API contract shapes
// (docs/API_CONTRACT.md) so it can be swapped for real API calls
// later without changing any component.
//
// Field names intentionally match the contract exactly:
//   Case { id, report_id, status, assigned_vet_id, lab_result }
//   Report { id, animal_id, symptoms, duration_days,
//             other_animals_affected, lat, lng, created_at, synced }
//   RiskResult { report_id, ranked_diseases, breed_note, age_note }
//   Animal { id, owner_id, name, species, breed, age,
//             vaccination_status }
//
// This module is the ONLY place synthetic data lives. Pages and
// components must import from here (or later, from services/api.js
// once it's wired to FastAPI) — never inline data in a component.
// ---------------------------------------------------------------

// Small, coherent case list — IDs are stable so links from the
// Dashboard ("View Case") resolve to the same case in CaseDetail
// once that page is implemented.
export const CASES = [
  {
    id: 204,
    animal: { name: 'Cow 002', species: 'Cattle' },
    location: 'Erode District',
    risk_percent: 82,
    risk_level: 'high',
    status: 'vet_review',
    created_at: '2026-08-27T09:15:00+05:30',
    assigned_vet_id: 1,
  },
  {
    id: 198,
    animal: { name: 'Goat 014', species: 'Goat' },
    location: 'Salem District',
    risk_percent: 74,
    risk_level: 'high',
    status: 'ai_assessed',
    created_at: '2026-08-27T07:40:00+05:30',
    assigned_vet_id: null,
  },
  {
    id: 191,
    animal: { name: 'Cow 011', species: 'Cattle' },
    location: 'Erode District',
    risk_percent: 68,
    risk_level: 'medium',
    status: 'field_visit',
    created_at: '2026-08-26T18:05:00+05:30',
    assigned_vet_id: 2,
  },
  {
    id: 187,
    animal: { name: 'Buffalo 003', species: 'Buffalo' },
    location: 'Namakkal District',
    risk_percent: 55,
    risk_level: 'medium',
    status: 'lab_pending',
    created_at: '2026-08-26T14:20:00+05:30',
    assigned_vet_id: 3,
  },
  {
    id: 179,
    animal: { name: 'Hen Flock 22', species: 'Poultry' },
    location: 'Namakkal District',
    risk_percent: 31,
    risk_level: 'low',
    status: 'reported',
    created_at: '2026-08-26T11:50:00+05:30',
    assigned_vet_id: null,
  },
  {
    id: 172,
    animal: { name: 'Goat 009', species: 'Goat' },
    location: 'Salem District',
    risk_percent: 24,
    risk_level: 'low',
    status: 'closed',
    created_at: '2026-08-25T16:30:00+05:30',
    assigned_vet_id: 1,
  },
  {
    id: 165,
    animal: { name: 'Cow 006', species: 'Cattle' },
    location: 'Erode District',
    risk_percent: 88,
    risk_level: 'high',
    status: 'confirmed',
    created_at: '2026-08-25T10:10:00+05:30',
    assigned_vet_id: 2,
  },
  {
    id: 158,
    animal: { name: 'Goat 002', species: 'Goat' },
    location: 'Salem District',
    risk_percent: 47,
    risk_level: 'medium',
    status: 'vet_review',
    created_at: '2026-08-24T20:00:00+05:30',
    assigned_vet_id: 3,
  },
]

// Vet directory — mirrors the contract's future `GET /vets` shape.
// `assigned_vet_id` on a Case is a foreign key into this list;
// `null` means the case hasn't been assigned to a vet yet (still
// reported/ai_assessed). Kept here, not inline in a component, for
// the same reason as the rest of this file: an eventual API layer
// only needs to replace these functions, nothing that calls them.
//
// This array is intentionally mutable (not frozen, not reassigned)
// — Admin's Veterinarian Management page adds/edits vets by mutating
// it in place via the functions below, so every other page that
// imports VETS sees the change on its next render without a global
// store. Everything here is in-memory only: it resets on page
// reload, same as every other "frontend-only for now" feature in
// this app (Case Detail notes, Tasks, Calendar reminders, etc).
//
// `password` is plaintext for this mock only, purely so the demo
// Login flow has something to check against — this is explicitly
// NOT how the real backend will store credentials. The backend team
// will hash/salt passwords and do real authentication; this object
// shape (id, name, phone, email, password, status) is only meant to
// make swapping in POST /veterinarians / POST /login later additive.
export const VETS = [
  {
    id: 1,
    name: 'Dr. Anitha Raj',
    phone: '9876543210',
    email: 'anitha@vetcare.in',
    password: 'vet@123',
    status: 'active',
  },
  {
    id: 2,
    name: 'Dr. Karthik Subramaniam',
    phone: '9876543211',
    email: 'karthik@vetcare.in',
    password: 'vet@123',
    status: 'active',
  },
  {
    id: 3,
    name: 'Dr. Priya Menon',
    phone: '9876543212',
    email: 'priya@vetcare.in',
    password: 'vet@123',
    status: 'active',
  },
]

export function getVetName(vetId) {
  if (vetId == null) return 'Unassigned'
  return VETS.find((v) => v.id === vetId)?.name ?? 'Unassigned'
}

export function getVeterinarians() {
  return VETS
}

export function getVeterinarianById(id) {
  return VETS.find((v) => v.id === id)
}

// Vets that should be OFFERED for a new case/task/reminder
// assignment — active vets only. `currentVetId` (optional) keeps an
// already-assigned vet visible/selectable in that specific dropdown
// even if they've since been deactivated, so an existing assignment
// never silently disappears out from under a select control; it
// just won't appear as a choice anywhere else.
export function getAssignableVets(currentVetId = null) {
  const active = VETS.filter((v) => v.status === 'active')
  if (currentVetId == null) return active
  if (active.some((v) => v.id === currentVetId)) return active

  const current = VETS.find((v) => v.id === currentVetId)
  return current ? [...active, current] : active
}

function normalizedEmail(email) {
  return email.trim().toLowerCase()
}

function normalizedPhone(phone) {
  return phone.trim()
}

export function isDuplicateVetEmail(email, excludeId = null) {
  const target = normalizedEmail(email)
  return VETS.some((v) => v.id !== excludeId && normalizedEmail(v.email) === target)
}

export function isDuplicateVetPhone(phone, excludeId = null) {
  const target = normalizedPhone(phone)
  return VETS.some((v) => v.id !== excludeId && normalizedPhone(v.phone) === target)
}

// Frontend-only "create" — mutates the shared VETS array in place
// (see comment above) rather than returning a new array, so every
// page reading VETS picks up the addition. Swap for a real
// `POST /veterinarians` call later; callers (AdminVeterinarians.jsx)
// don't need to change.
export function addVeterinarian({ name, phone, email, password, status }) {
  const nextId = VETS.reduce((max, v) => Math.max(max, v.id), 0) + 1
  const vet = {
    id: nextId,
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    password,
    status,
  }
  VETS.push(vet)
  return vet
}

// Frontend-only "update" — same in-place-mutation approach as
// addVeterinarian, so it can later become `PUT /veterinarians/:id`.
export function updateVeterinarian(id, updates) {
  const vet = VETS.find((v) => v.id === id)
  if (!vet) return null
  Object.assign(vet, updates)
  return vet
}

// Soft "delete": flips status rather than removing the record, since
// historical cases/tasks/deadlines/reminders reference vets by id —
// removing the row outright would break those references. Mirrors
// the eventual `DELETE /veterinarians/:id` being a deactivate on the
// backend too, per the brief.
export function setVeterinarianStatus(id, status) {
  return updateVeterinarian(id, { status })
}

// Frontend-only mock authentication for the existing Login page.
// Matches by email OR phone (case-insensitive email), then checks
// password and status. Returns a small, explicit result object
// rather than throwing, so Login.jsx can show the right message for
// each failure reason. This is deliberately NOT how real auth will
// work (no hashing, no tokens, no session) — see the mockData.js
// header comment and the Login page's own notice.
export function authenticateVeterinarian(identifier, password) {
  const id = identifier.trim()
  const idLower = id.toLowerCase()

  const vet = VETS.find(
    (v) => v.email.toLowerCase() === idLower || v.phone === id,
  )

  if (!vet) return { ok: false, reason: 'not_found' }
  if (vet.password !== password) return { ok: false, reason: 'wrong_password' }
  if (vet.status !== 'active') return { ok: false, reason: 'inactive', vet }

  return { ok: true, vet }
}

// Case-lifecycle status set, matching the contract's Case.status enum.
export const CASE_STATUSES = [
  'reported',
  'ai_assessed',
  'vet_review',
  'field_visit',
  'lab_pending',
  'confirmed',
  'negative',
  'inconclusive',
  'closed',
]

// Ordered stages shown in the Case Detail workflow stepper. The four
// terminal statuses (confirmed/negative/inconclusive/closed) all
// collapse onto the same final stepper slot — the exact outcome is
// still shown via the StatusBadge elsewhere on the page; the stepper
// is only about how far through the pipeline a case has progressed.
export const CASE_WORKFLOW_STAGES = [
  'reported',
  'ai_assessed',
  'vet_review',
  'field_visit',
  'lab_pending',
]
export const CASE_TERMINAL_STATUSES = ['confirmed', 'negative', 'inconclusive', 'closed']

export function getWorkflowStageIndex(status) {
  const idx = CASE_WORKFLOW_STAGES.indexOf(status)
  if (idx !== -1) return idx
  if (CASE_TERMINAL_STATUSES.includes(status)) return CASE_WORKFLOW_STAGES.length
  return 0
}

// Case Detail lookup. Returns undefined when no case matches the
// given id — CaseDetail.jsx renders a "Case not found" state in
// that situation instead of crashing. Accepts the raw string route
// param directly (`:id` from useParams is always a string).
export function getCaseById(id) {
  const numericId = Number(id)
  return CASES.find((c) => c.id === numericId)
}

// System-generated activity trail for a case, derived entirely from
// fields already on the Case object (status progress, risk, vet
// assignment) — never fabricated notes or medical/diagnostic content.
// The mock data only has one timestamp (created_at) today, so every
// entry uses it; once per-stage timestamps exist on the backend this
// can be swapped for a real GET /cases/:id/activity call.
export function getCaseActivity(caseItem) {
  if (!caseItem) return []

  const stageIndex = getWorkflowStageIndex(caseItem.status)
  const entries = [
    {
      id: 'reported',
      label: 'Case reported',
      detail: `${caseItem.animal.name} (${caseItem.animal.species}) reported in ${caseItem.location}.`,
      at: caseItem.created_at,
    },
  ]

  if (stageIndex >= 1) {
    entries.push({
      id: 'ai_assessed',
      label: 'AI risk assessment completed',
      detail: `Estimated risk: ${caseItem.risk_level} risk (${caseItem.risk_percent}%).`,
      at: caseItem.created_at,
    })
  }

  if (caseItem.assigned_vet_id != null) {
    entries.push({
      id: 'assigned',
      label: 'Veterinarian assigned',
      detail: `Assigned to ${getVetName(caseItem.assigned_vet_id)} for review.`,
      at: caseItem.created_at,
    })
  }

  if (stageIndex >= CASE_WORKFLOW_STAGES.length) {
    entries.push({
      id: 'resolved',
      label: 'Final determination recorded',
      detail: 'See the current status above for the outcome.',
      at: caseItem.created_at,
    })
  }

  return entries
}

// Ordered risk options for filter UIs — order matches the badge's
// visual severity order (low → high), not alphabetical.
export const RISK_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

// Relative date-range options for the Case List's Date filter.
// `days: null` means no lower bound (All time).
const DATE_RANGE_DAYS = { all: null, '24h': 1, '7d': 7, '30d': 30 }
export const CASE_DATE_RANGES = [
  { value: 'all', label: 'All time' },
  { value: '24h', label: 'Last 24 hours' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
]

// Distinct species/locations present in the current case set, used
// to populate the Case List's Species/Location filter dropdowns so
// they never fall out of sync with the data.
export function getUniqueSpecies() {
  return [...new Set(CASES.map((c) => c.animal.species))].sort()
}

export function getUniqueLocations() {
  return [...new Set(CASES.map((c) => c.location))].sort()
}

// Case List summary cards. "Referred" mirrors the Dashboard's own
// "Referred Cases" stat (field_visit = referred out for an in-field
// follow-up) — kept consistent rather than inventing a second,
// competing definition of "referred". "Resolved" = cases that have
// reached a final determination (confirmed, negative, or closed) —
// distinct from "closed" alone, since a confirmed/negative case is
// resolved even before it's formally closed out.
export function getCaseListSummary() {
  const total = CASES.length
  const highRisk = CASES.filter((c) => c.risk_level === 'high').length
  const awaitingReview = CASES.filter((c) =>
    ['reported', 'ai_assessed', 'vet_review'].includes(c.status),
  ).length
  const referred = CASES.filter((c) => c.status === 'field_visit').length
  const resolved = CASES.filter((c) =>
    ['confirmed', 'negative', 'closed'].includes(c.status),
  ).length

  return { total, highRisk, awaitingReview, referred, resolved }
}

// Single entry point for the Case List page: search + every filter
// + sort, all in one place so the page/table components stay dumb.
// Swapping this for `GET /cases?search=&risk=&status=&species=&
// location=&date_range=&sort=&dir=` later is a matter of replacing
// this function's body — CaseList.jsx and CaseListTable never touch
// CASES directly, so neither has to change.
export function getFilteredCases({
  search = '',
  risk = 'all',
  status = 'all',
  species = 'all',
  location = 'all',
  dateRange = 'all',
  sortBy = 'date',
  sortDir = 'desc',
} = {}) {
  const q = search.trim().toLowerCase()
  const days = DATE_RANGE_DAYS[dateRange]
  const cutoff = days ? Date.now() - days * 24 * 60 * 60 * 1000 : null

  const results = CASES.filter((c) => {
    if (risk !== 'all' && c.risk_level !== risk) return false
    if (status !== 'all' && c.status !== status) return false
    if (species !== 'all' && c.animal.species !== species) return false
    if (location !== 'all' && c.location !== location) return false
    if (cutoff !== null && new Date(c.created_at).getTime() < cutoff) return false

    if (q) {
      const haystack = [
        String(c.id),
        c.animal.name,
        c.animal.species,
        c.location,
        c.status.replace(/_/g, ' '),
        c.risk_level,
      ]
        .join(' ')
        .toLowerCase()
      if (!haystack.includes(q)) return false
    }

    return true
  })

  const RISK_ORDER = { low: 0, medium: 1, high: 2 }
  const direction = sortDir === 'asc' ? 1 : -1

  results.sort((a, b) => {
    const cmp =
      sortBy === 'risk'
        ? RISK_ORDER[a.risk_level] - RISK_ORDER[b.risk_level]
        : new Date(a.created_at) - new Date(b.created_at)
    return cmp * direction
  })

  return results
}

// Dashboard summary numbers, coherent with CASES above (not random).
export function getDashboardSummary() {
  const total = CASES.length
  const highRisk = CASES.filter((c) => c.risk_level === 'high').length
  const awaitingReview = CASES.filter((c) =>
    ['reported', 'ai_assessed', 'vet_review'].includes(c.status),
  ).length
  const referred = CASES.filter((c) => c.status === 'field_visit').length

  return { total, highRisk, awaitingReview, referred }
}

// Risk-band distribution for the dashboard chart.
export function getRiskDistribution() {
  return [
    { level: 'Low', count: CASES.filter((c) => c.risk_level === 'low').length },
    {
      level: 'Medium',
      count: CASES.filter((c) => c.risk_level === 'medium').length,
    },
    {
      level: 'High',
      count: CASES.filter((c) => c.risk_level === 'high').length,
    },
  ]
}

// Priority cases = high risk cases still needing action, most recent first.
export function getPriorityCases() {
  return CASES.filter(
    (c) => c.risk_level === 'high' && c.status !== 'closed',
  ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
}

// Recent cases table = all cases, most recent first, capped for the demo.
export function getRecentCases(limit = 6) {
  return [...CASES]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit)
}

// Case search used by the Navbar search box. Matches Case ID, animal
// name/species, location, status, and risk level — case-insensitive,
// trimmed. Kept here (not in the component) alongside the rest of
// the data-access functions so it can later be swapped for a real
// GET /cases?search= call without touching the Navbar/CaseSearch UI.
export function searchCases(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []

  return CASES.filter((c) => {
    const haystack = [
      String(c.id),
      c.animal.name,
      c.animal.species,
      c.location,
      c.status.replace(/_/g, ' '),
      c.risk_level,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(q)
  })
}

// Surveillance snapshot shown on the dashboard. Mirrors fields that
// would come from GET /clusters + GET /dashboard/summary — kept
// separate from the map itself, which is implemented in a later step.
export function getSurveillanceSnapshot() {
  return {
    activeClusters: 1,
    casesInSurveillanceArea: 5,
    recentHighRiskReports: 3,
    leadCluster: {
      disease_name: 'Foot and Mouth Disease (FMD)',
      case_count: 4,
      location: 'Erode District',
    },
  }
}

// ---------------------------------------------------------------
// Surveillance Map helpers
//
// Approximate, publicly-known DISTRICT-LEVEL center coordinates for
// the Tamil Nadu districts appearing in CASES. These are used only
// to place demo markers on the map — they are NOT real farm or
// person locations, and are not represented as precise addresses.
// A small deterministic offset (derived from each case's id) is
// added so multiple cases in the same district fan out into visibly
// separate markers instead of stacking into a single dot.
// ---------------------------------------------------------------
const DISTRICT_COORDINATES = {
  'Erode District': { lat: 11.341, lng: 77.7172 },
  'Salem District': { lat: 11.6643, lng: 78.146 },
  'Namakkal District': { lat: 11.2189, lng: 78.1677 },
}

// Center point / zoom used to frame the map on first load — roughly
// centered over the three districts above.
export const MAP_DEFAULT_CENTER = [11.42, 77.99]
export const MAP_DEFAULT_ZOOM = 9

function jitterFromId(id) {
  const angle = (id % 12) * 30 * (Math.PI / 180)
  const radius = 0.03 + (id % 5) * 0.008
  return { dLat: Math.sin(angle) * radius, dLng: Math.cos(angle) * radius }
}

// Attaches an approximate lat/lng to each case in the given list
// (defaults to every case). Cases whose location has no known
// district coordinate are dropped rather than guessed.
// Accepts an already-filtered case list so the Map page can reuse
// getFilteredCases for risk/status filtering instead of duplicating
// that logic.
export function getCaseMapMarkers(cases = CASES) {
  return cases
    .map((c) => {
      const center = DISTRICT_COORDINATES[c.location]
      if (!center) return null
      const { dLat, dLng } = jitterFromId(c.id)
      return { ...c, lat: center.lat + dLat, lng: center.lng + dLng }
    })
    .filter(Boolean)
}

// Surveillance Map summary panel. Distinct from getDashboardSummary
// (different label set per this feature's brief — "Active/Under
// Review" and "Districts Affected") but derived from the same CASES,
// so the two never disagree about what's actually in the data.
export function getMapSummary() {
  const total = CASES.length
  const highRisk = CASES.filter((c) => c.risk_level === 'high').length
  const activeUnderReview = CASES.filter((c) =>
    ['reported', 'ai_assessed', 'vet_review', 'field_visit', 'lab_pending'].includes(
      c.status,
    ),
  ).length
  const districtsAffected = new Set(CASES.map((c) => c.location)).size

  return { total, highRisk, activeUnderReview, districtsAffected }
}

// Cases grouped by district for the "Risk by District" panel,
// sorted by case count (busiest district first).
export function getDistrictSummary() {
  const byDistrict = new Map()

  for (const c of CASES) {
    if (!byDistrict.has(c.location)) {
      byDistrict.set(c.location, { location: c.location, total: 0, highRisk: 0 })
    }
    const entry = byDistrict.get(c.location)
    entry.total += 1
    if (c.risk_level === 'high') entry.highRisk += 1
  }

  return [...byDistrict.values()].sort((a, b) => b.total - a.total)
}

// ---------------------------------------------------------------
// Admin Dashboard helpers
// ---------------------------------------------------------------

// Case counts by status, in the same fixed order as CASE_STATUSES,
// for the Admin Dashboard's "Case Status Overview" chart. Labels are
// intentionally NOT duplicated here — StatusOverviewChart pulls them
// from StatusBadge's STATUS_LABELS so there is exactly one place a
// status label is ever defined.
export function getStatusDistribution() {
  return CASE_STATUSES.map((status) => ({
    status,
    count: CASES.filter((c) => c.status === status).length,
  }))
}

// A vet counts as "active" if they currently have at least one case
// assigned — this is the only notion of "active" the mock data can
// actually support (there's no login/session concept yet).
export function getActiveVeterinarianCount() {
  const assignedIds = new Set(
    CASES.filter((c) => c.assigned_vet_id != null).map((c) => c.assigned_vet_id),
  )
  return assignedIds.size
}

// Admin summary cards. Total/High Risk/Awaiting Review/Referred/
// Resolved intentionally reuse the exact same definitions as
// getCaseListSummary (Case List's own stat cards) so the two pages
// never disagree about what "resolved" or "referred" means — only
// activeVeterinarians is new here.
export function getAdminSummary() {
  return {
    ...getCaseListSummary(),
    activeVeterinarians: getActiveVeterinarianCount(),
  }
}

// One row per registered vet plus a trailing "Unassigned" row for
// cases with no assigned_vet_id — so the workload table always adds
// up to the full case count, and an admin can see unassigned cases
// as their own line rather than them silently vanishing.
export function getVeterinarianWorkload() {
  const awaitingSet = ['reported', 'ai_assessed', 'vet_review']

  const rows = VETS.map((vet) => {
    const assigned = CASES.filter((c) => c.assigned_vet_id === vet.id)
    return {
      id: vet.id,
      name: vet.name,
      assignedCount: assigned.length,
      highRiskCount: assigned.filter((c) => c.risk_level === 'high').length,
      awaitingReviewCount: assigned.filter((c) => awaitingSet.includes(c.status)).length,
    }
  })

  const unassigned = CASES.filter((c) => c.assigned_vet_id == null)
  rows.push({
    id: 'unassigned',
    name: 'Unassigned',
    assignedCount: unassigned.length,
    highRiskCount: unassigned.filter((c) => c.risk_level === 'high').length,
    awaitingReviewCount: unassigned.filter((c) => awaitingSet.includes(c.status)).length,
  })

  return rows
}

// Human-readable activity label per status — used only to describe
// a case's most recent known state change for the Admin Dashboard's
// "Recent Activity" feed. This is a presentation label, not a new
// status vocabulary; the underlying value is always one of
// CASE_STATUSES.
const ACTIVITY_LABELS = {
  reported: 'Case reported',
  ai_assessed: 'AI risk assessment completed',
  vet_review: 'Case moved to Vet Review',
  field_visit: 'Case referred for field visit',
  lab_pending: 'Case sent for lab testing',
  confirmed: 'Case confirmed',
  negative: 'Case marked negative',
  inconclusive: 'Case marked inconclusive',
  closed: 'Case closed',
}

// Recent Activity feed. The mock data only carries one timestamp per
// case (created_at), so this reflects each case's CURRENT status as
// a single activity entry, most recent first — it does not fabricate
// a multi-step history or invented timestamps. Clearly frontend
// demonstration data; swappable later for a real activity/audit-log
// endpoint without changing RecentActivity.jsx.
export function getRecentActivity(limit = 8) {
  return [...CASES]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit)
    .map((c) => ({
      id: c.id,
      caseId: c.id,
      status: c.status,
      label: ACTIVITY_LABELS[c.status] ?? 'Case updated',
      detail: `${c.animal.name} (${c.animal.species}) · ${c.location}`,
      at: c.created_at,
    }))
}

// ---------------------------------------------------------------
// Calendar / Deadlines / Reminders / Tasks
//
// Frontend-only planning data for this step — no backend endpoint
// exists yet for any of it. Shapes are kept close to the Case data
// above (caseId + assignedVetId as foreign keys, same VETS list) so
// a future API layer can replace just these arrays/functions without
// touching Calendar.jsx, Tasks.jsx, or the Dashboard/Case Detail
// integrations that read from them.
//
// "Overdue" is intentionally NOT a stored status value — it's
// derived from dueDate/dueTime vs. the current time (see
// getDeadlineStatus / getTaskStatus) so a deadline/task can never be
// stored in the contradictory state of "completed AND overdue".
// ---------------------------------------------------------------

// Shared visual language for every place a calendar-style event
// shows up (month grid dots, the calendar legend, Deadline/Reminder
// cards). Kept as one shared config — like DISTRICT_COORDINATES
// above — instead of five separate color decisions scattered across
// components.
export const CALENDAR_EVENT_TYPES = {
  deadline: {
    label: 'Deadline',
    dot: 'bg-risk-high',
    text: 'text-risk-high',
    bg: 'bg-risk-high/10',
  },
  high_risk_review: {
    label: 'High-Risk Case Review',
    dot: 'bg-risk-critical',
    text: 'text-risk-critical',
    bg: 'bg-risk-critical/10',
  },
  field_visit: {
    label: 'Field Visit',
    dot: 'bg-risk-medium',
    text: 'text-risk-medium',
    bg: 'bg-risk-medium/10',
  },
  lab_followup: {
    label: 'Lab Follow-up',
    dot: 'bg-cluster',
    text: 'text-cluster',
    bg: 'bg-cluster/10',
  },
  reminder: {
    label: 'Reminder',
    dot: 'bg-accent-blue',
    text: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
  },
}

// Reminder "type" options for the Add Reminder form — every
// CALENDAR_EVENT_TYPES entry except 'deadline', which is its own
// entity (see DEADLINES) rather than a kind of reminder.
export const REMINDER_TYPES = Object.entries(CALENDAR_EVENT_TYPES)
  .filter(([value]) => value !== 'deadline')
  .map(([value, cfg]) => ({ value, label: cfg.label }))

export const PRIORITY_LEVELS = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

// Settable statuses only — 'overdue' is a computed display state,
// never something a form writes directly (see getTaskStatus).
export const TASK_STATUSES = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export const DEADLINES = [
  {
    id: 1,
    title: 'Vet review sign-off',
    caseId: 204,
    description: 'Confirm the high-risk FMD assessment for Cow 002 before escalation.',
    assignedVetId: 1,
    dueDate: '2026-08-29',
    dueTime: '17:00',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Field visit report due',
    caseId: 191,
    description: 'Submit the field visit findings for Cow 011.',
    assignedVetId: 2,
    dueDate: '2026-08-27',
    dueTime: '12:00',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 3,
    title: 'Lab sample follow-up',
    caseId: 187,
    description: 'Check back on the lab sample results for Buffalo 003.',
    assignedVetId: 3,
    dueDate: '2026-08-30',
    dueTime: '10:00',
    priority: 'medium',
    status: 'in_progress',
  },
  {
    id: 4,
    title: 'Case closure paperwork',
    caseId: 172,
    description: 'Finalize closure notes for Goat 009.',
    assignedVetId: 1,
    dueDate: '2026-08-26',
    dueTime: '15:00',
    priority: 'low',
    status: 'completed',
  },
  {
    id: 5,
    title: 'Weekly surveillance summary',
    caseId: null,
    description: 'Prepare the weekly disease surveillance summary for Erode District.',
    assignedVetId: 2,
    dueDate: '2026-09-02',
    dueTime: '09:00',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 6,
    title: 'Vaccination follow-up confirmation',
    caseId: 165,
    description: 'Confirm the vaccination status follow-up for Cow 006.',
    assignedVetId: 2,
    dueDate: '2026-08-31',
    dueTime: '11:30',
    priority: 'high',
    status: 'pending',
  },
]

export const REMINDERS = [
  {
    id: 1,
    title: 'Re-check Cow 002 vitals',
    caseId: 204,
    assignedVetId: 1,
    date: '2026-08-29',
    time: '09:00',
    priority: 'high',
    type: 'high_risk_review',
    completed: false,
  },
  {
    id: 2,
    title: 'Field visit — Erode farms',
    caseId: 191,
    assignedVetId: 2,
    date: '2026-08-30',
    time: '08:30',
    priority: 'medium',
    type: 'field_visit',
    completed: false,
  },
  {
    id: 3,
    title: 'Lab follow-up call',
    caseId: 187,
    assignedVetId: 3,
    date: '2026-08-29',
    time: '14:00',
    priority: 'medium',
    type: 'lab_followup',
    completed: false,
  },
  {
    id: 4,
    title: 'Call farmer about Goat 014',
    caseId: 198,
    assignedVetId: null,
    date: '2026-08-29',
    time: '16:00',
    priority: 'low',
    type: 'reminder',
    completed: false,
  },
  {
    id: 5,
    title: 'Review Namakkal cluster trend',
    caseId: null,
    assignedVetId: 2,
    date: '2026-09-01',
    time: '10:00',
    priority: 'medium',
    type: 'reminder',
    completed: false,
  },
  {
    id: 6,
    title: 'Confirm Buffalo 003 discharge',
    caseId: 187,
    assignedVetId: 3,
    date: '2026-08-28',
    time: '09:00',
    priority: 'low',
    type: 'reminder',
    completed: true,
  },
]

export const TASKS = [
  {
    id: 1,
    task: 'Complete vet review',
    caseId: 204,
    assignedVetId: 1,
    createdDate: '2026-08-27',
    dueDate: '2026-08-29',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 2,
    task: 'Submit field visit report',
    caseId: 191,
    assignedVetId: 2,
    createdDate: '2026-08-26',
    dueDate: '2026-08-27',
    priority: 'high',
    status: 'pending',
  },
  {
    id: 3,
    task: 'Follow up on lab results',
    caseId: 187,
    assignedVetId: 3,
    createdDate: '2026-08-26',
    dueDate: '2026-08-30',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 4,
    task: 'Assign a vet to the Goat 014 case',
    caseId: 198,
    assignedVetId: null,
    createdDate: '2026-08-27',
    dueDate: '2026-08-29',
    priority: 'medium',
    status: 'pending',
  },
  {
    id: 5,
    task: 'Verify vaccination follow-up',
    caseId: 165,
    assignedVetId: 2,
    createdDate: '2026-08-25',
    dueDate: '2026-08-31',
    priority: 'low',
    status: 'in_progress',
  },
  {
    id: 6,
    task: 'Close out Goat 009 case',
    caseId: 172,
    assignedVetId: 1,
    createdDate: '2026-08-25',
    dueDate: '2026-08-26',
    priority: 'low',
    status: 'completed',
  },
]

// Local calendar date as 'YYYY-MM-DD' — deliberately NOT
// `new Date().toISOString().slice(0, 10)`, which reads the UTC date
// and can silently land on the wrong day near midnight in timezones
// ahead of UTC (e.g. IST, UTC+5:30). Used everywhere "today" is
// compared against a stored date (getTodayReminders, getNotifications).
function todayStr() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function isPastDue(dateStr, timeStr = '23:59') {
  return new Date(`${dateStr}T${timeStr}:00`).getTime() < Date.now()
}

// A deadline reads as 'overdue' once its due date/time has passed
// and it hasn't been completed — this is never written directly by
// a form, only computed here so the two facts (completed, overdue)
// can't disagree.
export function getDeadlineStatus(deadline) {
  if (deadline.status === 'completed') return 'completed'
  if (isPastDue(deadline.dueDate, deadline.dueTime)) return 'overdue'
  return deadline.status
}

export function getDeadlines() {
  return DEADLINES.map((d) => ({ ...d, status: getDeadlineStatus(d) }))
}

export function getDeadlineById(id) {
  return getDeadlines().find((d) => d.id === Number(id))
}

export function getUpcomingDeadlines(limit = 4) {
  return getDeadlines()
    .filter((d) => d.status !== 'completed')
    .sort(
      (a, b) => new Date(`${a.dueDate}T${a.dueTime}`) - new Date(`${b.dueDate}T${b.dueTime}`),
    )
    .slice(0, limit)
}

export function getDeadlinesByCaseId(caseId) {
  return getDeadlines().filter((d) => d.caseId === caseId)
}

// Reminders list as-authored. Pages that let the user add/complete/
// delete reminders (Calendar.jsx) keep their own local React state
// seeded from this — nothing here mutates REMINDERS itself, same
// "frontend-only" pattern CaseDetail.jsx already uses for notes.
export function getReminders() {
  return REMINDERS
}

export function getTodayReminders(reminders = REMINDERS) {
  const today = todayStr()
  return reminders.filter((r) => r.date === today && !r.completed)
}

export function getTaskStatus(task) {
  if (task.status === 'completed') return 'completed'
  if (isPastDue(task.dueDate)) return 'overdue'
  return task.status
}

export function getTasks() {
  return TASKS.map((t) => ({ ...t, status: getTaskStatus(t) }))
}

export function getTasksByCaseId(caseId) {
  return getTasks().filter((t) => t.caseId === caseId)
}

export function getOverdueTasks(tasks = TASKS) {
  return tasks.map((t) => ({ ...t, status: getTaskStatus(t) })).filter((t) => t.status === 'overdue')
}

export function getMyPendingTasks(limit = 4) {
  return getTasks()
    .filter((t) => t.status === 'pending' || t.status === 'in_progress')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, limit)
}

// Builds the unified event list the calendar grid renders. Accepts
// an optional reminders list so Calendar.jsx can pass its own local
// (add/complete/delete-aware) reminders state instead of the static
// REMINDERS export — deadlines have no interactive edit UI yet, so
// they're always read from getDeadlines().
export function getCalendarEvents(reminders = REMINDERS) {
  const deadlineEvents = getDeadlines().map((d) => ({
    id: `deadline-${d.id}`,
    kind: 'deadline',
    type: 'deadline',
    title: d.title,
    caseId: d.caseId,
    assignedVetId: d.assignedVetId,
    date: d.dueDate,
    time: d.dueTime,
    priority: d.priority,
    status: d.status,
    description: d.description,
  }))

  const reminderEvents = reminders.map((r) => ({
    id: `reminder-${r.id}`,
    kind: 'reminder',
    type: r.type,
    title: r.title,
    caseId: r.caseId,
    assignedVetId: r.assignedVetId,
    date: r.date,
    time: r.time,
    priority: r.priority,
    status: r.completed ? 'completed' : 'pending',
    completed: r.completed,
  }))

  return [...deadlineEvents, ...reminderEvents]
}

export function getEventsForDate(dateStr, reminders = REMINDERS) {
  return getCalendarEvents(reminders)
    .filter((e) => e.date === dateStr)
    .sort((a, b) => (a.time || '').localeCompare(b.time || ''))
}

// Frontend-only notification feed for the Navbar bell: overdue/
// due-today deadlines, today's incomplete reminders, and overdue
// tasks. Read/unread state is NOT stored here — NotificationPanel
// keeps that in local component state, same reasoning as the
// reminders list above (no backend to persist it to yet).
export function getNotifications() {
  const notifications = []
  const today = todayStr()

  for (const d of getDeadlines()) {
    if (d.status === 'overdue') {
      notifications.push({
        id: `deadline-overdue-${d.id}`,
        kind: 'deadline_overdue',
        title: `Overdue: ${d.title}`,
        caseId: d.caseId,
        link: d.caseId ? `/cases/${d.caseId}` : '/calendar',
        at: `${d.dueDate}T${d.dueTime}`,
      })
    } else if (d.dueDate === today) {
      notifications.push({
        id: `deadline-today-${d.id}`,
        kind: 'deadline_upcoming',
        title: `Due today: ${d.title}`,
        caseId: d.caseId,
        link: d.caseId ? `/cases/${d.caseId}` : '/calendar',
        at: `${d.dueDate}T${d.dueTime}`,
      })
    }
  }

  for (const r of getTodayReminders()) {
    notifications.push({
      id: `reminder-today-${r.id}`,
      kind: 'reminder_due',
      title: `Reminder due today: ${r.title}`,
      caseId: r.caseId,
      link: r.caseId ? `/cases/${r.caseId}` : '/calendar',
      at: `${r.date}T${r.time}`,
    })
  }

  for (const t of getTasks()) {
    if (t.status === 'overdue') {
      notifications.push({
        id: `task-overdue-${t.id}`,
        kind: 'task_overdue',
        title: `Task overdue: ${t.task}`,
        caseId: t.caseId,
        link: '/tasks',
        at: `${t.dueDate}T00:00`,
      })
    }
  }

  return notifications.sort((a, b) => new Date(a.at) - new Date(b.at))
}
