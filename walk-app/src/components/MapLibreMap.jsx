import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './MapLibreMap.module.css'

const MAPTILER_KEY = 'QQNAxXPBkSHpRaeYE6gU'
const MAPTILER_STYLE_ID = '019eda5f-2cb2-7750-a547-54399cbe6db9'
const STYLE_URL = `https://api.maptiler.com/maps/${MAPTILER_STYLE_ID}/style.json?key=${MAPTILER_KEY}`

const ROUTE_COLOR = '#4A5580'

/* 지도 메뉴용 드롭 핀 */
function dropPinHTML() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="38" viewBox="0 0 22 38" fill="none">
    <path d="M10.1445 37.6445C14.2867 37.6445 17.6445 36.3014 17.6445 34.6445C17.6445 32.9877 14.2867 31.6445 10.1445 31.6445C6.0024 31.6445 2.64453 32.9877 2.64453 34.6445C2.64453 36.3014 6.0024 37.6445 10.1445 37.6445Z" fill="black" fill-opacity="0.1"/>
    <path d="M10.6445 19.6445C15.6151 19.6445 19.6445 15.6151 19.6445 10.6445C19.6445 5.67397 15.6151 1.64453 10.6445 1.64453C5.67397 1.64453 1.64453 5.67397 1.64453 10.6445C1.64453 15.6151 5.67397 19.6445 10.6445 19.6445Z" fill="white" stroke="#4A5580" stroke-width="3.29"/>
    <path d="M4.64453 18.6445H16.6445L10.6445 25.6445L4.64453 18.6445Z" fill="#4A5580"/>
    <path d="M10.6445 14.6445C12.8537 14.6445 14.6445 12.8537 14.6445 10.6445C14.6445 8.43539 12.8537 6.64453 10.6445 6.64453C8.43539 6.64453 6.64453 8.43539 6.64453 10.6445C6.64453 12.8537 8.43539 14.6445 10.6445 14.6445Z" fill="#4A5580"/>
  </svg>`
}

/* 거점 마커 HTML — isGyebo(출발·도착): 빨간 원, 중간 거점: 네이비 원 */
function markerHTML(isGyebo, idx) {
  if (isGyebo) {
    return `<div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center;">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" style="position:absolute;inset:0;">
        <path d="M10.75 20.75C16.2728 20.75 20.75 16.2728 20.75 10.75C20.75 5.22715 16.2728 0.75 10.75 0.75C5.22715 0.75 0.75 5.22715 0.75 10.75C0.75 16.2728 5.22715 20.75 10.75 20.75Z" fill="#C04830" stroke="white" stroke-width="1.5"/>
      </svg>
      <span style="position:relative;font-family:'Inter',sans-serif;font-size:10px;font-weight:700;color:#fff;line-height:1;">${idx + 1}</span>
    </div>`
  }
  return `<div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style="position:absolute;inset:0;">
      <path d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23Z" fill="#4A5580" stroke="white" stroke-width="2"/>
    </svg>
    <span style="position:relative;font-family:'Inter',sans-serif;font-size:10px;font-weight:700;color:#fff;line-height:1;">${idx + 1}</span>
  </div>`
}

// 두 좌표 사이 거리 (m)
function haversine(a, b) {
  const R = 6371000
  const φ1 = a.lat * Math.PI / 180, φ2 = b.lat * Math.PI / 180
  const dφ = (b.lat - a.lat) * Math.PI / 180
  const dλ = (b.lng - a.lng) * Math.PI / 180
  const s = Math.sin(dφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(dλ/2)**2
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1-s))
}

// 경로의 누적 거리 배열 생성
function buildPathDists(path) {
  const d = [0]
  for (let i = 1; i < path.length; i++) d.push(d[i-1] + haversine(path[i-1], path[i]))
  return d
}

function applyBrandColors(map) {
  // Aquarelle 스타일 그대로 사용 — 색상 오버라이드 없음
}

function addRouteLayers(map, course) {
  if (!course.heatmapPath || course.heatmapPath.length < 2) return
  if (map.getSource('route')) return

  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: course.heatmapPath.map(p => [p.lng, p.lat]),
      },
    },
  })

  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route',
    paint: {
      'line-color': ROUTE_COLOR,
      'line-width': ['interpolate', ['linear'], ['zoom'], 12, 1.5, 15, 2.5, 18, 4],
      'line-opacity': 0.70,
    },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
  })
}

export default function MapLibreMap({ course, activeIdx, onMarkerClick, sheetHeight = 52, pinStyle = 'circle', initZoom = null }) {
  const containerRef   = useRef(null)
  const mapRef         = useRef(null)
  const markersRef     = useRef([])
  const userMarkerRef  = useRef(null)
  const sheetHeightRef = useRef(sheetHeight)
  const [mapReady, setMapReady]   = useState(false)
  const [userPos, setUserPos]     = useState(null)
  const [locating, setLocating]   = useState(false)

  // sheetHeight 최신값을 ref에 동기화 (easeTo 클로저에서 stale 방지)
  useEffect(() => { sheetHeightRef.current = sheetHeight }, [sheetHeight])

  // ── 경로 따라 일정 속도 이동 데모 (TODO: 실 GPS로 교체) ───────
  useEffect(() => {
    const path = course.heatmapPath
    if (!path || path.length < 2) return

    const dists    = buildPathDists(path)
    const totalDist = dists[dists.length - 1]   // 총 거리(m)
    const LOOP_MS  = 40000                        // 40초에 전체 순회

    let startTime = null
    let rafId

    const tick = (ts) => {
      if (!startTime) startTime = ts

      const elapsed    = (ts - startTime) % LOOP_MS
      const targetDist = (elapsed / LOOP_MS) * totalDist

      // 이분탐색: targetDist가 속하는 세그먼트 찾기
      let lo = 0, hi = path.length - 2
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1
        if (dists[mid] <= targetDist) lo = mid; else hi = mid - 1
      }

      const segLen = dists[lo + 1] - dists[lo]
      const frac   = segLen > 0 ? (targetDist - dists[lo]) / segLen : 0
      const a = path[lo], b = path[lo + 1]

      setUserPos({
        lat: a.lat + (b.lat - a.lat) * frac,
        lng: a.lng + (b.lng - a.lng) * frac,
      })

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [course])

  // ── 현재 위치 마커 생성 / 갱신 ────────────────────────────────
  useEffect(() => {
    if (!mapReady || !mapRef.current || !userPos) return
    if (userMarkerRef.current) {
      userMarkerRef.current.setLngLat([userPos.lng, userPos.lat])
    } else {
      const el = document.createElement('div')
      el.className = styles.userDot
      userMarkerRef.current = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([userPos.lng, userPos.lat])
        .addTo(mapRef.current)
    }
  }, [mapReady, userPos])

  // ── 지도 초기화 ────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: [course.places[0].lng, course.places[0].lat],
      zoom: 15,
      attributionControl: false,
    })

    mapRef.current = map

    map.on('load', () => {
      addRouteLayers(map, course)
      applyBrandColors(map)

      if (initZoom !== null) {
        map.setCenter([course.places[0].lng, course.places[0].lat])
        map.setZoom(initZoom)
      } else {
        const bounds = new maplibregl.LngLatBounds()
        course.places.forEach(p => bounds.extend([p.lng, p.lat]))
        map.fitBounds(bounds, {
          padding: { top: 130, bottom: window.innerHeight * 0.52 + 20, left: 60, right: 60 },
          duration: 0,
          maxZoom: 16,
        })
      }

      setMapReady(true)
    })

    // ── 코스 마커 ─────────────────────────────────────────────────
    markersRef.current = course.places.map((place, idx) => {
      const isGyebo = place.type === 'start' || place.type === 'end'
      const el = document.createElement('div')
      el.style.cursor = 'pointer'
      el.style.userSelect = 'none'
      el.innerHTML = pinStyle === 'drop' ? dropPinHTML() : markerHTML(isGyebo, idx)
      el.addEventListener('click', () => onMarkerClick?.(idx))

      return new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([place.lng, place.lat])
        .addTo(map)
    })

    return () => {
      markersRef.current.forEach(m => m.remove())
      userMarkerRef.current = null
      map.remove()
    }
  }, [course])

  // ── 활성 장소로 지도 이동 (시트 높이 보정) ────────────────────
  useEffect(() => {
    const p = course.places[activeIdx]
    if (!mapRef.current || !p) return
    const offsetY = Math.round(window.innerHeight * sheetHeightRef.current / 200)
    mapRef.current.easeTo({
      center: [p.lng, p.lat],
      duration: 400,
      offset: [0, -offsetY],
    })
  }, [activeIdx, course])

  // ── 현재 위치로 이동 ──────────────────────────────────────────
  const panToUser = () => {
    if (!mapRef.current || !userPos) return
    setLocating(true)
    setTimeout(() => setLocating(false), 800)
    const offsetY = Math.round(window.innerHeight * sheetHeightRef.current / 200)
    mapRef.current.easeTo({
      center: [userPos.lng, userPos.lat],
      zoom: Math.max(mapRef.current.getZoom(), 16),
      duration: 600,
      offset: [0, -offsetY],
    })
  }

  return (
    <div className={styles.wrap}>
      <div ref={containerRef} className={styles.map} />
      <div className={`${styles.veil} ${mapReady ? styles.veilHidden : ''}`} />

      {/* 현재 위치 버튼 */}
      <button
        className={`${styles.locateBtn} ${!userPos ? styles.locateBtnNoGps : ''} ${locating ? styles.locateBtnActive : ''}`}
        style={{ bottom: `calc(${sheetHeight}% + 16px)` }}
        onClick={panToUser}
        aria-label="현재 위치로"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <g clipPath="url(#clip0_832_93)">
            <path d="M7.99967 14.6673C11.6816 14.6673 14.6663 11.6825 14.6663 8.00065C14.6663 4.31875 11.6816 1.33398 7.99967 1.33398C4.31778 1.33398 1.33301 4.31875 1.33301 8.00065C1.33301 11.6825 4.31778 14.6673 7.99967 14.6673Z" stroke="#4A5580" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.6667 8H12" stroke="#4A5580" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3.99967 8H1.33301" stroke="#4A5580" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 4.00065V1.33398" stroke="#4A5580" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14.6667V12" stroke="#4A5580" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_832_93">
              <rect width="16" height="16" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </button>
    </div>
  )
}
