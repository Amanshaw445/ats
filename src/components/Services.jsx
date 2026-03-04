import s from './Services.module.css'

const services = [
  { icon:'🌐', title:'Business Website', desc:'A stunning, mobile-first website that builds trust and converts visitors into customers. Includes SEO, contact forms & analytics.', tags:['HTML/CSS','React','WordPress'] },
  { icon:'⚡', title:'Web Application', desc:'Custom web apps with user logins, dashboards, payments & more. Built to scale as your business grows.', tags:['React','Node.js','Database'] },
  { icon:'📱', title:'Custom Software', desc:'Bespoke tools — inventory systems, booking platforms, CRMs — tailored exactly to how your business works.', tags:['Full-Stack','API','Mobile-Ready'] },
  { icon:'🛒', title:'E-Commerce Store', desc:'Sell online with a complete shop — product listings, cart, payment gateway & order management.', tags:['Payments','Inventory','SEO'] },
  { icon:'📊', title:'Dashboard & CRM', desc:'See all your business data in one place. Track leads, sales, customers and performance metrics.', tags:['Analytics','Reports','Real-time'] },
  { icon:'🔧', title:'Maintenance & Support', desc:'Ongoing care for your website — updates, security patches, backups and technical support whenever you need it.', tags:['24/7','Security','Updates'] },
]

export default function Services() {
  return (
    <section id="services" className={s.section}>
      <div className={s.inner}>
        <div className={s.header}>
          <div>
            <div className={s.eyebrow}>What We Build</div>
            <h2 className={s.title}>Services Tailored<br />to <span className="serif" style={{color:'var(--accent)',fontStyle:'italic'}}>Your Business</span></h2>
          </div>
          <p className={s.desc}>From a simple brochure site to a full-stack web application — we handle the technology so you can focus on what you do best.</p>
        </div>

        <div className={s.grid}>
          {services.map((svc) => (
            <div key={svc.title} className={`${s.card} reveal`}>
              <div className={s.iconWrap}>{svc.icon}</div>
              <div className={s.cardTitle}>{svc.title}</div>
              <p className={s.cardDesc}>{svc.desc}</p>
              <div className={s.tags}>
                {svc.tags.map(t => <span key={t} className={s.tag}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
