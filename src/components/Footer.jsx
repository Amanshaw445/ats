import s from './Footer.module.css'

export default function Footer() {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  return (
    <footer className={s.footer}>
      <div className={s.inner}>
        <div className={s.top}>
          <div>
            <div className={s.brand}>
              <span className={s.mark}>ATS</span>
              Asansol Tech Solutions
            </div>
            <p className={s.brandDesc}>Helping businesses in Asansol and across India get a strong, professional online presence at the best price.</p>
          </div>
          <div>
            <div className={s.colTitle}>Services</div>
            <ul className={s.links}>
              {['Business Website','Web Application','Custom Software'].map(l => <li key={l}><button onClick={() => scroll('services')} className={s.link}>{l}</button></li>)}
              <li><button onClick={() => scroll('pricing')} className={s.link}>View Pricing</button></li>
            </ul>
          </div>
          <div>
            <div className={s.colTitle}>Contact</div>
            <ul className={s.links}>
              <li><a href="tel:+919832076269" className={s.link}>+91 9832076269</a></li>
              <li><a href="mailto:hello@asansoltechsolutions.com" className={s.link}>hello@asansoltechsolutions.com</a></li>
              <li><span className={s.link}>Asansol, West Bengal</span></li>
              <li><a href="https://wa.me/919832076269" target="_blank" rel="noopener" className={s.link}>WhatsApp Us</a></li>
            </ul>
          </div>
        </div>
        <div className={s.bottom}>
          <div>© 2025 Asansol Tech Solutions. All rights reserved.</div>
          <div>Developed and maintained by Aman Shaw</div>
        </div>
      </div>
    </footer>
  )
}
