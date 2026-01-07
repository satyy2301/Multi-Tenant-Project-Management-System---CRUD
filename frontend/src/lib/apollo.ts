import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql/',
})

const authLink = setContext((_, { headers }) => {
  // Get organization slug from localStorage
  // This will be updated by OrganizationContext whenever it changes
  let organizationSlug = localStorage.getItem('organization')
  
  if (organizationSlug) {
    try {
      const org = JSON.parse(organizationSlug)
      organizationSlug = org.slug
    } catch (error) {
      organizationSlug = 'acme-corp'
    }
  } else {
    organizationSlug = 'acme-corp'
  }
  
  return {
    headers: {
      ...headers,
      'X-Organization-Slug': organizationSlug,
    }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})
