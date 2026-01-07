import graphene
from core.models import Organization, Project, Task, TaskComment
from .types import OrganizationType, ProjectType, TaskType, TaskCommentType


class CreateOrganization(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)
    
    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, name, contact_email):
        try:
            organization = Organization.objects.create(
                name=name,
                contact_email=contact_email
            )
            return CreateOrganization(
                organization=organization,
                success=True,
                message="Organization created successfully"
            )
        except Exception as e:
            return CreateOrganization(
                organization=None,
                success=False,
                message=str(e)
            )


class CreateProject(graphene.Mutation):
    class Arguments:
        organization_slug = graphene.String(required=True)
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, organization_slug, name, description=None, status='ACTIVE', due_date=None):
        try:
            organization = Organization.objects.get(slug=organization_slug)
            project = Project.objects.create(
                organization=organization,
                name=name,
                description=description or '',
                status=status,
                due_date=due_date
            )
            return CreateProject(
                project=project,
                success=True,
                message="Project created successfully"
            )
        except Organization.DoesNotExist:
            return CreateProject(
                project=None,
                success=False,
                message="Organization not found"
            )
        except Exception as e:
            return CreateProject(
                project=None,
                success=False,
                message=str(e)
            )


class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()
    
    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, name=None, description=None, status=None, due_date=None):
        try:
            project = Project.objects.get(id=id)
            
            if name:
                project.name = name
            if description is not None:
                project.description = description
            if status:
                project.status = status
            if due_date is not None:
                project.due_date = due_date
            
            project.save()
            
            return UpdateProject(
                project=project,
                success=True,
                message="Project updated successfully"
            )
        except Project.DoesNotExist:
            return UpdateProject(
                project=None,
                success=False,
                message="Project not found"
            )
        except Exception as e:
            return UpdateProject(
                project=None,
                success=False,
                message=str(e)
            )


class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.Int(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, project_id, title, description=None, status='TODO', assignee_email=None, due_date=None):
        try:
            project = Project.objects.get(id=project_id)
            task = Task.objects.create(
                project=project,
                title=title,
                description=description or '',
                status=status,
                assignee_email=assignee_email or '',
                due_date=due_date
            )
            return CreateTask(
                task=task,
                success=True,
                message="Task created successfully"
            )
        except Project.DoesNotExist:
            return CreateTask(
                task=None,
                success=False,
                message="Project not found"
            )
        except Exception as e:
            return CreateTask(
                task=None,
                success=False,
                message=str(e)
            )


class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()
    
    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id, title=None, description=None, status=None, assignee_email=None, due_date=None):
        try:
            task = Task.objects.get(id=id)
            
            if title:
                task.title = title
            if description is not None:
                task.description = description
            if status:
                task.status = status
            if assignee_email is not None:
                task.assignee_email = assignee_email
            if due_date is not None:
                task.due_date = due_date
            
            task.save()
            
            return UpdateTask(
                task=task,
                success=True,
                message="Task updated successfully"
            )
        except Task.DoesNotExist:
            return UpdateTask(
                task=None,
                success=False,
                message="Task not found"
            )
        except Exception as e:
            return UpdateTask(
                task=None,
                success=False,
                message=str(e)
            )


class CreateTaskComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.Int(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)
    
    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, task_id, content, author_email):
        try:
            task = Task.objects.get(id=task_id)
            comment = TaskComment.objects.create(
                task=task,
                content=content,
                author_email=author_email
            )
            return CreateTaskComment(
                comment=comment,
                success=True,
                message="Comment added successfully"
            )
        except Task.DoesNotExist:
            return CreateTaskComment(
                comment=None,
                success=False,
                message="Task not found"
            )
        except Exception as e:
            return CreateTaskComment(
                comment=None,
                success=False,
                message=str(e)
            )


class DeleteProject(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id):
        try:
            project = Project.objects.get(id=id)
            project_name = project.name
            project.delete()
            return DeleteProject(
                success=True,
                message=f"Project '{project_name}' deleted successfully"
            )
        except Project.DoesNotExist:
            return DeleteProject(
                success=False,
                message="Project not found"
            )
        except Exception as e:
            return DeleteProject(
                success=False,
                message=str(e)
            )


class DeleteTask(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
    
    success = graphene.Boolean()
    message = graphene.String()
    
    def mutate(self, info, id):
        try:
            task = Task.objects.get(id=id)
            task_title = task.title
            task.delete()
            return DeleteTask(
                success=True,
                message=f"Task '{task_title}' deleted successfully"
            )
        except Task.DoesNotExist:
            return DeleteTask(
                success=False,
                message="Task not found"
            )
        except Exception as e:
            return DeleteTask(
                success=False,
                message=str(e)
            )


class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()
    create_task_comment = CreateTaskComment.Field()
