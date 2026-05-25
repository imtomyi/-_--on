import { useState } from 'react'
import styles from './TasteTest.module.css'

export default function TasteTest({ questions, list, onResult, onClose }) {
  const [step, setStep]       = useState(0)
  const [answers, setAnswers] = useState({})
  const [leaving, setLeaving] = useState(false)

  function handleAnswer(qId, value) {
    const next = { ...answers, [qId]: value }
    setAnswers(next)
    if (step < questions.length - 1) {
      setStep(s => s + 1)
    } else {
      onResult(recommend(next, list))
    }
  }

  function handleClose() {
    setLeaving(true)
    setTimeout(onClose, 240)
  }

  const q = questions[step]
  const progress = ((step) / questions.length) * 100

  return (
    <div className={`${styles.overlay} ${leaving ? styles.leaving : ''}`} role="dialog" aria-modal="true" aria-label="내 막걸리 찾기">

      {/* 상단 바 */}
      <div className={styles.topBar}>
        <div className={styles.progressTrack} role="progressbar" aria-valuenow={step} aria-valuemax={questions.length}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <div className={styles.topMeta}>
          <span className={styles.stepLabel}>{step + 1} / {questions.length}</span>
          <button className={styles.closeBtn} onClick={handleClose} aria-label="닫기">✕</button>
        </div>
      </div>

      {/* 질문 영역 */}
      <div className={styles.body}>
        {/* 기둥 모티프 반복 */}
        <div className={styles.pillar} aria-hidden="true" />

        <div className={styles.content}>
          <span className={styles.qNum} aria-hidden="true">Q{step + 1}</span>
          <h2 className={styles.question}>{q.question}</h2>

          <div className={styles.options} role="group" aria-label="답변 선택">
            {q.options.map((opt, i) => (
              <button
                key={opt.value}
                className={styles.option}
                onClick={() => handleAnswer(q.id, opt.value)}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className={styles.optionMark} aria-hidden="true">—</span>
                <span className={styles.optionLabel}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function recommend(answers, list) {
  const level = answers.experience ?? 'intro'
  const sweet = answers.sweetness === 'sweet'
  const pool  = list.filter(m => m.level === level)
  if (!pool.length) return list[0]
  return pool.reduce((best, cur) => {
    const score     = sweet ? cur.flavor.sweet : cur.flavor.dry
    const bestScore = sweet ? best.flavor.sweet : best.flavor.dry
    return score > bestScore ? cur : best
  })
}
