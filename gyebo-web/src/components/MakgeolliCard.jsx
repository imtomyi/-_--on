import { useState } from 'react'
import styles from './MakgeolliCard.module.css'

const LEVEL_LABEL = { intro: '입문', mid: '중급', deep: '심화' }

export default function MakgeolliCard({ item, ordinal, highlighted }) {
  const [open, setOpen] = useState(false)

  const num = String(ordinal).padStart(2, '0')

  return (
    <article
      className={`${styles.item} ${highlighted ? styles.highlighted : ''} ${open ? styles.open : ''}`}
    >
      {/* ── 헤더 행 (항상 표시) ────────────── */}
      <button
        className={styles.header}
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls={`detail-${item.id}`}
      >
        {/* 순번 — 족보의 항렬 번호, ghosted serif */}
        <span className={styles.num} aria-hidden="true">{num}</span>

        <div className={styles.main}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{item.name}</h2>
            <span
              className={styles.badge}
              style={{ color: item.color }}
            >
              {LEVEL_LABEL[item.level]}
            </span>
          </div>
          <p className={styles.meta}>{item.region} · {item.ingredient}</p>
        </div>

        {/* 전개 화살표 — 미닫이문처럼 */}
        <span
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>

      {/* ── 상세 영역 (그리드 애니메이션) ──── */}
      {/* CSS grid-template-rows 트릭: 0fr → 1fr (높이 측정 불필요) */}
      <div
        id={`detail-${item.id}`}
        className={`${styles.detailWrap} ${open ? styles.detailOpen : ''}`}
        aria-hidden={!open}
      >
        <div className={styles.detailInner}>
          {/* 항목 컬러 선 — 자개 상감처럼, 해당 막걸리의 고유색 */}
          <div
            className={styles.colorRibbon}
            style={{ background: item.color }}
          />

          <div className={styles.detail}>
            {/* 이야기 */}
            <p className={styles.story}>{item.story}</p>

            {/* 맛 프로필 — 계보 문서의 수치 행 */}
            <div className={styles.profile}>
              <FlavorRow label="단맛"  value={item.flavor.sweet} color={item.color} />
              <FlavorRow label="드라이" value={item.flavor.dry}   color={item.color} />
              <FlavorRow label="바디"  value={item.flavor.body}  color={item.color} />
              <div className={styles.abvRow}>
                <span className={styles.abvLabel}>도수</span>
                <span className={styles.abvValue}>{item.flavor.abv}%</span>
              </div>
            </div>

            {/* 태그 */}
            <div className={styles.tags}>
              {item.tags.map(t => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function FlavorRow({ label, value, color }) {
  return (
    <div className={styles.flavorRow}>
      <span className={styles.flavorLabel}>{label}</span>
      <div className={styles.flavorTrack} role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={5}>
        <div
          className={styles.flavorFill}
          style={{ width: `${(value / 5) * 100}%`, background: color }}
        />
      </div>
      <span className={styles.flavorNum}>{value}</span>
    </div>
  )
}
