/**
 * MakgeolliPage — 밝은 회색 미니멀 · 카드 그리드
 * 한 화면에 10종 카드 전체 노출 · 카드 탭 → FLIP 상세 (MakgeolliDetail)
 */

import { useState, useRef, useEffect } from 'react'
import { makgeolliList, tasteQuestions } from '../data/makgeolli'
import MakgeolliDetail from './MakgeolliDetail'
import TasteTest from './TasteTest'
import FlavorMap from './FlavorMap'
import RecoResult from './RecoResult'
import gsap from 'gsap'
import { useLang } from '../i18n/LanguageContext'
import styles from './MakgeolliPage.module.css'

const pre = { whiteSpace: 'pre-line' }

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
export default function MakgeolliPage({ onBack, initialView = 'list' }) {
  const [selected, setSelected]     = useState(null)
  const [showTest, setShowTest]     = useState(false)
  const [recommended, setRecommended] = useState(null)
  const [showReco, setShowReco]     = useState(false)
  const [view, setView]             = useState(initialView)

  const { t, tm } = useLang()
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
        <span className={styles.navLogo}>{t('nav.logo')}</span>
        <div className={styles.navRight}>
          {onBack && <button className={styles.navBack} onClick={onBack}>{t('cat.nav.home')}</button>}
        </div>
      </nav>

      {/* ══ 인트로 헤더 ═══════════════════════ */}
      <header className={styles.intro}>
        <span className={styles.introEye}>{t('cat.intro.eye')}</span>
        <h1 className={styles.introTitle}>
          <span className={styles.introKr}>{t('cat.intro.title')}</span>
          <span className={styles.introEn}>The Makgeolli Lineage</span>
        </h1>
        <p className={styles.introSub} style={pre}>{t('cat.intro.sub')}</p>
        <div className={styles.introActions}>
          <button className={styles.introActionBtn} onClick={() => setView('map')}>{t('cat.nav.map')}</button>
          <button className={styles.introActionBtn} onClick={() => setShowTest(true)}>{t('cat.nav.taste')}</button>
        </div>
      </header>

      {/* ══ 컬렉션 카드 그리드 ════════════════ */}
      <section className={styles.collection} id="catalog">
        <div className={styles.colHead}>
          <span className={styles.colCount}>COLLECTION · {makgeolliList.length}{t('cat.col.unit')}</span>
          <h2 className={styles.colTitle}>{t('cat.col.title')}</h2>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {makgeolliList.map((item, idx) => (
            <button
              key={item.id}
              className={styles.card}
              data-visible="false"
              style={{ '--card-color': item.color, animationDelay: `${idx * 0.05}s` }}
              onClick={() => openDetail(item)}
              aria-label={`${tm(item, 'name')} ${t('cat.card.view')}`}
            >
              <div className={styles.cardThumb}>
                <span className={styles.cardNum}>{String(idx + 1).padStart(2, '0')}</span>
                <MiniBottle />
                <span className={styles.cardAbv}>{item.flavor.abv}°</span>
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardRegion}>{tm(item, 'region')}</span>
                <span className={styles.cardName}>{tm(item, 'name')}</span>
                <span className={`${styles.cardLevel} ${styles[`lv_${item.level}`]}`}>
                  {t(`level.${item.level}`)}
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
        <span className={styles.footerName}>{t('cat.footer.name')}</span>
        <span className={styles.footerSub}>{t('cat.footer.sub')}</span>
        <div className={styles.footerActions}>
          <button className={styles.footerBtn} onClick={() => setView('map')}>{t('cat.footer.map')}</button>
          <button className={styles.footerBtnGhost} onClick={() => setShowTest(true)}>{t('cat.footer.taste')}</button>
        </div>
      </footer>

      {/* 취향 테스트 */}
      {showTest && (
        <TasteTest
          questions={tasteQuestions}
          list={makgeolliList}
          onResult={res => { setRecommended(res); setShowTest(false); setShowReco(true) }}
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

      {/* 취향 테스트 결과 풀스크린 */}
      {showReco && recommended && (
        <RecoResult
          item={recommended}
          onView={() => { setShowReco(false); openDetail(recommended) }}
          onRetry={() => { setShowReco(false); setRecommended(null); setShowTest(true) }}
          onClose={() => setShowReco(false)}
        />
      )}
    </div>
  )
}
