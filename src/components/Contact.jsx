import { useState } from 'react'
import s from './Contact.module.css'

export default function Contact() {
  const [form, setForm] = useState({ name:'', phone:'', email:'', service:'', message:'' })
  const [state, setState] = useState('idle') // idle | loading | success | error

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      alert('Please enter your name and phone number.')
      return
    }
    setState('loading')
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error()
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <section id="contact" className={s.section}>
      <div className={s.inner}>
        <div className={s.left}>
          <div className={s.eyebrow}>Get In Touch</div>
          <h2 className={s.title}>Let's Build Something<br /><span className="serif" style={{color:'var(--accent)',fontStyle:'italic'}}>Amazing</span> Together</h2>
          <p className={s.desc}>Free consultation. No commitment. Just an honest conversation about how we can help your business grow online.</p>

          <div className={s.methods}>
            {[
              { icon:'📱', label:'Call / WhatsApp', val:'+91 9832076269', href:'tel:+919832076269' },
              { icon:'✉️', label:'Email', val:'hello@asansoltechsolutions.com', href:'mailto:hello@asansoltechsolutions.com' },
              { icon:'📍', label:'Location', val:'Asansol, West Bengal', href:null },
            ].map(m => (
              <div key={m.label} className={s.method}>
                <div className={s.methodIcon}>{m.icon}</div>
                <div>
                  <div className={s.methodLabel}>{m.label}</div>
                  {m.href
                    ? <a href={m.href} className={s.methodVal}>{m.val}</a>
                    : <span className={s.methodVal}>{m.val}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className={s.fastReply}>
            <div className={s.fastTitle}>⚡ Fast Response</div>
            <div className={s.fastDesc}>We typically reply within 2–4 hours on WhatsApp. Send a message and we'll set up a free call.</div>
          </div>
        </div>

        <div className={s.formWrap}>
          {state === 'success' ? (
            <div className={s.success}>
              <div className={s.successIcon}>🎉</div>
              <div className={s.successTitle}>Message Received!</div>
              <p className={s.successSub}>Thanks! We'll WhatsApp you within a few hours with next steps and a free quote.</p>
            </div>
          ) : (
            <>
              <div className={s.formTitle}>Send us a Message</div>
              <div className={s.formSub}>Fill in your details and we'll get back to you with a free quote within 24 hours.</div>

              <div className={s.row}>
                <div className={s.group}>
                  <label>Your Name *</label>
                  <input className={s.input} placeholder="Rajesh Kumar" value={form.name} onChange={set('name')} />
                </div>
                <div className={s.group}>
                  <label>Phone / WhatsApp *</label>
                  <input className={s.input} type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} />
                </div>
              </div>

              <div className={s.group}>
                <label>Email Address</label>
                <input className={s.input} type="email" placeholder="your@email.com" value={form.email} onChange={set('email')} />
              </div>

              <div className={s.group}>
                <label>What do you need?</label>
                <select className={s.select} value={form.service} onChange={set('service')}>
                  <option value="">Select a service...</option>
                  <option>Business Website</option>
                  <option>Web Application</option>
                  <option>Custom Software</option>
                  <option>Not sure — need advice</option>
                </select>
              </div>

              <div className={s.group}>
                <label>Tell us about your project</label>
                <textarea className={s.textarea} placeholder="What does your business do? What do you want the website to achieve?" value={form.message} onChange={set('message')} />
              </div>

              {state === 'error' && <div className={s.errorMsg}>Something went wrong. Please call us directly.</div>}

              <button className={s.submit} onClick={submit} disabled={state === 'loading'}>
                {state === 'loading' ? 'Sending…' : 'Send Message →'}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
