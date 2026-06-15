/**
 * MakgeolliDetail — 계보 두루마리 (Scroll Unfurl)
 *
 * 상세가 족자 두루마리처럼 위→아래로 펼쳐져 내려오고(열기),
 * 축(roller)이 다시 위로 말려 올라가며 닫힘.
 * clip-path 와이프 + 축 막대 translateY (GPU 합성)
 */

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import styles from './MakgeolliDetail.module.css'

const LEVEL_KO = { intro: '입문', mid: '중급', deep: '심화' }
const UNFURL_EASE = 'power3.inOut'

export default function MakgeolliDetail({ item, ordinal, onClose }) {
  const dimRef       = useRef(null)
  const clipRef      = useRef(null)
  const rollerRef    = useRef(null)
  const contentRef   = useRef(null)
  const closing      = useRef(false)
  const tlRef        = useRef(null)

  /* ── 두루마리 펼치기 ── */
  useLayoutEffect(() => {
    const dim     = dimRef.current
    const clip    = clipRef.current
    const roller  = rollerRef.current
    const content = contentRef.current
    if (!dim || !clip || !roller) return

    /* 축은 화면 맨 아래까지 완전히 내려가도록 */
    const H = Math.max(clip.getBoundingClientRect().height, window.innerHeight)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    /* 모션 최소화 — 즉시 표시 */
    if (reduce) {
      gsap.set(clip,   { clipPath: 'inset(0 0 0% 0)' })
      gsap.set(roller, { autoAlpha: 0 })
      gsap.set(dim,    { opacity: 1 })
      return
    }

    /* 초기 상태 — 말려있음 */
    gsap.set(dim,    { opacity: 0 })
    gsap.set(clip,   { clipPath: 'inset(0 0 100% 0)' })
    gsap.set(roller, { y: 0, autoAlpha: 1 })
    if (content) gsap.set(Array.from(content.children), { opacity: 0, y: 12 })

    const tl = gsap.timeline()
    tlRef.current = tl

    /* 1. 딤 */
    tl.to(dim, { opacity: 1, duration: 0.28, ease: 'power2.out' }, 0)

    /* 2. 두루마리 펼침 — clip 와이프 + 축 막대 하강 동기 (끝까지) */
    tl.to(clip, {
      clipPath: 'inset(0 0 0% 0)',
      duration: 0.46, ease: UNFURL_EASE,
    }, 0.02)
    tl.to(roller, {
      y: H, duration: 0.46, ease: UNFURL_EASE,
    }, 0.02)

    /* 3. 축이 바닥에 닿는 순간 사라짐 */
    tl.to(roller, { autoAlpha: 0, duration: 0.12, ease: 'power1.out' }, 0.42)

    /* 4. 본문 살짝 떠오름 */
    if (content?.children.length) {
      tl.to(Array.from(content.children), {
        opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.03,
      }, 0.26)
    }

    return () => tl.kill()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 두루마리 말기 (닫기) ── */
  function handleClose() {
    if (closing.current) return
    closing.current = true
    tlRef.current?.kill()

    const dim    = dimRef.current
    const clip   = clipRef.current
    const roller = rollerRef.current
    if (!dim || !clip) { onClose(); return }

    const H = Math.max(clip.getBoundingClientRect().height, window.innerHeight)

    const tl = gsap.timeline({ onComplete: onClose })

    /* 1. 축이 바닥에서 다시 나타남 */
    tl.set(roller, { y: H, autoAlpha: 1 }, 0)

    /* 2. 위로 말려 올라감 — clip + 축 동기 */
    tl.to(clip, {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.36, ease: UNFURL_EASE,
    }, 0)
    tl.to(roller, {
      y: 0, duration: 0.36, ease: UNFURL_EASE,
    }, 0)

    /* 3. 딤 페이드아웃 */
    tl.to(dim, { opacity: 0, duration: 0.32, ease: 'power2.in' }, 0.06)
  }

  const num = String(ordinal).padStart(2, '0')

  return (
    <>
      {/* 딤 — 전체 뷰포트, 탭하면 닫힘 */}
      <div ref={dimRef} className={styles.dim} onClick={handleClose} aria-hidden="true" />

      {/* max-width 컨테이너 (두루마리 무대) */}
      <div className={styles.container} role="dialog" aria-modal="true" aria-label={item.name}>

        {/* 상단 족자 봉 (고정) */}
        <div className={styles.topDowel} aria-hidden="true" />

        {/* 클립 레이어 — 위→아래 와이프로 펼쳐짐 */}
        <div ref={clipRef} className={styles.clip}>

          {/* 히어로 */}
          <div className={styles.hero} style={{ '--card-color': item.color }}>
            {/* 재료 일러스트 메달리온 */}
            <div className={styles.heroPlate} aria-hidden="true">
              <img className={styles.heroImg} src={item.image} alt="" />
            </div>
            <div className={styles.heroContent}>
              <span className={styles.heroNum} aria-hidden="true">{num}</span>
              <span className={styles.heroIngr}>{item.ingredient}</span>
            </div>

            {/* 닫기 */}
            <button className={styles.closeBtn} onClick={handleClose} aria-label="닫기">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 1L15 15M15 1L1 15"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* 정보 시트 — 스크롤 */}
          <div className={styles.sheet}>
            <div ref={contentRef} className={styles.content}>

            {/* 레벨 + 이름 */}
            <div className={styles.titleBlock}>
              <span className={`${styles.levelBadge} ${styles[`lv_${item.level}`]}`}>
                {LEVEL_KO[item.level]}
              </span>
              <h2 className={styles.name}>{item.name}</h2>
              <p className={styles.meta}>{item.region} · {item.brewery}</p>
            </div>

            {/* 구분선 */}
            <div className={styles.rule} aria-hidden="true" />

            {/* 스토리 */}
            <p className={styles.story}>{item.story}</p>

            {/* 테이스팅 노트 */}
            {item.tastingNote && (
              <div className={styles.noteBlock}>
                <span className={styles.noteLabel}>TASTING NOTE</span>
                <p className={styles.noteText}>{item.tastingNote}</p>
              </div>
            )}

            {/* 맛 프로필 */}
            <div className={styles.profile}>
              <FlavorBar label="단맛" value={item.metrics.sweetness} />
              <FlavorBar label="산미" value={item.metrics.acidity} />
              <FlavorBar label="바디" value={item.metrics.body} />
              {item.metrics.abv != null && (
                <div className={styles.abvRow}>
                  <span className={styles.abvLabel}>도수</span>
                  <span className={styles.abvValue}>{item.metrics.abv}%</span>
                </div>
              )}
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

        {/* 두루마리 축 (펼쳐지는 가장자리) */}
        <div ref={rollerRef} className={styles.roller} aria-hidden="true">
          <div className={styles.rollerBar} />
        </div>

      </div>
    </>
  )
}

function FlavorBar({ label, value }) {
  return (
    <div className={styles.flavorRow}>
      <span className={styles.flavorLabel}>{label}</span>
      <div
        className={styles.flavorTrack}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={5}
      >
        <div className={styles.flavorFill} style={{ width: `${(value / 5) * 100}%` }} />
      </div>
      <span className={styles.flavorNum}>{value}</span>
    </div>
  )
}
