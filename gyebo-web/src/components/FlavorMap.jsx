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

import { useState, useRef, useLayoutEffect } from 'react'
import { makgeolliList } from '../data/makgeolli'
import gsap from 'gsap'
import styles from './FlavorMap.module.css'

const LEVEL_KO = { intro: '입문', mid: '중급', deep: '심화' }

/* 한반도 이미지(korea-map.jpg) 기준 지역 좌표 % (좌→우, 상→하) */
const REGION_POS = {
  '경기 양평':   { x: 47, y: 51, label: '경기 양평' },
  '경북 청송':   { x: 64, y: 63, label: '경북 청송' },
  '충남 공주':   { x: 42, y: 59, label: '충남 공주' },
  '전남 고흥':   { x: 49, y: 80, label: '전남 고흥' },
  '경북 문경':   { x: 57, y: 59, label: '경북 문경' },
  '충북 단양':   { x: 54, y: 57, label: '충북 단양' },
  '전남 해남':   { x: 42, y: 83, label: '전남 해남' },
  '미확인':      { x: 51, y: 64, label: '한반도 어딘가' },
  '전통 토종밀': { x: 56, y: 73, label: '경남 진주' },
}
const posOf = item => REGION_POS[item.region] ?? { x: 50, y: 64, label: item.region }

/* 맛 4분면 노드 위치 (%) — X: 달다↔드라이 / Y: 가볍다↔묵직 */
function nodePct(item) {
  const x = 12 + ((item.flavor.sweet - item.flavor.dry + 3) / 6) * 76
  const y = 12 + ((item.flavor.body - 2) / 3) * 76
  return { x, y }
}
/* ABV → 노드 지름(px) */
const sizeOf = item => 42 + ((item.flavor.abv - 6) / 3) * 34   // 42 ~ 76

/* 지역 병 SVG */
function RootBottle({ color }) {
  return (
    <svg viewBox="0 0 80 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.bottleSvg} aria-hidden="true">
      <defs>
        <linearGradient id="fm-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.5"/>
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.12"/>
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.34"/>
        </linearGradient>
      </defs>
      <path d="M27 196 C16 196 9 188 9 178 L9 96 C9 86 15 79 21 76 L22 50
               C16 47 14 40 14 33 L14 14 L66 14 L66 33 C66 40 64 47 58 50
               L59 77 C65 80 71 87 71 97 L71 178 C71 188 64 196 53 196 Z"
        fill="url(#fm-glass)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.4"/>
      <path d="M13 132 L67 132 L66 176 C65 187 58 194 49 194 L31 194
               C22 194 15 187 14 176 Z"
        fill={color} opacity="0.92"/>
      <rect x="24" y="6" width="32" height="9" rx="3" fill="rgba(0,0,0,0.3)"/>
      <rect x="18" y="92" width="44" height="40" rx="3" fill="rgba(255,255,255,0.65)" stroke="rgba(0,0,0,0.1)"/>
      <text x="40" y="110" textAnchor="middle" fontFamily="serif" fontSize="13" fill="#3a2d20">계보</text>
      <line x1="26" y1="120" x2="54" y2="120" stroke="rgba(200,168,24,0.7)" strokeWidth="1"/>
    </svg>
  )
}

export default function FlavorMap({ onBack }) {
  const [active, setActive]   = useState(null)   // 선택된 막걸리 (지역 뷰)

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
    const pageRect = pageRef.current.getBoundingClientRect()
    const mapRect  = mapRef.current.getBoundingClientRect()
    const regionX  = mapRect.left + (p.x / 100) * mapRect.width
    const regionY  = mapRect.top  + (p.y / 100) * mapRect.height
    const dx = (pageRect.left + pageRect.width  / 2) - regionX
    const dy = (pageRect.top  + pageRect.height * 0.42) - regionY
    const scale = 2.7

    if (reduce) {
      gsap.set(matrixRef.current, { opacity: 0 })
      gsap.set(mapRef.current, { scale, x: dx, y: dy, transformOrigin: `${p.x}% ${p.y}%`, filter: 'blur(0px)', opacity: 0.5 })
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
      transformOrigin: `${p.x}% ${p.y}%`,
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
        <img src="/korea-map.jpg" alt="" className={styles.mapImg} />
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
          const { x, y } = nodePct(item)
          const size = sizeOf(item)
          return (
            <button
              key={item.id}
              className={styles.node}
              style={{ left: `${x}%`, top: `${y}%`, '--size': `${size}px` }}
              onClick={() => openRegion(item)}
              aria-label={`${item.name} ${item.flavor.abv}도`}
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
          {active && <RootBottle color={active.color} />}
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
              <span className={styles.panelChip}>{active.flavor.abv}도</span>
            </div>
            <p className={styles.panelStory}>{active.story}</p>
            <div className={styles.panelBars}>
              <Bar label="단맛"   v={active.flavor.sweet} />
              <Bar label="드라이" v={active.flavor.dry} />
              <Bar label="바디"   v={active.flavor.body} />
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
