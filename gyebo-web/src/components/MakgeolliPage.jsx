import { useState } from 'react'
import { makgeolliList, tasteQuestions } from '../data/makgeolli'
import MakgeolliCard from './MakgeolliCard'
import TasteTest from './TasteTest'
import styles from './MakgeolliPage.module.css'

export default function MakgeolliPage() {
  const [filter, setFilter] = useState('all')   // 'all' | 'intro' | 'mid' | 'deep'
  const [showTest, setShowTest] = useState(false)
  const [recommended, setRecommended] = useState(null)

  const filtered = filter === 'all'
    ? makgeolliList
    : makgeolliList.filter((m) => m.level === filter)

  return (
    <div className={styles.page}>
      {/* 헤더 */}
      <header className={styles.header}>
        <div className={styles.brand}>막걸리 계보</div>
        <p className={styles.tagline}>행궁동에서 엄선한 열 가지 막걸리</p>
      </header>

      {/* 취향 테스트 배너 */}
      {!showTest && (
        <button className={styles.testBanner} onClick={() => setShowTest(true)}>
          <span className={styles.testIcon}>🍶</span>
          <div>
            <div className={styles.testTitle}>내 막걸리 찾기</div>
            <div className={styles.testSub}>2문항으로 추천받기</div>
          </div>
          <span className={styles.testArrow}>›</span>
        </button>
      )}

      {showTest && (
        <TasteTest
          questions={tasteQuestions}
          list={makgeolliList}
          onResult={(result) => {
            setRecommended(result)
            setShowTest(false)
          }}
          onClose={() => setShowTest(false)}
        />
      )}

      {recommended && (
        <div className={styles.resultBanner}>
          <span>추천: </span>
          <strong>{recommended.name}</strong>
          <button className={styles.clearResult} onClick={() => setRecommended(null)}>✕</button>
        </div>
      )}

      {/* 레벨 필터 */}
      <div className={styles.filters}>
        {[
          { value: 'all',   label: '전체' },
          { value: 'intro', label: '입문' },
          { value: 'mid',   label: '중급' },
          { value: 'deep',  label: '심화' },
        ].map((f) => (
          <button
            key={f.value}
            className={`${styles.chip} ${filter === f.value ? styles.chipActive : ''}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 막걸리 카드 목록 */}
      <ul className={styles.list}>
        {filtered.map((item) => (
          <li key={item.id}>
            <MakgeolliCard
              item={item}
              highlighted={recommended?.id === item.id}
            />
          </li>
        ))}
      </ul>

      <footer className={styles.footer}>
        <p>막걸리 계보 · 수원 행궁동</p>
      </footer>
    </div>
  )
}
