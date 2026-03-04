import { useState, useEffect, useCallback } from 'react'
import s from './Admin.module.css'

// ── API helper ────────────────────────────────────────
const getToken = () => sessionStorage.getItem('ats_token') || ''

async function api(path, opts = {}) {
  const token = getToken()
  const res = await fetch('/api' + path, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(opts.headers || {})
    },
    body: opts.body != null ? JSON.stringify(opts.body) : undefined
  })
  if (res.status === 401) { sessionStorage.removeItem('ats_token'); window.location.reload() }
  return res.ok ? res.json() : null
}

// ── Login Screen ──────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    if (!pw) return
    setLoading(true); setErr('')
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setErr(data.error || 'Invalid credentials'); return }
    sessionStorage.setItem('ats_token', data.token)
    onLogin()
  }

  return (
    <div className={s.loginWrap}>
      <div className={s.loginCard}>
        <div className={s.loginLogo}>
          <div className={s.loginMark}>ATS</div>
          <span className={s.loginLogoText}>Admin Access</span>
        </div>
        <h1 className={s.loginH1}>Welcome back</h1>
        <p className={s.loginSub}>Enter your password to manage the site.</p>
        <label className={s.label}>Password</label>
        <input
          type="password"
          className={s.loginInput}
          placeholder="Enter password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          autoComplete="current-password"
        />
        {err && <div className={s.loginError}>{err}</div>}
        <button className={s.loginBtn} onClick={submit} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In →'}
        </button>
      </div>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState(null)
  const show = useCallback((text) => {
    setMsg(text)
    setTimeout(() => setMsg(null), 3000)
  }, [])
  return { msg, show }
}

