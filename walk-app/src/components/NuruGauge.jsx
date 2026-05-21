import { useState, useEffect } from 'react'
import { NURUK_STAGES } from '../data/courses'
import styles from './NuruGauge.module.css'

// GPS 거리 측정 (두 좌표 간 직선거리 km)
function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function NuruGauge({ totalDistance }) {
  const [traveled, setTraveled] = useState(0)
  const [lastPos, setLastPos] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLastPos((prev) => {
          if (prev) {
            const dist = haversine(prev.lat, prev.lng, latitude, longitude)
            setTraveled((t) => Math.min(t + dist, totalDistance))
          }
          return { lat: latitude, lng: longitude }
        })
      },
      null,
      { enableHighAccuracy: true, maximumAge: 5000 },
    )
    return () => navigator.geolocation.clearWatch(id)
  }, [totalDistance])

  const pct = Math.min((traveled / totalDistance) * 100, 100)
  const stageIdx = NURUK_STAGES.findLastIndex((s) => pct >= s.threshold)
  const stage = NURUK_STAGES[stageIdx]

  return (
    <div className={styles.gauge}>
      <span className={styles.emoji}>{stage.emoji}</span>
      <div className={styles.info}>
        <span className={styles.label}>{stage.label}</span>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className={styles.dist}>{(traveled * 1000).toFixed(0)}m</span>
    </div>
  )
}
