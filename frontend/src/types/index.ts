export interface Organization {
  id: string
  name: string
  slug: string
  contactEmail: string
  createdAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED'
  dueDate?: string
  taskCount: number
  completedTasks: number
  completionRate: number
  createdAt: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED'
  assigneeEmail: string
  dueDate?: string
  createdAt: string
}

export interface TaskComment {
  id: string
  content: string
  authorEmail: string
  createdAt: string
}

export interface ProjectStatistics {
  totalProjects: number
  totalTasks: number
  completedTasks: number
  completionRate: number
}
