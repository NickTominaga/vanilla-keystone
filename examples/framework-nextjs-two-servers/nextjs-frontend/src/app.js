import { fetchGraphQL } from './graphql.js'

const app = document.getElementById('app')

function formatDate(date) {
  return date ? new Date(date).toLocaleDateString() : ''
}

function postMeta(post) {
  const date = formatDate(post.publishDate)
  const author = post.author?.name || ''
  if (!date && !author) return ''
  if (date && author) return `${date} · by ${author}`
  if (date) return date
  return `by ${author}`
}

async function renderHome() {
  app.innerHTML = '<p>Loading...</p>'

  try {
    const data = await fetchGraphQL(`
      query posts {
        posts {
          id
          title
          slug
          publishDate
          author {
            name
          }
        }
      }
    `)

    const posts = data?.posts || []
    if (!posts.length) {
      app.innerHTML = '<p>No posts found yet. Add one in the Keystone Admin UI.</p>'
      return
    }

    app.innerHTML = `
      <h1>Posts</h1>
      <ul class="posts">
        ${posts
          .map(
            post => `
              <li>
                <a href="/post.html?slug=${encodeURIComponent(post.slug)}">${post.title}</a>
                <p class="meta">${postMeta(post)}</p>
              </li>
            `
          )
          .join('')}
      </ul>
    `
  } catch (error) {
    app.innerHTML = `<h1>Something went wrong</h1><pre>${error.message}</pre>`
  }
}

renderHome()
