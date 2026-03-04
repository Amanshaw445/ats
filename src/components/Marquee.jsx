import s from './Marquee.module.css'

const items = ['React & Next.js','WordPress','Mobile Apps','E-Commerce','SEO Optimized','Custom Software','Fast Delivery','5★ Support','Web Design','Asansol Based']

export default function Marquee() {
  const all = [...items, ...items]
  return (
    <div className={s.section}>
      <div className={s.track}>
        {all.map((item, i) => (
          <div key={i} className={s.item}>
            <span className={s.sep}>◆</span>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
