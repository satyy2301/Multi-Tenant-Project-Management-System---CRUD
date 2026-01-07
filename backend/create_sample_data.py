from core.models import Organization, Project, Task
from datetime import date, timedelta

# Create a sample organization
org = Organization.objects.create(
    name="Acme Corporation",
    slug="acme-corp",
    contact_email="contact@acme.com"
)

# Create sample projects
project1 = Project.objects.create(
    organization=org,
    name="Website Redesign",
    description="Complete overhaul of the company website",
    status="ACTIVE",
    due_date=date.today() + timedelta(days=30)
)

project2 = Project.objects.create(
    organization=org,
    name="Mobile App Development",
    description="Develop iOS and Android mobile applications",
    status="ACTIVE",
    due_date=date.today() + timedelta(days=60)
)

project3 = Project.objects.create(
    organization=org,
    name="Marketing Campaign Q1",
    description="Q1 marketing initiatives",
    status="ON_HOLD"
)

# Create sample tasks for project 1
Task.objects.create(
    project=project1,
    title="Design homepage mockup",
    description="Create modern homepage design",
    status="DONE",
    assignee_email="designer@acme.com"
)

Task.objects.create(
    project=project1,
    title="Implement responsive navigation",
    description="Build mobile-friendly navigation menu",
    status="IN_PROGRESS",
    assignee_email="developer@acme.com"
)

Task.objects.create(
    project=project1,
    title="Setup contact form",
    description="Implement and test contact form",
    status="TODO",
    assignee_email="developer@acme.com"
)

# Create sample tasks for project 2
Task.objects.create(
    project=project2,
    title="Setup React Native project",
    description="Initialize project with Expo",
    status="DONE",
    assignee_email="mobile-dev@acme.com"
)

Task.objects.create(
    project=project2,
    title="Design app wireframes",
    description="Create wireframes for all screens",
    status="IN_PROGRESS",
    assignee_email="ux-designer@acme.com"
)

Task.objects.create(
    project=project2,
    title="Implement authentication",
    description="Add login and signup functionality",
    status="TODO",
    assignee_email="mobile-dev@acme.com"
)

print("✅ Sample data created successfully!")
print(f"Organization: {org.name} (slug: {org.slug})")
print(f"Projects created: {Project.objects.count()}")
print(f"Tasks created: {Task.objects.count()}")
print("\n🚀 You can now:")
print("1. Visit http://localhost:3000 to see the frontend")
print("2. Visit http://localhost:8000/graphql/ to test the GraphQL API")
print(f"\n💡 Remember to set organizationSlug in browser localStorage:")
print(f"   localStorage.setItem('organizationSlug', '{org.slug}')")
