import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import RiskBadge from './RiskBadge'
import { searchCases } from '../services/mockData'

// Frontend mock-data search today. `searchCases` is the only thing
// that talks to data — swapping it for a real GET /cases?search=
// call later (in services/api.js) is a matter of fetching into a
// results/loading state instead of deriving `results` synchronously
// below; the rest of this component (dropdown, keyboard nav,
// navigation) does not need to change.
export default function CaseSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listboxId = useId()
  const navigate = useNavigate()

  const trimmedQuery = query.trim()
  const results = useMemo(
    () => (trimmedQuery ? searchCases(trimmedQuery) : []),
    [trimmedQuery],
  )
  const showDropdown = isOpen && trimmedQuery !== ''

  useEffect(() => {
    function handlePointerDown(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function handleChange(e) {
    const value = e.target.value
    setQuery(value)
    setIsOpen(value.trim() !== '')
    setHighlightedIndex(-1)
  }

  function goToCase(caseItem) {
    if (!caseItem) return
    navigate(`/cases/${caseItem.id}`)
    setQuery('')
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  function handleClear() {
    setQuery('')
    setIsOpen(false)
    setHighlightedIndex(-1)
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowDown') {
      if (results.length === 0) return
      e.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      if (results.length === 0) return
      e.preventDefault()
      setIsOpen(true)
      setHighlightedIndex((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (e.key === 'Enter') {
      if (!isOpen || results.length === 0) return
      e.preventDefault()
      goToCase(results[highlightedIndex >= 0 ? highlightedIndex : 0])
    } else if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault()
        setIsOpen(false)
      }
    }
  }

  return (
    <div ref={containerRef} className="relative hidden sm:block w-56 lg:w-72">
      <div className="flex items-center gap-2 h-9 px-3 rounded-control border border-border bg-app-bg text-steel focus-within:border-primary transition-colors">
        <Search size={16} className="shrink-0" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-label="Search cases, animals, or locations"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (trimmedQuery !== '') setIsOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search cases, animals..."
          className="bg-transparent outline-none text-sm placeholder:text-steel w-full text-ink"
        />
        {query !== '' && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="shrink-0 text-steel hover:text-ink"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {showDropdown && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Search results"
          className="absolute left-0 right-0 mt-1.5 max-h-80 overflow-y-auto rounded-card border border-border bg-surface shadow-lg py-1 z-50"
        >
          {results.length === 0 ? (
            <li className="px-4 py-6 text-sm text-steel text-center" role="presentation">
              No matching cases
            </li>
          ) : (
            results.map((c, index) => (
              <li
                key={c.id}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => goToCase(c)}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 cursor-pointer ${
                  index === highlightedIndex ? 'bg-app-bg' : 'hover:bg-app-bg'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-ink truncate">
                    #{c.id} · {c.animal.name} · {c.animal.species}
                  </p>
                  <p className="text-xs text-steel truncate">{c.location}</p>
                </div>
                <RiskBadge level={c.risk_level} />
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
