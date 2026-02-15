import { fetchGraphQL } from './graphql.js'

const app = document.getElementById('app')

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : ''
}

function documentToHtml(documentNode) {
  const children = documentNode?.children || []
  return children
    .map(node => {
      if (node.type === 'paragraph') {
        const text = (node.children || []).map(child => child.text || '').join('')
        return `<p>${text}</p>`
      }
      if (node.type === 'heading') {
        const text = (node.children || []).map(child => child.text || '').join('')
        return `<h2>${text}</h2>`
      }
      return ''
    })
    .join('')
}

async function renderPost() {
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('slug')

  if (!slug) {
    app.innerHTML = '<p>Post not found</p>'
    return
  }

  app.innerHTML = '<p>Loading...</p>'

  try {
    const data = await fetchGraphQL(
      `
        query post($slug: String!) {
          post(where: { slug: $slug }) {
            id
            title
            slug
            publishDate
            author {
              name
            }
            content {
              document
            }
          }
        }
      `,
      { slug }
    )

    const post = data?.post
    if (!post) {
      app.innerHTML = '<p>Post not found</p>'
      return
    }

    const meta = [
      formatDate(post.publishDate),
      post.author?.name ? `by ${post.author.name}` : '',
    ]
      .filter(Boolean)
      .join(' · ')

    app.innerHTML = `
      <p><a href="/">&larr; back home</a></p>
      <article>
        <h1>${post.title}</h1>
        <p class="meta">${meta}</p>
        <div>${documentToHtml(post.content?.document)}</div>
      </article>
    `
  } catch (error) {
    app.innerHTML = `<h1>Something went wrong</h1><pre>${error.message}</pre>`
  }
}

renderPost()
