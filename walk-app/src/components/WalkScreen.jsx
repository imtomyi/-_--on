import { useState, useEffect } from 'react'
import MapLibreMap from './MapLibreMap'
import BottomNav from './BottomNav'
import styles from './WalkScreen.module.css'

export default function WalkScreen({ course, onComplete, onTab }) {
  const [elapsed, setElapsed] = useState(0)
  const [activeIdx, setActiveIdx] = useState(2)

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
          <MapLibreMap
            course={course}
            activeIdx={activeIdx}
            onMarkerClick={setActiveIdx}
            sheetHeight={0}
          />
          <div className={styles.mapPill}>실시간 지도</div>
        </div>

        {/* ── 다음 거점 카드 ─────────────────── */}
        <div className={styles.waypointCard}>
          <span className={styles.waypointLabel}>다음 거점</span>
          <div className={styles.waypointNameRow}>
            <p className={styles.waypointName}>{nextPlace.ko.name}</p>
            <button className={styles.arrowBtn} onClick={handleNext}>
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 26 26" fill="none">
                <path d="M7.58301 7.58203H18.4163V18.4154" stroke="#4A5580" strokeWidth="2.16667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.58301 18.4154L18.4163 7.58203" stroke="#4A5580" strokeWidth="2.16667" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className={styles.waypointDist}>약 {walkMinDiff}분 · {distM}m 직진</p>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── 장소 정보 카드 ──────────────────── */}
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
              <g clipPath="url(#clip0_832_121b)">
                <path d="M4.25 15.5846V2.83464C4.25 2.45891 4.39926 2.09858 4.66493 1.8329C4.93061 1.56722 5.29094 1.41797 5.66667 1.41797H11.3333C11.7091 1.41797 12.0694 1.56722 12.3351 1.8329C12.6007 2.09858 12.75 2.45891 12.75 2.83464V15.5846H4.25Z" stroke="#4A5580" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.25033 8.5H2.83366C2.45794 8.5 2.0976 8.64926 1.83192 8.91493C1.56625 9.18061 1.41699 9.54094 1.41699 9.91667V14.1667C1.41699 14.5424 1.56625 14.9027 1.83192 15.1684C2.0976 15.4341 2.45794 15.5833 2.83366 15.5833H4.25033" stroke="#4A5580" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12.75 6.375H14.1667C14.5424 6.375 14.9027 6.52426 15.1684 6.78993C15.4341 7.05561 15.5833 7.41594 15.5833 7.79167V14.1667C15.5833 14.5424 15.4341 14.9027 15.1684 15.1684C14.9027 15.4341 14.5424 15.5833 14.1667 15.5833H12.75" stroke="#4A5580" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.08301 4.25H9.91634" stroke="#4A5580" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.08301 7.08203H9.91634" stroke="#4A5580" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.08301 9.91797H9.91634" stroke="#4A5580" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7.08301 12.75H9.91634" stroke="#4A5580" strokeWidth="1.41667" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs><clipPath id="clip0_832_121b"><rect width="17" height="17" fill="white"/></clipPath></defs>
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
            <svg viewBox="0 0 20 20" fill="none" stroke="#4A5580" strokeWidth="1.8" width="18" height="18">
              <rect x="5" y="4" width="3.5" height="12" rx="1"/>
              <rect x="11.5" y="4" width="3.5" height="12" rx="1"/>
            </svg>
            일시정지
          </button>
          <button className={styles.controlBtn}>
            <svg viewBox="0 0 20 20" fill="none" stroke="#4A5580" strokeWidth="1.8" width="18" height="18">
              <path d="M1 5l6-3 6 3 6-3v13l-6 3-6-3-6 3V5z"/>
              <path d="M7 2v13M13 5v13"/>
            </svg>
            전체 지도
          </button>
        </div>

        {/* ── 완료 버튼 ────────────────────────── */}
        <button className={styles.completeBtn} onClick={onComplete}>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <g clipPath="url(#clip_flag)">
              <path d="M2.5 9.375C2.5 9.375 3.125 8.75 5 8.75C6.875 8.75 8.125 10 10 10C11.875 10 12.5 9.375 12.5 9.375V1.875C12.5 1.875 11.875 2.5 10 2.5C8.125 2.5 6.875 1.25 5 1.25C3.125 1.25 2.5 1.875 2.5 1.875V9.375Z" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2.5 13.75V9.375" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <defs><clipPath id="clip_flag"><rect width="15" height="15" fill="white"/></clipPath></defs>
          </svg>
          산책 완료하기
        </button>

        <div className={styles.navSpacer} />
      </div>

      <BottomNav active="course" onTab={onTab} />
    </div>
  )
}
