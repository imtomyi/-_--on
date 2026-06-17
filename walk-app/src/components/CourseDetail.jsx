import { useState } from 'react'
import MapLibreMap from './MapLibreMap'
import BottomNav from './BottomNav'
import styles from './CourseDetail.module.css'

const placeTypeLabel = {
  start:    '출발',
  end:      '도착',
  craft:    '공방',
  landmark: '명소',
  food:     '맛집',
}

export default function CourseDetail({ course, onBack, onStartWalk, onTab }) {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div className={styles.wrap}>
      <div className={styles.inner}>

        {/* ── 코스 헤더 ─────────────────────── */}
        <div className={styles.header}>
          <button className={styles.backBtn} onClick={onBack}>
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
              <path d="M12 4l-6 6 6 6"/>
            </svg>
          </button>
          <p className={styles.eyebrow}>{course.ko.subtitle}</p>
          <h1 className={styles.title}>{course.ko.title}</h1>
          <div className={styles.metaRow}>
            <span className={styles.metaPill}>{course.ko.duration}</span>
            <span className={styles.metaPill}>{course.distance}</span>
            <span className={styles.metaPill}>거점 {course.places.length}</span>
          </div>
        </div>

        {/* ── 지도 ──────────────────────────── */}
        <div className={styles.mapArea}>
          <MapLibreMap
            course={course}
            activeIdx={activeIdx}
            onMarkerClick={setActiveIdx}
            sheetHeight={0}
          />
          <div className={styles.progressPill}>
            {course.places[activeIdx]?.ko.name}
          </div>
        </div>

        {/* ── CTA ───────────────────────────── */}
        <div className={styles.ctaWrap}>
          <button className={styles.ctaBtn} onClick={onStartWalk}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3.5 1.75L11.6667 7L3.5 12.25V1.75Z" fill="white" stroke="white" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            이 코스로 산책 시작하기
          </button>
        </div>

        {/* ── 웨이포인트 목록 ────────────────── */}
        <ul className={styles.placeList}>
          {course.places.map((place, idx) => {
            const isRed   = place.type === 'start' || place.type === 'end'
            const isNavy  = place.type === 'landmark'
            const isLast = idx === course.places.length - 1
            const walkDiff = !isLast
              ? course.places[idx + 1].walkMin - place.walkMin
              : null
            return (
              <li key={place.id} className={styles.placeItem}>
                {/* 왼쪽: 번호 원 + 연결선 */}
                <div className={styles.badgeCol}>
                  <div className={`${styles.numBadge} ${isRed ? styles.numBadgeRed : isNavy ? styles.numBadgeNavy : styles.numBadgeGray}`}>
                    {idx + 1}
                  </div>
                  {!isLast && <div className={styles.connLine} />}
                </div>

                {/* 오른쪽: 텍스트 + 도보 시간 */}
                <div className={styles.rightCol}>
                  <button
                    className={`${styles.placeCard} ${idx === activeIdx ? styles.active : ''}`}
                    onClick={() => setActiveIdx(idx)}
                  >
                    <div className={styles.placeInfo}>
                      <span className={styles.placeName}>{place.ko.name}</span>
                      <span className={styles.placeDesc}>{place.ko.desc}</span>
                    </div>
                    <span className={`${styles.typeBadge} ${styles['type_' + place.type]}`}>
                      {placeTypeLabel[place.type]}
                    </span>
                  </button>
                  {walkDiff !== null && (
                    <span className={styles.connTime}>+{walkDiff}분 도보</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>

        <div className={styles.navSpacer} />
      </div>

      <BottomNav active="course" onTab={onTab} />
    </div>
  )
}
