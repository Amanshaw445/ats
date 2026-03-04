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
        ? await db.execute('SELECT * FROM services ORDER BY order_index')
        : await db.execute('SELECT * FROM services WHERE published=1 ORDER BY order_index')
      return res.status(200).json(r.rows)
    }
    requireAuth(req)
    if (req.method === 'POST') {
      const { title, description, icon, order_index, published } = req.body || {}
      if (!strip(title)) return res.status(400).json({ error: 'Title required' })
      const r = await db.execute({ sql: 'INSERT INTO services (title,description,icon,order_index,published) VALUES (?,?,?,?,?)', args: [strip(title), strip(description,1000), strip(icon,10), parseInt(order_index)||0, published?1:0] })
      return res.status(201).json({ id: Number(r.lastInsertRowid) })
    }
    if (req.method === 'PUT') {
      const id = parseInt(req.query?.id, 10)
      const { title, description, icon, order_index, published } = req.body || {}
      await db.execute({ sql: 'UPDATE services SET title=?,description=?,icon=?,order_index=?,published=? WHERE id=?', args: [strip(title), strip(description,1000), strip(icon,10), parseInt(order_index)||0, published?1:0, id] })
      return res.status(200).json({ ok: true })
    }
    if (req.method === 'DELETE') {
      const id = parseInt(req.query?.id, 10)
      await db.execute({ sql: 'DELETE FROM services WHERE id=?', args: [id] })
      return res.status(200).json({ ok: true })
    }
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) { return res.status(err.status || 500).json({ error: err.message }) }
}
