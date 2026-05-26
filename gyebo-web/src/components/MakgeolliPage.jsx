import { useState } from 'react'
import { makgeolliList, tasteQuestions } from '../data/makgeolli'
import MakgeolliCard from './MakgeolliCard'
import TasteTest from './TasteTest'
import FlavorMap from './FlavorMap'
import styles from './MakgeolliPage.module.css'

export default function MakgeolliPage() {
  const [showTest, setShowTest]       = useState(false)
  const [recommended, setRecommended] = useState(null)
  const [view, setView]               = useState('list')   // 'list' | 'map'

  if (view === 'map') return <FlavorMap onBack={() => setView('list')} />

  return (
    <div className={styles.page}>

      {/* ── 히어로 ────────────────────────────── */}
      <header className={styles.hero}>
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

      {/* ── 목록 ───────────────────────────────── */}
      <main>
        {/* 섹션 브레이크 — 와당 구분선 + 뷰 토글 */}
        <div className={styles.sectionBreak} aria-hidden="true">
          <span className={styles.sectionLine} />
          <span className={styles.sectionMark}>
            <span className={styles.sectionDot} />
            막걸리 계보
            <span className={styles.sectionDot} />
          </span>
          <span className={styles.sectionLine} />
        </div>

        {/* 뷰 전환 토글 */}
        <div className={styles.viewToggle} role="group" aria-label="보기 전환">
          <button
            className={`${styles.viewBtn} ${view === 'list' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
          >
            목록
          </button>
          <button
            className={`${styles.viewBtn} ${view === 'map' ? styles.viewBtnActive : ''}`}
            onClick={() => setView('map')}
            aria-pressed={view === 'map'}
          >
            계보도
          </button>
        </div>

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

        <div className={styles.catalogPanel}>
          <ul className={styles.catalog} role="list">
            {makgeolliList.map((item, idx) => (
              <li key={item.id} role="listitem">
                <MakgeolliCard
                  item={item}
                  ordinal={idx + 1}
                  highlighted={recommended?.id === item.id}
                />
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* ── 푸터 — 간기(刊記) ───────────────────── */}
      <footer className={styles.footer}>
        <div className={styles.footerSealRing} aria-hidden="true">
          <span className={styles.footerSealChar}>계</span>
        </div>
        <span className={styles.footerName}>막걸리 계보</span>
        <span className={styles.footerSub}>수원 행궁동 · HAENGGUNG-DONG</span>
      </footer>

      {showTest && (
        <TasteTest
          questions={tasteQuestions}
          list={makgeolliList}
          onResult={result => {
            setRecommended(result)
            setShowTest(false)
          }}
          onClose={() => setShowTest(false)}
        />
      )}
    </div>
  )
}
