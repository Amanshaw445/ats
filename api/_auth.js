const jwt = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'ats-dev-secret-change-in-prod'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aman45@shaw'

function requireAuth(req) {
  const header = req.headers['authorization'] || ''
  const token = header.replace('Bearer ', '').trim()
  if (!token) throw Object.assign(new Error('No token'), { status: 401 })
  try { return jwt.verify(token, SECRET) }
  catch { throw Object.assign(new Error('Invalid or expired token'), { status: 401 }) }
}

function issueToken() { return jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '24h' }) }

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization')
}

function strip(v, max = 2000) {
  if (v == null) return ''
  return String(v).replace(/<[^>]*>/g, '').trim().slice(0, max)
}

module.exports = { requireAuth, issueToken, ADMIN_PASSWORD, cors, strip }
