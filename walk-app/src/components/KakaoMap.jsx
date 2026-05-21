import { useEffect, useRef } from 'react'
import styles from './KakaoMap.module.css'

export default function KakaoMap({ course, activeIdx, onMarkerClick }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

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
      const markerContent = `
        <div style="
          width:32px; height:32px;
          background:${isGyebo ? '#C4932A' : '#FFFCF5'};
          border:2px solid ${isGyebo ? '#C4932A' : '#DDD0B8'};
          border-radius:50%;
          display:flex; align-items:center; justify-content:center;
          font-size:13px; font-weight:800;
          color:${isGyebo ? '#FFFCF5' : '#1E140A'};
          box-shadow:0 2px 8px rgba(30,20,10,0.18);
          cursor:pointer;
        ">${isGyebo ? '🍶' : idx + 1}</div>
      `
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

  return <div ref={containerRef} className={styles.map} />
}
