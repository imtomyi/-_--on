import { useState, useRef, useMemo, useLayoutEffect } from 'react'
import { makgeolliList } from '../data/makgeolli'
import gsap from 'gsap'
import styles from './FlavorMap.module.css'

const LEVEL_KO = { intro: '입문', mid: '대중', deep: '전통' }

const REGION_POS = {
  '경기 양평': { x: 45, y: 56, label: '경기 양평' },
  '경북 청송': { x: 63, y: 67, label: '경북 . 청송' },
  '충남 공주': { x: 42, y: 66, label: '충남 . 공주' },
  '전남 고흥': { x: 44, y: 84, label: '전남 . 고흥' },
  '경북 문경': { x: 53, y: 65, label: '경북 . 문경' },
  '충북 단양': { x: 53, y: 57, label: '충북 . 단양' },
  '충남 서천': { x: 33, y: 71, label: '충남 . 서천' },
  '전남 해남': { x: 33, y: 84, label: '전남 . 해남' },
}
const posOf = item => REGION_POS[item.region] ?? { x: 50, y: 64, label: item.region }

function nodePct(item) {
  const { sweetness, acidity, body } = item.metrics
  const dryness = acidity - sweetness
  const x = 12 + ((dryness + 4) / 8) * 76
  const y = 12 + ((body - 2) / 3) * 76
  return { x, y }
}

function layoutNodes(list, W = 327, H = 580) {
  const ns = list.map(item => {
    const { x, y } = nodePct(item)
    return { px: (x / 100) * W, py: (y / 100) * H, size: 48 }
  })
  for (let it = 0; it < 140; it++) {
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i], b = ns[j]
        let dx = b.px - a.px, dy = b.py - a.py
        let d = Math.hypot(dx, dy)
        if (d < 0.01) {
          dx = Math.cos(i * 2.39); dy = Math.sin(i * 2.39); d = 1
        }
        const min = (a.size + b.size) / 2 + 12
        if (d < min) {
          const push = (min - d) / 2, ux = dx / d, uy = dy / d
          a.px -= ux * push; a.py -= uy * push
          b.px += ux * push; b.py += uy * push
        }
      }
    }
  }
  return ns.map(n => {
    const r = n.size / 2
    const px = Math.max(r + 4, Math.min(W - r - 4, n.px))
    const py = Math.max(r + 4, Math.min(H - r - 4, n.py))
    return { x: (px / W) * 100, y: (py / H) * 100, size: n.size }
  })
}


