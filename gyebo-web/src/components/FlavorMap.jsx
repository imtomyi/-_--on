/**
 * FlavorMap — "맛의 지형도, 막걸리의 뿌리를 찾아서"
 *
 * View 1: 맛의 4분면 계보도 (글래스 버블 차트, ABV→크기)
 * Click → 시네마틱 줌: 매트릭스 페이드아웃 + 한반도 맵 선명·줌인(Expo.inOut)
 *         + 물방울 파동 + 병 등장
 * View 2: 지역 상세 글래스 패널 / 뒤로가기 → 리버스 줌아웃
 *
 * d3/Mapbox 대신 이미지 + GSAP transform 으로 모바일 60fps 시네마틱 모션.
 */

import { useState, useRef, useMemo, useLayoutEffect } from 'react'
import { makgeolliList } from '../data/makgeolli'
import gsap from 'gsap'
import styles from './FlavorMap.module.css'

const LEVEL_KO = { intro: '입문', mid: '중급', deep: '심화' }

/* 한반도 이미지(korea-map.png, 남북 전체 실루엣) '이미지 박스' 기준 지역 좌표 % (좌→우, 상→하)
   호미곶(36.0°N,129.57°E)·해남 땅끝(34.17°N,126.46°E) 두 실측 기준점으로 위도·경도 선형 보정 후 산출 */
const REGION_POS = {
  '경기 양평': { x: 45, y: 56, label: '경기 양평' },   // 지평면 — 37.49°N 127.62°E
  '경북 청송': { x: 63, y: 67, label: '경북 청송' },   // 36.44°N 129.06°E
  '충남 공주': { x: 42, y: 66, label: '충남 공주' },   // 사곡양조원 — 36.53°N 127.06°E
  '전남 고흥': { x: 44, y: 84, label: '전남 고흥' },   // 풍양면 — 34.56°N 127.27°E
  '경북 문경': { x: 53, y: 65, label: '경북 문경' },   // 36.59°N 128.19°E
  '충북 단양': { x: 53, y: 57, label: '충북 단양' },   // 소백산 인근(충북 NE) — 36.98°N 128.37°E
  '충남 서천': { x: 33, y: 71, label: '충남 서천' },   // 한산면(한산소곡주/앉은뱅이술) — 36.02°N 126.62°E
  '전남 해남': { x: 33, y: 84, label: '전남 해남' },   // 34.57°N 126.60°E
}
const posOf = item => REGION_POS[item.region] ?? { x: 50, y: 64, label: item.region }

/* 맛 4분면 노드 위치 (%) — X: 달다↔드라이(산미−단맛) / Y: 가볍다↔묵직(바디) */
function nodePct(item) {
  const { sweetness, acidity, body } = item.metrics
  const dryness = acidity - sweetness          // -3..3 (클수록 드라이)
  const x = 12 + ((dryness + 4) / 8) * 76
  const y = 12 + ((body - 2) / 3) * 76
  return { x, y }
}
/* 도수(abv, 미상=6) → 노드 지름(px): 도수 높을수록 큼 */
const sizeOf = item => {
  const a = item.metrics.abv ?? 6
  return 30 + ((a - 6) / 3) * 18   // 6도 30 ~ 9도 48
}

/* 도수 → 주황·갈색 단일 계열 색 (도수 높을수록 짙어짐) */
function nodeColor(item) {
  const a = item.metrics.abv ?? 6
  const t = Math.max(0, Math.min(1, (a - 6) / 3))
  const L = [0xF0, 0xC1, 0x86], D = [0x7A, 0x43, 0x1C]   // 연한 주황 → 짙은 갈색
  const m = i => Math.round(L[i] + (D[i] - L[i]) * t)
  return `rgb(${m(0)}, ${m(1)}, ${m(2)})`
}

