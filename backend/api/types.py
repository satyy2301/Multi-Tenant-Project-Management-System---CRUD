import graphene
from graphene_django import DjangoObjectType
from core.models import Organization, Project, Task, TaskComment


class OrganizationType(DjangoObjectType):
    class Meta:
        model = Organization
        fields = '__all__'


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks = graphene.Int()
    completion_rate = graphene.Float()
    
    class Meta:
        model = Project
        fields = '__all__'
    
    def resolve_task_count(self, info):
        return self.task_count
    
    def resolve_completed_tasks(self, info):
        return self.completed_tasks
    
    def resolve_completion_rate(self, info):
        return self.completion_rate


class TaskType(DjangoObjectType):
    class Meta:
        model = Task
        fields = '__all__'


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = '__all__'
