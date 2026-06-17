import { useState, useEffect } from 'react'
import MapSvg from './MapSvg'
import BottomNav from './BottomNav'
import styles from './WalkScreen.module.css'

export default function WalkScreen({ course, onComplete, onTab }) {
  const [elapsed, setElapsed] = useState(0)
  const [activeIdx, setActiveIdx] = useState(1)

  useEffect(() => {
    const id = setInterval(() => setElapsed(t => t + 1), 60000)
    return () => clearInterval(id)
  }, [])

  const nextPlace = course.places[activeIdx] ?? course.places[course.places.length - 1]
  const prevPlace = course.places[activeIdx - 1]
  const walkMinDiff = prevPlace ? nextPlace.walkMin - prevPlace.walkMin : nextPlace.walkMin
  const distM = Math.round(walkMinDiff * 70)
  const progress = Math.round((activeIdx / (course.places.length - 1)) * 100)

  const handleNext = () => {
    if (activeIdx < course.places.length - 1) setActiveIdx(i => i + 1)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>

        {/* ── 상태 바 ─────────────────────────── */}
        <div className={styles.statusBar}>
          <span className={styles.statusDot} />
          <span className={styles.statusText}>
            산책 중{elapsed > 0 ? ` · ${elapsed}분째` : ''}
          </span>
        </div>

        {/* ── 지도 ────────────────────────────── */}
        <div className={styles.mapArea}>
          <MapSvg
            course={course}
            activeIdx={activeIdx}
            onMarkerClick={setActiveIdx}
          />
          <div className={styles.mapPill}>실시간 지도</div>
        </div>

        {/* ── 다음 거점 카드 ─────────────────── */}
        <div className={styles.waypointCard}>
          <div className={styles.waypointHeader}>
            <span className={styles.waypointLabel}>다음 거점</span>
            <button className={styles.arrowBtn} onClick={handleNext}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M5 15L15 5M15 5H7M15 5v8"/>
              </svg>
            </button>
          </div>
          <p className={styles.waypointName}>{nextPlace.ko.name}</p>
          <p className={styles.waypointDist}>약 {walkMinDiff}분 · {distM}m 직진</p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── 장소 정보 카드 ──────────────────── */}
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18">
              <rect x="2" y="7" width="16" height="11" rx="1.5"/>
              <path d="M6 7V5a4 4 0 018 0v2"/>
              <path d="M8 12h4"/>
            </svg>
          </div>
          <div className={styles.infoText}>
            <span className={styles.infoName}>{nextPlace.ko.name}</span>
            <span className={styles.infoHours}>
              <span className={styles.openDot}/>
              현재 영업 중 · 09:00–18:00
            </span>
          </div>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className={styles.chevron}>
            <path d="M7 4l6 6-6 6"/>
          </svg>
        </div>

        {/* ── 컨트롤 버튼 ─────────────────────── */}
        <div className={styles.controlRow}>
          <button className={styles.controlBtn}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <rect x="5" y="4" width="3.5" height="12" rx="1"/>
              <rect x="11.5" y="4" width="3.5" height="12" rx="1"/>
            </svg>
            일시정지
          </button>
          <button className={styles.controlBtn}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" width="16" height="16">
              <rect x="2" y="2" width="16" height="16" rx="2"/>
              <path d="M2 8h16M8 8v10"/>
            </svg>
            전체 지도
          </button>
        </div>

        {/* ── 완료 버튼 ────────────────────────── */}
        <button className={styles.completeBtn} onClick={onComplete}>
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" width="15" height="15">
            <path d="M4 3v14M4 3l12 5-12 5"/>
          </svg>
          산책 완료하기
        </button>

        <div className={styles.navSpacer} />
      </div>

      <BottomNav active="course" onTab={onTab} />
    </div>
  )
}
