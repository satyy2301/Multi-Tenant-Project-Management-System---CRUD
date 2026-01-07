import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { GET_PROJECT, GET_TASKS, GET_TASK_COMMENTS } from '../graphql/queries'
import { UPDATE_TASK, CREATE_TASK_COMMENT } from '../graphql/mutations'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import { Task } from '../types'

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [commentText, setCommentText] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')

  const projectId = parseInt(id || '0')

  const { data: projectData, loading: projectLoading } = useQuery(GET_PROJECT, {
    variables: { id: projectId },
  })

  const { data: tasksData, loading: tasksLoading } = useQuery(GET_TASKS, {
    variables: { projectId },
  })

  const { data: commentsData } = useQuery(GET_TASK_COMMENTS, {
    variables: { taskId: selectedTask?.id ? parseInt(selectedTask.id) : 0 },
    skip: !selectedTask,
  })

  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_TASKS, variables: { projectId } }],
  })

  const [createComment] = useMutation(CREATE_TASK_COMMENT, {
    refetchQueries: [
      {
        query: GET_TASK_COMMENTS,
        variables: { taskId: selectedTask?.id ? parseInt(selectedTask.id) : 0 },
      },
    ],
  })

  if (projectLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  const project = projectData?.project
  const tasks = tasksData?.tasks || []
  const comments = commentsData?.taskComments || []

  if (!project) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Project not found
      </div>
    )
  }

  const handleTaskStatusChange = (taskId: string, newStatus: string) => {
    updateTask({
      variables: {
        id: parseInt(taskId),
        status: newStatus,
      },
    })
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedTask && commentText && authorEmail) {
      createComment({
        variables: {
          taskId: parseInt(selectedTask.id),
          content: commentText,
          authorEmail,
        },
      }).then(() => {
        setCommentText('')
      })
    }
  }

  const tasksByStatus = {
    TODO: tasks.filter((t: Task) => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter((t: Task) => t.status === 'IN_PROGRESS'),
    DONE: tasks.filter((t: Task) => t.status === 'DONE'),
    BLOCKED: tasks.filter((t: Task) => t.status === 'BLOCKED'),
  }

  return (
    <div>
      {/* Project Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-700 mb-4"
        >
          ← Back to Projects
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="flex gap-4 text-sm">
          <span className="text-gray-500">
            Status: <span className="font-semibold">{project.status}</span>
          </span>
          <span className="text-gray-500">
            Tasks: <span className="font-semibold">{project.taskCount}</span>
          </span>
          <span className="text-gray-500">
            Completion:{' '}
            <span className="font-semibold">{project.completionRate.toFixed(1)}%</span>
          </span>
        </div>
      </div>

      {/* Task Board */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + New Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
          <div key={status} className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-4">
              {status.replace('_', ' ')} ({(statusTasks as Task[]).length})
            </h3>
            <div className="space-y-3">
              {(statusTasks as Task[]).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onTaskClick={setSelectedTask}
                  projectId={projectId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedTask.title}</h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Status
              </label>
              <select
                value={selectedTask.status}
                onChange={(e) =>
                  handleTaskStatusChange(selectedTask.id, e.target.value)
                }
                className="shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>

            <p className="text-gray-600 mb-4">{selectedTask.description}</p>

            <div className="mb-4 text-sm text-gray-500">
              {selectedTask.assigneeEmail && (
                <p>Assignee: {selectedTask.assigneeEmail}</p>
              )}
              {selectedTask.dueDate && (
                <p>Due: {new Date(selectedTask.dueDate).toLocaleString()}</p>
              )}
            </div>

            {/* Comments Section */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Comments</h3>
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {comments.map((comment: any) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm">
                        {comment.authorEmail}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddComment}>
                <input
                  type="email"
                  placeholder="Your email"
                  value={authorEmail}
                  onChange={(e) => setAuthorEmail(e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-2"
                  required
                />
                <textarea
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-2"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm projectId={projectId} onClose={() => setShowTaskForm(false)} />
      )}
    </div>
  )
}

export default ProjectDetail
