import { gql } from '@apollo/client'

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $contactEmail: String!) {
    createOrganization(name: $name, contactEmail: $contactEmail) {
      organization {
        id
        name
        slug
        contactEmail
      }
      success
      message
    }
  }
`

export const CREATE_PROJECT = gql`
  mutation CreateProject(
    $organizationSlug: String!
    $name: String!
    $description: String
    $status: String
    $dueDate: Date
  ) {
    createProject(
      organizationSlug: $organizationSlug
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        description
        status
        dueDate
      }
      success
      message
    }
  }
`

export const UPDATE_PROJECT = gql`
  mutation UpdateProject(
    $id: Int!
    $name: String
    $description: String
    $status: String
    $dueDate: Date
  ) {
    updateProject(
      id: $id
      name: $name
      description: $description
      status: $status
      dueDate: $dueDate
    ) {
      project {
        id
        name
        description
        status
        dueDate
      }
      success
      message
    }
  }
`

export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: Int!
    $title: String!
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
      }
      success
      message
    }
  }
`

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: Int!
    $title: String
    $description: String
    $status: String
    $assigneeEmail: String
    $dueDate: DateTime
  ) {
    updateTask(
      id: $id
      title: $title
      description: $description
      status: $status
      assigneeEmail: $assigneeEmail
      dueDate: $dueDate
    ) {
      task {
        id
        title
        description
        status
        assigneeEmail
        dueDate
      }
      success
      message
    }
  }
`

export const CREATE_TASK_COMMENT = gql`
  mutation CreateTaskComment(
    $taskId: Int!
    $content: String!
    $authorEmail: String!
  ) {
    createTaskComment(
      taskId: $taskId
      content: $content
      authorEmail: $authorEmail
    ) {
      comment {
        id
        content
        authorEmail
        createdAt
      }
      success
      message
    }
  }
`

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: Int!) {
    deleteProject(id: $id) {
      success
      message
    }
  }
`

export const DELETE_TASK = gql`
  mutation DeleteTask($id: Int!) {
    deleteTask(id: $id) {
      success
      message
    }
  }
`
