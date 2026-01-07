import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_PROJECTS, GET_PROJECT_STATISTICS } from '../graphql/queries'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'
import { useOrganization } from '../context/OrganizationContext'

const Dashboard: React.FC = () => {
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const { organization } = useOrganization()
  
  const organizationSlug = organization?.slug || 'default-org'

  const { data: projectsData, loading: projectsLoading, error: projectsError } = useQuery(
    GET_PROJECTS,
    {
      variables: { organizationSlug, status: statusFilter || null },
    }
  )

  const { data: statsData } = useQuery(GET_PROJECT_STATISTICS, {
    variables: { organizationSlug },
  })

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (projectsError) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md animate-slideIn">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-bold">Error loading projects</h3>
            <p>{projectsError.message}</p>
          </div>
        </div>
      </div>
    )
  }

  const projects = projectsData?.projects || []
  const stats = statsData?.projectStatistics

  return (
    <div>
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-slideUp">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Projects</h3>
                <p className="text-4xl font-bold mt-2">{stats.totalProjects}</p>
              </div>
              <svg className="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-purple-100 text-sm font-medium uppercase tracking-wide">Total Tasks</h3>
                <p className="text-4xl font-bold mt-2">{stats.totalTasks}</p>
              </div>
              <svg className="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-green-100 text-sm font-medium uppercase tracking-wide">Completed Tasks</h3>
                <p className="text-4xl font-bold mt-2">{stats.completedTasks}</p>
              </div>
              <svg className="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-orange-100 text-sm font-medium uppercase tracking-wide">Completion Rate</h3>
                <p className="text-4xl font-bold mt-2">
                  {stats.completionRate.toFixed(1)}%
                </p>
              </div>
              <svg className="w-12 h-12 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
        <button
          onClick={() => setShowProjectForm(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-200 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Project
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="shadow-sm border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 bg-white leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="ON_HOLD">On Hold</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center animate-slideIn">
          <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first project!</p>
          <button
            onClick={() => setShowProjectForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <ProjectCard key={project.id} project={project} organizationSlug={organizationSlug} />
          ))}
        </div>
      )}

      {/* Project Form Modal */}
      {showProjectForm && (
        <ProjectForm
          organizationSlug={organizationSlug}
          onClose={() => setShowProjectForm(false)}
        />
      )}
    </div>
  )
}

export default Dashboard
