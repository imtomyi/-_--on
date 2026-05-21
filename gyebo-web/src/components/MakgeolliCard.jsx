import { useState } from 'react'
import styles from './MakgeolliCard.module.css'

const levelColors = {
  intro: '#4A9880',
  mid:   '#C4932A',
  deep:  '#6F3B55',
}

export default function MakgeolliCard({ item, highlighted }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`${styles.card} ${highlighted ? styles.highlighted : ''}`}>
      <button className={styles.summary} onClick={() => setOpen((v) => !v)}>
        {/* 색상 바 */}
        <div className={styles.colorBar} style={{ background: item.color }} />

        <div className={styles.main}>
          <div className={styles.top}>
            <h2 className={styles.name}>{item.name}</h2>
            <span
              className={styles.level}
              style={{ color: levelColors[item.level] }}
            >
              {item.levelLabel}
            </span>
          </div>
          <p className={styles.region}>{item.region} · {item.ingredient}</p>
        </div>

        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}>›</span>
      </button>

      {open && (
        <div className={styles.detail}>
          <p className={styles.story}>{item.story}</p>

          {/* 맛 프로필 */}
          <div className={styles.profile}>
            <FlavorBar label="단맛" value={item.flavor.sweet} />
            <FlavorBar label="드라이" value={item.flavor.dry} />
            <FlavorBar label="바디" value={item.flavor.body} />
            <div className={styles.abv}>도수 {item.flavor.abv}%</div>
          </div>

          {/* 태그 */}
          <div className={styles.tags}>
            {item.tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function FlavorBar({ label, value }) {
  return (
    <div className={styles.flavorRow}>
      <span className={styles.flavorLabel}>{label}</span>
      <div className={styles.flavorBar}>
        <div className={styles.flavorFill} style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  )
}
