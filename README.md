# Mini Project Management System

A full-stack multi-tenant project management tool built with Django GraphQL backend and React TypeScript frontend.
Video demo : https://drive.google.com/file/d/1dDeso-LXfnYtmJYQ2Tr_ZAY9_PUoerOY/view?usp=sharing
## 🚀 Features
<img width="1919" height="862" alt="Screenshot 2026-01-07 175451" src="https://github.com/user-attachments/assets/0e814475-3de9-477d-86aa-725ba96cfe10" />

<img width="679" height="800" alt="Screenshot 2026-01-07 175456" src="https://github.com/user-attachments/assets/4f5e00b6-8189-489f-96b0-ddb6c4eb5cf6" />
<img width="1102" height="957" alt="Screenshot 2026-01-07 175509" src="https://github.com/user-attachments/assets/1fd3df3f-aab4-4f0b-bf79-75e045593a64" />

<img width="1612" height="874" alt="Screenshot 2026-01-07 175519" src="https://github.com/user-attachments/assets/e993917e-1bf9-47d4-95df-e8360bd5bb1a" />

# Backend
- **Multi-tenant Architecture**: Organization-based data isolation
- **GraphQL API**: Complete CRUD operations with Graphene
- **Django Models**: Organization, Project, Task, and TaskComment
- **Statistics API**: Project and task completion metrics
- **PostgreSQL Database**: Robust data storage

### Frontend
- **React 18 + TypeScript**: Type-safe component development
- **Apollo Client**: Efficient GraphQL data management
- **TailwindCSS**: Modern, responsive design
- **Project Dashboard**: Visual project overview with statistics
- **Task Board**: Kanban-style task management
- **Real-time Updates**: Optimistic UI updates

## 📋 Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 15+ (or Docker)
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Tenant-management
```

### 2. Database Setup

#### Option A: Using Docker (Recommended)
```bash
docker-compose up -d
```

#### Option B: Local PostgreSQL
1. Install PostgreSQL
2. Create database:
```sql
CREATE DATABASE project_management_db;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE project_management_db TO postgres;
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

Backend will be available at: `http://localhost:8000`
GraphQL Playground: `http://localhost:8000/graphql/`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 📚 API Documentation

### GraphQL Schema

#### Queries

```graphql
# Get all organizations
organizations {
  id
  name
  slug
  contactEmail
}

# Get organization by slug
organization(slug: "org-slug") {
  id
  name
  slug
}

# Get projects for an organization
projects(organizationSlug: "org-slug", status: "ACTIVE") {
  id
  name
  description
  status
  taskCount
  completedTasks
  completionRate
}

# Get single project
project(id: 1) {
  id
  name
  description
}

# Get tasks for a project
tasks(projectId: 1, status: "TODO") {
  id
  title
  status
  assigneeEmail
}

# Get task comments
taskComments(taskId: 1) {
  id
  content
  authorEmail
  createdAt
}

# Get project statistics
projectStatistics(organizationSlug: "org-slug") {
  totalProjects
  totalTasks
  completedTasks
  completionRate
}
```

#### Mutations

```graphql
# Create organization
mutation {
  createOrganization(name: "Acme Corp", contactEmail: "contact@acme.com") {
    organization {
      id
      slug
    }
    success
    message
  }
}

# Create project
mutation {
  createProject(
    organizationSlug: "acme-corp"
    name: "New Project"
    description: "Project description"
    status: "ACTIVE"
    dueDate: "2024-12-31"
  ) {
    project {
      id
      name
    }
    success
    message
  }
}

# Update project
mutation {
  updateProject(
    id: 1
    name: "Updated Name"
    status: "COMPLETED"
  ) {
    project {
      id
      name
      status
    }
    success
  }
}

# Create task
mutation {
  createTask(
    projectId: 1
    title: "New Task"
    description: "Task description"
    status: "TODO"
    assigneeEmail: "user@example.com"
  ) {
    task {
      id
      title
    }
    success
  }
}

# Update task
mutation {
  updateTask(
    id: 1
    status: "DONE"
  ) {
    task {
      id
      status
    }
    success
  }
}

# Add comment to task
mutation {
  createTaskComment(
    taskId: 1
    content: "Great work!"
    authorEmail: "reviewer@example.com"
  ) {
    comment {
      id
      content
    }
    success
  }
}
```

## 🏗️ Project Structure

```
Tenant-management/
├── backend/
│   ├── core/                   # Core models and middleware
│   │   ├── models.py          # Organization, Project, Task, TaskComment
│   │   ├── admin.py           # Django admin configuration
│   │   └── middleware.py      # Multi-tenancy middleware
│   ├── api/                    # GraphQL API
│   │   ├── schema.py          # Main schema
│   │   ├── types.py           # GraphQL types
│   │   ├── queries.py         # Query resolvers
│   │   └── mutations.py       # Mutation resolvers
│   ├── project_management/     # Django project settings
│   │   ├── settings.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Layout.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectForm.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── pages/             # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   └── ProjectDetail.tsx
│   │   ├── graphql/           # GraphQL queries/mutations
│   │   │   ├── queries.ts
│   │   │   └── mutations.ts
│   │   ├── lib/               # Apollo client setup
│   │   │   └── apollo.ts
│   │   ├── types/             # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
└── docker-compose.yml
```

## 🎯 Key Features Implementation

### Multi-Tenancy
- Organization-based data isolation via middleware
- `X-Organization-Slug` header for API requests
- All queries filtered by organization context

### GraphQL Best Practices
- Proper error handling with success/message fields
- Optimistic updates on frontend
- Cache management with Apollo Client
- Efficient query structure

### UI/UX Features
- Responsive design with TailwindCSS
- Loading states and error handling
- Modal forms for creation/editing
- Kanban board for task management
- Progress indicators and statistics
- Real-time comment system

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 🔧 Technical Decisions & Trade-offs

### Backend
- **Django + Graphene**: Provides robust ORM and GraphQL integration
- **PostgreSQL**: Reliable relational database for complex queries
- **Middleware for Multi-tenancy**: Simple implementation, scalable to subdomain-based tenancy
- **Email-based assignees**: Simplified user management without full auth system

### Frontend
- **Vite**: Faster development experience than CRA
- **Apollo Client**: Industry standard for GraphQL, great caching
- **TailwindCSS**: Rapid UI development with utility classes
- **React Router**: Simple navigation for SPA

## 🚀 Future Improvements

### High Priority
- [ ] User authentication and authorization (JWT/OAuth)
- [ ] Real-time updates with GraphQL subscriptions
- [ ] File attachments for tasks
- [ ] Drag-and-drop task reordering
- [ ] Email notifications
- [ ] Advanced filtering and search
- [ ] Task dependencies and relationships

### Medium Priority
- [ ] Time tracking for tasks
- [ ] Project templates
- [ ] Calendar view
- [ ] Activity logs/audit trail
- [ ] Export functionality (PDF, CSV)
- [ ] Mobile app (React Native)

### Nice to Have
- [ ] AI-powered task suggestions
- [ ] Gantt chart view
- [ ] Resource allocation
- [ ] Budget tracking
- [ ] Integration with external tools (Slack, GitHub)
- [ ] Custom fields for projects/tasks

## 📝 Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_NAME=project_management_db
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
```

### Frontend
No environment variables required for development. For production, set:
```
VITE_API_URL=https://api.yourdomain.com
```
## 📄 License

MIT License - feel free to use this project for learning or as a base for your own projects.

---

Built with ❤️ using Django, GraphQL, React, and TypeScript
