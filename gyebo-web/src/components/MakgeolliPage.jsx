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
import webIcon from '../../web_icon.png'

const pre = { whiteSpace: 'pre-line' }

/* ═══════════════════════════════════════════
   Main
   ═══════════════════════════════════════════ */
export default function MakgeolliPage({ onBack, onHome, initialView = 'list', initialTest = false }) {
  const [selected, setSelected]     = useState(null)
  const [showTest, setShowTest]     = useState(initialTest)
  const [recommended, setRecommended] = useState(null)
  const [showReco, setShowReco]     = useState(false)
  const [recoSource, setRecoSource] = useState('test')
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
        {onBack && (
          <button className={styles.navBack} onClick={onBack}>
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
        )}
        <div className={styles.navRight}>
          <button className={styles.navBtn} onClick={() => setView('map')}>계보도</button>
          <button className={styles.navBtn} onClick={() => setShowTest(true)}>취향</button>
        </div>
      </nav>

      {/* ══ 인트로 헤더 ═══════════════════════ */}
      <header className={styles.intro}>
        <img src={webIcon} alt="Icon" className={styles.introIcon} />
        <h1 className={styles.introTitle}>
          <span className={styles.introKr}>계보를 잇다</span>
          <span className={styles.introEn}>The Makgeolli Archive</span>
        </h1>
        <p className={styles.introSub} style={pre}>
          {'수원 행궁동에서 제안하는 우리 술의 깊은 흐름.\n엄선된 열 가지 전통 막걸리의 고유한 서사와 숨겨진 계보를 하나씩 열어보세요.'}
        </p>
        <hr className={styles.introDivider} />
      </header>

      {/* ══ 컬렉션 카드 그리드 ════════════════ */}
      <section className={styles.collection} id="catalog">
        <div className={styles.colHead}>
          <span className={styles.colCount}>10가지 취향의 기록 &nbsp;COLECTION</span>
        </div>

        <div ref={gridRef} className={styles.grid}>
          {makgeolliList.map((item, idx) => (
            <button
              key={item.id}
              className={styles.card}
              data-visible="false"
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => openDetail(item)}
            >
              <div className={styles.cardInfoTop}>
                <span className={`${styles.cardLevel} ${styles[`lv_${item.level}`]}`}>
                  {t(`level.${item.level}`)}
                </span>
              </div>
              <div className={styles.cardThumb}>
                <img
                  className={styles.cardImg}
                  src={item.image}
                  alt={`${tm(item, 'name')} 재료 일러스트`}
                  loading="lazy"
                  style={item.id === 'gongju' ? { transform: 'scale(0.8)' } : {}}
                />
              </div>
              <div className={styles.cardInfoBottom}>
                <span className={styles.cardRegion}>{tm(item, 'region')}</span>
                <span className={styles.cardName}>{tm(item, 'name')}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ══ 푸터 (홈으로 버튼) ══════════════════════════════ */}
      <footer className={styles.footer}>
        <button className={styles.homeBtn} onClick={onHome || onBack}>
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          홈으로
        </button>
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
