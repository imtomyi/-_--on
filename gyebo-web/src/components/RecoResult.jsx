/**
 * RecoResult — 취향 테스트 결과 풀스크린 오버레이
 * 추천 막걸리를 크고 선명하게 표시
 */
import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import styles from './RecoResult.module.css'

const LEVEL_KO = { intro: '입문', mid: '중급', deep: '심화' }

/* 막걸리 병 SVG */
function ResultBottle({ color }) {
  return (
    <svg viewBox="0 0 100 280" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={styles.bottle} aria-hidden="true">
      <defs>
        <linearGradient id="rr-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0"   stopColor="#ffffff" stopOpacity="0.55"/>
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.14"/>
          <stop offset="1"   stopColor="#ffffff" stopOpacity="0.38"/>
        </linearGradient>
        <linearGradient id="rr-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.9"/>
          <stop offset="1" stopColor={color} stopOpacity="0.75"/>
        </linearGradient>
      </defs>
      {/* 병 몸통 */}
      <path d="M34 272 C20 272 11 262 11 250 L11 130 C11 118 18 109 26 105 L28 66
               C20 62 17 52 17 43 L17 18 L83 18 L83 43 C83 52 80 62 72 66
               L74 106 C82 110 89 119 89 131 L89 250 C89 262 80 272 66 272 Z"
        fill="url(#rr-glass)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6"/>
      {/* 라벨 영역 */}
      <path d="M14 170 L86 170 L85 248 C84 261 77 270 66 270 L34 270 C23 270 15 261 14 248 Z"
        fill="url(#rr-fill)"/>
      {/* 병마개 */}
      <rect x="30" y="8" width="40" height="12" rx="4" fill="rgba(0,0,0,0.35)"/>
      {/* 어깨 라인 */}
      <path d="M14 122 Q50 114 86 122" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
      {/* 라벨 텍스트 장식 */}
      <rect x="22" y="182" width="56" height="52" rx="3" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" fill="none"/>
      <line x1="28" y1="197" x2="72" y2="197" stroke="rgba(255,255,255,0.5)" strokeWidth="0.7"/>
      <line x1="28" y1="224" x2="72" y2="224" stroke="rgba(255,255,255,0.4)" strokeWidth="0.7"/>
      {/* 하이라이트 */}
      <path d="M22 140 L22 245" stroke="rgba(255,255,255,0.18)" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  )
}

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

        {/* 병 + 텍스트 메인 */}
        <div className={styles.main}>
          <div className={styles.bottleWrap} style={{ '--item-color': item.color }}>
            <ResultBottle color={item.color} />
            {/* 배경 글로우 */}
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
