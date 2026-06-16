/**
 * RecoResult — 취향 테스트 결과 풀스크린 오버레이
 * 추천 막걸리를 크고 선명하게 표시
 */
import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import styles from './RecoResult.module.css'

const LEVEL_KO = { intro: '입문', mid: '중급', deep: '심화' }

export default function RecoResult({ item, onView, onRetry, onClose }) {
  const rootRef = useRef(null)
  const cardRef = useRef(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !cardRef.current) return
    gsap.fromTo(cardRef.current,
      { y: 48 },
      { y: 0, duration: 0.55, ease: 'power3.out', delay: 0.1 }
    )
  }, [])

  function handleClose() {
    if (!rootRef.current) { onClose(); return }
    rootRef.current.style.animation = 'none'
    gsap.to(rootRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: onClose })
  }

  return (
    <div ref={rootRef} className={styles.overlay} role="dialog" aria-modal="true" aria-label="취향 테스트 결과">

      {/* 배경 블러 + 탭 닫기 */}
      <div className={styles.backdrop} onClick={handleClose} aria-hidden="true" />

      <div ref={cardRef} className={styles.card}>

        {/* 상단 레이블 + 닫기 */}
        <div className={styles.topRow}>
          <span className={styles.topTag}>취향 테스트 완료</span>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="닫기">✕</button>
        </div>

        {/* 재료 일러스트 + 텍스트 메인 */}
        <div className={styles.main}>
          <div className={styles.imgWrap} style={{ '--item-color': item.color }}>
            <img src={item.image} alt={item.ingredient} className={styles.ingredientImg} />
            <div className={styles.glow} style={{ background: item.color }} />
          </div>

          <div className={styles.info}>
            <span className={styles.reco}>당신을 위한 막걸리</span>
            <h2 className={styles.name}>{item.name}</h2>
            <div className={styles.meta}>
              <span className={styles.region}>{item.region}</span>
              <span className={styles.dot} aria-hidden="true">·</span>
              <span className={styles.ingredient}>{item.ingredient}</span>
            </div>
            <span className={`${styles.levelBadge} ${styles[`lv_${item.level}`]}`}>
              {LEVEL_KO[item.level]}
            </span>
          </div>
        </div>

        {/* 스토리 */}
        <p className={styles.story}>{item.story}</p>

        {/* 테이스팅 노트 */}
        {item.tastingNote && (
          <div className={styles.tastingWrap}>
            <span className={styles.tastingLabel}>테이스팅 노트</span>
            <p className={styles.tastingNote}>{item.tastingNote}</p>
          </div>
        )}

        {/* 맛 프로필 바 */}
        <div className={styles.flavorRow}>
          {[
            { label: '달콤함', val: item.metrics.sweetness, max: 5, color: '#C8A818' },
            { label: '산미',   val: item.metrics.acidity,   max: 5, color: '#5AA899' },
            { label: '바디감', val: item.metrics.body,      max: 5, color: '#BA2028' },
          ].map(({ label, val, max, color }) => (
            <div key={label} className={styles.flavorItem}>
              <span className={styles.flavorLabel}>{label}</span>
              <div className={styles.flavorBar}>
                <div className={styles.flavorFill}
                  style={{ width: `${(val / max) * 100}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA 버튼 */}
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={onView}>
            자세히 보기
          </button>
          <button className={styles.ghostBtn} onClick={onRetry}>
            다시 테스트
          </button>
        </div>

      </div>
    </div>
  )
}
