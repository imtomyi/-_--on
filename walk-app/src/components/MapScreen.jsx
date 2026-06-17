import { useState } from 'react'
import { courses } from '../data/courses'
import MapLibreMap from './MapLibreMap'
import BottomNav from './BottomNav'
import styles from './MapScreen.module.css'

const FILTERS = ['전체', '공방', '명소', '카페', '문화재']

const placeTypeFilter = {
  '공방':   'craft',
  '맛집':   'food',
}

export default function MapScreen({ onSelectCourse, onTab }) {
  const [activeFilter, setActiveFilter] = useState('전체')
  const [selectedPlace, setSelectedPlace] = useState(null)

  const allPlaces = courses.flatMap(c =>
    c.places.map(p => ({ ...p, courseId: c.id, courseTitle: c.ko.title }))
  )

  const filteredPlaces = activeFilter === '전체'
    ? allPlaces
    : allPlaces.filter(p => p.type === (placeTypeFilter[activeFilter] ?? activeFilter.toLowerCase()))

  const relatedCourses = selectedPlace
    ? courses.filter(c => c.places.some(p => p.ko.name === selectedPlace.ko.name))
    : []

  const firstPlace = allPlaces[0]
  const mapCourse = courses[0]

  return (
    <div className={styles.wrap}>

      {/* 헤더 */}
      <div className={styles.header}>
        <h2 className={styles.title}>산책 스팟</h2>
        <div className={styles.filterBar}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 지도 */}
      <div className={styles.mapArea}>
        <MapLibreMap
          course={{ ...mapCourse, heatmapPath: [] }}
          activeIdx={0}
          onMarkerClick={(idx) => setSelectedPlace(mapCourse.places[idx])}
          sheetHeight={0}
          pinStyle="drop"
        />
      </div>

      {/* 장소 선택 바텀시트 */}
      {selectedPlace && (
        <div className={styles.sheet}>
          <div className={styles.sheetHandle} />
          <div className={styles.sheetHeader}>
            <div>
              <h3 className={styles.sheetTitle}>{selectedPlace.ko.name}</h3>
              <p className={styles.sheetDesc}>{selectedPlace.ko.desc}</p>
            </div>
            <button className={styles.closeBtn} onClick={() => setSelectedPlace(null)}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M5 5l10 10M15 5L5 15"/>
              </svg>
            </button>
          </div>
          {relatedCourses.length > 0 && (
            <>
              <p className={styles.sheetSubtitle}>여기서 출발한 코스</p>
              {relatedCourses.map(c => (
                <button key={c.id} className={styles.courseRow} onClick={() => onSelectCourse(c)}>
                  <div className={styles.courseRowInfo}>
                    <span className={styles.courseRowName}>{c.ko.title}</span>
                    <span className={styles.courseRowMeta}>{c.ko.duration} · {c.distance} · 거점 {c.places.length}</span>
                  </div>
                  <div className={styles.courseRowBtn}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <path d="M4 8h8M8 4l4 4-4 4"/>
                    </svg>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}

      <BottomNav active="map" onTab={onTab} />
    </div>
  )
}
