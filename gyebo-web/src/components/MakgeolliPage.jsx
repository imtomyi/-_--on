/**
 * MakgeolliPage — 밝은 회색 미니멀 · 카드 그리드
 * 한 화면에 10종 카드 전체 노출 · 카드 탭 → FLIP 상세 (MakgeolliDetail)
 */

import { useState, useRef, useEffect } from 'react'
import { makgeolliList, tasteQuestions } from '../data/makgeolli'
import MakgeolliDetail from './MakgeolliDetail'
import TasteTest from './TasteTest'
import FlavorMap from './FlavorMap'
import gsap from 'gsap'
import styles from './MakgeolliPage.module.css'

/* 카드 썸네일용 미니 병 */
function MiniBottle() {
  return (
    <svg viewBox="0 0 60 150" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={styles.miniBottle} aria-hidden="true">
      <path d="M20 146 C12 146 6 139 6 130 L6 70 C6 61 11 54 16 51 L17 36
               C12 33 10 27 10 21 L10 12 L50 12 L50 21 C50 27 48 33 43 36
               L44 52 C49 55 54 62 54 71 L54 131 C54 140 48 146 40 146 Z"
        fill="rgba(255,255,255,0.5)" stroke="rgba(0,0,0,0.2)" strokeWidth="1.3"/>
      <path d="M9 104 L51 104 L50 130 C49 140 43 145 35 145 L23 145 C16 145 10 140 9 130 Z"
        fill="var(--card-color, #d8caa6)" opacity="0.95"/>
      <rect x="18" y="7" width="24" height="7" rx="2" fill="rgba(0,0,0,0.32)"/>
      <line x1="14" y1="76" x2="46" y2="76" stroke="rgba(0,0,0,0.15)" strokeWidth="0.8"/>
    </svg>
  )
}

/* ═══════════════════════════════════════════
   Main
   ═══════════════════════════════════════════ */
export default function MakgeolliPage({ onBack }) {
  const [selected, setSelected]     = useState(null)
  const [showTest, setShowTest]     = useState(false)
  const [recommended, setRecommended] = useState(null)
  const [view, setView]             = useState('list')

  const gridRef = useRef(null)

  /* 진입 시 최상단 */
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  /* 카드 스태거 등장 */
  useEffect(() => {
    if (view !== 'list' || !gridRef.current) return
    const cards = gridRef.current.querySelectorAll(`.${styles.card}`)
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.dataset.visible = 'true'; io.unobserve(e.target) }
      }),
      { threshold: 0.12 }
    )
    cards.forEach(c => io.observe(c))
    return () => io.disconnect()
  }, [view])

  /* 상세 열기/닫기 (그리드 블러 + 두루마리 오버레이) */
  function openDetail(item) {
    setSelected(item)
    if (gridRef.current)
      gsap.to(gridRef.current, { opacity: 0.3, filter: 'blur(2px)', duration: 0.32, ease: 'power2.out' })
  }
  function closeDetail() {
    if (gridRef.current)
      gsap.to(gridRef.current, { opacity: 1, filter: 'blur(0px)', duration: 0.36, ease: 'power2.out', delay: 0.14 })
    setSelected(null)
  }

  if (view === 'map') return <FlavorMap onBack={() => setView('list')} />

  return (
    <div className={styles.page}>

      {/* ══ 네비게이션 ════════════════════════ */}
      <nav className={styles.nav}>
        <span className={styles.navLogo}>막걸리 계보</span>
        <div className={styles.navRight}>
          <button className={styles.navLink} onClick={() => setView('map')}>계보도</button>
          <button className={styles.navLink} onClick={() => setShowTest(true)}>취향</button>
          {onBack && <button className={styles.navBack} onClick={onBack}>← 홈</button>}
        </div>
      </nav>

      {/* ══ 인트로 헤더 ═══════════════════════ */}
      <header className={styles.intro}>
        <span className={styles.introEye}>HAENGGUNG-DONG · 수원 행궁동</span>
        <h1 className={styles.introTitle}>
          <span className={styles.introKr}>계보를 잇다</span>
          <span className={styles.introEn}>The Makgeolli Lineage</span>
        </h1>
        <p className={styles.introSub}>
          행궁동 막걸리 계보가 큐레이션한 열 가지 술.<br/>
          카드를 눌러 각 막걸리의 이야기를 만나보세요.
        </p>
      </header>

      {/* ══ 컬렉션 카드 그리드 ════════════════ */}
      <section className={styles.collection} id="catalog">
        <div className={styles.colHead}>
          <span className={styles.colCount}>COLLECTION · {makgeolliList.length}종</span>
          <h2 className={styles.colTitle}>막걸리 계보</h2>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {makgeolliList.map((item, idx) => (
            <button
              key={item.id}
              className={styles.card}
              data-visible="false"
              style={{ '--card-color': item.color, animationDelay: `${idx * 0.05}s` }}
              onClick={() => openDetail(item)}
              aria-label={`${item.name} 상세 보기`}
            >
              <div className={styles.cardThumb}>
                <span className={styles.cardNum}>{String(idx + 1).padStart(2, '0')}</span>
                <MiniBottle />
                <span className={styles.cardAbv}>{item.flavor.abv}°</span>
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardRegion}>{item.region}</span>
                <span className={styles.cardName}>{item.name}</span>
                <span className={`${styles.cardLevel} ${styles[`lv_${item.level}`]}`}>
                  {item.levelLabel}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ══ 푸터 ══════════════════════════════ */}
      <footer className={styles.footer}>
        <div className={styles.footerSeal} aria-hidden="true">
          <span className={styles.footerChar}>계</span>
        </div>
        <span className={styles.footerName}>막걸리 계보</span>
        <span className={styles.footerSub}>수원 행궁동 · HAENGGUNG-DONG</span>
        <div className={styles.footerActions}>
          <button className={styles.footerBtn} onClick={() => setView('map')}>맛 계보도 보기</button>
          <button className={styles.footerBtnGhost} onClick={() => setShowTest(true)}>취향 테스트</button>
        </div>
      </footer>

      {/* 취향 테스트 */}
      {showTest && (
        <TasteTest
          questions={tasteQuestions}
          list={makgeolliList}
          onResult={res => { setRecommended(res); setShowTest(false) }}
          onClose={() => setShowTest(false)}
        />
      )}

      {/* 두루마리 상세 */}
      {selected && (
        <MakgeolliDetail
          item={selected}
          ordinal={makgeolliList.findIndex(i => i.id === selected.id) + 1}
          onClose={closeDetail}
        />
      )}

      {/* 추천 토스트 */}
      {recommended && !showTest && (
        <div className={styles.recoToast} role="status">
          <span className={styles.recoLabel}>당신을 위한 추천</span>
          <span className={styles.recoName}>{recommended.name}</span>
          <button className={styles.recoClose} onClick={() => setRecommended(null)}>✕</button>
        </div>
      )}
    </div>
  )
}
