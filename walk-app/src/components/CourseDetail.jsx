import { useState } from 'react'
import NuruGauge from './NuruGauge'
import KakaoMap from './KakaoMap'
import MapLibreMap, { MAP_STYLES } from './MapLibreMap'
import styles from './CourseDetail.module.css'

const placeTypeLabel = {
  start:    '출발',
  end:      '도착',
  craft:    '공방',
  landmark: '명소',
  food:     '맛집',
}

const placeTypeIcon = {
  start:    '🍶',
  end:      '🍶',
  craft:    '🎨',
  landmark: '🏯',
  food:     '🍜',
}

export default function CourseDetail({ course, onBack }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [mapMode, setMapMode] = useState('aquarelle')

  return (
    <div className={styles.wrap}>

      {/* ── 상단: 장소 리스트 ── */}
      <div className={styles.cardArea}>
        {/* 1행+2행: 뒤로 + 코스명 + 스타일 토글 (sticky) */}
        <div className={styles.stickyHeader}>
          <div className={styles.topBar}>
            <button className={styles.back} onClick={onBack}>←</button>
            <div className={styles.headerCenter}>
              <span className={styles.courseTitle}>{course.title}</span>
              <span className={styles.courseMeta}>{course.distance} · {course.duration}</span>
            </div>
          </div>
          <div className={styles.styleBar}>
            <button
              className={`${styles.toggleBtn} ${mapMode === 'kakao' ? styles.toggleActive : ''}`}
              onClick={() => setMapMode('kakao')}
            >카카오</button>
            {Object.entries(MAP_STYLES).map(([key, val]) => (
              <button
                key={key}
                className={`${styles.toggleBtn} ${mapMode === key ? styles.toggleActive : ''}`}
                onClick={() => setMapMode(key)}
              >{val.label}</button>
            ))}
          </div>
        </div>

        {/* 3행: 타임라인 장소 리스트 */}
        <ul className={styles.placeList}>
          {course.places.map((place, idx) => (
            <li key={place.id} className={styles.placeItem}>
              <button
                className={`${styles.placeCard} ${idx === activeIdx ? styles.active : ''}`}
                onClick={() => setActiveIdx(idx)}
              >
                <div className={`${styles.placeIcon} ${(place.type === 'start' || place.type === 'end') ? styles.iconGold : ''}`}>
                  {placeTypeIcon[place.type]}
                </div>
                <div className={styles.placeInfo}>
                  <div className={styles.placeName}>{place.name}</div>
                  <div className={styles.placeDesc}>{place.desc}</div>
                </div>
                <span className={`${styles.typeBadge} ${styles['badge_' + place.type]}`}>
                  {placeTypeLabel[place.type]}
                </span>
              </button>
              {idx < course.places.length - 1 && (
                <div className={styles.connector}>
                  <div className={styles.connectorLine} />
                  <span className={styles.connectorTime}>
                    +{course.places[idx + 1].walkMin - place.walkMin}분 도보
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* ── 지도 (오버레이 없음) ── */}
      <div className={styles.mapArea}>
        {mapMode === 'kakao'
          ? <KakaoMap    course={course} activeIdx={activeIdx} onMarkerClick={setActiveIdx} />
          : <MapLibreMap course={course} activeIdx={activeIdx} onMarkerClick={setActiveIdx} mapStyle={mapMode} />
        }
      </div>

      {/* ── 하단: 누룩 게이지 + CTA ── */}
      <div className={styles.bottom}>
        <NuruGauge totalDistance={parseFloat(course.distance)} />
        <a
          className={styles.ctaBtn}
          href="https://example.com/gyebo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>막걸리 계보 도착!</span>
          <span className={styles.ctaRight}>오늘의 막걸리 보기 →</span>
        </a>
      </div>

    </div>
  )
}
