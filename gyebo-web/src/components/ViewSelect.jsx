/**
 * ViewSelect — "계보 보기" 진입 시 탐색 방식 선택
 * 막걸리 리스트(카드 그리드) vs 지도 계보도(FlavorMap)
 */
import styles from './ViewSelect.module.css'

/* ── SVG: 카드 그리드 아이콘 ─────────────── */
function IconGrid() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.choiceIcon}>
      <rect x="4"  y="4"  width="18" height="20" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="26" y="4"  width="18" height="20" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="4"  y="28" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <rect x="26" y="28" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="8"  y1="14" x2="18" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <line x1="30" y1="14" x2="40" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
      <line x1="8"  y1="18" x2="15" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
      <line x1="30" y1="18" x2="37" y2="18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.35"/>
    </svg>
  )
}

/* ── SVG: 지형도 아이콘 ──────────────────── */
function IconMap() {
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.choiceIcon}>
      {/* 4분면 그리드 */}
      <rect x="4" y="4" width="40" height="40" rx="4" stroke="currentColor" strokeWidth="1.6"/>
      <line x1="24" y1="4" x2="24" y2="44" stroke="currentColor" strokeWidth="0.9" opacity="0.35"/>
      <line x1="4"  y1="24" x2="44" y2="24" stroke="currentColor" strokeWidth="0.9" opacity="0.35"/>
      {/* 버블 노드 */}
      <circle cx="14" cy="16" r="5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="32" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="18" cy="32" r="4" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="35" cy="34" r="5.5" stroke="currentColor" strokeWidth="1.4"/>
      {/* 연결선 */}
      <path d="M17 19 Q22 24 28 17" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.4"/>
      <path d="M21 32 Q28 28 31 28" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.4"/>
    </svg>
  )
}

export default function ViewSelect({ onList, onMap, onBack }) {
  return (
    <div className={styles.page}>

      {/* 네비 */}
      <nav className={styles.nav}>
        <span className={styles.navLogo}>막걸리 계보</span>
        <button className={styles.navBack} onClick={onBack}>← 홈</button>
      </nav>

      {/* 헤더 */}
      <header className={styles.header}>
        <h1 className={styles.title}>어떻게<br/>탐색할까요?</h1>
        <p className={styles.sub}>열 가지 막걸리를 두 가지 방식으로 만날 수 있어요</p>
      </header>

      {/* 선택 카드 */}
      <div className={styles.choices}>

        <button className={styles.choice} data-variant="list" onClick={onList}>
          <div className={styles.choiceIconWrap} data-variant="list">
            <IconGrid />
          </div>
          <div className={styles.choiceBody}>
            <span className={styles.choiceLabel}>막걸리 리스트</span>
            <p className={styles.choiceDesc}>열 가지 막걸리를 카드로 만나고<br/>각각의 이야기를 펼쳐보세요</p>
          </div>
          <span className={styles.choiceArrow} aria-hidden="true">→</span>
        </button>

        <button className={styles.choice} data-variant="map" onClick={onMap}>
          <div className={styles.choiceIconWrap} data-variant="map">
            <IconMap />
          </div>
          <div className={styles.choiceBody}>
            <span className={styles.choiceLabel}>지도 계보도</span>
            <p className={styles.choiceDesc}>맛의 4분면 지형도로 막걸리의<br/>뿌리와 개성을 한눈에 파악하세요</p>
          </div>
          <span className={styles.choiceArrow} aria-hidden="true">→</span>
        </button>

      </div>

      {/* 하단 힌트 */}
      <p className={styles.hint}>언제든 화면 안에서 전환할 수 있어요</p>

    </div>
  )
}
