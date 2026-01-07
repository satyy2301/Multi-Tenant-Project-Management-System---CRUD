import graphene
from graphene_django import DjangoObjectType
from core.models import Organization, Project, Task, TaskComment
from .types import OrganizationType, ProjectType, TaskType, TaskCommentType


class Query(graphene.ObjectType):
    # Organizations
    organizations = graphene.List(OrganizationType)
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))
    
    # Projects
    projects = graphene.List(
        ProjectType,
        organization_slug=graphene.String(required=True),
        status=graphene.String()
    )
    project = graphene.Field(ProjectType, id=graphene.Int(required=True))
    
    # Tasks
    tasks = graphene.List(
        TaskType,
        project_id=graphene.Int(required=True),
        status=graphene.String()
    )
    task = graphene.Field(TaskType, id=graphene.Int(required=True))
    
    # Comments
    task_comments = graphene.List(TaskCommentType, task_id=graphene.Int(required=True))
    
    # Statistics
    project_statistics = graphene.Field(
        'api.queries.ProjectStatisticsType',
        organization_slug=graphene.String(required=True)
    )
    
    def resolve_organizations(self, info):
        return Organization.objects.all()
    
    def resolve_organization(self, info, slug):
        try:
            return Organization.objects.get(slug=slug)
        except Organization.DoesNotExist:
            return None
    
    def resolve_projects(self, info, organization_slug, status=None):
        try:
            org = Organization.objects.get(slug=organization_slug)
            projects = Project.objects.filter(organization=org)
            if status:
                projects = projects.filter(status=status)
            return projects
        except Organization.DoesNotExist:
            return []
    
    def resolve_project(self, info, id):
        try:
            return Project.objects.get(id=id)
        except Project.DoesNotExist:
            return None
    
    def resolve_tasks(self, info, project_id, status=None):
        tasks = Task.objects.filter(project_id=project_id)
        if status:
            tasks = tasks.filter(status=status)
        return tasks
    
    def resolve_task(self, info, id):
        try:
            return Task.objects.get(id=id)
        except Task.DoesNotExist:
            return None
    
    def resolve_task_comments(self, info, task_id):
        return TaskComment.objects.filter(task_id=task_id)
    
    def resolve_project_statistics(self, info, organization_slug):
        try:
            org = Organization.objects.get(slug=organization_slug)
            projects = Project.objects.filter(organization=org)
            
            total_projects = projects.count()
            total_tasks = Task.objects.filter(project__organization=org).count()
            completed_tasks = Task.objects.filter(
                project__organization=org,
                status='DONE'
            ).count()
            
            completion_rate = 0
            if total_tasks > 0:
                completion_rate = (completed_tasks / total_tasks) * 100
            
            return ProjectStatistics(
                total_projects=total_projects,
                total_tasks=total_tasks,
                completed_tasks=completed_tasks,
                completion_rate=completion_rate
            )
        except Organization.DoesNotExist:
            return None


class ProjectStatistics:
    def __init__(self, total_projects, total_tasks, completed_tasks, completion_rate):
        self.total_projects = total_projects
        self.total_tasks = total_tasks
        self.completed_tasks = completed_tasks
        self.completion_rate = completion_rate


class ProjectStatisticsType(graphene.ObjectType):
    total_projects = graphene.Int()
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    completion_rate = graphene.Float()
