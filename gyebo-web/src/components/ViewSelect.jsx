import styles from './ViewSelect.module.css'
import webIcon from '../assets/logo-high.png'
import thumbImg from '../../thumb.png'

export default function ViewSelect({ onList, onMap, onBack }) {
  return (
    <div className={styles.page}>

      {/* ── 네비 ─────────────────────────────────── */}
      <nav className={styles.nav}>
        <button className={styles.navBack} onClick={onBack}>
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      </nav>

      {/* ── 헤더 ─────────────────────────────────── */}
      <header className={styles.header}>
        <img src={webIcon} alt="Icon" className={styles.headerIcon} decoding="async" />
        <h1 className={styles.title}>당신만의 방식으로<br/>우리 술을 기록하다</h1>
      </header>

      {/* ── 선택 카드 영역 ───────────────────────── */}
      <div className={styles.choices}>

        {/* 막걸리 아카이브 */}
        <button className={styles.choice} onClick={onList}>
          <div className={styles.choiceContent}>
            <div className={styles.choiceTop}>
              <span className={styles.choiceLabel}>막걸리 아카이브</span>
              <span className={styles.choiceArrow} aria-hidden="true">→</span>
            </div>
            <p className={styles.choiceDesc}>열 가지 막걸리를 카드로 정갈하게 담아냈습니다.<br/>저마다의 고유한 이야기를 하나씩 펼쳐보세요.</p>
          </div>
          
          <div className={styles.cardBgThumb}>
            <img src={thumbImg} alt="" className={styles.thumbImage} decoding="async" />
          </div>
        </button>

        {/* 맛의 사분면 지도 */}
        <button className={styles.choice} onClick={onMap}>
          <div className={styles.choiceContent}>
            <div className={styles.choiceTop}>
              <span className={styles.choiceLabel}>맛의 사분면 지도</span>
              <span className={styles.choiceArrow} aria-hidden="true">→</span>
            </div>
            <p className={styles.choiceDesc}>단맛, 산미 등 맛의 지형도로 펼쳐지는 계보학.<br/>우리 술의 뿌리와 개성을 한눈에 파악하세요.</p>
          </div>
          
          <div className={styles.cardBgMap}>
            <img src="/korea-map.png" alt="" className={styles.mapImage} decoding="async" />
          </div>
        </button>

      </div>

    </div>
  )
}
