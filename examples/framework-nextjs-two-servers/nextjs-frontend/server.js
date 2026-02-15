import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = __dirname
const port = 8000

const contentTypeByExt = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.ico': 'image/x-icon',
}

http
  .createServer((req, res) => {
    const requestPath = req.url === '/' ? '/index.html' : req.url
    const filePath = path.join(root, requestPath.split('?')[0])

    if (!filePath.startsWith(root)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Not Found')
        return
      }

      const ext = path.extname(filePath)
      const contentType = contentTypeByExt[ext] || 'application/octet-stream'
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    })
  })
  .listen(port, () => {
    console.log(`Vanilla frontend running at http://localhost:${port}`)
  })
