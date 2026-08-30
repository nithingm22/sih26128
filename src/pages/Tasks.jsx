import { useState } from 'react'
import { ListChecks, AlertTriangle } from 'lucide-react'
import TaskCard from '../components/TaskCard'
import { getTasks } from '../services/mockData'

// Frontend-only task board. Status/assignment changes here only
// update this page's local state — there's no PATCH /tasks/:id
// endpoint yet, same "frontend-only for now" rule as Case Detail's
// notes and status controls.
export default function Tasks() {
  const [tasks, setTasks] = useState(() => getTasks())

  function handleAdvanceStatus(id, nextStatus) {
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, status: nextStatus } : t)))
  }

  function handleReassign(id, vetId) {
    setTasks((current) =>
      current.map((t) => (t.id === id ? { ...t, assignedVetId: vetId } : t)),
    )
  }

  const overdueTasks = tasks.filter((t) => t.status === 'overdue')
  const activeTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress')
  const completedTasks = tasks.filter((t) => t.status === 'completed')

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-ink">My Tasks</h2>
        <p className="text-sm text-steel mt-1">
          Action items assigned across the veterinary team. Changes here are frontend-only for now.
        </p>
      </div>

      {/* Overdue */}
      {overdueTasks.length > 0 && (
        <div className="bg-surface border border-risk-high/30 rounded-card p-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-risk-high" />
            <h3 className="text-base font-semibold text-ink">Overdue Tasks</h3>
          </div>
          <p className="text-xs text-steel mb-4">
            Past their due date and not yet completed — these need attention first.
          </p>
          <div className="space-y-2.5">
            {overdueTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onAdvanceStatus={handleAdvanceStatus}
                onReassign={handleReassign}
              />
            ))}
          </div>
        </div>
      )}

      {/* Active */}
      <div className="bg-surface border border-border rounded-card p-5">
        <div className="flex items-center gap-2 mb-1">
          <ListChecks size={16} className="text-primary" />
          <h3 className="text-base font-semibold text-ink">Active Tasks</h3>
        </div>
        <p className="text-xs text-steel mb-4">Pending and in-progress action items</p>
        {activeTasks.length > 0 ? (
          <div className="space-y-2.5">
            {activeTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onAdvanceStatus={handleAdvanceStatus}
                onReassign={handleReassign}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-steel text-center py-6">No active tasks right now.</p>
        )}
      </div>

      {/* Completed */}
      {completedTasks.length > 0 && (
        <div className="bg-surface border border-border rounded-card p-5">
          <h3 className="text-base font-semibold text-ink mb-1">Completed</h3>
          <p className="text-xs text-steel mb-4">Finished action items</p>
          <div className="space-y-2.5 opacity-70">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
