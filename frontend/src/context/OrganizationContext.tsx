import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Organization {
  slug: string
  name: string
}

interface OrganizationContextType {
  organization: Organization | null
  setOrganization: (org: Organization) => void
  organizations: Organization[]
  addOrganization: (org: Organization) => void
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organization, setOrganizationState] = useState<Organization | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])

  useEffect(() => {
    // Load saved organization and organizations list from localStorage
    const savedOrg = localStorage.getItem('organization')
    const savedOrgs = localStorage.getItem('organizations')

    if (savedOrgs) {
      try {
        const parsedOrgs = JSON.parse(savedOrgs)
        setOrganizations(parsedOrgs)
        
        if (savedOrg) {
          try {
            const parsedOrg = JSON.parse(savedOrg)
            setOrganizationState(parsedOrg)
          } catch (error) {
            console.error('Failed to parse organization:', error)
            // Use first organization as default
            if (parsedOrgs.length > 0) {
              setOrganizationState(parsedOrgs[0])
              localStorage.setItem('organization', JSON.stringify(parsedOrgs[0]))
            }
          }
        } else if (parsedOrgs.length > 0) {
          // Default to first organization
          setOrganizationState(parsedOrgs[0])
          localStorage.setItem('organization', JSON.stringify(parsedOrgs[0]))
        }
      } catch (error) {
        console.error('Failed to parse organizations:', error)
        localStorage.removeItem('organizations')
      }
    } else {
      // Initialize with default organization
      const defaultOrg: Organization = { slug: 'acme-corp', name: 'Acme Corp' }
      setOrganizationState(defaultOrg)
      setOrganizations([defaultOrg])
      localStorage.setItem('organization', JSON.stringify(defaultOrg))
      localStorage.setItem('organizations', JSON.stringify([defaultOrg]))
    }
  }, [])

  const setOrganization = (org: Organization) => {
    setOrganizationState(org)
    localStorage.setItem('organization', JSON.stringify(org))
  }

  const addOrganization = (org: Organization) => {
    if (!organizations.find((o) => o.slug === org.slug)) {
      const updated = [...organizations, org]
      setOrganizations(updated)
      localStorage.setItem('organizations', JSON.stringify(updated))
    }
  }

  return (
    <OrganizationContext.Provider value={{ organization, setOrganization, organizations, addOrganization }}>
      {children}
    </OrganizationContext.Provider>
  )
}

export const useOrganization = () => {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
