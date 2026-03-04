const { getDb } = require('./_db')
const { requireAuth, cors, strip } = require('./_auth')

function safeParse(str, fb) { try { return JSON.parse(str) } catch { return fb } }

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  try {
    const db = await getDb()
    if (req.method === 'GET') {
      const isAdmin = req.query?.all === '1'
      if (isAdmin) requireAuth(req)
      const r = isAdmin
        ? await db.execute('SELECT * FROM projects ORDER BY created_at DESC')
        : await db.execute('SELECT * FROM projects WHERE published=1 ORDER BY created_at DESC')
      return res.status(200).json(r.rows.map(p => ({ ...p, tags: safeParse(p.tags, []) })))
    }
    requireAuth(req)
    const tagsJson = (b) => JSON.stringify(Array.isArray(b?.tags) ? b.tags.map(t=>strip(t,50)).filter(Boolean) : [])
    if (req.method === 'POST') {
      const b = req.body || {}
      const r = await db.execute({ sql: 'INSERT INTO projects (title,category,url,description,tags,published) VALUES (?,?,?,?,?,?)', args: [strip(b.title), strip(b.category), strip(b.url,300), strip(b.description), tagsJson(b), b.published?1:0] })
      return res.status(201).json({ id: Number(r.lastInsertRowid) })
    }
    if (req.method === 'PUT') {
      const id = parseInt(req.query?.id, 10); const b = req.body || {}
      await db.execute({ sql: 'UPDATE projects SET title=?,category=?,url=?,description=?,tags=?,published=? WHERE id=?', args: [strip(b.title), strip(b.category), strip(b.url,300), strip(b.description), tagsJson(b), b.published?1:0, id] })
      return res.status(200).json({ ok: true })
    }
    if (req.method === 'DELETE') {
      const id = parseInt(req.query?.id, 10)
      await db.execute({ sql: 'DELETE FROM projects WHERE id=?', args: [id] })
      return res.status(200).json({ ok: true })
    }
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) { return res.status(err.status || 500).json({ error: err.message }) }
}
