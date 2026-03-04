const { getDb } = require('./_db')
const { requireAuth, cors, strip } = require('./_auth')

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  try {
    const db = await getDb()
    if (req.method === 'GET') {
      const isAdmin = req.query?.all === '1'
      if (isAdmin) requireAuth(req)
      const r = isAdmin
        ? await db.execute('SELECT * FROM testimonials ORDER BY order_index')
        : await db.execute('SELECT * FROM testimonials WHERE published=1 ORDER BY order_index')
      return res.status(200).json(r.rows)
    }
    requireAuth(req)
    const clampRating = v => Math.min(5, Math.max(1, parseInt(v)||5))
    if (req.method === 'POST') {
      const b = req.body || {}
      const r = await db.execute({ sql: 'INSERT INTO testimonials (name,role,message,rating,published) VALUES (?,?,?,?,?)', args: [strip(b.name), strip(b.role), strip(b.message,1000), clampRating(b.rating), b.published?1:0] })
      return res.status(201).json({ id: Number(r.lastInsertRowid) })
    }
    if (req.method === 'PUT') {
      const id = parseInt(req.query?.id, 10); const b = req.body || {}
      await db.execute({ sql: 'UPDATE testimonials SET name=?,role=?,message=?,rating=?,published=? WHERE id=?', args: [strip(b.name), strip(b.role), strip(b.message,1000), clampRating(b.rating), b.published?1:0, id] })
      return res.status(200).json({ ok: true })
    }
    if (req.method === 'DELETE') {
      const id = parseInt(req.query?.id, 10)
      await db.execute({ sql: 'DELETE FROM testimonials WHERE id=?', args: [id] })
      return res.status(200).json({ ok: true })
    }
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) { return res.status(err.status || 500).json({ error: err.message }) }
}
