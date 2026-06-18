import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import styles from './MakgeolliDetail.module.css'

const LEVEL_KO = { intro: '입문', mid: '대중', deep: '전통' }

export default function MakgeolliDetail({ item, onClose }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    // Fade in and slide up animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }
    )

    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
    }
  }, [])

  function handleClose() {
    gsap.to(containerRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: onClose
    })
  }

  return (
    <div className={styles.overlay}>
      <button className={styles.backBtn} onClick={handleClose}>
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div ref={containerRef} className={styles.container}>
        
        {/* Top Image Section */}
        <div className={styles.imageSection}>
          {item.id === 'goheung' ? (
            <div className={styles.yuzuScene} aria-hidden="true">
              <img src={item.image} alt="" className={`${styles.yuzuImg} ${styles.yuzuLeft}`} decoding="async" />
              <img src={item.image} alt="" className={`${styles.yuzuImg} ${styles.yuzuRight}`} decoding="async" />
              <span className={`${styles.yuzuDot} ${styles.yuzuDotLarge}`} />
              <span className={`${styles.yuzuDot} ${styles.yuzuDotSmall}`} />
              <span className={`${styles.yuzuDot} ${styles.yuzuDotTiny}`} />
              <span className={styles.yuzuShadow} />
            </div>
          ) : item.imageParts ? (
            <div className={styles.heroComposite} aria-hidden="true">
              <img src={item.imageParts.base} alt="" className={`${styles.heroCompositeImg} ${styles.heroCompositeBase}`} decoding="async" />
              <img src={item.imageParts.bloom} alt="" className={`${styles.heroCompositeImg} ${styles.heroCompositeBloom} ${styles.heroCompositeBloomLeft}`} decoding="async" />
              <img src={item.imageParts.bloom} alt="" className={`${styles.heroCompositeImg} ${styles.heroCompositeBloom} ${styles.heroCompositeBloomRight}`} decoding="async" />
              <div className={styles.imageShadow} />
            </div>
          ) : (
            <>
              <img src={item.detailImage || item.image} alt="" className={styles.heroImg} decoding="async" />
              <div className={styles.imageShadow} />
            </>
          )}
        </div>

        {/* Bottom Card Section */}
        <div className={styles.cardSection}>
          <div className={styles.header}>
            <span className={`${styles.levelBadge} ${styles[`lv_${item.level}`]}`}>
              {LEVEL_KO[item.level]}
            </span>
            <h2 className={styles.title}>{item.name}</h2>
            <div className={styles.metaRow}>
              <span>도수 {item.metrics.abv ? `${item.metrics.abv}%` : '미상'}</span>
              <span className={styles.metaDivider}>|</span>
              <span>750ml</span>
            </div>
          </div>

          <div className={styles.subInfoRow}>
            <span>{item.region}</span>
            <span>{item.brewery}</span>
            <span>{item.ingredient}</span>
          </div>

          <p className={styles.story}>{item.story}</p>
          {item.tastingNote && <p className={styles.tastingNote}>{item.tastingNote}</p>}

          <div className={styles.profile}>
            <FlavorBar label="단맛" value={item.metrics.sweetness} />
            <FlavorBar label="산미" value={item.metrics.acidity} />
            <FlavorBar label="바디" value={item.metrics.body} />
          </div>

          <div className={styles.tags}>
            {item.tags.map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

function FlavorBar({ label, value }) {
  // Value is 0 to 5
  return (
    <div className={styles.flavorRow}>
      <span className={styles.flavorLabel}>{label}</span>
      <div className={styles.flavorTrack}>
        <div className={styles.flavorFill} style={{ width: `${(value / 5) * 100}%` }} />
      </div>
    </div>
  )
}
