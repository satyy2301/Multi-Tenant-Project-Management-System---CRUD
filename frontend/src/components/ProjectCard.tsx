import React, { useState } from 'react'
import { Project } from '../types'
import { useNavigate } from 'react-router-dom'
import { useMutation, useApolloClient } from '@apollo/client'
import { DELETE_PROJECT } from '../graphql/mutations'
import { GET_PROJECTS } from '../graphql/queries'

interface ProjectCardProps {
  project: Project
  organizationSlug: string
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, organizationSlug }) => {
  const navigate = useNavigate()
  const client = useApolloClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [deleteProject, { loading: deleting }] = useMutation(DELETE_PROJECT, {
    update: (cache, { data: deleteData }) => {
      // Manually update cache after successful deletion
      if (deleteData?.deleteProject?.success) {
        try {
          // Read current data from cache
          const cachedData = cache.readQuery({
            query: GET_PROJECTS,
            variables: { organizationSlug, status: null }
          })
          
          const projects = (cachedData as any)?.projects || []
          
          // Filter out deleted project
          const updatedProjects = projects.filter((p: Project) => p.id !== project.id)
          
          // Write updated data back to cache
          cache.writeQuery({
            query: GET_PROJECTS,
            variables: { organizationSlug, status: null },
            data: { projects: updatedProjects }
          })
        } catch (error) {
          console.error('Cache update error:', error)
          // Fallback: refetch if cache update fails
          client.refetchQueries({ include: [GET_PROJECTS] })
        }
      }
    },
    refetchQueries: [{ query: GET_PROJECTS, variables: { organizationSlug, status: null } }],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      if (data?.deleteProject?.success) {
        setShowDeleteConfirm(false)
        setDeleteError(null)
      } else {
        setDeleteError(data?.deleteProject?.message || 'Failed to delete project')
      }
    },
    onError: (error) => {
      setDeleteError(error.message || 'Failed to delete project')
    }
  })

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteError(null)
    try {
      await deleteProject({ variables: { id: parseInt(project.id) } })
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'ON_HOLD':
        return 'bg-yellow-100 text-yellow-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div
      className="bg-white overflow-hidden shadow-md rounded-xl hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 animate-slideUp"
      onClick={() => navigate(`/project/${project.id}`)}
    >
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-800 truncate">{project.name}</h3>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                project.status
              )}`}
            >
              {project.status.replace('_', ' ')}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDeleteConfirm(true)
              }}
              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
              title="Delete project"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
          {project.description || 'No description'}
        </p>
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-500 font-medium">Progress</span>
              <span className="font-semibold text-gray-800">
                {project.completedTasks}/{project.taskCount} tasks
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${project.completionRate}%` }}
              />
            </div>
          </div>
          {project.dueDate && (
            <div className="flex items-center text-sm text-gray-500 pt-2 border-t border-gray-100">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Due: {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
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
            <h3 className="text-xl font-bold text-gray-800 mb-3">Delete Project?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "<strong>{project.name}</strong>"? This will also delete all associated tasks and comments. This action cannot be undone.
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
                ) : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProjectCard
