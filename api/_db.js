// api/_db.js  — Uses @libsql/client (pure JS, no C++ compilation needed!)
// For persistent storage: set TURSO_URL + TURSO_AUTH_TOKEN in Vercel env vars (free at turso.tech)
// Without those, uses /tmp/ats.db (resets when Vercel recycles the function)

const { createClient } = require('@libsql/client')

let _client = null
let _ready = false

function getClient() {
  if (_client) return _client
  if (process.env.TURSO_URL && process.env.TURSO_AUTH_TOKEN) {
    _client = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_AUTH_TOKEN })
  } else {
    _client = createClient({ url: 'file:/tmp/ats.db' })
  }
  return _client
}

async function getDb() {
  const db = getClient()
  if (_ready) return db

  for (const sql of [
    `CREATE TABLE IF NOT EXISTS enquiries (
       id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, phone TEXT NOT NULL,
       email TEXT, service TEXT, message TEXT, status TEXT NOT NULL DEFAULT 'new',
       created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS services (
       id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT,
       icon TEXT, order_index INTEGER DEFAULT 0, published INTEGER DEFAULT 1)`,
    `CREATE TABLE IF NOT EXISTS projects (
       id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, category TEXT,
       url TEXT, description TEXT, tags TEXT DEFAULT '[]', published INTEGER DEFAULT 1,
       created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS testimonials (
       id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, role TEXT,
       message TEXT, rating INTEGER DEFAULT 5, order_index INTEGER DEFAULT 0,
       published INTEGER DEFAULT 1)`,
    `CREATE TABLE IF NOT EXISTS site_settings (
       id INTEGER PRIMARY KEY DEFAULT 1, company_name TEXT DEFAULT 'Asansol Tech Solutions',
       whatsapp TEXT DEFAULT '+919832076269',
       contact_email TEXT DEFAULT 'hello@asansoltechsolutions.com',
       hero_tagline TEXT DEFAULT 'Get Your Business Online the Right Way.')`,
    `INSERT OR IGNORE INTO site_settings (id) VALUES (1)`
  ]) { await db.execute(sql) }

  _ready = true
  return db
}

module.exports = { getDb }
