import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './GyeboLanding.module.css'
import { makgeolliList } from '../data/makgeolli'
import { useLenis } from '../hooks/useLenis'
import { useLang } from '../i18n/LanguageContext'
import heroImg from '../assets/hero.png'
import appleImg from '../assets/ingredients/apple.png'
import bowlImg from '../assets/ingredients/bowl-flower.png'
import wheatImg from '../assets/ingredients/wheat.png'

gsap.registerPlugin(ScrollTrigger)

const pre = { whiteSpace: 'pre-line' }   // '\n' 줄바꿈 렌더

/* id → 막걸리 (일러스트 매핑) */
const byId = Object.fromEntries(makgeolliList.map(m => [m.id, m]))

/* 프리뷰 스트립 표시 순서 — 같은(비슷한) 일러스트가 붙지 않도록 섞음
   (쌀/찹쌀 계열: jipyeong·haenam-chap·haechang 를 컬러풀한 것들 사이로 분산) */
const PREVIEW_ORDER = [
  'jipyeong', 'cheongsong', 'haenam-chap', 'gongju', 'mungyeong',
  'haechang', 'goheung', 'sobaek', 'anjeun', 'cloud',
]
const previewBase = PREVIEW_ORDER.map(id => byId[id])

/* 3벌 복제로 양방향 무한 루프 */
const tripleList = [
  ...previewBase.map(item => ({ ...item, _k: `a-${item.id}` })),
  ...previewBase.map(item => ({ ...item, _k: `b-${item.id}` })),
  ...previewBase.map(item => ({ ...item, _k: `c-${item.id}` })),
]

/* ── SVG: 유리병 (Section 4) ─────────────── */
function GlassBottle() {
  return (
    <svg viewBox="0 0 70 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.glassSvg}>
      <path d="M24 214 C14 214 8 206 8 196 L8 134 C8 126 12 120 18 116 L20 96 C16 92 14 84 14 76 L14 52 C14 40 18 32 24 26 L26 16 C28 10 32 6 35 5 C38 5 42 8 44 14 L46 24 C52 30 56 38 56 50 L56 78 C56 86 54 94 50 98 L52 118 C58 122 62 128 62 136 L62 198 C62 208 56 214 46 214 Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <rect x="29" y="0" width="14" height="7" rx="2" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M10 136 Q35 130 60 138" stroke="currentColor" strokeWidth="0.7" opacity="0.35"/>
      <rect x="11" y="148" width="48" height="42" rx="2" stroke="currentColor" strokeWidth="0.9" opacity="0.5"/>
      <text x="35" y="168" textAnchor="middle" fontSize="7" fontFamily="serif" fill="currentColor" opacity="0.65">막걸리</text>
      <text x="35" y="181" textAnchor="middle" fontSize="5.5" fontFamily="sans-serif" fill="currentColor" opacity="0.45" letterSpacing="2">GYEBO</text>
      <path d="M18 88 L18 185" stroke="currentColor" strokeWidth="0.5" opacity="0.12"/>
      <path d="M22 76 L22 196" stroke="currentColor" strokeWidth="0.3" opacity="0.09"/>
    </svg>
  )
}

/* ── SVG: 주전자 (Section 5) ────────────── */
function Teapot() {
  return (
    <svg viewBox="0 0 190 155" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.teapotSvg}>
      <ellipse cx="90" cy="88" rx="55" ry="48" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M143 76 C153 70 164 62 170 50 C168 47 163 45 159 48 C155 57 148 66 141 71 Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M38 68 C24 64 12 76 12 92 C12 108 24 118 38 114" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
      <path d="M65 42 Q90 35 115 42" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <ellipse cx="90" cy="30" rx="12" ry="6" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="90" cy="22" r="4" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M52 70 Q90 63 126 72" stroke="currentColor" strokeWidth="0.7" opacity="0.28"/>
      <path d="M46 88 Q90 81 132 90" stroke="currentColor" strokeWidth="0.7" opacity="0.28"/>
      <path d="M50 106 Q90 100 130 108" stroke="currentColor" strokeWidth="0.7" opacity="0.28"/>
    </svg>
  )
}

