import { useState } from 'react'
import styles from './TasteTest.module.css'

export default function TasteTest({ questions, list, onResult, onClose }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  function handleAnswer(qId, value) {
    const next = { ...answers, [qId]: value }
    setAnswers(next)
    if (step < questions.length - 1) {
      setStep((s) => s + 1)
    } else {
      const result = recommend(next, list)
      onResult(result)
    }
  }

  const q = questions[step]

  return (
    <div className={styles.wrap}>
      <div className={styles.topBar}>
        <span className={styles.progress}>{step + 1} / {questions.length}</span>
        <button className={styles.close} onClick={onClose}>✕</button>
      </div>
      <p className={styles.question}>{q.question}</p>
      <div className={styles.options}>
        {q.options.map((opt) => (
          <button
            key={opt.value}
            className={styles.option}
            onClick={() => handleAnswer(q.id, opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function recommend(answers, list) {
  const level = answers.experience ?? 'intro'
  const sweet = answers.sweetness === 'sweet'

  const pool = list.filter((m) => m.level === level)
  if (!pool.length) return list[0]

  return pool.reduce((best, cur) => {
    const score = sweet ? cur.flavor.sweet : cur.flavor.dry
    const bestScore = sweet ? best.flavor.sweet : best.flavor.dry
    return score > bestScore ? cur : best
  })
}
