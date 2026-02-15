const API_URI = window.API_URI || 'http://localhost:3000/api/graphql'

export async function fetchGraphQL(query, variables) {
  const response = await fetch(API_URI, {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    headers: { 'Content-Type': 'application/json' },
  })

  const { data, errors } = await response.json()
  if (errors) {
    throw new Error(`GraphQL errors occurred:\n${errors.map(x => x.message).join('\n')}`)
  }

  return data
}
