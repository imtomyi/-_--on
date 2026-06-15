import { useEffect, useRef, useState } from 'react'
import styles from './KakaoMap.module.css'

export default function KakaoMap({ course, activeIdx, onMarkerClick }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [mapReady, setMapReady] = useState(false)

  // 지도 초기화
  useEffect(() => {
    if (!window.kakao?.maps || !containerRef.current) return

    const center = new kakao.maps.LatLng(
      course.places[0].lat,
      course.places[0].lng,
    )

    const map = new kakao.maps.Map(containerRef.current, {
      center,
      level: 4,
    })
    mapRef.current = map

    // 히트맵 Polyline
    const path = course.heatmapPath.map(
      (p) => new kakao.maps.LatLng(p.lat, p.lng),
    )
    new kakao.maps.Polyline({
      map,
      path,
      strokeWeight: 5,
      strokeColor: '#E89AA5',
      strokeOpacity: 0.35,
      strokeStyle: 'solid',
    })

    // 장소 마커
    const markers = course.places.map((place, idx) => {
      const isGyebo = place.type === 'start' || place.type === 'end'
      const markerContent = isGyebo
        ? `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(150deg,#E8C44E,#BC8A1E);border:2px solid #FFF3CC;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 12px rgba(150,110,20,0.42);">
              <svg width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 20 C4 20 3 19 3 17.3 L3 10.5 C3 9.2 3.8 8.3 4.7 7.9 L5 4.2 C4.3 3.8 4 3.3 4 2.6 L4 1 L13 1 L13 2.6 C13 3.3 12.7 3.8 12 4.2 L12.3 7.9 C13.2 8.3 14 9.2 14 10.5 L14 17.3 C14 19 13 20 11.5 20 Z" fill="#FFFCF0"/>
                <rect x="4.6" y="11.6" width="7.8" height="5.6" rx="1" fill="#BC8A1E" opacity="0.55"/>
              </svg>
            </div>
            <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:9px solid #BC8A1E;margin-top:-2px;"></div>
          </div>`
        : `<div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
            <div style="width:30px;height:30px;border-radius:50%;background:#FFFCF0;border:2px solid #BA2028;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(70,45,20,0.26);">
              <span style="font-family:'Noto Serif KR',serif;font-size:14px;font-weight:700;color:#2A1A0E;line-height:1;">${idx + 1}</span>
            </div>
            <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid #BA2028;margin-top:-2px;"></div>
          </div>`
      const overlay = new kakao.maps.CustomOverlay({
        position: new kakao.maps.LatLng(place.lat, place.lng),
        content: markerContent,
        yAnchor: 1,
      })
      overlay.setMap(map)

      // 마커 클릭 시 카드 포커스
      overlay.getContent().addEventListener?.('click', () => onMarkerClick?.(idx))

      return overlay
    })
    markersRef.current = markers

    // 코스 전체가 보이도록 bounds 설정
    const bounds = new kakao.maps.LatLngBounds()
    course.places.forEach((p) => bounds.extend(new kakao.maps.LatLng(p.lat, p.lng)))
    map.setBounds(bounds)

    // 타일 로드 완료 시 veil 제거
    kakao.maps.event.addListener(map, 'tilesloaded', () => setMapReady(true))

    return () => {
      markers.forEach((m) => m.setMap(null))
    }
  }, [course])

  // 활성 카드 바뀌면 지도 중심 이동
  useEffect(() => {
    if (!mapRef.current || !course.places[activeIdx]) return
    const { lat, lng } = course.places[activeIdx]
    mapRef.current.panTo(new kakao.maps.LatLng(lat, lng))
  }, [activeIdx, course])

  return (
    <div className={styles.wrap}>
      <div ref={containerRef} className={styles.map} />
      <div className={`${styles.veil} ${mapReady ? styles.veilHidden : ''}`} />
    </div>
  )
}
