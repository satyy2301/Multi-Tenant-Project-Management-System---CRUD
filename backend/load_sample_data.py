import os
import sys
import django

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_management.settings')
django.setup()

from core.models import Organization, Project, Task
from datetime import date, timedelta

# Create a sample organization
org, created = Organization.objects.get_or_create(
    slug="acme-corp",
    defaults={
        "name": "Acme Corporation",
        "contact_email": "contact@acme.com"
    }
)

if created:
    print(f"✅ Created organization: {org.name}")
else:
    print(f"ℹ️  Organization already exists: {org.name}")

# Create sample projects
project1, created = Project.objects.get_or_create(
    organization=org,
    name="Website Redesign",
    defaults={
        "description": "Complete overhaul of the company website",
        "status": "ACTIVE",
        "due_date": date.today() + timedelta(days=30)
    }
)

project2, created = Project.objects.get_or_create(
    organization=org,
    name="Mobile App Development",
    defaults={
        "description": "Develop iOS and Android mobile applications",
        "status": "ACTIVE",
        "due_date": date.today() + timedelta(days=60)
    }
)

project3, created = Project.objects.get_or_create(
    organization=org,
    name="Marketing Campaign Q1",
    defaults={
        "description": "Q1 marketing initiatives",
        "status": "ON_HOLD"
    }
)

# Create sample tasks
tasks_data = [
    (project1, "Design homepage mockup", "Create modern homepage design", "DONE", "designer@acme.com"),
    (project1, "Implement responsive navigation", "Build mobile-friendly navigation menu", "IN_PROGRESS", "developer@acme.com"),
    (project1, "Setup contact form", "Implement and test contact form", "TODO", "developer@acme.com"),
    (project2, "Setup React Native project", "Initialize project with Expo", "DONE", "mobile-dev@acme.com"),
    (project2, "Design app wireframes", "Create wireframes for all screens", "IN_PROGRESS", "ux-designer@acme.com"),
    (project2, "Implement authentication", "Add login and signup functionality", "TODO", "mobile-dev@acme.com"),
]

for project, title, description, status, email in tasks_data:
    task, created = Task.objects.get_or_create(
        project=project,
        title=title,
        defaults={
            "description": description,
            "status": status,
            "assignee_email": email
        }
    )

print("\n" + "="*60)
print("✅ Sample data setup complete!")
print("="*60)
print(f"\nOrganization: {org.name} (slug: {org.slug})")
print(f"Projects: {Project.objects.count()}")
print(f"Tasks: {Task.objects.count()}")
print("\n🚀 Next steps:")
print("1. Open http://localhost:3000 in your browser")
print("2. Open browser console (F12) and run:")
print(f"   localStorage.setItem('organizationSlug', '{org.slug}')")
print("3. Refresh the page to see your data!")
print("\n📝 GraphQL API: http://localhost:8000/graphql/")
print("="*60)
