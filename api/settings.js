const { getDb } = require('./_db')
const { requireAuth, cors, strip } = require('./_auth')

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  try {
    const db = await getDb()
    if (req.method === 'GET') {
      const r = await db.execute('SELECT * FROM site_settings WHERE id=1')
      return res.status(200).json(r.rows[0] || {})
    }
    requireAuth(req)
    if (req.method === 'PUT' || req.method === 'POST') {
      const b = req.body || {}
      await db.execute({ sql: 'UPDATE site_settings SET company_name=?,whatsapp=?,contact_email=?,hero_tagline=? WHERE id=1', args: [strip(b.company_name), strip(b.whatsapp,20), strip(b.contact_email), strip(b.hero_tagline)] })
      return res.status(200).json({ ok: true })
    }
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) { return res.status(err.status || 500).json({ error: err.message }) }
}
