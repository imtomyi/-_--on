import { useState, useMemo, useRef } from 'react'
import { courses } from '../data/courses'
import MapLibreMap from './MapLibreMap'
import BottomNav from './BottomNav'
import styles from './MapScreen.module.css'

const FILTERS = ['전체', '공방', '명소', '카페', '문화재']

const placeTypeFilter = {
  '공방': 'craft',
  '맛집': 'food',
}

const placeTypeLabel = {
  start: '출발지', end: '도착지', craft: '공방', landmark: '명소', food: '맛집'
}

export default function MapScreen({ onSelectCourse, onTab }) {
  const [activeFilter, setActiveFilter] = useState('전체')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [isClosing, setIsClosing] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStartY = useRef(null)

  const closeSheet = () => {
    setIsClosing(true)
    setTimeout(() => { setSelectedPlace(null); setIsClosing(false) }, 240)
  }

  const onHandlePointerDown = (e) => {
    dragStartY.current = e.clientY
    setIsDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onHandlePointerMove = (e) => {
    if (dragStartY.current === null) return
    const delta = e.clientY - dragStartY.current
    if (delta > 0) setDragOffset(delta)
  }
  const onHandlePointerUp = () => {
    dragStartY.current = null
    setIsDragging(false)
    if (dragOffset > 90) {
      setDragOffset(window.innerHeight)
      setTimeout(() => { setSelectedPlace(null); setDragOffset(0) }, 320)
    } else {
      setDragOffset(0)
    }
  }

  const allPlaces = courses.flatMap(c =>
    c.places.map(p => ({ ...p, courseId: c.id, courseTitle: c.ko.title }))
  )

  const relatedCourses = selectedPlace
    ? courses.filter(c => c.places.some(p => p.ko.name === selectedPlace.ko.name))
    : []

  const mapCourse = courses[0]
  const stableMapCourse = useMemo(() => ({ ...mapCourse, heatmapPath: [] }), [])

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
          course={stableMapCourse}
          activeIdx={0}
          onMarkerClick={(idx) => setSelectedPlace(mapCourse.places[idx])}
          sheetHeight={0}
          pinStyle="drop"
          initZoom={16}
        />
      </div>

      {/* 바텀시트 */}
      {selectedPlace && (
        <div
          className={`${styles.sheet} ${isClosing ? styles.sheetClosing : ''}`}
          style={{
            transform: `translateY(${dragOffset}px)`,
            transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          <div
            className={styles.sheetHandle}
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUp}
          />

          {/* 장소 헤더 */}
          <div className={styles.sheetHeader}>
            <div className={styles.sheetThumb} />
            <div className={styles.sheetInfo}>
              <div className={styles.sheetNameRow}>
                <span className={styles.sheetTypeBadge}>{selectedPlace.category ?? placeTypeLabel[selectedPlace.type]}</span>
                <h3 className={styles.sheetTitle}>{selectedPlace.ko.name}</h3>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={closeSheet}>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" width="16" height="16">
                <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* 관련 코스 */}
          {relatedCourses.length > 0 && (
            <>
              <div className={styles.sheetSubtitleRow}>
                <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                  <path d="M14 2L9 14L7 9L2 7L14 2Z" stroke="#4A5580" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className={styles.sheetSubtitle}>여기서 출발하는 코스</span>
              </div>
              {relatedCourses.map((c, i) => (
                <button
                  key={c.id}
                  className={`${styles.courseRow} ${i === 0 ? styles.courseRowActive : ''}`}
                  onClick={() => onSelectCourse(c)}
                >
                  <span className={`${styles.courseDot} ${i === 0 ? styles.courseDotRed : styles.courseDotNavy}`} />
                  <div className={styles.courseRowInfo}>
                    <span className={styles.courseRowName}>{c.ko.title}</span>
                    <div className={styles.courseRowMeta}>
                      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" width="11" height="11" strokeLinecap="round">
                        <circle cx="7" cy="7" r="5.5"/>
                        <path d="M7 4.5V7l1.5 1"/>
                      </svg>
                      <span>{c.ko.duration} · {c.distance} · 거점 {c.places.length}</span>
                    </div>
                  </div>
                  <div className={`${styles.courseRowBtn} ${i === 0 ? styles.courseRowBtnRed : styles.courseRowBtnNavy}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.91699 7H11.0837" stroke="white" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 2.91602L11.0833 6.99935L7 11.0827" stroke="white" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
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