/* ── SVG: 부침개 (Section 5) ────────────── */
function Pancake() {
  return (
    <svg viewBox="0 0 170 130" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.pancakeSvg}>
      <ellipse cx="85" cy="100" rx="76" ry="20" stroke="currentColor" strokeWidth="1.4" opacity="0.35"/>
      <path d="M20 80 C18 67 26 56 40 50 C54 44 70 42 82 42 C94 42 110 44 124 50 C138 56 150 67 150 80 C150 93 138 102 122 106 C106 110 64 110 48 106 C32 102 20 93 20 80 Z"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M42 68 L40 84" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <path d="M56 60 L54 78" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <path d="M82 58 L80 78" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <path d="M108 62 L106 80" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <path d="M124 70 L122 86" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" opacity="0.5"/>
      <circle cx="68" cy="72" r="3" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <circle cx="98" cy="66" r="2.5" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <circle cx="78" cy="88" r="2" stroke="currentColor" strokeWidth="1" opacity="0.4"/>
      <circle cx="114" cy="78" r="2.5" stroke="currentColor" strokeWidth="1" opacity="0.35"/>
    </svg>
  )
}

/* ── SVG: 쌀알 + 이삭 (Section 4) ────────── */
function RiceOverhead() {
  return (
    <svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.riceSvg}>
      {[
        [38,80,-18],[72,52,28],[130,92,-32],[165,44,12],[208,78,-22],
        [258,58,38],[290,95,-12],[96,138,18],[148,158,-28],[188,126,22],
        [230,148,-18],[270,136,32],[28,158,-8],[320,65,-35],[185,178,8],
        [60,110,22],[310,120,-20],[140,42,-15],[240,32,25],[350,150,10],
      ].map(([x,y,deg],i) => (
        <ellipse key={i} cx={x} cy={y} rx="10" ry="5"
          transform={`rotate(${deg} ${x} ${y})`}
          stroke="currentColor" strokeWidth="1"
          opacity={0.15 + (i % 6) * 0.05}/>
      ))}
      <path d="M110 210 L105 140 L108 90 L110 60" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.28"/>
      <path d="M104 90 L97 78 M108 78 L101 68 M110 62 L106 52" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.22"/>
      <path d="M240 210 L235 130 L238 78 L240 50" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.28"/>
      <path d="M233 80 L226 68 M238 68 L231 58 M240 52 L236 42" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.22"/>
      <path d="M300 85 L295 180 L335 180 L330 85 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" opacity="0.3"/>
      <ellipse cx="315" cy="85" rx="16" ry="5" stroke="currentColor" strokeWidth="1.2" opacity="0.3"/>
      <path d="M299 180 L290 200 L340 200 L336 180" stroke="currentColor" strokeWidth="0.8" opacity="0.15" strokeLinecap="round"/>
    </svg>
  )
}

