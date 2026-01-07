import { gql } from '@apollo/client'

export const GET_PROJECTS = gql`
  query GetProjects($organizationSlug: String!, $status: String) {
    projects(organizationSlug: $organizationSlug, status: $status) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTasks
      completionRate
      createdAt
    }
  }
`

export const GET_PROJECT = gql`
  query GetProject($id: Int!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      taskCount
      completedTasks
      completionRate
      createdAt
    }
  }
`

export const GET_TASKS = gql`
  query GetTasks($projectId: Int!, $status: String) {
    tasks(projectId: $projectId, status: $status) {
      id
      title
      description
      status
      assigneeEmail
      dueDate
      createdAt
    }
  }
`

export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: Int!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
    }
  }
`

export const GET_PROJECT_STATISTICS = gql`
  query GetProjectStatistics($organizationSlug: String!) {
    projectStatistics(organizationSlug: $organizationSlug) {
      totalProjects
      totalTasks
      completedTasks
      completionRate
    }
  }
`

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      createdAt
    }
  }
`
