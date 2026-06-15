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
import Survey from './Survey'
import gsap from 'gsap'
import { useLang } from '../i18n/LanguageContext'
import styles from './MakgeolliPage.module.css'

const pre = { whiteSpace: 'pre-line' }

/* ═══════════════════════════════════════════
   Main
   ═══════════════════════════════════════════ */
export default function MakgeolliPage({ onBack, initialView = 'list' }) {
  const [selected, setSelected]     = useState(null)
  const [showTest, setShowTest]     = useState(false)
  const [recommended, setRecommended] = useState(null)
  const [showReco, setShowReco]     = useState(false)
  const [recoSource, setRecoSource] = useState('test')  // 'test' | 'survey' — '다시 테스트' 재진입용
  const [showSurvey, setShowSurvey] = useState(false)
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
                {item.favorite && (
                  <span className={styles.favBadge}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77 5.82 21l1.18-6.88-5-4.87 7.1-1.01L12 2z"/>
                    </svg>
                    사장님 최애
                  </span>
                )}
                <img
                  className={styles.cardImg}
                  src={item.image}
                  alt={`${tm(item, 'name')} 재료 일러스트`}
                  loading="lazy"
                />
                {item.metrics.abv != null && (
                  <span className={styles.cardAbv}>{item.metrics.abv}°</span>
                )}
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
        <span className={styles.footerName}>{t('cat.footer.name')}</span>
        <p className={styles.footerAddr}>경기 수원시 팔달구 정조로 781-13 1층</p>
        <a className={styles.footerTel} href="tel:050714450052">0507-1445-0052</a>
        <div className={styles.footerActions}>
          <button className={styles.footerBtn} onClick={() => setView('map')}>{t('cat.footer.map')}</button>
          <button className={styles.footerBtnGhost} onClick={() => setShowTest(true)}>{t('cat.footer.taste')}</button>
          <button className={styles.footerBtnGhost} onClick={() => setShowSurvey(true)}>맞춤 추천</button>
        </div>
      </footer>

      {/* 취향 테스트 */}
      {showTest && (
        <TasteTest
          questions={tasteQuestions}
          list={makgeolliList}
          onResult={res => { setRecommended(res); setRecoSource('test'); setShowTest(false); setShowReco(true) }}
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
          onRetry={() => {
            setShowReco(false); setRecommended(null)
            recoSource === 'survey' ? setShowSurvey(true) : setShowTest(true)
          }}
          onClose={() => setShowReco(false)}
        />
      )}

      {/* 맞춤 막걸리 추천 설문 */}
      {showSurvey && (
        <Survey
          onResult={res => { setRecommended(res); setRecoSource('survey'); setShowSurvey(false); setShowReco(true) }}
          onClose={() => setShowSurvey(false)}
        />
      )}
    </div>
  )
}
