import { useState, useEffect } from 'react'
import s from './Navbar.module.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(false)
  }

  return (
    <>
      <nav className={`${s.nav} ${scrolled ? s.scrolled : ''}`} id="navbar">
        <a className={s.logo} href="/">
          <div className={s.logoMark}>ATS</div>
          <span className={s.logoText}>Asansol <span>Tech</span></span>
        </a>

        <ul className={s.links}>
          {['services','why','process','pricing','contact'].map(id => (
            <li key={id}>
              <button onClick={() => scroll(id)} className={s.link}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </button>
            </li>
          ))}
        </ul>

        <button onClick={() => scroll('contact')} className={s.cta}>Get Free Quote</button>

        <button className={s.hamburger} onClick={() => setOpen(!open)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`${s.mobile} ${open ? s.mobileOpen : ''}`}>
        {['services','why','process','pricing','contact'].map(id => (
          <button key={id} onClick={() => scroll(id)} className={s.mobileLink}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </button>
        ))}
        <button onClick={() => scroll('contact')} className={s.mobileCta}>Get Free Quote →</button>
      </div>
    </>
  )
}