export default function FlavorMap({ onBack }) {
  const [active, setActive]   = useState(null)
  const [showReal, setShowReal] = useState(false)
  const layout = useMemo(() => layoutNodes(makgeolliList), [])

  const busy     = useRef(false)
  const pageRef  = useRef(null)
  const mapRef   = useRef(null)
  const matrixRef = useRef(null)
  const stageRef = useRef(null)
  const rippleRef = useRef(null)
  const bottleRef = useRef(null)
  const panelRef = useRef(null)

  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !matrixRef.current) return
    const nodes = matrixRef.current.querySelectorAll(`.${styles.node}`)
    gsap.fromTo(nodes, { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.7)', delay: 0.1 })
  }, [])

  function openRegion(item) {
    if (busy.current) return
    busy.current = true
    setActive(item)
    setShowReal(false)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const p = posOf(item)

    const pageRect = pageRef.current.getBoundingClientRect()
    const mapRect  = mapRef.current.getBoundingClientRect()
    const imgEl    = mapRef.current.querySelector(`.${styles.mapImg}`)
    const imgRect  = (imgEl || mapRef.current).getBoundingClientRect()
    const regionX  = imgRect.left + (p.x / 100) * imgRect.width
    const regionY  = imgRect.top  + (p.y / 100) * imgRect.height
    
    const ox = ((regionX - mapRect.left) / mapRect.width)  * 100
    const oy = ((regionY - mapRect.top)  / mapRect.height) * 100
    const origin = `${ox}% ${oy}%`
    const dx = (pageRect.left + pageRect.width  / 2) - regionX
    const dy = (pageRect.top  + pageRect.height * 0.28) - regionY
    const scale = 2.7

    if (reduce) {
      gsap.set(matrixRef.current, { opacity: 0 })
      gsap.set(mapRef.current, { scale, x: dx, y: dy, transformOrigin: origin, opacity: 0.5 })
      revealStage(true)
      busy.current = false
      return
    }

    const tl = gsap.timeline({ onComplete: () => { busy.current = false } })

    tl.to(matrixRef.current, { opacity: 0, scale: 0.9, duration: 0.5, ease: 'power2.in' }, 0)

    tl.to(mapRef.current, {
      scale, x: dx, y: dy,
      transformOrigin: origin,
      duration: 1.3, ease: 'expo.inOut',
    }, 0.1)
    tl.to(mapRef.current.querySelector(`.${styles.mapImg}`), { opacity: 0.3, duration: 0.8, ease: 'power1.out' }, 0.1)

    tl.fromTo(rippleRef.current,
      { scale: 0, opacity: 0.65 },
      { scale: 3.2, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.95)

    tl.fromTo(bottleRef.current,
      { y: -120, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, 1.05)

    tl.fromTo(panelRef.current,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, 1.25)
  }

  function revealStage() {
    gsap.set([rippleRef.current], { opacity: 0 })
    gsap.set(bottleRef.current, { y: 0, opacity: 1, scale: 1 })
    gsap.set(panelRef.current, { yPercent: 0, opacity: 1 })
  }

  function closeRegion() {
    if (busy.current) return
    busy.current = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const finish = () => { setActive(null); setShowReal(false); busy.current = false }

    if (reduce) {
      gsap.set(mapRef.current, { scale: 1, x: 0, y: 0 })
      gsap.set(matrixRef.current, { opacity: 1, scale: 1 })
      finish(); return
    }

    const tl = gsap.timeline({ onComplete: finish })
    tl.to(panelRef.current, { yPercent: 110, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0)
    tl.to(bottleRef.current, { y: -60, opacity: 0, scale: 0.85, duration: 0.4, ease: 'power2.in' }, 0)
    tl.to(mapRef.current, {
      scale: 1, x: 0, y: 0,
      duration: 1.0, ease: 'expo.inOut',
    }, 0.18)
    tl.to(mapRef.current.querySelector(`.${styles.mapImg}`), { opacity: 0.12, duration: 0.6 }, 0.3)
    tl.to(matrixRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.7)
  }

  const inRegion = active != null
  const ap = active ? posOf(active) : null

  return (
    <div ref={pageRef} className={styles.page} data-region={inRegion ? 'true' : 'false'}>

      <div ref={mapRef} className={styles.map} aria-hidden="true">
        <img src="/korea-map.png" alt="" className={styles.mapImg} />
      </div>

      <header className={styles.header}>
        {inRegion ? (
          <button className={styles.backBtn} onClick={closeRegion} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <button className={styles.backBtn} onClick={onBack} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
        <span className={styles.title}>{inRegion ? ap.label : '맛의 지형도'}</span>
        <div style={{ width: 40 }} />
      </header>

      <div ref={matrixRef} className={styles.matrix} style={{ pointerEvents: inRegion ? 'none' : 'auto' }}>
        <div className={styles.axisV} />
        <div className={styles.axisH} />
        <span className={`${styles.axisLabel} ${styles.axTop}`}>가벼운</span>
        <span className={`${styles.axisLabel} ${styles.axBottom}`}>묵직한</span>
        <span className={`${styles.axisLabel} ${styles.axLeft}`}>달달한</span>
        <span className={`${styles.axisLabel} ${styles.axRight}`}>드라이</span>

        {makgeolliList.map((item, idx) => {
          const { x, y, size } = layout[idx]
          return (
            <button
              key={item.id}
              className={styles.node}
              style={{ left: `${x}%`, top: `${y}%`, '--size': `${size}px` }}
              onClick={() => openRegion(item)}
              aria-label={`${item.name} ${LEVEL_KO[item.level]}`}
            >
              <span className={styles.nodeBubble} />
              <span className={styles.nodeNum}>{idx + 1}</span>
            </button>
          )
        })}
      </div>

      <div ref={stageRef} className={styles.stage} style={{ pointerEvents: inRegion ? 'auto' : 'none' }}>
        <div ref={rippleRef} className={styles.ripple} style={{ opacity: 0 }} />
        <div ref={bottleRef} className={`${styles.bottle} ${showReal ? styles.hideBottleBg : ''}`} style={{ opacity: 0 }}>
          {active && (
            <>
              <img 
                className={`${styles.bottleImg} ${showReal ? styles.hiddenIcon : ''}`} 
                src={active.image} 
                alt="" 
                onClick={() => { if(active.realImage) setShowReal(true) }}
                style={{ cursor: active.realImage && !showReal ? 'pointer' : 'default' }}
              />
              {active.realImage && (
                <img 
                  className={`${styles.realImg} ${showReal ? styles.showRealImg : ''}`} 
                  src={active.realImage} 
                  alt="" 
                  onClick={() => setShowReal(false)}
                />
              )}
            </>
          )}
        </div>
      </div>

      <aside ref={panelRef} className={styles.panel} style={{ opacity: 0, pointerEvents: inRegion ? 'auto' : 'none' }}>
        {active && (
          <>
            <div className={styles.panelHead}>
              <span className={`${styles.panelLevel} ${styles[`lv_${active.level}`]}`}>{LEVEL_KO[active.level]}</span>
            </div>
            <h2 className={styles.panelName}>{active.name}</h2>
            <div className={styles.panelMeta}>
              도수 {active.metrics.abv ?? 6}% <span className={styles.divider}>|</span> 750ml
            </div>
            <div className={styles.panelTags}>
              <span className={styles.panelTag}>지역특산물</span>
              <span className={styles.panelTag}>{active.brewery}</span>
              <span className={styles.panelTag}>{active.ingredient} 첨가</span>
            </div>
            <p className={styles.panelStory}>{active.story}</p>
            <div className={styles.panelBars}>
              <Bar label="단맛" v={active.metrics.sweetness} />
              <Bar label="산미" v={active.metrics.acidity} />
              <Bar label="바디" v={active.metrics.body} />
            </div>
          </>
        )}
      </aside>

    </div>
  )
}

function Bar({ label, v, max = 5 }) {
  return (
    <div className={styles.bar}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.barTrack}><div className={styles.barFill} style={{ width: `${(v / max) * 100}%` }} /></div>
    </div>
  )
}
