import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import styles from './MapLibreMap.module.css'

const MAPTILER_KEY = 'QQNAxXPBkSHpRaeYE6gU'

export const MAP_STYLES = {
  aquarelle:       { label: '수채화',     url: `https://api.maptiler.com/maps/aquarelle/style.json?key=${MAPTILER_KEY}` },
  'aquarelle-vivid': { label: '수채화 비비드', url: `https://api.maptiler.com/maps/aquarelle-vivid/style.json?key=${MAPTILER_KEY}` },
  outdoor:         { label: '아웃도어',   url: `https://api.maptiler.com/maps/outdoor-v2/style.json?key=${MAPTILER_KEY}` },
  pastel:          { label: '파스텔',     url: `https://api.maptiler.com/maps/pastel/style.json?key=${MAPTILER_KEY}` },
}

// 쪽빛(藍色) — 전통 한국 쪽물 인디고
const ROUTE_COLOR = '#1B3F7A'

function addRoute(map, course) {
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
  // 가는 연결선 — 줌에 따라 두께 보간
  map.addLayer({
    id: 'route-line',
    type: 'line',
    source: 'route',
    paint: {
      'line-color': ROUTE_COLOR,
      'line-width': ['interpolate', ['linear'], ['zoom'],
        12, 0.6,   // 축소: 거의 안 보일 정도로 얇게
        15, 1.5,   // 기본 줌
        18, 3.0,   // 확대: 조금 두껍게
      ],
      'line-opacity': 0.28,
    },
    layout: { 'line-join': 'round', 'line-cap': 'round' },
  })
  // 디딤돌 점패턴 — 줌에 따라 점 크기 보간
  map.addLayer({
    id: 'route-dots',
    type: 'line',
    source: 'route',
    paint: {
      'line-color': ROUTE_COLOR,
      'line-width': ['interpolate', ['linear'], ['zoom'],
        12, 2.0,   // 축소: 작은 점
        15, 5.0,   // 기본 줌
        18, 9.0,   // 확대: 큰 점
      ],
      'line-opacity': ['interpolate', ['linear'], ['zoom'],
        12, 0.45,  // 축소: 약간 흐리게
        15, 0.65,  // 기본
        18, 0.75,  // 확대: 선명하게
      ],
      'line-dasharray': [0.001, 2.2],
    },
    layout: { 'line-cap': 'round' },
  })
}

export default function MapLibreMap({ course, activeIdx, onMarkerClick, mapStyle = 'outdoor' }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const markersRef   = useRef([])

  // ── 지도 초기화 ────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    const styleUrl = MAP_STYLES[mapStyle]?.url ?? MAP_STYLES.outdoor.url
    const center   = [course.places[0].lng, course.places[0].lat]

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: styleUrl,
      center,
      zoom: 15,
      attributionControl: false,
    })

    mapRef.current = map

    map.on('load', () => {
      addRoute(map, course)

      // ── 지도 색상 커스텀 ──────────────────
      map.setPaintProperty('Background',           'background-color', '#F8F5EE') // 배경
      map.setPaintProperty('Land',                 'fill-color',       '#F8F5EE') // 땅
      map.setPaintProperty('Residential pattern',  'fill-color',       '#EEE8D8') // 주거지
      map.setPaintProperty('Building',             'fill-color',       '#E0D8C4') // 건물
      map.setPaintProperty('Road network',         'line-color',       '#FFFFFF') // 도로
      map.setPaintProperty('Path',                 'line-color',       '#F5F0E8') // 골목
      map.setPaintProperty('Path minor',           'line-color',       '#F5F0E8') // 좁은 골목
      map.setPaintProperty('Forest',               'fill-color',       '#6B9E80') // 숲
      map.setPaintProperty('Grass',                'fill-color',       '#8BB89A') // 잔디
      map.setPaintProperty('Wood',                 'fill-color',       '#6B9E80') // 나무
      map.setPaintProperty('Water pattern',        'fill-color',       '#A8C8D8') // 물
      map.setPaintProperty('River',                'line-color',       '#90B8CC') // 강
      // ──────────────────────────────────────


      const bounds = new maplibregl.LngLatBounds()
      course.places.forEach(p => bounds.extend([p.lng, p.lat]))
      map.fitBounds(bounds, { padding: 60, duration: 0, maxZoom: 16 })
    })

    // ── 마커 ─────────────────────────────────────────────────────
    markersRef.current = course.places.map((place, idx) => {
      const isGyebo = place.type === 'start' || place.type === 'end'
      const el = document.createElement('div')
      Object.assign(el.style, {
        width: '34px', height: '34px',
        background: isGyebo ? '#C4932A' : '#FFFFFF',
        border: `2.5px solid ${isGyebo ? '#A07010' : '#D8CEB8'}`,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isGyebo ? '16px' : '13px',
        fontWeight: '800',
        color: isGyebo ? '#FFFCF5' : '#1E140A',
        fontFamily: 'Pretendard, sans-serif',
        boxShadow: '0 2px 10px rgba(30,20,10,0.25)',
        cursor: 'pointer',
        userSelect: 'none',
      })
      el.textContent = isGyebo ? '🍶' : String(idx + 1)
      el.addEventListener('click', () => onMarkerClick?.(idx))

      return new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat([place.lng, place.lat])
        .addTo(map)
    })

    return () => {
      markersRef.current.forEach(m => m.remove())
      map.remove()
    }
  }, [course])

  // ── 스타일 전환 ───────────────────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return
    const styleUrl = MAP_STYLES[mapStyle]?.url ?? MAP_STYLES.outdoor.url
    map.setStyle(styleUrl)
    map.once('style.load', () => addRoute(map, course))
  }, [mapStyle])

  // ── 활성 장소 이동 ────────────────────────────────────────────
  useEffect(() => {
    const p = course.places[activeIdx]
    if (!mapRef.current || !p) return
    mapRef.current.easeTo({ center: [p.lng, p.lat], duration: 400 })
  }, [activeIdx, course])

  return <div ref={containerRef} className={styles.map} />
}
