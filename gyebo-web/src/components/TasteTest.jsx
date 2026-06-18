import { useState, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { recommendMakgeolli } from '../data/survey'
import preferImg from '../assets/prefer.png'
import styles from './TasteTest.module.css'

gsap.registerPlugin(MotionPathPlugin)

export default function TasteTest({ questions, list, onResult, onClose }) {
  const [step, setStep]         = useState(0)
  const [answers, setAnswers]   = useState({})
  const [selected, setSelected] = useState(null)

  const busy        = useRef(false)
  const rootRef     = useRef(null)
  const cardRef     = useRef(null)
  const questionRef = useRef(null)
  const optionRefs  = useRef({})
  const mouthRef    = useRef(null)

  const q     = questions[step]
  const total = questions.length

  /* ── 질문 세트 등장 (슬라이드 인 업) ── */
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

  /* ── 호리병 드롭 → 다음 질문 ── */
  function advance(valueOverride) {
    const value = valueOverride ?? selected
    if (busy.current || value == null) return
    busy.current = true
    const isLast = step === total - 1
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nextAnswers = { ...answers, [q.id]: value }

    if (reduce) {
      finishOrNext()
      return
    }

    const mouth  = mouthRef.current.getBoundingClientRect()
    const target = { x: mouth.left + mouth.width / 2, y: mouth.top + mouth.height / 2 }

    /* 버블 애니메이션 일시정지 */
    gsap.set(Object.values(optionRefs.current).filter(Boolean), { animation: 'none' })

    const tl = gsap.timeline({ onComplete: finishOrNext })

    /* 선택 안 된 답변 사라짐 */
    Object.entries(optionRefs.current).forEach(([val, el]) => {
      if (!el || val === value) return
      tl.to(el, {
        opacity: 0, y: 14, scale: 0.92,
        duration: 0.32, ease: 'power2.in',
      }, 0)
    })

    /* 선택된 답변 호리병으로 빨려들어감 */
    const selEl = optionRefs.current[value]
    if (selEl) curveIntoJar(tl, selEl, target, 0.05, 0.74)

    if (questionRef.current) curveIntoJar(tl, questionRef.current, target, 0.16, 0.66)

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

  function finish(ans) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { onResult(recommendMakgeolli(ans, list)); return }
    const tl = gsap.timeline({ onComplete: () => onResult(recommendMakgeolli(ans, list)) })
    tl.to(rootRef.current, { opacity: 0, duration: 0.42, ease: 'power2.in' })
  }

  const progress = ((step + 1) / total) * 100

  return (
    <div ref={rootRef} className={styles.overlay} role="dialog" aria-modal="true" aria-label="내 막걸리 찾기">
      <header className={styles.top}>
        <span className={styles.topLabel}>당신의 막걸리 취향은</span>
        <div className={styles.track} role="progressbar" aria-valuenow={step + 1} aria-valuemin={0} aria-valuemax={total}>
          <div className={styles.fill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.count}>{step + 1}/{total}</span>
      </header>

      <main className={styles.body}>
        <div ref={cardRef} className={styles.card}>
          <h2 ref={questionRef} className={styles.question}>{q.question}</h2>

          {q.kind === 'bubble' ? (
            <div className={styles.bubbles} role="group" aria-label="답변 선택">
              {q.options.map((opt, i) => (
                <button
                  key={opt.value}
                  ref={el => { optionRefs.current[opt.value] = el }}
                  className={`${styles.bubble} ${selected === opt.value ? styles.bubbleOn : ''} ${styles[`b${i % 6}`]}`}
                  onClick={() => { setSelected(opt.value); advance(opt.value) }}
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
                  onClick={() => { setSelected(opt.value); advance(opt.value) }}
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

      <div className={styles.jarWrap} aria-hidden="true">
        <img src={preferImg} alt="" className={styles.preferImg} />
        <div ref={mouthRef} className={styles.jarMouthPoint} />
      </div>
    </div>
  )
}
