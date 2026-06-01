/**
 * TasteTest — "나만의 취향을 항아리에 담아 빚어내다"
 *
 * 미니멀 화이트 설문 UI + 항아리 드롭(Jar Drop) 물리 애니메이션
 * 선택한 답변/질문이 베지어 곡선을 그리며 하단 옹기로 빨려 들어가고,
 * 항아리가 젤리처럼 튀어오르며 발효되듯 채워짐.
 * GSAP MotionPathPlugin + transform/opacity only (HW 가속)
 */

import { useState, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import styles from './TasteTest.module.css'

gsap.registerPlugin(MotionPathPlugin)

/* ── 전통 옹기 항아리 ─────────────────────── */
function OnggiJar({ jarRef, mouthRef, fillRef, glowRef }) {
  return (
    <div className={styles.jarWrap} aria-hidden="true">
      <div ref={glowRef} className={styles.jarGlow} />
      <div ref={jarRef} className={styles.jar}>
        <svg viewBox="0 0 240 230" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.jarSvg}>
          <defs>
            <linearGradient id="onggiBody" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4a3b2c"/>
              <stop offset="0.5" stopColor="#6b5640"/>
              <stop offset="1" stopColor="#3a2d20"/>
            </linearGradient>
            <linearGradient id="onggiLiquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fbf4e2"/>
              <stop offset="1" stopColor="#e9dcc0"/>
            </linearGradient>
            <radialGradient id="mouthShade" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="#1d160f"/>
              <stop offset="1" stopColor="#3a2d20"/>
            </radialGradient>
            <clipPath id="jarInner">
              <path d="M64 52 C44 88 46 168 64 196 C82 214 158 214 176 196
                       C194 168 196 88 176 52 Z"/>
            </clipPath>
          </defs>

          {/* 몸통 */}
          <path d="M74 40 C42 42 28 74 24 110 C20 150 34 188 60 206
                   C82 220 158 220 180 206 C206 188 220 150 216 110
                   C212 74 198 42 166 40 Z"
            fill="url(#onggiBody)"/>

          {/* 내부 액체 (발효 채워짐) — fillRef 로 scaleY */}
          <g clipPath="url(#jarInner)">
            <rect ref={fillRef} x="40" y="48" width="160" height="150"
              fill="url(#onggiLiquid)" />
            <ellipse cx="120" cy="56" rx="60" ry="10" fill="#fffbef" opacity="0.5"/>
          </g>

          {/* 어깨 글레이즈 라인 */}
          <path d="M40 100 Q120 86 200 100" stroke="#2c2218" strokeWidth="1.4" opacity="0.4" fill="none"/>
          <path d="M30 140 Q120 128 210 140" stroke="#2c2218" strokeWidth="1.4" opacity="0.35" fill="none"/>
          <path d="M44 180 Q120 192 196 180" stroke="#2c2218" strokeWidth="1.2" opacity="0.3" fill="none"/>

          {/* 입구 (테두리 + 어두운 안쪽) */}
          <ellipse cx="120" cy="40" rx="50" ry="13" fill="url(#onggiBody)" stroke="#2c2218" strokeWidth="1.4"/>
          <ellipse cx="120" cy="40" rx="40" ry="9" fill="url(#mouthShade)"/>
          <ellipse cx="120" cy="38" rx="40" ry="8" fill="none" stroke="#7a6446" strokeWidth="1" opacity="0.6"/>
        </svg>
        {/* 항아리 입구 좌표점 (드롭 타깃) */}
        <div ref={mouthRef} className={styles.jarMouthPoint} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Main
   ═══════════════════════════════════════════ */
export default function TasteTest({ questions, list, onResult, onClose }) {
  const [step, setStep]         = useState(0)
  const [answers, setAnswers]   = useState({})
  const [selected, setSelected] = useState(null)

  const busy        = useRef(false)
  const rootRef     = useRef(null)
  const cardRef     = useRef(null)
  const questionRef = useRef(null)
  const optionRefs  = useRef({})
  const jarRef      = useRef(null)
  const mouthRef    = useRef(null)
  const fillRef     = useRef(null)
  const glowRef     = useRef(null)

  const q     = questions[step]
  const total = questions.length

  /* ── 질문 세트 등장 (슬라이드 인 업) ── */
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const card = cardRef.current
    const qEl  = questionRef.current
    const opts = Object.values(optionRefs.current).filter(Boolean)
    if (!card) return
    /* 이전 드롭에서 남은 인라인 transform/opacity 제거 (질문 노드는 재사용됨) */
    gsap.set(qEl, { clearProps: 'all' })
    if (reduce) {
      gsap.set([card, ...opts], { clearProps: 'all' })
      return
    }
    gsap.fromTo(card, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
    gsap.fromTo(opts, { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', delay: 0.12 })
  }, [step])

  /* ── 초기 액체 레벨 0 (항아리 바닥 기준 scaleY) ── */
  useLayoutEffect(() => {
    if (fillRef.current) gsap.set(fillRef.current, { svgOrigin: '120 198', scaleY: 0 })
    if (glowRef.current) gsap.set(glowRef.current, { opacity: 0, scale: 0.6 })
  }, [])

  /* ── 항아리 드롭 → 다음 질문 ── */
  function advance() {
    if (busy.current || selected == null) return
    busy.current = true
    const value  = selected
    const isLast = step === total - 1
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nextAnswers = { ...answers, [q.id]: value }
    const fillTo = (step + 1) / total

    if (reduce) {
      if (fillRef.current) gsap.set(fillRef.current, { scaleY: fillTo })
      finishOrNext()
      return
    }

    const mouth  = mouthRef.current.getBoundingClientRect()
    const target = { x: mouth.left + mouth.width / 2, y: mouth.top + mouth.height / 2 }

    /* 버블의 CSS bob 애니메이션 해제 — GSAP transform 이 적용되도록 */
    gsap.set(Object.values(optionRefs.current).filter(Boolean), { animation: 'none' })

    const tl = gsap.timeline({ onComplete: finishOrNext })

    /* 선택 안 된 답변 — 먼지처럼 흩어짐 */
    Object.entries(optionRefs.current).forEach(([val, el]) => {
      if (!el || val === value) return
      tl.to(el, {
        opacity: 0, y: 14, scale: 0.92,
        duration: 0.32, ease: 'power2.in',
      }, 0)
    })

    /* 선택된 답변 — 곡선 궤적으로 항아리 속으로 (Drop & Suck) */
    const selEl = optionRefs.current[value]
    if (selEl) curveIntoJar(tl, selEl, target, 0.05, 0.74)

    /* 질문 텍스트도 뒤따라 빨려 들어감 */
    if (questionRef.current) curveIntoJar(tl, questionRef.current, target, 0.16, 0.66)

    /* 항아리 젤리 바운스 (골인 순간) */
    tl.to(jarRef.current, {
      keyframes: [
        { scaleX: 1.08, scaleY: 0.9,  duration: 0.13 },
        { scaleX: 0.95, scaleY: 1.07, duration: 0.15 },
        { scaleX: 1,    scaleY: 1,    duration: 0.4, ease: 'elastic.out(1, 0.42)' },
      ],
      transformOrigin: '50% 100%',
    }, 0.56)

    /* 액체 한 단계 차오름 */
    tl.to(fillRef.current, { scaleY: fillTo, duration: 0.55, ease: 'power2.out' }, 0.58)

    function finishOrNext() {
      if (isLast) {
        finish(nextAnswers)
      } else {
        setAnswers(nextAnswers)
        setSelected(null)
        setStep(s => s + 1)
        busy.current = false
      }
    }
  }

  /* MotionPath 곡선 + 축소 + 페이드 (항아리 흡입) */
  function curveIntoJar(tl, el, target, at, dur) {
    const r = el.getBoundingClientRect()
    const sx = r.left + r.width / 2
    const sy = r.top + r.height / 2
    const dx = target.x - sx
    const dy = target.y - sy
    const ctrl = { x: dx * 0.5, y: dy * 0.42 - 80 }   // 살짝 떠올랐다 빨려듦
    tl.to(el, {
      motionPath: {
        path: [{ x: 0, y: 0 }, { x: ctrl.x, y: ctrl.y }, { x: dx, y: dy }],
        curviness: 1.4, autoRotate: false,
      },
      scale: 0.3, opacity: 0,
      duration: dur, ease: 'power1.in',
    }, at)
  }

  /* ── 마지막 → 항아리에서 빛 → 결과 ── */
  function finish(ans) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { onResult(recommend(ans, list)); return }
    const tl = gsap.timeline({ onComplete: () => onResult(recommend(ans, list)) })
    tl.to(glowRef.current, { opacity: 1, scale: 1.7, duration: 0.55, ease: 'power2.out' }, 0)
    tl.to(jarRef.current, { scale: 1.16, y: -8, duration: 0.5, ease: 'back.out(1.7)' }, 0.05)
    tl.to(cardRef.current, { opacity: 0, duration: 0.3 }, 0)
    tl.to(rootRef.current, { opacity: 0, duration: 0.42, ease: 'power2.in' }, 0.5)
  }

  function handleClose() {
    if (busy.current) return
    gsap.to(rootRef.current, { opacity: 0, duration: 0.28, ease: 'power2.in', onComplete: onClose })
  }

  const progress = (step / total) * 100

  return (
    <div ref={rootRef} className={styles.overlay} role="dialog" aria-modal="true" aria-label="내 막걸리 찾기">

      {/* ── 상단: 진행률 + 상태 ── */}
      <header className={styles.top}>
        <div className={styles.topRow}>
          <span className={styles.status}>{q.status || `STEP ${step + 1}`}</span>
          <button className={styles.close} onClick={handleClose} aria-label="닫기">✕</button>
        </div>
        <div className={styles.track} role="progressbar"
          aria-valuenow={step} aria-valuemin={0} aria-valuemax={total}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.count}>{step + 1} <span className={styles.countTotal}>/ {total}</span></span>
      </header>

      {/* ── 중앙: 질문 + 답변 ── */}
      <main className={styles.body}>
        <div ref={cardRef} className={styles.card}>
          <span className={styles.qEyebrow}>Q{step + 1}</span>
          <h2 ref={questionRef} className={styles.question}>{q.question}</h2>

          {q.kind === 'bubble' ? (
            <div className={styles.bubbles} role="group" aria-label="답변 선택">
              {q.options.map((opt, i) => (
                <button
                  key={opt.value}
                  ref={el => { optionRefs.current[opt.value] = el }}
                  className={`${styles.bubble} ${selected === opt.value ? styles.bubbleOn : ''} ${styles[`b${i % 5}`]}`}
                  onClick={() => setSelected(opt.value)}
                  aria-pressed={selected === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <div className={styles.options} role="group" aria-label="답변 선택">
              {q.options.map(opt => (
                <button
                  key={opt.value}
                  ref={el => { optionRefs.current[opt.value] = el }}
                  className={`${styles.option} ${selected === opt.value ? styles.optionOn : ''}`}
                  onClick={() => setSelected(opt.value)}
                  aria-pressed={selected === opt.value}
                >
                  <span className={styles.optionDot} aria-hidden="true" />
                  <span className={styles.optionLabel}>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── 하단: 항아리 + 다음 버튼 ── */}
      <OnggiJar jarRef={jarRef} mouthRef={mouthRef} fillRef={fillRef} glowRef={glowRef} />

      <button
        className={`${styles.next} ${selected != null ? styles.nextOn : ''}`}
        onClick={advance}
        disabled={selected == null}
        aria-label={step === total - 1 ? '결과 보기' : '다음'}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 11H18M18 11L12 5M18 11L12 17"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

/* 추천 로직 — 레벨 필터 + 단/드라이 + 무드 태그 가중 */
function recommend(answers, list) {
  const level = answers.experience ?? 'intro'
  const sweet = answers.sweetness === 'sweet'
  let pool = list.filter(m => m.level === level)
  if (!pool.length) pool = list

  const moodTag = {
    fresh: '청량함', aroma: '향긋함', rich: '묵직함',
    emotional: '감성', hearty: '고소함',
  }[answers.mood]

  const scoreOf = m => {
    let s = sweet ? m.flavor.sweet : m.flavor.dry
    if (moodTag && m.tags.includes(moodTag)) s += 2
    return s
  }
  return pool.reduce((best, cur) => (scoreOf(cur) > scoreOf(best) ? cur : best))
}
