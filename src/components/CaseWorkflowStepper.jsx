import { Check } from 'lucide-react'

// Generic status/progress stepper. Given an ordered list of
// { key, label } stages and the index of the current stage, renders
// completed / current / upcoming states. Written generically enough
// to reuse anywhere a linear workflow needs visualizing, not just
// Case Detail.
export default function CaseWorkflowStepper({ stages, currentIndex }) {
  return (
    <ol className="flex flex-col sm:flex-row gap-5 sm:gap-0">
      {stages.map((stage, index) => {
        const isComplete = index < currentIndex
        const isCurrent = index === currentIndex

        return (
          <li
            key={stage.key}
            className="relative flex-1 flex items-center gap-3 sm:flex-col sm:items-center sm:text-center sm:gap-2"
          >
            {index > 0 && (
              <span
                aria-hidden="true"
                className={`hidden sm:block absolute top-4 right-1/2 w-full h-0.5 ${
                  isComplete || isCurrent ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}

            <div
              className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0 border-2 ${
                isComplete
                  ? 'bg-primary border-primary text-white'
                  : isCurrent
                    ? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-steel bg-surface'
              }`}
            >
              {isComplete ? <Check size={15} /> : index + 1}
            </div>

            <span
              className={`text-xs font-medium ${
                isCurrent || isComplete ? 'text-ink' : 'text-steel'
              }`}
            >
              {stage.label}
              {isCurrent && <span className="sr-only"> (current stage)</span>}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
