const { getDb } = require('./_db')
const { requireAuth, cors, strip } = require('./_auth')

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  try {
    const db = await getDb()

    if (req.method === 'POST') {
      const name = strip(req.body?.name), phone = strip(req.body?.phone, 20)
      if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' })
      const r = await db.execute({
        sql: 'INSERT INTO enquiries (name,phone,email,service,message) VALUES (?,?,?,?,?)',
        args: [name, phone, strip(req.body?.email,200), strip(req.body?.service,100), strip(req.body?.message)]
      })
      return res.status(201).json({ id: Number(r.lastInsertRowid), message: 'Enquiry received!' })
    }

    requireAuth(req)

    if (req.method === 'GET') {
      const status = req.query?.status
      const safe = ['new','read','done']
      const r = safe.includes(status)
        ? await db.execute({ sql: 'SELECT * FROM enquiries WHERE status=? ORDER BY created_at DESC', args: [status] })
        : await db.execute('SELECT * FROM enquiries ORDER BY created_at DESC')
      return res.status(200).json(r.rows)
    }

    if (req.method === 'PATCH') {
      const id = parseInt(req.query?.id, 10)
      const status = strip(req.body?.status, 10)
      if (!id || !['new','read','done'].includes(status)) return res.status(400).json({ error: 'Invalid' })
      await db.execute({ sql: 'UPDATE enquiries SET status=? WHERE id=?', args: [status, id] })
      return res.status(200).json({ ok: true })
    }

    if (req.method === 'DELETE') {
      const id = parseInt(req.query?.id, 10)
      if (!id) return res.status(400).json({ error: 'Invalid id' })
      await db.execute({ sql: 'DELETE FROM enquiries WHERE id=?', args: [id] })
      return res.status(200).json({ ok: true })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message })
  }
}
