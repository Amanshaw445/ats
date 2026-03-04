const { getDb } = require('./_db')
const { requireAuth, cors } = require('./_auth')

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  try {
    requireAuth(req)
    const db = await getDb()
    const [total, newCount, services, projects] = await Promise.all([
      db.execute("SELECT COUNT(*) as c FROM enquiries"),
      db.execute("SELECT COUNT(*) as c FROM enquiries WHERE status='new'"),
      db.execute("SELECT COUNT(*) as c FROM services"),
      db.execute("SELECT COUNT(*) as c FROM projects"),
    ])
    return res.status(200).json({
      total: Number(total.rows[0].c),
      new: Number(newCount.rows[0].c),
      services: Number(services.rows[0].c),
      projects: Number(projects.rows[0].c),
    })
  } catch (err) { return res.status(err.status || 500).json({ error: err.message }) }
}