/* ── SVG: 스크롤 아이콘 ───────────────────── */
function ScrollArrow() {
  return (
    <svg viewBox="0 0 24 38" fill="none" className={styles.scrollArrow}>
      <rect x="1" y="1" width="22" height="36" rx="11" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M12 10 L12 22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M8 18 L12 23 L16 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ─────────────────────────────────────────
   Main Component
   ───────────────────────────────────────── */
export default function GyeboLanding({ onCatalog }) {
  const navRef        = useRef(null)
  const pageRef       = useRef(null)
  const secRefs       = useRef([])
  const stripRef      = useRef(null)
  const rafRef        = useRef(null)
  const userScrolling = useRef(false)
  const ingTitleRef   = useRef(null)
  const s5IllustRef   = useRef(null)
  const teapotRef     = useRef(null)
  const pancakeRef    = useRef(null)

  const { t, tm } = useLang()

  useLenis()

  /* Nav 배경 */
  useEffect(() => {
    const fn = () => {
      if (navRef.current)
        navRef.current.dataset.scrolled = window.scrollY > 60 ? 'true' : 'false'
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  /* GSAP ScrollTrigger */
  useEffect(() => {
    secRefs.current.filter(Boolean).forEach(el => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        onEnter: () => { el.dataset.visible = 'true' },
      })
    })

    if (pageRef.current) {
      ScrollTrigger.create({
        trigger: pageRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      })
    }

    if (s5IllustRef.current && secRefs.current[2]) {
      gsap.to(s5IllustRef.current, {
        yPercent: -22, ease: 'none',
        scrollTrigger: { trigger: secRefs.current[2], start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }

    if (ingTitleRef.current && secRefs.current[2]) {
      gsap.fromTo(ingTitleRef.current,
        { letterSpacing: '-0.035em' },
        { letterSpacing: '0.105em', ease: 'none',
          scrollTrigger: { trigger: secRefs.current[2], start: 'top bottom', end: 'center top', scrub: true } }
      )
    }

    if (teapotRef.current && secRefs.current[3]) {
      gsap.to(teapotRef.current, {
        yPercent: -14, ease: 'none',
        scrollTrigger: { trigger: secRefs.current[3], start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }

    if (pancakeRef.current && secRefs.current[3]) {
      gsap.to(pancakeRef.current, {
        yPercent: -22, ease: 'none',
        scrollTrigger: { trigger: secRefs.current[3], start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  /* 프리뷰 스트립 자동 스크롤 (양방향 무한 루프) */
  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    let initialized = false
    let lastTs = null

    function tick(ts) {
      if (!initialized && strip.scrollWidth > strip.clientWidth) {
        strip.scrollLeft = strip.scrollWidth / 3
        initialized = true
      }
      if (!userScrolling.current) {
        if (lastTs !== null && initialized) {
          const delta = Math.min(ts - lastTs, 50)
          strip.scrollLeft += delta * 0.030
        }
        lastTs = ts
      } else { lastTs = null }
      if (initialized) {
        const oneSet = strip.scrollWidth / 3
        if (strip.scrollLeft >= oneSet * 2)        strip.scrollLeft -= oneSet
        else if (strip.scrollLeft < oneSet * 0.35) strip.scrollLeft += oneSet
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    let resumeTimer = null
    const pause  = () => { userScrolling.current = true;  clearTimeout(resumeTimer) }
    const resume = () => { resumeTimer = setTimeout(() => { userScrolling.current = false }, 1800) }

    /* 마우스 드래그로 직접 스크롤 (데스크탑) — 터치는 네이티브 스크롤 */
    let dragging = false, dragStartX = 0, dragStartLeft = 0
    const onDown = (e) => {
      dragging = true
      dragStartX = e.clientX
      dragStartLeft = strip.scrollLeft
      pause()
      strip.style.cursor = 'grabbing'
    }
    const onMove = (e) => {
      if (!dragging) return
      strip.scrollLeft = dragStartLeft - (e.clientX - dragStartX)
    }
    const onUp = () => {
      if (!dragging) return
      dragging = false
      strip.style.cursor = 'grab'
      resume()
    }

    strip.addEventListener('touchstart',  pause,  { passive: true })
    strip.addEventListener('touchend',    resume, { passive: true })
    strip.addEventListener('touchcancel', resume, { passive: true })
    strip.addEventListener('mousedown',   onDown)
    window.addEventListener('mousemove',  onMove)
    window.addEventListener('mouseup',    onUp)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(resumeTimer)
      strip.removeEventListener('touchstart',  pause)
      strip.removeEventListener('touchend',    resume)
      strip.removeEventListener('touchcancel', resume)
      strip.removeEventListener('mousedown',   onDown)
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('mouseup',    onUp)
    }
  }, [])

  const r = i => el => { secRefs.current[i] = el }

  return (
    <div className={styles.page} ref={pageRef}>

      {/* ── 고정 네비게이션 ───────────────── */}
      <nav ref={navRef} className={styles.nav} data-scrolled="false">
        <span className={styles.navLogo}>{t('nav.logo')}</span>
        <button className={styles.navCta} onClick={onCatalog}>
          {t('nav.cta')}
        </button>
      </nav>

      {/* ════════════════════════════════════
          Section 1 — 히어로
      ════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.s1}`} data-visible="true">
        {/* 팔달문 사진 */}
        <div className={styles.heroImgWrap}>
          <img src={heroImg} alt="팔달문" className={styles.heroImg} />
          <div className={styles.heroOverlay} />
        </div>

        {/* 텍스트 영역 */}
        <div className={styles.heroContent}>
          <span className={styles.heroCap}>{t('s1.tag')}</span>
          <h1 className={styles.heroTitle}>Makgeolli Story</h1>
          <p className={styles.heroTagline}>{t('s1.sub')}</p>

          <div className={styles.heroBody}>
            <p>막걸리는 단순한 술을 넘어,<br />저마다의 탄생 계보와 고유한 맛의 스토리를 품고 있습니다.</p>
            <p>행궁동의 걷고이는 밤, 당신의 취향을 완성할 열 가지 막걸리의<br />특별한 계보학을 제안합니다.</p>
            <p>오늘의 분위기에 어울리는 완벽한 한 잔을 찾아보세요.</p>
          </div>

          <button className={styles.heroCta} onClick={onCatalog}>
            나의 취향 찾으러 가기 &nbsp;→
          </button>

          <div className={styles.heroIngr}>
            <img src={appleImg} alt="" className={styles.heroIngrImg} />
            <img src={bowlImg}  alt="" className={styles.heroIngrImg} />
            <img src={wheatImg} alt="" className={styles.heroIngrImg} />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          Section 2 — 선택받은 막걸리 (다크)
      ════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.s3}`} ref={r(0)} data-visible="false">
        <div className={styles.s3Center}>
          <h2 className={styles.s3Title} style={pre}>{t('s3.title')}</h2>

          <div className={styles.s3Cards}>
            <div className={styles.s3Card} data-align="left">
              <div className={styles.s3Thumb}>
                <img className={styles.s3Img} src={byId.anjeun.image} alt="" />
              </div>
              <div className={styles.s3CardInfo}>
                <span className={styles.s3CardName}>{t('s3.c1.name')}</span>
                <span className={styles.s3CardMeta}>{t('s3.c1.meta')}</span>
                <p className={styles.s3CardStory}>{t('s3.c1.story')}</p>
              </div>
            </div>

            <div className={styles.s3Card} data-align="right">
              <div className={styles.s3Thumb}>
                <img className={styles.s3Img} src={byId.mungyeong.image} alt="" />
              </div>
              <div className={styles.s3CardInfo}>
                <span className={styles.s3CardName}>{t('s3.c2.name')}</span>
                <span className={styles.s3CardMeta}>{t('s3.c2.meta')}</span>
                <p className={styles.s3CardStory}>{t('s3.c2.story')}</p>
              </div>
            </div>

            <div className={styles.s3Card} data-align="left">
              <div className={styles.s3Thumb}>
                <img className={styles.s3Img} src={byId.haechang.image} alt="" />
              </div>
              <div className={styles.s3CardInfo}>
                <span className={styles.s3CardName}>{t('s3.c3.name')}</span>
                <span className={styles.s3CardMeta}>{t('s3.c3.meta')}</span>
                <p className={styles.s3CardStory}>{t('s3.c3.story')}</p>
              </div>
            </div>
          </div>

          <button className={styles.processLink} onClick={onCatalog}>
            {t('common.viewAll')}
            <span className={styles.linkArrow}>→</span>
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════
          Section 3 — 계보학 기준
      ════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sCur}`} ref={r(1)} data-visible="false">
        <div className={styles.curInner}>
          <div className={styles.curHead}>
            <h2 className={styles.curTitle}>한 잔에 담긴<br />우리 술의 계보학</h2>
            <p className={styles.curSub}>엄격한 기준으로 선별한 열 가지 막걸리의 숨은 서사</p>
          </div>

          <div className={styles.curList}>
            <div className={styles.curItem}>
              <div className={styles.curItemBody}>
                <span className={styles.curItemKo}>장인성</span>
                <span className={styles.curItemEn}>Craftsmanship</span>
                <p className={styles.curItemDesc}>땅과 물, 그리고 로컬의 기후가 만들어낸 고유한 풍미.</p>
              </div>
            </div>
            <div className={styles.curDivider} />

            <div className={styles.curItem}>
              <div className={styles.curItemBody}>
                <span className={styles.curItemKo}>지역성</span>
                <span className={styles.curItemEn}>Territory</span>
                <p className={styles.curItemDesc}>세월을 버텨온 빚는 이의 고집과 장성이 담긴 손길.</p>
              </div>
            </div>
            <div className={styles.curDivider} />

            <div className={styles.curItem}>
              <div className={styles.curItemBody}>
                <span className={styles.curItemKo}>서사</span>
                <span className={styles.curItemEn}>Narrative</span>
                <p className={styles.curItemDesc}>역사와 전설, 그리고 한 잔의 술 뒤에 숨겨진 이야기.</p>
              </div>
            </div>
            <div className={styles.curDivider} />
          </div>

          <button className={styles.shopBtn} onClick={onCatalog}>
            계보 전체 보기
          </button>
        </div>
      </section>

    </div>
  )
}
