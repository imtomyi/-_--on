import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './GyeboLanding.module.css'
import { useLenis } from '../hooks/useLenis'
import { useLang } from '../i18n/LanguageContext'

import heroImg from '../assets/hero.png'
import appleImg from '../assets/ingredients/apple.png'
import bowlBaseImg from '../assets/ingredients/bowl-base.png'
import bowlBloomImg from '../assets/ingredients/bowl-bloom.png'
import riceImg from '../assets/ingredients/rice-grains.png'

gsap.registerPlugin(ScrollTrigger)

export default function GyeboLanding({ onCatalog, onTest }) {
  const pageRef = useRef(null)
  const secRefs = useRef([])
  const { t } = useLang()

  useLenis()

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
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const r = i => el => { secRefs.current[i] = el }

  return (
    <div className={styles.page} ref={pageRef}>

      {/* ── Sticky Hero Image ── */}
      <div className={styles.heroImgWrap}>
        <img src={heroImg} alt="팔달문" className={styles.heroImg} decoding="async" />
      </div>

      <div className={styles.contentWrapper}>
        {/* ════════════════════════════════════
            Section 1 — 히어로
        ════════════════════════════════════ */}
        <section className={`${styles.section} ${styles.s1}`} data-visible="true">
          {/* 텍스트 영역 */}
        <div className={styles.heroContent}>
          <span className={styles.heroCap}>{t('s1.tag', '행궁동 수원 HAENGGUNG-DONG')}</span>
          <h1 className={styles.heroTitle}>Makgeolli Story</h1>
          <p className={styles.heroTagline}>{t('s1.sub', '열 가지 막걸리가 남긴 각각의 이야기와 계보')}</p>

          <div className={styles.heroBody}>
            <p>막걸리는 단순한 술을 넘어,<br />저마다의 탄생 계보와 고유한 맛의 스토리를 품고 있습니다.</p>
            <p>행궁동의 깊어가는 밤, 당신의 취향을 완성할 열 가지 막걸리의<br />특별한 계보학을 제안합니다.</p>
            <p>오늘의 분위기에 어울리는 완벽한 한 잔을 찾아보세요.</p>
          </div>

          <button className={styles.heroCta} onClick={onTest}>
            나의 취향 찾으러 가기 &nbsp;→
          </button>

          <div className={styles.heroIngr}>
            <div className={styles.heroIngrApplePair} aria-hidden="true">
              <img src={appleImg} alt="" className={`${styles.heroIngrImg} ${styles.heroAppleLeft}`} decoding="async" />
              <img src={appleImg} alt="" className={`${styles.heroIngrImg} ${styles.heroAppleRight}`} decoding="async" />
            </div>
            <div className={styles.heroIngrComposite} aria-hidden="true">
              <img src={bowlBaseImg} alt="" className={`${styles.heroIngrImg} ${styles.heroIngrBase}`} decoding="async" />
              <img src={bowlBloomImg} alt="" className={`${styles.heroIngrImg} ${styles.heroIngrBloom} ${styles.heroIngrBloomLeft}`} decoding="async" />
              <img src={bowlBloomImg} alt="" className={`${styles.heroIngrImg} ${styles.heroIngrBloom} ${styles.heroIngrBloomRight}`} decoding="async" />
            </div>
            <img src={riceImg}  alt="" className={styles.heroIngrImg} decoding="async" />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          Section 2 — 계보학 기준
      ════════════════════════════════════ */}
      <section className={`${styles.section} ${styles.sCur}`} ref={r(0)} data-visible="false">
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
                <p className={styles.curItemDesc}>세월을 버텨온 빚는 이의 고집과 정성이 담긴 손길.</p>
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
          </div>

          <button className={styles.shopBtn} onClick={onCatalog}>
            계보 전체 보기
          </button>
        </div>
      </section>
      </div>

    </div>
  )
}
