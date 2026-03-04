import s from './Process.module.css'

const steps = [
  { n:'01', icon:'💬', title:'Free Consultation', desc:'Tell us about your business. We listen, ask smart questions and suggest the best solution.' },
  { n:'02', icon:'🎨', title:'Design & Approve', desc:'We show you a design mockup within 48 hours. You give feedback until it\'s perfect.' },
  { n:'03', icon:'⚙️', title:'Build & Test', desc:'We build everything, test across devices, and keep you updated throughout.' },
  { n:'04', icon:'🚀', title:'Launch & Support', desc:'Go live! We handle hosting setup and stay available for any questions or changes.' },
]

export default function Process() {
  return (
    <section id="process" className={s.section}>
      <div className={s.inner}>
        <div className={s.header}>
          <div className={s.eyebrow}>How It Works</div>
          <h2 className={s.title}>From <span className="serif" style={{color:'var(--accent)',fontStyle:'italic'}}>Idea</span> to Live Website<br />in 4 Simple Steps</h2>
        </div>
        <div className={s.grid}>
          {steps.map(st => (
            <div key={st.n} className={`${s.step} reveal`}>
              <div className={s.numWrap}>{st.n}</div>
              <span className={s.icon}>{st.icon}</span>
              <div className={s.title2}>{st.title}</div>
              <p className={s.desc}>{st.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
