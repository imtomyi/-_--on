/**
 * Survey — 소비자 맞춤 막걸리 추천 설문
 *
 * 5문항으로 취향(경험·단맛·바디·무드·페어링)을 수집해
 * 막걸리 계보 10종 중 한 잔을 추천한다.
 * 기존 취향 테스트(TasteTest)의 비주얼·항아리 드롭 인터랙션을 그대로 계승하고,
 * 결과는 동일한 추천 화면(RecoResult)으로 노출한다.
 */

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { surveyQuestions, recommendMakgeolli } from '../data/survey'
import { makgeolliList } from '../data/makgeolli'
import s from './TasteTest.module.css'   // 공통 셸(overlay/top/card/jar/next) 재사용

gsap.registerPlugin(MotionPathPlugin)

const pre = { whiteSpace: 'pre-line' }

/* 항아리 액체 수위 — translateY 기반 (0=가득, JAR_EMPTY_Y=빈 상태) */
const JAR_EMPTY_Y = 160
const jarLevelY = ft => (1 - ft) * JAR_EMPTY_Y

/* ── 전통 옹기 항아리 — 출렁이는 액체 + 거품 ──── */
function OnggiJar({ jarRef, mouthRef, fillRef, glowRef }) {
  const waveRef    = useRef(null)
  const bubbleRefs = useRef([])

  /* 표면 출렁임(드리프트) + 거품 떠오름 — 상시 루프 */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const tweens = []

    if (waveRef.current) {
      gsap.set(waveRef.current, { x: -16 })
      tweens.push(gsap.to(waveRef.current, {
        x: 16, duration: 3.6, ease: 'sine.inOut', repeat: -1, yoyo: true,
      }))
    }

    bubbleRefs.current.filter(Boolean).forEach((el, i) => {
      gsap.set(el, { transformOrigin: 'center', opacity: 0, scale: 0.5 })
      const tl = gsap.timeline({ repeat: -1, delay: 1.2 + i * 2.1 })
      tl.to(el, { opacity: 0.5, scale: 1, duration: 0.7, ease: 'sine.out' }, 0)
        .to(el, { y: -64 - i * 7, duration: 3.2 + i * 0.7, ease: 'sine.out' }, 0)
        .to(el, { opacity: 0, duration: 0.9, ease: 'sine.in' }, '>-1')
        .set(el, { y: 0, scale: 0.5 })
      tweens.push(tl)
    })

    return () => tweens.forEach(t => t.kill())
  }, [])

  return (
    <div className={s.jarWrap} aria-hidden="true">
      <div ref={glowRef} className={s.jarGlow} />
      <div ref={jarRef} className={s.jar}>
        <svg viewBox="0 0 240 230" fill="none" xmlns="http://www.w3.org/2000/svg" className={s.jarSvg}>
          <defs>
            <linearGradient id="svOnggiBody" x1="0.12" y1="0" x2="0.92" y2="1">
              <stop offset="0" stopColor="#CC834E"/>
              <stop offset="0.5" stopColor="#B06436"/>
              <stop offset="1" stopColor="#8A4626"/>
            </linearGradient>
            <linearGradient id="svOnggiLiquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fdf7e8"/>
              <stop offset="1" stopColor="#e7d4ab"/>
            </linearGradient>
            <radialGradient id="svMouthShade" cx="0.5" cy="0.45" r="0.55">
              <stop offset="0" stopColor="#241408"/>
              <stop offset="1" stopColor="#3e2616"/>
            </radialGradient>
            <clipPath id="svJarInner">
              <path d="M64 56 C44 92 46 165 64 196 C82 214 158 214 176 196
                       C194 165 196 92 176 56 Z"/>
            </clipPath>
          </defs>

          {/* 몸통 */}
          <path d="M78 48 C46 52 30 82 26 116 C22 154 36 189 60 205
                   C82 219 158 219 180 205 C204 189 218 154 214 116
                   C210 82 194 52 162 48 C148 47 132 49 120 49 C108 49 92 47 78 48 Z"
            fill="url(#svOnggiBody)"/>

          {/* 내부 액체 — 출렁이는 표면 + 거품 (fillRef: 수위 / waveRef: 표면 흔들림) */}
          <g clipPath="url(#svJarInner)">
            <g ref={fillRef}>
              <g ref={waveRef}>
                <path d="M-64 60 Q-30 54 4 60 T72 60 T140 60 T208 60 T276 60 L276 252 L-64 252 Z"
                  fill="url(#svOnggiLiquid)"/>
              </g>
              <circle ref={el => (bubbleRefs.current[0] = el)} cx="110" cy="150" r="2"   fill="#fffdf2"/>
              <circle ref={el => (bubbleRefs.current[1] = el)} cx="130" cy="166" r="1.5" fill="#fffdf2"/>
              <circle ref={el => (bubbleRefs.current[2] = el)} cx="118" cy="176" r="2.4" fill="#fffdf2"/>
              <circle ref={el => (bubbleRefs.current[3] = el)} cx="138" cy="158" r="1.4" fill="#fffdf2"/>
            </g>
          </g>

          {/* 광택 하이라이트 */}
          <path d="M72 70 C62 92 60 124 68 156" stroke="#ffffff" strokeWidth="9"
            strokeLinecap="round" opacity="0.16" fill="none"/>

          {/* 입구 (롤드 립) */}
          <ellipse cx="120" cy="46" rx="56" ry="15" fill="url(#svOnggiBody)" stroke="#3a2214" strokeWidth="1.6"/>
          <ellipse cx="120" cy="44" rx="44" ry="10.5" fill="url(#svMouthShade)"/>
          <ellipse cx="120" cy="42" rx="44" ry="9.5" fill="none" stroke="#d49a6a" strokeWidth="1" opacity="0.5"/>
        </svg>
        <div ref={mouthRef} className={s.jarMouthPoint} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   Main
   ═══════════════════════════════════════════ */
export default function Survey({ questions = surveyQuestions, onResult, onClose }) {
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

  /* 현재 문항의 답변 값 목록 (stale ref 방지) */
  const optValues = q ? q.options.map(o => o.value) : []

  /* ── 질문 세트 등장 ── */
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const card = cardRef.current
    const qEl  = questionRef.current
    const opts = Object.values(optionRefs.current).filter(Boolean)
    if (!card) return
    gsap.set(qEl, { clearProps: 'all' })
    if (reduce) {
      gsap.set([card, ...opts], { clearProps: 'all' })
      return
    }
    gsap.fromTo(card, { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' })
    gsap.fromTo(opts, { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out', delay: 0.12 })
  }, [step])

  /* ── 초기 액체 레벨 0 ── */
  useLayoutEffect(() => {
    if (fillRef.current) gsap.set(fillRef.current, { y: JAR_EMPTY_Y })
    if (glowRef.current) gsap.set(glowRef.current, { opacity: 0, scale: 0.6 })
  }, [])

  /* ── 항아리 드롭 → 다음 문항 ── */
  function advance(valueOverride) {
    const value = valueOverride ?? selected
    if (busy.current || value == null) return
    busy.current = true
    const isLast = step === total - 1
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nextAnswers = { ...answers, [q.id]: value }
    const fillTo = (step + 1) / total

    if (reduce) {
      if (fillRef.current) gsap.set(fillRef.current, { y: jarLevelY(fillTo) })
      finishOrNext()
      return
    }

    const mouth  = mouthRef.current.getBoundingClientRect()
    const target = { x: mouth.left + mouth.width / 2, y: mouth.top + mouth.height / 2 }

    gsap.set(Object.values(optionRefs.current).filter(Boolean), { animation: 'none' })

    const tl = gsap.timeline({ onComplete: finishOrNext })

    /* 선택 안 된 답변 — 흩어짐 */
    optValues.forEach(val => {
      const el = optionRefs.current[val]
      if (!el || val === value) return
      tl.to(el, { opacity: 0, y: 14, scale: 0.92, duration: 0.32, ease: 'power2.in' }, 0)
    })

    /* 선택된 답변 — 항아리 속으로 */
    const selEl = optionRefs.current[value]
    if (selEl) curveIntoJar(tl, selEl, target, 0.05, 0.74)

    /* 질문 텍스트도 뒤따라 */
    if (questionRef.current) curveIntoJar(tl, questionRef.current, target, 0.16, 0.66)

    /* 항아리 젤리 바운스 */
    tl.to(jarRef.current, {
      keyframes: [
        { scaleX: 1.08, scaleY: 0.9,  duration: 0.13 },
        { scaleX: 0.95, scaleY: 1.07, duration: 0.15 },
        { scaleX: 1,    scaleY: 1,    duration: 0.4, ease: 'elastic.out(1, 0.42)' },
      ],
      transformOrigin: '50% 100%',
    }, 0.56)

    /* 액체 차오름 — 살짝 출렁이며 채워짐 */
    tl.to(fillRef.current, { y: jarLevelY(fillTo), duration: 0.9, ease: 'back.out(2.2)' }, 0.56)

    function finishOrNext() {
      if (isLast) {
        finish(nextAnswers)
      } else {
        setAnswers(nextAnswers)
        setSelected(null)
        setStep(st => st + 1)
        busy.current = false
      }
    }
  }

  /* MotionPath 곡선 + 축소 + 페이드 */
  function curveIntoJar(tl, el, target, at, dur) {
    const r = el.getBoundingClientRect()
    const sx = r.left + r.width / 2
    const sy = r.top + r.height / 2
    const dx = target.x - sx
    const dy = target.y - sy
    const ctrl = { x: dx * 0.5, y: dy * 0.42 - 80 }
    tl.to(el, {
      motionPath: {
        path: [{ x: 0, y: 0 }, { x: ctrl.x, y: ctrl.y }, { x: dx, y: dy }],
        curviness: 1.4, autoRotate: false,
      },
      scale: 0.3, opacity: 0,
      duration: dur, ease: 'power1.in',
    }, at)
  }

  /* ── 마지막 → 항아리 발광 → 추천 결과 ── */
  function finish(ans) {
    const result = recommendMakgeolli(ans, makgeolliList)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { onResult(result); return }
    const tl = gsap.timeline({ onComplete: () => onResult(result) })
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
    <div ref={rootRef} className={s.overlay} role="dialog" aria-modal="true" aria-label="맞춤 막걸리 추천 설문">

      {/* 상단: 진행률 */}
      <header className={s.top}>
        <div className={s.topRow}>
          <span className={s.status}>{q.status || `STEP ${step + 1}`}</span>
          <button className={s.close} onClick={handleClose} aria-label="닫기">✕</button>
        </div>
        <div className={s.track} role="progressbar"
          aria-valuenow={step} aria-valuemin={0} aria-valuemax={total}>
          <div className={s.fill} style={{ width: `${progress}%` }} />
        </div>
        <span className={s.count}>{step + 1} <span className={s.countTotal}>/ {total}</span></span>
      </header>

      {/* 중앙: 질문 + 답변 */}
      <main className={s.body}>
        <div ref={cardRef} className={s.card}>
          <span className={s.qEyebrow}>Q{step + 1}</span>
          <h2 ref={questionRef} className={s.question} style={pre}>{q.question}</h2>

          {q.kind === 'bubble' ? (
            <div className={s.bubbles} role="group" aria-label="답변 선택">
              {q.options.map((opt, i) => (
                <button
                  key={opt.value}
                  ref={el => { optionRefs.current[opt.value] = el }}
                  className={`${s.bubble} ${selected === opt.value ? s.bubbleOn : ''} ${s[`b${i % 5}`]}`}
                  onClick={() => { setSelected(opt.value); advance(opt.value) }}
                  aria-pressed={selected === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <div className={s.options} role="group" aria-label="답변 선택">
              {q.options.map(opt => (
                <button
                  key={opt.value}
                  ref={el => { optionRefs.current[opt.value] = el }}
                  className={`${s.option} ${selected === opt.value ? s.optionOn : ''}`}
                  onClick={() => { setSelected(opt.value); advance(opt.value) }}
                  aria-pressed={selected === opt.value}
                >
                  <span className={s.optionDot} aria-hidden="true" />
                  <span className={s.optionLabel}>{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 하단: 항아리 */}
      <OnggiJar jarRef={jarRef} mouthRef={mouthRef} fillRef={fillRef} glowRef={glowRef} />
    </div>
  )
}
