import s from './Pricing.module.css'

const plans = [
  { name:'Starter', price:'4,999', period:'one-time', featured:false,
    desc:'Perfect for small businesses, shops & professionals who need a clean online presence.',
    features:['Up to 5 pages','Mobile-first design','Contact form','Basic SEO setup','1 month support','Free domain (1 yr)'],
    cta:'Get Started' },
  { name:'Growth', price:'12,999', period:'one-time', featured:true,
    badge:'Most Popular',
    desc:'For businesses that want more leads, more pages and a built-in admin dashboard.',
    features:['Up to 15 pages','Custom admin dashboard','Enquiry tracking','Advanced SEO','WhatsApp integration','3 months support','Google Analytics'],
    cta:'Get This Plan' },
  { name:'Pro / App', price:'Custom', period:'project', featured:false,
    desc:'Full web applications, e-commerce stores, CRMs and custom software solutions.',
    features:['Unlimited pages','User login system','Payment gateway','Database & API','Custom features','6 months support','Training included'],
    cta:'Request Quote' },
]

export default function Pricing() {
  const scroll = () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  return (
    <section id="pricing" className={s.section}>
      <div className={s.inner}>
        <div className={s.header}>
          <div className={s.eyebrow}>Transparent Pricing</div>
          <h2 className={s.title}>No Surprises. No <span className="serif" style={{color:'var(--accent)',fontStyle:'italic'}}>Hidden</span> Fees.</h2>
          <p className={s.desc}>Choose a plan that fits your business. All plans include free consultation and a design preview before you commit.</p>
        </div>
        <div className={s.grid}>
          {plans.map(p => (
            <div key={p.name} className={`${s.card} ${p.featured ? s.featured : ''} reveal`}>
              {p.badge && <div className={s.badge}>{p.badge}</div>}
              <div className={s.name}>{p.name}</div>
              <div className={s.amount}>
                {p.price === 'Custom' ? <span>Custom</span> : <><sup>₹</sup>{p.price}<sub>/{p.period}</sub></>}
              </div>
              <p className={s.planDesc}>{p.desc}</p>
              <div className={s.divider} />
              <ul className={s.features}>
                {p.features.map(f => <li key={f}><span className={s.check}>✓</span>{f}</li>)}
              </ul>
              <button onClick={scroll} className={`${s.btn} ${p.featured ? s.btnFeatured : s.btnDefault}`}>
                {p.cta} →
              </button>
            </div>
          ))}
        </div>
        <p className={s.note}>
          💡 All prices include GST-friendly invoices. EMI options available for Growth & Pro plans.
        </p>
      </div>
    </section>
  )
}
