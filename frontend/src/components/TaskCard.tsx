import React, { useState } from 'react'
import { Task } from '../types'
import { useMutation, useApolloClient } from '@apollo/client'
import { DELETE_TASK } from '../graphql/mutations'
import { GET_TASKS } from '../graphql/queries'

interface TaskCardProps {
  task: Task
  onTaskClick: (task: Task) => void
  projectId: number
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onTaskClick, projectId }) => {
  const client = useApolloClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [deleteTask, { loading: deleting }] = useMutation(DELETE_TASK, {
    update: (cache, { data: deleteData }) => {
      // Manually update cache after successful deletion
      if (deleteData?.deleteTask?.success) {
        try {
          // Read current data from cache
          const cachedData = cache.readQuery({
            query: GET_TASKS,
            variables: { projectId, status: null }
          })
          
          const tasks = (cachedData as any)?.tasks || []
          
          // Filter out deleted task
          const updatedTasks = tasks.filter((t: Task) => t.id !== task.id)
          
          // Write updated data back to cache
          cache.writeQuery({
            query: GET_TASKS,
            variables: { projectId, status: null },
            data: { tasks: updatedTasks }
          })
        } catch (error) {
          console.error('Cache update error:', error)
          // Fallback: refetch if cache update fails
          client.refetchQueries({ include: [GET_TASKS] })
        }
      }
    },
    refetchQueries: [{ query: GET_TASKS, variables: { projectId, status: null } }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.deleteTask?.success) {
        setShowDeleteConfirm(false)
        setDeleteError(null)
      } else {
        setDeleteError(data?.deleteTask?.message || 'Failed to delete task')
      }
    },
    onError: (error) => {
      setDeleteError(error.message || 'Failed to delete task')
    }
  })

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteError(null)
    try {
      await deleteTask({ variables: { id: parseInt(task.id) } })
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return 'bg-gray-100 text-gray-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'DONE':
        return 'bg-green-100 text-green-800'
      case 'BLOCKED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <>
      <div
        className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500"
        onClick={() => onTaskClick(task)}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold text-gray-900 flex-1">{task.title}</h4>
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDeleteConfirm(true)
              }}
              className="p-1 text-red-500 hover:bg-red-50 rounded transition"
              title="Delete task"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        {task.description && (
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {task.assigneeEmail && (
            <span className="truncate">{task.assigneeEmail}</span>
          )}
          {task.dueDate && (
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation()
            setShowDeleteConfirm(false)
          }}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md mx-4 animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-3">Delete Task?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{task.title}</strong>"? This action cannot be undone.
            </p>
            {deleteError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {deleteError}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowDeleteConfirm(false)
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
                {deleting ? 'Deleting...' : 'Delete Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default TaskCard
