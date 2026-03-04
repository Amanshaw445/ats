import s from './WhyUs.module.css'

const items = [
  { title:'Truly Local', desc:'We\'re based in Asansol — you can meet us in person, call or WhatsApp anytime. Real people, not a ticket system.' },
  { title:'Best Price Guarantee', desc:'Premium quality at small-business prices. We\'ll match or beat any comparable quote you receive.' },
  { title:'7-Day Delivery', desc:'Most websites delivered in 7 working days. No months-long waiting. No endless revisions that go nowhere.' },
  { title:'Your Own Dashboard', desc:'Log in anytime to see enquiries, update content, track performance — even if you\'re not technical.' },
]

export default function WhyUs() {
  return (
    <section id="why" className={s.section}>
      <div className={s.inner}>
        <div className={s.grid}>
          <div>
            <div className={s.eyebrow}>Why Choose Us</div>
            <h2 className={s.title}>The <span className="serif" style={{color:'var(--accent)',fontStyle:'italic'}}>Smarter</span> Choice<br />for Asansol Businesses</h2>
            <ul className={s.list}>
              {items.map((it, i) => (
                <li key={it.title} className={`${s.item} reveal`}>
                  <div className={s.num}>{String(i+1).padStart(2,'0')}</div>
                  <div>
                    <div className={s.itemTitle}>{it.title}</div>
                    <div className={s.itemDesc}>{it.desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.visual}>
            <div className={s.bigCard}>
              <div className={s.cardLabel}>Starting from</div>
              <div className={s.cardPrice}><span>₹</span>4,999</div>
              <div className={s.cardSub}>One-time payment · No hidden fees</div>
              <ul className={s.features}>
                {['Mobile-first design','SEO ready from day one','Free domain for 1 year','SSL certificate included','WhatsApp support always on'].map(f => <li key={f}>{f}</li>)}
              </ul>
            </div>
            <div className={s.floatCard}>
              <div className={s.floatVal}>98%</div>
              <div className={s.floatLbl}>Client satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
