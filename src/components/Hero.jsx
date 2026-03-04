import s from './Hero.module.css'

export default function Hero() {
  const scroll = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="home" className={s.hero}>
      <div className={s.bgGrid} />
      <div className={s.blob1} />
      <div className={s.blob2} />

      <div className={s.inner}>
        <div className={s.left}>
          <div className={s.badge}>
            <span className={s.badgeDot} />
            Serving Asansol & All India
          </div>

          <h1 className={s.h1}>
            Get Your Business<br />
            <span className={`${s.accent} serif`}>Online</span> the Right Way.
          </h1>

          <p className={s.sub}>
            Professional websites, web apps & custom software — built fast,
            priced fairly, with a dashboard so you always know what's happening.
          </p>

          <div className={s.actions}>
            <button onClick={() => scroll('contact')} className={s.btnPrimary}>
              Get Free Quote →
            </button>
            <button onClick={() => scroll('services')} className={s.btnOutline}>
              See Our Work
            </button>
          </div>

          <div className={s.trust}>
            <div className={s.stars}>★★★★★</div>
            <div className={s.trustText}>
              <strong>Trusted by 50+ businesses</strong>
              across Asansol & West Bengal
            </div>
          </div>
        </div>

        <div className={s.right}>
          <div className={s.floatBadge1}>
            <span>🚀</span> Delivered in 7 days
          </div>

          <div className={s.card}>
            <div className={s.cardHeader}>
              <span className={`${s.dot} ${s.dotRed}`} />
              <span className={`${s.dot} ${s.dotYellow}`} />
              <span className={`${s.dot} ${s.dotGreen}`} />
              <div className={s.cardUrl}>yourshop.in</div>
            </div>
            <div className={s.cardBody}>
              <div className={s.hcRow}>
                <div className={`${s.hcBlock} ${s.accent3}`} style={{width:'60%'}} />
                <div className={s.hcBlock} style={{width:'30%'}} />
              </div>
              <div className={s.hcRow}>
                <div className={s.hcBlock} style={{width:'80%'}} />
              </div>
              <div className={s.hcRow}>
                <div className={s.hcBlock} style={{width:'45%'}} />
                <div className={`${s.hcBlock} ${s.tealBlock}`} style={{width:'20%'}} />
              </div>
              <div className={s.statRow}>
                {[['₹2.4L','Revenue'],['89%','Retention'],['4.9★','Rating']].map(([v,l]) => (
                  <div key={l} className={s.stat}>
                    <div className={s.statVal}>{v}</div>
                    <div className={s.statLbl}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={s.floatBadge2}>
            <span>💼</span> 50+ clients served
          </div>
        </div>
      </div>
    </section>
  )
}
