import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './GyeboLanding.module.css'
import { useLenis } from '../hooks/useLenis'
import { useLang } from '../i18n/LanguageContext'

import appleImg from '../assets/ingredients/Group 2.png'
import bowlFlowerImg from '../assets/ingredients/Group 3.png'
import riceImg from '../assets/ingredients/쌀 1.png'

gsap.registerPlugin(ScrollTrigger)

const pre = { whiteSpace: 'pre-line' }

export default function GyeboLanding({ onCatalog, onTest }) {
  const pageRef = useRef(null)
  const secRefs = useRef([])
  const { t } = useLang()

  useLenis()

  /* 스크롤 복구 방지 및 최상단 이동 */
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
    return () => {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto'
      }
    }
  }, [])

  /* GSAP ScrollTrigger */
  useEffect(() => {
    secRefs.current.filter(Boolean).forEach((el, i) => {
      // First section appears immediately, others trigger on scroll
      if (i === 0) {
        el.dataset.visible = 'true'
      } else {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 85%',
          onEnter: () => { el.dataset.visible = 'true' },
        })
      }
    })

    if (pageRef.current) {
      ScrollTrigger.create({
        trigger: pageRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
      })
    }
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const r = i => el => { secRefs.current[i] = el }

  return (
    <div className={styles.page} ref={pageRef}>

      {/* ── Sticky Hero Placeholder ───────────────── */}
      <div className={styles.heroImagePlaceholder}></div>

      {/* ── Main Content Wrapper ───────────────── */}
      <div className={styles.contentWrapper}>
        
        {/* ════════════════════════════════════
            Section 1 — Makgeolli Story
        ════════════════════════════════════ */}
        <section className={`${styles.section} ${styles.s1}`} ref={r(0)} data-visible="false">
          <div className={styles.s1Inner}>
            <span className={styles.s1Tag}>{t('s1.tag')}</span>
            <h1 className={styles.heroTitle}>{t('s1.krline')}</h1>
            <p className={styles.s1Sub} style={pre}>{t('s1.sub')}</p>
            
            <div className={styles.s1DescWrap}>
              <p className={styles.s1Desc} style={pre}>{t('s1.desc1')}</p>
              <p className={styles.s1Desc} style={pre}>{t('s1.desc2')}</p>
              <p className={styles.s1Desc} style={pre}>{t('s1.desc3')}</p>
            </div>

            <button className={styles.tasteBtn} onClick={onTest}>
              {t('s1.btn')} <span className={styles.btnArrow}>→</span>
            </button>

            <div className={styles.ingredientsRow}>
              <img src={appleImg} alt="Apple" className={styles.ingImg} />
              <img src={bowlFlowerImg} alt="Bowl Flower" className={styles.ingImg} />
              <img src={riceImg} alt="Rice" className={styles.ingImg} />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════
            Section 2 — Genealogy
        ════════════════════════════════════ */}
        <section className={`${styles.section} ${styles.snew}`} ref={r(1)} data-visible="false">
          <div className={styles.snewInner}>
            <h2 className={styles.snewTitle} style={pre}>{t('snew.title')}</h2>
            <p className={styles.snewSub} style={pre}>{t('snew.sub')}</p>

            <div className={styles.snewList}>
              {/* 장인성 */}
              <div className={styles.snewItem}>
                <div className={styles.snewItemHeader}>
                  <span className={styles.snewItemTerm}>{t('snew.c1.term')}</span>
                  <span className={styles.snewItemEn}>{t('snew.c1.en')}</span>
                </div>
                <p className={styles.snewItemDesc} style={pre}>{t('snew.c1.desc')}</p>
              </div>
              <div className={styles.snewDivider} />

              {/* 지역성 */}
              <div className={styles.snewItem}>
                <div className={styles.snewItemHeader}>
                  <span className={styles.snewItemTerm}>{t('snew.c2.term')}</span>
                  <span className={styles.snewItemEn}>{t('snew.c2.en')}</span>
                </div>
                <p className={styles.snewItemDesc} style={pre}>{t('snew.c2.desc')}</p>
              </div>
              <div className={styles.snewDivider} />

              {/* 서사 */}
              <div className={styles.snewItem}>
                <div className={styles.snewItemHeader}>
                  <span className={styles.snewItemTerm}>{t('snew.c3.term')}</span>
                  <span className={styles.snewItemEn}>{t('snew.c3.en')}</span>
                </div>
                <p className={styles.snewItemDesc} style={pre}>{t('snew.c3.desc')}</p>
              </div>
              <div className={styles.snewDivider} />
            </div>

            <button className={styles.viewAllBtn} onClick={onCatalog}>
              {t('snew.btn')}
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}