// ── Admin Shell ───────────────────────────────────────
export default function Admin() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem('ats_token'))
  const [section, setSection] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { msg: toastMsg, show: toast } = useToast()

  const nav = (name) => { setSection(name); setSidebarOpen(false) }
  const signOut = () => { sessionStorage.removeItem('ats_token'); setAuthed(false) }

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />

  return (
    <div className={s.shell}>
      {/* Mobile toggle */}
      <button className={s.sbToggle} onClick={() => setSidebarOpen(o => !o)}>
        <span /><span /><span />
      </button>
      {sidebarOpen && <div className={s.sbOverlay} onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`${s.sidebar} ${sidebarOpen ? s.sidebarOpen : ''}`}>
        <div className={s.sbLogo}>
          <div className={s.sbMark}>ATS</div>
          <span className={s.sbName}>Admin Panel</span>
        </div>
        <nav className={s.sbNav}>
          <div className={s.sbSectionLabel}>Main</div>
          {[
            { id:'dashboard', icon:'📊', label:'Dashboard' },
            { id:'enquiries', icon:'📩', label:'Enquiries' },
          ].map(n => (
            <button key={n.id} className={`${s.sbLink} ${section === n.id ? s.sbActive : ''}`} onClick={() => nav(n.id)}>
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
          <div className={s.sbSectionLabel}>Content</div>
          {[
            { id:'services', icon:'⚡', label:'Services' },
            { id:'projects', icon:'🗂️', label:'Projects' },
            { id:'testimonials', icon:'💬', label:'Testimonials' },
          ].map(n => (
            <button key={n.id} className={`${s.sbLink} ${section === n.id ? s.sbActive : ''}`} onClick={() => nav(n.id)}>
              <span>{n.icon}</span> {n.label}
            </button>
          ))}
          <div className={s.sbSectionLabel}>Admin</div>
          <button className={`${s.sbLink} ${section === 'settings' ? s.sbActive : ''}`} onClick={() => nav('settings')}>
            <span>⚙️</span> Settings
          </button>
        </nav>
        <div className={s.sbUser}>
          <div className={s.sbAvatar}>A</div>
          <div>
            <div className={s.sbUserName}>Aman Shaw</div>
            <div className={s.sbUserEmail}>Admin</div>
          </div>
          <button className={s.sbSignout} onClick={signOut} title="Sign out">🚪</button>
        </div>
      </aside>

      {/* Main */}
      <div className={s.main}>
        <header className={s.topbar}>
          <div className={s.topbarTitle}>{section.charAt(0).toUpperCase() + section.slice(1)}</div>
          <div className={s.liveDot}>Live</div>
        </header>
        <div className={s.content}>
          {section === 'dashboard'    && <Dashboard toast={toast} goTo={nav} />}
          {section === 'enquiries'    && <Enquiries toast={toast} />}
          {section === 'services'     && <ContentTable type="services" toast={toast} />}
          {section === 'projects'     && <ContentTable type="projects" toast={toast} />}
          {section === 'testimonials' && <ContentTable type="testimonials" toast={toast} />}
          {section === 'settings'     && <SettingsPanel toast={toast} />}
        </div>
      </div>

      {toastMsg && <div className={s.toast}>{toastMsg}</div>}
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────
function Dashboard({ toast, goTo }) {
  const [stats, setStats] = useState(null)
  const [recent, setRecent] = useState([])

  useEffect(() => {
    api('/stats').then(setStats)
    api('/enquiries').then(d => setRecent((d || []).slice(0, 6)))
  }, [])

  return (
    <div>
      <div className={s.statsGrid}>
        {[
          { label:'Total Enquiries', val: stats?.total ?? '–' },
          { label:'New Enquiries',   val: stats?.new ?? '0', accent: true },
          { label:'Services',        val: stats?.services ?? '–' },
          { label:'Projects',        val: stats?.projects ?? '–', teal: true },
        ].map(st => (
          <div key={st.label} className={s.statCard}>
            <div className={s.statLabel}>{st.label}</div>
            <div className={`${s.statVal} ${st.accent ? s.accentVal : ''} ${st.teal ? s.tealVal : ''}`}>{st.val}</div>
          </div>
        ))}
      </div>
      <div className={s.card}>
        <div className={s.cardHdr}>
          <span className={s.cardHdrTitle}>Recent Enquiries</span>
          <button className={s.btnGhost} onClick={() => goTo('enquiries')}>View All</button>
        </div>
        <EqTable rows={recent} onUpdate={() => {}} mini />
      </div>
    </div>
  )
}

// ── Enquiries ─────────────────────────────────────────
function Enquiries({ toast }) {
  const [rows, setRows] = useState([])
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    const url = filter === 'all' ? '/enquiries' : `/enquiries?status=${filter}`
    const data = await api(url)
    setRows(data || [])
  }, [filter])

  useEffect(() => { load() }, [load])

  const mark = async (status) => {
    await api(`/enquiries?id=${selected.id}`, { method: 'PATCH', body: { status } })
    toast(`Marked as ${status}`); setSelected(null); load()
  }
  const del = async () => {
    if (!confirm('Delete this enquiry?')) return
    await api(`/enquiries?id=${selected.id}`, { method: 'DELETE' })
    toast('Deleted'); setSelected(null); load()
  }

  return (
    <div>
      <div className={s.filterTabs}>
        {['all','new','read','done'].map(f => (
          <button key={f} className={`${s.filterTab} ${filter === f ? s.filterActive : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className={s.card}>
        <EqTable rows={rows} onSelect={setSelected} />
      </div>

      {selected && (
        <Modal title="Enquiry Detail" onClose={() => setSelected(null)}>
          <div className={s.detailGrid}>
            {[['Name', selected.name],['Email',selected.email||'–'],['Phone',selected.phone||'–'],['Service',selected.service||'–'],['Status',selected.status||'new'],['Date',new Date(selected.created_at).toLocaleString('en-IN')]].map(([k,v]) => (
              <div key={k} className={s.detailItem}><label>{k}</label><span>{v}</span></div>
            ))}
          </div>
          <div className={s.mGroup}>
            <label className={s.mLabel}>Message</label>
            <div className={s.msgBox}>{selected.message || '–'}</div>
          </div>
          <div className={s.modalFoot}>
            <button className={s.btnGhost} onClick={() => mark('read')}>Mark Read</button>
            <button className={s.btnAccent} onClick={() => mark('done')}>Mark Done</button>
            <button className={s.btnDanger} style={{marginLeft:'auto'}} onClick={del}>Delete</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function EqTable({ rows, onSelect, mini }) {
  if (!rows.length) return <div className={s.empty}>No enquiries found.</div>
  return (
    <table className={s.table}>
      <thead><tr>
        <th>Name</th>
        {!mini && <th>Phone</th>}
        <th>Service</th>
        <th>Status</th>
        <th>Date</th>
        {onSelect && <th></th>}
      </tr></thead>
      <tbody>
        {rows.map(eq => (
          <tr key={eq.id}>
            <td><strong>{eq.name}</strong><br /><span style={{fontSize:11,color:'var(--ink3)'}}>{eq.email || ''}</span></td>
            {!mini && <td>{eq.phone || '–'}</td>}
            <td>{eq.service || '–'}</td>
            <td><span className={`${s.badge} ${s['badge_' + (eq.status||'new')]}`}>{eq.status||'new'}</span></td>
            <td>{new Date(eq.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</td>
            {onSelect && <td><button className={s.btnGhost} onClick={() => onSelect(eq)}>View</button></td>}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ── Generic Content Table (Services / Projects / Testimonials) ─
function ContentTable({ type, toast }) {
  const [rows, setRows] = useState([])
  const [editing, setEditing] = useState(null) // null = closed, {} = new, {...} = edit

  const load = useCallback(async () => {
    const data = await api(`/${type}?all=1`)
    setRows(data || [])
  }, [type])

  useEffect(() => { load() }, [load])

  const del = async (id) => {
    if (!confirm('Delete?')) return
    await api(`/${type}?id=${id}`, { method: 'DELETE' })
    toast('Deleted'); load()
  }

  const save = async (payload) => {
    const isEdit = !!payload.id
    const id = payload.id; delete payload.id
    if (isEdit) await api(`/${type}?id=${id}`, { method: 'PUT', body: payload })
    else await api(`/${type}`, { method: 'POST', body: payload })
    toast('Saved!'); setEditing(null); load()
  }

  return (
    <div>
      <div style={{display:'flex',justifyContent:'flex-end',marginBottom:16}}>
        <button className={s.btnAccent} onClick={() => setEditing({})}>+ Add {type.slice(0,-1)}</button>
      </div>
      <div className={s.card}>
        {rows.length === 0 ? (
          <div className={s.empty}>No {type} yet.</div>
        ) : (
          <table className={s.table}>
            <thead><tr>
              {type === 'services' && <><th>Icon</th><th>Title</th><th>Status</th><th>Actions</th></>}
              {type === 'projects' && <><th>Title</th><th>Category</th><th>Status</th><th>Actions</th></>}
              {type === 'testimonials' && <><th>Name</th><th>Role</th><th>Rating</th><th>Status</th><th>Actions</th></>}
            </tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  {type === 'services' && <>
                    <td style={{fontSize:20}}>{row.icon||'🌐'}</td>
                    <td><strong>{row.title}</strong></td>
                    <td><PubBadge pub={row.published} /></td>
                    <td><RowActions onEdit={() => setEditing(row)} onDel={() => del(row.id)} /></td>
                  </>}
                  {type === 'projects' && <>
                    <td><strong>{row.title}</strong></td>
                    <td>{row.category||'–'}</td>
                    <td><PubBadge pub={row.published} /></td>
                    <td><RowActions onEdit={() => setEditing(row)} onDel={() => del(row.id)} /></td>
                  </>}
                  {type === 'testimonials' && <>
                    <td><strong>{row.name}</strong></td>
                    <td>{row.role||'–'}</td>
                    <td>{'★'.repeat(row.rating||5)}</td>
                    <td><PubBadge pub={row.published} /></td>
                    <td><RowActions onEdit={() => setEditing(row)} onDel={() => del(row.id)} /></td>
                  </>}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing !== null && <ContentForm type={type} initial={editing} onSave={save} onClose={() => setEditing(null)} />}
    </div>
  )
}

function PubBadge({ pub }) {
  return <span className={`${s.badge} ${pub ? s.badge_published : s.badge_draft}`}>{pub ? 'Published' : 'Draft'}</span>
}
function RowActions({ onEdit, onDel }) {
  return <div style={{display:'flex',gap:6}}><button className={s.btnGhost} onClick={onEdit}>Edit</button><button className={s.btnDanger} onClick={onDel}>Del</button></div>
}

function ContentForm({ type, initial, onSave, onClose }) {
  const [f, setF] = useState({
    title: initial.title || '',
    description: initial.description || '',
    icon: initial.icon || '',
    order_index: initial.order_index || 0,
    published: initial.published !== undefined ? !!initial.published : true,
    category: initial.category || '',
    url: initial.url || '',
    tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : (initial.tags || ''),
    name: initial.name || '',
    role: initial.role || '',
    message: initial.message || '',
    rating: initial.rating || 5,
  })
  const set = k => e => setF(p => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const submit = () => {
    const payload = { ...f }
    if (initial.id) payload.id = initial.id
    if (type === 'projects') payload.tags = f.tags.split(',').map(t => t.trim()).filter(Boolean)
    onSave(payload)
  }

  const title = type === 'services' ? 'Service' : type === 'projects' ? 'Project' : 'Testimonial'

  return (
    <Modal title={`${initial.id ? 'Edit' : 'Add'} ${title}`} onClose={onClose}>
      {type === 'services' && <>
        <MInput label="Title *" value={f.title} onChange={set('title')} />
        <MTextarea label="Description" value={f.description} onChange={set('description')} />
        <div className={s.mGrid}>
          <MInput label="Icon (emoji)" value={f.icon} onChange={set('icon')} />
          <MInput label="Order" type="number" value={f.order_index} onChange={set('order_index')} />
        </div>
        <MCheck label="Published" checked={f.published} onChange={set('published')} />
      </>}
      {type === 'projects' && <>
        <MInput label="Title *" value={f.title} onChange={set('title')} />
        <div className={s.mGrid}>
          <MInput label="Category" value={f.category} onChange={set('category')} />
          <MInput label="Live URL" value={f.url} onChange={set('url')} />
        </div>
        <MTextarea label="Description" value={f.description} onChange={set('description')} />
        <MInput label="Tags (comma separated)" value={f.tags} onChange={set('tags')} />
        <MCheck label="Published" checked={f.published} onChange={set('published')} />
      </>}
      {type === 'testimonials' && <>
        <div className={s.mGrid}>
          <MInput label="Client Name *" value={f.name} onChange={set('name')} />
          <MInput label="Role / Company" value={f.role} onChange={set('role')} />
        </div>
        <MTextarea label="Message *" value={f.message} onChange={set('message')} />
        <MInput label="Rating (1–5)" type="number" value={f.rating} onChange={set('rating')} min={1} max={5} />
        <MCheck label="Published" checked={f.published} onChange={set('published')} />
      </>}
      <div className={s.modalFoot}>
        <button className={s.btnGhost} onClick={onClose}>Cancel</button>
        <button className={s.btnAccent} onClick={submit}>Save</button>
      </div>
    </Modal>
  )
}

// ── Settings ──────────────────────────────────────────
function SettingsPanel({ toast }) {
  const [f, setF] = useState({ company_name:'', whatsapp:'', contact_email:'', hero_tagline:'' })
  useEffect(() => { api('/settings').then(d => d && setF(d)) }, [])
  const set = k => e => setF(p => ({ ...p, [k]: e.target.value }))
  const save = async () => {
    await api('/settings', { method: 'PUT', body: f })
    toast('Settings saved!')
  }
  return (
    <div className={s.card} style={{maxWidth:560,padding:24}}>
      <div className={s.cardHdr}><span className={s.cardHdrTitle}>Site Settings</span></div>
      <div style={{padding:'20px 0',display:'flex',flexDirection:'column',gap:14}}>
        <MInput label="Company Name" value={f.company_name} onChange={set('company_name')} />
        <MInput label="Phone / WhatsApp" value={f.whatsapp} onChange={set('whatsapp')} />
        <MInput label="Email" type="email" value={f.contact_email} onChange={set('contact_email')} />
        <MInput label="Hero Tagline" value={f.hero_tagline} onChange={set('hero_tagline')} />
        <button className={s.btnAccent} style={{width:'fit-content'}} onClick={save}>Save Settings</button>
      </div>
    </div>
  )
}

// ── Shared mini form components ───────────────────────
function MInput({ label, ...props }) {
  return (
    <div className={s.mGroup}>
      <label className={s.mLabel}>{label}</label>
      <input className={s.mInput} {...props} />
    </div>
  )
}
function MTextarea({ label, ...props }) {
  return (
    <div className={s.mGroup}>
      <label className={s.mLabel}>{label}</label>
      <textarea className={s.mTextarea} {...props} />
    </div>
  )
}
function MCheck({ label, checked, onChange }) {
  return (
    <div className={s.mCheckRow}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <label>{label}</label>
    </div>
  )
}

// ── Modal wrapper ─────────────────────────────────────
function Modal({ title, children, onClose }) {
  return (
    <div className={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={s.modal}>
        <div className={s.modalHead}>
          <span className={s.modalTitle}>{title}</span>
          <button className={s.modalClose} onClick={onClose}>✕</button>
        </div>
        <div className={s.modalBody}>{children}</div>
      </div>
    </div>
  )
}
