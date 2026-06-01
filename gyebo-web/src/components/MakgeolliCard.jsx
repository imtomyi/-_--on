/**
 * MakgeolliCard — 2열 그리드 카드
 * borderless 썸네일 + hover 105% 스케일 + 퀵뷰 페이드인
 */

import styles from './MakgeolliCard.module.css'

const LEVEL_KO = { intro: '입문', mid: '중급', deep: '심화' }

export default function MakgeolliCard({ item, ordinal, thumbRef, onClick, highlighted }) {
  const num = String(ordinal).padStart(2, '0')

  return (
    <article
      className={`${styles.card} ${highlighted ? styles.highlighted : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick?.()}
      aria-label={`${item.name} 상세 보기`}
    >
      {/* 썸네일 — FLIP source, overflow hidden 으로 bg 스케일 클립 */}
      <div
        ref={thumbRef}
        className={styles.thumb}
        style={{ '--card-color': item.color }}
      >
        {/* 배경 — hover 시 105% 스케일 (thumb 자체는 transform 안건드림) */}
        <div className={styles.thumbBg} aria-hidden="true" />

        {/* 썸네일 텍스트 오버레이 */}
        <div className={styles.thumbOverlay} aria-hidden="true">
          <span className={styles.thumbNum}>{num}</span>
          <span className={styles.thumbIngr}>{item.ingredient}</span>
        </div>

        {/* Quick View — hover 페이드인 */}
        <div className={styles.quickView} aria-hidden="true">
          <span className={styles.quickLabel}>자세히 보기</span>
        </div>
      </div>

      {/* 카드 하단 정보 */}
      <div className={styles.info}>
        <span className={styles.name}>{item.name}</span>
        <span className={`${styles.badge} ${styles[`lv_${item.level}`]}`}>
          {LEVEL_KO[item.level]}
        </span>
      </div>
    </article>
  )
}
