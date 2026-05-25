import { useState } from 'react'
import { makgeolliList, tasteQuestions } from '../data/makgeolli'
import MakgeolliCard from './MakgeolliCard'
import TasteTest from './TasteTest'
import styles from './MakgeolliPage.module.css'

const FILTERS = [
  { value: 'all',   label: '전체' },
  { value: 'intro', label: '입문' },
  { value: 'mid',   label: '중급' },
  { value: 'deep',  label: '심화' },
]

export default function MakgeolliPage() {
  const [filter, setFilter]       = useState('all')
  const [showTest, setShowTest]   = useState(false)
  const [recommended, setRecommended] = useState(null)

  const filtered = filter === 'all'
    ? makgeolliList
    : makgeolliList.filter(m => m.level === filter)

  return (
    <div className={styles.page}>

      {/* ── 히어로 ────────────────────────────── */}
      <header className={styles.hero}>
        {/* 기둥(柱) 모티프 — 한옥 기둥의 수직 리듬 */}
        <div className={styles.pillar} aria-hidden="true" />

        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>행궁동 수원 · HAENGGUNG-DONG</span>

          <h1 className={styles.title}>
            <span className={styles.titleMain}>막걸리</span>
            <span className={styles.titleAccent}>계보</span>
          </h1>

          <p className={styles.tagline}>
            열 가지 막걸리가 남긴<br />각각의 이야기와 계보
          </p>

          <button
            className={styles.ctaBtn}
            onClick={() => setShowTest(true)}
            aria-label="내 막걸리 찾기 시작"
          >
            내 막걸리 찾기
            <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </button>
        </div>
      </header>

      {/* ── 필터 탭 — 창호(窓戶) 분할 ────────── */}
      <nav className={styles.filterSection} aria-label="레벨 필터">
        <div className={styles.filterRow} role="tablist">
          {FILTERS.map(f => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              className={`${styles.filterTab} ${filter === f.value ? styles.filterTabActive : ''}`}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── 목록 ───────────────────────────────── */}
      <main>
        {recommended && (
          <div className={styles.resultBanner} role="status">
            <span className={styles.resultLabel}>추천</span>
            <strong className={styles.resultName}>{recommended.name}</strong>
            <button
              className={styles.resultClose}
              onClick={() => setRecommended(null)}
              aria-label="추천 닫기"
            >✕</button>
          </div>
        )}

        <ul className={styles.catalog} role="list">
          {filtered.map((item, idx) => (
            <li key={item.id} role="listitem">
              <MakgeolliCard
                item={item}
                ordinal={makgeolliList.indexOf(item) + 1}
                highlighted={recommended?.id === item.id}
              />
            </li>
          ))}
        </ul>
      </main>

      <footer className={styles.footer}>
        <span>막걸리 계보</span>
        <span className={styles.footerDot} aria-hidden="true">·</span>
        <span>수원 행궁동</span>
      </footer>

      {/* ── 취향 테스트 오버레이 ────────────── */}
      {showTest && (
        <TasteTest
          questions={tasteQuestions}
          list={makgeolliList}
          onResult={result => {
            setRecommended(result)
            setShowTest(false)
            setFilter('all')
          }}
          onClose={() => setShowTest(false)}
        />
      )}
    </div>
  )
}
