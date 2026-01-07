from django.utils.deprecation import MiddlewareMixin


class OrganizationMiddleware(MiddlewareMixin):
    """
    Middleware to handle organization context for multi-tenancy.
    This is a basic implementation - in production, you'd want to:
    - Extract organization from subdomain or header
    - Implement proper authentication and authorization
    - Cache organization lookups
    """
    
    def process_request(self, request):
        # Get organization from header (for API requests)
        org_slug = request.headers.get('X-Organization-Slug')
        
        if org_slug:
            from core.models import Organization
            try:
                request.organization = Organization.objects.get(slug=org_slug)
            except Organization.DoesNotExist:
                request.organization = None
        else:
            request.organization = None
        
        return None