/* 노드 배치 + 충돌 완화(겹침 방지) — 명목 매트릭스 px 기준 relaxation */
function layoutNodes(list, W = 327, H = 580) {
  const ns = list.map(item => {
    const { x, y } = nodePct(item)
    return { px: (x / 100) * W, py: (y / 100) * H, size: sizeOf(item) }
  })
  for (let it = 0; it < 140; it++) {
    for (let i = 0; i < ns.length; i++) {
      for (let j = i + 1; j < ns.length; j++) {
        const a = ns[i], b = ns[j]
        let dx = b.px - a.px, dy = b.py - a.py
        let d = Math.hypot(dx, dy)
        if (d < 0.01) {                       // 동일 위치 → 결정적으로 분리
          dx = Math.cos(i * 2.39); dy = Math.sin(i * 2.39); d = 1
        }
        const min = (a.size + b.size) / 2 + 9   // 9px 여유
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
  const [active, setActive]   = useState(null)   // 선택된 막걸리 (지역 뷰)
  const layout = useMemo(() => layoutNodes(makgeolliList), [])  // 겹침 완화된 노드 위치

  const busy     = useRef(false)
  const pageRef  = useRef(null)
  const mapRef   = useRef(null)
  const matrixRef = useRef(null)
  const stageRef = useRef(null)   // 병/파동 중앙 스테이지
  const rippleRef = useRef(null)
  const bottleRef = useRef(null)
  const panelRef = useRef(null)

  /* ── 매트릭스 등장 ── */
  useLayoutEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !matrixRef.current) return
    const nodes = matrixRef.current.querySelectorAll(`.${styles.node}`)
    gsap.fromTo(nodes, { opacity: 0, scale: 0.4 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.05, ease: 'back.out(1.7)', delay: 0.1 })
  }, [])

  /* ── 시네마틱 줌인 (지역으로) ── */
  function openRegion(item) {
    if (busy.current) return
    busy.current = true
    setActive(item)

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const p = posOf(item)

    // 줌 변환 계산 (반응형) — region 점을 뷰포트 중앙으로
    // 좌표(p)는 '지도 이미지 박스' 기준 % → 실제 렌더된 이미지 위치로 환산
    const pageRect = pageRef.current.getBoundingClientRect()
    const mapRect  = mapRef.current.getBoundingClientRect()
    const imgEl    = mapRef.current.querySelector(`.${styles.mapImg}`)
    const imgRect  = (imgEl || mapRef.current).getBoundingClientRect()
    const regionX  = imgRect.left + (p.x / 100) * imgRect.width
    const regionY  = imgRect.top  + (p.y / 100) * imgRect.height
    // transform-origin 은 컨테이너(.map) 기준 % 로 변환
    const ox = ((regionX - mapRect.left) / mapRect.width)  * 100
    const oy = ((regionY - mapRect.top)  / mapRect.height) * 100
    const origin = `${ox}% ${oy}%`
    const dx = (pageRect.left + pageRect.width  / 2) - regionX
    const dy = (pageRect.top  + pageRect.height * 0.42) - regionY
    const scale = 2.7

    if (reduce) {
      gsap.set(matrixRef.current, { opacity: 0 })
      gsap.set(mapRef.current, { scale, x: dx, y: dy, transformOrigin: origin, filter: 'blur(0px)', opacity: 0.5 })
      revealStage(true)
      busy.current = false
      return
    }

    const tl = gsap.timeline({ onComplete: () => { busy.current = false } })

    /* 매트릭스 후퇴 */
    tl.to(matrixRef.current, { opacity: 0, scale: 0.9, duration: 0.5, ease: 'power2.in' }, 0)

    /* 맵 선명 + 시네마틱 줌 (Expo.inOut) */
    tl.to(mapRef.current, {
      scale, x: dx, y: dy,
      transformOrigin: origin,
      filter: 'blur(0px)',
      duration: 1.3, ease: 'expo.inOut',
    }, 0.1)
    tl.to(mapRef.current.querySelector(`.${styles.mapImg}`), { opacity: 0.62, duration: 0.8, ease: 'power1.out' }, 0.1)

    /* 물방울 파동 — 도착 직전 */
    tl.fromTo(rippleRef.current,
      { scale: 0, opacity: 0.65 },
      { scale: 3.2, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.95)

    /* 병 등장 (하늘에서 떨어져 안착) */
    tl.fromTo(bottleRef.current,
      { y: -120, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)' }, 1.05)

    /* 패널 슬라이드 인 */
    tl.fromTo(panelRef.current,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, 1.25)
  }

  function revealStage() {
    gsap.set([rippleRef.current], { opacity: 0 })
    gsap.set(bottleRef.current, { y: 0, opacity: 1, scale: 1 })
    gsap.set(panelRef.current, { yPercent: 0, opacity: 1 })
  }

  /* ── 줌아웃 (전체 지형도로) ── */
  function closeRegion() {
    if (busy.current) return
    busy.current = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const finish = () => { setActive(null); busy.current = false }

    if (reduce) {
      gsap.set(mapRef.current, { scale: 1, x: 0, y: 0, filter: 'blur(1.5px)' })
      gsap.set(matrixRef.current, { opacity: 1, scale: 1 })
      finish(); return
    }

    const tl = gsap.timeline({ onComplete: finish })
    tl.to(panelRef.current, { yPercent: 110, opacity: 0, duration: 0.4, ease: 'power2.in' }, 0)
    tl.to(bottleRef.current, { y: -60, opacity: 0, scale: 0.85, duration: 0.4, ease: 'power2.in' }, 0)
    tl.to(mapRef.current, {
      scale: 1, x: 0, y: 0,
      filter: 'blur(1.5px)',
      duration: 1.0, ease: 'expo.inOut',
    }, 0.18)
    tl.to(mapRef.current.querySelector(`.${styles.mapImg}`), { opacity: 0.24, duration: 0.6 }, 0.3)
    tl.to(matrixRef.current, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' }, 0.7)
  }

  const inRegion = active != null
  const ap = active ? posOf(active) : null

  return (
    <div ref={pageRef} className={styles.page} data-region={inRegion ? 'true' : 'false'}>

      {/* ── 한반도 맵 레이어 (배경 ↔ 줌) ── */}
      <div ref={mapRef} className={styles.map} aria-hidden="true">
        <img src="/korea-map.png" alt="" className={styles.mapImg} />
      </div>

      {/* ── 헤더 ── */}
      <header className={styles.header}>
        {inRegion ? (
          <button className={styles.backBtn} onClick={closeRegion}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            전체 지형도
          </button>
        ) : (
          <button className={styles.backBtn} onClick={onBack}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            목록
          </button>
        )}
        <span className={styles.title}>{inRegion ? ap.label : '맛의 지형도'}</span>
        <span className={styles.titleSub}>{inRegion ? '' : 'TASTE MATRIX'}</span>
      </header>

      {/* ── 맛 4분면 매트릭스 ── */}
      <div ref={matrixRef} className={styles.matrix} style={{ pointerEvents: inRegion ? 'none' : 'auto' }}>
        {/* 십자 좌표 */}
        <div className={styles.axisV} />
        <div className={styles.axisH} />
        <span className={`${styles.axisLabel} ${styles.axTop}`}>가볍다</span>
        <span className={`${styles.axisLabel} ${styles.axBottom}`}>묵직하다</span>
        <span className={`${styles.axisLabel} ${styles.axLeft}`}>달다</span>
        <span className={`${styles.axisLabel} ${styles.axRight}`}>드라이</span>

        {/* 노드 */}
        {makgeolliList.map((item, idx) => {
          const { x, y, size } = layout[idx]
          return (
            <button
              key={item.id}
              className={styles.node}
              style={{ left: `${x}%`, top: `${y}%`, '--size': `${size}px`, '--nc': nodeColor(item) }}
              onClick={() => openRegion(item)}
              aria-label={`${item.name} ${LEVEL_KO[item.level]}`}
            >
              <span className={styles.nodeBubble} />
              <span className={styles.nodeNum}>{idx + 1}</span>
            </button>
          )
        })}
      </div>

      {/* ── 중앙 스테이지: 파동 + 병 (지역 뷰) ── */}
      <div ref={stageRef} className={styles.stage} style={{ pointerEvents: 'none' }}>
        <div ref={rippleRef} className={styles.ripple} style={{ opacity: 0 }} />
        <div ref={bottleRef} className={styles.bottle} style={{ opacity: 0 }}>
          {active && <img className={styles.bottleImg} src={active.image} alt="" />}
        </div>
      </div>

      {/* ── 지역 상세 글래스 패널 ── */}
      <aside ref={panelRef} className={styles.panel} style={{ opacity: 0, pointerEvents: inRegion ? 'auto' : 'none' }}>
        {active && (
          <>
            <div className={styles.panelHead}>
              <span className={`${styles.panelLevel} ${styles[`lv_${active.level}`]}`}>{LEVEL_KO[active.level]}</span>
              <span className={styles.panelRegion}>{ap.label}</span>
            </div>
            <h2 className={styles.panelName}>{active.name}</h2>
            <div className={styles.panelSpecRow}>
              <span className={styles.panelChip}>특산물 · {active.ingredient}</span>
              <span className={styles.panelChip}>{active.brewery}</span>
              {active.metrics.abv != null && (
                <span className={styles.panelChip}>{active.metrics.abv}도</span>
              )}
            </div>
            <p className={styles.panelStory}>{active.story}</p>
            <div className={styles.panelBars}>
              <Bar label="단맛" v={active.metrics.sweetness} />
              <Bar label="산미" v={active.metrics.acidity} />
              <Bar label="바디" v={active.metrics.body} />
            </div>
            <div className={styles.panelTags}>
              {active.tags.map(t => <span key={t} className={styles.panelTag}>{t}</span>)}
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
