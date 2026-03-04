const bcrypt = require('bcryptjs')
const { issueToken, ADMIN_PASSWORD, cors } = require('./_auth')
const HASHED = bcrypt.hashSync(ADMIN_PASSWORD, 10)

module.exports = async (req, res) => {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { password } = req.body || {}
  if (!password || typeof password !== 'string') return res.status(400).json({ error: 'Password required' })
  const ok = await bcrypt.compare(password, HASHED)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  return res.status(200).json({ token: issueToken() })
}
